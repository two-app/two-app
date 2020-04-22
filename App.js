/**
 * @format
 */

import React from 'react';
import { Provider } from "react-redux";
import { persistor, store } from "./src/state/reducers";
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from "./Router";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default () =>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <AppStack />
                </NavigationContainer>
            </SafeAreaProvider>
        </PersistGate>
    </Provider>;