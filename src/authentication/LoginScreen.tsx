import {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ScrollContainer} from '../views/View';
import Colors from '../Colors';
import {Input} from '../forms/Input';
import {SubmitButton} from '../forms/SubmitButton';
import type {ErrorResponse} from '../http/Response';
import type {Routes} from '../navigation/RootNavigation';

import {LogoHeader} from './LogoHeader';
import UserRegistrationModel from './register_workflow/UserRegistrationModel';
import type {LoginCredentials} from './AuthenticationService';
import AuthenticationService, {
  areCredentialsValid,
} from './AuthenticationService';

const LoginScreen = () => {
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    email: '',
    rawPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState<string>();

  const navigation = useNavigation<Routes>();

  const login = () => {
    setSubmitted(true);
    AuthenticationService.login(loginCredentials)
      .then(() =>
        navigation.reset({
          index: 0,
          routes: [{name: 'LoadingScreen'}],
        }),
      )
      .catch((e: ErrorResponse) => {
        setSubmitted(false);
        setLoginError(e.reason);
      })
      .finally(() => setSubmitted(false));
  };

  return (
    <ScrollContainer isLoading={submitted} keyboardShouldPersistTaps="always">
      <LogoHeader heading="Sign In" />

      <Input
        attributes={{
          placeholder: 'you@email.com',
          autoCompleteType: 'email',
          autoCapitalize: 'none',
        }}
        isValid={UserRegistrationModel.isEmailValid}
        label={'Email'}
        onChange={email => setLoginCredentials({...loginCredentials, email})}
        accessibilityLabel="Enter your email"
      />

      <Input
        attributes={{
          placeholder: 'Secure Password',
          autoCompleteType: 'password',
          secureTextEntry: true,
        }}
        isValid={UserRegistrationModel.isPasswordValid}
        label={'Password'}
        onChange={password =>
          setLoginCredentials({...loginCredentials, rawPassword: password})
        }
        accessibilityLabel="Enter your password"
      />

      <SubmitButton
        text="Sign In"
        onSubmit={login}
        disabled={!areCredentialsValid(loginCredentials)}
        accessibilityLabel="Press to login"
      />

      {loginError && (
        <Text
          style={{color: Colors.DARK_SALMON}}
          accessibilityHint="Login error">
          {loginError}
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

export {LoginScreen};
