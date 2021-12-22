import {scaleByOrientation} from '../../../src/content/compression/Compression';

describe('Compression', () => {
  describe('scaleByOrientation', () => {
    test('square', () => {
      const [width, height, aspect] = [100, 100, 100];

      const [x, y] = scaleByOrientation(width, height, aspect, aspect);

      expect(x).toEqual(100);
      expect(y).toEqual(100);
    });

    test('landscape', () => {
      const [width, height, aspectLong, aspectShort] = [2160, 1440, 1080, 720];

      const [x, y] = scaleByOrientation(width, height, aspectLong, aspectShort);

      expect(x).toEqual(1080);
      expect(y).toEqual(720);
    });

    test('portrait', () => {
      const [width, height, aspectLong, aspectShort] = [1440, 2160, 1080, 720];

      const [x, y] = scaleByOrientation(width, height, aspectLong, aspectShort);

      expect(x).toEqual(720);
      expect(y).toEqual(1080);
    });
  });
});
