import {useState} from 'react';
import {Text, StyleSheet, View, RefreshControlProps} from 'react-native';
import {SubmitButton} from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import type {ErrorResponse} from '../../http/Response';
import {TagInput} from '../../memories/new_memory/TagInput';
import {ScrollContainer} from '../../views/View';
import type {TagDescription, Tag} from '../Tag';
import {TagButton} from '../TagButton';
import {createTag, updateTag} from '../TagService';
import Colors from '../../Colors';

import {ColorList} from './ColorSelection';
import {v4 as uuid} from 'uuid';
import {Screen} from '../../navigation/NavigationUtilities';
import {useNavigation} from '@react-navigation/native';

type Mode = {
  type: 'create' | 'edit';
  heading: string;
  submitText: string;
  submitHint: string;
};

const getMode = (initialTag?: Tag): Mode => {
  if (initialTag == null) {
    return {
      type: 'create',
      heading: 'Create new Tag',
      submitText: 'Create Tag',
      submitHint: 'Creates a new tag with the given name and color.',
    };
  } else {
    return {
      type: 'edit',
      heading: `Edit '${initialTag.name}' Tag`,
      submitText: 'Update Tag',
      submitHint: 'Updates the tag with the given name and color.',
    };
  }
};

export const TagManagementScreen = ({
  navigation,
  route,
}: Screen<'TagManagementScreen'>) => {
  const {onSubmit, initialTag} = route.params;
  const mode: Mode = getMode(initialTag);
  const tid: string = initialTag?.tid ?? uuid();

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(initialTag?.name);
  const [color, setColor] = useState<string | undefined>(initialTag?.color);
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmitPress = () => {
    if (name == null || color == null) {
      return;
    }

    const tag: TagDescription = {tid, name, color};
    setLoading(true);

    const handleResponse = (promise: Promise<Tag>) => {
      promise
        .then((createdTag: Tag) => {
          onSubmit(createdTag);
          navigation.goBack();
        })
        .catch(({reason}: ErrorResponse) => {
          setError(reason);
          setLoading(false);
        });
    };

    const perform = initialTag == null ? createTag : updateTag;
    handleResponse(perform(tag));
  };

  return (
    <ScrollContainer isLoading={loading}>
      <Heading>{mode.heading}</Heading>
      <Text style={s.paragraph}>Tags are used to group memories.</Text>

      {/* Name Input */}
      <Text style={s.subtitle}>Tag Name</Text>
      <Text style={s.paragraph}>Pick a short and concise name.</Text>
      <TagInput setTag={setName} initialName={name} />
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
      <ColorList onSelected={setColor} initialColor={initialTag?.color} />

      {/* Display a 'Preview' widget if the name & color is present */}
      <View style={{alignItems: 'center', marginTop: 20}}>
        {name != null && color != null && (
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <TagButton tag={{tid: '', name, color, memoryCount: 0}} />
            <TagButton
              tag={{tid: '', name, color, memoryCount: 0}}
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
