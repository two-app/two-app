// @flow

import React, {useEffect} from 'react';
import {Text} from "react-native";
import {connect} from "react-redux";
import {WrapperContainer} from "./views/View";
import {clearState, persistor} from "./state/reducers";
import {NavigationActions, StackActions} from "react-navigation";

const LoadingScreen = ({navigation, user, auth, clearState}) => {
    const nav = url => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: url})]
        })
    );

    useEffect(() => {
        if (user != null && auth != null) {
            // user and auth tokens are present, user is either in connect or connected phase of workflow
            user.pid != null ? nav("HomeScreen") : nav("ConnectCodeScreen");
        } else {
            // clearing state to ensure user is in clean startup
            clearState();
            persistor.persist();
            nav("RegisterScreen");
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

const mapStateToProps = state => ({user: state['user'], auth: state['authentication']});

export default connect(mapStateToProps, {clearState})(LoadingScreen);
export {LoadingScreen};