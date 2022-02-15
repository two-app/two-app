import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import decode from 'jwt-decode';

import Gateway from '../http/Gateway';
import {store} from '../state/reducers';
import {storeUser, storeUnconnectedUser} from '../user';
import type {ErrorResponse} from '../http/Response';
import {resetNavigate, Routes} from '../navigation/NavigationUtilities';

import {storeTokens} from './store';
import type {Tokens, UserRegistration} from './AuthenticationModel';
import type {MixedUser, UnconnectedUser, User} from './UserModel';
import {useNavigation} from '@react-navigation/native';

export type LoginCredentials = {
  email: string;
  password: string;
};

const login = (creds: LoginCredentials): Promise<MixedUser> =>
  Gateway.post<Tokens>('/login', creds).then(r => persistTokens(r.data));

const registerUser = (reg: UserRegistration): Promise<MixedUser> =>
  Gateway.post<Tokens>('/self', reg).then(r => persistTokens(r.data));

const connectUser = (pid: string): Promise<User> =>
  Gateway.post<Tokens>('/couple', {toUser: pid, cid: uuid()}).then(r => {
    const mixedUser = persistTokens(r.data);
    if ('pid' in mixedUser && 'cid' in mixedUser) {
      return mixedUser as User;
    } else {
      console.error('Refresh did not contain properly formed user');
      throw new Error('Something went wrong on our end.');
    }
  });

const refreshTokens = (): Promise<MixedUser> =>
  Gateway.post<Tokens>('/refresh')
    .then(r => persistTokens(r.data))
    .catch((error: ErrorResponse) => {
      if (error.status === 401) {
        const navigation = useNavigation<Routes>();
        resetNavigate('LogoutScreen', navigation);
      }

      return Promise.reject({
        code: 500,
        status:
          'Generated Internal Server Error: Invalid client-side mapping of token refresh failure.',
        reason: 'Something went wrong on our end.',
      });
    });

type Payload = {
  uid: string;
  pid?: string;
  cid?: string;
};

/**
 * Stores the tokens in the redux store, and returns the inferred user object from the access token.
 */
const persistTokens = (tokens: Tokens): User | UnconnectedUser => {
  store.dispatch(storeTokens(tokens));
  const payload: Payload = decode(tokens.accessToken);

  if (payload.pid != null && payload.cid != null) {
    const user: User = {uid: payload.uid, pid: payload.pid, cid: payload.cid};
    store.dispatch(storeUser(user));
    return user;
  } else {
    const user: UnconnectedUser = {uid: payload.uid};
    store.dispatch(storeUnconnectedUser(user));
    return user;
  }
};

export default {login, registerUser, refreshTokens, connectUser};
