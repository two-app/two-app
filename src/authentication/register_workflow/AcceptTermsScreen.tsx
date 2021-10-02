import {useState} from 'react';
import {Text, View, Linking} from 'react-native';
import {useNavigation, CommonActions, useRoute} from '@react-navigation/native';
import Config from 'react-native-config';

import LogoHeader from '../LogoHeader';
import SubmitButton from '../../forms/SubmitButton';
import {ScrollContainer} from '../../views/View';
import Colors from '../../Colors';
import AuthenticationService from '../AuthenticationService';
import type {ErrorResponse} from '../../http/Response';

import type {UserRegistration} from './UserRegistrationModel';
import AcceptBox from './AcceptSwitch';
import {Route, Routes} from '../../navigation/RootNavigation';

export const AcceptTermsScreen = () => {
  const route = useRoute<Route<'AcceptTermsScreen'>>();
  const navigation = useNavigation<Routes>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [registration, setRegistration] = useState<UserRegistration>(
    route.params.userRegistration,
  );

  const validAgreedState = registration.acceptedTerms && registration.ofAge;

  const navigateToConnectCodeScreen = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'ConnectCodeScreen'}],
      }),
    );

  const onSubmit = () => {
    AuthenticationService.registerUser(registration)
      .then(() => navigateToConnectCodeScreen())
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(false));
  };

  return (
    <ScrollContainer isLoading={loading}>
      <View>
        <LogoHeader heading="Terms & Conditions" />
        <AcceptBox
          accessibilityLabel="I agree to the privacy policy."
          onEmit={acceptedTerms =>
            setRegistration({...registration, acceptedTerms})
          }
          required>
          I agree to the{' '}
          <Text
            style={{fontWeight: 'bold'}}
            onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
            Privacy Policy.
          </Text>
        </AcceptBox>
        <AcceptBox
          accessibilityLabel="I am over the age of 16."
          onEmit={ofAge => setRegistration({...registration, ofAge})}
          required>
          I am over the age of 16.
        </AcceptBox>
        <AcceptBox
          accessibilityLabel="I agree to occasionally receive emails from Two."
          onEmit={receivesEmails =>
            setRegistration({...registration, receivesEmails})
          }>
          I agree to occasionally receive emails from Two.
        </AcceptBox>

        <SubmitButton
          onSubmit={onSubmit}
          text="Accept"
          disabled={!validAgreedState}
          accessibilityLabel="Press to submit terms and conditions"
        />

        {error && (
          <Text
            style={{color: Colors.DARK_SALMON}}
            accessibilityHint={error}
            accessibilityLabel="Something went wrong with your registration.">
            {error}
          </Text>
        )}
      </View>
    </ScrollContainer>
  );
};
