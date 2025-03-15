import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SecurityTemplateService } from './security-template.service';
import { CreateSecurityTemplateDto } from './dto/create-security-template.dto';
import { UpdateSecurityTemplateDto } from './dto/update-security-template.dto';
import { Logger } from '../../common/services/logger.service';

@Controller('security-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecurityTemplateController {
  private readonly logger = new Logger(SecurityTemplateController.name);

  constructor(private readonly securityTemplateService: SecurityTemplateService) {}

  /**
   * Crea una nueva plantilla de seguridad (solo admin)
   * @POST /api/security-templates
   */
  @Post()
  @Roles('admin')
  async create(@Body() createDto: CreateSecurityTemplateDto) {
    this.logger.log(`Solicitud de creación de plantilla de seguridad: ${createDto.name}`);
    return this.securityTemplateService.create(createDto);
  }

  /**
   * Obtiene todas las plantillas de seguridad
   * @GET /api/security-templates
   */
  @Get()
  async findAll(@Query('industry') industry?: string, @Query('default') isDefault?: string) {
    if (industry) {
      this.logger.log(`Solicitud de plantillas de seguridad por industria: ${industry}`);
      return this.securityTemplateService.findByIndustry(industry);
    }

    if (isDefault === 'true') {
      this.logger.log('Solicitud de plantillas de seguridad predeterminadas');
      return this.securityTemplateService.findDefaultTemplates();
    }

    this.logger.log('Solicitud de todas las plantillas de seguridad');
    return this.securityTemplateService.findAll();
  }

  /**
   * Obtiene una plantilla de seguridad por ID
   * @GET /api/security-templates/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Solicitud de plantilla de seguridad por ID: ${id}`);
    return this.securityTemplateService.findById(id);
  }

  /**
   * Actualiza una plantilla de seguridad (solo admin)
   * @PUT /api/security-templates/:id
   */
  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateDto: UpdateSecurityTemplateDto) {
    this.logger.log(`Solicitud de actualización de plantilla de seguridad: ${id}`);
    return this.securityTemplateService.update(id, updateDto);
  }

  /**
   * Elimina una plantilla de seguridad (solo admin)
   * @DELETE /api/security-templates/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    this.logger.log(`Solicitud de eliminación de plantilla de seguridad: ${id}`);
    await this.securityTemplateService.remove(id);
  }
}