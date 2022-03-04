import {validate as isUuid} from 'uuid';
import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {useSelector} from 'react-redux';
import HapticFeedback from 'react-native-haptic-feedback';
import {ScrollContainer} from '../views/View';
import {LogoHeader} from './LogoHeader';
import Colors from '../Colors';
import {Input} from '../forms/Input';
import type {TwoState} from '../state/reducers';
import {selectUnconnectedUser} from '../user';
import {resetNavigate, Screen} from '../navigation/NavigationUtilities';
import ConnectService from '../user/ConnectService';
import type {ErrorResponse} from '../http/Response';
import AuthenticationService from './AuthenticationService';
import type {UnconnectedUser, User} from './UserModel';
import {PrimaryButton} from '../forms/SubmitButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {HR} from '../forms/HorizontalRule';
import F, {Form} from '../forms/Form';

type ConnectForm = {
  cc: string;
  anniversary: string;
};

export const ConnectCodeScreen = ({
  navigation,
}: Screen<'ConnectCodeScreen'>) => {
  const [form, setForm] = useState<Form<ConnectForm>>({
    cc: F.str,
    anniversary: F.str,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();

  const user: UnconnectedUser = useSelector((state: TwoState) =>
    selectUnconnectedUser(state.user),
  );

  const connectToPartner = () => {
    setSubmitted(true);
    AuthenticationService.connectUser(F.data(form).cc)
      .then((_: User) => resetNavigate('HomeScreen', navigation))
      .catch(({reason}: ErrorResponse) => {
        if (
          reason === 'User already has a partner.' ||
          reason === 'Invalid JSON Web Token'
        ) {
          refresh();
        } else {
          setError(reason);
          setSubmitted(false);
        }
      });
  };

  const refresh = () => {
    setSubmitted(true);
    ConnectService.checkConnection()
      .then((isConnected: boolean) => {
        if (isConnected) resetNavigate('HomeScreen', navigation);
      })
      .catch((e: ErrorResponse) => {
        setError(e.reason);
        setSubmitted(false);
      });
  };

  return (
    <ScrollContainer keyboardShouldPersistTaps="always">
      <LogoHeader heading="Connect To Your Partner" />
      <Text style={{marginTop: 10}}>
        Send your code, or enter theirs below.
      </Text>

      <CopyConnectCodeButton code={user.uid} />

      <HR />

      <Text style={{...styles.subheading}}>
        Partner's Code & Anniversary Date
      </Text>

      <Input
        placeholder="Partner's Connect Code"
        accessibilityLabel="Partner Code"
        onEmit={cc => setForm({...form, cc})}
        isValid={isUuid}
        autoCorrect={false}
        icon={{provider: IonIcon, name: 'finger-print-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Text style={styles.inputHint}>YYYY-MM-DD</Text>
      <Input
        placeholder="Anniversary Date"
        accessibilityLabel='Anniversary Date'
        onEmit={anniversary => setForm({...form, anniversary})}
        isValid={date => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date)}
        mask={{
          type: 'datetime',
          options: {format: 'YYYY-MM-DD'},
        }}
        icon={{provider: IonIcon, name: 'calendar-outline'}}
      />

      {error != '' && <Text style={styles.error}>{error}</Text>}

      <PrimaryButton
        accessibilityLabel="Connect to Partner"
        loading={submitted}
        onPress={connectToPartner}
        disabled={F.isInvalid(form)}>
        Connect to Partner <IonIcon name="heart" />
      </PrimaryButton>

      <TouchableOpacity
        accessibilityLabel='Logout'
        onPress={() => navigation.navigate('LogoutScreen')}
        style={{marginTop: 40}}>
        <Text style={{color: Colors.REGULAR, fontWeight: '500'}}>Logout</Text>
      </TouchableOpacity>
    </ScrollContainer>
  );
};

const CopyConnectCodeButton = ({code}: {code: string}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    Clipboard.setString(code);
    HapticFeedback.trigger('selection', {enableVibrateFallback: false});
    setCopied(true);
  };

  const buttonColor = copied ? Colors.VALID_GREEN : Colors.LIGHT;
  const textColor = copied ? 'white' : Colors.REGULAR;
  const codeColor = copied ? 'white' : Colors.DARK;

  return (
    <TouchableOpacity
      onPress={onCopy}
      style={[styles.copyButton, {backgroundColor: buttonColor}]}
      accessibilityHint="Copy connect code to clipboard"
      accessibilityState={{checked: copied}}>
      <Text style={[styles.copyTip, {color: textColor, marginBottom: 10}]}>
        {copied ? 'Copied!' : 'Tap to Copy'}
      </Text>

      <Text style={[styles.code, {color: codeColor}]}>{code}</Text>

      <View style={{marginTop: 10}}>
        <IonIcon
          name="finger-print-outline"
          style={[styles.copyTip, {color: textColor}]}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subheading: {
    fontWeight: '600',
    color: Colors.DARK,
    textAlign: 'center',
  },
  paragraph: {
    marginTop: 10,
  },
  copyButton: {
    marginTop: 20,
    padding: 20,
  },
  inputHint: {
    color: Colors.REGULAR,
    fontSize: 10,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 1,
  },
  copyTip: {
    fontWeight: '500',
    textAlign: 'center',
  },
  code: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  error: {
    color: Colors.DARK_SALMON,
    marginTop: 10,
  },
});
