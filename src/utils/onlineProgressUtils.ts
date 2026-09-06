/**
 * Utilidades de Progreso Pedagógico y Compatibilidad para Desafíos en Línea
 * Plataforma: Python desde Cero
 */

export const MODULE_TOPICS: Record<number, { fullTitle: string; shortTopic: string }> = {
  1: { fullTitle: 'Módulo 1 · Introducción a la programación', shortTopic: 'Introducción' },
  2: { fullTitle: 'Módulo 2 · Fundamentos de la programación', shortTopic: 'Fundamentos' },
  3: { fullTitle: 'Módulo 3 · ¿Qué es Python?', shortTopic: 'Python' },
  4: { fullTitle: 'Módulo 4 · Variables', shortTopic: 'Variables' },
  5: { fullTitle: 'Módulo 5 · Tipos de datos', shortTopic: 'Tipos de datos' },
  6: { fullTitle: 'Módulo 6 · Operadores aritméticos', shortTopic: 'Aritmética' },
  7: { fullTitle: 'Módulo 7 · Comparaciones', shortTopic: 'Comparaciones' },
  8: { fullTitle: 'Módulo 8 · Operadores lógicos', shortTopic: 'Operadores lógicos' },
  9: { fullTitle: 'Módulo 9 · print()', shortTopic: 'print()' },
  10: { fullTitle: 'Módulo 10 · input()', shortTopic: 'input()' },
  11: { fullTitle: 'Módulo 11 · Condicionales', shortTopic: 'Condicionales' },
  12: { fullTitle: 'Módulo 12 · Loops', shortTopic: 'Loops' },
  13: { fullTitle: 'Módulo 13 · Bucle for', shortTopic: 'for' },
  14: { fullTitle: 'Módulo 14 · Bucle while', shortTopic: 'while' },
  15: { fullTitle: 'Módulo 15 · Integración', shortTopic: 'Integración' }
};

/**
 * Obtiene el nivel educativo real del alumno en base a su progreso en la plataforma.
 * Si no completó ningún módulo todavía, su nivel activo es 1 (Módulo 1).
 */
export function getStudentMaxModule(completedModules?: number[]): number {
  if (!completedModules || !Array.isArray(completedModules) || completedModules.length === 0) {
    return 1;
  }
  const max = Math.max(...completedModules);
  return Math.max(1, Math.min(15, max));
}

/**
 * Devuelve el nombre del tema pedagógico correspondiente a un módulo.
 * Ejemplo: 4 -> "Variables", 5 -> "Tipos de datos"
 */
export function getModuleTopicName(moduleId: number): string {
  const safeId = Math.max(1, Math.min(15, moduleId || 1));
  return MODULE_TOPICS[safeId]?.shortTopic || `Módulo ${safeId}`;
}

/**
 * Devuelve el título completo legible con número de módulo y tema.
 * Ejemplo: 4 -> "Módulo 4 · Variables"
 */
export function getModuleFullTitle(moduleId: number): string {
  const safeId = Math.max(1, Math.min(15, moduleId || 1));
  return MODULE_TOPICS[safeId]?.fullTitle || `Módulo ${safeId}`;
}

/**
 * Regla de Compatibilidad entre dos jugadores (Fair Play ±1 Módulo):
 * Un alumno solo puede desafiar a otro si la diferencia de módulos es <= 1.
 */
export function checkPlayersCompatibility(
  modA: number,
  modB: number
): { compatible: boolean; diff: number; reason?: string } {
  const safeA = Math.max(1, Math.min(15, modA || 1));
  const safeB = Math.max(1, Math.min(15, modB || 1));
  const diff = Math.abs(safeA - safeB);

  if (diff <= 1) {
    return { compatible: true, diff };
  }

  return {
    compatible: false,
    diff,
    reason: '⚠️ Los niveles de aprendizaje son demasiado diferentes para este desafío.'
  };
}

/**
 * Calcula el módulo máximo permitido para una partida entre dos jugadores:
 * Corresponde a la intersección estricta de contenidos comunes:
 * min(modA, modB).
 */
export function getMaxAllowedMatchModule(modA: number, modB: number): number {
  const safeA = Math.max(1, Math.min(15, modA || 1));
  const safeB = Math.max(1, Math.min(15, modB || 1));
  return Math.max(1, Math.min(safeA, safeB));
}
