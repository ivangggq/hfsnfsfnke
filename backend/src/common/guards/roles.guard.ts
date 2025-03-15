import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard para controlar acceso basado en roles de usuario
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener usuario de la solicitud
    const { user } = context.switchToHttp().getRequest();
    
    // Verificar que el usuario exista y tenga al menos uno de los roles requeridos
    return user && requiredRoles.some((role) => user.roles?.includes(role));
  }
}