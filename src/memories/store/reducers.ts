import {
  ActionType,
  createReducer,
  Reducer,
  PayloadAction,
} from 'typesafe-actions';

import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

import {
  storeMemories,
  emptyMemories,
  updateMemory,
  storeContent,
  insertMemory,
  deleteContent,
  deleteMemory,
} from './actions';

// @ts-ignore
const inAscending = (a: Memory, b: Memory): number =>
  // @ts-ignore
  b.occurredAt - a.occurredAt;

export type MemoryState = {
  readonly allMemories: Memory[];
  readonly content: Record<string, Content[]>;
};

type MemoryActions = ActionType<typeof import('./actions').default>;

const handleStoreMemories = (
  state: MemoryState,
  action: PayloadAction<'STORE_MEMORIES', Memory[]>,
): MemoryState => ({...state, allMemories: action.payload});

const handleUpdateMemory = (
  state: MemoryState,
  action: PayloadAction<'UPDATE_MEMORY', {mid: string; memory: Memory}>,
): MemoryState => {
  const {mid, memory} = action.payload;
  return {
    ...state,
    allMemories: state.allMemories
      .map(m => (m.mid === mid ? memory : m))
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

const handleDeleteMemory = (
  state: MemoryState,
  action: PayloadAction<'DELETE_MEMORY', {mid: string}>,
): MemoryState => ({
  ...state,
  allMemories: [...state.allMemories].filter(
    (m: Memory) => m.mid !== action.payload.mid,
  ),
});

const handleStoreContent = (
  state: MemoryState,
  action: PayloadAction<'STORE_CONTENT', {mid: string; content: Content[]}>,
): MemoryState => {
  const {mid, content} = action.payload;
  const newContent = {...state.content};
  newContent[mid] = content;
  return {...state, content: newContent};
};

const handleDeleteContent = (
  state: MemoryState,
  action: PayloadAction<'DELETE_CONTENT', {mid: string; contentId: string}>,
): MemoryState => {
  const {mid, contentId} = action.payload;
  const content = {...state.content};

  if (content[mid] == null) {
    return state;
  } // noop
  const memoryContent: Content[] = content[mid];

  content[mid] = memoryContent.filter(c => c.contentId !== contentId);
  return {...state, content};
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
  .handleAction(deleteMemory, handleDeleteMemory)
  .handleAction(storeContent, handleStoreContent)
  .handleAction(deleteContent, handleDeleteContent)
  .handleAction(emptyMemories, handleEmptyMemories);
