import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../Router';

import {clearState, persistor} from './state/reducers';
import {resetNavigate} from './navigation/NavigationUtilities';

type LogoutScreenProps = {
  clearState: any;
  navigation: StackNavigationProp<RootStackParamList, 'LogoutScreen'>;
};

const LogoutScreen = ({clearState, navigation}: LogoutScreenProps) => {
  useEffect(() => {
    clearState();
    persistor.persist();
    resetNavigate('LoginScreen', navigation);
  }, []);
  return (
    <>
      <Text>Logging you out...</Text>
    </>
  );
};

export default connect(() => ({}), {clearState})(LogoutScreen);
export {LogoutScreen};
