import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import Colors from '../Colors';

import Label from './Label';

type InputProps = {
  attributes?: Record<string, unknown>;
  isValid?: (value: string) => boolean;
  onChange?: (value: string) => void;
  label?: string;
};

const Input = ({
  attributes = {},
  isValid = () => true,
  onChange = () => null,
  label,
}: InputProps) => {
  const [value, setValue] = useState('');
  const [valid, setValid] = useState(true);
  const [focused, setFocused] = useState(false);

  const input = (
    <TextInput
      {...attributes}
      value={value}
      onChangeText={v => {
        setValue(v);
        onChange(v);
      }}
      onBlur={() => {
        setFocused(false);
        setValid(isValid(value));
      }}
      onFocus={() => setFocused(true)}
      style={[
        styles.input,
        focused ? styles.focusedInput : undefined,
        valid ? undefined : styles.invalidInput,
      ]}
    />
  );

  if (label == null) {
    return input;
  } else {
    return (
      <>
        <Label text={label} />
        {input}
      </>
    );
  }
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderBottomColor: Colors.FADED,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
  },
  focusedInput: {
    borderBottomColor: Colors.DARK,
  },
  invalidInput: {
    borderBottomColor: Colors.SALMON,
    color: Colors.SALMON,
  },
});

export default Input;
