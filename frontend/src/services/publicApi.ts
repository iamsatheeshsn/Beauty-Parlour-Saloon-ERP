import axios from 'axios'
import { API_BASE_URL } from '@/constants/app'

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default publicApi
