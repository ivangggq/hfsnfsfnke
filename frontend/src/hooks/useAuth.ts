import { useState, useEffect, useCallback } from 'react';
import AuthService from '../services/auth.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: AuthService.isAuthenticated(),
  });

  const loadUser = useCallback(async () => {
    if (AuthService.isAuthenticated()) {
      try {
        const user = await AuthService.getCurrentUser();
        setAuthState({
          user,
          loading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await AuthService.login({ email, password });
      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error de inicio de sesión',
      };
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const { user } = await AuthService.register({ firstName, lastName, email, password });
      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error en el registro',
      };
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user: authState.user,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
    loadUser,
  };
};

export default useAuth;