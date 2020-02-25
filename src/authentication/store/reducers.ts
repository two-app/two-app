import {ActionType, createReducer} from 'typesafe-actions';
import {Reducer} from 'redux';
import {storeTokens} from './actions';

export type AuthState = {
    readonly accessToken: string,
    readonly refreshToken: string
} | null;

type AuthActions = ActionType<typeof import('./actions').default>;

export const authReducer: Reducer<AuthState, AuthActions> = createReducer<AuthState, AuthActions>(null)
    .handleAction(storeTokens, (state, action) => action.payload);