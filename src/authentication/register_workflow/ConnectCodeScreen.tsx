import React, {useState} from 'react';
import {Clipboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {WrapperContainer} from '../../views/View';
import LogoHeader from '../LogoHeader';
import {User} from '../UserModel';
import Colors from '../../Colors';
import Input from '../../forms/Input';
import SubmitButton from '../../forms/SubmitButton';
import LoadingView from '../../views/LoadingView';
import AuthenticationService, {UserResponse} from '../AuthenticationService';
import {NavigationActions, StackActions} from 'react-navigation';
import {NavigationStackProp} from 'react-navigation-stack';
import {TwoState} from '../../state/reducers';
import {selectUnconnectedUser, storeUser} from '../../user';
import {storeTokens} from '../store';


const mapState = (state: TwoState) => ({user: selectUnconnectedUser(state.user)});
const mapDispatch = {storeUser, storeTokens};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type ConnectCodeScreenProps = ConnectorProps & {
    navigation: NavigationStackProp
};

const ConnectCodeScreen = ({navigation, user, storeUser, storeTokens}: ConnectCodeScreenProps) => {
    const [partnerConnectCode, setPartnerConnectCode] = useState('');
    const isPartnerCodeValid = (partnerCode: string) => partnerCode.length === 6 && partnerCode !== user.connectCode;
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigateToHomeScreen = () => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'HomeScreen'})]
        })
    );

    const connectToPartner = (connectCode: string) => {
        setSubmitted(true);
        AuthenticationService.connectToPartner(connectCode).then((response: UserResponse) => {
            storeUser(response.user as User);
            storeTokens(response.tokens);
            navigateToHomeScreen();
        }).catch((e: Error) => {
            setSubmitted(false);
            setError(e.message);
        });
    };

    return <>
        {submitted && <LoadingView/>}
        <WrapperContainer>
            <LogoHeader heading="Connect Your Partner"/>
            <Text style={styles.subheading}>Thanks for joining us!</Text>
            <Text style={styles.paragraph}>
                The sign-up process is almost complete. Once your partner has registered, send them your code!
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={() => Clipboard.setString(user.connectCode)}>
                <Text style={{...styles.copyTip, marginBottom: 10}}>Your Code</Text>
                <Text style={styles.code}>{user.connectCode}</Text>
                <Text style={{...styles.copyTip, marginTop: 10}}>Tap to Copy</Text>
            </TouchableOpacity>

            <Text style={{...styles.subheading, marginTop: 20}}>Or, enter your partners code...</Text>
            <View style={styles.codeInputContainer}>
                <Input attributes={{placeholder: 'e.g bWzGl2'}}
                       isValid={() => isPartnerCodeValid(partnerConnectCode)}
                       onChange={setPartnerConnectCode}
                />
                {partnerConnectCode === user.connectCode &&
                <Text style={styles.error} data-testid="error">You can't connect with yourself!</Text>
                }
                {error && <Text style={styles.error} data-testid="error">{error}</Text>}
                <SubmitButton onSubmit={() => connectToPartner(partnerConnectCode)} text="Connect"
                              disabled={!isPartnerCodeValid(partnerConnectCode)}/>
            </View>
        </WrapperContainer>
    </>;
};

ConnectCodeScreen.navigationOptions = {
    title: 'Partner Connect',
    header: null
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
    }
});

export default connector(ConnectCodeScreen);
export {ConnectCodeScreen};