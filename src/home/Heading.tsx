import React from 'react';
import {Text} from 'react-native';
import Colors from '../Colors';

const Heading = ({children}: { children: string }) => (
    <Text style={{
        color: Colors.VERY_DARK,
        fontSize: 35,
        fontFamily: 'Montserrat-ExtraBold',
        marginTop: 20
    }}>{children}</Text>
);

export {Heading};