import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';
import {CommonActions} from '@react-navigation/native';

import {LogoutScreen} from '../src/LogoutScreen';
import {persistor} from '../src/state/reducers';

describe('LogoutScreen', () => {
  const clearStateFn = jest.fn();
  const persistFn = jest.spyOn(persistor, 'persist');
  const dispatchFn = jest.fn();

  beforeAll(() => {
    act(() => {
      create(
        <LogoutScreen
          clearState={clearStateFn as any}
          navigation={{dispatch: dispatchFn} as any}
        />,
      );
    });
  });

  test('it should clear the state', () => {
    expect(clearStateFn).toHaveBeenCalledTimes(1);
  });

  test('it should persist the state', () => {
    expect(persistFn).toHaveBeenCalledTimes(1);
  });

  test('it should navigate to the LoginScreen', () => {
    expect(dispatchFn).toHaveBeenCalledTimes(1);
    expect(dispatchFn).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      }),
    );
  });
});
