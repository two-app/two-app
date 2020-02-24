import {AuthState} from './reducers';
import {Tokens} from '../AuthenticationModel';

/**
 * It is an implicit agreement that the existence of tokens within the redux store has been checked before
 * using this type-unsafe selector.
 * @param state holding the tokens.
 */
export const selectTokens = (state: AuthState): Tokens => <Tokens>state;