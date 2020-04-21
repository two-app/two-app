import Axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {store} from '../state/reducers';

const Gateway: AxiosInstance = Axios.create({
    baseURL: 'http://192.168.43.198:8000/',
    timeout: 5000,
});

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.url === "/self" && config.method === "post") {
        return config;
    }

    // apply JWT to outgoing request
    const token = store.getState().auth?.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

export default Gateway;