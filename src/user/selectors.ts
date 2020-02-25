import {UnconnectedUser, User} from '../authentication/UserModel';
import {UserState} from './reducers';

/**
 * It is an implicit agreement that the existence of the user within the redux store has been checked before
 * using this type-unsafe selector.
 * @param state holding the tokens.
 */
export const selectUser = (userState: UserState | null | undefined): User => <User>userState;

/**
 * It is an implicit agreement that the existence of the unconnected user within the redux store has been checked before
 * using this type-unsafe selector.
 * @param state holding the tokens.
 */
export const selectUnconnectedUser = (userState: UserState | null | undefined): UnconnectedUser => <UnconnectedUser>userState;