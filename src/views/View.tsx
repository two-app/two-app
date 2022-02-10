import * as React from 'react';
import {View, ViewProps, ScrollViewProps, StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RootStackParamList} from '../../Router';
import {Footer} from '../home/Footer';
import SafeAreaView from 'react-native-safe-area-view';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import LoadingView from './LoadingView';

type Container = {
  children?: React.ReactNode;

  /**
   * Creates a full-screen opaque overlay with a loading spinner in the
   * centre. The view underneath the screen is not interactive.
   */
  isLoading?: boolean;

  /**
   * If the view is loading, this percentage number will be displayed.
   * See the 'isLoading' prop.
   */
  loadingPercentage?: number;

  /**
   * If present, a footer will be shown using this prop as the key to
   * dictate which icon is 'active'.
   */
  footer?: keyof RootStackParamList;
};

/**
 * Wrapper providing the status bar and safe area view.
 * Consumes the full screen.
 */
export const Wrapper = ({children}: {children?: React.ReactNode}) => (
  <>
    <StatusBar backgroundColor="white" barStyle="dark-content" />
    <SafeAreaProvider>
      <SafeAreaView style={{flexGrow: 1, backgroundColor: 'white'}}>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  </>
);

type ViewContainerProps = ViewProps & Container;

/**
 * Creates a full-screen view with the container margins.
 */
export const Container = (props: ViewContainerProps) => (
  <Wrapper>
    {props.isLoading === true && (
      <LoadingView loadingPercentage={props.loadingPercentage} />
    )}
    <View {...props} style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}>
      {props.children}
    </View>
    {props.footer && <Footer active={props.footer} />}
  </Wrapper>
);

type ScrollViewContainerProps = ScrollViewProps & Container;

/**
 * Creates a full-screen scroll view with the container margins.
 */
export const ScrollContainer = (props: ScrollViewContainerProps) => (
  <Wrapper>
    {props.isLoading === true && (
      <LoadingView loadingPercentage={props.loadingPercentage} />
    )}
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        marginLeft: '5%',
        marginRight: '5%',
      }}
      {...props}>
      {props.children}
    </KeyboardAwareScrollView>
    {props.footer && <Footer active={props.footer} />}
  </Wrapper>
);
