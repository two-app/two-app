import ImagePicker, {
  Image,
  ImageOrVideo,
  Video,
} from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {compressVideo, extractFrame} from './compression/VideoCompression';
import {compressImage} from './compression/ImageCompression';
import {ContentFiles, File} from './compression/Compression';
import {Alert, Linking} from 'react-native';
import {v4 as uuid} from 'uuid';
import {InProgressUpload, useUploadStore} from './UploadStore';
import ContentService, {setDisplay} from './ContentService';
import {Content} from './ContentModels';
import {useContentStore} from './ContentStore';
import {getMemory} from '../memories/MemoryService';
import {useMemoryStore} from '../memories/MemoryStore';

export class ContentPicker {
  static open = async (
    mid: string,
    setDisplayImage: boolean,
  ): Promise<void> => {
    const selectedContent: Image[] = await selectContent();

    // Generate content IDs for each
    const identifiedContent = selectedContent.map(content => ({
      ...content,
      contentId: uuid(),
    }));

    // Store the files in the upload store in processing state
    const uploadStore = useUploadStore.getState();
    const contentStore = useContentStore.getState();
    const memoryStore = useMemoryStore.getState();

    const uploads: Record<string, InProgressUpload> = {};

    for (const content of identifiedContent) {
      const path = await getThumbnailURI(content);
      uploads[content.contentId] = {
        fileURI: path,
        status: 'processing',
      };
    }

    uploadStore.setUploads(mid, uploads);

    // Compress the content, then upload
    const promises = identifiedContent.map(async raw => {
      const {contentId} = raw;
      const compressed = await compressContent(raw);
      const controller = new AbortController();
      uploadStore.setStatus(contentId, 'uploading', controller);

      try {
        const content: Content = await ContentService.uploadContent(
          mid,
          contentId,
          compressed,
          controller,
        );

        contentStore.add(mid, content);
        uploadStore.setStatus(contentId, 'succeeded');
      } catch {
        uploadStore.setStatus(contentId, 'failed');
      }
    });

    await Promise.all(promises);

    if (setDisplayImage && identifiedContent[0] != null) {
      const memory = await setDisplay(mid, identifiedContent[0].contentId);
      memoryStore.update(memory);
    } else {
      const memory = await getMemory(mid);
      memoryStore.update(memory);
    }
  };
}

const selectContent = async (): Promise<Image[]> => {
  return ImagePicker.openPicker({
    multiple: true,
    maxFiles: 15,
    compressVideoPreset: '1280x720',
  })
    .then(content => (Array.isArray(content) ? content : [content]))
    .catch(({message}: Error) => {
      if (message.includes('User did not grant library permission')) {
        Alert.alert(
          'Photo Permissions',
          'Please give Two permission to access your photos to upload.',
          [
            {
              text: 'Open Settings',
              style: 'default',
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: 'No thanks',
              style: 'cancel',
            },
          ],
        );
      }

      return [];
    });
};

const getThumbnailURI = async (content: ImageOrVideo): Promise<string> => {
  const {mime, path} = content;
  if (mime.startsWith('image')) {
    return path;
  } else if (mime.startsWith('video')) {
    return extractFrame(path);
  } else {
    return Promise.reject('Unsupported file format ' + mime);
  }
};

const compressContent = async (
  content: ImageOrVideo,
): Promise<ContentFiles> => {
  const {mime} = content;
  if (mime.startsWith('image')) {
    return compressImage(content.path, content.width, content.height);
  } else if (mime.startsWith('video')) {
    // @ts-ignore we can refine the type to Video based on the mime check
    return compressVideoContent(content);
  } else {
    throw new Error(`User selected invalid mime '${mime}'`);
  }
};

const compressVideoContent = async (content: Video): Promise<ContentFiles> => {
  const [{path, width, height}, framePath] = await compressVideo(
    content.path,
    content.width,
    content.height,
  );

  const {size} = await RNFS.stat(path);

  const gallery = {
    path,
    mime: 'video/mp4',
    width,
    height,
    size,
    duration: (content as Video).duration,
  } as File;

  const {thumbnail, display} = await compressImage(
    framePath,
    content.width,
    content.height,
  );

  return {
    thumbnail,
    display,
    gallery,
    contentType: 'video',
    initialWidth: content.height,
    initialHeight: content.height,
    initialSize: content.size,
  };
};
