import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  View,
  AccessibilityState,
} from 'react-native';
import Colors from '../Colors';
import HapticFeedback from 'react-native-haptic-feedback';

type ButtonStyle = {
  backgroundColor: string;
  textColor: string;
};

export const ButtonStyles = {
  dark: {
    backgroundColor: Colors.DARK,
    textColor: 'white',
  },
  darkPressed: {
    backgroundColor: Colors.DARK,
    textColor: 'white',
  },
  light: {
    backgroundColor: 'white',
    textColor: Colors.DARK,
  },
  lightPressed: {
    backgroundColor: '#fafafa',
    textColor: Colors.VERY_DARK,
  },
};

type ButtonProps = {
  text: string;
  onPress: () => void;
  buttonStyle: ButtonStyle;
  pressedButtonStyle: ButtonStyle;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
};

/**
 * Creates a button with shadow depth and colour feedback, customisable by the
 * buttonStyle and pressedButtonStyle properties.
 */
export const Button = ({
  text,
  onPress,
  buttonStyle,
  pressedButtonStyle,
  accessibilityHint,
  accessibilityLabel,
  accessibilityState
}: ButtonProps) => {
  const [isPressed, setPressed] = useState(false);

  const combinedButtonStyle = {
    ...styles.button,
    backgroundColor: buttonStyle.backgroundColor,
  };
  const combinedPressedButtonStyle = {
    ...styles.button,
    backgroundColor: pressedButtonStyle.backgroundColor,
  };

  const combinedTextStyle = {...styles.text, color: buttonStyle.textColor};
  const combinedPressedTextStyle = {
    ...styles.text,
    color: pressedButtonStyle.textColor,
  };

  const viewStyle = isPressed
    ? combinedPressedButtonStyle
    : combinedButtonStyle;
  const textStyle = isPressed ? combinedPressedTextStyle : combinedTextStyle;

  return (
    <TouchableWithoutFeedback
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      onPressIn={() => {
        setPressed(true);
        HapticFeedback.trigger('selection', {enableVibrateFallback: false});
      }}
      onPressOut={() => setPressed(false)}
      onPress={onPress}>
      <View style={viewStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

Button.defaultProps = {
  buttonStyle: ButtonStyles.dark,
  pressedButtonStyle: ButtonStyles.darkPressed,
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderColor: Colors.FADED,
    borderWidth: 0.5,
    borderRadius: 90,
    marginHorizontal: 3, // Margins used since the card is usually clipped horizontally
    ...Platform.select({
      ios: {
        shadowColor: Colors.DARK,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
  },
});
