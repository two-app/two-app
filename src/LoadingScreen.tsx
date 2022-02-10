import {useEffect} from 'react';
import {Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';

import {ScrollContainer} from './views/View';
import type {TwoState} from './state/reducers';
import {clearState, persistor} from './state/reducers';
import {UserState} from './user';
import {AuthState} from './authentication/store';
import {Screen} from './navigation/NavigationUtilities';

const LoadingScreen = ({navigation}: Screen<'LoadingScreen'>) => {
  const dispatch = useDispatch();
  const user: UserState | undefined = useSelector((s: TwoState) => s.user);
  const auth: AuthState | undefined = useSelector((s: TwoState) => s.auth);

  const nav = (route: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: route}],
      }),
    );
  };

  useEffect(() => {
    if (user != null && auth != null) {
      // user and auth tokens are present, user is either in connect or connected phase of workflow
      user.pid != null ? nav('HomeScreen') : nav('ConnectCodeScreen');
    } else {
      // clearing state to ensure user is in clean startup
      dispatch(clearState());
      persistor.persist();
      nav('RegisterScreen');
    }
  }, []);

  return (
    <ScrollContainer>
      <Text>Loading...</Text>
    </ScrollContainer>
  );
};

export {LoadingScreen};

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
