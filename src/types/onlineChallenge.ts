export type PlayerStatus = 'available' | 'playing' | 'offline';

export interface Player {
  id: string;
  sessionId?: string; // ID de sesión realtime de Supabase
  firstName: string;
  lastName: string;
  school: string;
  course: string;
  avatar: string;
  xp: number;
  wins: number;
  losses: number;
  streak: number;
  status: PlayerStatus;
  isRealPlayer?: boolean; // Diferencia jugador conectado real vs bot simulado
  accuracyRate?: number; // Tasa promedio de acierto (0.6 - 0.95)
  avgResponseTimeSeconds?: number; // Tiempo promedio de respuesta en segundos (2 - 7)
  reactions?: string[]; // Mensajes o emojis contextuales
  maxCompletedModule?: number; // Último módulo completado en la plataforma (1 a 14)
  levelTopic?: string; // Tema pedagógico alcanzado (ej: "Variables", "Tipos de datos")
}

export interface StudentProfile {
  sessionId?: string;
  firstName: string;
  lastName: string;
  school: string;
  course?: string;
  maxCompletedModule?: number; // Nivel educativo real
  levelTopic?: string;
}

export type QuestionCategory = 
  | 'intro'         // Módulo 1: Introducción
  | 'foundations'   // Módulo 2: Fundamentos de la programación
  | 'python_basics' // Módulo 3: ¿Qué es Python?
  | 'variables'     // Módulo 4: Variables
  | 'data_types'    // Módulo 5: Tipos de datos
  | 'arithmetic'    // Módulo 6: Operadores aritméticos
  | 'comparison'    // Módulo 7: Operadores de comparación
  | 'logical'       // Módulo 8: Operadores lógicos
  | 'print'         // Módulo 9: print()
  | 'input'         // Módulo 10: input()
  | 'conditionals'  // Módulo 11: Condicionales
  | 'loops_intro'   // Módulo 12: Introducción a loops
  | 'loops_for'     // Módulo 13: Bucle for
  | 'loops_while'   // Módulo 14: Bucle while
  | 'integration';  // Módulo 15: Integración

export type QuestionType = 
  | 'theory'
  | 'code'
  | 'concept'
  | 'code_output'
  | 'error_detection'
  | 'multiple_choice';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface MatchQuestion {
  id: string;
  moduleId: number; // Módulo educativo (1 a 15)
  topic: string; // Nombre del tema (ej: "Variables", "Condicionales")
  subtopic?: string; // Subtema específico pedagógico
  difficulty: QuestionDifficulty; // 'easy' | 'medium' | 'hard'
  category?: QuestionCategory;
  categoryLabel?: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  hint?: string;
}

export interface MatchAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSeconds: number;
  points: number; // base (100) + speed bonus (0 - 50) = max 150
}

export interface MatchPlayerState {
  playerId: string;
  playerName: string;
  avatar: string;
  school: string;
  score: number;
  correctCount: number;
  answers: Record<number, MatchAnswer>; // questionIndex -> answer
  totalTimeSeconds: number;
}

export interface ChallengeInvitation {
  id: string;
  challengerId: string;
  opponentId: string;
  betXp: number;
  questionCount: number;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface IncomingChallengeData {
  invitationId: string;
  challengerSessionId: string;
  challengerName: string;
  challengerSchool: string;
  challengerMaxModule?: number;
  wagerXp: number;
  questionCount: number;
  expiresAt: string;
}

export type MatchStatus = 'waiting' | 'countdown' | 'in_progress' | 'completed';

export interface OnlineMatch {
  id: string;
  challenger: Player;
  opponent: Player;
  betXp: number;
  questions: MatchQuestion[];
  currentQuestionIndex: number;
  challengerState: MatchPlayerState;
  opponentState: MatchPlayerState;
  status: MatchStatus;
  startedAt?: number;
  completedAt?: number;
}

export interface MatchResult {
  matchId: string;
  winnerId: string | 'tie';
  isTie: boolean;
  userScore: number;
  rivalScore: number;
  userCorrectCount: number;
  rivalCorrectCount: number;
  userTimeSeconds: number;
  rivalTimeSeconds: number;
  betXp: number;
  xpDelta: number; // e.g. +100 (net +bet if bet was deducted), -bet, or 0 if tie
  rival: Player;
  date: string;
  userMistakes: Array<{
    question: MatchQuestion;
    userSelectedOption: number;
  }>;
  tiebreakerReason?: 'correct_count' | 'time' | 'tie';
}

export interface InMatchChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  isUser: boolean;
  content: string; // Emoji o mensaje predeterminado
  timestamp: number;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  ties: number;
  matchesPlayed: number;
  currentStreak: number;
  bestStreak: number;
  totalXpWon: number;
  totalXpLost: number;
}

export type LeaderboardPeriod = 'today' | 'week' | 'month' | 'all_time';

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  fullName: string;
  school: string;
  course: string;
  avatar: string;
  wins: number;
  xpWon: number;
  streak: number;
  isUser: boolean;
}

export interface RivalConsecutiveTracker {
  consecutiveMatchesCount: number;
  lastMatchDate: string; // 'YYYY-MM-DD'
  isBlockedToday: boolean;
}
