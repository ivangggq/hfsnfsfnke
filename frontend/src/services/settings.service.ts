import { apiClient } from '../types/lib/api-client';
import { ApiResponse } from '../types/api';
import { UserSettings } from '../types/models';

export const settingsService = {
  /**
   * Obtiene la configuración del usuario actual
   */
  getUserSettings: async (): Promise<ApiResponse<UserSettings>> => {
    return apiClient<ApiResponse<UserSettings>>({
      method: 'GET',
      url: '/users/settings',
    });
  },
  
  /**
   * Actualiza la configuración del usuario actual
   */
  updateUserSettings: async (settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> => {
    return apiClient<ApiResponse<UserSettings>>({
      method: 'PUT',
      url: '/users/settings',
      data: settings,
    });
  },
};