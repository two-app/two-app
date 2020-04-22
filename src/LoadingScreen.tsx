import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {ScrollContainer} from './views/View';
import {clearState, persistor, TwoState} from './state/reducers';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../Router';
import { CommonActions } from '@react-navigation/native';

const mapState = (state: TwoState) => ({user: state.user, auth: state.auth});
const mapDispatch = {clearState};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type LoadingScreenProps = ConnectorProps & { navigation: StackNavigationProp<RootStackParamList, 'LoadingScreen'> }

const LoadingScreen = ({navigation, user, auth, clearState}: LoadingScreenProps) => {
    const nav = (route: string) => navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: route}]
        })
    );

    useEffect(() => {
        if (user != null && auth != null) {
            // user and auth tokens are present, user is either in connect or connected phase of workflow
            user.pid != null ? nav('HomeScreen') : nav('ConnectCodeScreen');
        } else {
            // clearing state to ensure user is in clean startup
            clearState();
            persistor.persist();
            nav('RegisterScreen');
        }
    }, []);

    return <ScrollContainer>
        <Text>Loading...</Text>
    </ScrollContainer>;
};

export default connector(LoadingScreen);
export {LoadingScreen};