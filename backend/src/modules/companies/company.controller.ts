import {
  Controller,
  Get,
  Post,
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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../users/user.entity';
import { Logger } from '../../common/services/logger.service';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);

  constructor(private readonly companyService: CompanyService) {}

  /**
   * Crea una nueva empresa
   * @POST /api/companies
   */
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    this.logger.log(`Creación de empresa solicitada por usuario: ${user.email}`);
    return this.companyService.create(user.id, createCompanyDto);
  }

  /**
   * Obtiene todas las empresas del usuario actual
   * @GET /api/companies
   */
  @Get()
  async findAllByUser(@CurrentUser() user: User) {
    this.logger.log(`Solicitud de empresas por usuario: ${user.email}`);
    return this.companyService.findAllByUser(user.id);
  }

  /**
   * Obtiene una empresa por ID
   * @GET /api/companies/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Solicitud de empresa por ID: ${id} por usuario: ${user.email}`);
    const company = await this.companyService.findById(id);
    
    // Verificar permisos para ver la empresa
    if (company && (company.user.id === user.id || user.roles.includes('admin'))) {
      return company;
    }
    
    return null;
  }

  /**
   * Actualiza una empresa existente
   * @PUT /api/companies/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`Actualización de empresa por ID: ${id} por usuario: ${user.email}`);
    return this.companyService.update(id, user.id, updateCompanyDto);
  }

  /**
   * Elimina una empresa
   * @DELETE /api/companies/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Eliminación de empresa por ID: ${id} por usuario: ${user.email}`);
    await this.companyService.remove(id, user.id);
  }

  /**
   * Obtiene todas las empresas (solo para administradores)
   * @GET /api/companies/admin/all
   */
  @Get('admin/all')
  @Roles('admin')
  async findAll() {
    this.logger.log('Solicitud de todas las empresas (administrador)');
    return this.companyService.findAll();
  }
}