import { apiClient } from '../types/lib/api-client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types/api';

export const authService = {
  // Registro de usuario
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient<ApiResponse<AuthResponse>>({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });
  },

  // Inicio de sesión
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient<ApiResponse<AuthResponse>>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Guardar token en localStorage
  saveToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Obtener token de localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};