// eslint-disable-next-line import/prefer-default-export
import axios from 'axios'
import { getToken } from '@/helpers/helpers'


export const authURL = axios.create({
  baseURL: 'http://sks-back.beeline.kg:8070',
})

export const baseURL = axios.create({
  baseURL: 'http://sks-back.beeline.kg:8070',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
})

export function createAxiosInstance() {
  const instance = axios.create({
    baseURL: 'http://sks-back.beeline.kg:8070',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Динамически устанавливаем заголовок "Authorization" при каждом запросе
  instance.interceptors.request.use((config) => {
    const token = getToken(); // Получаем токен здесь, перед каждым запросом
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  console.log(instance)
  return instance;
}
