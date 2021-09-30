import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {LoginScreen} from './src/authentication/LoginScreen';
import RegisterScreen from './src/authentication/RegisterScreen';
import {AcceptTermsScreen} from './src/authentication/register_workflow/AcceptTermsScreen';
import {ConnectCodeScreen} from './src/authentication/register_workflow/ConnectCodeScreen';
import type {UserRegistration} from './src/authentication/register_workflow/UserRegistrationModel';
import HomeScreen from './src/home/HomeScreen';
import LoadingScreen from './src/LoadingScreen';
import LogoutScreen from './src/LogoutScreen';
import MemoryScreen from './src/memories/memory/MemoryScreen';
import {NewMemoryScreen} from './src/memories/new_memory/NewMemoryScreen';
import {SearchScreen} from './src/search/SearchScreen';
import type {Tag} from './src/tags/Tag';
import ProfileScreen from './src/user/ProfileScreen';
import EditMemoryScreen from './src/memories/memory/EditMemoryScreen';
import ContentUploadScreen from './src/content/ContentUploadScreen';
import type {PickedContent} from './src/content/ContentPicker';
import TagScreen from './src/tags/tag_screen/TagScreen';
import {TagManagementScreen} from './src/tags/tag_management/TagManagementScreen';

export type RootStackParamList = {
  LoadingScreen: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  AcceptTermsScreen: {userRegistration: UserRegistration};
  ConnectCodeScreen: undefined;
  HomeScreen: undefined;
  NewMemoryScreen: undefined;
  MemoryScreen: {mid: number};
  TagManagementScreen: {
    initialTag?: Tag;
    onSubmit: (tag: Tag) => void;
  };
  SearchScreen: undefined;
  ProfileScreen: undefined;
  EditMemoryScreen: {mid: number};
  ContentUploadScreen: {mid: number; content: PickedContent[]};
  TagScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="LoadingScreen"
    screenOptions={{
      cardStyle: {
        backgroundColor: 'white',
      },
      headerShown: false,
      gestureResponseDistance: 50,
      cardOverlayEnabled: false,
      cardShadowEnabled: false,
    }}
  >
    <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    <Stack.Screen name="AcceptTermsScreen" component={AcceptTermsScreen} />
    <Stack.Screen name="ConnectCodeScreen" component={ConnectCodeScreen} />
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{animationEnabled: false}}
    />
    <Stack.Screen name="NewMemoryScreen" component={NewMemoryScreen} />
    <Stack.Screen name="MemoryScreen" component={MemoryScreen} />
    <Stack.Screen name="TagManagementScreen" component={TagManagementScreen} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{animationEnabled: false}}
    />
    <Stack.Screen name="EditMemoryScreen" component={EditMemoryScreen} />
    <Stack.Screen name="ContentUploadScreen" component={ContentUploadScreen} />
    <Stack.Screen
      name="TagScreen"
      component={TagScreen}
      options={{animationEnabled: false}}
    />
  </Stack.Navigator>
);

export {AppStack};
