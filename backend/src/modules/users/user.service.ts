import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { Logger } from '../../common/services/logger.service';
import { createEntityNotFoundException, createEntityExistsException } from '../../common/utils/error.utils';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Encuentra un usuario por su ID
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      this.logger.warn(`Usuario con ID ${id} no encontrado`);
    }
    
    return user;
  }

  /**
   * Encuentra un usuario por su email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      this.logger.debug(`Usuario con email ${email} no encontrado`);
    }
    
    return user;
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData: RegisterDto & { password: string; roles: string[] }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    
    if (existingUser) {
      throw createEntityExistsException('Usuario', 'email', userData.email);
    }
    
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    
    this.logger.log(`Usuario creado: ${savedUser.email}`);
    
    return savedUser;
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    if (!user) {
      throw createEntityNotFoundException('Usuario', id);
    }
    
    // Verificar si se está actualizando el email y si ya existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      
      if (existingUser) {
        throw createEntityExistsException('Usuario', 'email', updateUserDto.email);
      }
    }
    
    // Actualizar usuario
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    
    this.logger.log(`Usuario actualizado: ${updatedUser.email}`);
    
    return updatedUser;
  }

  /**
   * Actualiza la fecha de último login
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLogin: new Date(),
    });
    
    this.logger.debug(`Último login actualizado para usuario con ID ${id}`);
  }

  /**
   * Elimina un usuario
   */
  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    
    if (!user) {
      throw createEntityNotFoundException('Usuario', id);
    }
    
    await this.userRepository.remove(user);
    
    this.logger.log(`Usuario eliminado: ${user.email}`);
  }

  /**
   * Encuentra todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Obtiene la configuración del usuario
   */
  async getSettings(id: string): Promise<Partial<User>> {
    const user = await this.findById(id);
    
    if (!user) {
      throw createEntityNotFoundException('Usuario', id);
    }
    
    return {
      openaiKey: user.openaiKey,
      inferenceMethod: user.inferenceMethod,
      maxRiskScenarios: user.maxRiskScenarios,
    };
  }

  /**
   * Actualiza la configuración del usuario
   */
  async updateSettings(id: string, updateSettingsDto: UpdateSettingsDto): Promise<Partial<User>> {
    const user = await this.findById(id);
    
    if (!user) {
      throw createEntityNotFoundException('Usuario', id);
    }
    
    // Actualizar configuración
    user.openaiKey = updateSettingsDto.openaiKey;
    user.inferenceMethod = updateSettingsDto.inferenceMethod;
    user.maxRiskScenarios = updateSettingsDto.maxRiskScenarios;
    
    await this.userRepository.save(user);
    
    this.logger.log(`Configuración actualizada para usuario: ${user.email}`);
    
    return {
      openaiKey: user.openaiKey,
      inferenceMethod: user.inferenceMethod,
      maxRiskScenarios: user.maxRiskScenarios,
    };
  }
}