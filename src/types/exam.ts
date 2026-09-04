import { TestCase } from './course';

export type ExamDifficulty = 'facil' | 'medio' | 'dificil' | 'integrador';

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
  sections: ExamSections;
}

export interface ExamUserAnswers {
  theoryAnswers: Record<string, number>; // questionId -> selectedOption
  tracingAnswers: Record<string, number>; // questionId -> selectedOption
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
  totalScore: number; // 0 to 100
  passed: boolean; // >= 60 points
  timeSpentSeconds: number;
  sectionScores: ExamSectionScore[];
}
