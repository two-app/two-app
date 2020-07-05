import {Memory} from '../MemoryModels';
import {createAction} from 'typesafe-actions';

export const storeMemories = createAction('STORE_MEMORIES')<Memory[]>();
export const updateMemory = createAction('UPDATE_MEMORY')<{
  mid: number;
  memory: Memory;
}>();
export const emptyMemories = createAction('EMPTY_MEMORIES')();
export default {storeMemories, emptyMemories};
