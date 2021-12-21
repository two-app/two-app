import {FFmpegKit} from 'ffmpeg-kit-react-native';
import ImagePicker, {
  Image,
  ImageOrVideo,
  Video,
} from 'react-native-image-crop-picker';
import uuidv4 from 'uuidv4';
import RNFS from 'react-native-fs';
import { ContentType } from './ContentModels';

export type File = {
  path: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  // video properties
  duration?: number;
};

export type ContentFiles = {
  thumbnail: File;
  display: File;
  gallery: File;
  contentType: ContentType,
  initialWidth: number;
  initialHeight: number;
  initialSize: number;
};

export type PickedContent = Image & {
  contentId: string;
};

const CRF = 24;
const FPS = 60;

const compressVideoCmd = (
  path: string,
  newPath: string,
  scaleWidth: string = '-1',
  scaleHeight: string = '-1',
): string =>
  [
    '-i',
    path,
    // Configure FPS at 60
    '-r',
    FPS.toString(),
    // Codec Type: H264
    '-c:v',
    'libx264',
    // Constant Rate Factor
    '-crf',
    CRF.toString(),
    // Scale width/height
    '-vf',
    `"scale='${scaleWidth}':'${scaleHeight}'"`,
    // output
    newPath,
  ].reduce((l, r) => l + ' ' + r, '');

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
        return content as any as File;
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

type Compression = {
  path: string;
  width: number;
  height: number;
};

const compressVideo = async (
  originalPath: string,
  originalWidth: number,
  originalHeight: number,
): Promise<Compression> => {
  const path = RNFS.TemporaryDirectoryPath + uuidv4() + '.mp4';
  const [width, height] = scaleVideo(originalWidth, originalHeight);
  const cmd = compressVideoCmd(
    originalPath,
    path,
    width.toString(),
    height.toString(),
  );

  console.log(
    `Resized ${originalWidth}x${originalHeight} -> ${width}x${height}`,
  );
  console.log(`Executing ffmpeg command: ${cmd}`);

  return new Promise<Compression>((resolve, reject) => {
    FFmpegKit.executeAsync(cmd, async session => {
      const code = await session.getReturnCode();
      const trace = await session.getFailStackTrace();

      if (code.isValueSuccess()) {
        resolve({path, width, height});
      } else {
        reject('Failed to run FFMPEG: ' + trace);
      }
    });
  });
};

const scaleVideo = (width: number, height: number) => {
  if (width <= 720 && height <= 720) return [width, height];

  const isLandscape = width > height;
  const [maxWidth, maxHeight] = isLandscape ? [1080, 720] : [720, 1080];

  const ratioX = maxWidth / width;
  const ratioY = maxHeight / height;
  const ratio = Math.min(ratioX, ratioY);

  return [width * ratio, height * ratio];
};
