import {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';
import {PickedContent} from '../content/ContentPicker';
import ContentService, {ContentUploadResponse} from '../content/ContentService';
import {Content} from '../content/ContentModels';

import {Memory, MemoryMeta} from './MemoryModels';

export const isMemoryDescriptionValid = (upload: MemoryMeta) =>
  upload.title.length > 0 && upload.location.length > 0;

/**
 * Retrieves the memories for the user.
 * Display images are updated to localised AWS.
 */
export const getMemories = (): Promise<Memory[]> =>
  Gateway.get('/memory').then((v: AxiosResponse<Memory[]>) =>
    v.data.map(formatMemory),
  );

/**
 * Retrieves a specific memory.
 * Display image is updated to localised AWS.
 * @param mid the memory ID to retrieve.
 */
export const getMemory = (mid: string): Promise<Memory> =>
  Gateway.get('/memory/' + mid.toString()).then(
    (response: AxiosResponse<Memory>) => formatMemory(response.data),
  );

const formatMemory = (memory: Memory): Memory => {
  if (memory.displayContent != null) {
    memory.displayContent.fileKey = ContentService.formatFileKey(
      memory.displayContent.fileKey,
    );
  }

  return memory;
};

export const createMemory = (description: MemoryMeta): Promise<string> => {
  return Gateway.post('/memory', description).then(
    (v: AxiosResponse<Memory>) => v.data.mid,
  );
};

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

export const patchMemory = (
  mid: string,
  patch: MemoryMeta,
): Promise<Memory> => {
  return Gateway.patch<any>(`/memory/${mid}`, patch).then(
    (r: AxiosResponse<any>) => {
      console.log(`Successfully patched memory. Response status: ${r.status}`);
      return getMemory(mid);
    },
  );
};

export const deleteMemory = async (mid: string): Promise<void> => {
  const r = await Gateway.delete<any>(`/memory/${mid}`);
  console.log(`Successfully deleted memory. Response: ${r}`);
  return r.data;
};
