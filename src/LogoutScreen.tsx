import {useEffect} from 'react';
import {Text} from 'react-native';
import {useDispatch} from 'react-redux';

import {clearState, persistor} from './state/reducers';
import {resetNavigate, Screen} from './navigation/NavigationUtilities';

const LogoutScreen = ({navigation}: Screen<'LogoutScreen'>) => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearState());
    persistor.persist();
    resetNavigate('LoginScreen', navigation);
  }, []);

  return (
    <>
      <Text>Logging you out...</Text>
    </>
  );
};
export {LogoutScreen};
