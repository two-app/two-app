import React from 'react';
import { Wrapper } from '../views/View';
import { View } from 'react-native';
import { Footer } from '../home/Footer';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Button } from '../forms/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { resetNavigate } from '../navigation/NavigationUtilities';

type ProfileScreenProps = { navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'> }

export const ProfileScreen = ({navigation}: ProfileScreenProps) => (
  <Wrapper>
    <View style={{ flexGrow: 1, alignItems: 'center', paddingVertical: 20 }}>
      <AntIcon size={150} name='user' />
      <Button onPress={() => resetNavigate('LogoutScreen', navigation)} text='logout' />
    </View>
    <Footer active="ProfileScreen" />
  </Wrapper>
);