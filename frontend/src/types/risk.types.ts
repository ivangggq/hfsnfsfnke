/**
 * Risk level type
 */
export type RiskLevel = 'Alto' | 'Medio' | 'Bajo';

/**
 * Inferred risk scenario model
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