import Gateway from "../http/Gateway"
import { MemoryPatch } from "../memories/MemoryModels"

export const setMemoryDisplayPicture = (mid: number, displayId: number): Promise<void> => {
  const patch: MemoryPatch = {
    displayContentId: displayId
  }

  return Gateway.patch(`/memory/${mid}`, patch);
}
