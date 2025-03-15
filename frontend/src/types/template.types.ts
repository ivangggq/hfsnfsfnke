import { SecurityInfo } from './company.types';

/**
 * Security template model
 */
export interface SecurityTemplate {
  id: string;
  name: string;
  industry: string;
  description?: string;
  template: SecurityInfo;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}