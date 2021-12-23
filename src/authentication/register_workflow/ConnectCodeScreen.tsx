import 'react-native-get-random-values';
import {isUuid} from 'uuidv4';
import {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  RefreshControl,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {useSelector} from 'react-redux';
import HapticFeedback from 'react-native-haptic-feedback';
import {useNavigation} from '@react-navigation/native';

import {ScrollContainer} from '../../views/View';
import {LogoHeader} from '../LogoHeader';
import Colors from '../../Colors';
import {Input} from '../../forms/Input';
import {SubmitButton} from '../../forms/SubmitButton';
import type {TwoState} from '../../state/reducers';
import {selectUnconnectedUser} from '../../user';
import {Button, ButtonStyles} from '../../forms/Button';
import {resetNavigate} from '../../navigation/NavigationUtilities';
import ConnectService from '../../user/ConnectService';
import type {ErrorResponse} from '../../http/Response';
import AuthenticationService from '../AuthenticationService';
import type {Routes} from '../../navigation/RootNavigation';
import type {UnconnectedUser, User} from '../UserModel';

export const ConnectCodeScreen = () => {
  const user: UnconnectedUser = useSelector((state: TwoState) =>
    selectUnconnectedUser(state.user),
  );

  const [partnerConnectCode, setPartnerConnectCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const isPartnerCodeValid = (): boolean =>
    isUuid(partnerConnectCode) && partnerConnectCode !== user.uid;

  const navigation = useNavigation<Routes>();

  const connectToPartner = (uid: string) => {
    setError('');
    setLoading(true);
    AuthenticationService.connectUser(uid)
      .then((updatedUser: User) => {
        console.log(
          `Successfully connected, updated to: ${JSON.stringify(
            updatedUser,
          )}. Navigating to HomeScreen.`,
        );
        resetNavigate('HomeScreen', navigation);
      })
      .catch(({reason}: ErrorResponse) => {
        if (
          reason === 'User already has a partner.' ||
          reason === 'Invalid JSON Web Token'
        ) {
          refresh();
        } else {
          setError(reason);
        }
      })
      .finally(() => setLoading(false));
  };

  const refresh = () => {
    setError('');
    setRefreshing(true);
    ConnectService.checkConnection()
      .then((isConnected: boolean) => {
        if (isConnected) resetNavigate('HomeScreen', navigation);
      })
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setRefreshing(false));
  };

  return (
    <ScrollContainer
      isLoading={loading}
      refreshControl={
        <RefreshControl
          colors={['#9Bd35A', '#689F38']}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
      keyboardShouldPersistTaps="always">
      <LogoHeader heading="Connect Your Partner" />
      <Text style={styles.subheading}>Thanks for joining us!</Text>
      <Text style={styles.paragraph}>
        The sign-up process is almost complete. Once your partner has
        registered, send them your code!
      </Text>

      <CopyConnectCodeButton code={user.uid} />

      <ShareConnectCodeButton code={user.uid} />

      <Text style={{...styles.subheading, marginTop: 20}}>
        Or, enter your partners code...
      </Text>
      <View style={styles.codeInputContainer}>
        <Input
          attributes={{placeholder: 'e.g bWzGl2'}}
          isValid={isPartnerCodeValid}
          onChange={setPartnerConnectCode}
          accessibilityLabel="Enter partner code"
        />
        {partnerConnectCode === user.uid && (
          <Text style={styles.error}>You can't connect with yourself!</Text>
        )}
        {error != '' && <Text style={styles.error}>{error}</Text>}
        <SubmitButton
          onSubmit={() => connectToPartner(partnerConnectCode)}
          text="Connect"
          disabled={!isPartnerCodeValid()}
          accessibilityLabel="Press to connect"
        />
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button
          text="logout"
          onPress={() => resetNavigate('LogoutScreen', navigation)}
          accessibilityLabel="Tap to logout"
        />
      </View>

      <View style={styles.footer} />
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

  const buttonStyle = {
    ...styles.copyButton,
    backgroundColor: copied ? Colors.VALID_GREEN : Colors.LIGHT,
  };

  const textStyle = {
    ...styles.copyTip,
    color: copied ? 'white' : Colors.DARK,
  };

  const codeStyle = {
    ...styles.code,
    color: copied ? 'white' : Colors.VERY_DARK,
  };

  return (
    <TouchableOpacity
      onPress={onCopy}
      style={buttonStyle}
      accessibilityHint="Copy connect code to clipboard"
      accessibilityState={{checked: copied}}>
      <Text style={{...textStyle, marginBottom: 10}}>Your Code</Text>

      <Text style={codeStyle}>{code}</Text>

      {copied ? (
        <Text style={{...textStyle, marginTop: 10}}>Copied!</Text>
      ) : (
        <Text style={{...textStyle, marginTop: 10}}>Tap to Copy</Text>
      )}
    </TouchableOpacity>
  );
};

const ShareConnectCodeButton = ({code}: {code: string}) => {
  const [shared, setShared] = useState(false);

  const share = () => {
    Share.share({
      message: code,
    }).then(({action}) => setShared(action === Share.sharedAction));
  };

  const shareButton = (
    <Button
      onPress={share}
      text="Share!"
      buttonStyle={ButtonStyles.light}
      pressedButtonStyle={ButtonStyles.lightPressed}
    />
  );

  const sharedButton = (
    <Button
      onPress={share}
      text="Shared!"
      buttonStyle={{backgroundColor: Colors.VALID_GREEN, textColor: 'white'}}
      pressedButtonStyle={{
        backgroundColor: Colors.VALID_GREEN_DARK,
        textColor: 'white',
      }}
    />
  );

  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15}}>
      {shared ? sharedButton : shareButton}
    </View>
  );
};

const styles = StyleSheet.create({
  subheading: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    marginTop: 10,
  },
  copyButton: {
    marginTop: 20,
    padding: 20,
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
  codeInputContainer: {
    marginTop: 5,
  },
  error: {
    color: Colors.DARK_SALMON,
    marginTop: 10,
  },
  logoutButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footer: {
    marginBottom: 0,
  },
});
