/**
 * @format
 * @flow
 */

import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "./src/authentication/LoginScreen";
import {createAppContainer} from "react-navigation";
import RegisterScreen from "./src/authentication/RegisterScreen";
import AcceptTermsScreen from "./src/authentication/register_workflow/AcceptTermsScreen";
import {Provider} from "react-redux";
import {store, persistor} from "./src/state/reducers";
import HomeScreen from "./src/home/HomeScreen";
import LoadingScreen from "./src/LoadingScreen";
import {PersistGate} from 'redux-persist/integration/react';
import ConnectCodeScreen from "./src/authentication/register_workflow/ConnectCodeScreen";
import LogoutScreen from "./src/LogoutScreen";

const navigator = createStackNavigator({
    LoadingScreen: {screen: LoadingScreen},
    LogoutScreen: {screen: LogoutScreen},
    LoginScreen: {screen: LoginScreen},
    RegisterScreen: {screen: RegisterScreen},
    AcceptTermsScreen: {screen: AcceptTermsScreen},
    ConnectCodeScreen: {screen: ConnectCodeScreen},
    HomeScreen: {screen: HomeScreen},
}, {
    initialRouteName: "LoadingScreen"
});

const Navigation = createAppContainer(navigator);

export default () =>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Navigation/>
        </PersistGate>
    </Provider>;