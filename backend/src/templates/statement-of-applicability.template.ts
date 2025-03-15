import { formatDateToHuman } from '../common/utils/date.utils';

/**
 * Genera el contenido del documento de Declaración de Aplicabilidad (SoA)
 */
export const generateStatementOfApplicabilityTemplate = (company: any, params: any = {}): string => {
  const date = formatDateToHuman(new Date());
  
  // Controles seleccionados o por defecto todos aplicables
  const controls = params.controls || generateDefaultControls();
  
  return `
# DECLARACIÓN DE APLICABILIDAD (SoA)

## Información del Documento
- **Organización:** ${company.name}
- **Fecha de Creación:** ${date}
- **Versión:** 1.0

## 1. Introducción

Este documento constituye la Declaración de Aplicabilidad (SoA) para el Sistema de Gestión de Seguridad de la Información (SGSI) de ${company.name}, identificando los controles aplicables de acuerdo con el Anexo A de la norma ISO/IEC 27001:2013.

## 2. Objetivo

Los objetivos de este documento son:
- Identificar los controles de seguridad aplicables a ${company.name}
- Justificar la inclusión o exclusión de los controles del Anexo A de ISO 27001:2013
- Documentar el estado de implementación de cada control aplicable
- Servir como referencia para la implementación y mejora del SGSI

## 3. Metodología

La selección de controles se ha realizado considerando:
- Los resultados de la evaluación de riesgos
- Los requisitos legales, regulatorios y contractuales aplicables
- Las prácticas de la industria
- Los objetivos de negocio y de seguridad de la información

## 4. Leyenda

Aplicabilidad:
- **Aplica:** El control es aplicable y debe ser implementado
- **No Aplica:** El control no es aplicable debido a la naturaleza del negocio o del alcance del SGSI

Estado de Implementación:
- **Implementado:** El control está completamente implementado
- **Parcialmente Implementado:** El control está parcialmente implementado
- **Planificado:** El control está planificado para implementación futura
- **No Implementado:** El control no está implementado

## 5. Declaración de Aplicabilidad

${generateControlsTable(controls)}

## 6. Controles Excluidos

${generateExcludedControls(controls)}

## 7. Conclusiones

Esta Declaración de Aplicabilidad será revisada y actualizada:
- Al menos una vez al año
- Después de cambios significativos en la organización
- Después de revisiones de la evaluación de riesgos
- Después de incidentes de seguridad significativos

## 8. Aprobación

Aprobado por:
Nombre: ________________________
Cargo: _________________________
Fecha: _________________________
Firma: _________________________
`;
};

/**
 * Genera una tabla de controles formateada
 */
function generateControlsTable(controls: any[]): string {
  let table = `| ID | Control | Aplicabilidad | Estado | Justificación |\n`;
  table += `| --- | --- | --- | --- | --- |\n`;
  
  // Filtrar solo los controles aplicables
  const applicableControls = controls.filter(control => control.applicable === 'Aplica');
  
  applicableControls.forEach(control => {
    table += `| ${control.id} | ${control.name} | ${control.applicable} | ${control.status} | ${control.justification} |\n`;
  });
  
  return table;
}

/**
 * Genera un listado de controles excluidos formateado
 */
function generateExcludedControls(controls: any[]): string {
  // Filtrar solo los controles no aplicables
  const excludedControls = controls.filter(control => control.applicable === 'No Aplica');
  
  if (excludedControls.length === 0) {
    return 'No hay controles excluidos. Todos los controles del Anexo A de ISO 27001:2013 son aplicables a la organización.';
  }
  
  let excluded = '';
  excludedControls.forEach(control => {
    excluded += `**${control.id} - ${control.name}**\n`;
    excluded += `Justificación: ${control.justification}\n\n`;
  });
  
  return excluded;
}

/**
 * Genera una lista de controles de ejemplo basados en ISO 27001:2013
 */
