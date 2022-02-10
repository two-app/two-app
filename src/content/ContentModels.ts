import Config from 'react-native-config';
import {ContentFiles, File} from './compression/Compression';

export type ContentType = 'image' | 'video';
export type SizedContentName = 'thumbnail' | 'display' | 'gallery';

export const contentUrl = (content: Content, type: SizedContentName) => {
  const {contentId} = content;
  const sized = content[type];
  const s3 = Config.S3_URL;

  return `${s3}/${contentId}-${sized.suffix}.${sized.extension}`;
};

export type SizedContent = {
  suffix: string;
  extension: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  duration?: number;
};

export type Content = {
  contentId: string;
  mid: string;
  contentType: ContentType;
  initialWidth: number;
  initialHeight: number;
  initialSize: number;
  thumbnail: SizedContent;
  display: SizedContent;
  gallery: SizedContent;
  createdAt: Date;
  updatedAt: Date;
};

const extractExtension = (path: string): string => {
  const split = path.split('.');
  const end = split[split.length - 1];
  return end ?? '';
};

export const contentFilesToContent = (
  mid: string,
  files: ContentFiles,
): Content => {
  const sizedContent = (type: SizedContentName, file: File): SizedContent => ({
    suffix: type,
    extension: extractExtension(file.path),
    mime: file.mime,
    width: file.width,
    height: file.height,
    size: file.size,
    duration: file.duration,
  });

  const {thumbnail, display, gallery} = files;
  const now = new Date();

  return {
    contentId: files.contentId,
    mid,
    contentType: files.contentType,
    initialWidth: files.initialWidth,
    initialHeight: files.initialHeight,
    initialSize: files.initialSize,
    createdAt: now,
    updatedAt: now,
    thumbnail: sizedContent('thumbnail', thumbnail),
    display: sizedContent('display', display),
    gallery: sizedContent('gallery', gallery),
  };
};
