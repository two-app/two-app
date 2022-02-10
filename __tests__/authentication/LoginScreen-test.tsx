import {Text} from 'react-native';
import type {ReactTestInstance} from 'react-test-renderer';
import type {QueryReturn, RenderAPI} from '@testing-library/react-native';
import {
  waitForElementToBeRemoved,
  fireEvent,
  render,
} from '@testing-library/react-native';

import {LoginScreen} from '../../src/authentication/LoginScreen';
import AuthenticationService from '../../src/authentication/AuthenticationService';
import type {ErrorResponse} from '../../src/http/Response';
import {
  mockNavigation,
  mockNavigationProps,
  resetMockNavigation,
} from '../utils/NavigationMocking';

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
    test('it should navigate to the home screen', async () => {
      tb.setEmailInput('user@two.date');
      tb.setPasswordInput('SoMePassWord');

      await tb.pressSubmit();

      expect(mockNavigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{name: 'LoadingScreen'}],
      });
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
    this.onLoginResolve();
  }

  // elements
  submitButton = () => this.render.getByA11yLabel('Press to login');
  emailInput = () => this.render.getByA11yLabel('Enter your email');
  passwordInput = () => this.render.getByA11yLabel('Enter your password');
  registerButton = () => this.render.getByA11yLabel('Register a new account');

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  queryLoadingScreen = (): QueryReturn => {
    return this.render.queryByA11yHint('Waiting for an action to finish...');
  };

  // events
  pressSubmit = async () => {
    fireEvent.press(this.submitButton());
    await waitForElementToBeRemoved(this.queryLoadingScreen);
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

  onLoginResolve = () => this.loginSpy.mockResolvedValue({} as any);
  onLoginReject = (e: ErrorResponse) => this.loginSpy.mockRejectedValue(e);

  build = (): LoginScreenTestBed => {
    resetMockNavigation();
    this.render = render(<LoginScreen {...mockNavigationProps()} />);
    return this;
  };
}
