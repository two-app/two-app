import React from "react";
import {Wrapper} from "../views/View";
import {Button, Text} from "react-native";

const RegisterScreen = ({navigation}) => <Wrapper>
    <Text>Sign Up</Text>
    <Button title={"Sign In"} onPress={() => navigation.navigate("Login")}/>
</Wrapper>;

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;