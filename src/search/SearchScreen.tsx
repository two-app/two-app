import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { ScrollContainer } from '../views/View';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '../forms/Button';

type SearchScreenProps = { navigation: StackNavigationProp<RootStackParamList, 'LoadingScreen'> }
export const SearchScreen = ({ navigation }: SearchScreenProps) => {

  return (
    <ScrollContainer>
      <Text style={{ textAlign: 'center', color: Colors.REGULAR, marginTop: 30 }}>Stay tuned, the search feature is on its way...</Text>
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 20}}>
        <Button text='Send me back!' onPress={() => navigation.goBack()} />
      </View>
    </ScrollContainer>
  )
};