function generateDefaultControls(): any[] {
  return [
    {
      id: 'A.5.1.1',
      name: 'Políticas para la seguridad de la información',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para proporcionar dirección y apoyo para la seguridad de la información',
    },
    {
      id: 'A.5.1.2',
      name: 'Revisión de las políticas para la seguridad de la información',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para mantener la idoneidad y eficacia de las políticas',
    },
    {
      id: 'A.6.1.1',
      name: 'Roles y responsabilidades de seguridad',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para establecer un marco de gestión claro',
    },
    {
      id: 'A.6.1.2',
      name: 'Segregación de funciones',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para prevenir actividades no autorizadas',
    },
    {
      id: 'A.6.1.3',
      name: 'Contacto con las autoridades',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para cumplimiento legal y gestión de incidentes',
    },
    {
      id: 'A.6.1.4',
      name: 'Contacto con grupos de interés especial',
      applicable: 'Aplica',
      status: 'No Implementado',
      justification: 'Necesario para mantenerse actualizado en seguridad',
    },
    {
      id: 'A.6.1.5',
      name: 'Seguridad de la información en la gestión de proyectos',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para integrar seguridad desde el diseño',
    },
    {
      id: 'A.6.2.1',
      name: 'Política de dispositivos móviles',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Se utilizan dispositivos móviles para acceder a información corporativa',
    },
    {
      id: 'A.6.2.2',
      name: 'Teletrabajo',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'La organización permite el teletrabajo',
    },
    {
      id: 'A.7.1.1',
      name: 'Investigación de antecedentes',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para verificar candidatos a empleo',
    },
    {
      id: 'A.7.1.2',
      name: 'Términos y condiciones de empleo',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para establecer responsabilidades de seguridad',
    },
    {
      id: 'A.7.2.1',
      name: 'Responsabilidades de la dirección',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para asegurar cumplimiento de políticas',
    },
    {
      id: 'A.7.2.2',
      name: 'Concienciación, educación y capacitación en seguridad de la información',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para asegurar conocimiento de responsabilidades',
    },
    {
      id: 'A.7.2.3',
      name: 'Proceso disciplinario',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para tratar incumplimientos de seguridad',
    },
    {
      id: 'A.7.3.1',
      name: 'Terminación o cambio de responsabilidades de empleo',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para proteger intereses durante cambios de personal',
    },
    {
      id: 'A.8.1.1',
      name: 'Inventario de activos',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para identificar activos que requieren protección',
    },
    {
      id: 'A.8.1.2',
      name: 'Propiedad de los activos',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para asignar responsabilidad de los activos',
    },
    {
      id: 'A.8.1.3',
      name: 'Uso aceptable de los activos',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para establecer reglas de uso de activos',
    },
    {
      id: 'A.8.1.4',
      name: 'Devolución de activos',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para recuperar activos al terminar empleo',
    },
    {
      id: 'A.8.2.1',
      name: 'Clasificación de la información',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para asegurar protección adecuada',
    },
    {
      id: 'A.8.2.2',
      name: 'Etiquetado de la información',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para facilitar el manejo de información',
    },
    {
      id: 'A.8.2.3',
      name: 'Manipulación de activos',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para prevenir divulgación no autorizada',
    },
    {
      id: 'A.8.3.1',
      name: 'Gestión de medios removibles',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Se utilizan medios removibles en la organización',
    },
    {
      id: 'A.8.3.2',
      name: 'Eliminación de medios',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para prevenir divulgación no autorizada',
    },
    {
      id: 'A.8.3.3',
      name: 'Transferencia de medios físicos',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para prevenir acceso no autorizado durante transporte',
    },
    {
      id: 'A.9.1.1',
      name: 'Política de control de acceso',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para limitar acceso a información',
    },
    {
      id: 'A.9.1.2',
      name: 'Acceso a redes y servicios de red',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para prevenir acceso no autorizado a redes',
    },
    {
      id: 'A.9.2.1',
      name: 'Registro y baja de usuarios',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para asegurar acceso autorizado',
    },
    {
      id: 'A.9.2.2',
      name: 'Provisión de acceso de usuarios',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para asignar derechos de acceso',
    },
    {
      id: 'A.9.2.3',
      name: 'Gestión de privilegios de acceso',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para controlar asignación de privilegios',
    },
    {
      id: 'A.9.2.4',
      name: 'Gestión de información secreta de autenticación de usuarios',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para asegurar contraseñas y credenciales',
    },
    {
      id: 'A.9.2.5',
      name: 'Revisión de derechos de acceso de usuarios',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para mantener control de acceso actualizado',
    },
    {
      id: 'A.9.2.6',
      name: 'Retiro o ajuste de derechos de acceso',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario cuando cambia el estado de los usuarios',
    },
    {
      id: 'A.9.4.1',
      name: 'Restricción de acceso a la información',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para prevenir acceso no autorizado',
    },
    // Se han omitido muchos controles para brevedad
    {
      id: 'A.18.1.1',
      name: 'Identificación de legislación aplicable y requisitos contractuales',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para cumplimiento legal y contractual',
    },
    {
      id: 'A.18.1.2',
      name: 'Derechos de propiedad intelectual',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para proteger propiedad intelectual',
    },
    {
      id: 'A.18.1.3',
      name: 'Protección de registros',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para prevenir pérdida o falsificación',
    },
    {
      id: 'A.18.1.4',
      name: 'Privacidad y protección de datos personales',
      applicable: 'Aplica',
      status: 'Implementado',
      justification: 'Necesario para cumplir con RGPD y otras leyes',
    },
    {
      id: 'A.18.1.5',
      name: 'Regulación de controles criptográficos',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para cumplir con regulaciones',
    },
    {
      id: 'A.18.2.1',
      name: 'Revisión independiente de la seguridad de la información',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para verificar implementación adecuada',
    },
    {
      id: 'A.18.2.2',
      name: 'Cumplimiento de políticas y normas de seguridad',
      applicable: 'Aplica',
      status: 'Parcialmente Implementado',
      justification: 'Necesario para verificar cumplimiento interno',
    },
    {
      id: 'A.18.2.3',
      name: 'Verificación del cumplimiento técnico',
      applicable: 'Aplica',
      status: 'Planificado',
      justification: 'Necesario para verificar configuraciones',
    },
  ];
}