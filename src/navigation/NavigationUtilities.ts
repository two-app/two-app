import {
  CommonActions,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../Router';

export const resetNavigate = (
  route: string,
  navigation: NavigationProp<RootStackParamList, keyof RootStackParamList>,
) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: route}],
    }),
  );
};

export type Routes = NavigationProp<RootStackParamList>;
export type Route = keyof RootStackParamList;

export type Screen<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
