/**
 * @format
 * @flow
 */

import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "./src/authentication/LoginScreen";
import {createAppContainer} from "react-navigation";
import RegisterScreen from "./src/authentication/RegisterScreen";

const navigator = createStackNavigator({
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen}
}, {
    initialRouteName: "Login"
});

const App = createAppContainer(navigator);
export default App;
