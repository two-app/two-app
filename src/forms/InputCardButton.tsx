import {TouchableOpacity} from 'react-native';
import React from 'react';
import {Card} from './Card';

export const InputCardButton = ({children, style, onClick}: { children?: any, style?: any, onClick?: Function }) => (
    <TouchableOpacity onPress={() => onClick && onClick()} style={{...style}}>
        <Card>
            {children}
        </Card>
    </TouchableOpacity>
);