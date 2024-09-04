import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    toast({
      title: 'Success',
      description: response.data?.message || 'Request completed successfully.',
      variant: 'default',
      duration: 5000,
    });
    return response;
  },
  (error) => {
    toast({
      title: 'Error',
      description:
        error.response?.data?.message || 'An unexpected error occurred.',
      variant: 'destructive',
      duration: 5000,
    });

    // if (error.response && error.response.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
