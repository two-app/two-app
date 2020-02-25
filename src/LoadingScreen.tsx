import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {WrapperContainer} from './views/View';
import {clearState, persistor, TwoState} from './state/reducers';
import {NavigationActions, StackActions} from 'react-navigation';
import {NavigationStackProp} from 'react-navigation-stack';

const mapState = (state: TwoState) => ({user: state.user, auth: state.auth});
const mapDispatch = {clearState};
const connector = connect(mapState, mapDispatch);
type ConnectorProps = ConnectedProps<typeof connector>;
type LoadingScreenProps = ConnectorProps & { navigation: NavigationStackProp }

const LoadingScreen = ({navigation, user, auth, clearState}: LoadingScreenProps) => {
    const nav = (url: string) => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: url})]
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

    return <WrapperContainer>
        <Text>Loading...</Text>
    </WrapperContainer>;
};

LoadingScreen.navigationOptions = {
    title: 'Loading...',
    header: null
};

export default connector(LoadingScreen);
export {LoadingScreen};