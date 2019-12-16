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
import CreateAccountScreen from "./src/authentication/register_workflow/CreateAccountScreen";
import ConnectCodeScreen from "./src/authentication/register_workflow/ConnectCodeScreen";

const navigator = createStackNavigator({
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    AcceptTermsScreen: {screen: AcceptTermsScreen},
    CreateAccountScreen: {screen: CreateAccountScreen},
    ConnectCodeScreen: {screen: ConnectCodeScreen}
}, {
    initialRouteName: "Register"
});

const App = createAppContainer(navigator);
export default App;
