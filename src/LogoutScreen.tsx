import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {clearState, persistor} from './state/reducers';
import {connect} from 'react-redux';
import {NavigationStackProp} from 'react-navigation-stack';

type LogoutScreenProps = {
    clearState: typeof clearState,
    navigation: NavigationStackProp
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