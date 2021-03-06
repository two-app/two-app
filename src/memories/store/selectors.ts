import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

import {MemoryState} from './reducers';

export const selectMemories = (memoryState: MemoryState): Memory[] => {
  return memoryState.allMemories;
};

export const selectMemory = (memoryState: MemoryState, mid: number): Memory => {
  return memoryState.allMemories.find((m) => m.id === mid)!;
};

export const selectMemoryContent = (
  memoryState: MemoryState,
  mid: number,
): Content[] => {
  return memoryState.content[mid] || [];
};
