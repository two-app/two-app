import React, {useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FormStyle} from './FormStyles';
import moment from 'moment';
import { TouchableCard } from '../../forms/Card';

const DateInput = ({setDate}: { setDate: Function }) => {
    const [isVisible, setVisibility] = useState(false);
    const [pickerValue, setPickerValue] = useState<number | null>(null);

    const openPicker = () => {
        Keyboard.dismiss();
        setVisibility(true);
    };

    const selectDate = (date: Date) => {
        setVisibility(false);
        setPickerValue(date.getTime());
        setDate(date.getTime());
    };

    return (<>
        <TouchableCard style={FormStyle.card} onPress={openPicker}>
            <View style={FormStyle.iconContainer}>
                <AntIcon name="calendar" style={{fontSize: 13, color: Colors.REGULAR}}/>
            </View>
            {pickerValue == null && <Text style={{color: Colors.REGULAR}}>When it took place...</Text>}
            {pickerValue != null && <Text
                style={{color: Colors.DARK}}>{moment(pickerValue).format("LL")}</Text>}
        </TouchableCard>
        <DateTimePickerModal
            isVisible={isVisible}
            minimumDate={new Date(Date.UTC(0, 0, 0, 0, 0, 0))}
            maximumDate={new Date()}
            is24Hour={true}
            locale="en_GB"
            mode="date"
            onConfirm={selectDate}
            onCancel={() => setVisibility(false)}
            display='calendar'
        />
    </>);
};

export {DateInput};