import {NavigationProp} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  AccessibilityProps,
} from 'react-native';
import {Icon} from 'react-native-vector-icons/Icon';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {RootStackParamList} from '../../Router';
import Colors from '../Colors';
import {resetNavigate} from '../navigation/NavigationUtilities';
import {getNavigation} from '../navigation/RootNavigation';
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
        icon={MaterialCommunityIcon}
        iconName="timeline-text-outline"
        active={active === 'HomeScreen'}
        text="MEMORIES"
        rotateIcon
      />

      <Item
        navigateTo="TagScreen"
        icon={AntIcon}
        iconName="tagso"
        active={active === 'TagScreen'}
        text="TAGS"
      />

      <Item
        navigateTo="ProfileScreen"
        icon={AntIcon}
        iconName="user"
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
  const nav: NavigationProp<RootStackParamList, keyof RootStackParamList> =
    getNavigation();

  return (
    <TouchableOpacity
      {...a11y(props)}
      style={styles.item}
      onPress={() => resetNavigate(props.navigateTo, nav)}>
      <props.icon
        size={25}
        name={props.iconName}
        color={props.active === true ? Colors.DARK_SALMON : Colors.REGULAR}
        style={props.rotateIcon ? styles.iconRotate : {}}
      />
      <Text
        style={{
          ...styles.iconText,
          color: props.active ? Colors.DARK_SALMON : Colors.REGULAR,
        }}>
        {props.text}
      </Text>
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
    transform: [{rotate: '-90deg'}],
  },
  iconText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 10,
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
