import {Reducer} from 'redux';
import {ActionType, createAction, createReducer} from 'typesafe-actions';
import {Couple} from '../../couple/CoupleService';

export type ProfileState = {
  readonly couple: Couple;
} | null;

export const storeCoupleProfile = createAction(
  'STORE_COUPLE_PROFILE',
)<Couple>();

const actions = {storeCoupleProfile};
type ProfileActions = ActionType<typeof actions>;

export const profileReducer: Reducer<ProfileState, ProfileActions> =
  createReducer<ProfileState, ProfileActions>(null).handleAction(
    storeCoupleProfile,
    (state, action) => ({...state, couple: action.payload}),
  );
