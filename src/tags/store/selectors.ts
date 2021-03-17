import {Tag} from '../Tag';

import {TagState} from './reducers';

export const selectTags = (tagState: TagState): Tag[] => tagState.allTags;
