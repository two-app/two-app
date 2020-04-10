import React, { useState, useEffect } from 'react';
import { Card } from '../../forms/Card';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../Colors';
import { FormStyle } from './FormStyles';

const TagInput = ({ setTag }: { setTag: Function }) => {
    const [tagValue, setTagValue] = useState<string>();

    return (<>
        <Card style={FormStyle.card}>
            <View style={FormStyle.iconContainer}>
                <AntIcon name="tago" style={{ fontSize: 13, color: Colors.REGULAR, marginTop: 3 }} />
            </View>
            <TextInput placeholder="Tag, e.g Anniversary or Birthday..."
                placeholderTextColor={Colors.REGULAR} style={{ color: Colors.DARK, flex: 1, paddingVertical: 0 }}
                onChangeText={setTagValue}
                value={tagValue}
                onBlur={() => tagValue == '' ? setTag(null) : setTag(tagValue)}
            />
        </Card>
    </>);
};

export { TagInput };