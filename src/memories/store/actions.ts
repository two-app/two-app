import {createAction} from 'typesafe-actions';

import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

export const storeMemories = createAction('STORE_MEMORIES')<Memory[]>();

export const updateMemory = createAction('UPDATE_MEMORY')<{
  mid: string;
  memory: Memory;
}>();

export const deleteMemory = createAction('DELETE_MEMORY')<{
  mid: string;
}>();

export const storeContent = createAction('STORE_CONTENT')<{
  mid: string;
  content: Content[];
}>();

export const deleteContent = createAction('DELETE_CONTENT')<{
  mid: string;
  contentId: string;
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
