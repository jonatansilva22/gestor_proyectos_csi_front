// src/services/userService.ts
import api from './api';
import { CreateUserRequest, User, UserRole } from '../types';

export const userService = {
  createUser: async (userData: CreateUserRequest): Promise<{ user: User; message: string }> => {
    try {
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append('username', userData.username);
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      
      // Agregar archivo si existe
      if (userData.photo) {
        formData.append('photo', userData.photo);
      }
      
      const response = await api.post('/users/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}/`);
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
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'photo') {
          formData.append(key, value as string);
        }
      });
      
      // Agregar archivo si existe
      if (userData.photo) {
        formData.append('photo', userData.photo);
      }
      
      const response = await api.patch(`/users/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/${id}/`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};