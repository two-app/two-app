import {Card} from '../../forms/Card';
import {TextInput, View} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Colors from '../../Colors';
import React from 'react';
import {FormStyle} from './FormStyles';

const TitleInput = ({setTitle}: { setTitle: Function }) => (
    <Card style={FormStyle.card}>
        <View style={FormStyle.iconContainer}>
            <SimpleLineIcon name="pencil" style={{fontSize: 13, color: Colors.REGULAR}}/>
        </View>
        <TextInput placeholder="Title of your new memory..." placeholderTextColor={Colors.REGULAR}
                   autoFocus={true} style={{color: Colors.DARK, flex: 1}}
                   onBlur={e => setTitle(e.nativeEvent.text)}
        />
    </Card>
);

export default TitleInput;