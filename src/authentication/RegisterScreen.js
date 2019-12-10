// @flow

import React from "react";
import {Wrapper} from "../views/View";
import {Button, Text, StyleSheet} from "react-native";
import Colors from "../Colors";
import Input from "../forms/Input";

const RegisterScreen = ({navigation}) => <Wrapper>
    <Text style={styles.logo}>two.</Text>
    <Text style={styles.heading}>Sign Up</Text>
    <Input attributes={{placeholder: "Hello"}} isValid={}/>
    <Button title={"Sign In"} onPress={() => navigation.navigate("Login")}/>
</Wrapper>;

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

const styles = StyleSheet.create({
    logo: {
        color: Colors.SALMON,
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
        color: Colors.DARK
    }
});

export default RegisterScreen;