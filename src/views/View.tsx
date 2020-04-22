import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    ScrollView, ScrollViewProps,
    TouchableWithoutFeedback,
    View,
    ViewProps,
    StatusBar
} from 'react-native';

// @ts-ignore
import SafeAreaView from 'react-native-safe-area-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Wrapper = ({ children }: { children: any }) => (
    <>
        <StatusBar backgroundColor="white" barStyle="dark-content"/>
        <SafeAreaProvider>
            <SafeAreaView style={{ flexGrow: 1 }}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
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
        <ScrollView {...props} style={{ marginLeft: '5%', marginRight: '5%' }}>
            {props.children}
        </ScrollView>
    </Wrapper>
);

type ViewContainerProps = ViewProps & {
    children?: React.ReactNode
}
export const ContainerView = (props: ViewContainerProps) => (
    <Wrapper>
        <View {...props} style={{ marginLeft: '5%', marginRight: '5%' }}>
            {props.children}
        </View>
    </Wrapper>
);

const Container = ({ children }: { children: any }) => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginLeft: '5%', marginRight: '5%' }}>
            {children}
        </View>
    </ScrollView>
);

const WrapperContainer = ({ children }: any) => (
    <Wrapper>
        <Container>
            {children}
        </Container>
    </Wrapper>
);

const NoScrollWrapperContainer = ({ children }: any) => (
    <>
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, marginLeft: '5%', marginRight: '5%' }}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    </>
);

export { KeyboardAvoidingView, Wrapper, Container, WrapperContainer, NoScrollWrapperContainer };