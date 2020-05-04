import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ScrollContainer } from "../views/View";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import Colors from "../Colors";
import LogoHeader from "./LogoHeader";
import Input from "../forms/Input";
import UserRegistrationModel from "./register_workflow/UserRegistrationModel";
import SubmitButton from "../forms/SubmitButton";
import AuthenticationService, { LoginCredentials, areCredentialsValid } from "./AuthenticationService";
import { storeTokens } from './store';
import { storeUser, storeUnconnectedUser } from '../user';
import { connect, ConnectedProps } from "react-redux";
import { isUnconnectedUser } from "./UserModel";
import LoadingView from "../views/LoadingView";
import { resetNavigate } from "../navigation/NavigationUtilities";


const mapState = null;
const mapDispatch = { storeUser, storeUnconnectedUser, storeTokens };
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type LoginScreenProps = ConnectorProps & {
    navigation: StackNavigationProp<RootStackParamList, 'LoginScreen'>;
};

const LoginScreen = ({ navigation, storeUser, storeUnconnectedUser, storeTokens }: LoginScreenProps) => {
    const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
        email: '',
        rawPassword: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loginError, setLoginError] = useState<string>();

    const login = () => {
        setSubmitted(true)
        AuthenticationService.login(loginCredentials).then(response => {
            storeTokens(response.tokens);
            if (isUnconnectedUser(response.user)) {
                storeUnconnectedUser(response.user);
            } else {
                storeUser(response.user);
            }
            resetNavigate('LoadingScreen', navigation);
        }).catch((e: Error) => {
            setSubmitted(false);
            setLoginError(e.message);
        });
    }

    return (
        <ScrollContainer isLoading={submitted} keyboardShouldPersistTaps='always'>
            <LogoHeader heading="Sign In" />

            <Input attributes={{ placeholder: 'you@email.com', autoCompleteType: 'email', autoCapitalize: 'none' }}
                isValid={UserRegistrationModel.isEmailValid} label={'Email'}
                onChange={email => setLoginCredentials({ ...loginCredentials, email })}
            />

            <Input attributes={{ placeholder: 'Secure Password', autoCompleteType: 'password', secureTextEntry: true }}
                isValid={UserRegistrationModel.isPasswordValid}
                label={'Password'}
                onChange={password => setLoginCredentials({ ...loginCredentials, rawPassword: password })}
            />

            <SubmitButton text="Sign In"
                onSubmit={login}
                disabled={!areCredentialsValid(loginCredentials)}
            />

            {loginError && <Text style={{ color: Colors.DARK_SALMON }} data-testid="error-message">
                {loginError}
            </Text>}

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ color: Colors.REGULAR }}>Here to join?</Text>
                <TouchableOpacity style={{ marginLeft: 5 }}
                    onPress={() => resetNavigate('RegisterScreen', navigation)}
                    data-testid={'register-screen-button'}
                >
                    <Text style={{ fontWeight: "bold", color: Colors.DARK }}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </ScrollContainer>
    );
};

export default connector(LoginScreen);
export { LoginScreen }