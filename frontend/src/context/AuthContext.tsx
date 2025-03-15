import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { User } from '@/types/models';
import { LoginRequest, RegisterRequest } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          // Verificar si el token ha expirado
          const decoded = jwtDecode<JwtPayload>(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            authService.logout();
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          // Obtener perfil de usuario
          const response = await userService.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          authService.logout();
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const { accessToken, user: responseUser } = response.data;
      
      // Crear un objeto User completo con todos los campos requeridos
      const completeUser: User = {
        id: responseUser.id,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName,
        email: responseUser.email,
        roles: responseUser.roles,
        isActive: true, // Valor por defecto
        createdAt: new Date().toISOString(), // Valor por defecto
        updatedAt: new Date().toISOString(), // Valor por defecto
        lastLogin: new Date().toISOString(), // Valor por defecto
      };
      
      authService.saveToken(accessToken);
      setUser(completeUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      const { accessToken, user: responseUser } = response.data;
      
      // Crear un objeto User completo con todos los campos requeridos
      const completeUser: User = {
        id: responseUser.id,
        firstName: responseUser.firstName,
        lastName: responseUser.lastName,
        email: responseUser.email,
        roles: responseUser.roles,
        isActive: true, // Valor por defecto
        createdAt: new Date().toISOString(), // Valor por defecto
        updatedAt: new Date().toISOString(), // Valor por defecto
        lastLogin: new Date().toISOString(), // Valor por defecto
      };
      
      authService.saveToken(accessToken);
      setUser(completeUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.roles.includes('admin') || false;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};