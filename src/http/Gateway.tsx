import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import Axios from 'axios';
import Config from 'react-native-config';

import {store} from '../state/reducers';

import type {ErrorResponse} from './Response';
import {mapErrorResponse} from './Response';

const Gateway: AxiosInstance = Axios.create({
  baseURL: Config.API_URL,
  timeout: 30000,
});

const showReq = (config: AxiosRequestConfig): string =>
  `${config.method?.toUpperCase()} ${config.url}`;

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log(`Sending Request ${showReq(config)}`);
  console.log(`Request Body: ${JSON.stringify(config.data)}`);
  console.debug(`Request Config: ${JSON.stringify(config)}`);
  if (config.url === '/self' && config.method === 'post') {
    return config;
  }

  if (config.url === '/refresh' && config.method === 'post') {
    // apply Refresh JWT to outgoing request
    const token = store.getState().auth?.refreshToken;
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // apply Access JWT to outgoing request
    const token = store.getState().auth?.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

Gateway.interceptors.response.use(
  (response: AxiosResponse<any>): Promise<AxiosResponse<any>> => {
    console.log(`Received response from ${showReq(response.config)}`);
    console.log(`Response Body: ${JSON.stringify(response.data)}`);
    console.debug(`Response Config: ${JSON.stringify(response.config)}`);
    return Promise.resolve(response);
  },
  (error: AxiosError<any>): Promise<ErrorResponse> =>
    Promise.reject(mapErrorResponse(error)),
);

export default Gateway;
