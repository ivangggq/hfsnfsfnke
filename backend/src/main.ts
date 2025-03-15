import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { Logger } from './common/services/logger.service';

async function bootstrap() {
  // Crear instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });

  // Obtener el servicio de configuración
  const configService = app.get(ConfigService);
  
  // Configuración de prefijo global para las rutas de la API
  const apiPrefix = configService.get<string>('API_PREFIX');
  app.setGlobalPrefix(apiPrefix);
  
  // Configuración de CORS
  app.enableCors();
  
  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Configuración de filtros e interceptores globales
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Iniciar el servidor en el puerto configurado
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  console.log(`Application running on port ${port}`);
}

bootstrap();