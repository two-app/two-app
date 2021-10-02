import {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import SubmitButton from '../forms/SubmitButton';
import {ScrollContainer} from '../views/View';
import Input from '../forms/Input';
import Colors from '../Colors';
import {resetNavigate} from '../navigation/NavigationUtilities';
import type {Routes} from '../navigation/RootNavigation';

import UserRegistrationModel, {
  UserRegistration,
} from './register_workflow/UserRegistrationModel';
import {LogoHeader} from './LogoHeader';

const RegisterScreen = () => {
  const navigation = useNavigation<Routes>();
  const [userRegistration, setUserRegistration] = useState(
    new UserRegistration(),
  );

  return (
    <ScrollContainer keyboardShouldPersistTaps="handled">
      <LogoHeader heading="Create Account" />

      <Input
        attributes={{placeholder: 'First Name', autoCompleteType: 'name'}}
        isValid={UserRegistrationModel.isFirstNameValid}
        label={'First Name'}
        accessibilityLabel="First Name"
        onChange={firstName =>
          setUserRegistration({...userRegistration, firstName})
        }
      />

      <Input
        attributes={{placeholder: 'Last Name'}}
        isValid={UserRegistrationModel.isLastNameValid}
        label={'Last Name'}
        accessibilityLabel="Last Name"
        onChange={lastName =>
          setUserRegistration({...userRegistration, lastName})
        }
      />

      <Input
        attributes={{
          placeholder: 'you@email.com',
          autoCompleteType: 'email',
          autoCapitalize: 'none',
        }}
        isValid={UserRegistrationModel.isEmailValid}
        label={'Email'}
        accessibilityLabel="Email"
        onChange={email => setUserRegistration({...userRegistration, email})}
      />

      <Input
        attributes={{
          placeholder: 'Secure Password',
          autoCompleteType: 'password',
          secureTextEntry: true,
        }}
        isValid={UserRegistrationModel.isPasswordValid}
        label={'Password'}
        accessibilityLabel="Password"
        onChange={password =>
          setUserRegistration({...userRegistration, password})
        }
      />

      <SubmitButton
        text="Join Two"
        onSubmit={() =>
          navigation.navigate('AcceptTermsScreen', {userRegistration})
        }
        disabled={
          !UserRegistrationModel.isUserRegistrationValid(userRegistration)
        }
        accessibilityLabel="Press to Register"
      />

      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Text style={{color: Colors.REGULAR}}>Already a member?</Text>
        <TouchableOpacity
          style={{marginLeft: 5}}
          onPress={() => resetNavigate('LoginScreen', navigation)}
          accessibilityLabel="Press to login">
          <Text style={{fontWeight: 'bold', color: Colors.DARK}}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 40}} />
    </ScrollContainer>
  );
};

export default RegisterScreen;
