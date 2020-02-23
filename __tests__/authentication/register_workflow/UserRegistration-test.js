
import EmailValidator from "../../../src/forms/EmailValidator";
import UserRegistrationModel from "../../../src/authentication/register_workflow/UserRegistrationModel";


describe('isFirstNameValid', () => {
    test('it should fail for < 2 characters', () => expect(UserRegistrationModel.isFirstNameValid('g')).toBe(false));
    test('it should pass for > 1 characters', () => expect(UserRegistrationModel.isFirstNameValid('ge')).toBe(true));
});

describe('isLastNameValid', () => {
    test('it should fail for < 2 characters', () => expect(UserRegistrationModel.isLastNameValid('g')).toBe(false));
    test('it should pass for > 1 characters', () => expect(UserRegistrationModel.isLastNameValid('ge')).toBe(true));
});

describe('isEmailValid', () => {
    test('it should delegate to the email validator', () => {
        EmailValidator.validateEmail = jest.fn();
        UserRegistrationModel.isEmailValid("admin@two.com");
        expect(EmailValidator.validateEmail).toHaveBeenCalledWith("admin@two.com");
    });
});

describe('isPasswordValid', () => {
    test('it should fail for < 3 characters', () => expect(UserRegistrationModel.isPasswordValid('pa')).toBe(false));
    test('it should pass for > 3 characters', () => expect(UserRegistrationModel.isPasswordValid('pass')).toBe(true));
});