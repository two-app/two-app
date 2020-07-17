import {createAction} from 'typesafe-actions';

import {Tokens} from '../AuthenticationModel';

export const storeTokens = createAction('STORE_TOKENS')<Tokens>();

export default {storeTokens};
