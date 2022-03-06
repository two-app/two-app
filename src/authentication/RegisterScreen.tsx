import {useRef, useState} from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {PrimaryButton} from '../forms/SubmitButton';
import {ScrollContainer} from '../views/View';
import {Input} from '../forms/Input';
import Colors from '../Colors';
import {resetNavigate, Screen} from '../navigation/NavigationUtilities';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {v4 as uuid} from 'uuid';

import {LogoHeader} from './LogoHeader';
import F, {Form} from '../forms/Form';
import {validateEmail} from '../forms/Validators';
import AuthenticationService from './AuthenticationService';
import {MixedUser} from './UserModel';
import {ErrorResponse} from '../http/Response';
import {TextInputMask} from 'react-native-masked-text';
import {UserRegistration} from './AuthenticationModel';
import {HR} from '../forms/HorizontalRule';
import moment from 'moment';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  acceptedTerms: boolean;
};

export const RegisterScreen = ({navigation}: Screen<'RegisterScreen'>) => {
  const [form, setForm] = useState<Form<RegisterForm>>({
    firstName: F.str,
    lastName: F.str,
    email: F.str,
    password: F.str,
    dob: F.str,
    acceptedTerms: [false, false],
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const register = () => {
    setSubmitted(true);

    const registration: UserRegistration = {
      ...F.data(form),
      uid: uuid(),
    };

    AuthenticationService.registerUser(registration)
      .then((_: MixedUser) => resetNavigate('ConnectCodeScreen', navigation))
      .catch((e: ErrorResponse) => {
        setSubmitted(false);
        setError(e.reason);
      });
  };

  const lastNameInput = useRef<TextInput>();
  const emailInput = useRef<TextInput>();
  const passwordInput = useRef<TextInput>();
  const dobInput = useRef<TextInputMask>();

  return (
    <ScrollContainer keyboardShouldPersistTaps="handled">
      <LogoHeader heading="Create Account" />

      <Input
        placeholder="First Name"
        isValid={firstName => firstName.length > 0}
        onSubmitEditing={() => lastNameInput.current?.focus()}
        onEmit={firstName => setForm({...form, firstName})}
        blurOnSubmit={false}
        autoCapitalize="words"
        accessibilityLabel="First Name"
        icon={{provider: IonIcon, name: 'person-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Input
        placeholder="Last Name"
        isValid={lastName => lastName.length > 1}
        onSubmitEditing={() => emailInput.current?.focus()}
        onEmit={lastName => setForm({...form, lastName})}
        blurOnSubmit={false}
        autoCapitalize="words"
        accessibilityLabel="Last Name"
        icon={{provider: IonIcon, name: 'person-outline'}}
        containerStyle={{marginTop: 20}}
        ref={lastNameInput}
      />

      <Input
        placeholder="Email Address"
        isValid={email => validateEmail(email)}
        onSubmitEditing={() => passwordInput.current?.focus()}
        onEmit={email => setForm({...form, email})}
        blurOnSubmit={false}
        autoComplete="email"
        autoCapitalize="none"
        accessibilityLabel="Email"
        keyboardType="email-address"
        icon={{provider: IonIcon, name: 'mail-outline'}}
        containerStyle={{marginTop: 20}}
        ref={emailInput}
      />

      <Input
        placeholder="Secure Password"
        isValid={password => password.length >= 6}
        // @ts-ignore
        onSubmitEditing={() => dobInput.current?._inputElement?.focus()}
        onEmit={password => setForm({...form, password})}
        blurOnSubmit={false}
        autoComplete="password"
        secureTextEntry={true}
        accessibilityLabel="Password"
        icon={{provider: IonIcon, name: 'lock-closed-outline'}}
        containerStyle={{marginTop: 20}}
        ref={passwordInput}
      />

      <Text style={styles.inputHint}>YYYY-MM-DD</Text>
      <Input
        placeholder="Date of Birth"
        accessibilityLabel="Date of Birth"
        isValid={dob => {
          const m = moment(dob, 'YYYY-MM-DD', true);
          const y = new Date().getFullYear() - 13;
          return m.isValid() && m.year() <= y;
        }}
        onEmit={dob => setForm({...form, dob})}
        returnKeyType="done"
        keyboardType="numeric"
        mask={{
          type: 'datetime',
          options: {format: 'YYYY-MM-DD'},
        }}
        icon={{provider: IonIcon, name: 'calendar-outline'}}
        ref={dobInput}
      />

      <HR />

      <View style={{justifyContent: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Switch
            style={styles.switch}
            value={form.acceptedTerms[0] as boolean}
            accessibilityLabel="Accept Terms and Conditions"
            onValueChange={checked =>
              setForm({
                ...form,
                acceptedTerms: [checked, checked === true],
              })
            }
          />
          <Text style={styles.toc}>Terms of Service</Text>
        </View>
        <Text style={styles.condition}>
          I accept the <Text style={styles.link}>Terms & Conditions</Text>, and{' '}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </View>

      <HR />

      <PrimaryButton
        accessibilityLabel="Press to Register"
        disabled={F.isInvalid(form)}
        onPress={register}
        loading={submitted}>
        Join two
      </PrimaryButton>

      {error != '' && (
        <Text
          style={{color: Colors.DARK_SALMON, marginTop: 20}}
          accessibilityHint="Login error">
          {error}
        </Text>
      )}

      <View style={{flexDirection: 'row', marginTop: 30}}>
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

const styles = StyleSheet.create({
  inputHint: {
    color: Colors.REGULAR,
    fontSize: 10,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 1,
  },
  switch: {transform: [{scaleX: 0.8}, {scaleY: 0.8}]},
  toc: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.DARK,
    marginLeft: 5,
    marginTop: 6,
  },
  condition: {
    fontSize: 13,
    color: Colors.REGULAR,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  link: {fontWeight: '600', color: '#376996'},
});
