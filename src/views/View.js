import React from 'react';
import {Keyboard, KeyboardAvoidingView, SafeAreaView, StatusBar, TouchableWithoutFeedback, View} from 'react-native';

const DismissKeyboardHOC = (Comp) => {
    return ({children, ...props}) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Comp {...props}>
                {children}
            </Comp>
        </TouchableWithoutFeedback>
    );
};

const DismissKeyboardView = DismissKeyboardHOC(View);

const Wrapper = (props) => (
    <>
        <StatusBar/>
        <SafeAreaView>
            {props.children}
        </SafeAreaView>
    </>
);

export {KeyboardAvoidingView, Wrapper};