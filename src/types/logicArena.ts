export type LogicCategory =
  | 'comparisons'      // Comparaciones (<, >, ==, !=, <=, >=)
  | 'boolean_logic'    // Operadores lógicos (and, or, not)
  | 'variables'        // Nombres válidos y asignación
  | 'reassignment'     // Reasignación y mutabilidad en memoria
  | 'code_tracing'     // Trazado de ejecución y salidas de print()
  | 'error_detection'  // Detección de errores comunes de principiantes
  | 'combined_logic';  // Lógica combinada y precedencia

export type LogicQuestionType =
  | 'conceptual'
  | 'comparacion'
  | 'logica'
  | 'variable'
  | 'salida_codigo'
  | 'deteccion_error'
  | 'aplicacion';

export type LogicDifficulty = 'facil' | 'medio' | 'desafio';

export interface LogicArenaQuestion {
  id: string;
  category: LogicCategory;
  subtopic: string;
  difficulty: LogicDifficulty;
  type: LogicQuestionType;
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string] | string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  hint?: string;
  relatedModuleId?: number; // Para futura compatibilidad con 1v1
}

export interface LogicQuestionAnswerRecord {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface LogicArenaProgress {
  answeredQuestions: Record<string, {
    isCorrect: boolean;
    lastOption: number;
    attempts: number;
  }>;
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  categoryStats: Record<LogicCategory, {
    total: number;
    correct: number;
  }>;
  totalXpEarned: number;
}

export interface LogicRoundSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  streakReached: number;
  unlockedBadgeIds: string[];
}
