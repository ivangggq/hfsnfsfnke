import { apiClient } from '../types/lib/api-client';
import { ApiResponse, CreateDocumentRequest } from '../types/api';
import { Document } from '../types/models';

export const documentService = {
  // Generar documento
  createDocument: async (documentData: CreateDocumentRequest): Promise<ApiResponse<Document>> => {
    return apiClient<ApiResponse<Document>>({
      method: 'POST',
      url: '/documents',
      data: documentData,
    });
  },

  // Listar documentos de una empresa
  getCompanyDocuments: async (companyId: string): Promise<ApiResponse<Document[]>> => {
    return apiClient<ApiResponse<Document[]>>({
      method: 'GET',
      url: '/documents',
      params: { companyId },
    });
  },

  // Obtener documento por ID
  getDocumentById: async (documentId: string): Promise<ApiResponse<Document>> => {
    return apiClient<ApiResponse<Document>>({
      method: 'GET',
      url: `/documents/${documentId}`,
    });
  },

  // Descargar documento
  downloadDocument: async (documentId: string): Promise<Blob> => {
    const response = await apiClient<Blob>({
      method: 'GET',
      url: `/documents/${documentId}/download`,
      responseType: 'blob',
    });
    return response;
  },

  // Eliminar documento
  deleteDocument: async (documentId: string): Promise<void> => {
    return apiClient<void>({
      method: 'DELETE',
      url: `/documents/${documentId}`,
    });
  },
};