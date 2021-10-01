import {TextInput, View} from 'react-native';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import { useState } from 'react';

import Colors from '../../Colors';
import {Card} from '../../forms/Card';

import {FormStyle} from './FormStyles';

type LocationInputProps = {
  setLocation: (location: string) => void;
  initialValue: string;
  placeholder?: string;
};

const LocationInput = ({
  setLocation,
  initialValue,
  placeholder,
}: LocationInputProps) => {
  const [value, setValue] = useState<string>(initialValue);
  return (
    <Card style={FormStyle.card}>
      <View style={FormStyle.iconContainer}>
        <FoundationIcon
          name="marker"
          style={{fontSize: 15, color: Colors.REGULAR}}
        />
      </View>
      <TextInput
        accessibilityLabel="Set Location"
        placeholder={placeholder}
        placeholderTextColor={Colors.REGULAR}
        style={{color: Colors.DARK, flex: 1, paddingVertical: 0}}
        onChangeText={setValue}
        value={value}
        onBlur={() => setLocation(value || '')}
      />
    </Card>
  );
};

LocationInput.defaultProps = {
  initialValue: '',
  placeholder: 'Where it took place...',
};

export {LocationInput};
