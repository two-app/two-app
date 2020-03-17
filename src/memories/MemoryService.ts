import {Memory} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosResponse} from 'axios';
import moment from 'moment';
import {Image} from 'react-native-image-crop-picker';

export type MemoryUpload = {
    title: string,
    location: string,
    date: Date,
    tag?: string,
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