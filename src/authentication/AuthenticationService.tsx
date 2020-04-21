import Gateway from '../http/Gateway';
import {AxiosError, AxiosResponse} from 'axios';
import UserRegistrationModel, {UserRegistration} from './register_workflow/UserRegistrationModel';
import {UnconnectedUser, unconnectedUserFromAccessToken, User, userFromAccessToken, detectUserFromAccessToken} from './UserModel';
import {Tokens} from './AuthenticationModel';

export type UserResponse = {
    user: UnconnectedUser | User,
    tokens: Tokens
}

export type LoginCredentials = {
    email: string,
    rawPassword: string
}

export const areCredentialsValid = ({ email, rawPassword }: LoginCredentials) =>
    UserRegistrationModel.isEmailValid(email) && rawPassword.length > 3;

const login = (loginCredentials: LoginCredentials): Promise<UserResponse> => Gateway.post("/login", loginCredentials)
    .then((r: AxiosResponse<Tokens>): UserResponse => ({
        user: detectUserFromAccessToken(r.data.accessToken),
        tokens: {accessToken: r.data.accessToken, refreshToken: r.data.refreshToken}
    })).catch((e: AxiosError) => {
        throw new Error(e.response?.data['reason'].toString());
    });

const registerUser = (userRegistration: UserRegistration): Promise<UserResponse> => Gateway.post('/self', userRegistration)
    .then((r: AxiosResponse<Tokens>): UserResponse => ({
        user: unconnectedUserFromAccessToken(r.data.accessToken),
        tokens: {accessToken: r.data.accessToken, refreshToken: r.data.refreshToken}
    })).catch((e: AxiosError) => {
        throw new Error(e.response?.data['reason'].toString());
    });

const connectToPartner = (connectCode: String): Promise<UserResponse> => Gateway.post(`/partner/${connectCode}`)
    .then((r: AxiosResponse<Tokens>): UserResponse => ({
        user: userFromAccessToken(r.data.accessToken),
        tokens: {accessToken: r.data.accessToken, refreshToken: r.data.refreshToken}
    })).catch((e: AxiosError) => {
        // @ts-ignore
        throw new Error(e.response.data['reason'].toString());
    });

export default {login, registerUser, connectToPartner};