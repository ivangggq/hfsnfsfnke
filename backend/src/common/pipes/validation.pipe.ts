import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Logger } from '../services/logger.service';

/**
 * Pipe personalizado para validación de DTOs
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(ValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    // Si no hay metatype o no es un tipo validable, devolver valor sin validar
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convertir valor plano a instancia de la clase
    const object = plainToInstance(metatype, value);
    
    // Validar objeto utilizando class-validator
    const errors = await validate(object);
    
    // Si hay errores, registrar y lanzar excepción
    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
          : [];
        return {
          property: error.property,
          messages: constraints,
        };
      });

      this.logger.error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
      
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}