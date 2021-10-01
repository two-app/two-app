import { useState } from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {connect, ConnectedProps} from 'react-redux';

import {MemoryPatch, Memory} from '../MemoryModels';
import {ScrollContainer} from '../../views/View';
import TitleInput from '../new_memory/TitleInput';
import {RootStackParamList} from '../../../Router';
import {Heading} from '../../home/Heading';
import SubmitButton from '../../forms/SubmitButton';
import {DateTimePicker} from '../new_memory/DateInput';
import {LocationInput} from '../new_memory/LocationInput';
import {SelectTag} from '../../tags/SelectTag';
import {Tag} from '../../tags/Tag';
import {patchMemory} from '../MemoryService';
import {ErrorResponse} from '../../http/Response';
import {TwoState} from '../../state/reducers';
import {selectMemory, updateMemory} from '../store';

type NavigationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditMemoryScreen'>;
  route: RouteProp<RootStackParamList, 'EditMemoryScreen'>;
};

const mapStateToProps = (state: TwoState, ownProps: NavigationProps) => ({
  memory: selectMemory(state.memories, ownProps.route.params.mid),
});

const connector = connect(mapStateToProps);
type EditMemoryScreenProps = ConnectedProps<typeof connector> & NavigationProps;

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

export const EditMemoryScreen = ({
  navigation,
  memory,
  dispatch,
}: EditMemoryScreenProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formState, setFormState] = useState<FormState>({
    title: memory.title,
    location: memory.location,
    date: memory.date,
    tagId: memory.tag?.tid,
  });

  const submitEdit = () => {
    setLoading(true);
    patchMemory(memory.id, buildPatch(memory, formState))
      .then((patchedMemory: Memory) => {
        dispatch(
          updateMemory({
            mid: memory.id,
            memory: patchedMemory,
          }),
        );
        navigation.goBack();
      })
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(false));
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
          accessibilityHint="Updates the memory with the newly entered values."
          accessibilityLabel="Update Memory"
        />

        <Text
          style={{color: Colors.DARK_SALMON}}
          accessibilityHint="The error encountered with the edit."
        >
          {error}
        </Text>
      </View>
    </ScrollContainer>
  );
};

export default connector(EditMemoryScreen);
