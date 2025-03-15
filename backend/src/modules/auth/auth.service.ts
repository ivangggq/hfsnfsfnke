import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt.strategy';
import { Logger } from '../../common/services/logger.service';
import { createEntityExistsException } from '../../common/utils/error.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registra un nuevo usuario
   */
  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw createEntityExistsException('Usuario', 'email', registerDto.email);
    }

    // Hash de la contraseña
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Crear nuevo usuario
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      roles: ['user'], // Rol por defecto
    });

    // Generar token JWT
    const token = this.generateToken(user.id, user.email);

    this.logger.log(`Usuario registrado: ${user.email}`);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
      accessToken: token,
    };
  }

  /**
   * Autentica un usuario
   */
  async login(loginDto: LoginDto) {
    // Buscar usuario por email
    const user = await this.userService.findByEmail(loginDto.email);

    // Verificar si el usuario existe y la contraseña es correcta
    if (!user || !(await this.verifyPassword(user.password, loginDto.password))) {
      this.logger.warn(`Intento de inicio de sesión fallido: ${loginDto.email}`);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar token JWT
    const token = this.generateToken(user.id, user.email);

    this.logger.log(`Usuario autenticado: ${user.email}`);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
      accessToken: token,
    };
  }

  /**
   * Genera un hash de la contraseña usando Argon2
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verifica si la contraseña es correcta
   */
  async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }

  /**
   * Genera un token JWT
   */
  generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiration'),
    });
  }
}