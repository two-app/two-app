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
import {isMemoryUploadValid, MemoryUpload} from '../MemoryService';

const NewMemoryScreen = () => {
    const [formState, setFormState] = useState<MemoryUpload>({
        title: '',
        location: '',
        date: new Date(),
        content: []
    });

    const setTitle = (title: string) => setFormState({...formState, title});
    const setLocation = (location: string) => setFormState({...formState, location});
    const setDate = (date: Date) => setFormState({...formState, date});
    const setTag = (tag: string) => setFormState({...formState, tag});
    const setContent = (content: ImageType[]) => setFormState({...formState, content});

    return (
        <WrapperContainer>
            <Heading>New Memory</Heading>
            <TitleInput setTitle={setTitle}/>
            <LocationInput setLocation={setLocation}/>
            <DateInput setDate={setDate}/>
            <TagInput setTag={setTag}/>
            <ContentInput setContent={setContent}/>
            {formState.content.length > 0 && <ContentPreview content={formState.content}/>}

            <SubmitButton onSubmit={() => null} text="Create Memory" disabled={!isMemoryUploadValid(formState)}/>
        </WrapperContainer>
    );
};

NewMemoryScreen.navigationOptions = {
    title: 'New Memory',
    header: null
};

export {NewMemoryScreen};