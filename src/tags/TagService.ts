import {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';

import {Tag, TagDescription} from './Tag';

export const getTags = (): Promise<Tag[]> => {
  return Gateway.get('/tag').then((res: AxiosResponse<Tag[]>) => res.data);
};

export const createTag = (tagDescription: TagDescription): Promise<Tag> => {
  tagDescription.name.trim();

  type PostTagResponse = {
    tid: number;
  };

  return Gateway.post('/tag', tagDescription).then(
    (res: AxiosResponse<PostTagResponse>) => {
      return {...tagDescription, tid: res.data.tid};
    },
  );
};
