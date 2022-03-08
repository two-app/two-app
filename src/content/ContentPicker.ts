import ImagePicker, {
  Image,
  ImageOrVideo,
  Video,
} from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {compressVideo} from './compression/VideoCompression';
import {compressImage} from './compression/ImageCompression';
import {ContentFiles, File} from './compression/Compression';
import {v4 as uuid} from 'uuid';

export class ContentPicker {
  static open = async (): Promise<ContentFiles[]> => {
    const selectedContent: Image[] = await selectContent();
    return Promise.all(selectedContent.map(compressContent));
  };
}

const selectContent = async (): Promise<Image[]> => {
  const content: Image | Image[] = await ImagePicker.openPicker({
    multiple: true,
  });

  return Array.isArray(content) ? content : [content];
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
    contentId: uuid(),
    thumbnail,
    display,
    gallery,
    contentType: 'video',
    initialWidth: content.height,
    initialHeight: content.height,
    initialSize: content.size,
  };
};
