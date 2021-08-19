import type {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';
import {store} from '../state/reducers';
import {getNavigation} from '../navigation/RootNavigation';
import {resetNavigate} from '../navigation/NavigationUtilities';
import {storeUser, storeUnconnectedUser} from '../user';
import type {ErrorResponse} from '../http/Response';

import {storeTokens} from './store';
import type {Tokens} from './AuthenticationModel';
import type {UserRegistration} from './register_workflow/UserRegistrationModel';
import UserRegistrationModel from './register_workflow/UserRegistrationModel';
import type {UnconnectedUser, User} from './UserModel';
import {
  unconnectedUserFromAccessToken,
  detectUserFromAccessToken,
  isUnconnectedUser,
} from './UserModel';

export type UserResponse = {
  user: UnconnectedUser | User;
  tokens: Tokens;
};

export type LoginCredentials = {
  email: string;
  rawPassword: string;
};

export const areCredentialsValid = ({email, rawPassword}: LoginCredentials) =>
  UserRegistrationModel.isEmailValid(email) && rawPassword.length > 3;

const login = (loginCredentials: LoginCredentials): Promise<UserResponse> =>
  Gateway.post('/login', loginCredentials).then(
    (r: AxiosResponse<Tokens>): UserResponse => ({
      user: detectUserFromAccessToken(r.data.accessToken),
      tokens: {
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
    }),
  );

const registerUser = (
  userRegistration: UserRegistration,
): Promise<UserResponse> =>
  Gateway.post('/self', userRegistration).then(
    (r: AxiosResponse<Tokens>): UserResponse => ({
      user: unconnectedUserFromAccessToken(r.data.accessToken),
      tokens: {
        accessToken: r.data.accessToken,
        refreshToken: r.data.refreshToken,
      },
    }),
  );

const refreshTokens = (): Promise<string> =>
  Gateway.post('/refresh')
    .then((response: AxiosResponse<string>): string => {
      const accessToken = response.data;
      handleTokenChange(accessToken);
      return accessToken;
    })
    .catch((error: ErrorResponse) => {
      if (error.code === 401) {
        resetNavigate('LogoutScreen', getNavigation() as any);
      }

      return Promise.reject({
        code: 500,
        status:
          'Generated Internal Server Error: Invalid client-side mapping of token refresh failure.',
        reason: 'Something went wrong on our end.',
      });
    });

const handleTokenChange = (newAccessToken: string) => {
  const {accessToken, refreshToken} = getTokensFromStore();

  // 1. store the new access token
  store.dispatch(storeTokens({accessToken: newAccessToken, refreshToken}));

  const oldUser = detectUserFromAccessToken(accessToken);
  const newUser = detectUserFromAccessToken(newAccessToken);

  // 2. store the new user
  if (isUnconnectedUser(newUser)) {
    store.dispatch(storeUnconnectedUser(newUser));
  } else {
    // 3. user is connected. if they previously were not,
    // navigate to the loading screen.
    store.dispatch(storeUser(newUser));
    if (isUnconnectedUser(oldUser)) {
      resetNavigate('LoadingScreen', getNavigation() as any);
    }
  }
};

const getTokensFromStore = (): {accessToken: string; refreshToken: string} => {
  const refreshToken = store.getState().auth?.refreshToken;
  const accessToken = store.getState().auth?.accessToken;

  if (refreshToken == null || accessToken == null) {
    throw new Error('Inconsistent authentication state.');
  }

  return {accessToken, refreshToken};
};

export default {login, registerUser, refreshTokens};
