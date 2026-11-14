/**
 * Tipos de datos para el Trabajo Práctico de Programación – 4.º año
 * (Compartido entre CPEM N.º 69 y CPEM N.º 29 para divisiones 4.º A, 4.º B y 4.º C)
 */

export type TPCpemSchool = 'CPEM N.º 69' | 'CPEM N.º 29';
export type TPCpemDivision = '4.º A' | '4.º B' | '4.º C';

export const TP_VALID_SCHOOLS: readonly TPCpemSchool[] = ['CPEM N.º 69', 'CPEM N.º 29'] as const;
export const TP_VALID_DIVISIONS: readonly TPCpemDivision[] = ['4.º A', '4.º B', '4.º C'] as const;

export type TPCpem69ExerciseNumber = 3 | 4 | 5 | 6 | 7;

export type TPCpem69SubmissionStatus =
  | 'in_progress'
  | 'submitted'
  | 'grading'
  | 'graded'
  | 'error_grading'
  | 'expired';

export type TPCpem69AuditStatus =
  | 'no_observations'
  | 'requires_review'
  | 'oral_exam';

export interface TPCpem69Question {
  id: number; // 1 a 5
  prompt: string;
  expectedConcept: string;
}

export interface TPCpem69Exercise {
  number: TPCpem69ExerciseNumber;
  title: string;
  description: string;
  pythonCode: string;
  questions: TPCpem69Question[];
}

export interface TPCpem69StudentData {
  studentName: string;
  studentLastName: string;
  email: string;
  school: TPCpemSchool;
  division: TPCpemDivision;
}

export interface TPCpem69QuestionResult {
  question: number; // 1 a 5
  status: 'correct' | 'partial' | 'incorrect';
  points: number; // 0.0 a 2.0
  feedback: string;
}

export interface TPCpem69AICorrection {
  grade: number; // 0.0 a 10.0
  max_grade: number; // 10.0
  results: TPCpem69QuestionResult[];
  strengths: string[];
  improvements: string[];
  general_feedback: string;
  audit: {
    status: TPCpem69AuditStatus;
    reasons: string[];
  };
}

export interface TPCpem69TeacherOverride {
  originalScore: number;
  newScore: number;
  motive: string;
  teacherEmail: string;
  overriddenAt: string;
  oralExamResult?: 'approved' | 'failed' | 'pending';
}

export interface TPCpem69Submission {
  id: string;
  tp_id: string;
  student_name: string;
  student_last_name: string;
  email_original: string;
  email_normalized: string;
  school: TPCpemSchool;
  division: TPCpemDivision;
  assigned_exercise: TPCpem69ExerciseNumber;
  started_at: string;
  deadline_at: string;
  answers: Record<string, string>; // { "1": "...", "2": "...", ... }
  status: TPCpem69SubmissionStatus;
  submitted_at?: string | null;
  score?: number | null;
  ai_correction?: TPCpem69AICorrection | null;
  ai_feedback?: string | null;
  audit_status: TPCpem69AuditStatus;
  audit_observations?: string[] | null;
  teacher_modifications?: TPCpem69TeacherOverride[] | TPCpem69TeacherOverride | null;
  email_sent: boolean;
  email_sent_at?: string | null;
  email_error?: string | null;
  graded_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TPCpem69Config {
  id: string;
  name: string;
  course: string;
  duration_minutes: number;
  is_published: boolean;
  grading_config: {
    max_score: number;
    questions_count: number;
    points_per_question: number;
  };
  created_at: string;
  updated_at: string;
}

export interface TPCpem69ActiveSession {
  submissionId: string;
  tpId: string;
  sessionToken?: string;
  student: TPCpem69StudentData;
  school?: TPCpemSchool;
  division?: TPCpemDivision;
  assignedExercise: TPCpem69ExerciseNumber;
  startedAt: string;
  deadlineAt: string;
  answers: Record<string, string>;
  status: TPCpem69SubmissionStatus;
  submittedAt?: string | null;
  score?: number | null;
  aiCorrection?: TPCpem69AICorrection | null;
  auditStatus?: TPCpem69AuditStatus;
}
