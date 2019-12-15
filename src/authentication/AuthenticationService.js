// @flow
import {UserRegistration} from "./UserRegistration";
import Gateway from "../http/Gateway";
import {AxiosError, AxiosResponse} from "axios";

/**
 * @param userRegistration {UserRegistration} valid user registration.
 * @returns {Promise<string>} resolved: the users connect code, caught: the message why the registration failed.
 */
const registerUser = (userRegistration: UserRegistration) => {
    return Gateway.post("/self", userRegistration)
        .then((r: AxiosResponse) => "abcdefg")
        .catch((e: AxiosError) => {
            throw new Error(e.response.data['message'].toString());
        })
};
export {registerUser};