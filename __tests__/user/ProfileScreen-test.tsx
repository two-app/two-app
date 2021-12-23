import {Text} from 'react-native';
import type {RenderAPI} from '@testing-library/react-native';
import {render, fireEvent} from '@testing-library/react-native';
import {CommonActions} from '@react-navigation/native';
import Config from 'react-native-config';
import {uuid} from 'uuidv4';

import {ProfileScreen} from '../../src/user/ProfileScreen';
import * as CoupleService from '../../src/couple/CoupleService';
import {mockNavigation, resetMockNavigation} from '../utils/NavigationMocking';
import {clearState, store} from '../../src/state/reducers';
import {storeCoupleProfile} from '../../src/user/profile/profile-state';
import {Couple} from '../../src/couple/CoupleService';
import {Provider} from 'react-redux';

const mockOpenURLFn = jest.fn().mockResolvedValue({});

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: mockOpenURLFn,
}));

describe('PartnerScreen', () => {
  let tb: PartnerScreenTestBed;

  beforeEach(() => (tb = new PartnerScreenTestBed().build()));

  test('should display the users first and last name', () => {
    expect(
      tb.render.getByText(
        `${tb.couple.user.firstName} ${tb.couple.user.lastName}`,
      ),
    ).toBeTruthy();
  });

  test('should have a Location Settings link', () => {
    expect(tb.render.getByA11yLabel('Location Settings')).toBeTruthy();
  });

  test('should have a Terms & Conditions link', () => {
    expect(tb.render.getByA11yLabel('Terms and Conditions')).toBeTruthy();
  });

  describe('Submit Feedback', () => {
    test('should have a Submit Feedback link', () => {
      expect(tb.render.getByA11yLabel('Submit Feedback')).toBeTruthy();
    });

    test('should create an email to feedback@two.date', () => {
      const feedbackButton = tb.render.getByA11yLabel('Submit Feedback');

      fireEvent.press(feedbackButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(
        'mailto:feedback@two.date?subject=Feedback&body=Let%20us%20know%20how%20to%20improve...',
      );
    });
  });

  describe('Report Problem', () => {
    test('should have a Report Problem link', () =>
      expect(tb.render.getByA11yLabel('Report a Problem')).toBeTruthy());

    test('should create an email to report@two.date', () => {
      const reportButton = tb.render.getByA11yLabel('Report a Problem');

      fireEvent.press(reportButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(
        'mailto:problem@two.date?subject=Report%20a%20Problem&body=Let%20us%20know%what%went%wrong...',
      );
    });
  });

  describe('Privacy Policy', () => {
    test('should have a Privacy Policy link', () =>
      expect(tb.render.getByA11yLabel('Privacy Policy')).toBeTruthy());

    test('should direct user to the privacy URL', () => {
      const privacyButton = tb.render.getByA11yLabel('Privacy Policy');

      fireEvent.press(privacyButton);

      expect(mockOpenURLFn).toHaveBeenCalledTimes(1);
      expect(mockOpenURLFn).toHaveBeenCalledWith(tb.privacyPolicyURL);
    });
  });

  describe('Logout', () => {
    test('should have a Logout link', () =>
      expect(tb.render.getByA11yLabel('Logout')).toBeTruthy());

    test('should log the user out on press', () => {
      const logoutButton = tb.render.getByA11yLabel('Logout');

      fireEvent.press(logoutButton);

      expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
      expect(mockNavigation.dispatch).toHaveBeenCalledWith(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'LogoutScreen'}],
        }),
      );
    });
  });
});

class PartnerScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  uid = uuid();
  pid = uuid();
  cid = uuid();

  couple: Couple = {
    cid: this.cid,
    user: {
      uid: this.uid,
      cid: this.cid,
      email: 'user@two.date',
      firstName: 'UserFirst',
      lastName: 'UserLast',
      createdAt: '',
      updatedAt: '',
      acceptedTerms: true,
      receivesEmails: true,
      ofAge: true,
    },
    partner: {
      uid: this.pid,
      cid: this.cid,
      email: 'partner@two.date',
      firstName: 'PartnerFirst',
      lastName: 'PartnerLast',
      createdAt: '',
      updatedAt: '',
      acceptedTerms: true,
      receivesEmails: true,
      ofAge: true,
    },
  };

  privacyPolicyURL = 'test_privacy_policy_url';

  constructor() {
    this.onFetchCoupleResolve(this.couple);
    Config.PRIVACY_POLICY_URL = this.privacyPolicyURL;
  }

  // request/response mocks
  private fetchCoupleSpy = jest.spyOn(CoupleService, 'fetchCouple');

  onFetchCoupleResolve = (couple: Couple) =>
    this.fetchCoupleSpy.mockResolvedValueOnce(couple);

  build = (): PartnerScreenTestBed => {
    resetMockNavigation();
    store.dispatch(clearState());
    store.dispatch(storeCoupleProfile(this.couple));
    mockOpenURLFn.mockClear();
    this.render = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>,
    );
    return this;
  };
}
