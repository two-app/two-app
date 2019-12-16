// @flow

/**
 * Blank UserRegistration object with Flow types.
 * @type {{firstName: null, lastName: null, password: null, email: null}}
 */
export const UserRegistration: {
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

/**
 * @param ur {UserRegistration}
 * @returns {boolean} true if the user supplied information is valid. Does not check terms & age.
 */
export const isUserRegistrationValid = (ur: UserRegistration) => (
    ur.firstName != null &&
    ur.lastName != null &&
    ur.email != null &&
    ur.password != null
);