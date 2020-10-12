import Axios, { AxiosRequestConfig } from 'axios';
import { IdentityService } from './services/IdentityService';

const apiInstance = Axios.create({
  baseURL: process.env.REACT_APP_DATA_SERVICE,
});

apiInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = IdentityService.getInstance().token;
  if (!token)
    throw new Error('This operation requires authorization, please sign in.');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiInstance;
