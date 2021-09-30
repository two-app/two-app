import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  AccessibilityProps,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import HapticFeedback from "react-native-haptic-feedback";

import Colors from "../Colors";

type CardProps = {
  children?: React.ReactNode;
  style?: any;
};

const Card = ({ children, style }: CardProps) => (
  <View style={{ ...s.card, ...style }}>{children}</View>
);

type TouchableCardProps = CardProps & {
  a11?: AccessibilityProps;
  children?: React.ReactNode;
  style?: any;
  onPress?: () => void;
};

const TouchableCard = (props: TouchableCardProps) => {
  if (Platform.OS === "ios") {
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
  <TouchableOpacity
    {...a11}
    containerStyle={{ overflow: "visible" }}
    onPress={() => onPress && onPress()}
  >
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
        animateOpacity(0.8);
        HapticFeedback.trigger("selection", { enableVibrateFallback: false });
      }}
      onPress={() => onPress && onPress()}
      onPressOut={() => {
        animateOpacity(1);
      }}
    >
      <Animated.View style={[style, s.card, { opacity }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export { Card, TouchableCard };

const s = StyleSheet.create({
  card: {
    overflow: "visible",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderColor: Colors.FADED,
    borderWidth: 0.5,
    borderRadius: 5,
    marginHorizontal: 3, // Margins used since the card is usually clipped horizontally
    ...Platform.select({
      ios: {
        shadowColor: Colors.DARK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
