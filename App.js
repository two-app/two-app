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

const navigator = createStackNavigator({
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
    AcceptTermsScreen: {screen: AcceptTermsScreen}
}, {
    initialRouteName: "Login"
});

const App = createAppContainer(navigator);
export default App;
