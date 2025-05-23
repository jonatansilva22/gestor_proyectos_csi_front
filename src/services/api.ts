// src/services/api.ts
import axios from 'axios';
import { storage } from '../utils/storage';

// Obtener la URL base desde las variables de entorno o usar un valor por defecto
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
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

// Interceptor para manejar errores de respuesta (como tokens expirados)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en response:', error);
    
    // Si el error es 401 (Unauthorized), podría ser token expirado
    if (error.response && error.response.status === 401) {
      storage.clearAll();
      window.location.href = '/';
    }
    
    // Manejar otros errores comunes
    if (error.response && error.response.status >= 500) {
      console.error('Error del servidor:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;