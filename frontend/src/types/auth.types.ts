/**
 * User model
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login request data
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request data
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}