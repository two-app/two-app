import React from "react";
import moment from "moment";
import { Text, View, StyleSheet } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

import { Tag } from "../Tag";
import Colors from "../../Colors";

const formatDate = (dateString: string): string => {
  return moment(dateString).format("MMMM Do YYYY");
};

export const TagDate = ({ tag }: { tag: Tag }) => {
  if (tag.startDate == null) {
    return <Text style={[s.wrapper, s.text]}>This tag has no memories.</Text>;
  }

  let text = formatDate(tag.startDate);
  if (tag.endDate != null) {
    const fmtd = formatDate(tag.endDate);
    if (text !== fmtd) {
      text += ` - ${formatDate(tag.endDate)}`;
    }
  }

  return (
    <View style={s.wrapper}>
      <DateIcon />
      <Text style={s.text}>{text}</Text>
    </View>
  );
};

const DateIcon = () => (
  <AntIcon
    name="calendar"
    size={18}
    style={{ marginRight: 10 }}
    color={Colors.REGULAR}
  />
);

const s = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: Colors.REGULAR,
  },
});
