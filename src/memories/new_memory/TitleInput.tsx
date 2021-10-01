import {TextInput, View} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { useState } from 'react';

import Colors from '../../Colors';
import {Card} from '../../forms/Card';

import {FormStyle} from './FormStyles';

type TitleInputProps = {
  setTitle: (title: string) => void;
  initialValue: string;
  placeholder?: string;
};

const TitleInput = ({setTitle, placeholder, initialValue}: TitleInputProps) => {
  const [value, setValue] = useState<string>(initialValue);
  return (
    <Card style={FormStyle.card}>
      <View style={FormStyle.iconContainer}>
        <SimpleLineIcon
          name="pencil"
          style={{fontSize: 13, color: Colors.REGULAR}}
        />
      </View>
      <TextInput
        accessibilityLabel="Set Title"
        placeholder={placeholder}
        placeholderTextColor={Colors.REGULAR}
        autoFocus={true}
        style={{color: Colors.DARK, flex: 1, paddingVertical: 0}}
        onChangeText={setValue}
        value={value}
        onBlur={() => setTitle(value || '')}
      />
    </Card>
  );
};

TitleInput.defaultProps = {
  placeholder: 'Title of your new memory...',
  initialValue: '',
};

export default TitleInput;
