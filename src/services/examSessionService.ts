import {
  ActiveExamSession,
  Exam,
  ExamStudentData,
  ExamEvaluationResult
} from '../types/exam';
import {
  EXAM01_STORAGE_KEY,
  EXAM01_ATTEMPTS_STORAGE_KEY,
  generateExam01Session
} from '../data/exams/exam01_block1';
import {
  EXAM_PROG_VARS_LOGIC_ID,
  EXAM_PROG_VARS_LOGIC_STORAGE_KEY,
  EXAM_PROG_VARS_LOGIC_ATTEMPTS_STORAGE_KEY,
  generateProgVarsLogicSession
} from '../data/exams/exam_prog_vars_logic';

/**
 * Obtiene la clave de almacenamiento local para la sesión activa según el examen.
 */
export function getExamSessionStorageKey(examId: string): string {
  if (examId === 'exam-1') return EXAM01_STORAGE_KEY;
  if (examId === EXAM_PROG_VARS_LOGIC_ID) return EXAM_PROG_VARS_LOGIC_STORAGE_KEY;
  return `python_active_exam_session_${examId}`;
}

/**
 * Obtiene la clave de almacenamiento local para el historial de intentos según el examen.
 */
export function getExamAttemptsStorageKey(examId: string): string {
  if (examId === 'exam-1') return EXAM01_ATTEMPTS_STORAGE_KEY;
  if (examId === EXAM_PROG_VARS_LOGIC_ID) return EXAM_PROG_VARS_LOGIC_ATTEMPTS_STORAGE_KEY;
  return `python_exam_attempts_history_${examId}`;
}

/**
 * Clave única y normalizada del alumno para control de intentos
 */
export function getStudentKey(student: ExamStudentData): string {
  const s = (student.school || '').trim().toLowerCase();
  const c = (student.course || '').trim().toLowerCase();
  const l = (student.studentLastName || '').trim().toLowerCase();
  const n = (student.studentName || '').trim().toLowerCase();
  return `${s}::${c}::${l}::${n}`;
}

/**
 * Recupera la sesión activa en curso para un examen específico desde localStorage.
 */
export function getStoredExamSession(examId: string): ActiveExamSession | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const key = getExamSessionStorageKey(examId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.examId === examId && Array.isArray(parsed.questions)) {
      return parsed as ActiveExamSession;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Guarda o actualiza la sesión activa en curso en localStorage.
 */
export function saveStoredExamSession(session: ActiveExamSession): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const key = getExamSessionStorageKey(session.examId);
    localStorage.setItem(key, JSON.stringify(session));
  } catch (err) {
    console.error('Error al guardar sesión activa de examen:', err);
  }
}

/**
 * Limpia la sesión activa en curso tras finalizar o reiniciar el examen.
 */
export function clearStoredExamSession(examId: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const key = getExamSessionStorageKey(examId);
    localStorage.removeItem(key);
  } catch {}
}

/**
 * Cuenta la cantidad de intentos completados por el alumno para un examen determinado.
 */
export function getStudentCompletedAttemptsCount(
  examId: string,
  student: ExamStudentData
): number {
  try {
    if (typeof localStorage === 'undefined') return 0;
    const key = getExamAttemptsStorageKey(examId);
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const map = JSON.parse(raw);
    const sKey = getStudentKey(student);
    const list = map[sKey] || [];
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Registra un intento finalizado en el historial local del examen correspondiente.
 */
export function recordCompletedAttempt(evaluation: ExamEvaluationResult): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const key = getExamAttemptsStorageKey(evaluation.examId);
    const raw = localStorage.getItem(key) || '{}';
    const map = JSON.parse(raw);
    const sKey = getStudentKey(evaluation.student);
    if (!map[sKey]) map[sKey] = [];
    map[sKey].push(evaluation);
    localStorage.setItem(key, JSON.stringify(map));
  } catch (err) {
    console.error('Error al guardar historial de intentos:', err);
  }
}

/**
 * Verifica si el alumno ya superó el máximo de intentos permitidos.
 */
export function hasExceededAttempts(
  examId: string,
  student: ExamStudentData,
  maxAttempts: number = 3
): boolean {
  return getStudentCompletedAttemptsCount(examId, student) >= maxAttempts;
}

/**
 * Genera la sesión de examen llamando al generador correspondiente según el examen.
 */
export function generateExamSession(
  exam: Exam,
  student: ExamStudentData,
  attemptNumber?: number
): ActiveExamSession {
  if (exam.id === 'exam-1') {
    return generateExam01Session(student, attemptNumber);
  }
  if (exam.id === EXAM_PROG_VARS_LOGIC_ID) {
    return generateProgVarsLogicSession(student, attemptNumber);
  }
  throw new Error(`Generador de sesión no configurado para el examen: ${exam.id}`);
}
