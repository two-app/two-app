import {createAction} from 'typesafe-actions';

import {UnconnectedUser, User} from '../authentication/UserModel';

export const storeUser = createAction('STORE_USER', (user: User) => user)<
  User
>();
export const storeUnconnectedUser = createAction('STORE_UNCONNECTED_USER')<
  UnconnectedUser
>();

export default {storeUser, storeUnconnectedUser};
