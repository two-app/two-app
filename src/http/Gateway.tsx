import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../state/reducers';
import Config from 'react-native-config';
import { mapErrorResponse } from './Response';

const Gateway: AxiosInstance = Axios.create({
    baseURL: Config.API_URL,
    timeout: 5000,
});

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.url === "/self" && config.method === "post") {
        return config;
    }

    if (config.url === '/refresh' && config.method == "post") {
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
    response => {
        return Promise.resolve(response)
    },
    (error: AxiosError<any>) => {
        return Promise.reject(mapErrorResponse(error));
    }
);

export default Gateway;
