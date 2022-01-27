import ImagePicker, {
  Image,
  ImageOrVideo,
  Video,
} from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {compressVideo} from './compression/VideoCompression';
import {compressImage} from './compression/ImageCompression';
import {ContentFiles} from './compression/Compression';

export type PickedContent = Image & {
  contentId: string;
};

export class ContentPicker {
  static open = async (): Promise<ContentFiles[]> => {
    const selectedContent: Image[] = await selectContent();
    const compressionPromises: Promise<ContentFiles>[] =
      selectedContent.map(compressContent);
    return Promise.all(compressionPromises);
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
    console.log('Compressing image:');
    const x = await compressImage(content.path, content.width, content.height);
    console.log(x);
    return x;
  } else if (mime.startsWith('video')) {
    return compressVideoContent(content);
  } else {
    throw new Error(`User selected invalid mime '${mime}'`);
  }
};

const compressVideoContent = async (content: Video): Promise<ContentFiles> => {
  // TODO compress a video frame into thumbnail + display picture
  const {path, width, height} = await compressVideo(
    content.path,
    content.width,
    content.height,
  );

  const {size} = await RNFS.stat(path);

  const file = {
    path,
    mime: 'video/mp4',
    width,
    height,
    size: parseInt(size, 10),
    duration: (content as Video).duration,
  } as File;
};
