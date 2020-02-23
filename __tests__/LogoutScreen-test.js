

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';
import {LogoutScreen} from "../src/LogoutScreen";
import {persistor} from "../src/state/reducers";

describe('LogoutScreen', () => {
    const clearStateFn = jest.fn();
    const persistFn = jest.spyOn(persistor, "persist");
    const navigateFn = jest.fn();

    beforeAll(() => {
        act(() => create(
            <LogoutScreen
                clearState={clearStateFn}
                navigation={{navigate: navigateFn}}
            />
        ));
    });

    test('it should clear the state', () => {
        expect(clearStateFn).toHaveBeenCalledTimes(1);
    });

    test('it should persist the state', () => {
        expect(persistFn).toHaveBeenCalledTimes(1);
    });

    test('it should navigate to the LoginScreen', () => {
        expect(navigateFn).toHaveBeenCalledTimes(1);
        expect(navigateFn).toHaveBeenCalledWith("LoginScreen");
    });
});