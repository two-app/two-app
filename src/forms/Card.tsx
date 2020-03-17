import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from '../Colors';

const Card = ({children, style}: { children?: any, style?: any }) => (
    <View style={{...s.card, ...style}}>{children}</View>
);

export {Card};

const s = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderColor: Colors.FADED,
        borderWidth: 0.5,
        borderRadius: 5,
        shadowColor: Colors.DARK,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 3,
        marginLeft: 3, // Margins used since the card is usually clipped horizontally
        marginRight: 3, // So margin is equal to the radius on either side
        elevation: 3,
    }
});