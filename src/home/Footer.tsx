import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Router";
import { resetNavigate } from "../navigation/NavigationUtilities";
import Colors from "../Colors";
import { ComponentClass } from "enzyme";
import { getNavigation } from "../navigation/RootNavigation";

type FooterProps = {
  active: keyof RootStackParamList
}

export const Footer = ({ active }: FooterProps) => {
  return (
    <View style={styles.container}>
      <Item navigateTo='HomeScreen'
        icon={MaterialCommunityIcon}
        iconName='timeline-text-outline'
        active={active === 'HomeScreen'}
        text='MEMORIES' rotateIcon />

      <Item navigateTo='ProfileScreen'
        icon={AntIcon}
        iconName='user'
        active={active === 'ProfileScreen'}
        text='PROFILE'/>
    </View>
  );
};

type ItemProps = {
  navigateTo: keyof RootStackParamList
  icon: ComponentClass<any>,
  iconName: string,
  text: string,
  rotateIcon?: boolean,
  active?: boolean,
}

const Item = (props: ItemProps) => {
  const nav: NavigationProp<RootStackParamList, keyof RootStackParamList> = getNavigation();

  return (
    <TouchableOpacity style={styles.item} onPress={() => resetNavigate(props.navigateTo, nav)}>
      <props.icon size={20} name={props.iconName}
        color={props.active === true ? Colors.DARK_SALMON : Colors.DARK}
        style={props.rotateIcon ? styles.iconRotate : {}}
      />
      <Text style={{ ...styles.iconText, color: props.active ? Colors.DARK_SALMON : Colors.DARK }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: Colors.LIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconRotate: {
    transform: [{ rotate: '-90deg' }]
  },
  iconText: {
    fontWeight: 'bold',
    fontSize: 10
  }
});