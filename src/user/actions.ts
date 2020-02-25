import {UnconnectedUser, User} from '../authentication/UserModel';
import {createAction} from 'typesafe-actions';

export const storeUser = createAction('STORE_USER', (user: User) => user)<User>();
export const storeUnconnectedUser = createAction('STORE_UNCONNECTED_USER')<UnconnectedUser>();

export default {storeUser, storeUnconnectedUser};