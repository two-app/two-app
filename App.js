/* eslint-disable react/jsx-filename-extension */

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {persistor, store} from './src/state/reducers';
import {AppStack} from './Router';

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </PersistGate>
  </Provider>
);
