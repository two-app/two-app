import {useState} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {SubmitButton} from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import type {ErrorResponse} from '../../http/Response';
import {SelectTag} from '../../tags/SelectTag';
import {ScrollContainer} from '../../views/View';
import {
  isMemoryDescriptionValid,
  createMemory,
  getMemory,
} from '../MemoryService';
import type {Memory, MemoryMeta} from '../MemoryModels';
import {insertMemory} from '../store';

import {DateTimePicker} from './DateInput';
import {LocationInput} from './LocationInput';
import TitleInput from './TitleInput';
import {v4 as uuid} from 'uuid';
import Colors from '../../Colors';
import {Screen} from '../../navigation/NavigationUtilities';

export const NewMemoryScreen = ({navigation}: Screen<'NewMemoryScreen'>) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setUploadError] = useState<string>();
  const [formState, setFormState] = useState<MemoryMeta>({
    mid: uuid(),
    title: '',
    location: '',
    occurredAt: new Date(),
    tid: undefined,
    displayContentId: undefined,
  });

  const storeAndNavigate = (m: Memory): void => {
    setLoading(false);
    dispatch(insertMemory(m));
    navigation.reset({
      index: 1,
      routes: [
        {name: 'HomeScreen'},
        {
          name: 'MemoryScreen',
          params: {mid: m.mid},
        },
      ],
    });
  };

  const onError = (e: ErrorResponse): void => {
    setLoading(false);
    setUploadError(e.reason);
  };

  const createNewMemory = () => {
    setLoading(true);
    createMemory(formState)
      .then(storeAndNavigate)
      .catch((e: ErrorResponse) => {
        if (e.status === 409) {
          // Memory already  exists, perform reset
          getMemory(formState.mid).then(storeAndNavigate).catch(onError);
        } else {
          onError(e);
        }
      });
  };

  return (
    <ScrollContainer isLoading={loading}>
      <View>
        <Heading>New Memory</Heading>

        <TitleInput setTitle={title => setFormState({...formState, title})} />
        <LocationInput
          setLocation={location => setFormState({...formState, location})}
        />
        <DateTimePicker
          setDateTime={occurredAt => setFormState({...formState, occurredAt})}
          initialValue={formState.occurredAt}
        />
        <SelectTag
          onTagChange={tag => setFormState({...formState, tid: tag?.tid})}
        />

        <SubmitButton
          onSubmit={createNewMemory}
          text="Create Memory"
          disabled={!isMemoryDescriptionValid(formState)}
          accessibilityHint="Create a new memory"
          accessibilityLabel="Create a new memory"
        />

        {error != null && (
          <Text
            style={{color: Colors.DARK_SALMON}}
            accessibilityHint={error}
            accessibilityLabel="Something went wrong creating your memory.">
            {error}
          </Text>
        )}
      </View>
    </ScrollContainer>
  );
};
