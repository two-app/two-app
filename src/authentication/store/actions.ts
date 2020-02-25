import {deprecated} from 'typesafe-actions';
import {Tokens} from '../AuthenticationModel';

const {createAction} = deprecated;

export const storeTokens = createAction('STORE_TOKENS', action => (tokens: Tokens) => action(tokens));

export default {storeTokens};