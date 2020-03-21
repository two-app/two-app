import React, {useState} from 'react';
import {Card} from '../../forms/Card';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../Colors';
import {FormStyle} from './FormStyles';

const TagInput = ({setTag}: { setTag: Function }) => {
    const [tagValue, setTagValue] = useState<string | null>(null);
    const setValue = (value: string | null) => {
        if (value == '') value = null;
        setTagValue(value);
        setTag(value);
    };

    const selectableTags = [{name: 'Summer in Paris', count: 6}, {name: '23rd Birthday', count: 10}];

    return (<>
        <Card style={FormStyle.card}>
            <View style={FormStyle.iconContainer}>
                <AntIcon name="tago" style={{fontSize: 13, color: Colors.REGULAR, marginTop: 3}}/>
            </View>
            <TextInput placeholder="Optional tag, e.g Anniversary or Birthday..."
                       placeholderTextColor={Colors.REGULAR} style={{color: Colors.DARK, flex: 1}}
                       onChangeText={setTagValue}
                       onBlur={e => setValue(e.nativeEvent.text)}
                       value={tagValue ? tagValue : ''}
            />
        </Card>
        <Text style={{marginTop: 10, marginBottom: 10, marginLeft: 3, color: Colors.REGULAR}}>
            Or, pick an existing tag...
        </Text>
        <View style={{flexDirection: 'row', marginLeft: 3}}>
            {/*TODO turn this into a horizontal scroll list populated from API*/}
            {selectableTags.map(t =>
                <Tag name={t.name} count={t.count} focused={t.name === tagValue} onClick={setValue} key={t.name}/>
            )}
        </View>
    </>);
};

const Tag = ({name, count, onClick, focused}: { name: string, count: number, onClick: Function, focused?: boolean }) => (
    <TouchableOpacity style={focused ? {...s.tag, ...s.focusedTag} : s.tag} onPress={() => onClick(name)}>
        <Text style={{color: Colors.REGULAR}}>{name}</Text>
        <Text style={{color: Colors.REGULAR}}> {count}</Text>
    </TouchableOpacity>
);

const s = StyleSheet.create({
    tag: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: Colors.FADED,
        borderRadius: 30,
        flexDirection: 'row',
        marginRight: 5
    },
    focusedTag: {
        borderColor: Colors.REGULAR
    },
});

export {TagInput};