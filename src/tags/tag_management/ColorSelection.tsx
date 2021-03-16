import React, {useEffect, useState} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';

import {TagColors} from './TagColors';

type ColorListProps = {
  initialColor?: string;
  onSelected: (color: string) => void;
};

const selectRandomColor = (colors: string[]) => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const ColorList = ({initialColor, onSelected}: ColorListProps) => {
  const colors = TagColors;
  const [selected, setSelected] = useState<string>(
    initialColor || selectRandomColor(colors),
  );

  useEffect(() => {
    if (!initialColor) {
      // notify the parent if a random color was picked
      onSelected(selected);
    }
  }, []);

  const selectColor = (color: string) => {
    setSelected(color);
    onSelected(color);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        margin: -10,
      }}>
      {colors.map((color) => (
        <ColorButton
          color={color}
          isSelected={color === selected}
          onClick={selectColor}
          key={color}
        />
      ))}
    </View>
  );
};

type ColorButtonProps = {
  color: string;
  isSelected: boolean;
  onClick: (color: string) => void;
};

const ColorButton = ({color, isSelected, onClick}: ColorButtonProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => onClick(color)}
      accessibilityHint={`Set the tag color to ${color}`}
      accessibilityLabel={color}
      testID={isSelected ? 'selected-color' : undefined}>
      <View
        style={{
          width: 40,
          height: 40,
          margin: 10,
          borderRadius: isSelected ? 30 : 3,
          borderColor: 'white',
          backgroundColor: color,
        }}
      />
    </TouchableWithoutFeedback>
  );
};
