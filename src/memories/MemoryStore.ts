import AsyncStorage from '@react-native-community/async-storage';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import {TimelineDataStore} from '../home/TimelineConstants';
import {Memory} from './MemoryModels';

export type MemoryState = TimelineDataStore<Memory> & {
  all: Memory[];
  select: (mid: string) => Memory | undefined;
  setAll: (m: Memory[]) => void;
  add: (m: Memory) => void;
  remove: (mid: string) => void;
  update: (m: Memory) => void;
};

export const useMemoryStore = create<MemoryState>(
  persist(
    (set, get) => ({
      all: [],
      select: (mid: string) => get().all.find(m => m.mid === mid),
      setAll: (all: Memory[]) => set(_ => ({all})),
      add: (m: Memory) => set(state => ({all: [...state.all, m]})),
      remove: (mid: string) =>
        set(state => ({all: state.all.filter(m => m.mid !== mid)})),
      update: (m: Memory) =>
        set(state => ({
          all: state.all.map(memory => (memory.mid === m.mid ? m : memory)),
        })),
    }),
    {
      name: 'memory-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
