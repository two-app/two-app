import 'react-native-get-random-values';

import Gateway from '../http/Gateway';
import type {ErrorResponse} from '../http/Response';
import {resetNavigate, Routes} from '../navigation/NavigationUtilities';

import type {Tokens, UserRegistration} from './AuthenticationModel';
import type {MixedUser, UnconnectedUser, User} from './UserModel';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from './AuthenticationStore';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ConnectRequest = {
  toUser: string;
  cid: string;
  anniversary: string;
};

const login = (creds: LoginCredentials): Promise<MixedUser> =>
  Gateway.post<Tokens>('/login', creds).then(r => persistTokens(r.data));

const registerUser = (reg: UserRegistration): Promise<MixedUser> =>
  Gateway.post<Tokens>('/self', reg).then(r => persistTokens(r.data));

const connectUser = (connection: ConnectRequest): Promise<User> =>
  Gateway.post<Tokens>('/couple', connection).then(r => {
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

const persistTokens = (tokens: Tokens): User | UnconnectedUser => {
  return useAuthStore.getState().set(tokens);
};

export default {login, registerUser, refreshTokens, connectUser};
