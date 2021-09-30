import * as React from "react";
import type { NavigationProp } from "@react-navigation/native";

import type { RootStackParamList } from "../../Router";

/**
 * Used to navigate outside of react components.
 */
export const navigationRef = React.createRef<Routes>();

export type Routes = NavigationProp<RootStackParamList>;

export const getNavigation = (): Routes => {
  return navigationRef.current!;
};
