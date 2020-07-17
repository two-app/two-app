import {ActionType, createReducer} from 'typesafe-actions';
import {Reducer} from 'redux';

import {storeUnconnectedUser, storeUser} from './actions';

export type UserState = {
  readonly uid: number;
  readonly pid?: number;
  readonly cid?: number;
  readonly connectCode?: string;
} | null;

type UserActions = ActionType<typeof import('./actions').default>;

export const userReducer: Reducer<UserState, UserActions> = createReducer<
  UserState,
  UserActions
>(null)
  .handleAction(storeUnconnectedUser, (_, action) => action.payload)
  .handleAction(storeUser, (_, action) => action.payload);
