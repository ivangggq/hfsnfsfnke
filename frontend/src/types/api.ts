// Tipos para la API según la especificación

// Respuesta base de la API
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
}

// Respuesta de error de la API
export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: {
    code: string;
    message: string;
  };
}

// Auth
export interface RegisterRequest {
  firstName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };
  accessToken: string;
}

// Usuario
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

// Empresa
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
  securityTemplateId?: string;
}

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
  securityInfo?: {
    informationAssets?: string[];
    threats?: string[];
    vulnerabilities?: string[];
    existingMeasures?: string[];
  };
  securityTemplateId?: string;
}

// Documentos
export interface CreateDocumentRequest {
  name: string;
  type: string;
  description?: string;
  companyId: string;
  parameters?: Record<string, any>;
}

// Plantillas de seguridad
export interface CreateSecurityTemplateRequest {
  name: string;
  industry: string;
  description?: string;
  template: {
    informationAssets: string[];
    threats: string[];
    vulnerabilities: string[];
    existingMeasures: string[];
  };
  isDefault?: boolean;
}