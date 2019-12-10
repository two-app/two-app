/**
 * @format
 * @flow
 */

import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "./src/authentication/LoginScreen";
import {createAppContainer} from "react-navigation";

const navigator = createStackNavigator({
    Login: {screen: LoginScreen}
}, {
    initialRouteName: "Login"
});

const App = createAppContainer(navigator);
export default App;