import React, {useEffect, useState, ComponentClass} from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import Config from 'react-native-config';

import Colors from '../Colors';
import {resetNavigate} from '../navigation/NavigationUtilities';
import {RootStackParamList} from '../../Router';
import {Footer} from '../home/Footer';
import {Wrapper, NoWrapContainer} from '../views/View';

import * as TagService from './TagService';
import {Tag} from './Tag';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileScreen'>;
};

export const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const [tags, setTags] = useState<Tag[]>();

  useEffect(() => {
    TagService.getTags().then(setTags);
  }, []);

  /*{
    icon: EvilIcon,
    iconName: 'tag',
    text: 'Manage Tags'
  },*/

  return (
    <Wrapper>
      <NoWrapContainer>
        <FlatList
          data={data}
          ListHeaderComponent={() => (
            <ProfileHeader
              userProfile={userProfile}
              partnerProfile={partnerProfile}
            />
          )}
          renderItem={({item}) => <MenuItem {...item} />}
          ItemSeparatorComponent={() => (
            <View style={{flex: 1, height: 2, backgroundColor: Colors.LIGHT}} />
          )}
          keyExtractor={(item) => item.text}
          testID="menu"
        />
      </NoWrapContainer>
      <Footer active="ProfileScreen" />
    </Wrapper>
  );
};

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
      size={props.iconSize}
      name={props.iconName}
      color={Colors.REGULAR}
      style={props.iconStyle}
    />
  </TouchableOpacity>
);

MenuItem.defaultProps = {
  iconSize: 25,
  iconStyle: {},
  onPress: () => {},
};

const styles = StyleSheet.create({
  listItem: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
