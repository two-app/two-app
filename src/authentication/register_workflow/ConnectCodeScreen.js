// @flow

import React from "react";
import {Text} from "react-native";
import {connect} from "react-redux";

const ConnectCodeScreen = ({navigation, user}) => <Text>Hello, {user.uid}</Text>;

ConnectCodeScreen.navigationOptions = {
    title: 'Partner Connect',
    header: null
};

ConnectCodeScreen.propTypes = {};

const mapStateToProps = state => ({user: state['user']});

export default connect(mapStateToProps)(ConnectCodeScreen);