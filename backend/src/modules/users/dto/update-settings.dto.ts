import { IsOptional, IsEnum, IsInt, Min, Max, Matches, ValidateIf } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @ValidateIf((o) => o.openaiKey !== null && o.openaiKey !== undefined && o.openaiKey !== '')
  @Matches(/^sk-/, { message: 'La clave de API de OpenAI debe comenzar con "sk-"' })
  openaiKey?: string;

  @IsEnum(['openai', 'fallback'], { message: 'El método de inferencia debe ser "openai" o "fallback"' })
  inferenceMethod: string;

  @IsInt({ message: 'El número máximo de escenarios debe ser un entero' })
  @Min(1, { message: 'El número máximo de escenarios debe ser al menos 1' })
  @Max(20, { message: 'El número máximo de escenarios no puede ser mayor a 20' })
  maxRiskScenarios: number;
}