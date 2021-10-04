import {createRef} from 'react';
import type {NavigationProp, RouteProp} from '@react-navigation/native';

import type {RootStackParamList} from '../../Router';

/**
 * Used to navigate outside of react components.
 */
export const navigationRef = createRef<Routes>();

export type Routes = NavigationProp<RootStackParamList>;
export type Route<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export const getNavigation = (): Routes => {
  return navigationRef.current!;
};
