import { apiClient } from '../types/lib/api-client';
import { ApiResponse, CreateSecurityTemplateRequest } from '../types/api';
import { SecurityTemplate } from '../types/models';

export const securityTemplateService = {
  // Listar plantillas (con filtros opcionales)
  getTemplates: async (industry?: string, isDefault?: boolean): Promise<ApiResponse<SecurityTemplate[]>> => {
    const params: Record<string, string | boolean> = {};
    if (industry) {
      params.industry = industry;
    }
    if (isDefault !== undefined) {
      params.default = isDefault;
    }

    return apiClient<ApiResponse<SecurityTemplate[]>>({
      method: 'GET',
      url: '/security-templates',
      params,
    });
  },

  // Obtener plantilla por ID
  getTemplateById: async (templateId: string): Promise<ApiResponse<SecurityTemplate>> => {
    return apiClient<ApiResponse<SecurityTemplate>>({
      method: 'GET',
      url: `/security-templates/${templateId}`,
    });
  },

  // Crear plantilla (solo admin)
  createTemplate: async (templateData: CreateSecurityTemplateRequest): Promise<ApiResponse<SecurityTemplate>> => {
    return apiClient<ApiResponse<SecurityTemplate>>({
      method: 'POST',
      url: '/security-templates',
      data: templateData,
    });
  },
};