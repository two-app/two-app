import {MemoryState} from './reducers';
import {Memory} from '../MemoryModels';

export const selectMemories = (memoryState: MemoryState): Memory[] => {
  return memoryState.allMemories;
};

export const selectMemory = (
  memoryState: MemoryState,
  mid: number,
): Memory => {
  return memoryState.allMemories.find((m) => m.id === mid)!;
};
