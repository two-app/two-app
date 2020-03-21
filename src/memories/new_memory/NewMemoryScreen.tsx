import React, {useState} from 'react';
import {WrapperContainer} from '../../views/View';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {Heading} from '../../home/Heading';
import SubmitButton from '../../forms/SubmitButton';
import TitleInput from './TitleInput';
import {LocationInput} from './LocationInput';
import {DateInput} from './DateInput';
import {TagInput} from './TagInput';
import {ContentInput} from './ContentInput';
import {ContentPreview} from './ContentPreview';
import {createMemory, isMemoryUploadValid, MemoryUpload, uploadToMemory} from '../MemoryService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../Router';
import {CommonActions} from '@react-navigation/native';

type NewMemoryScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'NewMemoryScreen'>
}

const NewMemoryScreen = ({navigation}: NewMemoryScreenProps) => {
    const [formState, setFormState] = useState<MemoryUpload>({
        title: '',
        location: '',
        date: Date.now(),
        content: []
    });

    const setTitle = (title: string) => setFormState({...formState, title});
    const setLocation = (location: string) => setFormState({...formState, location});
    const setDate = (date: number) => setFormState({...formState, date});
    const setTag = (tag: string) => setFormState({...formState, tag});
    const setContent = (content: ImageType[]) => setFormState({...formState, content: content});

    const uploadMemory = () => createMemory(formState).then(mid => {
        uploadToMemory(mid, formState).then(() => navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}]
            })
        ));
    });

    console.log(formState);
    console.log(isMemoryUploadValid(formState));

    return (
        <WrapperContainer>
            <Heading>New Memory</Heading>

            <TitleInput setTitle={setTitle}/>
            <LocationInput setLocation={setLocation}/>
            <DateInput setDate={setDate}/>
            <TagInput setTag={setTag}/>
            <ContentInput setContent={setContent}/>
            {formState.content.length > 0 && <ContentPreview content={formState.content}/>}

            <SubmitButton onSubmit={uploadMemory} text="Create Memory" disabled={!isMemoryUploadValid(formState)}/>
        </WrapperContainer>
    );
};

NewMemoryScreen.navigationOptions = {
    title: 'New Memory',
    header: null
};

export {NewMemoryScreen};