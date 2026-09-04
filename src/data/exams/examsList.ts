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
 * Checks if an exam is available.
 * Default is exam.available (false), but can be enabled via enabledExamIds list (teacher mode / state).
 */
export function isExamAvailable(exam: Exam, enabledExamIds: string[]): boolean {
  if (exam.available) return true;
  return enabledExamIds.includes(exam.id);
}
