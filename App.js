/* eslint-disable react/jsx-filename-extension */

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {persistor, store} from './src/state/reducers';
import {AppStack} from './Router';
import {StatusBar} from 'react-native';

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SafeAreaView style={{flexGrow: 1, backgroundColor: 'white'}}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </SafeAreaView>
    </PersistGate>
  </Provider>
);
