import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Tag } from "./Tag";

export const TagButton = ({ tag, onClick, focused }: { tag: Tag, onClick?: Function, focused?: boolean }) => {
  let style: any = { ...s.tag, borderColor: tag.color };
  if (focused) {
    style = { ...style, backgroundColor: tag.color };
  }

  return (
    <TouchableOpacity
      style={style}
      onPress={() => onClick != null && onClick(tag)}>
      <Text style={{ color: focused ? 'white' : tag.color }}>{tag.name}</Text>
    </TouchableOpacity>
  );
};

export const DisplayTag = ({ tag, filled }: { tag: Tag, filled?: boolean }) => {
  let viewStyle: any = {...s.displayTag, borderColor: tag.color};
  let textStyle: any = {fontSize: 10, color: tag.color};
  if (filled) {
    viewStyle = {...viewStyle, backgroundColor: tag.color};
    textStyle = {color: 'white'};
  }
  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{tag.name}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  tag: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 5
  },
  displayTag: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    borderWidth: 1,
    borderRadius: 30
  }
});