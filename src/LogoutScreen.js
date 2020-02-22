import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Text} from "react-native";
import {clearState, persistor} from "./state/reducers";

const LogoutScreen = ({clearState, persistor, navigation}) => {
    useEffect(() => {
        clearState();
        persistor.persist();
        navigation.navigate("LoginScreen");
    }, []);
    return <><Text>Logging you out...</Text></>;
};

export default connect(() => {
}, {clearState, persistor})(LogoutScreen);
export {LogoutScreen};