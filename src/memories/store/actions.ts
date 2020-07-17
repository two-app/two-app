import {Memory, Content} from '../MemoryModels';
import {createAction} from 'typesafe-actions';

export const storeMemories = createAction('STORE_MEMORIES')<Memory[]>();

export const updateMemory = createAction('UPDATE_MEMORY')<{
  mid: number;
  memory: Memory;
}>();

export const storeContent = createAction('STORE_CONTENT')<{
  mid: number;
  content: Content[];
}>();

export const deleteContent = createAction('DELETE_CONTENT')<{
  mid: number;
  contentId: number;
}>();

export const insertMemory = createAction('INSERT_MEMORY')<Memory>();

export const emptyMemories = createAction('EMPTY_MEMORIES')();

export default {storeMemories, updateMemory, insertMemory, storeContent, deleteContent, emptyMemories};
