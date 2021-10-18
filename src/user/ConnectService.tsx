import 'react-native-get-random-values';

import AuthenticationService from '../authentication/AuthenticationService';
import {Couple, fetchCouple} from '../couple/CoupleService';

/**
 * Retrieves the couple the user belongs to. If the partner is present,
 * the users authentication tokens are refreshed. If refreshed, the user is returned.
 */
const checkConnection = async (): Promise<boolean> => {
  return fetchCouple().then((couple: Couple) => {
    if (couple.partner != null) {
      return AuthenticationService.refreshTokens().then(() =>
        Promise.resolve(true),
      );
    } else {
      return Promise.resolve(false);
    }
  });
};

export default {checkConnection};
