import api from './api';

export interface Document {
  id: string;
  name: string;
  type: string;
  description?: string;
  isGenerated: boolean;
  fileName?: string;
  contentType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateDocumentData {
  type: string;
  companyId: string;
  name?: string;
  description?: string;
}

const DocumentService = {
  getDocuments: async (companyId: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/documents?companyId=${companyId}`);
    return response.data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const response = await api.get<Document>(`/documents/${id}`);
    return response.data;
  },

  generateDocument: async (data: GenerateDocumentData): Promise<Document> => {
    const response = await api.post<Document>('/documents/generate', data);
    return response.data;
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};

export default DocumentService;