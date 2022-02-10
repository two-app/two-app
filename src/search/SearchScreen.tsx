import {Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {RootStackParamList} from '../../Router';
import {ScrollContainer} from '../views/View';
import {Button} from '../forms/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type SearchScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LoadingScreen'>;
};
export const SearchScreen = ({navigation}: SearchScreenProps) => {
  return (
    <ScrollContainer>
      <Text style={{textAlign: 'center', color: Colors.REGULAR, marginTop: 30}}>
        Stay tuned, the search feature is on its way...
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Button text="Send me back!" onPress={() => navigation.goBack()} />
      </View>
    </ScrollContainer>
  );
};
