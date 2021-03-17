import {
  ActionType,
  createReducer,
  Reducer,
  PayloadAction,
} from 'typesafe-actions';

import {Tag} from '../Tag';

import {storeTags} from './actions';

type TagActions = ActionType<typeof import('./actions').default>;

export type TagState = {
  readonly allTags: Tag[];
};

const handleStoreTags = (
  state: TagState,
  action: PayloadAction<'STORE_TAGS', Tag[]>,
): TagState => ({
  ...state,
  allTags: action.payload,
});

const defaultState: TagState = {
  allTags: [],
};

export const tagReducer: Reducer<TagState, TagActions> = createReducer<
  TagState,
  TagActions
>(defaultState).handleAction(storeTags, handleStoreTags);
