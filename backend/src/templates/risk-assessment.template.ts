import { formatDateToHuman } from '../common/utils/date.utils';

/**
 * Genera el contenido del documento de Evaluación de Riesgos
 */
export const generateRiskAssessmentTemplate = (company: any, params: any = {}): string => {
  const date = formatDateToHuman(new Date());
  
  // Extraer activos, amenazas y vulnerabilidades de la empresa
  const assets = company.securityInfo?.informationAssets || [];
  const threats = company.securityInfo?.threats || [];
  const vulnerabilities = company.securityInfo?.vulnerabilities || [];
  const existingMeasures = company.securityInfo?.existingMeasures || [];
  
  // Usar escenarios de riesgo inferidos si están disponibles, o generar ejemplos
  const risks = params.riskScenarios || generateSampleRisks(assets, threats, vulnerabilities);
  
  return `
  <style>
table {
  width: 100%;
}
td, th {
  word-wrap: break-word;
}
</style>
# EVALUACIÓN DE RIESGOS DE SEGURIDAD DE LA INFORMACIÓN

## Información del Documento
- **Organización:** ${company.name}
- **Fecha de Creación:** ${date}
- **Versión:** 1.0

## 1. Introducción

Este documento presenta los resultados de la evaluación de riesgos de seguridad de la información para ${company.name}, identificando y analizando los riesgos que podrían afectar a los activos de información de la organización.

## 2. Metodología

La metodología utilizada para la evaluación de riesgos se basa en la norma ISO 27005 e incluye los siguientes pasos:
1. Identificación de activos de información
2. Identificación de amenazas y vulnerabilidades
3. Evaluación de probabilidad e impacto
4. Determinación del nivel de riesgo
5. Tratamiento de riesgos

## 3. Criterios de Evaluación

### 3.1 Niveles de Probabilidad
- **Alto (3):** Es probable que ocurra múltiples veces en un período de 12 meses
- **Medio (2):** Es probable que ocurra al menos una vez en un período de 12 meses
- **Bajo (1):** Es poco probable que ocurra en un período de 12 meses

### 3.2 Niveles de Impacto
- **Alto (3):** Impacto significativo en la operación, finanzas o reputación
- **Medio (2):** Impacto moderado en la operación, finanzas o reputación
- **Bajo (1):** Impacto mínimo en la operación, finanzas o reputación

### 3.3 Matriz de Riesgo
- **Alto (7-9):** Requiere atención inmediata y controles robustos
- **Medio (4-6):** Requiere medidas de mitigación planificadas
- **Bajo (1-3):** Puede ser aceptable con monitoreo

## 4. Inventario de Activos de Información

${generateAssetsList(assets)}

## 5. Amenazas Identificadas

${generateThreatsList(threats)}

## 6. Vulnerabilidades Identificadas

${generateVulnerabilitiesList(vulnerabilities)}

## 7. Controles Existentes

${generateExistingControlsList(existingMeasures)}

## 8. Análisis de Riesgos

${generateRisksTable(risks)}

## 9. Plan de Tratamiento de Riesgos

${generateRiskTreatmentPlan(risks)}

## 10. Conclusiones y Recomendaciones

Basado en la evaluación de riesgos realizada, se recomienda:

1. Priorizar la implementación de controles para los riesgos de nivel alto
2. Establecer un cronograma para la implementación de controles para riesgos de nivel medio
3. Monitorear los riesgos de nivel bajo
4. Revisar y actualizar esta evaluación de riesgos al menos una vez al año
5. Capacitar al personal en concienciación de seguridad

## 11. Aprobación

Aprobado por:
Nombre: ________________________
Cargo: _________________________
Fecha: _________________________
Firma: _________________________
`;
};

/**
 * Genera un listado de activos formateado
 */
function generateAssetsList(assets: string[]): string {
  if (assets.length === 0) {
    return `Los siguientes activos de información han sido identificados:
- Servidores de bases de datos
- Aplicaciones de negocio
- Información de clientes
- Propiedad intelectual
- Información financiera
- Estaciones de trabajo
- Dispositivos móviles corporativos
- Infraestructura de red`;
  }
  
  return `Los siguientes activos de información han sido identificados:
${assets.map(asset => `- ${asset}`).join('\n')}`;
}

/**
 * Genera un listado de amenazas formateado
 */
function generateThreatsList(threats: string[]): string {
  if (threats.length === 0) {
    return `Las siguientes amenazas han sido identificadas:
- Malware (virus, ransomware, spyware)
- Ataques de phishing
- Acceso no autorizado
- Fuga de información
- Denegación de servicio
- Desastres naturales
- Fallo de suministro eléctrico
- Error humano`;
  }
  
  return `Las siguientes amenazas han sido identificadas:
${threats.map(threat => `- ${threat}`).join('\n')}`;
}

/**
 * Genera un listado de vulnerabilidades formateado
 */
