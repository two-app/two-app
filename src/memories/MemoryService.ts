import {Memory} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosResponse} from 'axios';

export const getMemories = (): Promise<Memory[]> => Gateway.get('/memory')
    .then((v: AxiosResponse<Memory[]>) => {
        v.data.forEach(m => {
            m.pictureCount = 12;
            m.videoCount = 12;
            m.content = [{url: 'http://placehold.it/280x170', type: 'image'}];
        });

        return v.data;
    });