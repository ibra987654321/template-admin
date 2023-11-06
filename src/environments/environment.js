// eslint-disable-next-line import/prefer-default-export
import axios from 'axios'
import { getToken } from '@/helpers/helpers'


export const authURL = axios.create({
  baseURL: 'http://sks-back.beeline.kg:8070',
})

export const baseURL = axios.create({
  baseURL: 'http://sks-back.beeline.kg:8070',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
})
