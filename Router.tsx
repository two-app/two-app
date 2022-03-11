import {LoginScreen} from './src/authentication/LoginScreen';
import {RegisterScreen} from './src/authentication/RegisterScreen';
import {ConnectCodeScreen} from './src/authentication/ConnectCodeScreen';
import {HomeScreen} from './src/home/HomeScreen';
import {LoadingScreen} from './src/LoadingScreen';
import {LogoutScreen} from './src/LogoutScreen';
import {MemoryScreen} from './src/memories/memory/MemoryScreen';
import {NewMemoryScreen} from './src/memories/new_memory/NewMemoryScreen';
import {SearchScreen} from './src/search/SearchScreen';
import type {Tag} from './src/tags/Tag';
import {ProfileScreen} from './src/user/ProfileScreen';
import {EditMemoryScreen} from './src/memories/memory/EditMemoryScreen';
import {TagScreen} from './src/tags/tag_screen/TagScreen';
import {TagManagementScreen} from './src/tags/tag_management/TagManagementScreen';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {MediaScreen} from './src/content/MediaScreen';
import {Platform} from 'react-native';

export type RootStackParamList = {
  LoadingScreen: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ConnectCodeScreen: undefined;
  HomeScreen: undefined;
  NewMemoryScreen: undefined;
  MemoryScreen: {mid: string};
  TagManagementScreen: {
    initialTag?: Tag;
    onSubmit: (tag: Tag) => void;
  };
  SearchScreen: undefined;
  ProfileScreen: undefined;
  EditMemoryScreen: {mid: string};
  TagScreen: undefined;
  MediaScreen: {
    index: number;
    mid: string;
  };
};

const Stack = createSharedElementStackNavigator<RootStackParamList>();

// @ts-ignore
const fade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="LoadingScreen"
    screenOptions={{
      headerShown: false,
    }}>
    {/* Workflow */}
    <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{cardStyleInterpolator: fade}}
    />
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{cardStyleInterpolator: fade}}
    />
    <Stack.Screen name="ConnectCodeScreen" component={ConnectCodeScreen} />

    {/* Top Level Screens */}
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{cardStyleInterpolator: fade}}
    />
    <Stack.Screen
      name="TagScreen"
      component={TagScreen}
      options={{cardStyleInterpolator: fade}}
    />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{cardStyleInterpolator: fade}}
    />

    {/* Utility */}
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{cardStyleInterpolator: fade}}
    />

    {/* Memories */}
    <Stack.Screen name="NewMemoryScreen" component={NewMemoryScreen} />
    <Stack.Screen name="MemoryScreen" component={MemoryScreen} />
    <Stack.Screen name="EditMemoryScreen" component={EditMemoryScreen} />

    {/* Tags */}
    <Stack.Screen name="TagManagementScreen" component={TagManagementScreen} />

    {/* Media/Content */}
    <Stack.Screen
      name="MediaScreen"
      component={MediaScreen}
      options={{
        cardStyleInterpolator: ({current: {progress}}) => {
          const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return {cardStyle: {opacity}};
        },
        gestureEnabled: false,
        cardStyle: {
          backgroundColor: 'transparent',
        },
      }}
      sharedElements={(route, _, showing) => {
        const {index} = route.params;
        if (Platform.OS !== 'ios' && !showing) {
          return [];
        }
        return [`${index}`];
      }}
    />
  </Stack.Navigator>
);

export {AppStack};
