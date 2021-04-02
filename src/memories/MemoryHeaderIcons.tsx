import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import Colors from '../Colors';

type IconProps = {
  focused: boolean;
  onPress: () => void;
};

export const TimelineIcon = ({focused, onPress}: IconProps) => {
  return (
    <TouchableOpacity
      style={s.container}
      onPress={onPress}
      accessibilityLabel={'Open timeline Timeline'}>
      <MaterialCommunityIcon
        name="timeline-text-outline"
        style={[getIconStyle(focused), {transform: [{rotate: '-90deg'}]}]}
      />
      <Text style={getTextStyle(focused)}>TIMELINE</Text>
    </TouchableOpacity>
  );
};

export const GroupedIcon = ({focused, onPress}: IconProps) => {
  return (
    <TouchableOpacity
      style={s.container}
      onPress={onPress}
      accessibilityLabel={'Open grouped Timeline'}>
      <AntIcon name="tagso" style={[getIconStyle(focused), {marginTop: 2}]} />
      <Text style={getTextStyle(focused)}>GROUPED</Text>
    </TouchableOpacity>
  );
};

export const GridIcon = ({focused, onPress}: IconProps) => {
  return (
    <TouchableOpacity
      style={s.container}
      onPress={onPress}
      accessibilityLabel={'Open grid Timeline'}>
      <MaterialIcon
        name="grid-on"
        style={[getIconStyle(), {fontSize: 18, color: Colors.FADED}]}
      />
      <Text style={[getTextStyle(focused), {color: Colors.FADED}]}>GRID</Text>
    </TouchableOpacity>
  );
};

const getIconStyle = (focused?: boolean) => ({
  ...s.icon,
  ...getFocusedStyle(focused),
});

const getTextStyle = (focused?: boolean) => ({
  ...s.text,
  ...getFocusedStyle(focused),
});

const getFocusedStyle = (focused?: boolean) =>
  focused === true ? s.focused : {};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: Colors.REGULAR,
    fontSize: 20,
  },
  text: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: Colors.REGULAR,
    marginLeft: 5,
    marginRight: 10,
  },
  focused: {
    color: Colors.DARK,
  },
});
