/**
 * @flow
 */

import React from "react";
import {Text} from "react-native";
import {Wrapper} from "../views/View";

const LoginScreen = () => <Wrapper><Text>Hello</Text></Wrapper>;

LoginScreen.navigationOptions = {
    title: 'Login',
    header: null
};

export default LoginScreen;