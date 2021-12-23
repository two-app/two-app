import {Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {v4 as uuid} from 'uuid';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {LoadingScreen} from '../src/LoadingScreen';
import type {UnconnectedUser, User} from '../src/authentication/UserModel';
import type {Tokens} from '../src/authentication/AuthenticationModel';
import {persistor} from '../src/state/reducers';

import {resetMockNavigation} from './utils/NavigationMocking';

describe('LoadingScreen', () => {
  let tb: LoadingScreenTestBed;

  beforeEach(() => (tb = new LoadingScreenTestBed()));

  describe('With no auth', () => {
    beforeEach(() => tb.build());

    test('state should be cleared non async', () =>
      expect(tb.clearStateFn).toHaveBeenCalled());

    test('navigates to Register Screen', () =>
      expect(tb.dispatchFn).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'RegisterScreen'}],
        }),
      ));

    test('redux should be persisted to local storage', () =>
      expect(tb.persistFn).toHaveBeenCalled());
  });

  describe('With Unconnected Auth', () => {
    const stubUser: UnconnectedUser = {
      uid: uuid(),
    };
    const stubTokens: Tokens = {
      accessToken: 'unconnectedAccess',
      refreshToken: 'unconnectedRefresh',
    };
    beforeEach(() => tb.setUserProp(stubUser).setAuthProp(stubTokens).build());

    test('navigates to Connect Code Screen', () =>
      expect(tb.dispatchFn).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ConnectCodeScreen'}],
        }),
      ));
  });

  describe('With Connected Auth', () => {
    const stubUser: User = {uid: uuid(), pid: uuid(), cid: uuid()};
    const stubTokens: Tokens = {
      accessToken: 'connectedAccess',
      refreshToken: 'connectedRefresh',
    };
    beforeEach(() => tb.setUserProp(stubUser).setAuthProp(stubTokens).build());

    test('navigates to Home Screen', () =>
      expect(tb.dispatchFn).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        }),
      ));
  });
});

class LoadingScreenTestBed {
  dispatchFn = jest.fn();
  clearStateFn = jest.fn();
  userProp: User | UnconnectedUser | null = null;
  authProp: Tokens | null = null;
  persistFn = jest.spyOn(persistor, 'persist');

  render: RenderAPI = render(<Text>Not Implemented</Text>);

  setUserProp = (user: User | UnconnectedUser) => {
    this.userProp = user;
    return this;
  };

  setAuthProp = (auth: Tokens) => {
    this.authProp = auth;
    return this;
  };

  build = (): LoadingScreenTestBed => {
    resetMockNavigation();
    this.render = render(
      <LoadingScreen
        navigation={{dispatch: this.dispatchFn} as any}
        clearState={this.clearStateFn as any}
        user={this.userProp as any}
        auth={this.authProp as any}
      />,
    );
    return this;
  };
}
