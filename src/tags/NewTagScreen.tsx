import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {ScrollContainer} from '../views/View';
import {RootStackParamList} from '../../Router';
import SubmitButton from '../forms/SubmitButton';
import {Heading} from '../home/Heading';
import Colors from '../Colors';
import {TagInput} from '../memories/new_memory/TagInput';
import {ErrorResponse} from '../http/Response';

import {createTag} from './TagService';
import {Tag, TagDescription} from './Tag';
import {TagButton} from './TagButton';
import {TagColors} from './TagColors';

type NewTagScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NewTagScreen'>;
  route: RouteProp<RootStackParamList, 'NewTagScreen'>;
};

export const NewTagScreen = ({navigation, route}: NewTagScreenProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [color, setColor] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const {onSubmit} = route.params;

  const createNewTag = () => {
    if (name != null && color != null) {
      const tag: TagDescription = {name, color};
      setLoading(true);
      createTag(tag)
        .then((createdTag: Tag) => {
          onSubmit(createdTag);
          navigation.goBack();
        })
        .catch((e: ErrorResponse) => {
          console.log(e.reason);
          setError(e.reason);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <ScrollContainer isLoading={loading}>
      <Heading>Create a new Tag</Heading>
      <Text style={s.paragraph}>Tags are used to group memories.</Text>

      {/* Name Input */}
      <Text style={s.subtitle}>Tag Name</Text>
      <Text style={s.paragraph}>Pick a short and concise name.</Text>
      <TagInput setTag={setName} />
      {error && (
        <Text
          style={s.error}
          accessibilityHint="The error encountered when creating a tag">
          {error}
        </Text>
      )}

      {/* Colour Input */}
      <Text style={s.subtitle}>Tag Color</Text>
      <Text style={s.paragraph}>
        Pick a nice color for your tag. This color will highlight the memories
        the tag belongs to.
      </Text>
      <ColorList onSelected={setColor} />

      {/* Display a 'Preview' widget if the name & color is present */}
      <View style={{alignItems: 'center', marginTop: 20}}>
        {name != null && color != null && (
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <TagButton tag={{tid: -1, name, color}} />
            <TagButton tag={{tid: -1, name, color}} focused={true} />
          </View>
        )}
      </View>

      <SubmitButton
        onSubmit={createNewTag}
        text="Create Tag"
        disabled={name == null}
        accessibilityHint="Creates a new tag with the given name and color."
        accessibilityLabel="Create Tag"
      />
    </ScrollContainer>
  );
};

const ColorList = ({onSelected}: {onSelected: (color: string) => void}) => {
  const colors = TagColors;
  const randomIndex = Math.floor(Math.random() * colors.length);
  const [selected, setSelected] = useState<string>(colors[randomIndex]);
  useEffect(() => onSelected(selected), [onSelected, selected]);

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

const ColorButton = ({color, isSelected, onClick}: ColorButtonProps) => (
  <TouchableWithoutFeedback
    style={{
      backgroundColor: color,
      width: 40,
      height: 40,
      margin: 10,
      borderRadius: isSelected ? 30 : 3,
      borderColor: 'white',
    }}
    onPress={() => onClick(color)}
    accessibilityHint={`Set the tag color to ${color}`}
    accessibilityLabel={color}
    testID={isSelected ? 'selected-color' : undefined}
  />
);

const s = StyleSheet.create({
  subtitle: {
    fontFamily: 'Montserrat-Medium',
    marginTop: 20,
    color: Colors.DARK,
    fontSize: 17,
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 10,
    color: Colors.DARK,
    fontSize: 15,
  },
  error: {
    fontFamily: 'Montserrat-Medium',
    marginTop: 20,
    color: Colors.DARK_SALMON,
    fontSize: 13,
  },
});
