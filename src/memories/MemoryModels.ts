import {Tag} from '../tags/Tag';

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

export type MemoryDescription = {
  tag?: number;
  title: string;
  location: string;
  date: number;
};

export type Memory = MemoryDescription & {
  tag?: Tag;
  id: number;
  imageCount: number;
  videoCount: number;
  displayContent?: Content;
  content: Content[];
};

export type MemoryPatch = {
  title?: string;
  location?: string;
  date?: string;
  displayContentId?: number;
  tagId?: number;
};
