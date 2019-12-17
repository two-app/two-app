// @flow

import EmailValidator from "../../forms/EmailValidator";

/**
 * Blank UserRegistration object with Flow types.
 * @type {{firstName: null, lastName: null, password: null, email: null}}
 */
const UserRegistration: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    acceptedTerms: boolean,
    ofAge: boolean,
    receivesEmails: boolean
} = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    acceptedTerms: false,
    ofAge: false,
    receivesEmails: false
};

const isFirstNameValid = firstName => firstName != null && firstName.length > 1;
const isLastNameValid = lastName => lastName != null && lastName.length > 1;
const isEmailValid = email => email != null && EmailValidator.validateEmail(email);
const isPasswordValid = password => password != null && password.length > 3;

/**
 * @param ur {UserRegistration} to validate
 * @returns {boolean} true if the user supplied information is valid. Does not check terms & age.
 */
const isUserRegistrationValid = (ur: UserRegistration) => (
    isFirstNameValid(ur.firstName) &&
    isLastNameValid(ur.lastName) &&
    isEmailValid(ur.email) &&
    isPasswordValid(ur.password)
);

export default {isFirstNameValid, isLastNameValid, isEmailValid, isPasswordValid, isUserRegistrationValid};
export {UserRegistration};