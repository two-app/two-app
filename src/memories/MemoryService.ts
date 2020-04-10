import { Memory, MemoryDescription, Content } from './MemoryModels';
import Gateway from '../http/Gateway';
import { AxiosResponse } from 'axios';
import { Image } from 'react-native-image-crop-picker';
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

const formatMemory = (memory: Memory): Memory => {
    if (memory.displayContent != null) {
        // TODO Make this config-driven for AWS
        memory.displayContent.fileKey = formatFileKey(memory.displayContent.fileKey)
    }

    // Memory actually comes back as a string, so it needs to be converted to a number
    memory.date = Number.parseInt(memory.date as any);
    return memory;
};

const formatFileKey = (fileKey: string): string => `http://127.0.0.1:4572/memory-content/${fileKey}`;

type PostMemoryResponse = {
    memoryId: number
};

export const createMemory = (description: MemoryDescription): Promise<number> => {
    description.date = description.date.toString() as any;

    // @ts-ignore
    return Gateway.post('/memory', description).then(
        (v: AxiosResponse<PostMemoryResponse>) => v.data.memoryId
    ).catch(e => {
        console.log("Caught error in creating memory.");
        console.log(e);
        console.log(e.message);
    });
};

export const uploadToMemory = (mid: number, upload: MemoryUpload): Promise<number[]> => {
    console.log("Uploading to memory.");
    const uploadPromises: Promise<AxiosResponse<number[]>>[] = upload.content.map((content: Image, index: number) => {
        const form = new FormData();
        form.append('content', {
            name: `file-${index}-memory`,
            type: content.mime,
            uri: content.path
        });

        console.log({
            name: content.filename,
            type: content.mime,
            uri: content.path
        });

        return Gateway.post<number[]>(`/memory/${mid}/content`, form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    });

    // @ts-ignore
    return Promise.all(uploadPromises).then(responses => {
        return responses.map(axiosResponse => axiosResponse.data[0]);
    }).catch(e => {
        console.log("Caught error in uploading to memory.");
        console.log(e);
        console.log(e.message);
    });
};

export const getMemoryContent = (mid: number): Promise<Content[]> =>
    Gateway.get<Content[]>(`/memory/${mid}/content`).then((v: AxiosResponse<Content[]>) => {
        return v.data.map(content => {
            content.fileKey = formatFileKey(content.fileKey)
            return content;
        })
    });