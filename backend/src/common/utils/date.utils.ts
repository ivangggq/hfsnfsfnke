/**
 * Formatea una fecha en formato ISO
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Formatea una fecha en formato legible para humanos
 */
export const formatDateToHuman = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 */
export const formatDateToShort = (date: Date): string => {
  return date.toLocaleDateString('es-ES');
};

/**
 * Añade un número de días a una fecha
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Comprueba si una fecha es anterior a otra
 */
export const isBefore = (date1: Date, date2: Date): boolean => {
  return date1.getTime() < date2.getTime();
};

/**
 * Comprueba si una fecha es posterior a otra
 */
export const isAfter = (date1: Date, date2: Date): boolean => {
  return date1.getTime() > date2.getTime();
};

/**
 * Calcula la diferencia en días entre dos fechas
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // horas*minutos*segundos*milisegundos
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
};