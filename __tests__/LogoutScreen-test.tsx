import {render, RenderAPI} from '@testing-library/react-native';
import {mockNavigation, mockNavigationProps} from './utils/NavigationMocking';
import {CommonActions} from '@react-navigation/native';
import {LogoutScreen} from '../src/LogoutScreen';
import {Text} from 'react-native';
import {Tokens} from '../src/authentication/AuthenticationModel';
import {useAuthStore} from '../src/authentication/AuthenticationStore';

describe('LogoutScreen', () => {
  beforeEach(() => new LogoutScreenTestBed().build());

  test('it should navigate to the LoginScreen', () => {
    expect(mockNavigation.dispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigation.dispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      }),
    );
  });

  test('it should clear the state', () => {
    expect(useAuthStore.getState().tokens).toEqual(undefined);
  });
});

class LogoutScreenTestBed {
  render: RenderAPI = render(<Text>Not Implemented</Text>);

  tokens: Tokens = {
    accessToken: 'test-access',
    refreshToken: 'test-refresh',
  };

  build = (): LogoutScreenTestBed => {
    useAuthStore.setState({tokens: this.tokens});
    this.render = render(<LogoutScreen {...mockNavigationProps()} />);
    return this;
  };
}
