import * as React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  AccessibilityProps,
  TouchableOpacity,
} from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';

import Colors from '../Colors';

type CardProps = {
  children?: React.ReactNode;
  style?: any;
};

const Card = ({children, style}: CardProps) => (
  <View style={{...s.card, ...style}}>{children}</View>
);

type TouchableCardProps = CardProps & {
  a11?: AccessibilityProps;
  children?: React.ReactNode;
  style?: any;
  onPress?: () => void;
};

const TouchableCard = (props: TouchableCardProps) => {
  if (Platform.OS === 'ios') {
    return <IOSTouchableCard {...props} />;
  } else {
    return <AndroidTouchableCard {...props} />;
  }
};

const IOSTouchableCard = ({
  a11,
  children,
  style,
  onPress,
}: TouchableCardProps) => (
  <TouchableOpacity {...a11} onPress={() => onPress && onPress()}>
    <Card style={style}>{children}</Card>
  </TouchableOpacity>
);

const AndroidTouchableCard = ({
  a11,
  children,
  style,
  onPress,
}: TouchableCardProps) => {
  const opacity = new Animated.Value(1);

  const animateOpacity = (toValue: number) =>
    Animated.timing(opacity, {
      toValue,
      duration: 50,
      useNativeDriver: false,
    }).start();

  return (
    <TouchableWithoutFeedback
      {...a11}
      onPressIn={() => {
        animateOpacity(0.9);
        HapticFeedback.trigger('selection', {enableVibrateFallback: false});
      }}
      onPress={() => onPress && onPress()}
      onPressOut={() => {
        animateOpacity(1);
      }}>
      <Animated.View style={[style, s.card, {opacity}]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export {Card, TouchableCard};

const s = StyleSheet.create({
  card: {
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    padding: 15,
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DARK,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export const CardMeta = {
  style: Platform.select({
    ios: {
      shadowColor: Colors.DARK,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.14,
      shadowRadius: 3,
    },
    android: {
      elevation: 3,
    },
  }),
};
