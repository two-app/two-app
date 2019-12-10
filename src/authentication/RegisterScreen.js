// @flow

import React from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../Colors";
import Input from "../forms/Input";
import validateEmail from "../forms/EmailValidator";
import {Wrapper} from "../views/View";

const RegisterScreen = ({navigation}) => <Wrapper>
    <ScrollView style={{paddingLeft: '10%', paddingRight: '10%', paddingBottom: '10%'}}>
        <Text style={styles.logo}>two.</Text>
        <Text style={styles.heading}>Sign Up</Text>

        <Input attributes={{placeholder: "First Name", autoCompleteType: "name"}}
               isValid={v => v.length > 2} label={"First Name"}/>

        <Input attributes={{placeholder: "Last Name"}}
               isValid={v => v.length > 2} label={"Last Name"}/>

        <Input attributes={{placeholder: "you@email.com", autoCompleteType: "email"}}
               isValid={v => validateEmail(v)} label={"Email"}/>

        <Input attributes={{placeholder: "Secure Password", autoCompleteType: "password", secureTextEntry: true}}
               isValid={v => v.length > 3}
               label={"Password"}/>

        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.submitText}>Join Two</Text>
        </TouchableOpacity>
    </ScrollView>
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
    },
    submitButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.SALMON,
        padding: 15,
        marginTop: 25,
        marginBottom: 25
    },
    submitText: {
        color: "white",
        fontWeight: "bold"
    }
});

export default RegisterScreen;