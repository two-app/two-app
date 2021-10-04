import {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import Colors from '../Colors';

import {Label} from './Label';

type InputProps = {
  attributes?: Record<string, unknown>;
  isValid?: (value: string) => boolean;
  onChange?: (value: string) => void;
  label?: string;
  accessibilityHint?: string;
  accessibilityLabel?: string;
};

export const Input = ({
  attributes = {},
  isValid = () => true,
  onChange = () => null,
  label,
  accessibilityHint,
  accessibilityLabel,
}: InputProps) => {
  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState<boolean>(true);
  const [focused, setFocused] = useState<boolean>(false);

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
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{text: valid ? 'Valid entry' : 'Invalid entry'}}
    />
  );

  return label == null ? (
    input
  ) : (
    <>
      <Label text={label} />
      {input}
    </>
  );
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
