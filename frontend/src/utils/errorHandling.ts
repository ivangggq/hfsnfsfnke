// utils/errorHandling.ts

/**
 * Formatea los mensajes de error para mostrarlos en líneas separadas en los toasts
 * @param error Objeto de error de la API o mensaje de error simple
 * @returns Mensaje de error formateado con cada error en una línea separada
 */
export const formatErrorMessage = (error: any): string => {
  // Caso 1: Si el error tiene una estructura específica con un array de errores
  if (error.error?.errors && Array.isArray(error.error.errors)) {
    return error.error.errors.join('\n');
  }
  
  // Caso 2: Si el error tiene un mensaje específico
  if (error.error?.message) {
    return error.error.message;
  }
  
  // Caso 3: Si el error es un objeto de validación con múltiples campos
  if (error.error?.validationErrors) {
    const validationErrors = error.error.validationErrors;
    return Object.keys(validationErrors)
      .map(field => `${field}: ${validationErrors[field]}`)
      .join('\n');
  }
  
  // Caso 4: Si el error es un mensaje simple (string)
  if (typeof error === 'string') {
    return error;
  }
  
  // Caso por defecto: mensaje genérico
  return 'Ha ocurrido un error';
};