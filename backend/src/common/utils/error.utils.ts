import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Crea una excepción HTTP para entidad no encontrada
 */
export const createEntityNotFoundException = (entityName: string, id?: string | number): HttpException => {
  const message = id 
    ? `${entityName} con id ${id} no encontrado` 
    : `${entityName} no encontrado`;
  
  return new HttpException(
    {
      status: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message,
    },
    HttpStatus.NOT_FOUND,
  );
};

/**
 * Crea una excepción HTTP para entidad ya existente
 */
export const createEntityExistsException = (entityName: string, field: string, value: string): HttpException => {
  return new HttpException(
    {
      status: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: `${entityName} con ${field} '${value}' ya existe`,
    },
    HttpStatus.CONFLICT,
  );
};

/**
 * Crea una excepción HTTP para operación no autorizada
 */
export const createUnauthorizedException = (message: string = 'No autorizado'): HttpException => {
  return new HttpException(
    {
      status: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized',
      message,
    },
    HttpStatus.UNAUTHORIZED,
  );
};

/**
 * Crea una excepción HTTP para operación prohibida
 */
export const createForbiddenException = (message: string = 'Operación prohibida'): HttpException => {
  return new HttpException(
    {
      status: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message,
    },
    HttpStatus.FORBIDDEN,
  );
};

/**
 * Crea una excepción HTTP para solicitud inválida
 */
export const createBadRequestException = (message: string): HttpException => {
  return new HttpException(
    {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message,
    },
    HttpStatus.BAD_REQUEST,
  );
};

/**
 * Crea una excepción HTTP para error interno del servidor
 */
export const createInternalServerErrorException = (message: string = 'Error interno del servidor'): HttpException => {
  return new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};