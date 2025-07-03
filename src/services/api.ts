// src/services/api.ts
import axios from 'axios';
import { storage } from '../utils/storage';

// URLs para diferentes servicios del backend
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8000/api';
const USERS_API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:8001/api';

// API principal (para auth)
const api = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// API específica para usuarios
const usersApi = axios.create({
  baseURL: USERS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});


// Aplicar interceptors a ambas APIs
[api, usersApi].forEach(apiInstance => {
  // Interceptor de solicitudes
  apiInstance.interceptors.request.use(
    (config) => {
      const token = storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Error en request interceptor:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Error en response:', error);
      
      if (error.response && error.response.status === 401) {
        storage.clearAll();
        window.location.href = '/';
      }
      
      if (error.response && error.response.status >= 500) {
        console.error('Error del servidor:', error.response.data);
      }
      
      return Promise.reject(error);
    }
  );
});

export default api;
export { usersApi };