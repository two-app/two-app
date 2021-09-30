import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';
import {TwoState} from '../../state/reducers';

import {MemoryState} from './reducers';

export const selectAllMemories = (state: TwoState): Memory[] => {
  return state.memories.allMemories;
};

export const selectMemory = (memoryState: MemoryState, mid: number): Memory => {
  return memoryState.allMemories.find(m => m.id === mid)!;
};

export const selectMemoryContent = (
  memoryState: MemoryState,
  mid: number,
): Content[] => {
  return memoryState.content[mid] || [];
};
