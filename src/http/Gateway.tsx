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

const showMethodAndURI = (config: AxiosRequestConfig): string =>
  `${config.method?.toUpperCase()} ${config.url}`

const showReq = (config: AxiosRequestConfig): string =>
  `${showMethodAndURI(config)} -- ${JSON.stringify(config.data ?? {})}`;

const showRes = (req: AxiosRequestConfig, res: any): string =>
  `${showMethodAndURI(req)} -- ${JSON.stringify(res ?? {})}`;

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log('>> ' + showReq(config));
  config.headers = config.headers ?? {};

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
    console.log('<< ' + showRes(response.config, response.data))
    return Promise.resolve(response);
  },
  (error: AxiosError<any>): Promise<ErrorResponse> =>
    Promise.reject(mapErrorResponse(error)),
);

export default Gateway;
