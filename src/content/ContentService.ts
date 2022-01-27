import Gateway from '../http/Gateway';
import {Memory} from '../memories/MemoryModels';
import {getMemory} from '../memories/MemoryService';

import {Content} from './ContentModels';
import {ContentFiles} from './compression/Compression';

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

const ext = (path: string): string => {
  const split = path.split('.');
  const end = split[split.length - 1];
  return end ?? '';
};

/**
 * @param mid the memory id
 * @param content to upload
 * @param setDisplayContent if the content should be set as the display picture
 */
export const uploadContent = (
  mid: string,
  content: ContentFiles,
): Promise<ContentUploadResponse> => {
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

  const now = new Date();

  form.append('form', JSON.stringify({
    contentId: content.contentId,
    contentType: content.contentType,
    initialWidth: content.initialWidth,
    initialHeight: content.initialHeight,
    initialSize: content.initialSize,
    createdAt: now,
    updatedAt: now,
    thumbnail: {
      suffix: 'thumbnail',
      extension: ext(thumbnail.path),
      mime: thumbnail.mime,
      width: thumbnail.width,
      height: thumbnail.height,
      duration: thumbnail.duration,
    },
    display: {
      suffix: 'display',
      extension: ext(display.path),
      mime: display.mime,
      width: display.width,
      height: display.height,
      duration: display.duration,
    },
    gallery: {
      suffix: 'gallery',
      extension: ext(gallery.path),
      mime: gallery.mime,
      width: gallery.width,
      height: gallery.height,
      duration: gallery.duration,
    },
  }));

  console.log(`Uploading content to mid ${mid}: ${JSON.stringify(form)}`);
  const uri = `/memory/${mid}/content`;

  return Gateway.post<ContentUploadResponse>(uri, form, {
    timeout: 60 * 1000, // 1m
    headers: {
      'x-do-not-trace': 'x-do-not-trace',
      'Content-Type': 'multipart/form-data'
    }
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
