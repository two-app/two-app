import {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';

import {Memory, MemoryMeta} from '../MemoryModels';
import {ScrollContainer} from '../../views/View';
import TitleInput from '../new_memory/TitleInput';
import {RootStackParamList} from '../../../Router';
import {Heading} from '../../home/Heading';
import {SubmitButton} from '../../forms/SubmitButton';
import {DateTimePicker} from '../new_memory/DateInput';
import {LocationInput} from '../new_memory/LocationInput';
import {SelectTag} from '../../tags/SelectTag';
import {Tag} from '../../tags/Tag';
import {updateMemory as updateMemoryRequest} from '../MemoryService';
import {ErrorResponse} from '../../http/Response';
import {TwoState} from '../../state/reducers';
import {selectMemory, updateMemory} from '../store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditMemoryScreen'>;
  route: RouteProp<RootStackParamList, 'EditMemoryScreen'>;
};

const isValidUpdate = (memory: Memory, form: MemoryMeta): boolean => {
  const titleDiff = memory.title !== form.title;
  const locationDiff = memory.location !== form.location;
  const dateDiff = memory.occurredAt !== form.occurredAt;
  const tagDiff = memory.tag?.tid !== form.tid;

  const isDiff = titleDiff || locationDiff || dateDiff || tagDiff;
  const isTitleValid = form.title != null && form.title.length > 0;
  const isLocationValid = form.location != null && form.location.length > 0;

  return isDiff && isTitleValid && isLocationValid;
};

export const EditMemoryScreen = ({navigation, route}: Props) => {
  const dispatch = useDispatch();
  const memory: Memory = useSelector<TwoState, Memory>(state =>
    selectMemory(state.memories, route.params.mid),
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formState, setFormState] = useState<MemoryMeta>({
    mid: memory.mid,
    title: memory.title,
    location: memory.location,
    occurredAt: memory.occurredAt,
    tid: memory.tag?.tid,
  });

  const submitEdit = () => {
    setLoading(true);
    updateMemoryRequest(formState)
      .then((updatedMemory: Memory) => {
        dispatch(updateMemory({mid: memory.mid, memory: updatedMemory}));
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
          setDateTime={(occurredAt: Date) =>
            setFormState({...formState, occurredAt})
          }
          initialValue={formState.occurredAt}
        />

        <SelectTag
          onTagChange={(tag: undefined | Tag) =>
            setFormState({...formState, tid: tag?.tid})
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
          accessibilityHint="The error encountered with the edit.">
          {error}
        </Text>
      </View>
    </ScrollContainer>
  );
};
