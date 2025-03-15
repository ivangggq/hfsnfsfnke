import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para establecer los roles requeridos para acceder a un recurso
 * 
 * @param roles Lista de roles permitidos
 * @returns Decorador para el controlador o método
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);