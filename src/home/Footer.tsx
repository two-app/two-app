import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  AccessibilityProps,
} from 'react-native';
import {Icon} from 'react-native-vector-icons/Icon';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {RootStackParamList} from '../../Router';
import Colors from '../Colors';
import {resetNavigate, Routes} from '../navigation/NavigationUtilities';
import {a11y} from '../views/helpers';

type FooterProps = {
  active: keyof RootStackParamList;
};

export const Footer = ({active}: FooterProps) => (
  <>
    <View style={styles.dynamicBorder} />
    <View style={styles.footer}>
      <Item
        navigateTo="HomeScreen"
        icon={IonIcon}
        iconName="heart-outline"
        active={active === 'HomeScreen'}
        text="MEMORIES"
      />

      <Item
        navigateTo="TagScreen"
        icon={IonIcon}
        iconName="pricetags-outline"
        active={active === 'TagScreen'}
        text="TAGS"
        rotateIcon
      />

      <Item
        navigateTo="ProfileScreen"
        icon={IonIcon}
        iconName="people-outline"
        active={active === 'ProfileScreen'}
        text="PROFILE"
      />
    </View>
  </>
);

type ItemProps = {
  navigateTo: keyof RootStackParamList;
  icon: typeof Icon;
  iconName: string;
  text: string;
  rotateIcon?: boolean;
  active?: boolean;
} & AccessibilityProps;

const Item = (props: ItemProps) => {
  const navigation = useNavigation<Routes>();

  return (
    <TouchableOpacity
      {...a11y(props)}
      style={styles.item}
      onPress={() => resetNavigate(props.navigateTo, navigation)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10}}>
        <props.icon
          size={17}
          name={props.iconName}
          color={props.active === true ? Colors.DARK_SALMON : Colors.REGULAR}
          style={props.rotateIcon ? styles.iconRotate : {}}
        />
        <Text
          style={{
            ...styles.iconText,
            color: props.active ? Colors.DARK_SALMON : Colors.REGULAR,
            marginLeft: 10,
          }}>
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const paddingSize = 7;

const styles = StyleSheet.create({
  footer: {
    paddingBottom: paddingSize,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconRotate: {
    transform: [{rotateY: '180deg'}],
  },
  iconText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  dynamicBorder: {
    height: paddingSize,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        overflow: 'visible',
      },
      android: {
        borderTopWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
      },
    }),
  },
});
