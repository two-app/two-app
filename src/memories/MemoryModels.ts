import { Tag } from "../tags/Tag";
import { Content } from "../content/ContentModels";

export type MemoryDescription = {
  tag?: number;
  title: string;
  location: string;
  date: number;
};

export type Memory = {
  id: number;
  tag?: Tag;
  title: string;
  location: string;
  date: number;
  imageCount: number;
  videoCount: number;
  displayContent?: Content;
};

export type MemoryPatch = {
  title?: string;
  location?: string;
  date?: string;
  displayContentId?: number;
  tagId?: number;
};
