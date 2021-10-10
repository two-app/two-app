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
import Colors from '../../Colors';

type NavProp = NavigationProp<RootStackParamList, 'NewMemoryScreen'>;

export const NewMemoryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavProp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setUploadError] = useState<string>();
  const [formState, setFormState] = useState<MemoryMeta>({
    mid: uuidv4(),
    title: '',
    location: '',
    occurredAt: new Date(),
    tid: undefined,
    displayContentId: undefined,
  });

  const storeAndNavigate = (m: Memory): void => {
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
    setLoading(false);
  };

  const onError = (e: ErrorResponse): void => {
    setLoading(false);
    setUploadError(e.reason);
  };

  const createNewMemory = () => {
    setLoading(true);
    Promise.all([createMemory(formState), createMemory(formState)])
      .then(([m]) => storeAndNavigate(m))
      .catch((e: ErrorResponse) => {
        if (e.status === 409) {
          console.log('Got code 409');
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
