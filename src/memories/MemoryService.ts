import Gateway from '../http/Gateway';
import {Memory, MemoryMeta} from './MemoryModels';

export const isMemoryDescriptionValid = (upload: MemoryMeta) =>
  upload.title.length > 0 && upload.location.length > 0;

/* GET /memory */
export const getMemories = (): Promise<Memory[]> =>
  Gateway.get<Memory[]>('/memory').then(r => r.data);

/* GET /memory/$mid */
export const getMemory = (mid: string): Promise<Memory> =>
  Gateway.get<Memory>(`/memory/${mid}`).then(r => r.data);

/* POST /memory */
export const createMemory = (memory: MemoryMeta): Promise<Memory> =>
  Gateway.post<Memory>('/memory', memory).then(r => r.data);

/* PUT /memory */
export const updateMemory = (memory: MemoryMeta): Promise<Memory> =>
  Gateway.put<Memory>('/memory', memory).then(r => r.data);

/* DELETE /memory/$mid */
export const deleteMemory = async (mid: string): Promise<void> =>
  Gateway.delete<any>(`/memory/${mid}`).then(r => r.data);