function generateVulnerabilitiesList(vulnerabilities: string[]): string {
  if (vulnerabilities.length === 0) {
    return `Las siguientes vulnerabilidades han sido identificadas:
- Software desactualizado
- Contraseñas débiles
- Falta de concienciación en seguridad
- Configuraciones incorrectas
- Falta de cifrado
- Control de acceso inadecuado
- Falta de mecanismos de detección de intrusiones
- Falta de copias de seguridad`;
  }
  
  return `Las siguientes vulnerabilidades han sido identificadas:
${vulnerabilities.map(vulnerability => `- ${vulnerability}`).join('\n')}`;
}

/**
 * Genera un listado de controles existentes formateado
 */
function generateExistingControlsList(existingControls: string[]): string {
  if (existingControls.length === 0) {
    return `Los siguientes controles ya están implementados:
- Antivirus/Antimalware
- Firewall
- Copias de seguridad
- Control de acceso básico
- Actualizaciones de seguridad
- Políticas de seguridad básicas`;
  }
  
  return `Los siguientes controles ya están implementados:
${existingControls.map(control => `- ${control}`).join('\n')}`;
}

/**
 * Genera una tabla de riesgos formateada
 */
function generateRisksTable(risks: any[]): string {
  let table = `| ID | Act. | Ame. | Vul. | Pro. | Imp. | Rie. |\n`;
  table += `| --- | --- | --- | --- | --- | --- | --- |\n`;
  
  risks.forEach(risk => {
    table += `| ${risk.id} | ${risk.asset} | ${risk.threat} | ${risk.vulnerability} | ${risk.probability} | ${risk.impact} | ${risk.riskLevel} |\n`;
  });
  
  return table;
}

/**
 * Genera un plan de tratamiento de riesgos formateado
 */
function generateRiskTreatmentPlan(risks: any[]): string {
  let plan = '';
  
  // Filtrar riesgos por nivel
  const highRisks = risks.filter(risk => risk.riskLevel === 'Alto');
  const mediumRisks = risks.filter(risk => risk.riskLevel === 'Medio');
  const lowRisks = risks.filter(risk => risk.riskLevel === 'Bajo');
  
  if (highRisks.length > 0) {
    plan += `### Riesgos de Nivel Alto (Prioridad Inmediata)\n\n`;
    highRisks.forEach(risk => {
      plan += `**Riesgo ${risk.id}:** ${risk.asset} - ${risk.threat}\n`;
      plan += `- **Opción de tratamiento:** Mitigar\n`;
      plan += `- **Controles recomendados:** ${risk.controls.join(', ')}\n`;
      plan += `- **Responsable:** [A definir]\n`;
      plan += `- **Fecha límite:** [A definir]\n\n`;
    });
  }
  
  if (mediumRisks.length > 0) {
    plan += `### Riesgos de Nivel Medio (Planificación a Corto Plazo)\n\n`;
    mediumRisks.forEach(risk => {
      plan += `**Riesgo ${risk.id}:** ${risk.asset} - ${risk.threat}\n`;
      plan += `- **Opción de tratamiento:** Mitigar\n`;
      plan += `- **Controles recomendados:** ${risk.controls.join(', ')}\n`;
      plan += `- **Responsable:** [A definir]\n`;
      plan += `- **Fecha límite:** [A definir]\n\n`;
    });
  }
  
  if (lowRisks.length > 0) {
    plan += `### Riesgos de Nivel Bajo (Monitoreo)\n\n`;
    lowRisks.forEach(risk => {
      plan += `**Riesgo ${risk.id}:** ${risk.asset} - ${risk.threat}\n`;
      plan += `- **Opción de tratamiento:** Aceptar/Monitorear\n`;
      plan += `- **Controles adicionales (opcional):** ${risk.controls.join(', ')}\n`;
      plan += `- **Responsable:** [A definir]\n\n`;
    });
  }
  
  return plan;
}

/**
 * Genera una lista de riesgos de ejemplo basados en los activos, amenazas y vulnerabilidades
 * Esta función se usa solo como fallback si no hay escenarios inferidos
 */
