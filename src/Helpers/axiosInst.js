import axios from 'axios';
import { getUserId } from '../Helpers/Auth'
//baseURL: 'https://live.membroz.com/api',
const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
        //'authkey': getUserId() //'5ece552879b40e583fa63927'
    }
});

//instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// instance.interceptors.request...

instance.interceptors.request.use(
    function (config) {
        if (config.url !== "auth/login") {
            config.headers.authkey = getUserId();
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


export default instance;