import {Card} from '../../forms/Card';
import {TextInput, View} from 'react-native';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Colors from '../../Colors';
import React from 'react';
import {FormStyle} from './FormStyles';

const LocationInput = ({setLocation}: { setLocation: Function }) => (
    <Card style={FormStyle.card}>
        <View style={FormStyle.iconContainer}>
            <FoundationIcon name="marker" style={{fontSize: 15, color: Colors.REGULAR}}/>
        </View>
        <TextInput placeholder="Where it took place..." placeholderTextColor={Colors.REGULAR}
                   style={{color: Colors.DARK, flex: 1}}
                   onBlur={e => setLocation(e.nativeEvent.text)}
        />
    </Card>
);

export {LocationInput};