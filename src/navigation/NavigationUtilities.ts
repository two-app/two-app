import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Router";
import { CommonActions } from "@react-navigation/native";

export const resetNavigate = (
  route: string, navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: route }]
    })
  );
};