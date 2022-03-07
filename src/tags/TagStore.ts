import AsyncStorage from '@react-native-community/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import {TimelineDataStore} from '../home/TimelineConstants';
import {Tag} from './Tag';

export type TagState = TimelineDataStore<Tag> & {
  all: Tag[];
  setAll: (t: Tag[]) => void;
  add: (tag: Tag) => void;
  remove: (tid: string) => void;
};

export const useTagStore = create<TagState>(
  persist(
    (set, _) => ({
      all: [],
      setAll: (all: Tag[]) => set(_ => ({all})),
      add: (tag: Tag) => set(state => ({all: [...state.all, tag]})),
      remove: (tid: string) =>
        set(state => ({all: state.all.filter(t => t.tid !== tid)})),
    }),
    {
      name: 'tag-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
