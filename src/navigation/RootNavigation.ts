import * as React from 'react';
import type {NavigationProp} from '@react-navigation/native';

import type {RootStackParamList} from '../../Router';

/**
 * Used to navigate outside of react components.
 */
export const navigationRef =
  React.createRef<NavigationProp<RootStackParamList>>();

export const getNavigation = (): NavigationProp<RootStackParamList> => {
  return navigationRef.current!;
};
