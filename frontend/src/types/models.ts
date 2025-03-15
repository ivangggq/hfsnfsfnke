// Modelos de datos principales basados en la especificación

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityInfo {
  informationAssets: string[];
  threats: string[];
  vulnerabilities: string[];
  existingMeasures: string[];
}

export interface InferredRiskScenario {
  id: string;
  asset: string;
  threat: string;
  vulnerability: string;
  probability: 'Alto' | 'Medio' | 'Bajo';
  impact: 'Alto' | 'Medio' | 'Bajo';
  riskLevel: 'Alto' | 'Medio' | 'Bajo';
  controls: string[];
}

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
  securityInfo?: SecurityInfo;
  riskScenarios: InferredRiskScenario[];
  lastRiskInference?: string;
  user?: User; // Relación
  createdAt: string;
  updatedAt: string;
}

export interface SecurityTemplate {
  id: string;
  name: string;
  industry: string;
  description?: string;
  template: SecurityInfo;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'isms_scope' | 'security_policy' | 'risk_assessment' | 'statement_of_applicability';
export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  description?: string;
  content?: string;
  filePath: string;
  fileSize: number;
  metadata?: Record<string, any>;
  version: number;
  company: Company;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}