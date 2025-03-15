import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityTemplate } from './security-template.entity';
import { CreateSecurityTemplateDto } from './dto/create-security-template.dto';
import { UpdateSecurityTemplateDto } from './dto/update-security-template.dto';
import { Logger } from '../../common/services/logger.service';
import { createEntityNotFoundException } from '../../common/utils/error.utils';

@Injectable()
export class SecurityTemplateService implements OnModuleInit {
  private readonly logger = new Logger(SecurityTemplateService.name);

  constructor(
    @InjectRepository(SecurityTemplate)
    private readonly securityTemplateRepository: Repository<SecurityTemplate>,
  ) {}

  /**
   * Al iniciar el módulo, carga las plantillas predeterminadas si no existen
   */
  async onModuleInit() {
    const count = await this.securityTemplateRepository.count();
    if (count === 0) {
      this.logger.log('Cargando plantillas de seguridad predeterminadas...');
      await this.loadDefaultTemplates();
      this.logger.log('Plantillas de seguridad predeterminadas cargadas');
    }
  }

  /**
   * Carga las plantillas predeterminadas en la base de datos
   */
  private async loadDefaultTemplates() {
    const defaultTemplates = [
      {
        name: 'Empresa de Desarrollo de Software',
        industry: 'Tecnología',
        description: 'Plantilla para empresas dedicadas al desarrollo de software y aplicaciones',
        isDefault: true,
        template: {
          informationAssets: [
            'Código fuente',
            'Repositorios de código',
            'Credenciales de clientes',
            'Documentación técnica',
            'Propiedad intelectual',
            'Servidores de desarrollo',
            'Entornos de pruebas'
          ],
          threats: [
            'Robo de código',
            'Inyección de código malicioso',
            'Exposición de credenciales',
            'Ataques de ingeniería social',
            'Pérdida de propiedad intelectual'
          ],
          vulnerabilities: [
            'Gestión inadecuada de repositorios',
            'Falta de revisión de código',
            'Almacenamiento inseguro de credenciales',
            'Falta de concienciación en seguridad',
            'Control de acceso insuficiente'
          ],
          existingMeasures: [
            'Control de acceso a repositorios',
            'Firewalls',
            'Antivirus',
            'Autenticación de dos factores',
            'Revisiones de código'
          ]
        }
      },
      {
        name: 'Servicio Online / E-commerce',
        industry: 'Comercio electrónico',
        description: 'Plantilla para tiendas online y plataformas de comercio electrónico',
        isDefault: true,
        template: {
          informationAssets: [
            'Base de datos de clientes',
            'Información de tarjetas de pago',
            'Sitio web',
            'Plataforma de procesamiento de pagos',
            'Catálogo de productos',
            'Análisis de mercado'
          ],
          threats: [
            'Violación de datos personales',
            'Fraude de tarjetas',
            'Ataques DDoS',
            'Inyección SQL',
            'Suplantación de identidad (phishing)'
          ],
          vulnerabilities: [
            'Cifrado insuficiente',
            'Validación de entrada inadecuada',
            'Capacidad limitada de infraestructura',
            'Controles de acceso inadecuados',
            'Falta de parches de seguridad'
          ],
          existingMeasures: [
            'Cifrado de datos sensibles',
            'Firewall de aplicaciones web',
            'Capacidad de escalado en la nube',
            'Auditorías de seguridad periódicas',
            'Cumplimiento PCI-DSS'
          ]
        }
      },
      {
        name: 'Consultoría / Servicios Profesionales',
        industry: 'Servicios profesionales',
        description: 'Plantilla para empresas de consultoría y servicios profesionales',
        isDefault: true,
        template: {
          informationAssets: [
            'Datos confidenciales de clientes',
            'Informes y análisis',
            'Correos electrónicos profesionales',
            'Documentos contractuales',
            'Metodologías propietarias'
          ],
          threats: [
            'Pérdida de confidencialidad',
            'Ataques dirigidos',
            'Suplantación de identidad',
            'Pérdida de dispositivos',
            'Filtraciones internas'
          ],
          vulnerabilities: [
            'Falta de políticas de confidencialidad',
            'Seguridad deficiente en comunicaciones',
            'Falta de concienciación en seguridad',
            'Gestión inadecuada de dispositivos móviles',
            'Controles de acceso inadecuados'
          ],
          existingMeasures: [
            'Acuerdos de confidencialidad',
            'Cifrado de comunicaciones',
            'Formación en seguridad',
            'Gestión de dispositivos móviles',
            'Autenticación multifactor'
          ]
        }
      },
      {
        name: 'Pequeño Negocio (Genérica)',
        industry: 'General',
        description: 'Plantilla genérica para pequeños negocios de cualquier sector',
        isDefault: true,
        template: {
          informationAssets: [
            'Datos de clientes',
            'Información financiera',
            'Correos electrónicos',
            'Documentos administrativos',
            'Ordenadores y dispositivos móviles'
          ],
          threats: [
            'Malware',
            'Robo de dispositivos',
            'Phishing',
            'Pérdida de datos',
            'Acceso no autorizado'
          ],
          vulnerabilities: [
            'Falta de copias de seguridad',
            'Falta de actualizaciones',
            'Contraseñas débiles',
            'Falta de cifrado',
            'Ausencia de controles básicos'
          ],
          existingMeasures: [
            'Antivirus',
            'Contraseñas',
            'Copia de seguridad básica',
            'Firewall básico',
            'Bloqueo de dispositivos'
          ]
        }
      }
    ];

    for (const template of defaultTemplates) {
      await this.securityTemplateRepository.save(this.securityTemplateRepository.create(template));
    }
  }

