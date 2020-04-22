import React from 'react';
import {
    ScrollView,
    View,
    ViewProps,
    StatusBar
} from 'react-native';

// @ts-ignore
import SafeAreaView from 'react-native-safe-area-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Wrapper providing the status bar and safe area view.
 */
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <SafeAreaProvider>
            <SafeAreaView style={{ flexGrow: 1 }}>
                {children}
            </SafeAreaView>
        </SafeAreaProvider>
    </>
);

type ViewContainerProps = ViewProps & {
    children?: React.ReactNode
}

export const Container = (props: ViewContainerProps) => (
    <Wrapper>
        <View {...props} style={{ flex: 1, marginLeft: '5%', marginRight: '5%' }}>
            {props.children}
        </View>
    </Wrapper>
);

const ScrollContainer = (props: ViewContainerProps) => (
    <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, marginLeft: '5%', marginRight: '5%' }}
        {...props}>
        {props.children}
    </ScrollView>
);

const WrapperContainer = ({ children }: any) => (
    <Wrapper>
        <ScrollContainer>
            {children}
        </ScrollContainer>
    </Wrapper>
);

export { Wrapper, WrapperContainer };