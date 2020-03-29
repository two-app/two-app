import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from './src/LoadingScreen';
import LogoutScreen from './src/LogoutScreen';
import LoginScreen from './src/authentication/LoginScreen';
import RegisterScreen from './src/authentication/RegisterScreen';
import AcceptTermsScreen from './src/authentication/register_workflow/AcceptTermsScreen';
import ConnectCodeScreen from './src/authentication/register_workflow/ConnectCodeScreen';
import HomeScreen from './src/home/HomeScreen';
import {NewMemoryScreen} from './src/memories/new_memory/NewMemoryScreen';
import {UserRegistration} from './src/authentication/register_workflow/UserRegistrationModel';
import {MemoryScreen} from './src/memories/memory/MemoryScreen';
import {Memory} from './src/memories/MemoryModels';

export type RootStackParamList = {
    LoadingScreen: undefined;
    LogoutScreen: undefined;
    LoginScreen: undefined;
    RegisterScreen: undefined;
    AcceptTermsScreen: { userRegistration: UserRegistration };
    ConnectCodeScreen: undefined;
    HomeScreen: undefined;
    NewMemoryScreen: undefined;
    MemoryScreen: { memory: Memory };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppStack = () => (
    <Stack.Navigator initialRouteName="LoadingScreen" headerMode={'none'} screenOptions={{cardStyle: {backgroundColor: "white"}}}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen}/>
        <Stack.Screen name="LogoutScreen" component={LogoutScreen}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
        <Stack.Screen name="AcceptTermsScreen" component={AcceptTermsScreen}/>
        <Stack.Screen name="ConnectCodeScreen" component={ConnectCodeScreen}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="NewMemoryScreen" component={NewMemoryScreen}/>
        <Stack.Screen name="MemoryScreen" component={MemoryScreen}/>
    </Stack.Navigator>
);

export {AppStack};