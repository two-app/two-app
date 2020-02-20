// @flow
import Axios, {AxiosRequestConfig} from 'axios';
import {store} from "../state/reducers";

const Gateway = Axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 5000,
});

Gateway.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.url === "/self" && config.method === "post") {
        return config;
    }

    // apply JWT to outgoing request
    const token = store.getState().authentication['accessToken'];
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});

export default Gateway;