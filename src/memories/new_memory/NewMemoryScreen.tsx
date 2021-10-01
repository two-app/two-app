import {useState} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import type {RootStackParamList} from '../../../Router';
import SubmitButton from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import type {ErrorResponse} from '../../http/Response';
import {SelectTag} from '../../tags/SelectTag';
import {ScrollContainer} from '../../views/View';
import {
  isMemoryDescriptionValid,
  createMemory,
  getMemory,
} from '../MemoryService';
import type {MemoryDescription, Memory} from '../MemoryModels';
import {insertMemory} from '../store';

import {DateTimePicker} from './DateInput';
import {LocationInput} from './LocationInput';
import TitleInput from './TitleInput';

type NavProp = NavigationProp<RootStackParamList, 'NewMemoryScreen'>;

export const NewMemoryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavProp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>();
  const [formState, setFormState] = useState<MemoryDescription>({
    title: '',
    location: '',
    date: Date.now(),
    tag: undefined,
  });

  const createNewMemory = () => {
    setLoading(true);
    createMemory(formState)
      .then((mid: number) => getMemory(mid))
      .then((newMemory: Memory) => {
        dispatch(insertMemory(newMemory));
        navigation.reset({
          index: 1,
          routes: [
            {name: 'HomeScreen'},
            {
              name: 'MemoryScreen',
              params: {mid: newMemory.id},
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
          setDateTime={date => setFormState({...formState, date})}
        />
        <SelectTag
          onTagChange={tag => setFormState({...formState, tag: tag?.tid})}
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
