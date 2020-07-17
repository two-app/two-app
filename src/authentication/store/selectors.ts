import {Tokens} from '../AuthenticationModel';

import {AuthState} from './reducers';

/**
 * It is an implicit agreement that the existence of tokens within the redux store has been checked before
 * using this type-unsafe selector.
 * @param state holding the tokens.
 */
export const selectTokens = (state: AuthState): Tokens => <Tokens>state;
