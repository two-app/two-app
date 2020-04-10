import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { WrapperContainer } from '../views/View';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../Router';
import { RouteProp } from '@react-navigation/native';
import SubmitButton from '../forms/SubmitButton';
import { Heading } from '../home/Heading';
import Colors from '../Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createTag } from './TagService';
import { TagInput } from '../memories/new_memory/TagInput';
import { Tag } from './Tag';
import { TagButton } from './TagButton';

type NewTagScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NewTagScreen'>,
  route: RouteProp<RootStackParamList, 'NewTagScreen'>;
}

export const NewTagScreen = ({ navigation, route }: NewTagScreenProps) => {
  const [name, setName] = useState<string | null>(null);
  const [color, setColor] = useState<string>();

  const onSubmit = route.params.onSubmit;

  const createNewTag = () => {
    if (name != null && color != null) {
      createTag(name, color).then((tag: Tag) => {
        onSubmit(tag);
        navigation.goBack();
      });
    }
  }

  return (
    <WrapperContainer>
      <Heading>Create a new Tag</Heading>
      <Text style={s.paragraph}>
        Tags are used to group memories.
      </Text>
      <Text style={s.subtitle}>
        Tag Name
      </Text>
      <Text style={s.paragraph}>
        Pick a short and concise name, like 'First Anniversary'.
      </Text>
      <TagInput setTag={setName} />
      <Text style={s.subtitle}>
        Tag Colour
      </Text>
      <Text style={s.paragraph}>
        Pick a nice colour for your tag. This colour will highlight the memories the tag belongs to.
      </Text>
      <ColorList onSelected={setColor} />
      {name != null && color != null &&
        <View style={{ flexDirection: 'row', alignItems: "baseline"}}>
          <Text style={{...s.subtitle, marginRight: 10}}>Preview</Text>
          <TagButton tag={{ tid: -1, name, color }} />
        </View>
      }
      <SubmitButton onSubmit={createNewTag} text="Create Tag" disabled={name == null} />
    </WrapperContainer >
  )
};

const colours = [
  '#3AB795',
  '#29335C',
  '#FFCF56',
  '#F4989C',
  '#F3D3BD',
  '#C4D7F2',
  '#0496FF',
  '#8F2D56',
  '#E07A5F',
  '#376996',
  '#000000',
  '#F2CC8F',
  '#E56399'
]

const ColorList = ({ onSelected }: { onSelected: (color: string) => void }) => {
  const randomIndex = Math.floor(Math.random() * colours.length)
  const [selected, setSelected] = useState<string>(colours[randomIndex]);
  useEffect(() => onSelected(selected), []);

  const selectColor = (color: string) => {
    setSelected(color);
    onSelected(color);
  }

  return (
    <View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 5,
      margin: -10
    }}>
      {colours.map(color =>
        <ColorButton color={color}
          isSelected={color == selected}
          onClick={selectColor}
          key={color}
        />
      )}
    </View>
  )
}

type ColorButtonProps = {
  color: string,
  isSelected: boolean,
  onClick: (color: string) => void
}

const ColorButton = ({ color, isSelected, onClick }: ColorButtonProps) => (
  <TouchableOpacity style={{
    backgroundColor: color,
    width: 40,
    height: 40,
    margin: 10,
    borderWidth: (isSelected ? 5 : 3),
    borderRadius: (isSelected ? 30 : 3),
    elevation: 5,
    borderColor: Colors.LIGHT
  }} onPress={() => onClick(color)} activeOpacity={1} />
);

const s = StyleSheet.create({
  subtitle: {
    fontFamily: 'Montserrat-Medium',
    marginTop: 20,
    color: Colors.DARK,
    fontSize: 17
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 10,
    color: Colors.DARK,
    fontSize: 15
  }
});