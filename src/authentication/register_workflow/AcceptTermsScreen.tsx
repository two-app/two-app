import {useState} from 'react';
import {Text, View, Linking} from 'react-native';
import {useNavigation, CommonActions, useRoute} from '@react-navigation/native';
import Config from 'react-native-config';

import {LogoHeader} from '../LogoHeader';
import {SubmitButton} from '../../forms/SubmitButton';
import {ScrollContainer} from '../../views/View';
import Colors from '../../Colors';
import AuthenticationService from '../AuthenticationService';
import type {ErrorResponse} from '../../http/Response';

import type {UserRegistration} from './UserRegistrationModel';
import {AcceptSwitch} from './AcceptSwitch';
import {Route, Routes} from '../../navigation/RootNavigation';
import uuidv4 from 'uuidv4';

export const AcceptTermsScreen = () => {
  const route = useRoute<Route<'AcceptTermsScreen'>>();
  const navigation = useNavigation<Routes>();
  const uid = uuidv4();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [reg, setReg] = useState<UserRegistration>(
    route.params.userRegistration,
  );

  const validAgreedState = reg.acceptedTerms && reg.ofAge;

  const navigateToConnectCodeScreen = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'ConnectCodeScreen'}],
      }),
    );

  const onSubmit = () => {
    setLoading(true);
    AuthenticationService.registerUser({...reg, uid})
      .then(() => navigateToConnectCodeScreen())
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(false));
  };

  return (
    <ScrollContainer isLoading={loading}>
      <View>
        <LogoHeader heading="Terms & Conditions" />

        <AcceptSwitch
          accessibilityLabel="I agree to the privacy policy."
          onEmit={acceptedTerms => setReg({...reg, acceptedTerms})}
          required>
          I agree to the{' '}
          <Text
            style={{fontWeight: 'bold'}}
            onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
            Privacy Policy.
          </Text>
        </AcceptSwitch>

        <AcceptSwitch
          accessibilityLabel="I am over the age of 16."
          onEmit={ofAge => setReg({...reg, ofAge})}
          required>
          I am over the age of 16.
        </AcceptSwitch>

        <AcceptSwitch
          accessibilityLabel="I agree to occasionally receive emails from Two."
          onEmit={receivesEmails => setReg({...reg, receivesEmails})}>
          I agree to occasionally receive emails from Two.
        </AcceptSwitch>

        <SubmitButton
          onSubmit={onSubmit}
          text="Accept"
          disabled={!validAgreedState}
          accessibilityLabel="Press to submit terms and conditions"
        />

        {error != '' && (
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
