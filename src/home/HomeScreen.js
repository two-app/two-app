import React from "react";
import {connect} from "react-redux";
import {WrapperContainer} from "../views/View";
import {Text} from "react-native";

/**
 * @param user {User}
 */
const HomeScreen = ({user}) => {
    return <>
        <WrapperContainer>
            <Text>You're logged in. Home screen, booyah!</Text>
            <Text>Your UID: {user.uid}</Text>
            <Text>Your PID: {user.pid}</Text>
            <Text>Your CID: {user.cid}</Text>
        </WrapperContainer>
    </>;
};

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null
};

const mapStateToProps = state => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};