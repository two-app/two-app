import { ContentType } from "../ContentModels";

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
  contentType: ContentType;
  initialWidth: number;
  initialHeight: number;
  initialSize: number;
};

export type Compression = {
  path: string;
  width: number;
  height: number;
};

/**
 * Scales to fit, maintaining the aspect ratio, to a width/height combination suited to the
 * orientation of the rectangle under question.
 * See tests for examples.
 * @param aspectLong the maximum 'long' side of the rectangle
 * @param aspectShort the maximum 'short' side of the rectangle
 * @returns the new width + height as a tuple
 */
export const scaleByOrientation = (
  width: number,
  height: number,
  aspectLong: number,
  aspectShort: number,
): [number, number] => {
  if (width <= aspectShort && height <= aspectShort) return [width, height];
  const isLandscape = width > height;
  const [maxWidth, maxHeight] = isLandscape
    ? [aspectLong, aspectShort]
    : [aspectShort, aspectLong];

  const ratioX = maxWidth / width;
  const ratioY = maxHeight / height;
  const ratio = Math.min(ratioX, ratioY);

  return [width * ratio, height * ratio];
};
