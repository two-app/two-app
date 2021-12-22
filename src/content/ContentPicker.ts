import {FFmpegKit} from 'ffmpeg-kit-react-native';
import ImagePicker, {
  Image,
  ImageOrVideo,
  Video,
} from 'react-native-image-crop-picker';
import uuidv4 from 'uuidv4';
import RNFS from 'react-native-fs';
import {ContentType} from './ContentModels';
import {compressVideo} from './compression/VideoCompression';
import { compressImage } from './compression/ImageCompression';
import { File } from './compression/Compression';

export type PickedContent = Image & {
  contentId: string;
};

export class ContentPicker {
  static open = async (
    onClose: () => void,
    onPickedContent: (content: PickedContent[]) => void,
  ) => {
    const picked: Image | Image[] = await ImagePicker.openPicker({
      multiple: true,
      compressImageMaxWidth: 2400,
      compressImageMaxHeight: 2400,
    });

    const rawContent = Array.isArray(picked) ? picked : [picked];

    const contentPromises = rawContent.map(async (content: ImageOrVideo) => {
      if (content.mime.startsWith('image')) {
        return compressImage(content.path, content.width, content.height);
      } else {
        const {path, width, height} = await compressVideo(
          content.path,
          content.width,
          content.height,
        );

        const {size} = await RNFS.stat(path);

        return {
          path,
          mime: 'video/mp4',
          width,
          height,
          size: parseInt(size, 10),
          duration: (content as Video).duration,
        } as File;
      }
    });

    const content: File[] = await Promise.all(contentPromises);
    console.log(content);
  };
}
