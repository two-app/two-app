import {Memory} from '../MemoryModels';
import {
  ActionType,
  createReducer,
  Reducer,
  PayloadAction,
} from 'typesafe-actions';
import {storeMemories, emptyMemories, updateMemory} from './actions';

export type MemoryState = {
  readonly allMemories: Memory[];
};

type MemoryActions = ActionType<typeof import('./actions').default>;

const handleStoreMemories = (
  state: MemoryState,
  action: PayloadAction<'STORE_MEMORIES', Memory[]>,
): MemoryState => ({allMemories: action.payload});

const handleUpdateMemory = (
  state: MemoryState,
  action: PayloadAction<'UPDATE_MEMORY', {mid: number; memory: Memory}>,
): MemoryState => {
  const {mid, memory} = action.payload;
  return {
    allMemories: state.allMemories.map((m) => {
      if (m.id !== mid) return m;
      return memory;
    }),
  };
};

const handleEmptyMemories = (): MemoryState => ({allMemories: []});

const defaultState: MemoryState = {
  allMemories: [],
};

export const memoryReducer: Reducer<MemoryState, MemoryActions> = createReducer<
  MemoryState,
  MemoryActions
>(defaultState)
  .handleAction(storeMemories, handleStoreMemories)
  .handleAction(updateMemory, handleUpdateMemory)
  .handleAction(emptyMemories, handleEmptyMemories);
