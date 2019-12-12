// @flow

import React from "react";
import Input from "../forms/Input";
import {WrapperContainer} from "../views/View";
import EmailValidator from "../forms/EmailValidator";
import LogoHeader from "./LogoHeader";
import SubmitButton from "../forms/SubmitButton";

const RegisterScreen = ({navigation}) => (
    <WrapperContainer>
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
    </WrapperContainer>
);

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;