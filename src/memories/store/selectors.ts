import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';
import {TwoState} from '../../state/reducers';

import {MemoryState} from './reducers';

export const selectAllMemories = (state: TwoState): Memory[] => {
  return state.memories.allMemories;
};

export const selectMemory = (memoryState: MemoryState, mid: string): Memory => {
  return memoryState.allMemories.find(m => m.mid === mid)!;
};

export const selectMemoryContent = (
  memoryState: MemoryState,
  mid: string,
): Content[] => {
  return memoryState.content[mid] || [];
};
