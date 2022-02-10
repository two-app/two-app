import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {v4 as uuid} from 'uuid';
import RNFS from 'react-native-fs';
import {Compression, scaleByOrientation} from './Compression';

/**
 * @returns a tuple of the video compression and path to the extracted frame
 */
export const compressVideo = async (
  originalPath: string,
  ogWidth: number,
  ogHeight: number,
): Promise<[Compression, string]> => {
  const path = RNFS.TemporaryDirectoryPath + uuid() + '.mp4';
  const framePath = RNFS.TemporaryDirectoryPath + uuid() + '.png';

  const [width, height] = scaleByOrientation(ogWidth, ogHeight, 1080, 720);
  console.log(`Scaled video ${ogWidth}x${ogHeight} -> ${width}x${height}`);

  const frame = extractFrameCmd(originalPath, framePath);
  const compress = compressVideoCmd(
    originalPath,
    path,
    width.toString(),
    height.toString(),
  );

  await execute(compress);
  await execute(frame);

  return [{width, height, path}, framePath];
};

const execute = (command: string): Promise<void> => {
  console.log(`Executing ffmpeg command: ${command}`);
  return new Promise<void>((resolve, reject) => {
    FFmpegKit.executeAsync(command, async session => {
      const code = await session.getReturnCode();
      const trace = await session.getFailStackTrace();

      if (code.isValueSuccess()) {
        resolve();
      } else {
        reject('Failed to run FFMPEG command: ' + command + '\n' + trace);
      }
    });
  });
};

const CRF = 24;
const FPS = 60;

const compressVideoCmd = (
  input: string,
  output: string,
  scaleWidth: string = '-1',
  scaleHeight: string = '-1',
): string =>
  [
    '-i',
    input,
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
    output,
  ].reduce((l, r) => l + ' ' + r, '');

const extractFrameCmd = (input: string, output: string): string =>
  [
    '-i',
    input,
    // wind to 1s
    '-ss',
    '00:00:01.000',
    // take first frame
    '-vframes',
    '1',
    // output
    output,
  ].reduce((l, r) => l + ' ' + r, '');