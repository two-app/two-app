import {fireEvent, render} from '@testing-library/react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {Text} from 'react-native';
import {Provider} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import uuidv4 from 'uuidv4';

import {AcceptTermsScreen} from '../../../src/authentication/register_workflow/AcceptTermsScreen';
import {clearState, store} from '../../../src/state/reducers';
import {
  mockNavigation,
  mockRoute,
  resetMockNavigation,
} from '../../utils/NavigationMocking';
import type {UserRegistration} from '../../../src/authentication/register_workflow/UserRegistrationModel';
import AuthenticationService from '../../../src/authentication/AuthenticationService';
import type {ErrorResponse} from '../../../src/http/Response';

describe('AcceptTermsScreen', () => {
  let tb: AcceptTermsScreenTestBed;

  beforeEach(() => (tb = new AcceptTermsScreenTestBed().build()));

  describe('submit button enabled/disabled state', () => {
    test('submit button should be disabled', () => {
      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('submit button should be disabled with privacy policy checked', () => {
      tb.tickPrivacyPolicy();

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('submit button should be disabled with age checked', () => {
      tb.tickAge();

      expect(tb.isSubmitEnabled()).toEqual(false);
    });

    test('submit button should be enabled with privacy + age checked', () => {
      tb.tickPrivacyPolicy();
      tb.tickAge();

      expect(tb.isSubmitEnabled()).toEqual(true);
    });
  });

  describe('on successful submit', () => {
    beforeEach(() => {
      // GIVEN
      tb.onRegisterUserResolve();
      tb.tickPrivacyPolicy();
      tb.tickAge();

      // WHEN
      tb.pressSubmit();
    });

    test('it should make a register user request', () => {
      expect(AuthenticationService.registerUser).toHaveBeenCalledWith({
        uid: expect.any(String),
        firstName: 'Gerry',
        lastName: 'Fletcher',
        email: 'admin@two.com',
        password: 'P?4Ot2ONz:IJO&%U',
        acceptedTerms: true,
        ofAge: true,
        receivesEmails: false,
      });
    });

    test('it should navigate to the connect code screen', () => {
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'ConnectCodeScreen'}],
        }),
      );
    });
  });

  describe('on failed submit', () => {
    const registerUserResponse: ErrorResponse = {
      status: 400,
      reason: 'Some API Error Message',
    };

    beforeEach(() => {
      tb.onRegisterUserReject(registerUserResponse);
    });

    test('it should not update the redux store', () => {
      const {auth, user} = store.getState();
      expect(auth).toEqual(null);
      expect(user).toEqual(null);
    });

    test('it should not navigate', () => {
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    test('it should display the response error', () => {
      tb.assertErrorPresent('Something went wrong with your registration.');
    });
  });
});

class AcceptTermsScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  // models

  userRegistration: UserRegistration = {
    firstName: 'Gerry',
    lastName: 'Fletcher',
    email: 'admin@two.com',
    password: 'P?4Ot2ONz:IJO&%U',
    acceptedTerms: false,
    ofAge: false,
    receivesEmails: false,
  };

  // elements

  submitButton = () =>
    this.render.getByA11yLabel('Press to submit terms and conditions');

  // queries

  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  assertErrorPresent = (errorText: string): void => {
    this.render.findByA11yLabel(errorText);
  };

  // events

  pressSubmit = () => fireEvent.press(this.submitButton());

  private changeValue = (label: string, enabled = true) =>
    fireEvent(this.render.getByA11yLabel(label), 'valueChange', enabled);

  tickPrivacyPolicy = () => this.changeValue('I agree to the privacy policy.');
  tickAge = () => this.changeValue('I am over the age of 16.');

  // request/response mocks

  private registerUserSpy = jest.spyOn(AuthenticationService, 'registerUser');

  onRegisterUserResolve = () => {
    this.registerUserSpy.mockResolvedValue({} as any); // calling code doesn't care
  };

  onRegisterUserReject = (response: ErrorResponse) => {
    this.registerUserSpy.mockRejectedValue(response);
  };

  build = (): AcceptTermsScreenTestBed => {
    resetMockNavigation();
    store.dispatch(clearState()); // TODO put these in the jest setup file

    mockRoute.params.userRegistration = this.userRegistration;

    this.render = render(
      <Provider store={store}>
        <AcceptTermsScreen />
      </Provider>,
    );

    return this;
  };
}
