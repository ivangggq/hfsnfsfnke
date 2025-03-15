import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../services/logger.service';

/**
 * Filtro para manejar excepciones HTTP de manera uniforme
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Extraer mensaje y código de error
    const errorMessage = 
      typeof errorResponse === 'object' && 'message' in errorResponse
        ? errorResponse['message']
        : exception.message;
    
    const errorCode = 
      typeof errorResponse === 'object' && 'error' in errorResponse
        ? errorResponse['error']
        : 'Error';

    // Crear respuesta formateada
    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: {
        code: errorCode,
        message: errorMessage,
      },
    };

    // Registrar el error
    this.logger.error(
      `${request.method} ${request.url} - Status ${status}: ${JSON.stringify(errorMessage)}`,
      exception.stack,
    );

    // Enviar respuesta al cliente
    response.status(status).json(responseBody);
  }
}