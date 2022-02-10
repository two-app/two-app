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
    initialSize: parseInt(image.size, 10),
    thumbnail: thumb,
    display: disp,
    gallery: gall,
  };
};

const thumbnail = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.png';
  const sized = await resize(input, output, 100, 100, 'cover');
  console.log(`Thumbnail ${sized.width}x${sized.height} - ${sized.size} bytes`);
  return sized;
};

const display = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.png';
  const sized = await resize(input, output, 400, 400, 'cover');
  console.log(`Thumbnail ${sized.width}x${sized.height} - ${sized.size} bytes`);
  return sized;
};

const gallery = async (input: string): Promise<File> => {
  const output = RNFS.TemporaryDirectoryPath + uuid() + '.png';
  const sized = await resize(input, output, 1080, 720, 'contain');
  console.log(`Thumbnail ${sized.width}x${sized.height} - ${sized.size} bytes`);
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
    'PNG',
    100,
    undefined,
    output,
    undefined,
    {mode, onlyScaleDown: true},
  );

  console.log(`${width}x${height} - ${size}`);

  return {
    width,
    height,
    path: uri,
    mime: 'image/png',
    size,
    duration: undefined,
  };
};
