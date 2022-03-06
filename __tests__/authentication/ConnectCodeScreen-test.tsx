import {Text} from 'react-native';
import {v4 as uuid} from 'uuid';
import type {RenderAPI} from '@testing-library/react-native';
import {waitFor, fireEvent, render} from '@testing-library/react-native';
import {Provider} from 'react-redux';

import type {UnconnectedUser} from '../../src/authentication/UserModel';
import type {ErrorResponse} from '../../src/http/Response';
import AuthenticationService from '../../src/authentication/AuthenticationService';
import {
  mockNavigation,
  mockNavigationProps,
  resetMockNavigation,
} from '../utils/NavigationMocking';
import {clearState, store} from '../../src/state/reducers';
import {storeUnconnectedUser} from '../../src/user';
import {ConnectCodeScreen} from '../../src/authentication/ConnectCodeScreen';
import {CommonActions} from '@react-navigation/native';

describe('ConnectCodeScreen', () => {
  let tb: ConnectCodeScreenTestBed;
  beforeEach(() => (tb = new ConnectCodeScreenTestBed().build()));

  test('pressing logout should navigate to the LogoutScreen', () => {
    tb.pressLogout();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('LogoutScreen');
  });

  test('submit should be disabled by default', () => {
    expect(tb.isSubmitEnabled()).toBe(false);
  });

  describe('When entered partner code is identical to users code', () => {
    beforeEach(() => tb.setPartnerCode(tb.user.uid));

    test('displays error', async () => {
      await waitFor(() =>
        tb.render.queryByText("You can't connect with yourself!"),
      );
    });

    test('validates input', () => expect(tb.isPartnerCodeValid()).toBe(false));

    test('disables submit', () => expect(tb.isSubmitEnabled()).toBe(false));
  });

  describe('When entered code is not 6 characters in length', () => {
    test('disables submit', () => {
      tb.setPartnerCode('ab');

      expect(tb.isSubmitEnabled()).toBe(false);
    });
  });

  describe('When entered code is valid', () => {
    beforeEach(() => {
      tb.setPartnerCode(uuid());
      tb.setAnniversary('2020-09-25');
    });

    test('enables submit', () => {
      expect(tb.isSubmitEnabled()).toBe(true);
    });

    test('displays loading view on submit', () => {
      tb.whenConnectResolve();

      tb.pressSubmit();

      expect(tb.isSubmitted()).toEqual(true);
    });

    test('it delegates to the AuthenticationService', () => {
      tb.whenConnectResolve();

      tb.pressSubmit();

      expect(AuthenticationService.connectUser).toHaveBeenCalledTimes(1);
    });

    describe('On successful connect', () => {
      test('navigates to the HomeScreen', async () => {
        tb.whenConnectResolve();

        tb.pressSubmit();
        await waitFor(() => !tb.isSubmitted());

        expect(mockNavigation.dispatch).toHaveBeenCalledWith(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeScreen'}],
          }),
        );
      });
    });

    describe('On failed connect', () => {
      const error: ErrorResponse = {
        status: 400,
        reason: 'Some API Error Message',
      };

      beforeEach(() => {
        tb.whenConnectReject(error);
      });

      test('hides loading view', async () => {
        tb.pressSubmit();

        await waitFor(() => !tb.isSubmitted());

        expect(tb.isSubmitted()).toEqual(false);
      });

      test('displays error message', async () => {
        tb.pressSubmit();
        await waitFor(() => tb.render.queryByText(error.reason));
      });
    });
  });
});

class ConnectCodeScreenTestBed {
  user: UnconnectedUser = {uid: uuid()};

  render: RenderAPI = render(<Text>Not Implemented</Text>);

  constructor() {
    this.whenConnectResolve();
  }

  // elements
  codeInput = () => this.render.getByA11yLabel('Partner Code');
  anniversaryInput = () => this.render.getByA11yLabel('Anniversary Date');

  copyButton = () =>
    this.render.getByA11yHint('Copy connect code to clipboard');
  submitButton = () => this.render.getByA11yLabel('Connect to Partner');

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  isPartnerCodeValid = (): boolean =>
    this.codeInput().props.accessibilityValue === 'Valid entry';

  isSubmitted = (): boolean =>
    this.submitButton().props.accessibilityState.busy;

  // events
  setPartnerCode = (pid: string) => fireEvent(this.codeInput(), 'onEmit', pid);
  setAnniversary = (date: string) =>
    fireEvent(this.anniversaryInput(), 'onEmit', date);

  pressLogout = () => fireEvent.press(this.render.getByA11yLabel('Logout'));
  pressSubmit = () => fireEvent.press(this.submitButton());

  // mocks
  whenConnectResolve = () => {
    AuthenticationService.connectUser = jest.fn().mockResolvedValue({});
  };

  whenConnectReject = (error: ErrorResponse) => {
    AuthenticationService.connectUser = jest.fn().mockRejectedValue(error);
  };

  build = (): ConnectCodeScreenTestBed => {
    resetMockNavigation();

    store.dispatch(clearState());
    store.dispatch(storeUnconnectedUser(this.user));

    this.render = render(
      <Provider store={store}>
        <ConnectCodeScreen {...mockNavigationProps()} />
      </Provider>,
    );
    return this;
  };
}
