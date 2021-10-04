import {useEffect} from 'react';
import {Text} from 'react-native';
import type {ConnectedProps} from 'react-redux';
import {connect} from 'react-redux';
import type {StackNavigationProp} from '@react-navigation/stack';
import {CommonActions} from '@react-navigation/native';

import type {RootStackParamList} from '../Router';

import {ScrollContainer} from './views/View';
import type {TwoState} from './state/reducers';
import {clearState, persistor} from './state/reducers';

const mapState = (state: TwoState) => ({user: state.user, auth: state.auth});
const mapDispatch = {clearState};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type LoadingScreenProps = ConnectorProps & {
  navigation: StackNavigationProp<RootStackParamList, 'LoadingScreen'>;
};

const LoadingScreen = ({
  navigation,
  user,
  auth,
  clearState,
}: LoadingScreenProps) => {
  const nav = (route: string) =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: route}],
      }),
    );

  useEffect(() => {
    if (user != null && auth != null) {
      // user and auth tokens are present, user is either in connect or connected phase of workflow
      user.pid != null ? nav('HomeScreen') : nav('ConnectCodeScreen');
    } else {
      // clearing state to ensure user is in clean startup
      clearState();
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

export default connector(LoadingScreen);
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
