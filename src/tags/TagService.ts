import Gateway from '../http/Gateway';
import {Tag, TagDescription} from './Tag';

/* GET /tag */
export const getTags = (): Promise<Tag[]> =>
  Gateway.get<Tag[]>('/tag').then(r => r.data);

/* POST /tag */
export const createTag = (desc: TagDescription): Promise<Tag> =>
  Gateway.post<Tag>('/tag', {
    ...desc,
    name: desc.name.trim(),
  }).then(r => r.data);

/* DELETE /tag/$tid */
export const deleteTag = (tid: string): Promise<void> =>
  Gateway.delete(`/tag/${tid}`);

/* PUT /tag/$tid */
export const updateTag = (desc: TagDescription): Promise<Tag> =>
  Gateway.put<Tag>(`/tag/${desc.tid}`, desc).then(r => r.data);
