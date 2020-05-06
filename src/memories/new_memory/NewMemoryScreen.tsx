import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollContainer } from '../../views/View';
import { Image as ImageType } from 'react-native-image-crop-picker';
import { Heading } from '../../home/Heading';
import SubmitButton from '../../forms/SubmitButton';
import TitleInput from './TitleInput';
import { LocationInput } from './LocationInput';
import { DateInput } from './DateInput';
import { ContentInput } from './ContentInput';
import { ContentPreview } from './ContentPreview';
import { isMemoryUploadValid, MemoryUpload, uploadMemory } from '../MemoryService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../Router';
import { SelectTag } from '../../tags/SelectTag';
import { Tag } from '../../tags/Tag';
import { resetNavigate } from '../../navigation/NavigationUtilities';
import { ErrorResponse } from '../../http/Response';

type NewMemoryScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'NewMemoryScreen'>
}

const NewMemoryScreen = ({ navigation }: NewMemoryScreenProps) => {
    const [loading, setLoading] = useState({ isLoading: false, percentage: 0 });
    const [uploadError, setUploadError] = useState<string>();
    const [formState, setFormState] = useState<MemoryUpload>({
        title: '',
        location: '',
        date: Date.now(),
        content: [],
        tag: undefined
    });

    const setTitle = (title: string) => setFormState({ ...formState, title });
    const setLocation = (location: string) => setFormState({ ...formState, location });
    const setDate = (date: number) => setFormState({ ...formState, date });
    const setTagId = (tid: undefined | number) => setFormState({ ...formState, tag: tid });
    const setContent = (content: ImageType[]) => setFormState({ ...formState, content: content });

    const createMemory = () => {
        setLoading({ isLoading: true, percentage: 0 });
        uploadMemory(formState, percentage => setLoading({ isLoading: true, percentage })).then(() => {
            resetNavigate('HomeScreen', navigation);
        }).catch((e: ErrorResponse) => {
            setUploadError(e.reason);
        }).finally(() => {
            setLoading({ isLoading: false, percentage: 0 })
        });
    };

    return (
        <ScrollContainer isLoading={loading.isLoading} loadingPercentage={loading.percentage}>
            <View>
                <Heading>New Memory</Heading>

                <TitleInput setTitle={setTitle} />
                <LocationInput setLocation={setLocation} />
                <DateInput setDate={setDate} />
                <SelectTag onTagChange={
                    (tag: undefined | Tag) => setTagId(tag != null ? tag.tid : undefined)
                } />
                <ContentInput setContent={setContent} />
                {formState.content.length > 0 && <ContentPreview content={formState.content} />}

                <SubmitButton onSubmit={createMemory} text="Create Memory" disabled={!isMemoryUploadValid(formState)} />

                {uploadError != null &&
                    <Text>{uploadError}</Text>
                }
            </View>
        </ScrollContainer>
    );
};

export { NewMemoryScreen };