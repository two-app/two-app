import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';
import {LoadingScreen} from '../src/LoadingScreen';
import {UnconnectedUser, User} from '../src/authentication/UserModel';
import {Tokens} from '../src/authentication/AuthenticationModel';
import {NavigationActions, StackActions} from 'react-navigation';
import {persistor} from '../src/state/reducers';

describe('LoadingScreen', () => {

    let tb: LoadingScreenTestBed;

    beforeEach(() => tb = new LoadingScreenTestBed());

    describe('With no auth', () => {
        beforeEach(() => tb.build());

        test('state should be cleared non async', () => expect(tb.clearStateFn).toHaveBeenCalled());

        test('navigates to Register Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'RegisterScreen'})]
            })
        ));

        test('redux should be persisted to local storage', () => expect(tb.persistFn).toHaveBeenCalled());
    });

    describe('With Unconnected Auth', () => {
        const stubUser: UnconnectedUser = {uid: 1, connectCode: 'testConnectCode'};
        const stubTokens = new Tokens('unconnectedAccess', 'unconnectedRefresh');
        beforeEach(() => tb.setUserProp(stubUser).setAuthProp(stubTokens).build());

        test('navigates to Connect Code Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'ConnectCodeScreen'})]
            })
        ));
    });

    describe('With Connected Auth', () => {
        const stubUser: User = {uid: 1, pid: 2, cid: 3};
        const stubTokens = new Tokens('connectedAccess', 'connectedRefresh');
        beforeEach(() => tb.setUserProp(stubUser).setAuthProp(stubTokens).build());

        test('navigates to Home Screen', () => expect(tb.dispatchFn).toHaveBeenCalledWith(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'HomeScreen'})]
            })
        ));
    });

});

class LoadingScreenTestBed {
    dispatchFn = jest.fn();
    clearStateFn = jest.fn();
    userProp: User | UnconnectedUser | null = null;
    authProp: Tokens | null = null;
    persistFn = jest.spyOn(persistor, 'persist');

    setUserProp = (user: User | UnconnectedUser) => {
        this.userProp = user;
        return this;
    };

    setAuthProp = (auth: Tokens) => {
        this.authProp = auth;
        return this;
    };

    build = () => act(() => {
        create(
            <LoadingScreen
                navigation={{dispatch: this.dispatchFn} as any}
                clearState={this.clearStateFn as any}
                user={this.userProp as any}
                auth={this.authProp as any}
            />
        );
    });
}