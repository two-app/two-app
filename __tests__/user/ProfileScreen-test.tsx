import {Text} from 'react-native';
import React from 'react';
import type {RenderAPI} from '@testing-library/react-native';
import {render, fireEvent, cleanup} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {CommonActions} from '@react-navigation/native';
import Config from 'react-native-config';
import uuidv4 from 'uuidv4';

import {ProfileScreen} from '../../src/user/ProfileScreen';
import type {UserProfile} from '../../src/user/UserService';
import UserService from '../../src/user/UserService';
import type {User} from '../../src/authentication/UserModel';

const mockOpenURLFn = jest.fn().mockResolvedValue({});

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockOpenURLFn,
}));

describe('PartnerScreen', () => {
  let tb: PartnerScreenTestBed;

  beforeEach(() => {
    mockOpenURLFn.mockClear();
    tb = new PartnerScreenTestBed().build();
  });
  afterEach(cleanup);

  test('should display the users first and last name', () =>
    expect(
      tb.wrapper.getByText(
        `${tb.userProfile.firstName} ${tb.userProfile.lastName}`,
      ),
    ).toBeTruthy());

  test('should display the partners first and last name', () =>
    expect(
      tb.wrapper.getByText(
        `${tb.partnerProfile.firstName} ${tb.partnerProfile.lastName}`,
      ),
    ).toBeTruthy());

  // test('should have a Manage Tags link', () => expect(
  //   tb.wrapper.getByA11yLabel('Manage Tags')
  // ).toBeTruthy());

  // test('should have a Location Settings link', () => expect(
  //   tb.wrapper.getByA11yLabel('Location Settings')
  // ).toBeTruthy());

  // test('should have a Terms & Conditions link', () => expect(
  //   tb.wrapper.getByA11yLabel('Terms and Conditions')
  // ).toBeTruthy());

  describe('Submit Feedback', () => {
    test('should have a Submit Feedback link', () =>
      expect(tb.wrapper.getByA11yLabel('Submit Feedback')).toBeTruthy());

    test('should create an email to feedback@two.date', () => {
      const feedbackButton = tb.wrapper.getByA11yLabel('Submit Feedback');

      fireEvent.press(feedbackButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(
        'mailto:feedback@two.date?subject=Feedback&body=Let%20us%20know%20how%20to%20improve...',
      );
    });
  });

  describe('Report Problem', () => {
    test('should have a Report Problem link', () =>
      expect(tb.wrapper.getByA11yLabel('Report a Problem')).toBeTruthy());

    test('should create an email to report@two.date', () => {
      const reportButton = tb.wrapper.getByA11yLabel('Report a Problem');

      fireEvent.press(reportButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(
        'mailto:problem@two.date?subject=Report%20a%20Problem&body=Let%20us%20know%what%went%wrong...',
      );
    });
  });

  describe('Privacy Policy', () => {
    test('should have a Privacy Policy link', () =>
      expect(tb.wrapper.getByA11yLabel('Privacy Policy')).toBeTruthy());

    test('should direct user to the privacy URL', () => {
      const privacyButton = tb.wrapper.getByA11yLabel('Privacy Policy');

      fireEvent.press(privacyButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(tb.privacyPolicyURL);
    });
  });

  describe('Logout', () => {
    test('should have a Logout link', () =>
      expect(tb.wrapper.getByA11yLabel('Logout')).toBeTruthy());

    test('should log the user out on press', () => {
      const logoutButton = tb.wrapper.getByA11yLabel('Logout');

      fireEvent.press(logoutButton);

      expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
      expect(tb.dispatchFn).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LogoutScreen'}],
        }),
      );
    });
  });
});

class PartnerScreenTestBed {
  user: User = {uid: uuidv4(), pid: uuidv4(), cid: uuidv4()};
  userProfile: UserProfile = {...this.user, firstName: 'ABC', lastName: '123'};
  partnerProfile: UserProfile = {
    uid: this.user.pid,
    pid: this.user.uid,
    cid: this.user.cid,
    firstName: 'XYZ',
    lastName: '789',
  };
  privacyPolicyURL = 'test_privacy_policy_url';

  dispatchFn = jest.fn();
  wrapper: RenderAPI = render(<Text>Not Implemented</Text>);

  constructor() {
    UserService.getSelf = jest.fn().mockResolvedValue(this.userProfile);
    Config.PRIVACY_POLICY_URL = this.privacyPolicyURL;
  }

  build = (): PartnerScreenTestBed => {
    this.wrapper = render(
      <SafeAreaProvider
        initialSafeAreaInsets={{top: 1, left: 2, right: 3, bottom: 4}}>
        <ProfileScreen
          dispatch={{} as any}
          navigation={{dispatch: this.dispatchFn} as any}
          user={this.user}
        />
      </SafeAreaProvider>,
    );
    return this;
  };
}
