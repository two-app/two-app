import {AxiosResponse} from 'axios';

import Gateway from '../http/Gateway';
import {User} from '../authentication/UserModel';

import {UserProfile} from './UserService';

/**
 * Retrieves the users partner. Specific function for pre-connection,
 * returning an optional.
 */
const getPartnerPreConnect = (): Promise<User> =>
  Gateway.get('/partner').then(
    (response: AxiosResponse<User>): User => response.data,
  );

const getPartner = () =>
  Gateway.get('/partner').then(
    (response: AxiosResponse<UserProfile>) => response.data,
  );

export default {getPartnerPreConnect, getPartner};
