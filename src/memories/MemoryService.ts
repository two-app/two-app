import Gateway from '../http/Gateway';
import {PickedContent} from '../content/ContentPicker';
import ContentService, {ContentUploadResponse} from '../content/ContentService';
import {Content} from '../content/ContentModels';

import {Memory, MemoryMeta} from './MemoryModels';

const formatMemory = (memory: Memory): Memory => {
  if (memory.displayContent != null) {
    memory.displayContent.fileKey = ContentService.formatFileKey(
      memory.displayContent.fileKey,
    );
  }
  return memory;
};

export const isMemoryDescriptionValid = (upload: MemoryMeta) =>
  upload.title.length > 0 && upload.location.length > 0;

/* GET /memory */
export const getMemories = (): Promise<Memory[]> =>
  Gateway.get<Memory[]>('/memory').then(({data}) => data.map(formatMemory));

/* GET /memory/$mid */
export const getMemory = (mid: string): Promise<Memory> =>
  Gateway.get<Memory>(`/memory/${mid}`).then(({data}) => formatMemory(data));

/* POST /memory */
export const createMemory = (memory: MemoryMeta): Promise<Memory> =>
  Gateway.post<Memory>('/memory', memory).then(r => r.data);

/* PUT /memory */
export const updateMemory = (memory: MemoryMeta): Promise<Memory> =>
  Gateway.put<Memory>('/memory', memory).then(r => r.data);

/* DELETE /memory/$mid */
export const deleteMemory = async (mid: string): Promise<void> =>
  Gateway.delete<any>(`/memory/${mid}`).then(r => r.data);

export const uploadToMemory = (
  mid: string,
  contentToUpload: PickedContent[],
  setProgress: (percentage: number) => void,
): Promise<[Memory, Content[]]> => {
  setProgress(0);
  const doneTotal = contentToUpload.length + 1;
  let doneCount = 1;

  const uploadPromises: Promise<ContentUploadResponse>[] = contentToUpload.map(
    (content: PickedContent) =>
      ContentService.uploadContent(
        mid,
        content,
        !!content.setDisplayPicture,
      ).finally(() => {
        doneCount++;
        setProgress(Math.round((doneCount / doneTotal) * 100));
      }),
  );

  // upload content, then retrieve latest memory + content data
  return Promise.all(uploadPromises).then(() =>
    Promise.all([getMemory(mid), ContentService.getContent(mid)]),
  );
};
