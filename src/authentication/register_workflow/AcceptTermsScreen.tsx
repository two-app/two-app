import React, {useState} from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {CommonActions, RouteProp} from '@react-navigation/native';
import Config from 'react-native-config';

import LogoHeader from '../LogoHeader';
import SubmitButton from '../../forms/SubmitButton';
import {ScrollContainer} from '../../views/View';
import Colors from '../../Colors';
import AuthenticationService, {UserResponse} from '../AuthenticationService';
import {storeUnconnectedUser} from '../../user';
import {UnconnectedUser} from '../UserModel';
import {storeTokens} from '../store';
import {RootStackParamList} from '../../../Router';
import {ErrorResponse} from '../../http/Response';

import {UserRegistration} from './UserRegistrationModel';
import AcceptBox from './AcceptSwitch';

const mapState = null;
const mapDispatch = {storeUnconnectedUser, storeTokens};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type AcceptTermsScreenProps = ConnectorProps & {
  navigation: StackNavigationProp<RootStackParamList, 'AcceptTermsScreen'>;
  route: RouteProp<RootStackParamList, 'AcceptTermsScreen'>;
};

const AcceptTermsScreen = ({
  navigation,
  route,
  storeUnconnectedUser,
  storeTokens,
}: AcceptTermsScreenProps) => {
  const [userRegistration, setUserRegistration] = useState<UserRegistration>(
    route.params.userRegistration,
  );
  const validAgreedState =
    userRegistration.acceptedTerms && userRegistration.ofAge;

  const [submitted, setSubmitted] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const navigateToConnectCodeScreen = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'ConnectCodeScreen'}],
      }),
    );

  if (submitted) {
    AuthenticationService.registerUser(userRegistration)
      .then((response: UserResponse) => {
        storeUnconnectedUser(response.user as UnconnectedUser);
        storeTokens(response.tokens);
        navigateToConnectCodeScreen();
      })
      .catch((e: ErrorResponse) => {
        setSubmitted(false);
        setRegistrationError(e.reason);
      });
  }

  return (
    <ScrollContainer isLoading={submitted}>
      <View>
        <LogoHeader heading="Terms & Conditions" />
        <AcceptBox
          onEmit={(acceptedTerms) =>
            setUserRegistration({...userRegistration, acceptedTerms})
          }
          data-testid="terms"
          required>
          I agree to the{' '}
          <Text
            style={{fontWeight: 'bold'}}
            onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
            Privacy Policy.
          </Text>
        </AcceptBox>
        <AcceptBox
          onEmit={(ofAge) => setUserRegistration({...userRegistration, ofAge})}
          data-testid="age"
          required>
          I am over the age of 16.
        </AcceptBox>
        <AcceptBox
          onEmit={(receivesEmails) =>
            setUserRegistration({...userRegistration, receivesEmails})
          }>
          I agree to occasionally receive emails from Two.
        </AcceptBox>

        <SubmitButton
          onSubmit={() => setSubmitted(true)}
          text="Accept"
          disabled={!validAgreedState}
        />
        {registrationError && (
          <Text style={styles.error} data-testid="error-message">
            {registrationError}
          </Text>
        )}
      </View>
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  error: {
    color: Colors.DARK_SALMON,
  },
});

export default connector(AcceptTermsScreen);
export {AcceptTermsScreen};
