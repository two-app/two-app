import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../Router';

export type MockNavigation = {
  navigate: jest.Mock;
  dispatch: jest.Mock;
  reset: jest.Mock;
  goBack: jest.Mock;
};

export type MockRoute = {
  params: Record<string, any>;
};

export const mockRoute: MockRoute = {
  params: {},
};

export const mockNavigation: MockNavigation = {
  navigate: jest.fn().mockName('navigation function'),
  dispatch: jest.fn().mockName('dispatch function'),
  reset: jest.fn().mockName('reset function'),
  goBack: jest.fn().mockName('go back function'),
};

export const resetMockNavigation = () => {
  mockNavigation.navigate.mockReset().mockName('navigation function');
  mockNavigation.dispatch.mockReset().mockName('dispatch function');
  mockNavigation.reset.mockReset().mockName('reset function');
  mockNavigation.goBack.mockReset().mockName('go back function');
};

export const mockNavigationProps = <T extends keyof RootStackParamList>() =>
  ({
    navigation: mockNavigation,
    route: mockRoute,
  } as any as {
    navigation: NativeStackNavigationProp<RootStackParamList, T>;
    route: RouteProp<RootStackParamList, T>;
  });

export const setupMockNavigation = () => {
  jest.mock('@react-navigation/native', () => {
    return {
      ...(jest.requireActual('@react-navigation/native') as any),
      useNavigation: () => ({...mockNavigation}),
      useRoute: () => ({...mockRoute}),
    };
  });
};
