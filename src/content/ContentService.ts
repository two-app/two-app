import Gateway from '../http/Gateway';
import {MemoryPatch, Memory} from '../memories/MemoryModels';
import {getMemory} from '../memories/MemoryService';

export const setMemoryDisplayPicture = (
  mid: number,
  displayId: number,
): Promise<Memory> => {
  const patch: MemoryPatch = {
    displayContentId: displayId,
  };

  return Gateway.patch(`/memory/${mid}`, patch).then(() => getMemory(mid));
};

export const deleteMemoryContent = (
  mid: number,
  contentId: number
): Promise<void> => {
  return Gateway.delete(`/memory/${mid}/content/${contentId}`);
}