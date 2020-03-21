import {Memory, MemoryDescription} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosError, AxiosResponse} from 'axios';
import {Image} from 'react-native-image-crop-picker';
import FormData from 'form-data';

export type MemoryUpload = MemoryDescription & {
    content: Image[]
};

export const isMemoryUploadValid = (upload: MemoryUpload) => upload.title.length > 0 && upload.location.length > 0;

export const getMemories = (): Promise<Memory[]> => Gateway.get('/memory')
    .then((v: AxiosResponse<Memory[]>) => {
        console.log(v.data);
        v.data.forEach(m => {
            m.pictureCount = 12;
            m.videoCount = 12;
            if (m.displayContent == null) {
                m.displayContent = {
                    contentId: -1,
                    contentType: 'image',
                    fileKey: 'http://placehold.it/280x170'
                }
            } else {
                m.displayContent.fileKey = "http://localhost:4572/memory-content/" + m.displayContent.fileKey;
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
    // @ts-ignore
    return Gateway.post('/memory', description)
        .then((v: AxiosResponse<PostMemoryResponse>) => v.data.memoryId).catch((e: AxiosError) => {
            console.log('failed to create memory');
            console.log(e.response?.data);
        });
};

export const uploadToMemory = (mid: number, upload: MemoryUpload): Promise<number[]> => {
    const form = new FormData();
    upload.content.forEach(content => {
        form.append('content', {
            name: content.filename,
            type: content.mime,
            uri: content.path
        });
    });

    return Gateway.post('/memory/' + mid.toString(), form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(r => r.data).catch((e: AxiosError) => {
        console.log("failed to upload to memory with status: " + e.response?.status);
        console.log("Body:");
        console.log(e.response?.data);
    });
};