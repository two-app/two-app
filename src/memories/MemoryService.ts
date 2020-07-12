import {AxiosResponse} from 'axios';
import FormData from 'form-data';
import Config from 'react-native-config';
import {Image} from 'react-native-image-crop-picker';
import Gateway from '../http/Gateway';
import {
  Content,
  ImageContent,
  Memory,
  MemoryDescription,
  VideoContent,
  MemoryPatch,
} from './MemoryModels';
import {RootStackParamList} from '../../Router';
import {NavigationProp} from '@react-navigation/native';
import { PickedContent } from '../content/ContentPicker';

export const isMemoryDescriptionValid = (upload: MemoryDescription) =>
  upload.title.length > 0 && upload.location.length > 0;

/**
 * Retrieves the memories for the user.
 * Display images are updated to localised AWS.
 */
export const getMemories = (): Promise<Memory[]> =>
  Gateway.get('/memory').then((v: AxiosResponse<Memory[]>) =>
    v.data.map(formatMemory),
  );

/**
 * Retrieves a specific memory.
 * Display image is updated to localised AWS.
 * @param mid the memory ID to retrieve.
 */
export const getMemory = (mid: number): Promise<Memory> =>
  Gateway.get(
    '/memory/' + mid.toString(),
  ).then((response: AxiosResponse<Memory>) => formatMemory(response.data));

const formatMemory = (memory: Memory): Memory => {
  if (memory.displayContent != null) {
    memory.displayContent.fileKey = formatFileKey(
      memory.displayContent.fileKey,
    );
  }

  // Memory actually comes back as a string, so it needs to be converted to a number
  memory.date = Number.parseInt(memory.date as any);
  return memory;
};

const formatFileKey = (fileKey: string): string =>
  `${Config.S3_URL}/${fileKey}`;

type PostMemoryResponse = {
  memoryId: number;
};

export const createMemory = (
  description: MemoryDescription,
): Promise<number> => {
  description.date = description.date.toString() as any;

  return Gateway.post('/memory', description).then(
    (v: AxiosResponse<PostMemoryResponse>) => v.data.memoryId,
  );
};

export const uploadToMemory = (
  mid: number,
  content: PickedContent[],
  setProgress: (percentage: number) => void,
): Promise<[Memory, Content[]]> => {
  setProgress(0);
  const doneTotal = content.length + 1;
  let doneCount = 1;

  const uploadPromises: Promise<AxiosResponse<number[]>>[] = content.map(
    (content: Image) => {
      const form = new FormData();

      form.append('content', {
        name: content.filename || "tmp-file-name",
        type: content.mime,
        uri: content.path,
      });

      return Gateway.post<number[]>(`/memory/${mid}/content`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60 * 1000, // 1m
      }).finally(() => {
        doneCount++;
        setProgress(Math.round((doneCount / doneTotal) * 100));
      });
    },
  );

  return Promise.all(uploadPromises).then(() => {
    return Promise.all([getMemory(mid), getMemoryContent(mid)])
  });
};

export const buildContentURI = (
  fileKey: String,
  content: ImageContent | VideoContent,
): string => {
  return `${fileKey}-${content.suffix}.${content.extension}`;
};

export const getMemoryContent = (mid: number): Promise<Content[]> =>
  Gateway.get<Content[]>(`/memory/${mid}/content`).then(
    (v: AxiosResponse<Content[]>) => {
      return v.data.map((content) => {
        content.fileKey = formatFileKey(content.fileKey);
        return content;
      });
    },
  );

export const patchMemory = (mid: number, patch: MemoryPatch): Promise<Memory> => {
  return Gateway.patch<any>(`/memory/${mid}`, patch).then(
    (r: AxiosResponse<any>) => {
      console.log(`Successfully patched memory. Response status: ${r.status}`);
      return getMemory(mid);
    },
  );
};