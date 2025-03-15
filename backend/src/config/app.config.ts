import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || 'EasyCert',
  description: process.env.APP_DESCRIPTION || 'Plataforma para simplificar la certificación ISO 27001',
  version: process.env.APP_VERSION || '0.1.0',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
}));