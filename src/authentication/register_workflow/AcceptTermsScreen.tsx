import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import AcceptBox from './AcceptSwitch';
import LogoHeader from '../LogoHeader';
import SubmitButton from '../../forms/SubmitButton';
import {WrapperContainer} from '../../views/View';
import Colors from '../../Colors';
import {NavigationActions, StackActions} from 'react-navigation';
import {connect} from 'react-redux';
import {storeUser} from '../UserReducer';
import AuthenticationService, {UserResponse} from '../AuthenticationService';
import {setTokens} from '../AuthenticationReducer';
import LoadingView from '../../views/LoadingView';
import {NavigationStackProp} from 'react-navigation-stack';
import {UserRegistration} from './UserRegistrationModel';

type AcceptTermsScreenProps = {
    navigation: NavigationStackProp,
    storeUser: any,
    setTokens: any
}

const AcceptTermsScreen = ({navigation, storeUser, setTokens}: AcceptTermsScreenProps) => {
    const [userRegistration, setUserRegistration] = useState<UserRegistration>(navigation.getParam('userRegistration'));
    const validAgreedState = userRegistration.acceptedTerms && userRegistration.ofAge;

    const [submitted, setSubmitted] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    const navigateToConnectCodeScreen = () => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'ConnectCodeScreen'})]
        })
    );

    if (submitted) {
        AuthenticationService.registerUser(userRegistration).then((response: UserResponse) => {
            storeUser({...response.user});
            setTokens({...response.tokens});
            navigateToConnectCodeScreen();
        }).catch((e: Error) => {
            setSubmitted(false);
            setRegistrationError(e.message);
        });
    }

    return <>
        {submitted && <LoadingView/>}
        <WrapperContainer>
            <LogoHeader heading="Terms & Conditions"/>
            <AcceptBox onEmit={acceptedTerms => setUserRegistration({...userRegistration, acceptedTerms})}
                       data-testid="terms"
                       required>
                I agree to the <Text style={{fontWeight: 'bold'}}>Terms & Conditions</Text> and
                <Text style={{fontWeight: 'bold'}}> Privacy Policy.</Text>
            </AcceptBox>
            <AcceptBox onEmit={ofAge => setUserRegistration({...userRegistration, ofAge})}
                       data-testid="age"
                       required>
                I am over the age of 16.
            </AcceptBox>
            <AcceptBox onEmit={receivesEmails => setUserRegistration({...userRegistration, receivesEmails})}>
                I agree to occasionally receive emails from Two.
            </AcceptBox>

            <SubmitButton onSubmit={() => setSubmitted(true)} text="Accept" disabled={!validAgreedState}/>
            {registrationError && <Text style={styles.error} data-testid="error-message">{registrationError}</Text>}
        </WrapperContainer>
    </>;
};

AcceptTermsScreen.navigationOptions = {
    title: 'Terms & Conditions',
    header: null
};

const styles = StyleSheet.create({
    error: {
        color: Colors.DARK_SALMON
    }
});

export default connect(null, {storeUser, setTokens})(AcceptTermsScreen);
export {AcceptTermsScreen};