import {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';

import {Tag, TagDescription} from './Tag';

export const getTags = (): Promise<Tag[]> => {
  return Gateway.get('/tag').then((res: AxiosResponse<Tag[]>) => res.data);
};

export const createTag = (tagDescription: TagDescription): Promise<Tag> => {
  tagDescription.name.trim();

  type PostTagResponse = {
    tid: string;
  };

  return Gateway.post('/tag', tagDescription).then(
    (res: AxiosResponse<PostTagResponse>) => {
      return {...tagDescription, tid: res.data.tid, memoryCount: 0};
    },
  );
};

export const deleteTag = (tid: string): Promise<void> => {
  return Gateway.delete(`/tag/${tid}`);
};

export const updateTag = (tid: string, desc: TagDescription): Promise<Tag> => {
  return Gateway.put(`/tag/${tid}`, desc).then((res: AxiosResponse<Tag>) => {
    return res.data;
  });
};
