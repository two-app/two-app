import 'react-native';
// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';
import {CommonActions} from '@react-navigation/native';

import {LogoutScreen} from '../src/LogoutScreen';
import {persistor, store} from '../src/state/reducers';
import {Provider} from 'react-redux';
import {mockNavigation, mockNavigationProps} from './utils/NavigationMocking';
import {storeTokens} from '../src/authentication/store';
import {BASE_STATE} from './helpers/StateHelper';

describe('LogoutScreen', () => {
  const persistFn = jest.spyOn(persistor, 'persist');

  beforeAll(() => {
    store.dispatch(storeTokens({accessToken: 'test', refreshToken: 'test'}));

    act(() => {
      create(
        <Provider store={store}>
          <LogoutScreen {...mockNavigationProps()} />
        </Provider>,
      );
    });
  });

  test('it should clear the state', () => {
    expect(store.getState()).toEqual(BASE_STATE);
  });

  test('it should persist the state', () => {
    expect(persistFn).toHaveBeenCalledTimes(1);
  });

  test('it should navigate to the LoginScreen', () => {
    expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      }),
    );
  });
});
