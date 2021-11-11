import FormData from 'form-data';
import {AxiosResponse} from 'axios';
import Config from 'react-native-config';

import Gateway from '../http/Gateway';
import {Memory} from '../memories/MemoryModels';
import {getMemory} from '../memories/MemoryService';

import {PickedContent} from './ContentPicker';
import {Content, ImageContent, VideoContent} from './ContentModels';
import uuidv4 from 'uuidv4';

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
  setDisplayContent: boolean,
): Promise<ContentUploadResponse> => {
  const form = new FormData();

  form.append('content', {
    name: content.filename,
    type: content.mime,
    uri: content.path,
  });

  const contentId = uuidv4();

  console.log(
    `Uploading content to memory with id ${mid} with contentId ${contentId}`,
    content,
  );

  const uri = `/memory/${mid}/content/${contentId}`;

  return Gateway.post<ContentUploadResponse>(uri, form, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-do-not-trace': 'x-do-not-trace',
    },
    timeout: 60 * 1000, // 1m
  }).then((r: AxiosResponse<ContentUploadResponse>) => r.data);
};

export const getContent = (mid: string): Promise<Content[]> =>
  Gateway.get<Content[]>(`/memory/${mid}/content`).then(
    (v: AxiosResponse<Content[]>) => {
      return v.data.map(content => {
        content.fileKey = formatFileKey(content.fileKey);
        return content;
      });
    },
  );

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

export const buildContentURI = (
  fileKey: string,
  content: ImageContent | VideoContent,
): string => {
  return `${fileKey}-${content.suffix}.${content.extension}`;
};

export const formatFileKey = (fileKey: string): string =>
  `${Config.S3_URL}/${fileKey}`;

export default {
  setMemoryDisplayPicture,
  uploadContent,
  getContent,
  deleteContent,
  buildContentURI,
  formatFileKey,
};
