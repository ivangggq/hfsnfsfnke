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
import { User } from './user.entity';
import { Logger } from '../../common/services/logger.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

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
}