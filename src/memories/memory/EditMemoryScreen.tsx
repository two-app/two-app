import React, {useState} from 'react';
import {MemoryPatch, Memory} from '../MemoryModels';
import {ScrollContainer} from '../../views/View';
import TitleInput from '../new_memory/TitleInput';
import {RootStackParamList} from '../../../Router';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Heading} from '../../home/Heading';
import SubmitButton from '../../forms/SubmitButton';
import {DateTimePicker} from '../new_memory/DateInput';
import {LocationInput} from '../new_memory/LocationInput';
import {SelectTag} from '../../tags/SelectTag';
import {Tag} from '../../tags/Tag';
import {View} from 'react-native';
import {patchMemory} from '../MemoryService';

type EditMemoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditMemoryScreen'>;
  route: RouteProp<RootStackParamList, 'EditMemoryScreen'>;
};

type FormState = {
  title?: string;
  location?: string;
  date?: number;
  tagId?: number;
};

const isValidUpdate = (memory: Memory, form: FormState): boolean => {
  const titleDiff = memory.title !== form.title;
  const locationDiff = memory.location !== form.location;
  const dateDiff = memory.date !== form.date;
  const tagDiff = memory.tag?.tid !== form.tagId;

  const isDiff = titleDiff || locationDiff || dateDiff || tagDiff;
  const isTitleValid = form.title != null && form.title.length > 0;
  const isLocationValid = form.location != null && form.location.length > 0;

  return isDiff && isTitleValid && isLocationValid;
};

const buildPatch = (memory: Memory, form: FormState): MemoryPatch => {
  const patch: MemoryPatch = {};

  if (form.title !== memory.title) {
    patch.title = form.title;
  }

  if (form.location !== memory.location) {
    patch.location = form.location;
  }

  if (form.date !== memory.date && form.date != null) {
    patch.date = form.date.toString() as any;
  }

  if (form.tagId !== memory.tag?.tid) {
    // handle delete case, where tag is set to -1
    if (form.tagId == null) {
      patch.tagId = -1;
    } else {
      patch.tagId = form.tagId;
    }
  }

  return patch;
};

export const EditMemoryScreen = ({route, navigation}: EditMemoryScreenProps) => {
  const memory = route.params.memory;
  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    title: memory.title,
    location: memory.location,
    date: memory.date,
    tagId: memory.tag?.tid,
  });

  console.log(memory);

  const submitEdit = () => {
    setLoading(true);
    patchMemory(memory.id, buildPatch(memory, formState)).then(() => {
      navigation.goBack();
    }).finally(() => setLoading(false));
  };

  return (
    <ScrollContainer isLoading={loading}>
      <View>
        <Heading>Edit Memory</Heading>

        <TitleInput
          setTitle={(title: string) => setFormState({...formState, title})}
          initialValue={formState.title}
          placeholder="Memory title..."
        />

        <LocationInput
          setLocation={(location: string) =>
            setFormState({...formState, location})
          }
          initialValue={formState.location}
        />

        <DateTimePicker
          setDateTime={(date: number) => setFormState({...formState, date})}
          initialValue={formState.date}
        />

        <SelectTag
          onTagChange={(tag: undefined | Tag) =>
            setFormState({...formState, tagId: tag?.tid})
          }
          initialValue={memory?.tag}
        />

        <SubmitButton
          onSubmit={submitEdit}
          text="Update Memory"
          disabled={!isValidUpdate(memory, formState)}
        />
      </View>
    </ScrollContainer>
  );
};
