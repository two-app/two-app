import { Memory, MemoryDescription, Content } from './MemoryModels';
import Gateway from '../http/Gateway';
import { AxiosResponse } from 'axios';
import { Image } from 'react-native-image-crop-picker';
import FormData from 'form-data';
import Config from 'react-native-config';

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

const formatMemory = (memory: Memory): Memory => {
    if (memory.displayContent != null) {
        console.log(memory.displayContent.fileKey);
        memory.displayContent.fileKey = formatFileKey(memory.displayContent.fileKey)
        console.log(memory.displayContent.fileKey);
    }

    // Memory actually comes back as a string, so it needs to be converted to a number
    memory.date = Number.parseInt(memory.date as any);
    return memory;
};

const formatFileKey = (fileKey: string): string => `${Config.S3_URL}/${fileKey}`;

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
    const uploadPromises: Promise<AxiosResponse<number[]>>[] = upload.content.map((content: Image, index: number) => {
        const form = new FormData();
        form.append('content', {
            name: `file-${index}-memory`,
            type: content.mime,
            uri: content.path
        });

        return Gateway.post<number[]>(`/memory/${mid}/content`, form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    });

    return Promise.all(uploadPromises).then(responses => {
        return responses.map(axiosResponse => axiosResponse.data[0]);
    });
};

export const getMemoryContent = (mid: number): Promise<Content[]> =>
    Gateway.get<Content[]>(`/memory/${mid}/content`).then((v: AxiosResponse<Content[]>) => {
        return v.data.map(content => {
            content.fileKey = formatFileKey(content.fileKey)
            return content;
        })
    });
