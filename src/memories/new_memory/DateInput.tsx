import React, {useState} from 'react';
import {Keyboard, Text, View, Platform} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../../Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FormStyle} from './FormStyles';
import moment from 'moment';
import {TouchableCard} from '../../forms/Card';

type DateTimePickerProps = {
  setDateTime: (datetime: number) => void;
  initialValue: number;
  placeholder?: string;
};

/**
 * Utility for the user to select a date and time.
 * On iOS, there is no native datetime picker, so a two-step modal is used. The intermediary 'date' value
 * is stored as the `pickerValue`.
 */
export const DateTimePicker = ({
  setDateTime,
  initialValue,
  placeholder,
}: DateTimePickerProps) => {
  const [isVisible, setVisibility] = useState(false);
  const [pickerValue, setPickerValue] = useState<number>();
  const [date, setDate] = useState<number>(initialValue);
  const [selecting, setSelecting] = useState<'date' | 'time'>('date');

  const openPicker = () => {
    Keyboard.dismiss();
    setVisibility(true);
  };

  const reset = () => {
    setVisibility(false);
    setSelecting('date');
    setPickerValue(undefined);
  };

  const updateDate = (date: number) => {
    setDate(date);
    setDateTime(date);
    reset();
  };

  return (
    <>
      <TouchableCard style={FormStyle.card} onPress={openPicker}>
        <View style={FormStyle.iconContainer}>
          <AntIcon
            name={'calendar'}
            style={{fontSize: 13, color: Colors.REGULAR}}
          />
        </View>
        {date == null && (
          <Text style={{color: Colors.REGULAR}}>{placeholder}</Text>
        )}
        {date != null && (
          <Text style={{color: Colors.DARK}}>{moment(date).format('LLL')}</Text>
        )}
      </TouchableCard>
      {Platform.OS === 'android' ? (
        <DateTimePickerModal
          isVisible={isVisible}
          maximumDate={new Date()}
          mode="datetime"
          onConfirm={(selectedDate: Date) => updateDate(selectedDate.getTime())}
          onCancel={reset}
        />
      ) : (
        <DateTimePickerModal
          isVisible={isVisible}
          maximumDate={new Date()}
          mode={selecting}
          headerTextIOS={
            selecting === 'date' ? 'Pick the date' : 'Pick the time'
          }
          onConfirm={(selectedDate: Date) => {
            if (selecting === 'date') {
              setPickerValue(selectedDate.getTime());
              setSelecting('time');
            } else {
              const onlyDate = moment(pickerValue).format('YYYY-MM-DD');
              const onlyTime = moment(selectedDate).format('HH:mm:00');
              const datetime = moment(`${onlyDate} ${onlyTime}`);
              updateDate(datetime.valueOf());
            }
          }}
          onCancel={reset}
        />
      )}
    </>
  );
};

DateTimePicker.defaultProps = {
  initialValue: undefined,
  placeholder: 'When it took place...',
};
