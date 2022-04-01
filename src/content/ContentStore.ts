import AsyncStorage from '@react-native-community/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import {Content} from './ContentModels';

export type ContentState = {
  // mid <-> Content[]
  memoryContent: Record<string, Content[]>;
  select: (mid: string) => Content[];
  set: (mid: string, content: Content[]) => void;
  add: (mid: string, content: Content) => void;
  delete: (mid: string, contentId: string) => void;
};

export const useContentStore = create<ContentState>(
  persist(
    (set, get) => ({
      memoryContent: {},
      select: (mid: string): Content[] => get().memoryContent[mid] ?? [],
      set: (mid: string, content: Content[]) => {
        const {memoryContent} = get();
        memoryContent[mid] = content;
        set({memoryContent});
      },
      add: (mid: string, content: Content) => {
        const {select, set} = get();
        const existingContent = select(mid);
        set(mid, [...existingContent, content]);
      },
      delete: (mid: string, contentId: string) => {
        const {select, set} = get();
        const existingContent = select(mid);
        set(
          mid,
          existingContent.filter(c => c.contentId !== contentId),
        );
      },
    }),
    {
      name: 'memory-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
