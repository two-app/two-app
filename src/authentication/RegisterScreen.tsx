import React, {useState} from 'react';
import Input from '../forms/Input';
import {WrapperContainer} from '../views/View';
import LogoHeader from './LogoHeader';
import SubmitButton from '../forms/SubmitButton';
import UserRegistrationModel, {UserRegistration} from './register_workflow/UserRegistrationModel';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../Colors';
import { CommonActions } from '@react-navigation/native';

type RegisterScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'RegisterScreen'>
};

const RegisterScreen = ({navigation}: RegisterScreenProps) => {
    const [userRegistration, setUserRegistration] = useState(new UserRegistration());

    const navigateToLogin = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }]
            })
        );
    }

    return (
        <WrapperContainer>
            <LogoHeader heading="Create Account"/>

            <Input attributes={{placeholder: 'First Name', autoCompleteType: 'name'}}
                   isValid={UserRegistrationModel.isFirstNameValid} label={'First Name'}
                   onChange={firstName => setUserRegistration({...userRegistration, firstName})}
            />

            <Input attributes={{placeholder: 'Last Name'}}
                   isValid={UserRegistrationModel.isLastNameValid} label={'Last Name'}
                   onChange={lastName => setUserRegistration({...userRegistration, lastName})}
            />

            <Input attributes={{placeholder: 'you@email.com', autoCompleteType: 'email', autoCapitalize: 'none'}}
                   isValid={UserRegistrationModel.isEmailValid} label={'Email'}
                   onChange={email => setUserRegistration({...userRegistration, email})}
            />

            <Input attributes={{placeholder: 'Secure Password', autoCompleteType: 'password', secureTextEntry: true}}
                   isValid={UserRegistrationModel.isPasswordValid}
                   label={'Password'}
                   onChange={password => setUserRegistration({...userRegistration, password})}
            />

            <SubmitButton text="Join Two"
                          onSubmit={() => navigation.navigate('AcceptTermsScreen', {userRegistration})}
                          disabled={!UserRegistrationModel.isUserRegistrationValid(userRegistration)}
            />

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{color: Colors.REGULAR}}>Already a member?</Text>
                <TouchableOpacity style={{marginLeft: 5}} onPress={navigateToLogin}>
                    <Text style={{fontWeight: "bold", color: Colors.DARK}}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </WrapperContainer>
    );
};

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;