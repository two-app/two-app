import {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {ScrollContainer} from '../views/View';
import Colors from '../Colors';
import {Input} from '../forms/Input';
import type {ErrorResponse} from '../http/Response';

import {LogoHeader} from './LogoHeader';
import {resetNavigate, Screen} from '../navigation/NavigationUtilities';
import {PrimaryButton} from '../forms/SubmitButton';
import {Form, isFormInvalid} from '../forms/Form';
import F from '../forms/Form';
import AuthenticationService from './AuthenticationService';
import {validateEmail} from '../forms/Validators';

type LoginForm = {
  email: string;
  password: string;
};

export const LoginScreen = ({navigation}: Screen<'LoginScreen'>) => {
  const [form, setForm] = useState<Form<LoginForm>>({
    email: F.str,
    password: F.str,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();

  const login = () => {
    setSubmitted(true);
    AuthenticationService.login(F.data(form))
      .then(() => resetNavigate('LoadingScreen', navigation))
      .catch((e: ErrorResponse) => {
        setSubmitted(false);
        setError(e.reason);
      });
  };

  return (
    <ScrollContainer keyboardShouldPersistTaps="always">
      <LogoHeader heading="Sign In" />

      <Input
        placeholder="Email Address"
        onEmit={email => setForm({...form, email})}
        isValid={validateEmail}
        autoComplete="email"
        autoCapitalize="none"
        accessibilityLabel="Email"
        icon={{provider: IonIcon, name: 'mail-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Input
        placeholder="Secure Password"
        onEmit={password => setForm({...form, password})}
        isValid={password => password.length >= 6}
        autoComplete="password"
        secureTextEntry={true}
        accessibilityLabel="Password"
        icon={{provider: IonIcon, name: 'lock-closed-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <PrimaryButton
        accessibilityLabel="Press to Login"
        onPress={login}
        loading={submitted}
        disabled={isFormInvalid(form)}
        style={{marginVertical: 20}}>
        Sign In
      </PrimaryButton>

      {error && (
        <Text
          style={{color: Colors.DARK_SALMON}}
          accessibilityHint="Login error">
          {error}
        </Text>
      )}

      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Text style={{color: Colors.REGULAR}}>Here to join?</Text>
        <TouchableOpacity
          style={{marginLeft: 5}}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'RegisterScreen'}],
            })
          }
          accessibilityLabel="Register a new account">
          <Text style={{fontWeight: 'bold', color: Colors.DARK}}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollContainer>
  );
};
