import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Logger } from '../../common/services/logger.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para registro de nuevos usuarios
   * @POST /api/auth/register
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log('Solicitud de registro recibida');
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint para inicio de sesión
   * @POST /api/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('Solicitud de inicio de sesión recibida');
    return this.authService.login(loginDto);
  }
}