function generateSampleRisks(assets: string[], threats: string[], vulnerabilities: string[]): any[] {
  const defaultAssets = [
    'Servidores de bases de datos',
    'Aplicaciones de negocio',
    'Información de clientes',
    'Propiedad intelectual',
    'Información financiera',
    'Estaciones de trabajo',
    'Dispositivos móviles corporativos',
    'Infraestructura de red',
  ];
  
  const defaultThreats = [
    'Malware (virus, ransomware, spyware)',
    'Ataques de phishing',
    'Acceso no autorizado',
    'Fuga de información',
    'Denegación de servicio',
    'Desastres naturales',
    'Fallo de suministro eléctrico',
    'Error humano',
  ];
  
  const defaultVulnerabilities = [
    'Software desactualizado',
    'Contraseñas débiles',
    'Falta de concienciación en seguridad',
    'Configuraciones incorrectas',
    'Falta de cifrado',
    'Control de acceso inadecuado',
    'Falta de mecanismos de detección de intrusiones',
    'Falta de copias de seguridad',
  ];
  
  const assetsList = assets.length > 0 ? assets : defaultAssets;
  const threatsList = threats.length > 0 ? threats : defaultThreats;
  const vulnerabilitiesList = vulnerabilities.length > 0 ? vulnerabilities : defaultVulnerabilities;
  
  const risks = [
    {
      id: 'R01',
      asset: assetsList[0] || defaultAssets[0],
      threat: threatsList[0] || defaultThreats[0],
      vulnerability: vulnerabilitiesList[0] || defaultVulnerabilities[0],
      probability: 'Alto',
      impact: 'Alto',
      riskLevel: 'Alto',
      controls: [
        'Implementar solución antimalware avanzada',
        'Actualizar regularmente el sistema operativo y aplicaciones',
        'Realizar escaneos de vulnerabilidades periódicos',
      ],
    },
    {
      id: 'R02',
      asset: assetsList[1] || defaultAssets[1],
      threat: threatsList[1] || defaultThreats[1],
      vulnerability: vulnerabilitiesList[2] || defaultVulnerabilities[2],
      probability: 'Alto',
      impact: 'Alto',
      riskLevel: 'Alto',
      controls: [
        'Implementar programa de concienciación en seguridad',
        'Utilizar filtrado de correo avanzado',
        'Implementar autenticación multifactor',
      ],
    },
    {
      id: 'R03',
      asset: assetsList[2] || defaultAssets[2],
      threat: threatsList[2] || defaultThreats[2],
      vulnerability: vulnerabilitiesList[1] || defaultVulnerabilities[1],
      probability: 'Medio',
      impact: 'Alto',
      riskLevel: 'Alto',
      controls: [
        'Implementar política de contraseñas robustas',
        'Implementar autenticación multifactor',
        'Revisar y actualizar permisos de acceso regularmente',
      ],
    },
    {
      id: 'R04',
      asset: assetsList[3] || defaultAssets[3],
      threat: threatsList[3] || defaultThreats[3],
      vulnerability: vulnerabilitiesList[4] || defaultVulnerabilities[4],
      probability: 'Medio',
      impact: 'Alto',
      riskLevel: 'Alto',
      controls: [
        'Implementar cifrado de datos sensibles',
        'Implementar solución DLP (Prevención de Pérdida de Datos)',
        'Establecer controles de acceso granulares',
      ],
    },
    {
      id: 'R05',
      asset: assetsList[4] || defaultAssets[4],
      threat: threatsList[2] || defaultThreats[2],
      vulnerability: vulnerabilitiesList[5] || defaultVulnerabilities[5],
      probability: 'Medio',
      impact: 'Alto',
      riskLevel: 'Alto',
      controls: [
        'Implementar control de acceso basado en roles',
        'Revisar logs de acceso regularmente',
        'Implementar segregación de funciones',
      ],
    },
    {
      id: 'R06',
      asset: assetsList[7] || defaultAssets[7],
      threat: threatsList[4] || defaultThreats[4],
      vulnerability: vulnerabilitiesList[3] || defaultVulnerabilities[3],
      probability: 'Medio',
      impact: 'Medio',
      riskLevel: 'Medio',
      controls: [
        'Implementar firewall de nueva generación',
        'Configurar segmentación de red',
        'Implementar sistema de detección/prevención de intrusiones',
      ],
    },
    {
      id: 'R07',
      asset: assetsList[0] || defaultAssets[0],
      threat: threatsList[6] || defaultThreats[6],
      vulnerability: vulnerabilitiesList[7] || defaultVulnerabilities[7],
      probability: 'Bajo',
      impact: 'Alto',
      riskLevel: 'Medio',
      controls: [
        'Implementar sistema de alimentación ininterrumpida (UPS)',
        'Establecer procedimiento de copias de seguridad regulares',
        'Implementar plan de continuidad de negocio',
      ],
    },
    {
      id: 'R08',
      asset: assetsList[5] || defaultAssets[5],
      threat: threatsList[7] || defaultThreats[7],
      vulnerability: vulnerabilitiesList[2] || defaultVulnerabilities[2],
      probability: 'Alto',
      impact: 'Bajo',
      riskLevel: 'Medio',
      controls: [
        'Implementar programa de concienciación en seguridad',
        'Establecer procedimientos operativos estándar',
        'Implementar controles técnicos preventivos',
      ],
    },
    {
      id: 'R09',
      asset: assetsList[6] || defaultAssets[6],
      threat: threatsList[3] || defaultThreats[3],
      vulnerability: vulnerabilitiesList[4] || defaultVulnerabilities[4],
      probability: 'Medio',
      impact: 'Bajo',
      riskLevel: 'Bajo',
      controls: [
        'Implementar gestión de dispositivos móviles (MDM)',
        'Implementar cifrado de dispositivos',
        'Establecer política de uso aceptable',
      ],
    },
    {
      id: 'R10',
      asset: assetsList[5] || defaultAssets[5],
      threat: threatsList[5] || defaultThreats[5],
      vulnerability: vulnerabilitiesList[7] || defaultVulnerabilities[7],
      probability: 'Bajo',
      impact: 'Bajo',
      riskLevel: 'Bajo',
      controls: [
        'Establecer procedimiento de copias de seguridad regulares',
        'Desarrollar plan de recuperación ante desastres',
        'Implementar almacenamiento en la nube',
      ],
    },
  ];
  
  return risks;
}