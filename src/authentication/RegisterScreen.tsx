import React, {useState} from 'react';
import Input from '../forms/Input';
import {WrapperContainer} from '../views/View';
import LogoHeader from './LogoHeader';
import SubmitButton from '../forms/SubmitButton';
import UserRegistrationModel, {UserRegistration} from './register_workflow/UserRegistrationModel';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../Router';

type RegisterScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'RegisterScreen'>
};

const RegisterScreen = ({navigation}: RegisterScreenProps) => {
    const [userRegistration, setUserRegistration] = useState(new UserRegistration());
    return (
        <WrapperContainer>
            <LogoHeader heading="Sign Up"/>

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
        </WrapperContainer>
    );
};

RegisterScreen.navigationOptions = {
    title: 'Sign In',
    header: null
};

export default RegisterScreen;