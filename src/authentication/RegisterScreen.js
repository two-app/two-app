// @flow

import React from "react";
import {ScrollView} from "react-native";
import Input from "../forms/Input";
import {Wrapper} from "../views/View";
import EmailValidator from "../forms/EmailValidator";
import LogoHeader from "./LogoHeader";
import SubmitButton from "../forms/SubmitButton";

const RegisterScreen = ({navigation}) => <Wrapper>
    <ScrollView style={{paddingLeft: '10%', paddingRight: '10%', paddingBottom: '10%'}}>
        <LogoHeader heading="Sign Up"/>

        <Input attributes={{placeholder: "First Name", autoCompleteType: "name"}}
               isValid={v => v.length > 2} label={"First Name"}/>

        <Input attributes={{placeholder: "Last Name"}}
               isValid={v => v.length > 2} label={"Last Name"}/>

        <Input attributes={{placeholder: "you@email.com", autoCompleteType: "email"}}
               isValid={v => EmailValidator.validateEmail(v)} label={"Email"}/>

        <Input attributes={{placeholder: "Secure Password", autoCompleteType: "password", secureTextEntry: true}}
               isValid={v => v.length > 3}
               label={"Password"}/>

        <SubmitButton text="Join Two" onSubmit={() => navigation.navigate("AcceptTermsScreen")} id="submit"/>
    </ScrollView>
</Wrapper>;

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;