import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import LoginScreen from './src/authentication/LoginScreen';
import RegisterScreen from './src/authentication/RegisterScreen';
import AcceptTermsScreen from './src/authentication/register_workflow/AcceptTermsScreen';
import ConnectCodeScreen from './src/authentication/register_workflow/ConnectCodeScreen';
import {UserRegistration} from './src/authentication/register_workflow/UserRegistrationModel';
import HomeScreen from './src/home/HomeScreen';
import LoadingScreen from './src/LoadingScreen';
import LogoutScreen from './src/LogoutScreen';
import {MemoryScreen} from './src/memories/memory/MemoryScreen';
import {Memory} from './src/memories/MemoryModels';
import {NewMemoryScreen} from './src/memories/new_memory/NewMemoryScreen';
import {SearchScreen} from './src/search/SearchScreen';
import {NewTagScreen} from './src/tags/NewTagScreen';
import {Tag} from './src/tags/Tag';
import ProfileScreen from './src/user/ProfileScreen';
import {EditMemoryScreen} from './src/memories/memory/EditMemoryScreen';
import {ContentUploadScreen} from './src/content/ContentUploadScreen';
import { PickedContent } from './src/content/ContentPicker';

export type RootStackParamList = {
  LoadingScreen: undefined;
  LogoutScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  AcceptTermsScreen: {userRegistration: UserRegistration};
  ConnectCodeScreen: undefined;
  HomeScreen: undefined;
  NewMemoryScreen: undefined;
  MemoryScreen: {memory: Memory};
  NewTagScreen: {onSubmit: (tag: Tag) => void};
  SearchScreen: undefined;
  ProfileScreen: undefined;
  EditMemoryScreen: {memory: Memory};
  ContentUploadScreen: {memory: Memory; content: PickedContent[]};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="LoadingScreen"
    headerMode={'none'}
    screenOptions={{
      cardStyle: {
        backgroundColor: 'white',
      },
      headerShown: false,
      gestureResponseDistance: {
        vertical: 50,
      },
      cardOverlayEnabled: false,
      cardShadowEnabled: false,
    }}>
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
    <Stack.Screen name="NewTagScreen" component={NewTagScreen} />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{animationEnabled: false}}
    />
    <Stack.Screen name="EditMemoryScreen" component={EditMemoryScreen} />
    <Stack.Screen name="ContentUploadScreen" component={ContentUploadScreen} />
  </Stack.Navigator>
);

export {AppStack};
