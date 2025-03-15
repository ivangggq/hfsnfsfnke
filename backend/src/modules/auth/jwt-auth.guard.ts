import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para proteger rutas que requieren autenticación JWT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}