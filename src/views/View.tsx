import React, {ReactElement} from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StatusBar,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// @ts-ignore
const DismissKeyboardHOC = (Comp) => {
    // @ts-ignore
    return ({children, ...props}) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Comp {...props}>
                {children}
            </Comp>
        </TouchableWithoutFeedback>
    );
};

const DismissKeyboardView = DismissKeyboardHOC(View);

const Wrapper = ({children}: {children: any}) => (
    <>
        <StatusBar/>
        <SafeAreaView>
            {children}
        </SafeAreaView>
    </>
);

const Container = ({children}: {children: any}) => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginLeft: '10%', marginRight: '10%'}}>
            {children}
        </View>
    </ScrollView>
);

const WrapperContainer = ({children}: any) => (
    <Wrapper>
        <Container>
            {children}
        </Container>
    </Wrapper>
);

export {KeyboardAvoidingView, Wrapper, Container, WrapperContainer};