import { Exam } from '../../types/exam';
import { exam01 } from './exam01_block1';
import { exam02 } from './exam02_block2';
import { exam03 } from './exam03_block3';
import { exam04 } from './exam04_block4';
import { exam05 } from './exam05_block5';

export const ALL_EXAMS: Exam[] = [
  exam01,
  exam02,
  exam03,
  exam04,
  exam05
];

export function getExamById(id: string): Exam | undefined {
  return ALL_EXAMS.find(e => e.id === id);
}

/**
 * Determina si un examen está disponible.
 * La fuente de verdad autoritativa y global es el mapa de Supabase (exam_settings).
 * Si no se provee el mapa o está offline, recurre a exam.available como respaldo.
 */
export function isExamAvailable(
  exam: Exam,
  globalSettings?: Record<string, boolean> | string[]
): boolean {
  if (globalSettings) {
    if (Array.isArray(globalSettings)) {
      // Compatibilidad con lista legacy de IDs
      return exam.available || globalSettings.includes(exam.id);
    }
    if (typeof globalSettings[exam.id] === 'boolean') {
      return globalSettings[exam.id];
    }
  }
  return exam.available;
}
