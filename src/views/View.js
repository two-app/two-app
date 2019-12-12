import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StatusBar,
    TouchableWithoutFeedback,
    View
} from 'react-native';

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

const Wrapper = ({children}) => (
    <>
        <StatusBar/>
        <SafeAreaView>
            {children}
        </SafeAreaView>
    </>
);

const Container = ({children}) => (
    <ScrollView style={{marginLeft: '10%', marginRight: '10%'}}>
        {children}
    </ScrollView>
);

const WrapperContainer = ({children}) => (
    <Wrapper>
        <Container>
            {children}
        </Container>
    </Wrapper>
);

export {KeyboardAvoidingView, Wrapper, Container, WrapperContainer};