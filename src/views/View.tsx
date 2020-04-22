import React from 'react';
import {
    ScrollView,
    View,
    ViewProps,
    StatusBar,
    ScrollViewProps
} from 'react-native';

// @ts-ignore
import SafeAreaView from 'react-native-safe-area-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingView from './LoadingView';

/**
 * Wrapper providing the status bar and safe area view.
 * Consumes the full screen.
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

type Container = {
    children?: React.ReactNode,

    /**
     * Creates a full-screen opaque overlay with a loading spinner in the
     * centre. The view underneath the screen is not interactive.
     */
    isLoading?: boolean
}

/**
 * Containers
 */

type ViewContainerProps = ViewProps & Container;

/**
 * Creates a full-screen view with the container margins.
 */
export const Container = (props: ViewContainerProps) => (
    <Wrapper>
        {props.isLoading === true && <LoadingView/>}
        <View {...props} style={{ flex: 1, marginLeft: '5%', marginRight: '5%' }}>
            {props.children}
        </View>
    </Wrapper>
);

type ScrollViewContainerProps = ScrollViewProps & Container;

/**
 * Creates a full-screen scroll view with the container margins.
 */
export const ScrollContainer = (props: ScrollViewContainerProps) => (
    <Wrapper>
        {props.isLoading === true && <LoadingView/>}
        <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, marginLeft: '5%', marginRight: '5%' }}
            {...props}>
            {props.children}
        </ScrollView>
    </Wrapper>
);