import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {RootStackParamList} from '../../../Router';
import SubmitButton from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import {ErrorResponse} from '../../http/Response';
import {SelectTag} from '../../tags/SelectTag';
import {ScrollContainer} from '../../views/View';
import {
  isMemoryDescriptionValid,
  createMemory,
  loadMemoryAndNavigate,
} from '../MemoryService';
import {DateTimePicker} from './DateInput';
import {LocationInput} from './LocationInput';
import TitleInput from './TitleInput';
import {MemoryDescription} from '../MemoryModels';

type NewMemoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NewMemoryScreen'>;
};

const NewMemoryScreen = ({navigation}: NewMemoryScreenProps) => {
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
      .then((mid: number) => loadMemoryAndNavigate(mid, navigation))
      .catch((e: ErrorResponse) => {
        setLoading(false);
        setUploadError(e.reason);
      });
  };

  return (
    <ScrollContainer isLoading={loading}>
      <View>
        <Heading>New Memory</Heading>

        <TitleInput setTitle={(title) => setFormState({...formState, title})} />
        <LocationInput setLocation={(location) => setFormState({...formState, location})} />
        <DateTimePicker setDateTime={(date) => setFormState({...formState, date})} />
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

export {NewMemoryScreen};
