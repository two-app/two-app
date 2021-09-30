import { Content } from "../content/ContentModels";

export type Tag = {
  tid: number;
  name: string;
  color: string;
  memoryCount: number;
  startDate?: string; // Earliest date from memories
  endDate?: string; // Latest date from memories
  displayContent?: Content;
  createdAt?: string;
  updatedAt?: string;
};

export type TagDescription = {
  name: string;
  color: string;
};
