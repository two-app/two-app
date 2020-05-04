import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../Router";

export const navigateFn = jest.fn();
export const dispatchFn = jest.fn();

export const getNavigation = (): NavigationProp<RootStackParamList> => {
  return {
    navigate: navigateFn,
    dispatch: dispatchFn
  } as any;
}
