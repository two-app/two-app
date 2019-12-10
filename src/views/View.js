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
            {/*<KeyboardAvoidingView style={{flex: 1}}>*/}
            {/*    <View style={{flex: 1, marginLeft: "10%", marginRight: "10%"}}>*/}
                    {props.children}
                {/*</View>*/}
            {/*</KeyboardAvoidingView>*/}
        </SafeAreaView>
    </>
);

export {KeyboardAvoidingView, Wrapper};