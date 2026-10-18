/**
 * Tipos de datos para el módulo de Trabajos Prácticos
 */

export type PracticalWorkStatus = 'draft' | 'enabled' | 'closed';

export interface PracticalWork {
  id: string;
  title: string;
  description?: string | null;
  target_school: string;
  target_course?: string | null;
  status: PracticalWorkStatus;
  created_by?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePracticalWorkInput {
  title: string;
  description?: string;
  target_school: string;
  target_course?: string;
  status: PracticalWorkStatus;
}

export interface UpdatePracticalWorkInput {
  title?: string;
  description?: string;
  target_school?: string;
  target_course?: string;
  status?: PracticalWorkStatus;
}

/**
 * Estructura preparada para almacenar entregas y resultados futuros
 * en Supabase (tabla `practical_work_submissions`).
 */
export interface PracticalWorkSubmission {
  id: string;
  practical_work_id: string;
  student_name: string;
  student_last_name: string;
  school: string;
  course?: string | null;
  student_key?: string | null;
  session_id?: string | null;
  answers_payload?: Record<string, any> | null;
  score?: number | null;
  teacher_feedback?: string | null;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  submitted_at: string;
  graded_at?: string | null;
  created_at: string;
  updated_at: string;
}
