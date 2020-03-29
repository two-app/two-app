import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView, ScrollViewProps,
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

const Wrapper = ({children}: { children: any }) => (
    <>
        <StatusBar/>
        <SafeAreaView>
            {children}
        </SafeAreaView>
    </>
);

type ScrollViewContainerProps = ScrollViewProps & {
    children?: React.ReactNode
}

/**
 * Extends React.ScrollView to include the default wrapper and container margins.
 * Any additional props are appended to the Scroll View, not the wrapping container.
 */
export const ScrollViewContainer = (props: ScrollViewContainerProps) => (
    <Wrapper>
        <ScrollView {...props} style={{marginLeft: '5%', marginRight: '5%'}}>
            {props.children}
        </ScrollView>
    </Wrapper>
);

const Container = ({children}: { children: any }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}>
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

const NoScrollWrapperContainer = ({children}: any) => (
    <>
        <StatusBar/>
        <SafeAreaView style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}>
            {children}
        </SafeAreaView>
    </>
);

export {KeyboardAvoidingView, Wrapper, Container, WrapperContainer, NoScrollWrapperContainer};