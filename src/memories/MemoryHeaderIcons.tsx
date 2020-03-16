import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../Colors';

export const TimelineIcon = ({focused}: { focused?: boolean }) => {
    const iconStyle = {...s.rotate, ...s.icon, ...getFocusedStyle(focused)};
    const textStyle = {...s.text, ...getFocusedStyle(focused)};
    return (
        <View style={s.container}>
            <MaterialCommunityIcon name="timeline-text-outline" style={iconStyle}/>
            <Text style={textStyle}>TIMELINE</Text>
        </View>
    );
};

export const GroupedIcon = ({focused}: { focused?: boolean }) => {
    const iconStyle = {...s.icon, ...getFocusedStyle(focused), marginTop: 2};
    const textStyle = {...s.text, ...getFocusedStyle(focused)};
    return (
        <View style={s.container}>
            <AntIcon name="tagso" style={iconStyle}/>
            <Text style={textStyle}>GROUPED</Text>
        </View>
    );
};

export const GridIcon = ({focused}: { focused?: boolean }) => {
    const iconStyle = {...s.icon, ...getFocusedStyle(focused), fontSize: 18};
    const textStyle = {...s.text, ...getFocusedStyle(focused)};
    return (
        <View style={s.container}>
            <MaterialIcon name="grid-on" style={iconStyle}/>
            <Text style={textStyle}>GRID</Text>
        </View>
    );
};

const getFocusedStyle = (focused?: boolean) => focused === true ? s.focused : {};

const s = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rotate: {
        transform: [{rotate: '-90deg'}]
    },
    icon: {
        color: Colors.REGULAR,
        fontSize: 20
    },
    text: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: Colors.REGULAR,
        marginLeft: 5,
        marginRight: 10
    },
    focused: {
        color: Colors.DARK
    }
});