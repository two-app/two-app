import {Tag} from '../tags/Tag';
import {Content} from '../content/ContentModels';

export type MemoryMeta = {
  mid: string;
  title: string;
  location: string;
  occurredAt: Date;
  displayContentId?: string;
  tid?: string;
};

export type Memory = {
  mid: string;
  title: string;
  location: string;
  occurredAt: Date;
  createdAt: Date;
  displayContent?: Content;
  tag?: Tag;
  imageCount: number;
  videoCount: number;
};
