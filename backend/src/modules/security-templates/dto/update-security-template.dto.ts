import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class SecurityInfoTemplateDto {
  @IsArray({ message: 'Los activos de información deben ser un array' })
  @IsOptional()
  informationAssets?: string[];

  @IsArray({ message: 'Las amenazas deben ser un array' })
  @IsOptional()
  threats?: string[];

  @IsArray({ message: 'Las vulnerabilidades deben ser un array' })
  @IsOptional()
  vulnerabilities?: string[];

  @IsArray({ message: 'Las medidas existentes deben ser un array' })
  @IsOptional()
  existingMeasures?: string[];
}

export class UpdateSecurityTemplateDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'La industria debe ser una cadena de texto' })
  @IsOptional()
  industry?: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @Type(() => SecurityInfoTemplateDto)
  @IsOptional()
  template?: SecurityInfoTemplateDto;

  @IsBoolean({ message: 'isDefault debe ser un valor booleano' })
  @IsOptional()
  isDefault?: boolean;
}