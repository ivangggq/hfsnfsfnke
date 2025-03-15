import api from './api';

export interface Company {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  securityDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  securityDetails?: Record<string, any>;
}

export interface UpdateCompanyData {
  name?: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  securityDetails?: Record<string, any>;
}

const CompanyService = {
  getCompanies: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },

  getCompany: async (id: string): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (data: CreateCompanyData): Promise<Company> => {
    const response = await api.post<Company>('/companies', data);
    return response.data;
  },

  updateCompany: async (id: string, data: UpdateCompanyData): Promise<Company> => {
    const response = await api.patch<Company>(`/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};

export default CompanyService;