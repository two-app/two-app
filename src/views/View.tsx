import * as React from 'react';
import {View, ViewProps, ScrollViewProps} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RootStackParamList} from '../../Router';
import {Footer} from '../home/Footer';

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

type ViewContainerProps = ViewProps & Container;

/**
 * Creates a full-screen view with the container margins.
 */
export const Container = (props: ViewContainerProps) => (
  <View style={{backgroundColor: 'white', flex: 1}}>
    {props.isLoading === true && (
      <LoadingView loadingPercentage={props.loadingPercentage} />
    )}
    <View {...props} style={{flex: 1, marginLeft: '5%', marginRight: '5%'}}>
      {props.children}
    </View>
    {props.footer && <Footer active={props.footer} />}
  </View>
);

type ScrollViewContainerProps = ScrollViewProps & Container;

/**
 * Creates a full-screen scroll view with the container margins.
 */
export const ScrollContainer = (props: ScrollViewContainerProps) => (
  <View style={{backgroundColor: 'white', flex: 1}}>
    {props.isLoading === true && (
      <LoadingView loadingPercentage={props.loadingPercentage} />
    )}
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      onScrollEndDrag={() => console.log('finished')}
      contentContainerStyle={{
        flexGrow: 1,
        marginLeft: '5%',
        marginRight: '5%',
      }}
      {...props}>
      {props.children}
    </KeyboardAwareScrollView>
    {props.footer && <Footer active={props.footer} />}
  </View>
);
