import {Text} from 'react-native';
import type {ReactTestInstance} from 'react-test-renderer';
import {RenderAPI, waitFor} from '@testing-library/react-native';
import {fireEvent, render} from '@testing-library/react-native';

import {LoginScreen} from '../../src/authentication/LoginScreen';
import AuthenticationService from '../../src/authentication/AuthenticationService';
import type {ErrorResponse} from '../../src/http/Response';
import {
  mockNavigation,
  mockNavigationProps,
  resetMockNavigation,
} from '../utils/NavigationMocking';
import {MixedUser} from '../../src/authentication/UserModel';
import {v4 as uuid} from 'uuid';
import {CommonActions} from '@react-navigation/native';

describe('LoginScreen', () => {
  let tb: LoginScreenTestBed;

  beforeEach(() => (tb = new LoginScreenTestBed().build()));

  test('Pressing create account button should navigate to RegisterScreen', () => {
    tb.pressRegister();

    expect(mockNavigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: 'RegisterScreen'}],
    });
  });

  describe('Form Validation', () => {
    test('the submit button should be disabled by default', () => {
      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('the submit button should be disabled with a valid email but no password', () => {
      tb.setEmailInput('user@two.date');

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('the submit button should be disabled with a valid password but no email', () => {
      tb.setPasswordInput('SoMePassWord');

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('password < 6 in length disables the submit', () => {
      tb.setEmailInput('user@two.date');
      tb.setPasswordInput('hi');

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('invalid email disables the submit', () => {
      tb.setPasswordInput('soMePassWord');
      tb.setEmailInput('invalid email');

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('the submit should be enabled', () => {
      tb.setEmailInput('user@two.date');
      tb.setPasswordInput('SoMePassWord');

      expect(tb.isSubmitEnabled()).toEqual(true);
    });
  });

  describe('On Valid Login', () => {
    test('it should navigate to the connect code screen', async () => {
      tb.setEmailInput('user@two.date');
      tb.setPasswordInput('SoMePassWord');

      await tb.pressSubmit();

      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ConnectCodeScreen'}],
        }),
      );
    });
  });

  describe('On Failed Login', () => {
    test('it should display the error', async () => {
      tb.setEmailInput('user@two.date');
      tb.setPasswordInput('SoMePassWord');
      tb.onLoginReject({
        reason: 'Invalid login combination',
        status: 400,
      });

      await tb.pressSubmit();

      expect(tb.render.queryByText('Invalid login combination')).toBeTruthy();
    });
  });
});

class LoginScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  constructor() {
    this.onLoginResolve({
      uid: uuid(),
    });
  }

  // elements
  submitButton = () => this.render.getByA11yLabel('Press to Login');
  emailInput = () => this.render.getByA11yLabel('Email');
  passwordInput = () => this.render.getByA11yLabel('Password');
  registerButton = () => this.render.getByA11yLabel('Register a new account');

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  isSubmitted = (): boolean =>
    this.submitButton().props.accessibilityState.busy;

  // events
  pressSubmit = async () => {
    fireEvent.press(this.submitButton());
    await waitFor(() => !this.isSubmitted());
  };
  setEmailInput = (e: string) => this.setInput(this.emailInput(), e);
  setPasswordInput = (p: string) => this.setInput(this.passwordInput(), p);
  pressRegister = () => fireEvent.press(this.registerButton());

  private setInput = (input: ReactTestInstance, text: string) => {
    fireEvent.changeText(input, text);
    fireEvent(input, 'blur');
  };

  // request/response mocks
  private loginSpy = jest.spyOn(AuthenticationService, 'login');

  onLoginResolve = (user: MixedUser) => this.loginSpy.mockResolvedValue(user);
  onLoginReject = (e: ErrorResponse) => this.loginSpy.mockRejectedValue(e);

  build = (): LoginScreenTestBed => {
    resetMockNavigation();
    this.render = render(<LoginScreen {...mockNavigationProps()} />);
    return this;
  };
}
