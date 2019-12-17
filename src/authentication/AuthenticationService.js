// @flow
import Gateway from "../http/Gateway";
import {AxiosError, AxiosResponse} from "axios";
import {UserRegistration} from "./register_workflow/UserRegistrationModel";
import {parseUnconnectedUserFromToken} from "./UserModel";

/**
 * @param userRegistration {UserRegistration} valid user registration.
 */
const registerUser = (userRegistration: UserRegistration) => {
    return Gateway.post("/self", userRegistration)
        .then((r: AxiosResponse) => {
            const user = parseUnconnectedUserFromToken(r.data['accessToken']);
        })
        .catch((e: AxiosError) => {
            throw new Error(e.response.data['message'].toString());
        })
};

const testData = {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjY4LCJyb2xlIjoiQUNDRVNTIiwiaXNzIjoidHdvIiwiZXhwIjoxNTc2NjAyMzQyLCJjb25uZWN0Q29kZSI6IlpXNkJEVyJ9.3-RA1Z6kHCPBahVAhtAp5g7UtcvRWh0xWVWw-7u-FQ0",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjY4LCJyb2xlIjoiUkVGUkVTSCIsImlzcyI6InR3byJ9.ezFezbutTfRAyqrXkeGoNzEd0fhUYASjOj3hUUC_jNg"
};

export default {registerUser};