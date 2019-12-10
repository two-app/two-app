// @flow

import React from "react";
import {ScrollView, StatusBar, StyleSheet, Text} from "react-native";
import Colors from "../Colors";
import Input from "../forms/Input";
import validateEmail from "../forms/EmailValidator";

const RegisterScreen = ({navigation}) => <>
    <StatusBar/>
    <ScrollView style={{paddingLeft: '10%', paddingRight: '10%', paddingBottom: '10%'}}>
        <Text style={styles.logo}>two.</Text>
        <Text style={styles.heading}>Sign Up</Text>

        <Input attributes={{placeholder: "First Name"}} isValid={v => v.length > 2} label={"First Name"}/>
        <Input attributes={{placeholder: "Last Name"}} isValid={v => v.length > 2} label={"Last Name"}/>
        <Input attributes={{placeholder: "you@email.com"}} isValid={v => validateEmail(v)} label={"Email"}/>
        <Input attributes={{placeholder: "Secure Password"}} isValid={v => v.length > 3} label={"Password"}/>
    </ScrollView>
    {/*<Button style={{marginTop: 200}} title={"Sign In"} onPress={() => navigation.navigate("Login")}/>*/}
</>;

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