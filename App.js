/* eslint-disable react/jsx-filename-extension */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {AppStack} from './Router';

export default () => (
  <NavigationContainer>
    <AppStack />
  </NavigationContainer>
);
