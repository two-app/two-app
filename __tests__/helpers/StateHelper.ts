import {TwoState} from '../../src/state/reducers';

export const BASE_STATE: TwoState = {
  memories: {
    allMemories: [],
    content: {},
  },
  auth: null,
  profile: null,
  tags: {
    allTags: [],
  },
  user: null,
};
