import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import Colors from '../Colors';

const Card = ({children, style}: { children?: any, style?: any }) => (
    <View style={{...s.card, ...style}}>{children}</View>
);

export {Card};

const s = StyleSheet.create({
    card: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderColor: Colors.FADED,
        borderWidth: 0.5,
        borderRadius: 5,
        marginHorizontal: 3, // Margins used since the card is usually clipped horizontally
        ...Platform.select({
            ios: {
                shadowColor: Colors.DARK,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.22,
                shadowRadius: 3
            },
            android: {
                // TODO Enable animation when RN fixes elevation
                // elevation: 3
            }
        })
    }
});