import {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';

import {Tag} from './Tag';

export const getTags = (): Promise<Tag[]> => {
  return Gateway.get('/tag').then((res: AxiosResponse<Tag[]>) => res.data);
};

export const createTag = (name: string, color: string): Promise<Tag> => {
  name = name.trim();
  type PostTagResponse = {
    tid: number;
  };

  return Gateway.post('/tag', {name, color}).then(
    (res: AxiosResponse<PostTagResponse>) => {
      return {name, color, tid: res.data.tid};
    },
  );
};
