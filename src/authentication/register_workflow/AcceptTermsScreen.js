// @flow

import React, {useState} from "react";
import {Text} from "react-native";
import AcceptBox from "./AcceptSwitch";
import LogoHeader from "../LogoHeader";
import SubmitButton from "../../forms/SubmitButton";
import {WrapperContainer} from "../../views/View";
import {UserRegistration} from "../UserRegistration";

const AcceptTermsScreen = ({navigation}) => {
    const [userRegistration: UserRegistration, setUserRegistration] = useState(navigation.getParam("userRegistration"));
    const validAgreedState = userRegistration.acceptedTerms && userRegistration.isOfAge;

    return (
        <WrapperContainer>
            <LogoHeader heading="Terms & Conditions"/>
            <AcceptBox onEmit={accepted => setUserRegistration({...userRegistration, acceptedTerms: accepted})}
                       id="terms"
                       required>
                I agree to the <Text style={{fontWeight: "bold"}}>Terms & Conditions</Text> and
                <Text style={{fontWeight: "bold"}}> Privacy Policy.</Text>
            </AcceptBox>
            <AcceptBox onEmit={accepted => setUserRegistration({...userRegistration, isOfAge: accepted})}
                       id="age"
                       required>
                I am over the age of 16.
            </AcceptBox>
            <AcceptBox onEmit={accepted => setUserRegistration({...userRegistration, receivesEmails: accepted})}>
                I agree to occasionally receive emails from Two.
            </AcceptBox>
            <SubmitButton onSubmit={() => {
            }} text="Accept" disabled={!validAgreedState}/>
        </WrapperContainer>
    );
};

AcceptTermsScreen.navigationOptions = {
    title: 'Terms & Conditions',
    header: null
};

export default AcceptTermsScreen;