import { CommonActions, NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../../Router";

export const resetNavigate = (
  route: string,
  navigation: NavigationProp<RootStackParamList, keyof RootStackParamList>
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: route }],
    })
  );
};

export type TwoNav = StackNavigationProp<RootStackParamList>;
