// @flow

import React, {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, Text} from "react-native";
import {WrapperContainer} from "../../views/View";
import LogoHeader from "../LogoHeader";
import {UserRegistration} from "./UserRegistration";
import Gateway from "../../http/Gateway";
import { AxiosError, AxiosResponse } from 'axios';
import Colors from "../../Colors";

const CreateAccountScreen = ({navigation}) => {
    const userRegistration: UserRegistration = navigation.getParam("userRegistration");
    const [error, setError] = useState(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        Gateway.post("/self", userRegistration)
            .then((r: AxiosResponse) => setCompleted(true))
            .catch((e: AxiosError) => setError(JSON.stringify(e)));
    }, []);

    return (
        <WrapperContainer>
            <LogoHeader heading={`${userRegistration.firstName}, we're just setting up your account...`}/>
            {completed && <Text>Account created!</Text>}
            {error == null && <ActivityIndicator style={{marginTop: 50}} size="large"/>}
            {error != null && <Text style={styles.error}>{error}</Text>}
        </WrapperContainer>
    );
};

CreateAccountScreen.navigationOptions = {
    title: 'Creating your Account',
    header: null
};

const styles = StyleSheet.create({
    error: {
        color: Colors.DARK_SALMON,
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 25
    }
});


export default CreateAccountScreen;