import {createAction} from 'typesafe-actions';

import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

export const storeMemories = createAction('STORE_MEMORIES')<Memory[]>();

export const updateMemory = createAction('UPDATE_MEMORY')<{
  mid: number;
  memory: Memory;
}>();

export const deleteMemory = createAction('DELETE_MEMORY')<{
  mid: number;
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

export default {
  storeMemories,
  updateMemory,
  deleteMemory,
  insertMemory,
  storeContent,
  deleteContent,
  emptyMemories,
};
