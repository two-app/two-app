import {View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {Route, Screen} from './navigation/NavigationUtilities';
import {useAuthStore} from './authentication/AuthenticationStore';
import {useEffect} from 'react';

export const LoadingScreen = ({navigation}: Screen<'LoadingScreen'>) => {
  const nav = (route: Route) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: route}],
      }),
    );
  };

  const {user, tokens, hasHydrated} = useAuthStore();

  useEffect(() => {
    if (hasHydrated) {
      if (tokens != null && user != null) {
        // User and auth tokens are present, user is either in connect or connected phase of workflow
        user.connected ? nav('HomeScreen') : nav('ConnectCodeScreen');
      } else {
        // Navigate to logout screen to clear state and refresh
        nav('LogoutScreen');
      }
    }
  }, [hasHydrated]);

  return <View style={{flex: 1}} />;
};

export class LoadingStatus {
  loading: boolean;
  displayRefresh: boolean;
  error?: string;

  constructor(loading: boolean, displayRefresh?: boolean, error?: string) {
    this.loading = loading;
    this.displayRefresh = displayRefresh || false;
    this.error = error;
  }

  beginLoading = (displayRefresh?: boolean): LoadingStatus => {
    return new LoadingStatus(true, displayRefresh, undefined);
  };

  endLoading = (error?: string): LoadingStatus => {
    return new LoadingStatus(false, false, error);
  };
}

export const loading = new LoadingStatus(true);
