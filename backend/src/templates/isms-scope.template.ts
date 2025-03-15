import { formatDateToHuman } from '../common/utils/date.utils';

/**
 * Genera el contenido del documento de Alcance del ISMS
 */
export const generateISMSScopeTemplate = (company: any, params: any = {}): string => {
  const date = formatDateToHuman(new Date());
  
  return `
# ALCANCE DEL SISTEMA DE GESTIÓN DE SEGURIDAD DE LA INFORMACIÓN

## Información del Documento
- **Organización:** ${company.name}
- **Fecha de Creación:** ${date}
- **Versión:** 1.0

## 1. Introducción

Este documento define el alcance del Sistema de Gestión de Seguridad de la Información (SGSI) para ${company.name}, estableciendo los límites y la aplicabilidad del SGSI dentro de la organización.

## 2. Descripción de la Organización

${company.description || `${company.name} es una empresa dedicada a ${company.industry || 'su sector'}.`}

**Industria:** ${company.industry || 'No especificada'}
**Ubicación:** ${company.location || 'No especificada'}
**Tamaño:** ${company.size ? `${company.size} empleados` : 'No especificado'}

## 3. Alcance del SGSI

### 3.1 Procesos Incluidos

${params.includedProcesses ? params.includedProcesses.join('\n- ') : `- Todos los procesos de negocio principales
- Gestión de recursos humanos
- Gestión de activos de información
- Gestión de accesos
- Gestión de operaciones de TI
- Gestión de incidentes`}

### 3.2 Ubicaciones Físicas

${params.locations ? params.locations.join('\n- ') : `- Sede principal`}

### 3.3 Sistemas de Información

${params.informationSystems ? params.informationSystems.join('\n- ') : `- Infraestructura de red
- Servidores
- Sistemas de almacenamiento
- Estaciones de trabajo
- Dispositivos móviles corporativos
- Sistemas y aplicaciones de negocio`}

### 3.4 Activos de Información

${company.securityInfo?.informationAssets ? company.securityInfo.informationAssets.map(asset => `- ${asset}`).join('\n') : `- Datos de clientes
- Datos financieros
- Datos de empleados
- Propiedad intelectual
- Documentación técnica
- Registros corporativos`}

## 4. Exclusiones

${params.exclusions ? params.exclusions.join('\n- ') : `- No se incluyen equipos personales de empleados que no estén conectados a la red corporativa
- No se incluyen proveedores externos que no accedan a información sensible de la organización`}

## 5. Requisitos de las Partes Interesadas

${params.stakeholderRequirements ? params.stakeholderRequirements.join('\n- ') : `- Cumplimiento con regulaciones aplicables
- Protección de datos personales
- Mantenimiento de la confidencialidad de la información
- Asegurar la continuidad del negocio
- Protección de la reputación de la organización`}

## 6. Justificación del Alcance

El alcance definido para el SGSI cubre todas las áreas críticas para la protección de la información de ${company.name}, considerando los requisitos de las partes interesadas y el contexto de la organización.

## 7. Aprobación

Aprobado por:
Nombre: ________________________
Cargo: _________________________
Fecha: _________________________
Firma: _________________________
`;
};