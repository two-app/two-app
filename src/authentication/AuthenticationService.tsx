import Gateway from '../http/Gateway';
import {AxiosError, AxiosResponse} from 'axios';
import UserRegistrationModel, {UserRegistration} from './register_workflow/UserRegistrationModel';
import {UnconnectedUser, unconnectedUserFromAccessToken, User, userFromAccessToken, detectUserFromAccessToken, isUnconnectedUser} from './UserModel';
import {Tokens} from './AuthenticationModel';
import { store } from '../state/reducers';
import { storeTokens } from './store';
import { getNavigation } from '../navigation/RootNavigation';
import { resetNavigate } from '../navigation/NavigationUtilities';
import { storeUser, storeUnconnectedUser } from '../user';

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
    }));

const refreshTokens = () => Gateway.post("/refresh").then((response: AxiosResponse<string>): string => {
    const accessToken = response.data;
    handleTokenChange(accessToken);
    return accessToken;
}).catch((error: AxiosError) => {
    if (error.response?.status === 401) {
        resetNavigate('LogoutScreen', getNavigation() as any);
    }
    
    return 'Something went wrong on our end.';
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

const getTokensFromStore = (): {accessToken: string, refreshToken: string} => {
    const refreshToken = store.getState().auth?.refreshToken;
    const accessToken = store.getState().auth?.accessToken;

    if (refreshToken == null || accessToken == null) {
        throw new Error("Inconsistent authentication state.");
    }

    return {accessToken, refreshToken};
}

export default {login, registerUser, connectToPartner, refreshTokens};