import {forwardRef, ReactElement, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Text,
} from 'react-native';
import {TextInputMask, TextInputMaskProps} from 'react-native-masked-text';
import {Icon} from 'react-native-vector-icons/Icon';

import Colors from '../Colors';

type ValidatedString = [string, boolean];

type InputProps = TextInputProps & {
  initialValue?: string;
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
  const [value, setValue] = useState<string>(props.initialValue ?? '');
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

  const emit = () => {
    setFocused(false);
    const valid = props.isValid?.(value) ?? true;
    setValid(valid);
    props.onEmit([value, valid]);
  };

  const commonProps: TextInputProps = {
    value,
    onChangeText: setValue,
    onSubmitEditing: emit,
    onBlur: emit,
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

type FakeInputProps = {
  placeholder: string;
  value?: string;
  valid: boolean;
  icon?: {
    name: string;
    provider: typeof Icon;
  };
  containerStyle?: ViewStyle;
};

export const FakeInput = (props: FakeInputProps) => {
  const {value, valid, icon, containerStyle} = props;
  let focusStyle;

  if (value == null || value == '') {
    focusStyle = styles.unfocused;
  } else if (valid) {
    focusStyle = styles.valid;
  } else {
    focusStyle = styles.invalid;
  }

  let DataComponent: ReactElement;

  if (value == null || value == '') {
    // Create a placeholder
    DataComponent = (
      <Text style={{color: PLACEHOLDER_COLOR}}>{props.placeholder}</Text>
    );
  } else {
    DataComponent = <Text style={focusStyle}>{value}</Text>;
  }

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={[styles.input, focusStyle]}>{DataComponent}</View>
      <View style={[focusStyle, styles.iconContainer]}>
        {props.icon != null && (
          <props.icon.provider
            name={props.icon.name}
            size={15}
            color={focusStyle.color}
          />
        )}
      </View>
    </View>
  );
};

const HEIGHT = 50;
const BORDER_WIDTH = 1;
const BORDER_RADIUS = 5;
const PLACEHOLDER_COLOR = 'rgba(0, 0, 0.0980392, 0.5)';
const FONT_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    backgroundColor: 'white',
  },
  input: {
    flexGrow: 1,
    padding: 15,
    fontSize: FONT_SIZE,
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
