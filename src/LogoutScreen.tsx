import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {clearState, persistor} from './state/reducers';
import {connect} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Router';

type LogoutScreenProps = {
    clearState: any,
    navigation: StackNavigationProp<RootStackParamList, 'LogoutScreen'>
}

const LogoutScreen = ({clearState, navigation}: LogoutScreenProps) => {
    useEffect(() => {
        clearState();
        persistor.persist();
        navigation.navigate('LoginScreen');
    }, []);
    return <><Text>Logging you out...</Text></>;
};

export default connect(() => ({}), {clearState})(LogoutScreen);
export {LogoutScreen};