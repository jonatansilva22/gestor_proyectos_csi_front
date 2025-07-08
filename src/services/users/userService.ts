// src/services/users/userService.ts
import { usersApi } from '../api';
import { CreateUserRequest, User } from '../../types';

// Transformar errores de validación del backend al formato frontend
// Como los nombres de campos ya coinciden, solo necesitamos manejar conversión array/string
const transformBackendErrors = (backendErrors: any) => {
  const transformedErrors: { [key: string]: string } = {};

  Object.keys(backendErrors).forEach(field => {
    const errorMessages = backendErrors[field];
    
    // Manejar formatos de error tanto array como string
    if (Array.isArray(errorMessages)) {
      transformedErrors[field] = errorMessages[0]; // Tomar primer error
    } else if (typeof errorMessages === 'string') {
      transformedErrors[field] = errorMessages;
    }
  });

  return transformedErrors;
};

export const userService = {
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      // Usar FormData si hay archivo, de lo contrario JSON
      if (userData.photo) {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', userData.role.toString());
        formData.append('photo', userData.photo);
        
        const response = await usersApi.post('/create-user/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } else {
        // Payload JSON para usuarios sin fotos
        const payload = {
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        };
        
        const response = await usersApi.post('/create-user/', payload);
        return response.data;
      }
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      console.error('Detalles del error:', error.response?.data);
      console.error('Estado del error:', error.response?.status);
      
      // Transformar errores de validación del backend al formato frontend
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        const transformedError = {
          ...error,
          validationErrors: transformBackendErrors(backendErrors)
        };
        throw transformedError;
      }
      
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para listar usuarios
      const response = await usersApi.get('/create-user/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para obtener usuario específico
      const response = await usersApi.get(`/create-user/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  updateUser: async (id: number, userData: Partial<CreateUserRequest>): Promise<{ user: User; message: string }> => {
    try {
      const formData = new FormData();
      
      // Agregar solo los campos que se van a actualizar
      if (userData.username !== undefined) {
        formData.append('username', userData.username);
      }
      if (userData.first_name !== undefined) {
        formData.append('first_name', userData.first_name);
      }
      if (userData.last_name !== undefined) {
        formData.append('last_name', userData.last_name);
      }
      if (userData.email !== undefined) {
        formData.append('email', userData.email);
      }
      if (userData.password !== undefined) {
        formData.append('password', userData.password);
      }
      if (userData.role !== undefined) {
        formData.append('role', userData.role.toString());
      }
      
      // Agregar archivo si existe
      if (userData.photo) {
        formData.append('photo', userData.photo);
      }
      
      // Endpoint de rama RamaAlanBack del backend para actualizar usuario
      const response = await usersApi.patch(`/create-user/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      
      // Transformar errores de validación del backend al formato frontend
      if (error.response?.status === 400 && error.response?.data) {
        const backendErrors = error.response.data;
        const transformedError = {
          ...error,
          validationErrors: transformBackendErrors(backendErrors)
        };
        throw transformedError;
      }
      
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      // Endpoint de rama RamaAlanBack del backend para eliminar usuario
      await usersApi.delete(`/create-user/${id}/`);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },
};