  /**
   * Crea una nueva plantilla de seguridad
   */
  async create(createDto: CreateSecurityTemplateDto): Promise<SecurityTemplate> {
    const template = this.securityTemplateRepository.create(createDto);
    const savedTemplate = await this.securityTemplateRepository.save(template);
    
    this.logger.log(`Plantilla de seguridad creada: ${savedTemplate.name}`);
    
    return savedTemplate;
  }

  /**
   * Encuentra todas las plantillas de seguridad
   */
  async findAll(): Promise<SecurityTemplate[]> {
    return this.securityTemplateRepository.find({
      order: { industry: 'ASC', name: 'ASC' }
    });
  }

  /**
   * Encuentra todas las plantillas predeterminadas
   */
  async findDefaultTemplates(): Promise<SecurityTemplate[]> {
    return this.securityTemplateRepository.find({
      where: { isDefault: true },
      order: { industry: 'ASC', name: 'ASC' }
    });
  }

  /**
   * Encuentra las plantillas por industria
   */
  async findByIndustry(industry: string): Promise<SecurityTemplate[]> {
    return this.securityTemplateRepository.find({
      where: { industry },
      order: { name: 'ASC' }
    });
  }

  /**
   * Encuentra una plantilla por su ID
   */
  async findById(id: string): Promise<SecurityTemplate> {
    const template = await this.securityTemplateRepository.findOne({ where: { id } });
    
    if (!template) {
      this.logger.warn(`Plantilla de seguridad con ID ${id} no encontrada`);
    }
    
    return template;
  }

  /**
   * Actualiza una plantilla existente
   */
  async update(id: string, updateDto: UpdateSecurityTemplateDto): Promise<SecurityTemplate> {
    const template = await this.findById(id);
    
    if (!template) {
      throw createEntityNotFoundException('Plantilla de seguridad', id);
    }
    
    Object.assign(template, updateDto);
    const updatedTemplate = await this.securityTemplateRepository.save(template);
    
    this.logger.log(`Plantilla de seguridad actualizada: ${updatedTemplate.name}`);
    
    return updatedTemplate;
  }

  /**
   * Elimina una plantilla
   */
  async remove(id: string): Promise<void> {
    const template = await this.findById(id);
    
    if (!template) {
      throw createEntityNotFoundException('Plantilla de seguridad', id);
    }
    
    // No permitir eliminar plantillas predeterminadas
    if (template.isDefault) {
      throw new Error('No se pueden eliminar plantillas predeterminadas');
    }
    
    await this.securityTemplateRepository.remove(template);
    
    this.logger.log(`Plantilla de seguridad eliminada: ${template.name}`);
  }
}