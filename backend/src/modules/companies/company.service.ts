import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { User } from '../users/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Logger } from '../../common/services/logger.service';
import { createEntityNotFoundException } from '../../common/utils/error.utils';
import { SecurityTemplateService } from '../security-templates/security-template.service';
import { AIInferenceService } from '../documents/services/ai-inference.service';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly securityTemplateService: SecurityTemplateService,
    private readonly aiInferenceService: AIInferenceService,
  ) {}

  /**
   * Crea una nueva empresa para un usuario
   */
  async create(userId: string, createCompanyDto: CreateCompanyDto): Promise<Company> {
    // Si se proporciona un ID de plantilla, aplicarla
    if (createCompanyDto.securityTemplateId) {
      await this.applySecurityTemplate(createCompanyDto);
    }
    
    const company = this.companyRepository.create({
      ...createCompanyDto,
      user: { id: userId },
      // Inicializar arrays vacíos si no existen
      securityInfo: createCompanyDto.securityInfo || {
        informationAssets: [],
        threats: [],
        vulnerabilities: [],
        existingMeasures: []
      },
      // Inicializar escenarios de riesgo como array vacío
      riskScenarios: []
    });
    
    // Guardar la empresa
    const savedCompany = await this.companyRepository.save(company);
    
    // Si hay información de seguridad, generar escenarios de riesgo
    if (savedCompany.securityInfo && 
        (savedCompany.securityInfo.informationAssets?.length > 0 ||
         savedCompany.securityInfo.threats?.length > 0 ||
         savedCompany.securityInfo.vulnerabilities?.length > 0)) {
      await this.updateRiskScenarios(savedCompany.id);
    }
    
    this.logger.log(`Empresa creada: ${savedCompany.name} para usuario ${userId}`);
    
    return this.findById(savedCompany.id);
  }

  /**
   * Genera o actualiza los escenarios de riesgo para una empresa
   */
  async updateRiskScenarios(companyId: string): Promise<void> {
    const company = await this.findById(companyId);
    
    if (!company) {
      throw createEntityNotFoundException('Empresa', companyId);
    }
    
    // Si no hay información de seguridad suficiente, no hacer nada
    if (!company.securityInfo || 
        !company.securityInfo.informationAssets?.length ||
        !company.securityInfo.threats?.length ||
        !company.securityInfo.vulnerabilities?.length) {
      this.logger.warn(`No hay suficiente información de seguridad para generar escenarios de riesgo para empresa ${companyId}`);
      return;
    }
    
    try {
      // Generar escenarios de riesgo con IA
      const riskScenarios = await this.aiInferenceService.inferRiskScenarios(company.securityInfo);
      
      // Actualizar la empresa con los nuevos escenarios
      await this.companyRepository.update(companyId, {
        riskScenarios,
        lastRiskInference: new Date()
      });
      
      this.logger.log(`Escenarios de riesgo actualizados para empresa ${companyId}: ${riskScenarios.length} escenarios`);
    } catch (error) {
      this.logger.error(`Error al generar escenarios de riesgo para empresa ${companyId}: ${error.message}`);
    }
  }

  /**
   * Aplica una plantilla de seguridad a los datos de la empresa
   */
  private async applySecurityTemplate(companyDto: CreateCompanyDto | UpdateCompanyDto): Promise<void> {
    const templateId = (companyDto as any).securityTemplateId;
    
    if (!templateId) {
      return;
    }
    
    const template = await this.securityTemplateService.findById(templateId);
    
    if (!template) {
      this.logger.warn(`Plantilla de seguridad con ID ${templateId} no encontrada`);
      return;
    }
    
    // Si no hay información de seguridad, crearla
    if (!companyDto.securityInfo) {
      companyDto.securityInfo = {};
    }
    
    // Aplicar plantilla, manteniendo datos existentes si los hay
    companyDto.securityInfo = {
      informationAssets: companyDto.securityInfo.informationAssets || [],
      threats: companyDto.securityInfo.threats || [],
      vulnerabilities: companyDto.securityInfo.vulnerabilities || [],
      existingMeasures: companyDto.securityInfo.existingMeasures || [],
    };
    
    // Añadir elementos de la plantilla a los arrays existentes, evitando duplicados
    if (template.template.informationAssets) {
      const existing = new Set(companyDto.securityInfo.informationAssets);
      template.template.informationAssets.forEach(asset => existing.add(asset));
      companyDto.securityInfo.informationAssets = Array.from(existing);
    }
    
    if (template.template.threats) {
      const existing = new Set(companyDto.securityInfo.threats);
      template.template.threats.forEach(threat => existing.add(threat));
      companyDto.securityInfo.threats = Array.from(existing);
    }
    
    if (template.template.vulnerabilities) {
      const existing = new Set(companyDto.securityInfo.vulnerabilities);
      template.template.vulnerabilities.forEach(vulnerability => existing.add(vulnerability));
      companyDto.securityInfo.vulnerabilities = Array.from(existing);
    }
    
    if (template.template.existingMeasures) {
      const existing = new Set(companyDto.securityInfo.existingMeasures);
      template.template.existingMeasures.forEach(measure => existing.add(measure));
      companyDto.securityInfo.existingMeasures = Array.from(existing);
    }
    
    this.logger.log(`Plantilla de seguridad aplicada: ${template.name}`);
    
    // Eliminar el ID de la plantilla para que no se guarde en la base de datos
    delete (companyDto as any).securityTemplateId;
  }

  /**
   * Encuentra todas las empresas de un usuario
   */
  async findAllByUser(userId: string): Promise<Company[]> {
    const companies = await this.companyRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    
    this.logger.debug(`Encontradas ${companies.length} empresas para usuario ${userId}`);
    
    return companies;
  }

  /**
   * Encuentra una empresa por su ID
   */
  async findById(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    
    if (!company) {
      this.logger.warn(`Empresa con ID ${id} no encontrada`);
    }
    
    return company;
  }

  /**
   * Actualiza una empresa existente
   */
  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findById(id);
    
    if (!company) {
      throw createEntityNotFoundException('Empresa', id);
    }
    
    // Verificar que la empresa pertenece al usuario
    if (company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó actualizar empresa ${id} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para actualizar esta empresa');
    }
    
    // Si se proporciona un ID de plantilla, aplicarla
    if ((updateCompanyDto as any).securityTemplateId) {
      await this.applySecurityTemplate(updateCompanyDto);
    }
    
    // Verificar si la información de seguridad ha cambiado
    const securityInfoChanged = updateCompanyDto.securityInfo && (
      JSON.stringify(company.securityInfo?.informationAssets) !== JSON.stringify(updateCompanyDto.securityInfo?.informationAssets) ||
      JSON.stringify(company.securityInfo?.threats) !== JSON.stringify(updateCompanyDto.securityInfo?.threats) ||
      JSON.stringify(company.securityInfo?.vulnerabilities) !== JSON.stringify(updateCompanyDto.securityInfo?.vulnerabilities) ||
      JSON.stringify(company.securityInfo?.existingMeasures) !== JSON.stringify(updateCompanyDto.securityInfo?.existingMeasures)
    );
    
    // Actualizar empresa
    Object.assign(company, updateCompanyDto);
    const updatedCompany = await this.companyRepository.save(company);
    
    // Si la información de seguridad cambió, actualizar escenarios de riesgo
    if (securityInfoChanged) {
      await this.updateRiskScenarios(updatedCompany.id);
      // Volver a cargar la empresa para obtener los escenarios actualizados
      return this.findById(updatedCompany.id);
    }
    
    this.logger.log(`Empresa actualizada: ${updatedCompany.name}`);
    
    return updatedCompany;
  }

  /**
   * Elimina una empresa
   */
  async remove(id: string, userId: string): Promise<void> {
    const company = await this.findById(id);
    
    if (!company) {
      throw createEntityNotFoundException('Empresa', id);
    }
    
    // Verificar que la empresa pertenece al usuario
    if (company.user.id !== userId) {
      this.logger.warn(`Usuario ${userId} intentó eliminar empresa ${id} que no le pertenece`);
      throw new ForbiddenException('No tienes permiso para eliminar esta empresa');
    }
    
    await this.companyRepository.remove(company);
    
    this.logger.log(`Empresa eliminada: ${company.name}`);
  }

  /**
   * Encuentra todas las empresas (solo para administradores)
   */
  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}