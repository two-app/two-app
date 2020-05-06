import React, { useEffect, useState, ComponentClass } from 'react';
import { Wrapper, NoWrapContainer } from '../views/View';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Footer } from '../home/Footer';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { TwoState } from '../state/reducers';
import { selectUser } from '.';
import { connect, ConnectedProps } from 'react-redux';
import UserService, { UserProfile } from './UserService';
import PartnerService from './PartnerService';
import Colors from '../Colors';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { resetNavigate } from '../navigation/NavigationUtilities';


const mapStateToProps = (state: TwoState) => ({ user: selectUser(state.user) });
const connector = connect(mapStateToProps);
type ConnectorProps = ConnectedProps<typeof connector>;
type ProfileScreenProps = ConnectorProps & {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>
}

export const ProfileScreen = ({ navigation, user }: ProfileScreenProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(
    { ...user, firstName: '', lastName: '' }
  );
  const [partnerProfile, setPartnerProfile] = useState<UserProfile>();

  useEffect(() => {
    UserService.getSelf().then(setUserProfile);
    PartnerService.getPartner().then(setPartnerProfile);
  }, []);

  const data: MenuItemProps[] = [/*{
    icon: EvilIcon,
    iconName: 'tag',
    text: 'Manage Tags'
  },*/ {
    icon: EvilIcon,
    iconName: 'envelope',
    text: 'Submit Feedback',
    onPress: () => Linking.openURL('mailto:feedback@two.date?subject=Feedback&body=Let%20us%20know%20how%20to%20improve...')
  }, {
    icon: EvilIcon,
    iconName: 'exclamation',
    text: 'Report a Problem',
    onPress: () => Linking.openURL('mailto:problem@two.date?subject=Report%20a%20Problem&body=Let%20us%20know%what%went%wrong...')
  }/*, {
    icon: EvilIcon,
    iconName: 'location',
    text: 'Location Settings'
  }*//*, {
    icon: EvilIcon,
    iconName: 'archive',
    text: 'Terms and Conditions'
  }*/,{
    icon: EvilIcon,
    iconName: 'lock',
    text: 'Privacy Policy',
    onPress: () => Linking.openURL('https://two.date/privacy.html')
  }, {
    icon: Feather,
    iconName: 'power',
    text: 'Logout',
    iconSize: 14,
    iconStyle: {
      marginRight: 5
    },
    onPress: () => resetNavigate('LogoutScreen', navigation)
  }];

  return (
    <Wrapper>
      <NoWrapContainer>
        <FlatList
          data={data}
          ListHeaderComponent={() => <ProfileHeader userProfile={userProfile} partnerProfile={partnerProfile}/>}
          renderItem={({item}) => <MenuItem {...item}/>}
          ItemSeparatorComponent={() => <View style={{flex: 1, height: 2, backgroundColor: Colors.LIGHT}}/>}
          keyExtractor={item => item.text}
          testID='menu'
        />
      </NoWrapContainer>
      <Footer active="ProfileScreen" />
    </Wrapper>
  );
};

type ProfileHeaderProps = {
  userProfile: UserProfile,
  partnerProfile: UserProfile | undefined
}

const ProfileHeader = ({ userProfile, partnerProfile }: ProfileHeaderProps) => (
  <View style={{ height: 150, alignItems: 'center', flexDirection: 'row' }}>
    <View style={styles.profilePicture}>
      <AntIcon name='user' size={50} color='#7D4F50' />
    </View>
    <View style={{ flex: 1, flexGrow: 1, padding: 20 }}>
      <Text style={styles.profileName} data-testid='user-name'>{userProfile.firstName} {userProfile.lastName}</Text>
      {partnerProfile != null &&
        <Text>with <Text style={styles.subProfileName} data-testid='partner-name'>{partnerProfile.firstName} {partnerProfile.lastName}</Text></Text>
      }
    </View>
  </View>
);

type MenuItemProps = {
  text: string,
  icon: ComponentClass<any>,
  iconName: string,
  iconSize?: number,
  iconStyle?: any,
  onPress?: () => void,
};

const MenuItem = (props: MenuItemProps) => (
  <TouchableOpacity style={styles.listItem} onPress={props.onPress} accessibilityLabel={props.text}>
    <Text style={{ color: Colors.REGULAR }}>{props.text}</Text>
    <props.icon size={props.iconSize} name={props.iconName} color={Colors.REGULAR} style={props.iconStyle}/>
  </TouchableOpacity>
);

MenuItem.defaultProps = {
  iconSize: 25,
  iconStyle: {},
  onPress: () => { }
};

const styles = StyleSheet.create({
  profilePicture: {
    backgroundColor: '#FEEFDD',
    width: 100,
    height: 100,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.LIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.DARK
  },
  subProfileName: {
    fontWeight: 'bold',
    color: Colors.DARK
  },
  listItem: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default connector(ProfileScreen);