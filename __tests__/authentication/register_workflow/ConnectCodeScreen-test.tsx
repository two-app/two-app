import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import uuidv4 from 'uuidv4';
import {SafeAreaProvider} from 'react-native-safe-area-view';

import type {UnconnectedUser} from '../../../src/authentication/UserModel';
import {ConnectCodeScreen} from '../../../src/authentication/register_workflow/ConnectCodeScreen';
import ConnectService from '../../../src/user/ConnectService';
import type {ErrorResponse} from '../../../src/http/Response';
import AuthenticationService from '../../../src/authentication/AuthenticationService';

describe('ConnectCodeScreen', () => {
  let tb: ConnectCodeScreenTestBed;
  beforeEach(() => (tb = new ConnectCodeScreenTestBed()));

  test('should maintain snapshot', () =>
    expect(
      renderer.create(
        <ConnectCodeScreen
          navigation={{} as any}
          dispatch={{} as any}
          user={tb.user}
        />,
      ),
    ).toMatchSnapshot());

  describe('Clicking the logout button', () => {
    test('it should navigate to the LogoutScreen', () => {
      tb.clickLogout();

      expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('By Default', () => {
    test('submit is disabled', () =>
      expect(tb.isSubmitButtonDisabled()).toBe(true));
  });

  describe('When entered partner code is identical to users code', () => {
    beforeEach(() => tb.setPartnerCodeInput(tb.user.uid));

    test('displays error', () =>
      expect(tb.getErrorText()).toEqual("You can't connect with yourself!"));

    test('validates input', () => expect(tb.isPartnerCodeValid()).toBe(false));

    test('disables submit', () =>
      expect(tb.isSubmitButtonDisabled()).toBe(true));
  });

  describe('When entered code is not 6 characters in length', () => {
    beforeEach(() => tb.setPartnerCodeInput('ab'));

    test('disables submit', () =>
      expect(tb.isSubmitButtonDisabled()).toBe(true));
  });

  describe('When entered code is valid', () => {
    beforeEach(() => tb.setPartnerCodeInput(uuidv4()));

    test('enables submit', () =>
      expect(tb.isSubmitButtonDisabled()).toBe(false));

    test('displays loading view on submit', () => {
      tb.whenConnectResolve();

      tb.clickSubmit();

      expect(
        tb.wrapper.find('ScrollContainer').prop<boolean>('isLoading'),
      ).toBe(true);
    });

    test('it delegates to the AuthenticationService', () => {
      tb.whenConnectResolve();

      tb.clickSubmit();

      expect(AuthenticationService.connectUser).toHaveBeenCalledTimes(1);
    });

    describe('On successful connect', () => {
      test('hides loading view', () => {
        tb.whenConnectResolve();

        tb.clickSubmit();

        expect(tb.wrapper.exists('LoadingView')).toBe(false);
      });
    });

    describe('On failed connect', () => {
      const error: ErrorResponse = {
        code: 400,
        status: '400 Bad Request',
        reason: 'Some API Error Message',
      };
      beforeEach(() => {
        tb.whenConnectReject(error);
        tb.clickSubmit();
      });

      test('hides loading view', () =>
        expect(tb.wrapper.exists('LoadingView')).toBe(false));

      test('displays error message', () =>
        expect(tb.getErrorText()).toEqual(error.reason));
    });
  });
});

class ConnectCodeScreenTestBed {
  user: UnconnectedUser = {uid: uuidv4()};
  dispatchFn = jest.fn();

  wrapper = shallow(
    <SafeAreaProvider
      initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
      <ConnectCodeScreen
        dispatch={{} as any}
        user={this.user}
        navigation={{dispatch: this.dispatchFn} as any}
      />
    </SafeAreaProvider>,
  );

  constructor() {
    ConnectService.checkConnection = jest.fn();
    AuthenticationService.connectUser = jest.fn();
  }

  clickCopyToClipboard = () =>
    this.wrapper.find('TouchableOpacity').prop<() => void>('onPress')();
  setPartnerCodeInput = (v: string) =>
    this.wrapper.find('Input').prop<(v: string) => void>('onChange')(v);
  isPartnerCodeValid = () =>
    this.wrapper.find('Input').prop<() => boolean>('isValid')();
  isSubmitButtonDisabled = () =>
    this.wrapper.find('SubmitButton').prop<boolean>('disabled');
  clickSubmit = () =>
    this.wrapper.find('SubmitButton').prop<() => void>('onSubmit')();
  getErrorText = () =>
    this.wrapper.find("Text[data-testid='error']").render().text();
  clickLogout = () =>
    this.wrapper
      .find("Button[data-testid='logout-button']")
      .prop<() => void>('onPress')();

  whenConnectResolve = () => {
    AuthenticationService.connectUser = jest.fn().mockResolvedValue({});
  };

  whenConnectReject = (error: ErrorResponse) => {
    AuthenticationService.connectUser = jest.fn().mockRejectedValue(error);
  };
}
