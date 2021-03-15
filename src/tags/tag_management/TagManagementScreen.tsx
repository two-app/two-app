import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {RootStackParamList} from '../../../Router';
import SubmitButton from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import {ErrorResponse} from '../../http/Response';
import {TagInput} from '../../memories/new_memory/TagInput';
import {ScrollContainer} from '../../views/View';
import {TagDescription, Tag} from '../Tag';
import {TagButton} from '../TagButton';
import {createTag} from '../TagService';

import {ColorList} from './ColorSelection';

type TagManagementScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TagManagementScreen'>;
  route: RouteProp<RootStackParamList, 'TagManagementScreen'>;
};

type Mode = {
  heading: string;
  submitText: string;
  submitHint: string;
  submitFn: (tag: TagDescription) => Promise<Tag>;
};

const getMode = (initialTag?: Tag): Mode => {
  if (initialTag == null) {
    return {
      heading: 'Create new Tag',
      submitText: 'Create Tag',
      submitHint: 'Creates a new tag with the given name and color.',
      submitFn: createTag,
    };
  } else {
    return {
      heading: 'Edit Tag',
      submitText: 'Update Tag',
      submitHint: 'Updates the tag with the given name and color.',
      submitFn: createTag,
    };
  }
};

export const TagManagementScreen = ({
  navigation,
  route,
}: TagManagementScreenProps) => {
  const {onSubmit, initialTag} = route.params;
  const mode: Mode = getMode(initialTag);

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(initialTag?.name);
  const [color, setColor] = useState<string | undefined>(initialTag?.color);
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmitPress = () => {
    if (name != null && color != null) {
      const tag: TagDescription = {name, color};
      const {submitFn} = mode;

      setLoading(true);

      submitFn(tag)
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
      <Heading>{mode.heading}</Heading>
      <Text style={s.paragraph}>Tags are used to group memories.</Text>

      {/* Name Input */}
      <Text style={s.subtitle}>Tag Name</Text>
      <Text style={s.paragraph}>Pick a short and concise name.</Text>
      <TagInput setTag={setName} />
      {error && (
        <Text
          style={s.error}
          accessibilityHint="The error encountered from processing a tag">
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
            <TagButton tag={{tid: -1, name, color, memoryCount: 0}} />
            <TagButton
              tag={{tid: -1, name, color, memoryCount: 0}}
              focused={true}
            />
          </View>
        )}
      </View>

      <SubmitButton
        onSubmit={onSubmitPress}
        text={mode.submitText}
        disabled={name == null}
        accessibilityHint={mode.submitHint}
        accessibilityLabel={mode.submitText}
      />
    </ScrollContainer>
  );
};

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
