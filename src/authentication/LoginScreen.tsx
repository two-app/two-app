import React from "react";
import {Button, Text} from "react-native";
import {Wrapper} from "../views/View";
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>
}

const LoginScreen = ({navigation}: LoginScreenProps) => <Wrapper>
    <Text>Sign In</Text>
    <Button title={"Sign Up"} onPress={() => navigation.navigate('RegisterScreen')}/>
</Wrapper>;

LoginScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default LoginScreen;