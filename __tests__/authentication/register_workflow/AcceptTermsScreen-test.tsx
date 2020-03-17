import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import {AcceptTermsScreen} from '../../../src/authentication/register_workflow/AcceptTermsScreen';
import {UserRegistration} from '../../../src/authentication/register_workflow/UserRegistrationModel';
import AuthenticationService, {UserResponse} from '../../../src/authentication/AuthenticationService';
import {CommonActions} from '@react-navigation/native';

describe('AcceptTermsScreen', () => {
    test('should maintain snapshot', () => expect(renderer.create(<AcceptTermsScreen
        navigation={{dispatch: jest.fn()} as any}
        route={{params: {userRegistration: new UserRegistration()}} as any}
        storeUnconnectedUser={jest.fn()}
        storeTokens={jest.fn()}
    />)).toMatchSnapshot());

    let tb: AcceptTermsScreenTestBed;

    beforeEach(() => tb = new AcceptTermsScreenTestBed());

    test('submit button should be disabled with t&c checked', () => {
        tb.tickTermsAndConditions();

        expect(tb.isSubmitEnabled()).toBe(false);
    });

    test('submit button should be disabled with age checked', () => {
        tb.tickAge();

        expect(tb.isSubmitEnabled()).toBe(false);
    });

    test('should enable the submit button with t&c and age accept boxes checked', () => {
        tb.tickTermsAndConditions();
        tb.tickAge();

        expect(tb.isSubmitEnabled()).toBe(true);
    });

    describe('On Submit', () => {
        const mockRegisterResponse: UserResponse = {
            user: {uid: 24, connectCode: 'testConnectCode'},
            tokens: {accessToken: 'testAccess', refreshToken: 'testRefresh'}
        };

        beforeEach(() => {
            tb.whenRegisterUserResolve(mockRegisterResponse);
            tb.checkFieldsAndSubmitForm();
        });

        test('should register the user via auth service', () => expect(AuthenticationService.registerUser)
            .toHaveBeenCalledWith({
                ...tb.userRegistration, acceptedTerms: true, ofAge: true
            }));

        test('should store the user via redux action', done => setImmediate(() => {
            expect(tb.storeUserFn).toHaveBeenCalledWith(mockRegisterResponse.user);
            done();
        }));

        test('should store the auth tokens via redux action', done => setImmediate(() => {
            expect(tb.setTokensFn).toHaveBeenCalledWith(mockRegisterResponse.tokens);
            done();
        }));

        test('should navigate to ConnectCodeScreen if successful registration', done => setImmediate(() => {
            expect(tb.dispatchFn).toHaveBeenCalledWith(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'ConnectCodeScreen'}]
                })
            );
            done();
        }));

        test('should display overlay with loading indicator', () => expect(
            tb.wrapper.exists('LoadingView')
        ).toBe(true));

        test('should display error if auth service throws in promise', done => {
            AuthenticationService.registerUser = jest.fn().mockRejectedValue(new Error('Some API Error Message'));

            tb.checkFieldsAndSubmitForm();

            setImmediate(() => {
                expect(tb.wrapper.find('Text[data-testid=\'error-message\']').render().text()).toEqual('Some API Error Message');
                done();
            });
        });
    });
});

class AcceptTermsScreenTestBed {
    userRegistration: UserRegistration = {
        firstName: 'Gerry',
        lastName: 'Fletcher',
        email: 'admin@two.com',
        password: 'P?4Ot2ONz:IJO&%U',
        acceptedTerms: false,
        ofAge: false,
        receivesEmails: false
    };

    navigateFn = jest.fn();
    dispatchFn = jest.fn();
    storeUserFn = jest.fn();
    setTokensFn = jest.fn();

    wrapper = shallow(<AcceptTermsScreen
        navigation={{
            navigate: this.navigateFn,
            dispatch: this.dispatchFn
        } as any}
        route={{params: {userRegistration: this.userRegistration}} as any}
        storeUnconnectedUser={this.storeUserFn} storeTokens={this.setTokensFn}/>);

    tickTermsAndConditions = () => this.wrapper.find('AcceptBox[data-testid=\'terms\']').prop<(v: boolean) => void>('onEmit')(true);
    tickAge = () => this.wrapper.find('AcceptBox[data-testid=\'age\']').prop<(v: boolean) => void>('onEmit')(true);
    isSubmitEnabled = () => !this.wrapper.find('SubmitButton').prop<boolean>('disabled');
    checkFieldsAndSubmitForm = () => {
        this.tickTermsAndConditions();
        this.tickAge();
        this.wrapper.find('SubmitButton').prop<() => void>('onSubmit')();
    };

    whenRegisterUserResolve = (response: UserResponse) => {
        AuthenticationService.registerUser = jest.fn().mockResolvedValue(response);
        return this;
    };
}