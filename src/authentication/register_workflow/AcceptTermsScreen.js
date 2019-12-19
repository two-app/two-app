// @flow

import React, {useState} from "react";
import {ActivityIndicator, Dimensions, StyleSheet, Text, View} from "react-native";
import AcceptBox from "./AcceptSwitch";
import LogoHeader from "../LogoHeader";
import SubmitButton from "../../forms/SubmitButton";
import {WrapperContainer} from "../../views/View";
import Colors from "../../Colors";
import {UserRegistration} from "./UserRegistrationModel";
import {NavigationActions, StackActions} from "react-navigation";
import {connect} from "react-redux";
import {storeUser} from "../UserReducer";
import AuthenticationService from "../AuthenticationService";

const AcceptTermsScreen = ({navigation, storeUser}) => {
    const [userRegistration: UserRegistration, setUserRegistration] = useState(navigation.getParam("userRegistration"));
    const validAgreedState = userRegistration.acceptedTerms && userRegistration.ofAge;

    const [submitted, setSubmitted] = useState(false);
    const [registrationError, setRegistrationError] = useState(null);

    const navigateToConnectCodeScreen = () => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'ConnectCodeScreen'})]
        })
    );

    if (submitted) {
        AuthenticationService.registerUser(userRegistration).then(response => {
            storeUser(response.user);
            navigateToConnectCodeScreen();
        }).catch((e: Error) => {
            setSubmitted(false);
            setRegistrationError(e.message);
        });
    }

    return (<>
        {submitted && <View style={styles.overlay}>
            <ActivityIndicator size="small" color="black" style={styles.overlayIndicator}/>
        </View>}
        <WrapperContainer>
            <LogoHeader heading="Terms & Conditions"/>
            <AcceptBox onEmit={acceptedTerms => setUserRegistration({...userRegistration, acceptedTerms})}
                       id="terms"
                       required>
                I agree to the <Text style={{fontWeight: "bold"}}>Terms & Conditions</Text> and
                <Text style={{fontWeight: "bold"}}> Privacy Policy.</Text>
            </AcceptBox>
            <AcceptBox onEmit={ofAge => setUserRegistration({...userRegistration, ofAge})}
                       id="age"
                       required>
                I am over the age of 16.
            </AcceptBox>
            <AcceptBox onEmit={receivesEmails => setUserRegistration({...userRegistration, receivesEmails})}>
                I agree to occasionally receive emails from Two.
            </AcceptBox>

            <SubmitButton onSubmit={() => setSubmitted(true)} text="Accept" disabled={!validAgreedState}/>
            {registrationError && <Text style={styles.error} id="error-message">{registrationError}</Text>}
        </WrapperContainer>
    </>);
};

AcceptTermsScreen.navigationOptions = {
    title: 'Terms & Conditions',
    header: null
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        opacity: 0.5,
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    overlayIndicator: {
        zIndex: 3
    },
    error: {
        color: Colors.DARK_SALMON
    }
});

export default connect(null, {storeUser})(AcceptTermsScreen);
export {AcceptTermsScreen};