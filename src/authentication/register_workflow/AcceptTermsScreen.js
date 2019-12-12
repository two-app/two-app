// @flow

import React, {useState} from "react";
import {ScrollView, Text} from "react-native";
import {Wrapper} from "../../views/View";
import AcceptBox from "./AcceptSwitch";
import LogoHeader from "../LogoHeader";
import SubmitButton from "../../forms/SubmitButton";

const AcceptTermsScreen = () => {
    const [agreed, setAgreed] = useState({termsAndConditions: false, age: false, email: false});
    const validAgreedState = agreed.termsAndConditions && agreed.age;

    return (
        <Wrapper>
            <ScrollView style={{paddingLeft: '10%', paddingRight: '10%', paddingBottom: '10%'}}>
                <LogoHeader heading="Terms & Conditions"/>
                <AcceptBox onEmit={accepted => setAgreed({...agreed, termsAndConditions: accepted})}
                           id="terms"
                           required>
                    I agree to the <Text style={{fontWeight: "bold"}}>Terms & Conditions</Text> and
                    <Text style={{fontWeight: "bold"}}> Privacy Policy.</Text>
                </AcceptBox>
                <AcceptBox onEmit={accepted => setAgreed({...agreed, age: accepted})}
                           id="age"
                           required>
                    I am over the age of 16.
                </AcceptBox>
                <AcceptBox onEmit={accepted => setAgreed({...agreed, email: accepted})}>
                    I agree to occasionally receive emails from Two.
                </AcceptBox>
                <SubmitButton onSubmit={() => {}} text="Accept" disabled={!validAgreedState}/>
            </ScrollView>
        </Wrapper>
    );
};

AcceptTermsScreen.navigationOptions = {
    title: 'Terms & Conditions',
    header: null
};

export default AcceptTermsScreen;