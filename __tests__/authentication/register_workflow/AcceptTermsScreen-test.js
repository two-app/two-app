// @flow

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from "enzyme";
import {AcceptTermsScreen} from "../../../src/authentication/register_workflow/AcceptTermsScreen";
import {UserRegistration} from "../../../src/authentication/register_workflow/UserRegistrationModel";
import AuthenticationService, {UserResponse} from "../../../src/authentication/AuthenticationService";
import {UnconnectedUser} from "../../../src/authentication/UserModel";
import {Tokens} from "../../../src/authentication/AuthenticationModel";

describe('AcceptTermsScreen', () => {
    test('should maintain snapshot', () => expect(renderer.create(<AcceptTermsScreen
        navigation={{getParam: jest.fn().mockReturnValue(UserRegistration)}}/>
    )).toMatchSnapshot());

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
        const mockRegisterResponse = new UserResponse(
            new UnconnectedUser(24, "testConnectCode"),
            new Tokens("testAccess", "testRefresh")
        );

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
            expect(tb.dispatchFn).toHaveBeenCalledWith({
                index: 0,
                type: "Navigation/RESET",
                actions: [{"routeName": "ConnectCodeScreen"}]
            });
            done();
        }));

        test('should display overlay with loading indicator', () => expect(
            tb.wrapper.exists("LoadingView")
        ).toBe(true));

        test('should display error if auth service throws in promise', done => {
            AuthenticationService.registerUser = jest.fn().mockRejectedValue(new Error("Some API Error Message"));

            tb.checkFieldsAndSubmitForm();

            setImmediate(() => {
                expect(tb.wrapper.find("Text[id='error-message']").render().text()).toEqual("Some API Error Message");
                done();
            });
        });
    });
});

class AcceptTermsScreenTestBed {
    userRegistration: UserRegistration = {
        firstName: "Gerry",
        lastName: "Fletcher",
        email: "admin@two.com",
        password: "P?4Ot2ONz:IJO&%U"
    };

    navigateFn = jest.fn();
    dispatchFn = jest.fn();
    storeUserFn = jest.fn();
    setTokensFn = jest.fn();

    wrapper = shallow(<AcceptTermsScreen navigation={{
        getParam: jest.fn().mockReturnValue(this.userRegistration),
        navigate: this.navigateFn,
        dispatch: this.dispatchFn
    }} storeUser={this.storeUserFn} setTokens={this.setTokensFn}/>);

    tickTermsAndConditions = () => this.wrapper.find("AcceptBox[id='terms']").prop("onEmit")(true);
    tickAge = () => this.wrapper.find("AcceptBox[id='age']").prop("onEmit")(true);
    isSubmitEnabled = () => !this.wrapper.find("SubmitButton").prop("disabled");
    checkFieldsAndSubmitForm = () => {
        this.tickTermsAndConditions();
        this.tickAge();
        this.wrapper.find("SubmitButton").prop("onSubmit")();
    };

    whenRegisterUserResolve = (response: UserResponse) => {
        AuthenticationService.registerUser = jest.fn().mockResolvedValue(response);
        return this;
    };
}