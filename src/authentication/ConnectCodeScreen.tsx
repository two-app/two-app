import {validate as isUuid} from 'uuid';
import {v4 as uuid} from 'uuid';
import {useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import HapticFeedback from 'react-native-haptic-feedback';
import {ScrollContainer} from '../views/View';
import {LogoHeader} from './LogoHeader';
import Colors from '../Colors';
import {Input} from '../forms/Input';
import {resetNavigate, Screen} from '../navigation/NavigationUtilities';
import ConnectService from '../user/ConnectService';
import type {ErrorResponse} from '../http/Response';
import AuthenticationService from './AuthenticationService';
import type {User} from './UserModel';
import {PrimaryButton} from '../forms/SubmitButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {HR} from '../forms/HorizontalRule';
import F, {Form} from '../forms/Form';
import moment from 'moment';
import {useAuthStore} from './AuthenticationStore';

type ConnectForm = {
  toUser: string;
  anniversary: string;
};

export const ConnectCodeScreen = ({
  navigation,
}: Screen<'ConnectCodeScreen'>) => {
  const [form, setForm] = useState<Form<ConnectForm>>({
    toUser: F.str,
    anniversary: F.str,
  });
  const [submitted, setSubmitted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();

  const authStore = useAuthStore();

  const connectToPartner = () => {
    setSubmitted(true);
    const data = F.data(form);
    AuthenticationService.connectUser({...data, cid: uuid()})
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
    ConnectService.checkConnection()
      .then((isConnected: boolean) => {
        if (isConnected) {
          resetNavigate('HomeScreen', navigation);
        } else {
          setRefreshing(false);
        }
      })
      .catch((e: ErrorResponse) => {
        setError(e.reason);
        setSubmitted(false);
        setRefreshing(false);
      });
  };

  return (
    <ScrollContainer
      refreshControl={
        <RefreshControl
          colors={['#9Bd35A', '#689F38']}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            refresh();
          }}
        />
      }>
      <LogoHeader heading="Connect To Your Partner" />
      <Text style={{marginTop: 10}}>
        Send your code, or enter theirs below.
      </Text>

      <CopyConnectCodeButton code={authStore.user!.uid} />

      <HR />

      <Text style={{...styles.subheading}}>
        Partner's Code & Anniversary Date
      </Text>

      <Input
        placeholder="Partner's Connect Code"
        accessibilityLabel="Partner Code"
        onEmit={toUser => setForm({...form, toUser})}
        isValid={isUuid}
        autoCorrect={false}
        icon={{provider: IonIcon, name: 'finger-print-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Text style={styles.inputHint}>YYYY-MM-DD</Text>
      <Input
        placeholder="Anniversary Date"
        accessibilityLabel="Anniversary Date"
        onEmit={anniversary => setForm({...form, anniversary})}
        isValid={dob => {
          const m = moment(dob, 'YYYY-MM-DD', true);
          return m.isValid() && m.year() <= new Date().getFullYear();
        }}
        returnKeyType="done"
        keyboardType="numeric"
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
        accessibilityLabel="Logout"
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
