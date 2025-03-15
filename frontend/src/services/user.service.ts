import { apiClient } from '../types/lib/api-client';
import { ApiResponse, UpdateUserRequest } from '../types/api';
import { User } from '../types/models';

export const userService = {
  // Obtener perfil del usuario actual
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient<ApiResponse<User>>({
      method: 'GET',
      url: '/users/profile',
    });
  },

  // Actualizar perfil de usuario
  updateProfile: async (userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiClient<ApiResponse<User>>({
      method: 'PUT',
      url: '/users/profile',
      data: userData,
    });
  },

  // Obtener usuario por ID (solo admin)
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    return apiClient<ApiResponse<User>>({
      method: 'GET',
      url: `/users/${userId}`,
    });
  },

  // Listar todos los usuarios (solo admin)
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiClient<ApiResponse<User[]>>({
      method: 'GET',
      url: '/users',
    });
  },
};