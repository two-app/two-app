import {useEffect} from 'react';
import {Text} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {ScrollContainer} from './views/View';
import {Route, Screen} from './navigation/NavigationUtilities';
import {useAuthStore} from './authentication/AuthenticationStore';

export const LoadingScreen = ({navigation}: Screen<'LoadingScreen'>) => {
  const authStore = useAuthStore();

  const nav = (route: Route) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: route}],
      }),
    );
  };

  useEffect(() => {
    if (authStore.tokens != null && authStore.user != null) {
      // User and auth tokens are present, user is either in connect or connected phase of workflow
      authStore.user.connected ? nav('HomeScreen') : nav('ConnectCodeScreen');
    } else {
      // Navigate to logout screen to clear state and refresh
      nav('LogoutScreen');
    }
  }, []);

  return (
    <ScrollContainer>
      <Text>Loading...</Text>
    </ScrollContainer>
  );
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
