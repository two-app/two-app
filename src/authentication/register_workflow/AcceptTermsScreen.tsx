import React, {useState} from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import type {NavigationProp, RouteProp} from '@react-navigation/native';
import {useNavigation, CommonActions, useRoute} from '@react-navigation/native';
import Config from 'react-native-config';

import LogoHeader from '../LogoHeader';
import SubmitButton from '../../forms/SubmitButton';
import {ScrollContainer} from '../../views/View';
import Colors from '../../Colors';
import AuthenticationService from '../AuthenticationService';
import type {RootStackParamList} from '../../../Router';
import type {ErrorResponse} from '../../http/Response';

import type {UserRegistration} from './UserRegistrationModel';
import AcceptBox from './AcceptSwitch';

type ScreenRouteProp = RouteProp<RootStackParamList, 'AcceptTermsScreen'>;

type ScreenNavProp = NavigationProp<RootStackParamList, 'AcceptTermsScreen'>;

const AcceptTermsScreen = () => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNavProp>();

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
      .then(() => navigateToConnectCodeScreen())
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
          accessibilityHint="I agree to the privacy policy."
          onEmit={acceptedTerms =>
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
          accessibilityHint="I am over the age of 16."
          onEmit={ofAge => setUserRegistration({...userRegistration, ofAge})}
          data-testid="age"
          required>
          I am over the age of 16.
        </AcceptBox>
        <AcceptBox
          accessibilityHint="I agree to occasionally receive emails from Two."
          onEmit={receivesEmails =>
            setUserRegistration({...userRegistration, receivesEmails})
          }>
          I agree to occasionally receive emails from Two.
        </AcceptBox>

        <SubmitButton
          onSubmit={() => setSubmitted(true)}
          text="Accept"
          disabled={!validAgreedState}
          accessibilityLabel="Press to submit terms and conditions"
        />
        {registrationError && (
          <Text
            style={styles.error}
            accessibilityHint={registrationError}
            accessibilityLabel="Something went wrong with your registration.">
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

export {AcceptTermsScreen};
