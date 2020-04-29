import React from 'react';
import { StyleSheet, View, Platform, Vibration, TouchableWithoutFeedback, Animated, StyleProp, ViewStyle } from 'react-native';
import Colors from '../Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Card = ({ children, style }: { children?: any, style?: any }) => (
    <View style={{ ...s.card, ...style }}>{children}</View>
);

type TouchableCardProps = {
    children?: React.ReactNode,
    style?: any,
    onPress?: () => void
};

const TouchableCard = (props: TouchableCardProps) => {
    if (Platform.OS === 'ios') {
        return <IOSTouchableCard {...props}/>
    } else {
        return <AndroidTouchableCard {...props}/>
    }
};

const IOSTouchableCard = ({ children, style, onPress }: TouchableCardProps) => (
    <TouchableOpacity containerStyle={{ overflow: 'visible' }} onPress={() => onPress && onPress()}>
        <Card style={style}>
            {children}
        </Card>
    </TouchableOpacity>
);

const AndroidTouchableCard = ({ children, style, onPress }: TouchableCardProps) => {
    const opacity = new Animated.Value(1);

    const animateOpacity = (toValue: number) => Animated.timing(
        opacity,
        { toValue, duration: 50, useNativeDriver: false }
    ).start();

    return (
        <TouchableWithoutFeedback
            onPressIn={() => {
                animateOpacity(0.8);
                Vibration.vibrate(4);
            }}
            onPress={() => onPress && onPress()}
            onPressOut={() => {
                animateOpacity(1);
            }}
        >
            <Animated.View style={[style, s.card, {opacity}]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

export { Card, TouchableCard };

const s = StyleSheet.create({
    card: {
        overflow: 'visible',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderColor: Colors.FADED,
        borderWidth: 0.5,
        borderRadius: 5,
        marginHorizontal: 3, // Margins used since the card is usually clipped horizontally
        ...Platform.select({
            ios: {
                shadowColor: Colors.DARK,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.22,
                shadowRadius: 3
            },
            android: {
                elevation: 3
            }
        })
    }
});

