import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import AcceptBox from './AcceptSwitch';
import LogoHeader from '../LogoHeader';
import SubmitButton from '../../forms/SubmitButton';
import {WrapperContainer} from '../../views/View';
import Colors from '../../Colors';
import {connect, ConnectedProps} from 'react-redux';
import AuthenticationService, {UserResponse} from '../AuthenticationService';
import LoadingView from '../../views/LoadingView';
import {UserRegistration} from './UserRegistrationModel';
import {storeUnconnectedUser} from '../../user';
import {UnconnectedUser} from '../UserModel';
import {storeTokens} from '../store';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Router';
import {CommonActions, RouteProp} from '@react-navigation/native';

const mapState = null;
const mapDispatch = {storeUnconnectedUser, storeTokens};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type AcceptTermsScreenProps = ConnectorProps & {
    navigation: StackNavigationProp<RootStackParamList, 'AcceptTermsScreen'>;
    route: RouteProp<RootStackParamList, 'AcceptTermsScreen'>;
};

const AcceptTermsScreen = ({navigation, route, storeUnconnectedUser, storeTokens}: AcceptTermsScreenProps) => {
    const [userRegistration, setUserRegistration] = useState<UserRegistration>(route.params.userRegistration);
    const validAgreedState = userRegistration.acceptedTerms && userRegistration.ofAge;

    const [submitted, setSubmitted] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);
    const navigateToConnectCodeScreen = () => navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: 'ConnectCodeScreen'}]
        })
    );

    if (submitted) {
        AuthenticationService.registerUser(userRegistration).then((response: UserResponse) => {
            storeUnconnectedUser(response.user as UnconnectedUser);
            storeTokens(response.tokens);
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

const styles = StyleSheet.create({
    error: {
        color: Colors.DARK_SALMON
    }
});

export default connector(AcceptTermsScreen);
export {AcceptTermsScreen};