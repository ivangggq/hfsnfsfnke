import { LoggerService, ConsoleLogger } from '@nestjs/common';

/**
 * Servicio de logging personalizado basado en NestJS Logger
 */
export class Logger extends ConsoleLogger implements LoggerService {
  constructor(context?: string) {
    super(context);
  }

  /**
   * Registra mensaje informativo
   */
  log(message: any, context?: string): void {
    const formattedMessage = this.formatMessageForLog(message);
    // Si el contexto no se proporciona, utilizamos el contexto establecido en el constructor
    if (context === undefined) {
      super.log(formattedMessage);
    } else {
      super.log(formattedMessage, context);
    }
  }

  /**
   * Registra mensaje de error
   */
  error(message: any, trace?: string, context?: string): void {
    const formattedMessage = this.formatMessageForLog(message);
    if (context === undefined) {
      super.error(formattedMessage, trace);
    } else {
      super.error(formattedMessage, trace, context);
    }
  }

  /**
   * Registra mensaje de advertencia
   */
  warn(message: any, context?: string): void {
    const formattedMessage = this.formatMessageForLog(message);
    if (context === undefined) {
      super.warn(formattedMessage);
    } else {
      super.warn(formattedMessage, context);
    }
  }

  /**
   * Registra mensaje de depuración
   */
  debug(message: any, context?: string): void {
    const formattedMessage = this.formatMessageForLog(message);
    if (context === undefined) {
      super.debug(formattedMessage);
    } else {
      super.debug(formattedMessage, context);
    }
  }

  /**
   * Registra mensaje detallado
   */
  verbose(message: any, context?: string): void {
    const formattedMessage = this.formatMessageForLog(message);
    if (context === undefined) {
      super.verbose(formattedMessage);
    } else {
      super.verbose(formattedMessage, context);
    }
  }

  /**
   * Formatea el mensaje para incluir timestamp
   */
  protected formatMessageForLog(message: any): string {
    if (message === undefined) {
      return 'undefined';
    }
    if (message === null) {
      return 'null';
    }
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }
}