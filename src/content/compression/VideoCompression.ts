import {FFmpegKit, FFprobeKit} from 'ffmpeg-kit-react-native';
import {v4 as uuid} from 'uuid';
import RNFS from 'react-native-fs';
import {Compression} from './Compression';

/**
 * @returns a tuple of the video compression and path to the extracted frame
 */
export const compressVideo = async (
  originalPath: string,
  ogWidth: number,
  ogHeight: number,
): Promise<[Compression, string]> => {
  const path = RNFS.TemporaryDirectoryPath + uuid() + '.mp4';
  const framePath = RNFS.TemporaryDirectoryPath + uuid() + '.jpeg';

  const frame = extractFrameCmd(originalPath, framePath);
  const compress = compressVideoCmd(originalPath, path, ogHeight > ogWidth);

  const getDimensions = getDimensionsCmd(path);

  await execute(compress);
  await execute(frame);

  const dimensionString = await executeProbe(getDimensions);
  const [width, height] = dimensionString
    .trim()
    .split('x')
    .map(s => parseInt(s));

  return [{width, height, path}, framePath];
};

const _exec = (
  command: string,
  ffmpegCls: typeof FFmpegKit | typeof FFprobeKit,
) => {
  return new Promise<string>((resolve, reject) => {
    ffmpegCls.executeAsync(command, async session => {
      const code = await session.getReturnCode();
      const trace = await session.getFailStackTrace();
      const output = await session.getLogsAsString();

      if (code.isValueSuccess()) {
        resolve(output);
      } else {
        reject('Failed to run FFMPEG probe: ' + command + '\n' + trace);
      }
    });
  });
};

const execute = (command: string): Promise<string> => {
  console.log(`Executing ffmpeg command: ${command}`);
  return _exec(command, FFmpegKit);
};

const executeProbe = (command: string): Promise<string> => {
  console.log(`Executing ffmpeg probe: ${command}`);
  return _exec(command, FFprobeKit);
};

const FPS = 60;

const compressVideoCmd = (
  input: string,
  output: string,
  vertical: boolean,
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
    // Scale width/height
    '-vf',
    vertical ? 'scale=-2:2560' : 'scale=2560:-2',
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

const getDimensionsCmd = (input: string): string =>
  [
    '-v',
    'error',
    '-select_streams',
    'v',
    '-show_entries',
    'stream=width,height',
    '-of',
    'csv=p=0:s=x',
    input,
  ].reduce((l, r) => l + ' ' + r, '');
