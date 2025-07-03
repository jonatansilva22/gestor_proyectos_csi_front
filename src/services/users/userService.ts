// src/services/users/userService.ts
import { usersApi } from '../api';
import { CreateUserRequest, User } from '../../types';

// Transform backend validation errors to frontend format
// Since field names now match, we only need to handle array/string conversion
const transformBackendErrors = (backendErrors: any) => {
  const transformedErrors: { [key: string]: string } = {};

  Object.keys(backendErrors).forEach(field => {
    const errorMessages = backendErrors[field];
    
    // Handle both array and string error formats
    if (Array.isArray(errorMessages)) {
      transformedErrors[field] = errorMessages[0]; // Take first error
    } else if (typeof errorMessages === 'string') {
      transformedErrors[field] = errorMessages;
    }
  });

  return transformedErrors;
};

export const userService = {
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      // Use FormData if there's a file, otherwise JSON
      if (userData.photo) {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', userData.role);
        formData.append('photo', userData.photo);
        
        const response = await usersApi.post('/create-user/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } else {
        // JSON payload for users without photos
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
      console.error('Error creating user:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Transform backend validation errors to frontend format
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
      // Backend RamaAlanBack branch endpoint for listing users
      const response = await usersApi.get('/create-user/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      // Backend RamaAlanBack branch endpoint for getting specific user
      const response = await usersApi.get(`/create-user/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
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
        formData.append('role', userData.role);
      }
      
      // Agregar archivo si existe
      if (userData.photo) {
        formData.append('photo', userData.photo);
      }
      
      // Backend RamaAlanBack branch endpoint for updating user
      const response = await usersApi.patch(`/create-user/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      
      // Transform backend validation errors to frontend format
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
      // Backend RamaAlanBack branch endpoint for deleting user
      await usersApi.delete(`/create-user/${id}/`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};