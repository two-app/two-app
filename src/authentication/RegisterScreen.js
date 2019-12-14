// @flow

import React, {useState} from "react";
import Input from "../forms/Input";
import {WrapperContainer} from "../views/View";
import EmailValidator from "../forms/EmailValidator";
import LogoHeader from "./LogoHeader";
import SubmitButton from "../forms/SubmitButton";
import {isUserRegistrationValid, UserRegistration} from "./UserRegistration";

const RegisterScreen = ({navigation}) => {
    const [userRegistration: UserRegistration, setUserRegistration] = useState(UserRegistration);

    return (
        <WrapperContainer>
            <LogoHeader heading="Sign Up"/>

            <Input attributes={{placeholder: "First Name", autoCompleteType: "name"}}
                   isValid={v => v.length > 2} label={"First Name"}
                   onEmit={firstName => setUserRegistration({...userRegistration, firstName})}
            />

            <Input attributes={{placeholder: "Last Name"}}
                   isValid={v => v.length > 2} label={"Last Name"}
                   onEmit={lastName => setUserRegistration({...userRegistration, lastName})}
            />

            <Input attributes={{placeholder: "you@email.com", autoCompleteType: "email"}}
                   isValid={v => EmailValidator.validateEmail(v)} label={"Email"}
                   onEmit={email => setUserRegistration({...userRegistration, email})}
            />

            <Input attributes={{placeholder: "Secure Password", autoCompleteType: "password", secureTextEntry: true}}
                   isValid={v => v.length > 3}
                   label={"Password"}
                   onEmit={password => setUserRegistration({...userRegistration, password})}
            />

            <SubmitButton text="Join Two"
                          onSubmit={() => navigation.navigate("AcceptTermsScreen", {userRegistration})}
                          id="submit"
                          disabled={!isUserRegistrationValid(userRegistration)}
            />
        </WrapperContainer>
    );
};

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;