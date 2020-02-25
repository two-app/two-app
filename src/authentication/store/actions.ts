import {Tokens} from '../AuthenticationModel';
import {createAction} from 'typesafe-actions';

export const storeTokens = createAction('STORE_TOKENS')<Tokens>();

export default {storeTokens};