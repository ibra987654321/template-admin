// eslint-disable-next-line import/prefer-default-export
import axios from 'axios'
import { getToken } from '@/helpers/helpers'


export const authURL = axios.create({
  baseURL: 'http://176.126.164.208:8070',
})

export const baseURL = axios.create({
  baseURL: 'http://176.126.164.208:8070',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
})

baseURL.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const imageURL = axios.create({
  baseURL: 'http://176.126.164.208:8070',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
  responseType: 'arraybuffer',
})

imageURL.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
