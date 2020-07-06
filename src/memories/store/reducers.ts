import {Memory, Content} from '../MemoryModels';
import {
  ActionType,
  createReducer,
  Reducer,
  PayloadAction,
} from 'typesafe-actions';
import {
  storeMemories,
  emptyMemories,
  updateMemory,
  storeContent,
  insertMemory,
} from './actions';

export type MemoryState = {
  readonly allMemories: Memory[];
  readonly content: Record<number, Content[]>;
};

type MemoryActions = ActionType<typeof import('./actions').default>;

const handleStoreMemories = (
  state: MemoryState,
  action: PayloadAction<'STORE_MEMORIES', Memory[]>,
): MemoryState => ({...state, allMemories: action.payload});

const handleUpdateMemory = (
  state: MemoryState,
  action: PayloadAction<'UPDATE_MEMORY', {mid: number; memory: Memory}>,
): MemoryState => {
  const {mid, memory} = action.payload;
  return {
    ...state,
    allMemories: state.allMemories
      .map((m) => (m.id === mid ? memory : m))
      .sort(inAscending),
  };
};

const handleInsertMemory = (
  state: MemoryState,
  action: PayloadAction<'INSERT_MEMORY', Memory>,
): MemoryState => ({
  ...state,
  allMemories: [...state.allMemories, action.payload].sort(inAscending),
});

const inAscending = (a: Memory, b: Memory) => b.date - a.date;

const handleStoreContent = (
  state: MemoryState,
  action: PayloadAction<'STORE_CONTENT', {mid: number; content: Content[]}>,
): MemoryState => {
  const {mid, content} = action.payload;
  const newContent = {...state.content};
  newContent[mid] = content;
  return {...state, content: newContent};
};

const defaultState: MemoryState = {
  allMemories: [],
  content: {},
};

const handleEmptyMemories = (): MemoryState => defaultState;

export const memoryReducer: Reducer<MemoryState, MemoryActions> = createReducer<
  MemoryState,
  MemoryActions
>(defaultState)
  .handleAction(storeMemories, handleStoreMemories)
  .handleAction(updateMemory, handleUpdateMemory)
  .handleAction(insertMemory, handleInsertMemory)
  .handleAction(storeContent, handleStoreContent)
  .handleAction(emptyMemories, handleEmptyMemories);
