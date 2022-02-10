import {LoginScreen} from './src/authentication/LoginScreen';
import {RegisterScreen} from './src/authentication/RegisterScreen';
import {AcceptTermsScreen} from './src/authentication/register_workflow/AcceptTermsScreen';
import {ConnectCodeScreen} from './src/authentication/register_workflow/ConnectCodeScreen';
import type {UserRegistration} from './src/authentication/register_workflow/UserRegistrationModel';
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
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type RootStackParamList = {
  LoadingScreen: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  AcceptTermsScreen: {userRegistration: UserRegistration};
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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="LoadingScreen"
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
    }}>
    {/* Workflow */}
    <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="AcceptTermsScreen" component={AcceptTermsScreen} />
    <Stack.Screen name="ConnectCodeScreen" component={ConnectCodeScreen} />

    {/* Top Level Screens */}
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{animation: 'none'}}
    />
    <Stack.Screen
      name="TagScreen"
      component={TagScreen}
      options={{animation: 'none'}}
    />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{animation: 'none'}}
    />

    {/* Utility */}
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{animation: 'slide_from_bottom'}}
    />

    {/* Memories */}
    <Stack.Screen name="NewMemoryScreen" component={NewMemoryScreen} />
    <Stack.Screen name="MemoryScreen" component={MemoryScreen} />
    <Stack.Screen name="EditMemoryScreen" component={EditMemoryScreen} />

    {/* Tags */}
    <Stack.Screen name="TagManagementScreen" component={TagManagementScreen} />
  </Stack.Navigator>
);

export {AppStack};
