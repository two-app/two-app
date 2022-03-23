import {ContentFiles, File} from './Compression';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import {v4 as uuid} from 'uuid';

export const compressImage = async (
  input: string,
  width: number,
  height: number,
): Promise<ContentFiles> => {
  const image = await RNFS.stat(input);
  console.log(`Initial ${width}x${height} - ${image.size} bytes`);

  const [thumb, disp, gall] = await Promise.all([
    thumbnail(input),
    display(input),
    gallery(input),
  ]);

  return {
    contentId: uuid(),
    contentType: 'image',
    initialWidth: width,
    initialHeight: height,
    initialSize: image.size,
    thumbnail: thumb,
    display: disp,
    gallery: gall,
  };
};

const thumbnail = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.jpeg';
  const sized = await resize(input, output, 1280, 720, 'cover');
  console.log(`Thumbnail ${sized.width}x${sized.height} - ${sized.size} bytes`);
  return sized;
};

const display = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.jpeg';
  const sized = await resize(input, output, 1920, 1080, 'cover');
  console.log(`Display ${sized.width}x${sized.height} - ${sized.size} bytes`);
  return sized;
};

const gallery = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.jpeg';
  const sized = await resize(input, output, 2560, 1440, 'contain');
  console.log(`Gallery ${sized.width}x${sized.height} - ${sized.size} bytes`);
  return sized;
};

const resize = async (
  input: string,
  output: string,
  x: number,
  y: number,
  mode: 'cover' | 'contain',
): Promise<File> => {
  const {width, height, uri, size} = await ImageResizer.createResizedImage(
    input,
    x,
    y,
    'JPEG',
    80,
    undefined,
    output,
    undefined,
    {mode, onlyScaleDown: true},
  );

  return {
    width,
    height,
    path: uri,
    mime: 'image/jpeg',
    size,
    duration: undefined,
  };
};
