import 'react-native-get-random-values';
import uuid from 'uuidv4';

import type {User} from '../authentication/UserModel';
import {userFromAccessToken} from '../authentication/UserModel';
import {storeTokens} from '../authentication/store';
import {resetNavigate} from '../navigation/NavigationUtilities';
import {getNavigation} from '../navigation/RootNavigation';
import {store} from '../state/reducers';
import type {UserResponse} from '../authentication/AuthenticationService';
import AuthenticationService from '../authentication/AuthenticationService';
import Gateway from '../http/Gateway';
import type {Tokens} from '../authentication/AuthenticationModel';
import type {ErrorResponse} from '../http/Response';
import type {Couple} from '../couple/CoupleService';
import CoupleService from '../couple/CoupleService';

import {storeUser} from './actions';

type PostCoupleReq = {
  toUser: string;
  cid: string;
};

const connectToPartner = async (uid: string): Promise<UserResponse> => {
  const req: PostCoupleReq = {
    toUser: uid,
    cid: uuid(),
  };

  const r = await Gateway.post<Tokens>('/couple', req);
  return {
    user: userFromAccessToken(r.data.accessToken),
    tokens: {
      accessToken: r.data.accessToken,
      refreshToken: r.data.refreshToken,
    },
  };
};

/**
 * Retrieves the couple the user belongs to. If the partner is present,
 * the users authentication tokens are refreshed.
 */
const checkConnection = async (): Promise<void> => {
  return CoupleService.getCouple().then((couple: Couple) => {
    if (couple.partner != null) {
      return AuthenticationService.refreshTokens().then(() => {});
    } else {
      return Promise.resolve();
    }
  });
};

/**
 * Connects the two users.
 * @param code the new partners uid
 * @returns an empty promise
 */
const performConnection = (code: string): Promise<void> => {
  return (
    connectToPartner(code)
      // the connection was successful.
      // store the updated user and tokens in redux,
      // then navigate to the home screen.
      .then((response: UserResponse) => {
        store.dispatch(storeUser(response.user as User));
        store.dispatch(storeTokens(response.tokens));
        resetNavigate('HomeScreen', getNavigation() as any);
      })
      .catch((error: ErrorResponse) => {
        const status = error.code;
        const {reason} = error;
        if (status === 400 && reason === 'User already has a partner.') {
          // if user already has a partner, refresh the connection
          return checkConnection();
        } else {
          return Promise.reject(error);
        }
      })
  );
};

export default {checkConnection, performConnection};
