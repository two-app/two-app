import {deprecated} from 'typesafe-actions';
import {UnconnectedUser, User} from '../authentication/UserModel';

const {createAction} = deprecated;

export const storeUser = createAction('STORE_USER', action => (user: User) => action(user));

export const storeUnconnectedUser = createAction('STORE_UNCONNECTED_USER', action => {
    return (user: UnconnectedUser) => action(user);
});

export default {storeUser, storeUnconnectedUser};