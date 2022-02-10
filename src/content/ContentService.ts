import Gateway from '../http/Gateway';
import {Memory} from '../memories/MemoryModels';
import {getMemory} from '../memories/MemoryService';

import {Content, contentFilesToContent} from './ContentModels';
import {ContentFiles} from './compression/Compression';

export const setMemoryDisplayPicture = (
  mid: string,
  displayId: string,
): Promise<Memory> => {
  const patch = {displayContentId: displayId};
  return Gateway.patch(`/memory/${mid}`, patch).then(() => getMemory(mid));
};

/**
 * @param mid the memory id
 * @param content to upload
 */
export const uploadContent = (
  mid: string,
  content: ContentFiles,
): Promise<Content> => {
  const {thumbnail, display, gallery} = content;
  const form = new FormData();

  form.append('thumbnail', {
    name: 'thumbnail.png',
    type: thumbnail.mime,
    uri: thumbnail.path,
  });

  form.append('display', {
    name: 'display',
    type: display.mime,
    uri: display.path,
  });

  form.append('gallery', {
    name: 'gallery',
    type: gallery.mime,
    uri: gallery.path,
  });

  form.append('form', JSON.stringify(contentFilesToContent(mid, content)));

  console.log(`Uploading content to mid ${mid}: ${JSON.stringify(form)}`);

  return Gateway.post<Content>(`/memory/${mid}/content`, form, {
    timeout: 30 * 1000, // 30s
    headers: {
      'x-do-not-trace': 'x-do-not-trace',
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);
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

export default {
  setMemoryDisplayPicture,
  uploadContent,
  getContent,
  deleteContent,
};
