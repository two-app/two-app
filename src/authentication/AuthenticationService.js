// @flow
import Gateway from "../http/Gateway";
import {AxiosError, AxiosResponse} from "axios";
import {UserRegistration} from "./register_workflow/UserRegistrationModel";
import {UnconnectedUser, User} from "./UserModel";
import {Tokens} from "./AuthenticationModel";

class UserResponse {
    user: UnconnectedUser | User;
    tokens: Tokens;

    constructor(user: UnconnectedUser, tokens: Tokens) {
        this.user = user;
        this.tokens = tokens;
    }
}


const registerUser = (userRegistration: UserRegistration): Promise<UserResponse> =>
    Gateway.post("/self", userRegistration)
        .then((r: AxiosResponse) => {
            const accessToken = r.data['accessToken'];
            const refreshToken = r.data['refreshToken'];
            return new UserResponse(
                UnconnectedUser.fromAccessToken(accessToken),
                new Tokens(accessToken, refreshToken)
            );
        }).catch((e: AxiosError) => {
            throw new Error(e.response.data['message'].toString());
        }
    );

const connectToPartner = (connectCode: String): Promise<UserResponse> => Gateway.post(`/partner/${connectCode}`)
    .then((r: AxiosResponse) => {
        const accessToken = r.data['accessToken'];
        const refreshToken = r.data['refreshToken'];
        return new UserResponse(
            User.fromAccessToken(accessToken),
            new Tokens(accessToken, refreshToken)
        );
    }).catch((e: AxiosError) => {
        throw new Error(e.response.data['reason'].toString());
    });


export default {registerUser, connectToPartner};
export {UserResponse};