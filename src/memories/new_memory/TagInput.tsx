import React, { useState } from "react";
import { TextInput, View } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

import { Card } from "../../forms/Card";
import Colors from "../../Colors";

import { FormStyle } from "./FormStyles";

type TagInputProps = {
  setTag: (name: string | undefined) => void;
  initialName?: string;
};

const TagInput = ({ setTag, initialName }: TagInputProps) => {
  const [tagValue, setTagValue] = useState<string | undefined>(initialName);

  return (
    <>
      <Card style={FormStyle.card}>
        <View style={FormStyle.iconContainer}>
          <AntIcon
            name="tago"
            style={{ fontSize: 13, color: Colors.REGULAR, marginTop: 3 }}
          />
        </View>
        <TextInput
          accessibilityLabel="Set Tag Name"
          autoFocus={true}
          placeholder="Tag, e.g Anniversary or Birthday..."
          placeholderTextColor={Colors.REGULAR}
          style={{ color: Colors.DARK, flex: 1, paddingVertical: 0 }}
          onChangeText={setTagValue}
          value={tagValue}
          onBlur={() =>
            tagValue === "" ? setTag(undefined) : setTag(tagValue)
          }
        />
      </Card>
    </>
  );
};

export { TagInput };
