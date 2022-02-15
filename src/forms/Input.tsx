import {forwardRef, ReactElement, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {TextInputMask, TextInputMaskProps} from 'react-native-masked-text';
import {Icon} from 'react-native-vector-icons/Icon';

import Colors from '../Colors';

type ValidatedString = [string, boolean];

type InputProps = TextInputProps & {
  onEmit: (e: ValidatedString) => void;
  isValid?: (value: string) => boolean;
  icon?: {
    name: string;
    provider: typeof Icon;
  };
  mask?: TextInputMaskProps;
  containerStyle?: ViewStyle;
};

export const Input = forwardRef((props: InputProps, ref) => {
  const [value, setValue] = useState<string>('');
  const [valid, setValid] = useState<boolean>(true);
  const [focused, setFocused] = useState<boolean>(false);
  let focusedStyle;

  if (focused) {
    focusedStyle = styles.focused;
  } else if (value === '') {
    focusedStyle = styles.unfocused;
  } else {
    focusedStyle = valid ? styles.valid : styles.invalid;
  }

  const commonProps: TextInputProps = {
    value,
    onChangeText: setValue,
    onSubmitEditing: () => {
      setFocused(false);
      const valid = props.isValid == null ? true : props.isValid(value);
      setValid(valid);
      props.onEmit([value, valid]);
    },
    onBlur: () => setFocused(false),
    onFocus: () => setFocused(true),
    style: [styles.input, focusedStyle],
    accessibilityValue: {text: valid ? 'Valid entry' : 'Invalid entry'},
    placeholderTextColor: 'rgba(0, 0, 0, 0.5)',
  };

  let InputComponent: ReactElement;

  if (props.mask) {
    InputComponent = (
      // @ts-ignore
      <TextInputMask {...commonProps} {...props.mask} {...props} ref={ref} />
    );
  } else {
    // @ts-ignore
    InputComponent = <TextInput {...commonProps} {...props} ref={ref} />;
  }

  return (
    <View style={[styles.container, props.containerStyle]}>
      {InputComponent}
      <View style={{...focusedStyle, ...styles.iconContainer}}>
        {props.icon != null && (
          <props.icon.provider
            name={props.icon.name}
            size={15}
            color={focusedStyle.color}
          />
        )}
      </View>
    </View>
  );
});

const HEIGHT = 45;
const BORDER_WIDTH = 1;
const BORDER_RADIUS = 5;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
  },
  input: {
    flexGrow: 1,
    padding: 15,
    fontSize: 13,
    borderTopLeftRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
  },
  iconContainer: {
    width: HEIGHT,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
  },
  unfocused: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    color: Colors.REGULAR,
  },
  focused: {
    borderColor: Colors.DARK,
    color: Colors.DARK,
  },
  invalid: {
    borderColor: Colors.SALMON,
    color: Colors.SALMON,
  },
  valid: {
    borderColor: Colors.VALID_GREEN,
    color: Colors.VALID_GREEN,
  },
});
