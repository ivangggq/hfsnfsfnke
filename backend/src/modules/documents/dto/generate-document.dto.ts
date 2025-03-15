import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID, IsObject } from 'class-validator';
import { DocumentType } from '../document.entity';

export class GenerateDocumentDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsEnum(DocumentType, { message: 'El tipo de documento no es válido' })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  type: DocumentType;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @IsUUID('all', { message: 'El ID de la empresa no es válido' })
  @IsNotEmpty({ message: 'El ID de la empresa es requerido' })
  companyId: string;

  @IsObject({ message: 'Los parámetros del documento deben ser un objeto' })
  @IsOptional()
  parameters?: Record<string, any>;
}