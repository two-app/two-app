import React from "react";
import {connect} from "react-redux";
import {WrapperContainer} from "../views/View";
import {Text, TouchableOpacity} from "react-native";

/**
 * @param user {User}
 */
const HomeScreen = ({navigation, user}) => <WrapperContainer>
    <Text>You're logged in.</Text>
    <Text>Your UID: {user.uid}</Text>
    <Text>Your PID: {user.pid}</Text>
    <Text>Your CID: {user.cid}</Text>
    <TouchableOpacity onPress={() => navigation.navigate("LogoutScreen")}><Text>Logout</Text></TouchableOpacity>
</WrapperContainer>;

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null
};

const mapStateToProps = state => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};