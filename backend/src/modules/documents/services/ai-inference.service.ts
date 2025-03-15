import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../../common/services/logger.service';
import axios from 'axios';

/**
 * Interfaz para datos de seguridad de una empresa
 */
export interface SecurityInfo {
  informationAssets?: string[];
  threats?: string[];
  vulnerabilities?: string[];
  existingMeasures?: string[];
}

/**
 * Tipos de niveles de riesgo
 */
export type RiskLevel = 'Alto' | 'Medio' | 'Bajo';

/**
 * Interfaz para un escenario de riesgo inferido
 */
export interface InferredRiskScenario {
  id: string;
  asset: string;
  threat: string;
  vulnerability: string;
  probability: RiskLevel;
  impact: RiskLevel;
  riskLevel: RiskLevel;
  controls: string[];
}

/**
 * Matriz de nivel de riesgo tipada
 */
type RiskMatrix = {
  [key in RiskLevel]: {
    [key in RiskLevel]: RiskLevel;
  };
};

/**
 * Servicio de inferencia IA usando OpenAI para generar relaciones entre elementos de seguridad
 */
@Injectable()
export class AIInferenceService {
  private readonly logger = new Logger(AIInferenceService.name);
  private readonly openaiApiKey: string;
  private readonly useOpenAI: boolean = true;

  // Matriz de nivel de riesgo con tipos estrictos
  private readonly riskMatrix: RiskMatrix = {
    'Alto': {
      'Alto': 'Alto',
      'Medio': 'Alto',
      'Bajo': 'Medio'
    },
    'Medio': {
      'Alto': 'Alto',
      'Medio': 'Medio',
      'Bajo': 'Bajo'
    },
    'Bajo': {
      'Alto': 'Medio',
      'Medio': 'Bajo',
      'Bajo': 'Bajo'
    }
  };

  constructor(private readonly configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    // Si no hay API key, loggear advertencia y deshabilitar OpenAI
    if (!this.openaiApiKey) {
      this.logger.warn('No se ha configurado OPENAI_API_KEY. Se usará el sistema de fallback de reglas.');
      this.useOpenAI = false;
    }
  }

  /**
   * Infiere escenarios de riesgo basados en la información de seguridad de la empresa
   */
  async inferRiskScenarios(securityInfo: SecurityInfo): Promise<InferredRiskScenario[]> {
    const { informationAssets, threats, vulnerabilities, existingMeasures } = securityInfo;
    
    // Verificar que hay suficiente información
    if (!informationAssets?.length || !threats?.length || !vulnerabilities?.length) {
      this.logger.warn('No hay suficiente información para inferir escenarios de riesgo');
      return this.generateFallbackScenarios(securityInfo);
    }

    // Si OpenAI no está habilitado, usar el sistema de fallback
    if (!this.useOpenAI) {
      return this.generateFallbackScenarios(securityInfo);
    }
    
    try {
      // Preparar prompt para OpenAI
      const prompt = this.preparePrompt(securityInfo);
      
      // Llamar a OpenAI
      const response = await this.callOpenAI(prompt);
      
      // Transformar respuesta a escenarios de riesgo
      const scenarios = this.parseOpenAIResponse(response, securityInfo);
      
      this.logger.log(`Escenarios de riesgo generados con OpenAI: ${scenarios.length}`);
      
      return scenarios;
    } catch (error) {
      this.logger.error(`Error al inferir escenarios con OpenAI: ${error.message}`);
      // Fallback a sistema de reglas simple
      return this.generateFallbackScenarios(securityInfo);
    }
  }

