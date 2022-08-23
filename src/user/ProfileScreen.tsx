import type {ComponentClass} from 'react';
import {useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Linking,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Config from 'react-native-config';

import Colors from '../Colors';
import {resetNavigate, Screen} from '../navigation/NavigationUtilities';
import {Container} from '../views/View';
import {fetchCouple} from '../couple/CoupleService';
import {Profile} from '../couple/Profile';
import {useProfileStore} from './ProfileStore';

export const ProfileScreen = ({navigation}: Screen<'ProfileScreen'>) => {
  const profileStore = useProfileStore();
  const couple = profileStore.couple;

  useEffect(() => {
    fetchCouple().then(couple => useProfileStore.setState({couple}));
  }, []);

  const data: MenuItemProps[] = [
    {
      icon: EvilIcon,
      iconName: 'envelope',
      text: 'Submit Feedback',
      onPress: () =>
        Linking.openURL(
          'mailto:feedback@two.date?subject=Feedback&body=Let%20us%20know%20how%20to%20improve...',
        ),
    },
    {
      icon: EvilIcon,
      iconName: 'exclamation',
      text: 'Report a Problem',
      onPress: () =>
        Linking.openURL(
          'mailto:problem@two.date?subject=Report%20a%20Problem&body=Let%20us%20know%what%went%wrong...',
        ),
    },
    {
      icon: EvilIcon,
      iconName: 'location',
      text: 'Location Settings',
      onPress: () => Alert.alert('Location', "We're not using Location yet!"),
    },
    {
      icon: EvilIcon,
      iconName: 'archive',
      text: 'Terms and Conditions',
      onPress: () => Linking.openURL(Config.TERMS_URL),
    },
    {
      icon: EvilIcon,
      iconName: 'lock',
      text: 'Privacy Policy',
      onPress: () => Linking.openURL(Config.PRIVACY_POLICY_URL),
    },
    {
      icon: Feather,
      iconName: 'power',
      text: 'Logout',
      iconSize: 14,
      iconStyle: {
        marginRight: 5,
      },
      onPress: () => resetNavigate('LogoutScreen', navigation),
    },
  ];

  const listHeader = couple ? (
    <ProfileHeader userProfile={couple.user} partnerProfile={couple.partner!} />
  ) : (
    <></>
  );

  return (
    <Container footer="ProfileScreen">
      <FlatList
        data={data}
        ListHeaderComponent={() => listHeader}
        renderItem={({item}) => <MenuItem {...item} />}
        ItemSeparatorComponent={() => (
          <View style={{flex: 1, height: 2, backgroundColor: Colors.LIGHT}} />
        )}
        keyExtractor={item => item.text}
      />
    </Container>
  );
};

type ProfileHeaderProps = {
  userProfile: Profile;
  partnerProfile: Profile;
};

const ProfileHeader = ({userProfile, partnerProfile}: ProfileHeaderProps) => (
  <View style={styles.profileHeader}>
    <Text style={styles.profileName}>
      {userProfile.firstName} {userProfile.lastName}
    </Text>
    <Text>
      with{' '}
      <Text style={styles.subProfileName}>
        {partnerProfile.firstName} {partnerProfile.lastName}
      </Text>
    </Text>
  </View>
);

type MenuItemProps = {
  text: string;
  icon: ComponentClass<any>;
  iconName: string;
  iconSize?: number;
  iconStyle?: any;
  onPress?: () => void;
};

const MenuItem = (props: MenuItemProps) => (
  <TouchableOpacity
    style={styles.listItem}
    onPress={props.onPress}
    accessibilityLabel={props.text}>
    <Text style={{color: Colors.REGULAR}}>{props.text}</Text>
    <props.icon
      size={props.iconSize ?? 25}
      name={props.iconName}
      color={Colors.REGULAR}
      style={props.iconStyle}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  profileHeader: {
    paddingVertical: 30,
    alignItems: 'center',
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.DARK,
    textAlign: 'center',
  },
  subProfileName: {
    fontWeight: 'bold',
    color: Colors.DARK,
    textAlign: 'center',
  },
  listItem: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
