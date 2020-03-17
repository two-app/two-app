import React, {useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import {InputCardButton} from '../../forms/InputCardButton';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FormStyle} from './FormStyles';

const DateInput = ({setDate}: { setDate: Function }) => {
    const [isVisible, setVisibility] = useState(false);
    const [pickerValue, setPickerValue] = useState<Date | null>(null);

    const openPicker = () => {
        Keyboard.dismiss();
        setVisibility(true);
    };

    const selectDate = (date: Date) => {
        setVisibility(false);
        setPickerValue(date);
        setDate(date);
    };

    return (<>
        <InputCardButton style={FormStyle.card} onClick={openPicker}>
            <View style={FormStyle.iconContainer}>
                <AntIcon name="calendar" style={{fontSize: 13, color: Colors.REGULAR}}/>
            </View>
            {pickerValue == null && <Text style={{color: Colors.REGULAR}}>When it took place...</Text>}
            {pickerValue != null && <Text style={{color: Colors.DARK}}>{pickerValue?.toDateString()}</Text>}
        </InputCardButton>
        <DateTimePickerModal
            isVisible={isVisible}
            maximumDate={new Date()}
            mode="date"
            onConfirm={selectDate}
            onCancel={() => setVisibility(false)}
        />
    </>);
};

export {DateInput};