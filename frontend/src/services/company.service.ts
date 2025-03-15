import { apiClient } from '../types/lib/api-client';
import { ApiResponse, CreateCompanyRequest, UpdateCompanyRequest } from '../types/api';
import { Company } from '../types/models';

export const companyService = {
  // Crear nueva empresa
  createCompany: async (companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> => {
    return apiClient<ApiResponse<Company>>({
      method: 'POST',
      url: '/companies',
      data: companyData,
    });
  },

  // Listar empresas del usuario
  getUserCompanies: async (): Promise<ApiResponse<Company[]>> => {
    return apiClient<ApiResponse<Company[]>>({
      method: 'GET',
      url: '/companies',
    });
  },

  // Obtener empresa por ID
  getCompanyById: async (companyId: string): Promise<ApiResponse<Company>> => {
    return apiClient<ApiResponse<Company>>({
      method: 'GET',
      url: `/companies/${companyId}`,
    });
  },

  // Actualizar empresa
  updateCompany: async (companyId: string, companyData: UpdateCompanyRequest): Promise<ApiResponse<Company>> => {
    return apiClient<ApiResponse<Company>>({
      method: 'PUT',
      url: `/companies/${companyId}`,
      data: companyData,
    });
  },

  // Eliminar empresa
  deleteCompany: async (companyId: string): Promise<void> => {
    return apiClient<void>({
      method: 'DELETE',
      url: `/companies/${companyId}`,
    });
  },
};