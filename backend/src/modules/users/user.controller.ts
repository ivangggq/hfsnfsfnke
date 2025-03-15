import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { User } from './user.entity';
import { Logger } from '../../common/services/logger.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * Obtiene la configuración del usuario actual
   * @GET /api/users/settings
   */
  @Get('settings')
  @UseGuards(JwtAuthGuard) // Aseguramos que solo se aplique JwtAuthGuard y no RolesGuard
  async getSettings(@CurrentUser() user: User) {
    this.logger.log(`Solicitud de configuración para usuario: ${user.email}`);
    return this.userService.getSettings(user.id);
  }

  /**
   * Actualiza la configuración del usuario actual
   * @PUT /api/users/settings
   */
  @Put('settings')
  @UseGuards(JwtAuthGuard) // Aseguramos que solo se aplique JwtAuthGuard y no RolesGuard
  async updateSettings(
    @CurrentUser() user: User,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    this.logger.log(`Actualización de configuración para usuario: ${user.email}`);
    return this.userService.updateSettings(user.id, updateSettingsDto);
  }

  /**
   * Obtiene el perfil del usuario actual
   * @GET /api/users/profile
   */
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    this.logger.log(`Solicitud de perfil para usuario: ${user.email}`);
    return user;
  }

  /**
   * Actualiza el perfil del usuario actual
   * @PUT /api/users/profile
   */
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`Actualización de perfil para usuario: ${user.email}`);
    return this.userService.update(user.id, updateUserDto);
  }

  /**
   * Obtiene todos los usuarios (solo para administradores)
   * @GET /api/users
   */
  @Get()
  @Roles('admin')
  async findAll() {
    this.logger.log('Solicitud de todos los usuarios');
    return this.userService.findAll();
  }

  /**
   * Obtiene un usuario por ID (solo para administradores)
   * @GET /api/users/:id
   */
  @Get(':id')
  @Roles('admin')
  async findById(@Param('id') id: string) {
    this.logger.log(`Solicitud de usuario por ID: ${id}`);
    return this.userService.findById(id);
  }

  /**
   * Actualiza un usuario por ID (solo para administradores)
   * @PUT /api/users/:id
   */
  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Actualización de usuario por ID: ${id}`);
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Elimina un usuario por ID (solo para administradores)
   * @DELETE /api/users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    this.logger.log(`Eliminación de usuario por ID: ${id}`);
    await this.userService.remove(id);
  }
}