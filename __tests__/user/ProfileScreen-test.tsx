import 'react-native';
import React from 'react';
import { Text } from 'react-native';
import { render, RenderAPI, fireEvent } from 'react-native-testing-library';
import { ProfileScreen } from '../../src/user/ProfileScreen';
import UserService, { UserProfile } from '../../src/user/UserService';
import PartnerService from '../../src/user/PartnerService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { User } from '../../src/authentication/UserModel';
import { CommonActions } from '@react-navigation/native';


describe('PartnerScreen', () => {
  let tb: PartnerScreenTestBed;

  beforeEach(() => tb = new PartnerScreenTestBed().build());

  test('should display the users first and last name', () => expect(
    tb.wrapper.getByText(`${tb.userProfile.firstName} ${tb.userProfile.lastName}`)
  ).toBeTruthy());

  test('should display the partners first and last name', () => expect(
    tb.wrapper.getByText(`${tb.partnerProfile.firstName} ${tb.partnerProfile.lastName}`)
  ).toBeTruthy());

  test('should have a Manage Tags link', () => expect(
    tb.wrapper.getByA11yLabel('Manage Tags')
  ).toBeTruthy());

  test('should have a Submit Feedback link', () => expect(
    tb.wrapper.getByA11yLabel('Submit Feedback')
  ).toBeTruthy());

  test('should have a Report Problem link', () => expect(
    tb.wrapper.getByA11yLabel('Report a Problem')
  ).toBeTruthy());

  test('should have a Location Settings link', () => expect(
    tb.wrapper.getByA11yLabel('Location Settings')
  ).toBeTruthy());

  test('should have a Terms & Conditions link', () => expect(
    tb.wrapper.getByA11yLabel('Terms and Conditions')
  ).toBeTruthy());

  test('should have a Privacy Policy link', () => expect(
    tb.wrapper.getByA11yLabel('Privacy Policy')
  ).toBeTruthy());

  describe('Logout', () => {
    test('should have a Logout link', () => expect(
      tb.wrapper.getByA11yLabel('Logout')
    ).toBeTruthy());

    test('should log the user out on press', () => {
      const logoutButton = tb.wrapper.getByA11yLabel('Logout');
      
      fireEvent.press(logoutButton);

      expect(tb.dispatchFn).toHaveBeenCalledTimes(1);
      expect(tb.dispatchFn).toHaveBeenCalledWith(CommonActions.reset({
        index: 0,
        routes: [{ name: 'LogoutScreen' }]
      }));
    });
  });
});

class PartnerScreenTestBed {
  user: User = { uid: 1, pid: 2, cid: 3 };
  userProfile: UserProfile = { ...this.user, firstName: 'ABC', lastName: '123' };
  partnerProfile: UserProfile = { uid: 2, pid: 1, cid: 3, firstName: 'XYZ', lastName: '789' };

  dispatchFn = jest.fn();
  wrapper: RenderAPI = render(<Text>Not Implemented</Text>);

  constructor() {
    UserService.getSelf = jest.fn().mockResolvedValue(this.userProfile);
    PartnerService.getPartner = jest.fn().mockResolvedValue(this.partnerProfile);
  }

  build = (): PartnerScreenTestBed => {
    this.wrapper = render(
      <SafeAreaProvider initialSafeAreaInsets={{ top: 1, left: 2, right: 3, bottom: 4 }}>
        <ProfileScreen dispatch={{} as any}
          navigation={{ dispatch: this.dispatchFn } as any}
          user={{ uid: 1, pid: 2, cid: 3 }}
        />
      </SafeAreaProvider>
    );
    return this;
  };
}