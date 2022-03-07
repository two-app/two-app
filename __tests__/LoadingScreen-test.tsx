import {Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {v4 as uuid} from 'uuid';
import type {RenderAPI} from '@testing-library/react-native';
import {render} from '@testing-library/react-native';

import {LoadingScreen} from '../src/LoadingScreen';
import type {
  MixedUser,
  UnconnectedUser,
  User,
} from '../src/authentication/UserModel';
import type {Tokens} from '../src/authentication/AuthenticationModel';
import {mockNavigation, mockNavigationProps} from './utils/NavigationMocking';
import {useAuthStore} from '../src/authentication/AuthenticationStore';
import jwtEncode from 'jwt-encode';

describe('LoadingScreen', () => {
  let tb: LoadingScreenTestBed;

  beforeEach(() => (tb = new LoadingScreenTestBed()));

  describe('With no auth', () => {
    beforeEach(() => tb.build());

    test('navigates to LogoutScreen', () => {
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LogoutScreen'}],
        }),
      );
    });
  });

  describe('With Unconnected Auth', () => {
    const user: UnconnectedUser = {
      uid: uuid(),
    };

    beforeEach(() => tb.setUser(user).build());

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
    const user: User = {uid: uuid(), pid: uuid(), cid: uuid()};

    beforeEach(() => tb.setUser(user).build());

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
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  setUser = (user: MixedUser) => {
    const token: string = jwtEncode(user, '');
    this.setTokens({accessToken: token, refreshToken: token});
    return this;
  };

  setTokens = (auth: Tokens) => {
    useAuthStore.getState().set(auth);
    return this;
  };

  build = (): LoadingScreenTestBed => {
    this.render = render(<LoadingScreen {...mockNavigationProps()} />);
    return this;
  };
}
