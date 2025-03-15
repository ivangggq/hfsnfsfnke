import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DocumentService } from './document.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';
import { User } from '../users/user.entity';
import { Logger } from '../../common/services/logger.service';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {}

  /**
   * Genera un nuevo documento
   * @POST /api/documents
   */
  @Post()
  async generateDocument(
    @CurrentUser() user: User,
    @Body() generateDocumentDto: GenerateDocumentDto,
  ) {
    this.logger.log(`Generación de documento solicitada por usuario: ${user.email}`);
    return this.documentService.generateDocument(user.id, generateDocumentDto);
  }

  /**
   * Obtiene todos los documentos de una empresa
   * @GET /api/documents?companyId=:companyId
   */
  @Get()
  async findAllByCompany(
    @Query('companyId') companyId: string,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`Solicitud de documentos para empresa: ${companyId} por usuario: ${user.email}`);
    return this.documentService.findAllByCompany(companyId, user.id);
  }

  /**
   * Obtiene un documento por ID
   * @GET /api/documents/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Solicitud de documento por ID: ${id} por usuario: ${user.email}`);
    const document = await this.documentService.findById(id);
    
    // Verificar permisos para ver el documento
    if (document && (document.company.user.id === user.id || user.roles.includes('admin'))) {
      return document;
    }
    
    return null;
  }

  /**
   * Descarga un documento
   * @GET /api/documents/:id/download
   */
  @Get(':id/download')
  async downloadDocument(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    this.logger.log(`Descarga de documento por ID: ${id} por usuario: ${user.email}`);
    const filePath = await this.documentService.getDocumentFilePath(id, user.id);
    
    // Obtener información del documento para el nombre del archivo
    const document = await this.documentService.findById(id);
    const fileName = `${document.name.replace(/\s+/g, '_').toLowerCase()}_v${document.version}.pdf`;
    
    res.download(filePath, fileName);
  }

  /**
   * Elimina un documento
   * @DELETE /api/documents/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`Eliminación de documento por ID: ${id} por usuario: ${user.email}`);
    await this.documentService.remove(id, user.id);
  }

  /**
   * Obtiene todos los documentos (solo para administradores)
   * @GET /api/documents/admin/all
   */
  @Get('admin/all')
  @Roles('admin')
  async findAll() {
    this.logger.log('Solicitud de todos los documentos (administrador)');
    return this.documentService.findAll();
  }
}