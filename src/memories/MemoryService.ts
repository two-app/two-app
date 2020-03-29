import {Memory, MemoryDescription} from './MemoryModels';
import Gateway from '../http/Gateway';
import {AxiosResponse} from 'axios';
import {Image} from 'react-native-image-crop-picker';
import FormData from 'form-data';

export type MemoryUpload = MemoryDescription & {
    content: Image[]
};

export const isMemoryUploadValid = (upload: MemoryUpload) => upload.title.length > 0 && upload.location.length > 0;

/**
 * Retrieves the memories for the user.
 * Display images are updated to localised AWS.
 */
export const getMemories = (): Promise<Memory[]> => Gateway.get('/memory')
    .then((v: AxiosResponse<Memory[]>) => v.data.map(formatMemory));

/**
 * Retrieves a specific memory.
 * Display image is updated to localised AWS.
 * @param mid the memory ID to retrieve.
 */
export const getMemory = (mid: number): Promise<Memory> => Gateway.get('/memory/' + mid.toString())
    .then((response: AxiosResponse<Memory>) => formatMemory(response.data));

const formatMemory = (memory: Memory) => {
    if (memory.displayContent != null) {
        // TODO Make this config-driven for AWS
        memory.displayContent.fileKey = 'http://localhost:4572/memory-content/' + memory.displayContent.fileKey;
    }

    // Memory actually comes back as a string, so it needs to be converted to a number
    memory.date = Number.parseInt(memory.date as any);
    return memory;
};

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