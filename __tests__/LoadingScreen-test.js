

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';
import {LoadingScreen} from "../src/LoadingScreen";
import {UnconnectedUser, User} from "../src/authentication/UserModel";
import {Tokens} from "../src/authentication/AuthenticationModel";
import {NavigationActions, StackActions} from "react-navigation";
import {persistor} from "../src/state/reducers";

describe('LoadingScreen', () => {

    let tb: LoadingScreenTestBed;

    beforeEach(() => tb = new LoadingScreenTestBed());

    describe('With no auth', () => {
        beforeEach(() => tb.build());

        test('state should be cleared non async', () => expect(tb.clearStateFn).toHaveBeenCalled());

        test('navigates to Register Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: "RegisterScreen"})]
            })
        ));

        test('redux should be persisted to local storage', () => expect(tb.persistFn).toHaveBeenCalled());
    });

    describe('With Unconnected Auth', () => {
        const stubUser = new UnconnectedUser(1, "testConnectCode");
        const stubTokens = new Tokens("unconnectedAccess", "unconnectedRefresh");
        beforeEach(() => tb.setUserProp(stubUser, stubTokens).setAuthProp(stubTokens).build());

        test('navigates to Connect Code Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: "ConnectCodeScreen"})]
            })
        ));
    });

    describe('With Connected Auth', () => {
        const stubUser = new User(1, 2, 3);
        const stubTokens = new Tokens("connectedAccess", "connectedRefresh");
        beforeEach(() => tb.setUserProp(stubUser, stubTokens).setAuthProp(stubTokens).build());

        test('navigates to Home Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: "HomeScreen"})]
            })
        ));
    });

});

class LoadingScreenTestBed {
    dispatchFn = jest.fn();
    clearStateFn = jest.fn();
    userProp: null;
    authProp: null;
    persistFn = jest.spyOn(persistor, "persist");

    setUserProp = (user: User | UnconnectedUser) => {
        this.userProp = user;
        return this;
    };

    setAuthProp = (auth: Tokens) => {
        this.authProp = auth;
        return this;
    };

    build = () => act(() => create(
        <LoadingScreen
            navigation={{dispatch: this.dispatchFn}}
            clearState={this.clearStateFn}
            user={this.userProp}
            auth={this.authProp}
        />
    ));
}