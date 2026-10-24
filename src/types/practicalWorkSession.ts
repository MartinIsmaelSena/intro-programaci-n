import { ExamUnifiedQuestion } from './exam';
import { TestCase } from './course';

export type TPModality = 'individual' | 'pareja';
export type TPShift = 'Mañana' | 'Tarde' | 'Noche' | 'Vespertino';
export type TPModelType = 'A' | 'B' | 'C';

export interface TPStudentMember {
  name: string;
  lastName: string;
}

export interface TPStudentData {
  modality: TPModality;
  school: string;
  course: string;
  division?: string;
  shift: TPShift;
  student1: TPStudentMember;
  student2?: TPStudentMember;
}

export interface ActiveTPSession {
  id: string;
  model: TPModelType;
  student: TPStudentData;
  startTimestamp: number;
  deadlineTimestamp: number;
  durationMinutes: number; // 80 minutos
  questions: ExamUnifiedQuestion[];
  answers: Record<string, number | string>;
  submitted: boolean;
  completionReason?: 'manual_submit' | 'timeout';
  result?: TPEvaluationResult;
}

export interface TPTheoryBreakdownItem {
  questionId: string;
  question: string;
  topic: string;
  userAnswer: number | undefined;
  correctAnswer: number;
  correctAnswerText: string;
  userAnswerText: string;
  isCorrect: boolean;
  pointsObtained: number;
  maxPoints: number;
  explanation: string;
}

export interface TPPracticalBreakdownItem {
  questionId: string;
  title: string;
  description: string;
  userCode: string;
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  pointsObtained: number;
  maxPoints: number;
  testCasesResults: Array<{
    name: string;
    passed: boolean;
    actualOutput: string;
    expectedDescription: string;
    feedbackMessage: string;
  }>;
  suggestions?: string;
}

export interface TPEvaluationResult {
  id: string;
  model: TPModelType;
  student: TPStudentData;
  startedAt: string;
  deadlineAt: string;
  completedAt: string;
  durationSeconds: number;
  completionReason: 'manual_submit' | 'timeout';
  totalQuestions: number; // 12 (8 teóricas + 4 prácticas)
  correctAnswersCount: number;
  score: number; // 0.0 a 10.0
  maxScore: number; // 10.0
  theoryScore: number; // 0.0 a 4.0 (40%)
  theoryMaxScore: number; // 4.0
  practicalScore: number; // 0.0 a 6.0 (60%)
  practicalMaxScore: number; // 6.0
  percentage: number; // 0 a 100
  passed: boolean; // score >= 6.0
  theoryBreakdown: TPTheoryBreakdownItem[];
  practicalBreakdown: TPPracticalBreakdownItem[];
}
