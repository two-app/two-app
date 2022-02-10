import {v4 as uuid} from 'uuid';
import {ContentFiles, File} from '../../src/content/compression/Compression';
import {
  Content,
  SizedContent,
  SizedContentName,
} from '../../src/content/ContentModels';

export const arbFile = (): File => ({
  mime: 'image/png',
  path: '/here/is/some/file.png',
  width: 1200,
  height: 1200,
  size: 3000,
  duration: undefined,
});

export const arbContentFile = (contentId?: string): ContentFiles => ({
  contentId: contentId ?? uuid(),
  contentType: 'image',
  initialHeight: 500,
  initialWidth: 500,
  initialSize: 3000,
  thumbnail: arbFile(),
  display: arbFile(),
  gallery: arbFile(),
});

export const arbSizedContent = (
  suffix: SizedContentName = 'thumbnail',
): SizedContent => ({
  mime: 'image/png',
  extension: 'png',
  width: 500,
  height: 500,
  size: 3000,
  suffix,
  duration: undefined,
});

export const arbContent = (contentId?: string, mid?: string): Content => ({
  contentId: contentId ?? uuid(),
  mid: mid ?? uuid(),
  contentType: 'image',
  initialHeight: 500,
  initialWidth: 500,
  initialSize: 3000,
  thumbnail: arbSizedContent('thumbnail'),
  display: arbSizedContent('display'),
  gallery: arbSizedContent('gallery'),
  createdAt: new Date(),
  updatedAt: new Date(),
});
