import { ActionType, createReducer } from 'typesafe-actions';
import { storeUnconnectedUser, storeUser } from './actions';
import { Reducer } from 'redux';

export type UserState = {
    readonly uid: number,
    readonly pid?: number,
    readonly cid?: number,
    readonly connectCode?: string
} | null;

type UserActions = ActionType<typeof import('./actions').default>;

export const userReducer: Reducer<UserState, UserActions> = createReducer<UserState, UserActions>(null)
    .handleAction(storeUnconnectedUser, (state, action) => action.payload)
    .handleAction(storeUser, (state, action) => action.payload)
