// @flow
import Gateway from "../http/Gateway";
import {AxiosError, AxiosResponse} from "axios";
import {UserRegistration} from "./register_workflow/UserRegistrationModel";
import {UnconnectedUser} from "./UserModel";
import {Tokens} from "./AuthenticationModel";

class RegisterUserResponse {
    user: UnconnectedUser;
    tokens: Tokens;

    constructor(user: UnconnectedUser, tokens: Tokens) {
        this.user = user;
        this.tokens = tokens;
    }
}


const registerUser = (userRegistration: UserRegistration): Promise<RegisterUserResponse> =>
    Gateway.post("/self", userRegistration)
        .then((r: AxiosResponse) => {
            const accessToken = r.data['accessToken'];
            const refreshToken = r.data['refreshToken'];
            return new RegisterUserResponse({
                user: UnconnectedUser.fromAccessToken(accessToken),
                tokens: new Tokens(accessToken, refreshToken)
            });
        }).catch((e: AxiosError) => {
            throw new Error(e.response.data['message'].toString());
        }
    );

export default {registerUser};
export {RegisterUserResponse};