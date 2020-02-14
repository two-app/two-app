// @flow

import React, {useState} from "react";
import {ActivityIndicator, Clipboard, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {WrapperContainer} from "../../views/View";
import LogoHeader from "../LogoHeader";
import {UnconnectedUser} from "../UserModel";
import Colors from "../../Colors";
import Input from "../../forms/Input";
import SubmitButton from "../../forms/SubmitButton";
import LoadingView from "../../views/LoadingView";
import Gateway from "../../http/Gateway";

/**
 * @param navigation
 * @param user {UnconnectedUser}
 */
const ConnectCodeScreen = ({user}) => {
    const [partnerConnectCode, setPartnerConnectCode] = useState("");
    const isPartnerCodeValid = partnerCode => partnerCode.length === 6 && partnerCode !== user.connectCode;
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        Gateway.get("/partner").then(console.log).catch(console.error);
    }

    return <>
        {submitted && <LoadingView/>}
        <WrapperContainer>
            <LogoHeader heading="Connect Your Partner"/>
            <Text style={styles.subheading}>Thanks for joining us!</Text>
            <Text style={styles.paragraph}>
                The sign-up process is almost complete. Once your partner has registered, send them your code!
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={() => Clipboard.setString(user.connectCode)}>
                <Text style={{...styles.copyTip, marginBottom: 10}}>Your Code</Text>
                <Text style={styles.code}>{user.connectCode}</Text>
                <Text style={{...styles.copyTip, marginTop: 10}}>Tap to Copy</Text>
            </TouchableOpacity>

            <Text style={{...styles.subheading, marginTop: 20}}>Or, enter your partners code...</Text>
            <View style={styles.codeInputContainer}>
                <Input attributes={{placeholder: "e.g bWzGl2"}}
                       isValid={() => isPartnerCodeValid(partnerConnectCode)}
                       onChange={setPartnerConnectCode}
                />
                {partnerConnectCode === user.connectCode &&
                <Text style={styles.error} id="error">You can't connect with yourself!</Text>
                }
                <SubmitButton onSubmit={() => setSubmitted(true)} text="Connect"
                              disabled={!isPartnerCodeValid(partnerConnectCode)}/>
            </View>
        </WrapperContainer>
    </>;
};

ConnectCodeScreen.navigationOptions = {
    title: 'Partner Connect',
    header: null
};

const styles = StyleSheet.create({
    subheading: {
        marginTop: 20,
        fontWeight: "bold"
    },
    paragraph: {
        marginTop: 10
    },
    copyButton: {
        marginTop: 20,
        backgroundColor: Colors.LIGHT,
        padding: 20
    },
    copyTip: {
        fontWeight: "300",
        color: Colors.DARK,
        textAlign: "center"
    },
    code: {
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center"
    },
    codeInputContainer: {
        marginTop: 5
    },
    codeInput: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.DARK
    },
    error: {
        color: Colors.DARK_SALMON,
        marginTop: 10
    },
    overlay: {
        flex: 1,
        position: "absolute",
        opacity: 0.5,
        backgroundColor: 'white',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
});

const mapStateToProps = state => ({user: state['user']});

export default connect(mapStateToProps)(ConnectCodeScreen);
export {ConnectCodeScreen};