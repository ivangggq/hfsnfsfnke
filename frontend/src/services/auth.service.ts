import api from './api';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

const AuthService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      // Store token in localStorage
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/users/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/users/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;