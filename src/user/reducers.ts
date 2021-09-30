import type {ActionType} from 'typesafe-actions';
import {createReducer} from 'typesafe-actions';
import type {Reducer} from 'redux';

import {storeUnconnectedUser, storeUser} from './actions';

export type UserState = {
  readonly uid: string;
  readonly pid?: string;
  readonly cid?: string;
} | null;

type UserActions = ActionType<typeof import('./actions').default>;

export const userReducer: Reducer<UserState, UserActions> = createReducer<
  UserState,
  UserActions
>(null)
  .handleAction(storeUnconnectedUser, (_, action) => action.payload)
  .handleAction(storeUser, (_, action) => action.payload);
