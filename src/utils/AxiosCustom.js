import axios from 'axios';

const host = process.env.REACT_APP_BASE_URL;

export const axiosInstance = axios.create({ baseURL: host });
