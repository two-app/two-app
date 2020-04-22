import React, { useState } from 'react';
import { Clipboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { WrapperContainer } from '../../views/View';
import LogoHeader from '../LogoHeader';
import { User } from '../UserModel';
import Colors from '../../Colors';
import Input from '../../forms/Input';
import SubmitButton from '../../forms/SubmitButton';
import LoadingView from '../../views/LoadingView';
import AuthenticationService, { UserResponse } from '../AuthenticationService';
import { TwoState } from '../../state/reducers';
import { selectUnconnectedUser, storeUser } from '../../user';
import { storeTokens } from '../store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Router';
import { CommonActions } from '@react-navigation/native';
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

    return <>
        {submitted && <LoadingView />}
        <WrapperContainer>
            <LogoHeader heading="Connect Your Partner" />
            <Text style={styles.subheading}>Thanks for joining us!</Text>
            <Text style={styles.paragraph}>
                The sign-up process is almost complete. Once your partner has registered, send them your code!
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={() => Clipboard.setString(user.connectCode)}>
                <Text style={{ ...styles.copyTip, marginBottom: 10 }}>Your Code</Text>
                <Text style={styles.code}>{user.connectCode}</Text>
                <Text style={{ ...styles.copyTip, marginTop: 10 }}>Tap to Copy</Text>
            </TouchableOpacity>

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
                    onClick={() => resetNavigate('LogoutScreen', navigation)}
                    data-testid="logout-button"
                />
            </View>

            <View style={styles.footer} />
        </WrapperContainer>
    </>;
};

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
        backgroundColor: Colors.LIGHT,
        padding: 20
    },
    copyTip: {
        fontWeight: '300',
        color: Colors.DARK,
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