import {Text} from 'react-native';
import type {QueryReturn, RenderAPI} from '@testing-library/react-native';
import {
  waitForElementToBeRemoved,
  fireEvent,
  render,
} from '@testing-library/react-native';

import {RegisterScreen} from '../../src/authentication/RegisterScreen';
import {
  mockNavigation,
  mockNavigationProps,
  resetMockNavigation,
} from '../utils/NavigationMocking';
import {CommonActions} from '@react-navigation/native';
import {store} from '../../src/state/reducers';
import AuthenticationService from '../../src/authentication/AuthenticationService';
import { ErrorResponse } from '../../src/http/Response';

describe('RegisterScreen', () => {
  let tb: RegisterScreenTestBed;

  beforeEach(() => (tb = new RegisterScreenTestBed().build()));

  describe('Form Validation', () => {
    const cases: Array<[string, string, boolean]> = [
      ['First Name', 'a', true],
      ['First Name', 'abc', true],
      ['Last Name', 'x', false],
      ['Last Name', 'xyz', true],
      ['Password', 'pass', false],
      ['Password', 'password', true],
      ['Password', 'P?4Ot2ONz:IJO&%U', true],
    ];

    test.each(cases)(
      'Input %s with value %s should be valid: %s',
      (label: string, text: string, expectedToBeValid: boolean) => {
        // GIVEN
        const input = tb.render.getByA11yLabel(label);

        // WHEN
        fireEvent(input, 'onChangeText', text);
        fireEvent(input, 'onBlur');

        // THEN the input should be invalid
        expect(input.props.accessibilityValue).toEqual({
          text: expectedToBeValid ? 'Valid entry' : 'Invalid entry',
        });

        // THEN the submit button should be disabled
        expect(tb.canSubmit()).toEqual(false);
      },
    );

    const emailCases: Array<[string, boolean]> = [
      ['abc', false],
      ['abc@gmail.com', true],
    ];

    test.each(emailCases)(
      'Input Email with value %s should be valid: %s',
      (email: string, expectedToBeValid: boolean) => {
        // GIVEN
        const input = tb.render.getByA11yLabel('Email');

        // WHEN
        fireEvent(input, 'onChangeText', email);
        fireEvent(input, 'onBlur');

        // THEN
        expect(input.props.accessibilityValue).toEqual({
          text: expectedToBeValid ? 'Valid entry' : 'Invalid entry',
        });
      },
    );
  });

  describe('Valid form', () => {
    beforeEach(() => {
      // GIVEN
      const inputs = [
        ['First Name', 'Paul'],
        ['Last Name', 'Atreides'],
        ['Email', 'paul@arrakis.com'],
        ['Password', 'P?4Ot2ONz:IJO&%U'],
        ['Date of Birth', '1997-08-21'],
      ];

      // WHEN
      inputs.forEach(([label, text]) => {
        const input = tb.render.getByA11yLabel(label);
        fireEvent(input, 'onChangeText', text);
        fireEvent(input, 'onBlur');
      });

      const termsSwitch = tb.render.getByA11yLabel('Accept Terms and Conditions');
      fireEvent(termsSwitch, 'onValueChange', true);
    });

    describe("when registration succeeds", () => {
      beforeEach(() => {
        tb.whenRegisterResolve();
        tb.pressSubmit();
      });

      test('it should navigate to the ConnectCodeScreen', () => {
        expect(mockNavigation.dispatch).toHaveBeenCalledWith(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'ConnectCodeScreen'}],
          }),
        );
      });
    });

    describe("when registration fails", () => {
      const error: ErrorResponse = {
        reason: "Registration Failed For Some Reason",
        status: 400
      };

      beforeEach(() => {
        tb.whenRegisterReject(error);
        tb.pressSubmit();
      })

      test('it should stop showing the loading indicator', () => {
        expect(tb.isLoading()).toEqual(false);
      });

      test('it should display the error', () => {
        tb.render.getByText(error.reason);
      });
    })
  });
});

class RegisterScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  // elements
  submitButton = () => this.render.getByA11yLabel('Press to Register');

  // queries
  canSubmit = (): boolean => {
    return !this.submitButton().props.accessibilityState.disabled;
  };

  isLoading = (): QueryReturn => {
    return this.submitButton().props.accessibilityState.busy;
  };

  // events
  pressSubmit = async () => {
    fireEvent.press(this.submitButton());
    await waitForElementToBeRemoved(this.isLoading);
  };

  // mocks
  whenRegisterResolve = () => {
    AuthenticationService.registerUser = jest.fn().mockResolvedValue({
      accessToken: "",
      refreshToken: ""
    });
  };

  whenRegisterReject = (error: ErrorResponse) => {
    AuthenticationService.registerUser = jest.fn().mockRejectedValue(error);
  };

  build = (): RegisterScreenTestBed => {
    resetMockNavigation();
    this.render = render(<RegisterScreen {...mockNavigationProps()} />);
    return this;
  };
}
