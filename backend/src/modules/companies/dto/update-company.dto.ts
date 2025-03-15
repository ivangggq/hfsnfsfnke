import { IsString, IsOptional, IsNumber, IsEmail, IsUrl, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class SecurityInfoDto {
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

export class UpdateCompanyDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'La industria debe ser una cadena de texto' })
  @IsOptional()
  industry?: string;

  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsOptional()
  location?: string;

  @IsNumber({}, { message: 'El tamaño debe ser un número' })
  @IsOptional()
  size?: number;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'El sitio web debe ser una URL válida' })
  @IsOptional()
  website?: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'El logo debe ser una cadena de texto (URL o Base64)' })
  @IsOptional()
  logo?: string;

  @Type(() => SecurityInfoDto)
  @IsOptional()
  securityInfo?: SecurityInfoDto;
}