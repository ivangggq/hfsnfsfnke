import api from './api';
import { Document, GenerateDocumentRequest } from '../types/document.types';

const DocumentService = {
  /**
   * Generate a new document
   */
  async generateDocument(documentData: GenerateDocumentRequest): Promise<Document> {
    try {
      const response = await api.post<Document>('/documents', documentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all documents for a company
   */
  async getDocuments(companyId: string): Promise<Document[]> {
    try {
      const response = await api.get<Document[]>(`/documents?companyId=${companyId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get document by ID
   */
  async getDocumentById(id: string): Promise<Document> {
    try {
      const response = await api.get<Document>(`/documents/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download document
   * Returns a URL that can be used to trigger file download
   */
  getDocumentDownloadUrl(id: string): string {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return `${baseUrl}/documents/${id}/download?token=${token}`;
  },

  /**
   * Download document
   * This method will initiate a file download using the browser
   */
  downloadDocument(id: string, fileName: string): void {
    const downloadUrl = this.getDocumentDownloadUrl(id);
    
    // Create a hidden link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || `document-${id}.pdf`;
    document.body.appendChild(link);
    
    // Trigger click to start download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  },

  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<void> {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default DocumentService;