import {forwardRef, useImperativeHandle, useState} from 'react';
import {Platform} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

type DateInputModalProps = {
  initialValue: Date;
  onSelected: (date: Date) => void;
  maximumDate?: Date;
};

export type DateInputModalHandle = {
  openDatePicker: () => void;
};

export const DateInputModal = forwardRef<
  DateInputModalHandle,
  DateInputModalProps
>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [date, setDate] = useState<Date>(props.initialValue);

  const reset = () => {
    setVisible(false);
    setMode('date');
    setDate(props.initialValue);
  };

  const emit = (date: Date) => {
    props.onSelected(date);
    reset();
  };

  useImperativeHandle(ref, () => ({
    openDatePicker: () => setVisible(true),
  }));

  const commonProps = {
    isVisible: visible,
    maximumDate: props.maximumDate,
    mode: mode,
    onCancel: reset,
  };

  /**
   * iOS only supports selecting a date or a time, not both simultaneously.
   * In this case, select the date with a two-step process, by storing the
   * date first in state, then prompt the user for a time.
   */
  if (Platform.OS === 'ios') {
    const label = mode === 'date' ? 'Pick the Date' : 'Pick the Time';
    const confirmation = mode === 'date' ? 'Set Date' : 'Set Time';
    return (
      <DateTimePickerModal
        {...commonProps}
        accessibilityLabel={label}
        confirmTextIOS={confirmation}
        onConfirm={(selectedDate: Date) => {
          if (mode === 'date') {
            // if in date mode, simply set the value & change mode to 'time'
            setDate(selectedDate);
            setMode('time');
          } else {
            // else merge the previously selected date and the selected time
            const onlyDate = moment(date).format('YYYY-MM-DD');
            const onlyTime = moment(selectedDate).format('HH:mm:00');
            emit(moment(`${onlyDate} ${onlyTime}`).toDate());
          }
        }}
      />
    );
  }

  return (
    <DateTimePickerModal
      {...commonProps}
      accessibilityLabel="Pick the Date"
      onConfirm={emit}
    />
  );
});
