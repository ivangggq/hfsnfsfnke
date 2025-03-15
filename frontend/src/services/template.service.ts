import api from './api';
import { SecurityTemplate } from '../types/template.types';

const TemplateService = {
  /**
   * Get all security templates
   */
  async getTemplates(): Promise<SecurityTemplate[]> {
    try {
      const response = await api.get<SecurityTemplate[]>('/security-templates');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get default security templates
   */
  async getDefaultTemplates(): Promise<SecurityTemplate[]> {
    try {
      const response = await api.get<SecurityTemplate[]>('/security-templates?default=true');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get security templates by industry
   */
  async getTemplatesByIndustry(industry: string): Promise<SecurityTemplate[]> {
    try {
      const response = await api.get<SecurityTemplate[]>(`/security-templates?industry=${industry}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<SecurityTemplate> {
    try {
      const response = await api.get<SecurityTemplate>(`/security-templates/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new template (admin only)
   */
  async createTemplate(templateData: Partial<SecurityTemplate>): Promise<SecurityTemplate> {
    try {
      const response = await api.post<SecurityTemplate>('/security-templates', templateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing template (admin only)
   */
  async updateTemplate(id: string, templateData: Partial<SecurityTemplate>): Promise<SecurityTemplate> {
    try {
      const response = await api.put<SecurityTemplate>(`/security-templates/${id}`, templateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a template (admin only)
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await api.delete(`/security-templates/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default TemplateService;