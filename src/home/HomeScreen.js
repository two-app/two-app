import React from "react";
import {connect} from "react-redux";
import {WrapperContainer} from "../views/View";
import {Text, TouchableOpacity} from "react-native";
import {NavigationActions, StackActions} from "react-navigation";

/**
 * @param user {User}
 */
const HomeScreen = ({navigation, user}) => {
    const logout = () => navigation.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'LogoutScreen'})]
        })
    );

    return <WrapperContainer>
        <Text>You're logged in.</Text>
        <Text>Your UID: {user.uid}</Text>
        <Text>Your PID: {user.pid}</Text>
        <Text>Your CID: {user.cid}</Text>
        <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
    </WrapperContainer>;
};

HomeScreen.navigationOptions = {
    title: 'Home',
    header: null
};

const mapStateToProps = state => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};