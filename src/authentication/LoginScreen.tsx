/**
 * @flow
 */

import React from "react";
import {Button, Text} from "react-native";
import {Wrapper} from "../views/View";
import {NavigationStackProp} from 'react-navigation-stack';

type LoginScreenProps = {
    navigation: NavigationStackProp
}

const LoginScreen = ({navigation}: LoginScreenProps) => <Wrapper>
    <Text>Sign In</Text>
    <Button title={"Sign Up"} onPress={() => navigation.navigate('Register')}/>
</Wrapper>;

LoginScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default LoginScreen;