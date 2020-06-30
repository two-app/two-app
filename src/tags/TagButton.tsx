import React from "react";
import { Text, StyleSheet, View, StyleProp, TextStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Tag } from "./Tag";

export const TagButton = ({ tag, onClick, focused }: { tag: Tag, onClick?: Function, focused?: boolean }) => {
  let style: any = { ...s.tag, borderColor: tag.color };
  if (focused) {
    style = { ...style, backgroundColor: tag.color };
  }

  return (
    <TouchableOpacity
      accessibilityHint={`Selects the tag ${tag.name}.`}
      accessibilityLabel={`Select the tag ${tag.name}`}
      style={style}
      onPress={() => onClick != null && onClick(tag)}>
      <Text style={{ color: focused ? 'white' : tag.color }}>{tag.name}</Text>
    </TouchableOpacity>
  );
};

export const DisplayTag = ({ tag, filled }: { tag: Tag, filled?: boolean }) => {
  let viewStyle: any = {...s.displayTag, borderColor: tag.color};
  let textStyle: StyleProp<TextStyle> = {fontSize: 10, fontWeight: "normal",color: tag.color};
  if (filled) {
    viewStyle = {...viewStyle, backgroundColor: tag.color};
    textStyle = {...textStyle, color: 'white'};
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
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 30,
  }
});