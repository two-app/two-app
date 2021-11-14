import FormData from 'form-data';
import {AxiosResponse} from 'axios';
import Config from 'react-native-config';

import Gateway from '../http/Gateway';
import {Memory} from '../memories/MemoryModels';
import {getMemory} from '../memories/MemoryService';

import {PickedContent} from './ContentPicker';
import {Content} from './ContentModels';

export const setMemoryDisplayPicture = (
  mid: string,
  displayId: string,
): Promise<Memory> => {
  const patch = {
    displayContentId: displayId,
  };

  return Gateway.patch(`/memory/${mid}`, patch).then(() => getMemory(mid));
};

export type ContentUploadResponse = {contentId: string};

/**
 * @param mid the memory id
 * @param content to upload
 * @param setDisplayContent if the content should be set as the display picture
 */
export const uploadContent = (
  mid: string,
  content: PickedContent,
): Promise<ContentUploadResponse> => {
  const form = new FormData();

  form.append('content', {
    name: content.filename,
    type: content.mime,
    uri: content.path,
  });

  console.log(`Uploading content to mid ${mid}: ${JSON.stringify(content)}`);
  const uri = `/memory/${mid}/content/${content.contentId}`;

  return Gateway.post<ContentUploadResponse>(uri, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-do-not-trace': 'x-do-not-trace',
    },
    timeout: 90 * 1000, // 1.5m
  }).then((r: AxiosResponse<ContentUploadResponse>) => r.data);
};

export const getContent = (mid: string): Promise<Content[]> =>
  Gateway.get<Content[]>(`/memory/${mid}/content`).then(r => r.data);

export type DeleteContentResponse = {
  newDisplayContent?: Content;
};

export const deleteContent = async (
  mid: string,
  contentId: string,
): Promise<DeleteContentResponse> => {
  const uri = `/memory/${mid}/content/${contentId}`;
  const response = await Gateway.delete<DeleteContentResponse>(uri);
  return response.data;
};

export const formatFileKey = (fileKey: string): string =>
  `${Config.S3_URL}/${fileKey}`;

export default {
  setMemoryDisplayPicture,
  uploadContent,
  getContent,
  deleteContent,
  formatFileKey,
};
