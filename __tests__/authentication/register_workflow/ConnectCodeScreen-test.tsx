import {Text} from 'react-native';
import {v4 as uuid} from 'uuid';
import type {QueryReturn, RenderAPI} from '@testing-library/react-native';
import {
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
  render,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';

import type {UnconnectedUser} from '../../../src/authentication/UserModel';
import {ConnectCodeScreen} from '../../../src/authentication/register_workflow/ConnectCodeScreen';
import type {ErrorResponse} from '../../../src/http/Response';
import AuthenticationService from '../../../src/authentication/AuthenticationService';
import {
  mockNavigation,
  resetMockNavigation,
} from '../../utils/NavigationMocking';
import {clearState, store} from '../../../src/state/reducers';
import {storeUnconnectedUser} from '../../../src/user';

describe('ConnectCodeScreen', () => {
  let tb: ConnectCodeScreenTestBed;
  beforeEach(() => (tb = new ConnectCodeScreenTestBed().build()));

  test('pressing logout should navigate to the LogoutScreen', () => {
    tb.pressLogout();

    expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
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
    beforeEach(() => tb.setPartnerCode(uuid()));

    test('enables submit', () => expect(tb.isSubmitEnabled()).toBe(true));

    test('displays loading view on submit', () => {
      tb.whenConnectResolve();

      tb.pressSubmit();

      expect(tb.queryLoadingScreen()).toBeTruthy();
    });

    test('it delegates to the AuthenticationService', () => {
      tb.whenConnectResolve();

      tb.pressSubmit();

      expect(AuthenticationService.connectUser).toHaveBeenCalledTimes(1);
    });

    describe('On successful connect', () => {
      test('hides loading view', async () => {
        tb.whenConnectResolve();

        tb.pressSubmit();

        await waitForElementToBeRemoved(tb.queryLoadingScreen);
        expect(tb.queryLoadingScreen()).toBeFalsy();
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

      test('hides loading view 2', async () => {
        tb.pressSubmit();

        await waitForElementToBeRemoved(tb.queryLoadingScreen);
        expect(tb.queryLoadingScreen()).toBeFalsy();
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
  copyButton = () =>
    this.render.getByA11yHint('Copy connect code to clipboard');
  logoutButton = () => this.render.getByA11yLabel('Tap to logout');

  codeInput = () => this.render.getByA11yLabel('Enter partner code');
  submitButton = () => this.render.getByA11yLabel('Press to connect');

  // queries
  isSubmitEnabled = (): boolean =>
    !this.submitButton().props.accessibilityState.disabled;

  isPartnerCodeValid = (): boolean =>
    this.codeInput().props.accessibilityValue === 'Valid entry';

  queryLoadingScreen = (): QueryReturn =>
    this.render.queryByA11yHint('Waiting for an action to finish...');

  // events
  setPartnerCode = (pid: string) => fireEvent.changeText(this.codeInput(), pid);
  pressLogout = () => fireEvent.press(this.logoutButton());
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
        <ConnectCodeScreen />
      </Provider>,
    );
    return this;
  };
}
