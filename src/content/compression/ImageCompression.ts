import {ContentFiles, File} from './Compression';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import uuidv4 from 'uuidv4';

export const compressImage = async (
  input: string,
  width: number,
  height: number
): Promise<ContentFiles> => {
    const image = await RNFS.stat(input);

    const [thumb, disp, gall] = await Promise.all([
        thumbnail(input),
        display(input),
        gallery(input)
    ]);

    return {
        contentType: 'image',
        initialWidth: width,
        initialHeight: height,
        initialSize: parseInt(image.size, 10),
        thumbnail: thumb,
        display: disp,
        gallery: gall
    }
};

const thumbnail = async (
  input: string
): Promise<File> => {
    const output = RNFS.TemporaryDirectoryPath + uuidv4() + '.png';
    return resize(input, output, 100, 100, 'cover');
};

const display = async (
  input: string
): Promise<File> => {
    const output = RNFS.TemporaryDirectoryPath + uuidv4() + '.png';
    return resize(input, output, 400, 400, 'cover');
};

const gallery = async (
  input: string
): Promise<File> => {
    const output = RNFS.TemporaryDirectoryPath + uuidv4() + '.png';
    return resize(input, output, 2400, 2400, 'contain');
};

const resize = async (
    input: string,
    output: string,
    x: number,
    y: number,
    mode: 'cover' | 'contain'
): Promise<File> => {
    const {width, height, uri, size} = await ImageResizer.createResizedImage(
        input, x, y, 'PNG', 100, undefined, output, undefined, {mode}
    );
    return {
        width,
        height,
        path: uri,
        mime: 'image/png',
        size,
        duration: undefined
    }
}