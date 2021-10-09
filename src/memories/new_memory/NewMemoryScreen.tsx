import {useState} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import type {RootStackParamList} from '../../../Router';
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
import uuidv4 from 'uuidv4';

type NavProp = NavigationProp<RootStackParamList, 'NewMemoryScreen'>;

export const NewMemoryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavProp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>();
  const [formState, setFormState] = useState<MemoryMeta>({
    mid: uuidv4(),
    title: '',
    location: '',
    occurredAt: new Date(),
    tid: undefined,
    displayContentId: undefined,
  });

  const createNewMemory = () => {
    setLoading(true);
    createMemory(formState)
      // TODO POST memory already returns the complete memory data
      .then((mid: string) => getMemory(mid))
      .then((newMemory: Memory) => {
        dispatch(insertMemory(newMemory));
        navigation.reset({
          index: 1,
          routes: [
            {name: 'HomeScreen'},
            {
              name: 'MemoryScreen',
              params: {mid: newMemory.mid},
            },
          ],
        });
      })
      .catch((e: ErrorResponse) => {
        setLoading(false);
        setUploadError(e.reason);
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
        />
        <SelectTag
          onTagChange={tag => setFormState({...formState, tid: tag?.tid})}
        />

        <SubmitButton
          onSubmit={createNewMemory}
          text="Create Memory"
          disabled={!isMemoryDescriptionValid(formState)}
        />

        {uploadError != null && <Text>{uploadError}</Text>}
      </View>
    </ScrollContainer>
  );
};
