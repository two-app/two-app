export type ImageContent = {
  contentType: 'image';
  extension: string;
  suffix: 'thumbnail' | 'display' | 'gallery';
  height: number;
  width: number;
};

export type VideoContent = {
  contentType: 'video';
  extension: string;
  suffix: 'gallery';
};

export type Content = {
  contentId: number;
  contentType: 'image' | 'video';
  fileKey: string;
  extension: string;
  thumbnail: ImageContent;
  display: ImageContent;
  gallery: ImageContent | VideoContent;
};
