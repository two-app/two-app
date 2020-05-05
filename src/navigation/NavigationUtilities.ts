
import { RootStackParamList } from "../../Router";
import { CommonActions, NavigationProp } from "@react-navigation/native";

export const resetNavigate = (
  route: string, navigation: NavigationProp<RootStackParamList, keyof RootStackParamList>
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: route }]
    })
  );
};