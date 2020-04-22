import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Vibration, Share } from 'react-native';
import Clipboard from "@react-native-community/clipboard";
import { connect, ConnectedProps } from 'react-redux';
import { ScrollContainer } from '../../views/View';
import LogoHeader from '../LogoHeader';
import { User } from '../UserModel';
import Colors from '../../Colors';
import Input from '../../forms/Input';
import SubmitButton from '../../forms/SubmitButton';
import AuthenticationService, { UserResponse } from '../AuthenticationService';
import { TwoState } from '../../state/reducers';
import { selectUnconnectedUser, storeUser } from '../../user';
import { storeTokens } from '../store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Router';
import { Button } from '../../forms/Button';
import { resetNavigate } from '../../navigation/NavigationUtilities';

const mapState = (state: TwoState) => ({ user: selectUnconnectedUser(state.user) });
const mapDispatch = { storeUser, storeTokens };
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type ConnectCodeScreenProps = ConnectorProps & {
    navigation: StackNavigationProp<RootStackParamList, 'ConnectCodeScreen'>
};

const ConnectCodeScreen = ({ navigation, user, storeUser, storeTokens }: ConnectCodeScreenProps) => {
    const [partnerConnectCode, setPartnerConnectCode] = useState('');
    const isPartnerCodeValid = (partnerCode: string) => partnerCode.length === 6 && partnerCode !== user.connectCode;
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectToPartner = (connectCode: string) => {
        setSubmitted(true);
        AuthenticationService.connectToPartner(connectCode).then((response: UserResponse) => {
            storeUser(response.user as User);
            storeTokens(response.tokens);
            resetNavigate('HomeScreen', navigation);
        }).catch((e: Error) => {
            setSubmitted(false);
            setError(e.message);
        });
    };

    return (
        <ScrollContainer isLoading={submitted}>
            <LogoHeader heading="Connect Your Partner" />
            <Text style={styles.subheading}>Thanks for joining us!</Text>
            <Text style={styles.paragraph}>
                The sign-up process is almost complete. Once your partner has registered, send them your code!
            </Text>

            <CopyConnectCodeButton code={user.connectCode} />

            <ShareConnectCodeButton code={user.connectCode} />

            <Text style={{ ...styles.subheading, marginTop: 20 }}>Or, enter your partners code...</Text>
            <View style={styles.codeInputContainer}>
                <Input attributes={{ placeholder: 'e.g bWzGl2' }}
                    isValid={() => isPartnerCodeValid(partnerConnectCode)}
                    onChange={setPartnerConnectCode}
                />
                {partnerConnectCode === user.connectCode &&
                    <Text style={styles.error} data-testid="error">You can't connect with yourself!</Text>
                }
                {error && <Text style={styles.error} data-testid="error">{error}</Text>}
                <SubmitButton onSubmit={() => connectToPartner(partnerConnectCode)} text="Connect"
                    disabled={!isPartnerCodeValid(partnerConnectCode)} />
            </View>

            <View style={styles.logoutButtonContainer}>
                <Button text="logout"
                    onPress={() => resetNavigate('LogoutScreen', navigation)}
                    data-testid="logout-button"
                />
            </View>

            <View style={styles.footer} />
        </ScrollContainer>
    );
};

const CopyConnectCodeButton = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        Clipboard.setString(code);
        Vibration.vibrate(5);
        setCopied(true);
    };

    const buttonStyle = {
        ...styles.copyButton,
        backgroundColor: (copied ? Colors.VALID_GREEN : Colors.LIGHT)
    };

    const textStyle = {
        ...styles.copyTip,
        color: (copied ? 'white' : Colors.DARK)
    };

    const codeStyle = {
        ...styles.code,
        color: (copied ? 'white' : Colors.VERY_DARK)
    };

    return (
        <TouchableOpacity onPress={onCopy} style={buttonStyle}>
            <Text style={{ ...textStyle, marginBottom: 10 }}>Your Code</Text>

            <Text style={codeStyle}>{code}</Text>

            {copied ?
                <Text style={{ ...textStyle, marginTop: 10 }}>Copied!</Text>
                :
                <Text style={{ ...textStyle, marginTop: 10 }}>Tap to Copy</Text>
            }
        </TouchableOpacity>
    );
};

const ShareConnectCodeButton = ({ code }: { code: string }) => {
    const [shared, setShared] = useState(false);

    const share = () => {
        Share.share({
            message: code
        }).then(() => {
            setShared(true);
        }).catch(() => { });
    };

    const shareButton = (
        <Button onPress={share} text='Share!'
            buttonStyle={{ backgroundColor: 'white', textColor: Colors.DARK }}
            pressedButtonStyle={{ backgroundColor: '#fafafa', textColor: Colors.VERY_DARK }}
        />
    )

    const sharedButton = (
        <Button onPress={share} text='Shared!'
            buttonStyle={{ backgroundColor: Colors.VALID_GREEN, textColor: 'white' }}
            pressedButtonStyle={{ backgroundColor: Colors.VALID_GREEN_DARK, textColor: 'white' }}
        />
    );

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
            {shared ? sharedButton : shareButton}
        </View>
    );
}

const styles = StyleSheet.create({
    subheading: {
        marginTop: 20,
        fontWeight: 'bold'
    },
    paragraph: {
        marginTop: 10
    },
    copyButton: {
        marginTop: 20,
        padding: 20
    },
    copyTip: {
        fontWeight: '500',
        textAlign: 'center'
    },
    code: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center'
    },
    codeInputContainer: {
        marginTop: 5
    },
    codeInput: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.DARK
    },
    error: {
        color: Colors.DARK_SALMON,
        marginTop: 10
    },
    logoutButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    footer: {
        marginBottom: 40
    }
});

export default connector(ConnectCodeScreen);
export { ConnectCodeScreen };