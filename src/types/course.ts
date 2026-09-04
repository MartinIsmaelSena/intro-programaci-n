export type Difficulty = 'starter' | 'basic' | 'intermediate' | 'challenge';

export interface TestCase {
  name: string;
  inputs?: string[];
  expectedOutputPattern?: string;
  expectedOutputs?: string[];
  validatorType?: 'output_contains' | 'output_exact' | 'variable_value' | 'regex' | 'custom';
  description?: string;
}

export interface Exercise {
  id: string;
  moduleId: number;
  number: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  realWorldContext: string;
  starterCode: string;
  solution: string;
  hints: string[];
  xp: number;
  testCases: TestCase[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'single' | 'boolean';
  explanation: string;
  hint: string;
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  analogy?: {
    title: string;
    description: string;
    steps?: string[];
  };
  codeExample?: {
    code: string;
    explanation: string;
    output?: string;
  };
  keyTakeaways?: string[];
}

export interface OptionalChallenge {
  id: string;
  title: string;
  description: string;
  bonusXp: number;
  badgeId?: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
}

export interface CourseModule {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  estimatedTime: string;
  category: 'fundamentos' | 'datos' | 'operadores' | 'io' | 'control' | 'bucles' | 'proyectos';
  theory: TheorySection[];
  quiz: QuizQuestion[];
  exercises: Exercise[];
  optionalChallenge?: OptionalChallenge;
  summary: {
    conceptsLearned: string[];
    congratulationsMessage: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'starter' | 'module' | 'exercises' | 'mastery' | 'skill' | 'achievement';
  requirementText: string;
  xpBonus: number;
}

export interface UserProgress {
  userName: string;
  onboardingCompleted: boolean;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedModules: number[];
  completedExercises: string[];
  completedChallenges: string[];
  answeredQuestions: Record<string, { selectedOption: number; isCorrect: boolean; attempts: number }>;
  unlockedBadges: Array<{ id: string; unlockedAt: string }>;
  savedCode: Record<string, string>; // exerciseId -> userCode
  theme: 'light' | 'dark';
  enabledExams?: string[]; // IDs de exámenes habilitados manualmente
  examResults?: Record<string, any>; // examId -> ExamResult
}

export interface UserLevel {
  level: number;
  title: string;
  icon: string;
  minXp: number;
  maxXp: number;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  error?: string;
  friendlyError?: {
    title: string;
    message: string;
    tip: string;
  };
  executionTimeMs: number;
  success: boolean;
}
