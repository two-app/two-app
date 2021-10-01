/* eslint-disable react/jsx-filename-extension */

import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {persistor, store} from './src/state/reducers';
import {AppStack} from './Router';
import {navigationRef} from './src/navigation/RootNavigation';

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AppStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);
