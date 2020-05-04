import React, { useState } from 'react';
import Input from '../forms/Input';
import { ScrollContainer } from '../views/View';
import LogoHeader from './LogoHeader';
import SubmitButton from '../forms/SubmitButton';
import UserRegistrationModel, { UserRegistration } from './register_workflow/UserRegistrationModel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../Colors';
import { resetNavigate } from '../navigation/NavigationUtilities';

type RegisterScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'RegisterScreen'>
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const [userRegistration, setUserRegistration] = useState(new UserRegistration());

    return (
        <ScrollContainer keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>
            <LogoHeader heading="Create Account" />

            <Input attributes={{ placeholder: 'First Name', autoCompleteType: 'name' }}
                isValid={UserRegistrationModel.isFirstNameValid} label={'First Name'}
                onChange={firstName => setUserRegistration({ ...userRegistration, firstName })}
            />

            <Input attributes={{ placeholder: 'Last Name' }}
                isValid={UserRegistrationModel.isLastNameValid} label={'Last Name'}
                onChange={lastName => setUserRegistration({ ...userRegistration, lastName })}
            />

            <Input attributes={{ placeholder: 'you@email.com', autoCompleteType: 'email', autoCapitalize: 'none' }}
                isValid={UserRegistrationModel.isEmailValid} label={'Email'}
                onChange={email => setUserRegistration({ ...userRegistration, email })}
            />

            <Input attributes={{ placeholder: 'Secure Password', autoCompleteType: 'password', secureTextEntry: true }}
                isValid={UserRegistrationModel.isPasswordValid}
                label={'Password'}
                onChange={password => setUserRegistration({ ...userRegistration, password })}
            />

            <SubmitButton text="Join Two"
                onSubmit={() => navigation.navigate('AcceptTermsScreen', { userRegistration })}
                disabled={!UserRegistrationModel.isUserRegistrationValid(userRegistration)}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ color: Colors.REGULAR }}>Already a member?</Text>
                <TouchableOpacity style={{ marginLeft: 5 }}
                    onPress={() => resetNavigate('LoginScreen', navigation)}
                    data-testid={'login-screen-button'}
                >
                    <Text style={{ fontWeight: "bold", color: Colors.DARK }}>Sign In</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginBottom: 40}}/>
        </ScrollContainer>
    );
};

export default RegisterScreen;