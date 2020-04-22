// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import RegisterScreen from "../../src/authentication/RegisterScreen";
import EmailValidator from "../../src/forms/EmailValidator";
import {UserRegistration} from "../../src/authentication/register_workflow/UserRegistration";

test('should maintain snapshot', () => expect(renderer.create(<RegisterScreen/>)).toMatchSnapshot());

describe('Navigation Tests', () => {
    test('it should navigate when Join Two is clicked', () => {
        const navigate = jest.fn();

        shallow(<RegisterScreen navigation={{navigate}}/>).find("SubmitButton").prop("onSubmit")();

        expect(navigate).toHaveBeenCalledWith('AcceptTermsScreen', {userRegistration: UserRegistration});
    });
});

describe('Form Validation Tests', () => {

    let wrapper = shallow(<RegisterScreen/>);

    beforeEach(() => wrapper = shallow(<RegisterScreen/>));

    describe('First Name', () => {
        test('invalid with one character', () => expectInput("First Name", "a").toBe(false));
        test('valid with three characters', () => expectInput("First Name", "abc").toBe(true));
    });

    describe('Last Name', () => {
        test('invalid with 1 character', () => expectInput("Last Name", "a").toBe(false));
        test('valid with 3 characters', () => expectInput("Last Name", "abc").toBe(true));
    });

    describe('Email', () => {
        test('delegates to validEmail fn', () => {
            EmailValidator.validateEmail = jest.fn();
            expectInput("Email", "admin@two.com");
            expect(EmailValidator.validateEmail).toHaveBeenCalledTimes(1);
            expect(EmailValidator.validateEmail).toHaveBeenCalledWith("admin@two.com");
        });
    });

    describe('Password', () => {
        test('invalid with < 6 characters', () => expectInput("Password", "pass").toBe(false));
        test('valid with > 6 characters', () => expectInput("Password", "password").toBe(true));
        test('valid with secure password', () => expectInput("Password", "P?4Ot2ONz:IJO&%U").toBe(true));
    });

    describe('Fully Valid Form', () => {
        test('should enable the submit button', () => {
            expect(wrapper.find("SubmitButton").prop("disabled")).toBe(true);

            emitInput("First Name", "Gerry");
            emitInput("Last Name", "Fletcher");
            emitInput("Email", "admin@two.com");
            emitInput("Password", "P?4Ot2ONz:IJO&%U");

            expect(wrapper.find("SubmitButton").prop("disabled")).toBe(false);
        });
    });

    const expectInput = (label, value) => {
        const input = wrapper.find(`Input[label='${label}']`).first();
        const isValidFunction = input.prop("isValid");
        return expect(isValidFunction(value));
    };

    const emitInput = (label, value) => {
        const input = wrapper.find(`Input[label='${label}']`).first();
        const onEmitFunction = input.prop("onEmit");
        onEmitFunction(value);
    };
});