  /**
   * Prepara el prompt para OpenAI
   */
  private preparePrompt(securityInfo: SecurityInfo): string {
    const { informationAssets, threats, vulnerabilities, existingMeasures } = securityInfo;
    
    return `
      Como experto en seguridad de la información y análisis de riesgos ISO 27001, necesito generar escenarios de riesgo.
      
      Información disponible:
      
      Activos de información:
      ${informationAssets.map(a => `- ${a}`).join('\n')}
      
      Amenazas:
      ${threats.map(t => `- ${t}`).join('\n')}
      
      Vulnerabilidades:
      ${vulnerabilities.map(v => `- ${v}`).join('\n')}
      
      Medidas existentes:
      ${(existingMeasures || []).map(m => `- ${m}`).join('\n')}
      
      Genera 7-10 escenarios de riesgo con el siguiente formato JSON:
      [
        {
          "id": "R01",
          "asset": "[nombre de activo específico]",
          "threat": "[nombre de amenaza específica]",
          "vulnerability": "[nombre de vulnerabilidad específica]",
          "probability": "[Alto/Medio/Bajo]",
          "impact": "[Alto/Medio/Bajo]",
          "riskLevel": "[Alto/Medio/Bajo]",
          "controls": ["control 1", "control 2", "control 3"]
        },
        ...
      ]
      
      Asegúrate de que:
      - Cada escenario relacione un activo específico, una amenaza específica y una vulnerabilidad relevante
      - El nivel de riesgo sea coherente con la probabilidad e impacto (Alto+Alto=Alto, Alto+Medio=Alto, Medio+Medio=Medio, etc.)
      - Los controles sugeridos sean específicos y relevantes para la vulnerabilidad y amenaza
      - Los controles tengan en cuenta las medidas existentes (no repetir lo que ya existe)
      - Los controles sean realistas y efectivos según ISO 27001
      
      IMPORTANTE: Responde únicamente con el array JSON, sin texto adicional.
    `;
  }

