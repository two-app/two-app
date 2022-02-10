import {Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {v4 as uuid} from 'uuid';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {LoadingScreen} from '../src/LoadingScreen';
import type {UnconnectedUser, User} from '../src/authentication/UserModel';
import type {Tokens} from '../src/authentication/AuthenticationModel';
import {persistor, store} from '../src/state/reducers';

import {
  mockNavigation,
  mockNavigationProps,
  resetMockNavigation,
} from './utils/NavigationMocking';
import {Provider} from 'react-redux';
import {storeUnconnectedUser, storeUser} from '../src/user';
import {storeTokens} from '../src/authentication/store';
import {BASE_STATE} from './helpers/StateHelper';

describe('LoadingScreen', () => {
  let tb: LoadingScreenTestBed;

  beforeEach(() => (tb = new LoadingScreenTestBed()));

  describe('With no auth', () => {
    beforeEach(() => tb.build());

    test('state should be cleared non async', () => {
      expect(store.getState()).toEqual(BASE_STATE);
    });

    test('navigates to Register Screen', () =>
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'RegisterScreen'}],
        }),
      ));

    test('redux should be persisted to local storage', () => {
      expect(tb.persistFn).toHaveBeenCalled();
    });
  });

  describe('With Unconnected Auth', () => {
    const stubUser: UnconnectedUser = {
      uid: uuid(),
    };
    const stubTokens: Tokens = {
      accessToken: 'unconnectedAccess',
      refreshToken: 'unconnectedRefresh',
    };

    beforeEach(() =>
      tb.setUnconnectedUser(stubUser).setTokens(stubTokens).build(),
    );

    test('navigates to Connect Code Screen', () => {
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ConnectCodeScreen'}],
        }),
      );
    });
  });

  describe('With Connected Auth', () => {
    const stubUser: User = {uid: uuid(), pid: uuid(), cid: uuid()};
    const stubTokens: Tokens = {
      accessToken: 'connectedAccess',
      refreshToken: 'connectedRefresh',
    };

    beforeEach(() => tb.setUser(stubUser).setTokens(stubTokens).build());

    test('navigates to Home Screen', () => {
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        }),
      );
    });
  });
});

class LoadingScreenTestBed {
  persistFn = jest.spyOn(persistor, 'persist');
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  setUser = (user: User) => {
    store.dispatch(storeUser(user));
    return this;
  };

  setUnconnectedUser = (user: UnconnectedUser) => {
    store.dispatch(storeUnconnectedUser(user));
    return this;
  };

  setTokens = (auth: Tokens) => {
    store.dispatch(storeTokens(auth));
    return this;
  };

  build = (): LoadingScreenTestBed => {
    resetMockNavigation();
    this.render = render(
      <Provider store={store}>
        <LoadingScreen {...mockNavigationProps()} />,
      </Provider>,
    );
    return this;
  };
}
