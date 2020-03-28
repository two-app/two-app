import {Memory, MemoryDescription} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosResponse} from 'axios';
import {Image} from 'react-native-image-crop-picker';
import FormData from 'form-data';

export type MemoryUpload = MemoryDescription & {
    content: Image[]
};

export const isMemoryUploadValid = (upload: MemoryUpload) => upload.title.length > 0 && upload.location.length > 0;

export const getMemories = (): Promise<Memory[]> => Gateway.get('/memory')
    .then((v: AxiosResponse<Memory[]>) => {
        v.data.forEach(m => {
            if (m.displayContent != null) {
                m.displayContent.fileKey = 'http://localhost:4572/memory-content/' + m.displayContent.fileKey;
            }

            m.date = Number.parseInt(m.date as any);
        });

        return v.data;
    });


type PostMemoryResponse = {
    memoryId: number
};

export const createMemory = (description: MemoryDescription): Promise<number> => {
    description.date = description.date.toString() as any;
    return Gateway.post('/memory', description).then(
        (v: AxiosResponse<PostMemoryResponse>) => v.data.memoryId
    );
};

export const uploadToMemory = (mid: number, upload: MemoryUpload): Promise<number[]> => {
    const uploadPromises: Promise<AxiosResponse<number[]>>[] = upload.content.map((content: Image) => {
        const form = new FormData();
        form.append('content', {
            name: content.filename,
            type: content.mime,
            uri: content.path
        });

        return Gateway.post<number[]>('/memory/' + mid.toString(), form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    });

    return Promise.all(uploadPromises).then(responses => {
        return responses.map(axiosResponse => axiosResponse.data[0]);
    });
};