import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Some APIs wrap the data in a 'data' property
    return response.data?.data || response.data;
  },
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Custom error message handling
    const errorMessage = error.response?.data?.error?.message || 
                         error.response?.data?.message || 
                         error.message || 
                         'Ha ocurrido un error';
    
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      error: error
    });
  }
);

export default api;