import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { mdToPdf } from 'md-to-pdf';
import { Document, DocumentType, DocumentStatus } from './document.entity';
import { CompanyService } from '../companies/company.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';
import { Logger } from '../../common/services/logger.service';
import { AIInferenceService } from './services/ai-inference.service';
import { generateISMSScopeTemplate } from '../../templates/isms-scope.template';
import { generateSecurityPolicyTemplate } from '../../templates/security-policy.template';
import { generateRiskAssessmentTemplate } from '../../templates/risk-assessment.template';
import { generateStatementOfApplicabilityTemplate } from '../../templates/statement-of-applicability.template';
import { createEntityNotFoundException } from '../../common/utils/error.utils';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly companyService: CompanyService,
    private readonly aiInferenceService: AIInferenceService,
  ) {
    // Asegurar que el directorio de uploads existe
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Genera un nuevo documento para una empresa
   */
  async generateDocument(userId: string, dto: GenerateDocumentDto): Promise<Document> {
    // Verificar que la empresa existe y pertenece al usuario
    const company = await this.companyService.findById(dto.companyId);
    
    if (!company) {
      throw createEntityNotFoundException('Empresa', dto.companyId);
    }
    
    if (company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó generar documento para empresa ${dto.companyId} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para generar documentos para esta empresa');
    }
    
    // Si es un documento de evaluación de riesgos y no hay escenarios, generarlos
    if (dto.type === DocumentType.RISK_ASSESSMENT && 
        (!company.riskScenarios || company.riskScenarios.length === 0)) {
      await this.companyService.updateRiskScenarios(company.id);
      
      // Recargar la empresa para obtener los escenarios generados
      const updatedCompany = await this.companyService.findById(dto.companyId);
      if (updatedCompany) {
        company.riskScenarios = updatedCompany.riskScenarios;
      }
    }
    
    // Enriquecer los parámetros del documento con los escenarios de riesgo almacenados
    const enrichedParams = {
      ...dto.parameters,
      riskScenarios: company.riskScenarios || []
    };
    
    // Generar contenido según el tipo de documento
    let content = '';
    
    switch (dto.type) {
      case DocumentType.ISMS_SCOPE:
        content = generateISMSScopeTemplate(company, enrichedParams);
        break;
      case DocumentType.SECURITY_POLICY:
        content = generateSecurityPolicyTemplate(company, enrichedParams);
        break;
      case DocumentType.RISK_ASSESSMENT:
        content = generateRiskAssessmentTemplate(company, enrichedParams);
        break;
      case DocumentType.STATEMENT_OF_APPLICABILITY:
        content = generateStatementOfApplicabilityTemplate(company, enrichedParams);
        break;
      default:
        content = 'Tipo de documento no soportado';
    }
    
    // Generar documento PDF
    const fileName = `${dto.name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
    const filePath = path.join(this.uploadsDir, fileName);
    
    await this.generatePDF(content, filePath);
    
    const fileSize = fs.statSync(filePath).size;
    
    // Crear registro de documento en la base de datos
    const document = this.documentRepository.create({
      name: dto.name,
      type: dto.type,
      status: DocumentStatus.DRAFT,
      description: dto.description,
      content: content,
      filePath: fileName,
      fileSize: fileSize,
      metadata: dto.parameters || {},
      version: 1,
      company: { id: dto.companyId },
      createdBy: { id: userId },
    });
    
    const savedDocument = await this.documentRepository.save(document);
    
    this.logger.log(`Documento generado: ${savedDocument.name} para empresa ${company.name}`);
    
    return savedDocument;
  }

  /**
   * Genera un archivo PDF a partir del contenido Markdown usando md-to-pdf
   */
  private async generatePDF(content: string, filePath: string): Promise<void> {
    try {
      // Configuración para md-to-pdf con opciones de Puppeteer para deshabilitar el sandbox
      // Esto es necesario cuando se ejecuta en Docker como root
      await mdToPdf(
        { content }, 
        { 
          dest: filePath,
          launch_options: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          }
        }
      );
      
      this.logger.log(`PDF generado con éxito en: ${filePath}`);
    } catch (error) {
      this.logger.error(`Error al generar PDF: ${error.message}`);
      throw error;
    }
  }

  /**
   * Encuentra todos los documentos de una empresa
   */
  async findAllByCompany(companyId: string, userId: string): Promise<Document[]> {
    // Verificar que la empresa existe y pertenece al usuario
    const company = await this.companyService.findById(companyId);
    
    if (!company) {
      throw createEntityNotFoundException('Empresa', companyId);
    }
    
    if (company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó acceder a documentos de empresa ${companyId} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para acceder a documentos de esta empresa');
    }
    
    const documents = await this.documentRepository.find({
      where: { company: { id: companyId } },
      order: { createdAt: 'DESC' },
    });
    
    this.logger.debug(`Encontrados ${documents.length} documentos para empresa ${companyId}`);
    
    return documents;
  }

  /**
   * Encuentra un documento por su ID
   */
  async findById(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ 
      where: { id },
      relations: ['company', 'company.user', 'createdBy'],
    });
    
    if (!document) {
      this.logger.warn(`Documento con ID ${id} no encontrado`);
    }
    
    return document;
  }

  /**
   * Obtiene la ruta de archivo de un documento
   */
  async getDocumentFilePath(id: string, userId: string): Promise<string> {
    const document = await this.findById(id);
    
    if (!document) {
      throw createEntityNotFoundException('Documento', id);
    }
    
    // Verificar que el documento pertenece a una empresa del usuario
    if (document.company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó acceder al archivo del documento ${id} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para acceder a este documento');
    }
    
    const filePath = path.join(this.uploadsDir, document.filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Archivo de documento no encontrado');
    }
    
    return filePath;
  }

  /**
   * Elimina un documento
   */
  async remove(id: string, userId: string): Promise<void> {
    const document = await this.findById(id);
    
    if (!document) {
      throw createEntityNotFoundException('Documento', id);
    }
    
    // Verificar que el documento pertenece a una empresa del usuario
    if (document.company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó eliminar documento ${id} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para eliminar este documento');
    }
    
    // Eliminar archivo físico
    const filePath = path.join(this.uploadsDir, document.filePath);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Eliminar registro de base de datos
    await this.documentRepository.remove(document);
    
    this.logger.log(`Documento eliminado: ${document.name}`);
  }

  /**
   * Encuentra todos los documentos (solo para administradores)
   */
  async findAll(): Promise<Document[]> {
    return this.documentRepository.find({
      relations: ['company', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }
}