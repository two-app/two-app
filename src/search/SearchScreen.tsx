import {Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollContainer} from '../views/View';
import {Button} from '../forms/Button';
import {Screen} from '../navigation/NavigationUtilities';

export const SearchScreen = ({navigation}: Screen<'SearchScreen'>) => {
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
