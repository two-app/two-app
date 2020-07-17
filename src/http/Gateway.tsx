import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import Config from 'react-native-config';

import {store} from '../state/reducers';

import {mapErrorResponse, ErrorResponse} from './Response';

const Gateway: AxiosInstance = Axios.create({
  baseURL: Config.API_URL,
  timeout: 5000,
});

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
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
  (response: AxiosResponse<any>): Promise<AxiosResponse<any>> =>
    Promise.resolve(response),
  (error: AxiosError<any>): Promise<ErrorResponse> =>
    Promise.reject(mapErrorResponse(error)),
);

export default Gateway;
