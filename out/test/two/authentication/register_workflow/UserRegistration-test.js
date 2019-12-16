// @flow

import {
    isEmailValid,
    isFirstNameValid,
    isLastNameValid, isPasswordValid, UserRegistration
} from "../../../src/authentication/register_workflow/UserRegistration";
import EmailValidator from "../../../src/forms/EmailValidator";

describe('isFirstNameValid', () => {
    test('it should fail for < 2 characters', () => expect(isFirstNameValid('g')).toBe(false));
    test('it should pass for > 1 characters', () => expect(isFirstNameValid('ge')).toBe(true));
});

describe('isLastNameValid', () => {
    test('it should fail for < 2 characters', () => expect(isLastNameValid('g')).toBe(false));
    test('it should pass for > 1 characters', () => expect(isLastNameValid('ge')).toBe(true));
});

describe('isEmailValid', () => {
    test('it should delegate to the email validator', () => {
        EmailValidator.validateEmail = jest.fn();
        isEmailValid("admin@two.com");
        expect(EmailValidator.validateEmail).toHaveBeenCalledWith("admin@two.com");
    });
});

describe('isPasswordValid', () => {
    test('it should fail for < 3 characters', () => expect(isPasswordValid('pa')).toBe(false));
    test('it should pass for > 3 characters', () => expect(isPasswordValid('pass')).toBe(true));
});

describe('isUserRegistrationValid', () => {
    test('delegates to sub-functions', () => {

    });
});