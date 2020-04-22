import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { shallow, ShallowWrapper } from 'enzyme';
import RegisterScreen from '../../src/authentication/RegisterScreen';
import EmailValidator from '../../src/forms/EmailValidator';
import { UserRegistration } from '../../src/authentication/register_workflow/UserRegistrationModel';

describe('RegisterScreen', () => {
    test('should maintain snapshot', () => expect(renderer.create(<RegisterScreen
        navigation={{} as any} />)
    ).toMatchSnapshot());

    let tb: RegisterScreenTestBed;

    beforeEach(() => tb = new RegisterScreenTestBed());

    test('Login Button should navigate to LoginScreen', () => {
        const btn: any = tb.wrapper.find("TouchableOpacity[data-testid=\'login-screen-button\']").first()

        btn.prop('onPress')();
    });

    describe('Navigation Tests', () => {
        test('it should navigate when submit button is clicked', () => {
            tb.clickSubmitButton();

            expect(tb.navigateFn).toHaveBeenCalledWith(
                'AcceptTermsScreen', { userRegistration: new UserRegistration() }
            );
        });
    });

    describe('Form Validation Tests', () => {

        describe('First Name', () => {
            test('invalid with one character', () => tb.expectInput('First Name', 'a').toBe(false));
            test('valid with three characters', () => tb.expectInput('First Name', 'abc').toBe(true));
        });

        describe('Last Name', () => {
            test('invalid with 1 character', () => tb.expectInput('Last Name', 'a').toBe(false));
            test('valid with 3 characters', () => tb.expectInput('Last Name', 'abc').toBe(true));
        });

        describe('Email', () => {
            test('delegates to validEmail fn', () => {
                EmailValidator.validateEmail = jest.fn().mockReturnValue(true);
                tb.expectInput('Email', 'admin@two.com');
                expect(EmailValidator.validateEmail).toHaveBeenCalledTimes(1);
                expect(EmailValidator.validateEmail).toHaveBeenCalledWith('admin@two.com');
            });
        });

        describe('Password', () => {
            test('invalid with < 6 characters', () => tb.expectInput('Password', 'pass').toBe(false));
            test('valid with > 6 characters', () => tb.expectInput('Password', 'password').toBe(true));
            test('valid with secure password', () => tb.expectInput('Password', 'P?4Ot2ONz:IJO&%U').toBe(true));
        });

        describe('Fully Valid Form', () => {
            test('should enable the submit button', () => {
                expect(tb.wrapper.find('SubmitButton').prop('disabled')).toBe(true);

                tb.changeInput('First Name', 'Gerry');
                tb.changeInput('Last Name', 'Fletcher');
                EmailValidator.validateEmail = jest.fn().mockReturnValue(true);
                tb.changeInput('Email', 'admin@two.com');
                tb.changeInput('Password', 'P?4Ot2ONz:IJO&%U');

                expect(tb.wrapper.find('SubmitButton').prop('disabled')).toBe(false);
            });
        });
    });
});

class RegisterScreenTestBed {

    navigateFn = jest.fn();
    dispatchFn = jest.fn();
    wrapper = shallow(<RegisterScreen navigation={{ navigate: this.navigateFn, dispatch: this.dispatchFn } as any} />);

    expectInput = (label: string, value: string) => {
        const input = this.wrapper.find(`Input[label='${label}']`).first();
        const isValidFunction = input.prop<(v: string) => boolean>('isValid');
        return expect(isValidFunction(value));
    };

    clickSubmitButton = () => {
        this.wrapper.find('SubmitButton').prop<() => void>('onSubmit')();
    }

    changeInput = (label: string, value: string) => {
        const input = this.wrapper.find(`Input[label='${label}']`).first();
        const onChangeFn = input.prop<(v: string) => void>('onChange');
        onChangeFn(value);
    };
}