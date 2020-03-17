import {Memory, MemoryDescription} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosResponse} from 'axios';
import moment from 'moment';
import {Image} from 'react-native-image-crop-picker';

export type MemoryUpload = MemoryDescription & {
    content: Image[]
};

export const isMemoryUploadValid = (upload: MemoryUpload) => upload.title.length > 0 && upload.location.length > 0;

export const getMemories = (): Promise<Memory[]> => Gateway.get('/memory')
    .then((v: AxiosResponse<Memory[]>) => {
        v.data.forEach(m => {
            m.pictureCount = 12;
            m.videoCount = 12;
            m.content = [{url: 'http://placehold.it/280x170', type: 'image'}];

            const stringDate: string = m.date as any;
            m.date = moment(stringDate, 'YYYY-MM-DDTHH:mm:ss').toDate();
        });

        return v.data;
    });

type PostMemoryResponse = {
    memoryId: number
};

export const createMemory = (description: MemoryDescription): Promise<number> => Gateway.post('/memory', description)
    .then((v: AxiosResponse<PostMemoryResponse>) => v.data.memoryId);