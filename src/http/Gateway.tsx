import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import Axios from 'axios';
import Config from 'react-native-config';
import {useAuthStore} from '../authentication/AuthenticationStore';

import type {ErrorResponse} from './Response';
import {mapErrorResponse} from './Response';

const Gateway: AxiosInstance = Axios.create({
  baseURL: Config.API_URL,
  timeout: 30000,
});

const showMethodAndURI = (config: AxiosRequestConfig): string =>
  `${config.method?.toUpperCase()} ${config.url}`;

const showReq = (config: AxiosRequestConfig): string =>
  `${showMethodAndURI(config)} -- ${JSON.stringify(config.data ?? {})}`;

const showRes = (req: AxiosRequestConfig, code: number, res: any): string =>
  `${showMethodAndURI(req)} ${code} -- ${JSON.stringify(res ?? {})}`;

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log('>> ' + showReq(config));
  config.headers = config.headers ?? {};

  if (
    (config.url === '/self' || config.url === '/login') &&
    config.method === 'post'
  ) {
    console.log('not appending JWT');
    return config;
  }

  const token = useAuthStore.getState().tokens!!;

  if (config.url === '/refresh' && config.method === 'post') {
    config.headers.Authorization = `Bearer ${token.refreshToken}`;
  } else {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }

  return config;
});

Gateway.interceptors.response.use(
  (response: AxiosResponse<any>): Promise<AxiosResponse<any>> => {
    const output = showRes(response.config, response.status, response.data);
    console.log('<< ' + output);
    return Promise.resolve(response);
  },
  (error: AxiosError<any>): Promise<ErrorResponse> => {
    if (error.response == null) {
      const requestOutput = showMethodAndURI(error.config);
      const reason = ` -- Failed to connect to server at ${Config.API_URL}`;
      console.error('<< ' + requestOutput + reason);
      return Promise.reject({
        status: 500,
        reason: 'Failed to reach Two.',
      });
    } else {
      const output = showRes(
        error.config,
        error.response.status,
        error.response.data,
      );
      console.error('<< ' + output);
      return Promise.reject(mapErrorResponse(error.response.data));
    }
  },
);

export default Gateway;
