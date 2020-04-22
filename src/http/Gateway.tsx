import Axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {store} from '../state/reducers';

const Gateway: AxiosInstance = Axios.create({
    baseURL: 'http://192.168.0.27:8000/',
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
}, error => {
    return Promise.reject(error);
});

export default Gateway;