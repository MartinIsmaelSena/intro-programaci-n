import { TestCase } from './course';

export type ExamDifficulty = 'facil' | 'medio' | 'dificil' | 'integrador';

export type ExamQuestionType = 'multiple_choice' | 'tracing' | 'coding';

export interface ExamUnifiedQuestion {
  id: string;
  type: ExamQuestionType;
  moduleId: number;
  topic: string;
  subtopic?: string;
  question: string;
  codeSnippet?: string;
  options?: string[]; // Para multiple_choice y tracing
  correctAnswer?: number; // Índice 0-based de la opción correcta
  explanation?: string;
  // Campos para coding:
  title?: string;
  starterCode?: string;
  solution?: string;
  testCases?: TestCase[];
  points?: number; // Por defecto 0.5 puntos (20 preguntas = 10 puntos)
}

export type ExamQuestion = ExamUnifiedQuestion;

export interface ExamStudentData {
  studentName: string;
  studentLastName: string;
  school: string;
  course: string;
  attemptNumber?: number;
}

export interface ExamDistributionConfig {
  multiple_choice: number; // Por defecto 16
  tracing: number; // Por defecto 2
  coding: number; // Por defecto 2
}

export interface ExamConfig {
  totalQuestions: number; // 20
  durationMinutes: number; // 40
  maxAttempts: number; // 3
  distribution: ExamDistributionConfig;
  maxScore: number; // 10
  pointsPerQuestion: number; // 0.5
  passingScore: number; // 6.0
  allowDetailedReview: boolean;
}

export interface ActiveExamSession {
  examId: string;
  student: ExamStudentData;
  attemptNumber: number; // 1, 2 o 3
  startTimestamp: number;
  durationMinutes: number;
  questions: ExamUnifiedQuestion[];
  answers: Record<string, number | string>; // questionId -> selectedOptionIdx o userCode
  submitted: boolean;
  result?: ExamEvaluationResult;
}

export interface ExamEvaluationResult {
  examId: string;
  student: ExamStudentData;
  attemptNumber: number; // 1, 2 o 3
  completedAt: string;
  startedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  correctAnswersCount: number;
  score: number; // 0.0 a 10.0
  maxScore: number; // 10.0
  percentage: number; // 0 a 100
  passed: boolean; // score >= passingScore (default 6.0)
  questionBreakdown: Array<{
    questionId: string;
    question: string;
    type: ExamQuestionType;
    topic: string;
    userAnswer: number | string | undefined;
    isCorrect: boolean;
    pointsObtained: number;
    explanation?: string;
    correctAnswerText?: string;
  }>;
}

export interface ExamAttemptRecord {
  id?: string;
  student_name: string;
  student_last_name: string;
  school: string;
  course: string;
  exam_id: string;
  attempt_number: number;
  session_id?: string;
  student_key?: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string;
  answers_summary?: Record<string, any>;
}

// ============================================================================
// TIPOS LEGACY / RETROCOMPATIBLES (para compatibilidad con exam02...exam05)
// ============================================================================

export interface ExamTheoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface ExamTracingQuestion {
  id: string;
  codeSnippet: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface ExamDebuggingQuestion {
  id: string;
  title: string;
  description: string;
  buggyCode: string;
  solution: string;
  testCases: TestCase[];
  points: number;
}

export interface ExamCodingQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: ExamDifficulty;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  points: number;
}

export interface ExamSections {
  partA_theory: ExamTheoryQuestion[];
  partB_tracing: ExamTracingQuestion[];
  partC_debugging: ExamDebuggingQuestion;
  partD_coding: ExamCodingQuestion;
  partE_integrator: ExamCodingQuestion;
}

export interface Exam {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  modules: number[];
  moduleTitles: string[];
  durationMinutes: number;
  available: boolean;
  totalPoints: number;
  sections?: ExamSections;
  config?: ExamConfig;
  questionBank?: ExamUnifiedQuestion[];
}

export interface ExamUserAnswers {
  theoryAnswers: Record<string, number>;
  tracingAnswers: Record<string, number>;
  debuggingCode: string;
  codingCode: string;
  integratorCode: string;
}

export interface ExamSectionScore {
  name: string;
  maxPoints: number;
  obtainedPoints: number;
  feedback: string;
}

export interface ExamResult {
  examId: string;
  completedAt: string;
  totalScore: number;
  passed: boolean;
  timeSpentSeconds: number;
  sectionScores: ExamSectionScore[];
}
