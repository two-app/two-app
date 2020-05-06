import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { LoginScreen } from '../../src/authentication/LoginScreen';
import { shallow } from 'enzyme';
import { CommonActions } from '@react-navigation/native';
import EmailValidator from '../../src/forms/EmailValidator';
import AuthenticationService, { UserResponse } from '../../src/authentication/AuthenticationService';
import { User, UnconnectedUser } from '../../src/authentication/UserModel';
import { Tokens } from '../../src/authentication/AuthenticationModel';
import { ErrorResponse } from '../../src/http/Response';

describe('LoginScreen', () => {

    test('should maintain snapshot', () => expect(renderer.create(
        <LoginScreen
            navigation={{} as any}
            storeUser={jest.fn()}
            storeUnconnectedUser={jest.fn()}
            storeTokens={jest.fn()}
        />
    ).toJSON()).toMatchSnapshot());

    let tb: LoginScreenTestBed;

    beforeEach(() => tb = new LoginScreenTestBed());

    test('Create Account Button should navigate to RegisterScreen.', () => {
        const btn: any = tb.wrapper.find("TouchableOpacity[data-testid=\'register-screen-button\']").first()

        btn.prop('onPress')();

        expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
        expect(tb.dispatchFn).toHaveBeenCalledWith(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'RegisterScreen' }]
            })
        );
    });

    describe('Form Validation Tests', () => {
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

        describe('Valid Form', () => {
            test('should enable the submit button', () => {
                expect(tb.wrapper.find('SubmitButton').prop('disabled')).toBe(true);

                EmailValidator.validateEmail = jest.fn().mockReturnValue(true);
                tb.changeInput('Email', 'admin@two.com');
                tb.changeInput('Password', 'P?4Ot2ONz:IJO&%U');

                expect(tb.wrapper.find('SubmitButton').prop('disabled')).toBe(false);
            });
        });
    });

    describe('Logging In', () => {
        const tokens: Tokens = { accessToken: 'testAccess', refreshToken: 'testRefresh' };

        test('it should call the Authentication Service', () => {
            const user: User = { uid: 1, pid: 2, cid: 3 };
            tb.onLoginReturn({ user, tokens });

            tb.performLogin('user@two.com', 'testPassword');

            expect(AuthenticationService.login).toHaveBeenCalledTimes(1);
        });

        test('it should display a loading overlay', () => {
            tb.onLoginReturn({} as any); // async, result wont be used

            tb.performLogin('user@two.com', 'testPassword');

            expect(tb.wrapper.find("ScrollContainer").prop<boolean>("isLoading")).toBe(true);
        });

        describe('With Valid Response', () => {
            test('it should store the user', done => {
                const user: User = { uid: 1, pid: 2, cid: 3 };
                tb.onLoginReturn({ user, tokens });
                tb.performLogin('user@two.com', 'testPassword');

                setImmediate(() => {
                    expect(tb.storeUserFn).toHaveBeenCalledTimes(1);
                    expect(tb.storeUserFn).toHaveBeenCalledWith(user);
                    done();
                });
            });

            test('it should store the unconnected user', done => {
                const user: UnconnectedUser = { uid: 1, connectCode: 'aBcDeF' };
                tb.onLoginReturn({ user, tokens });
                tb.performLogin('user@two.com', 'testPassword');

                setImmediate(() => {
                    expect(tb.storeUnconnectedUserFn).toHaveBeenCalledTimes(1);
                    expect(tb.storeUnconnectedUserFn).toHaveBeenCalledWith(user);
                    done();
                });
            });

            test('it should store the tokens', done => {
                const user: User = { uid: 1, pid: 2, cid: 3 };
                tb.onLoginReturn({ user, tokens });
                tb.performLogin('user@two.com', 'testPassword');

                setImmediate(() => {
                    expect(tb.storeTokensFn).toHaveBeenCalledTimes(1);
                    expect(tb.storeTokensFn).toHaveBeenCalledWith(tokens);
                    done();
                });
            });

            test('it should navigate to the Loading Screen', done => {
                const user: User = { uid: 1, pid: 2, cid: 3 };
                tb.onLoginReturn({ user, tokens });
                tb.performLogin('user@two.com', 'testPassword');

                setImmediate(() => {
                    expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
                    expect(tb.dispatchFn).toHaveBeenCalledWith(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'LoadingScreen' }]
                        })
                    );
                    done();
                });
            });
        });

        describe('With Error Response', () => {
            test('it should display the error', done => {
                const error: ErrorResponse = {code: 400, status: '400 Bad Request', reason: 'Some API Error Message'};
                tb.onLoginFail(error);

                tb.performLogin('user@two.com', 'testPassword');

                setImmediate(() => {
                    const errorMessage = tb.wrapper.find("Text[data-testid=\'error-message\']").first();
                    expect(errorMessage.render().text()).toEqual(error.reason);
                    done();
                });
            });
        });
    });

});

class LoginScreenTestBed {

    dispatchFn = jest.fn();
    storeUserFn = jest.fn();
    storeUnconnectedUserFn = jest.fn();
    storeTokensFn = jest.fn();

    wrapper = shallow(
        <LoginScreen
            navigation={{ dispatch: this.dispatchFn } as any}
            storeUser={this.storeUserFn}
            storeUnconnectedUser={this.storeUnconnectedUserFn}
            storeTokens={this.storeTokensFn}
        />
    );

    onLoginReturn = (response: UserResponse) => {
        AuthenticationService.login = jest.fn().mockResolvedValue(response);
    }

    onLoginFail = (error: ErrorResponse) => {
        AuthenticationService.login = jest.fn().mockRejectedValue(error);
    }

    performLogin = (email: string, password: string) => {
        this.changeInput('Email', email);
        this.changeInput('Password', password);
        const onClickFn = this.wrapper.find('SubmitButton').first().prop("onSubmit");
        // @ts-ignore
        onClickFn();
    }

    expectInput = (label: string, value: string) => {
        const input = this.wrapper.find(`Input[label='${label}']`).first();
        const isValidFunction = input.prop<(v: string) => boolean>('isValid');
        return expect(isValidFunction(value));
    };

    changeInput = (label: string, value: string) => {
        const input = this.wrapper.find(`Input[label='${label}']`).first();
        const onChangeFn = input.prop<(v: string) => void>('onChange');
        onChangeFn(value);
    };

}