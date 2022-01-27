import Config from 'react-native-config';

export type ContentType = 'image' | 'video';

export const contentUrl = (contentId: String, meta: ContentMeta) =>
  `${Config.S3_URL}/${contentId}-${meta.suffix}.${meta.extension}`;

export type ContentMeta = {
  suffix: 'thumbnail' | 'display' | 'gallery';
  extension: string;
  contentType: ContentType;
};

export type ImageContentMeta = ContentMeta & {
  width: number;
  height: number;
  contentType: 'image';
};

export type VideoContentMeta = ContentMeta & {
  contentType: 'video';
};

export type Content = {
  contentId: string;
  mid: string;
  thumbnail: ImageContentMeta;
  display: VideoContentMeta;
  gallery: ImageContentMeta | VideoContentMeta;
  contentType: ContentType;
};
