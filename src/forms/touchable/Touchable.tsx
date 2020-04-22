import React from 'react';
import { View, ViewProps, Vibration, TouchableWithoutFeedback } from 'react-native';

const noop = () => { };

type TouchEvents = {
  onPress: () => void,
  onPressIn: () => void,
  onPressOut: () => void
}

type TouchableView = ViewProps & {
  children?: React.ReactNode
}

type TouchableProps = TouchableView & TouchEvents;

/**
 * Minimalistic touchable view that
 * activates a small vibration for
 * feedback.
 */
export const Touchable = (props: TouchableProps) => {
  const events: TouchEvents = props;
  const viewProps: TouchableView = props;

  return (
    <TouchableWithoutFeedback
      {...events}
      onPressIn={() => {
        Vibration.vibrate(5);
        events.onPressIn();
      }}
      >
      <View {...viewProps}>
        {viewProps.children}
      </View>
    </TouchableWithoutFeedback>
  );
};

Touchable.defaultProps = {
  onPress: noop,
  onPressIn: noop,
  onPressOut: noop
}