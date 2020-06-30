import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {RootStackParamList} from '../../../Router';
import SubmitButton from '../../forms/SubmitButton';
import {Heading} from '../../home/Heading';
import {ErrorResponse} from '../../http/Response';
import {resetNavigate} from '../../navigation/NavigationUtilities';
import {SelectTag} from '../../tags/SelectTag';
import {Tag} from '../../tags/Tag';
import {ScrollContainer} from '../../views/View';
import {
  isMemoryUploadValid,
  MemoryUpload,
  uploadMemory,
} from '../MemoryService';
import {ContentInput} from './ContentInput';
import {ContentPreview} from './ContentPreview';
import {DateTimePicker} from './DateInput';
import {LocationInput} from './LocationInput';
import TitleInput from './TitleInput';

type NewMemoryScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'NewMemoryScreen'>;
};

type Loading = {
  isLoading: boolean;
  percentage: number | undefined;
};

const NewMemoryScreen = ({navigation}: NewMemoryScreenProps) => {
  const [loading, setLoading] = useState<Loading>({isLoading: false, percentage: 0});
  const [uploadError, setUploadError] = useState<string>();
  const [formState, setFormState] = useState<MemoryUpload>({
    title: '',
    location: '',
    date: Date.now(),
    content: [],
    tag: undefined,
  });

  const setTitle = (title: string) => setFormState({...formState, title});
  const setLocation = (location: string) =>
    setFormState({...formState, location});
  const setDate = (date: number) => setFormState({...formState, date});
  const setTagId = (tid: undefined | number) =>
    setFormState({...formState, tag: tid});
  const setContent = (content: ImageType[]) =>
    setFormState({...formState, content: content});

  const createMemory = () => {
    setLoading({isLoading: true, percentage: 0});
    uploadMemory(formState, (percentage: number) => 
      setLoading({isLoading: true, percentage}))
      .then(() => resetNavigate('HomeScreen', navigation))
      .catch((e: ErrorResponse) => {
        setLoading({isLoading: false, percentage: 0});
        setUploadError(e.reason);
      });
  };

  return (
    <ScrollContainer
      isLoading={loading.isLoading}
      loadingPercentage={loading.percentage}>
      <View>
        <Heading>New Memory</Heading>

        <TitleInput setTitle={setTitle} />
        <LocationInput setLocation={setLocation} />
        <DateTimePicker setDateTime={setDate} />
        <SelectTag
          onTagChange={(tag: undefined | Tag) =>
            setTagId(tag != null ? tag.tid : undefined)
          }
        />
        <ContentInput
          setContent={setContent}
          onOpen={() => setLoading({isLoading: true, percentage: undefined})}
          onClose={() => setLoading({isLoading: false, percentage: 0})}
        />
        {formState.content.length > 0 && (
          <ContentPreview content={formState.content} />
        )}

        <SubmitButton
          onSubmit={createMemory}
          text="Create Memory"
          disabled={!isMemoryUploadValid(formState)}
        />

        {uploadError != null && <Text>{uploadError}</Text>}
      </View>
    </ScrollContainer>
  );
};

export {NewMemoryScreen};
