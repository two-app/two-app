import Gateway from '../http/Gateway';
import {AxiosError, AxiosResponse} from 'axios';
import {UserRegistration} from './register_workflow/UserRegistrationModel';
import {UnconnectedUser, unconnectedUserFromAccessToken, User, userFromAccessToken} from './UserModel';
import {Tokens} from './AuthenticationModel';

export type UserResponse = {
    user: UnconnectedUser | User,
    tokens: Tokens
}

const registerUser = (userRegistration: UserRegistration): Promise<UserResponse> => Gateway.post('/self', userRegistration)
    .then((r: AxiosResponse<Tokens>): UserResponse => ({
        user: unconnectedUserFromAccessToken(r.data.accessToken),
        tokens: {accessToken: r.data.accessToken, refreshToken: r.data.refreshToken}
    })).catch((e: AxiosError) => {
        // @ts-ignore
        throw new Error(e.response.data['message'].toString());
    });

const connectToPartner = (connectCode: String): Promise<UserResponse> => Gateway.post(`/partner/${connectCode}`)
    .then((r: AxiosResponse<Tokens>): UserResponse => ({
        user: userFromAccessToken(r.data.accessToken),
        tokens: {accessToken: r.data.accessToken, refreshToken: r.data.refreshToken}
    })).catch((e: AxiosError) => {
        // @ts-ignore
        throw new Error(e.response.data['reason'].toString());
    });

export default {registerUser, connectToPartner};