  /**
   * Llama a la API de OpenAI
   */
  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en seguridad de la información y análisis de riesgos ISO 27001'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          }
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(`Error en llamada a OpenAI: ${error.message}`);
      throw error;
    }
  }

  /**
   * Transforma la respuesta de OpenAI en escenarios de riesgo
   */
  private parseOpenAIResponse(response: string, securityInfo: SecurityInfo): InferredRiskScenario[] {
    try {
      // Extraer el JSON de la respuesta (por si hay texto adicional)
      let jsonStr = response;
      
      // Si la respuesta contiene backticks, extraer el JSON
      if (response.includes('```json')) {
        jsonStr = response.split('```json')[1].split('```')[0].trim();
      } else if (response.includes('```')) {
        jsonStr = response.split('```')[1].split('```')[0].trim();
      }
      
      // Parsear el JSON
      const scenarios: InferredRiskScenario[] = JSON.parse(jsonStr);
      
      // Validar y sanitizar cada escenario
      return scenarios.map((scenario, index) => {
        // Asegurar que el ID está en formato correcto
        const id = scenario.id || `R${(index + 1).toString().padStart(2, '0')}`;
        
        // Verificar valores de probabilidad, impacto y nivel de riesgo
        const validLevels: RiskLevel[] = ['Alto', 'Medio', 'Bajo'];
        const probability = validLevels.includes(scenario.probability as RiskLevel) 
          ? scenario.probability as RiskLevel 
          : 'Medio' as RiskLevel;
        
        const impact = validLevels.includes(scenario.impact as RiskLevel) 
          ? scenario.impact as RiskLevel 
          : 'Medio' as RiskLevel;
        
        const riskLevel = validLevels.includes(scenario.riskLevel as RiskLevel) 
          ? scenario.riskLevel as RiskLevel 
          : this.calculateRiskLevel(probability, impact);
        
        // Asegurar que los campos obligatorios existen
        return {
          id,
          asset: scenario.asset || securityInfo.informationAssets[0],
          threat: scenario.threat || securityInfo.threats[0],
          vulnerability: scenario.vulnerability || securityInfo.vulnerabilities[0],
          probability,
          impact,
          riskLevel,
          controls: Array.isArray(scenario.controls) ? scenario.controls : ['Implementar controles adecuados'],
        };
      });
    } catch (error) {
      this.logger.error(`Error al procesar respuesta de OpenAI: ${error.message}`);
      // Si hay error al procesar, usar el sistema de fallback
      return this.generateFallbackScenarios(securityInfo);
    }
  }

  /**
   * Calcula el nivel de riesgo basado en probabilidad e impacto
   */
  private calculateRiskLevel(
    probability: RiskLevel,
    impact: RiskLevel
  ): RiskLevel {
    // Usamos la matriz de riesgo tipada
    return this.riskMatrix[probability][impact];
  }

  /**
   * Genera escenarios de riesgo de fallback usando reglas simples
   * Se usa cuando OpenAI no está disponible o falla
   */
  private generateFallbackScenarios(securityInfo: SecurityInfo): InferredRiskScenario[] {
    const { informationAssets, threats, vulnerabilities, existingMeasures } = securityInfo;
    
    if (!informationAssets?.length || !threats?.length || !vulnerabilities?.length) {
      return [];
    }
    
    const scenarios: InferredRiskScenario[] = [];
    const controlSuggestions: Record<string, string[]> = {
      'malware': [
        'Implementar solución antimalware avanzada',
        'Actualizar regularmente el sistema operativo y aplicaciones',
        'Realizar escaneos de vulnerabilidades periódicos'
      ],
      'acceso no autorizado': [
        'Implementar autenticación multifactor',
        'Revisar permisos de acceso regularmente',
        'Establecer política de contraseñas robustas'
      ],
      'fuga de información': [
        'Implementar cifrado de datos sensibles',
        'Establecer controles de acceso granulares',
        'Implementar solución DLP (Prevención de Pérdida de Datos)'
      ],
      'phishing': [
        'Implementar filtrado de correo avanzado',
        'Realizar formación de concienciación en seguridad',
        'Implementar autenticación multifactor'
      ],
      'denegación de servicio': [
        'Implementar protección DDoS',
        'Configurar balanceadores de carga',
        'Establecer límites de tasa de conexión'
      ],
      'error humano': [
        'Implementar programa de concienciación en seguridad',
        'Establecer procedimientos operativos estándar',
        'Implementar controles técnicos preventivos'
      ]
    };
    
    // Generar escenarios hasta tener 5 o haber usado todos los activos
    for (let i = 0; i < Math.min(5, informationAssets.length); i++) {
      const asset = informationAssets[i];
      const threat = threats[i % threats.length];
      const vulnerability = vulnerabilities[i % vulnerabilities.length];
      
      // Determinar probabilidad e impacto
      let probability: RiskLevel = 'Medio';
      let impact: RiskLevel = 'Medio';
      
      // Lógica simple para determinar probabilidad
      if (vulnerability.toLowerCase().includes('débil') || 
          vulnerability.toLowerCase().includes('falta') ||
          vulnerability.toLowerCase().includes('insuficiente')) {
        probability = 'Alto';
      }
      
      // Lógica simple para determinar impacto
      if (asset.toLowerCase().includes('cliente') || 
          asset.toLowerCase().includes('financier') ||
          asset.toLowerCase().includes('crítico')) {
        impact = 'Alto';
      }
      
      // Calcular nivel de riesgo
      const riskLevel = this.calculateRiskLevel(probability, impact);
      
      // Determinar controles
      let controls: string[] = [];
      // Buscar una palabra clave en la amenaza que coincida con nuestros controles predefinidos
      const threatLower = threat.toLowerCase();
      const matchingThreats = Object.keys(controlSuggestions).filter(key => 
        threatLower.includes(key)
      );
      
      if (matchingThreats.length > 0) {
        controls = controlSuggestions[matchingThreats[0]];
      } else {
        controls = [
          'Implementar controles técnicos adecuados',
          'Establecer políticas y procedimientos',
          'Realizar revisiones periódicas'
        ];
      }
      
      // Añadir escenario
      scenarios.push({
        id: `R${(i + 1).toString().padStart(2, '0')}`,
        asset,
        threat,
        vulnerability,
        probability,
        impact,
        riskLevel,
        controls
      });
    }
    
    return scenarios;
  }
}