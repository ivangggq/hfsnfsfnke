import { User } from './auth.types';
import { Company } from './company.types';

/**
 * Document types
 */
export enum DocumentType {
  ISMS_SCOPE = 'isms_scope',
  SECURITY_POLICY = 'security_policy',
  RISK_ASSESSMENT = 'risk_assessment',
  STATEMENT_OF_APPLICABILITY = 'statement_of_applicability',
  SECURITY_PROCEDURE = 'security_procedure',
}

/**
 * Document status
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Document model
 */
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  description?: string;
  content?: string;
  filePath?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
  version: number;
  createdBy: User;
  company: Company;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generate document request
 */
export interface GenerateDocumentRequest {
  name: string;
  type: DocumentType;
  description?: string;
  companyId: string;
  parameters?: Record<string, any>;
}