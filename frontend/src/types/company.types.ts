import { User } from './auth.types';
import { Document } from './document.types';
import { InferredRiskScenario } from './risk.types';

/**
 * Security information
 */
export interface SecurityInfo {
  informationAssets: string[];
  threats: string[];
  vulnerabilities: string[];
  existingMeasures: string[];
}

/**
 * Company model
 */
export interface Company {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  securityInfo: SecurityInfo;
  riskScenarios: InferredRiskScenario[];
  lastRiskInference?: Date;
  user: User;
  documents?: Document[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create company request
 */
export interface CreateCompanyRequest {
  name: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  securityInfo?: SecurityInfo;
  securityTemplateId?: string;
}

/**
 * Update company request
 */
export interface UpdateCompanyRequest {
  name?: string;
  industry?: string;
  location?: string;
  size?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  securityInfo?: SecurityInfo;
  securityTemplateId?: string;
}