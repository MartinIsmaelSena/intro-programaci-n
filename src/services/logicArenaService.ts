import {
  LogicArenaQuestion,
  LogicArenaProgress,
  LogicCategory,
  LogicDifficulty
} from '../types/logicArena';
import { LOGIC_ARENA_QUESTIONS } from '../data/logicArenaQuestions';

const BASE_ARENA_KEY = 'python_logic_arena_v1';

function getStorageKey(userName?: string): string {
  const sanitized = (userName || 'anonymous')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  return `${BASE_ARENA_KEY}_${sanitized}`;
}

const DEFAULT_CATEGORY_STATS: Record<LogicCategory, { total: number; correct: number }> = {
  comparisons: { total: 0, correct: 0 },
  boolean_logic: { total: 0, correct: 0 },
  variables: { total: 0, correct: 0 },
  reassignment: { total: 0, correct: 0 },
  code_tracing: { total: 0, correct: 0 },
  error_detection: { total: 0, correct: 0 },
  combined_logic: { total: 0, correct: 0 }
};

export function getDefaultLogicArenaProgress(): LogicArenaProgress {
  return {
    answeredQuestions: {},
    totalAnswered: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    categoryStats: { ...DEFAULT_CATEGORY_STATS },
    totalXpEarned: 0
  };
}

export function getLogicArenaProgress(userName?: string): LogicArenaProgress {
  try {
    const key = getStorageKey(userName);
    const raw = localStorage.getItem(key);
    if (!raw) return getDefaultLogicArenaProgress();
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultLogicArenaProgress(),
      ...parsed,
      categoryStats: {
        ...DEFAULT_CATEGORY_STATS,
        ...(parsed.categoryStats || {})
      }
    };
  } catch (err) {
    console.error('Error al cargar progreso de la Arena de Lógica:', err);
    return getDefaultLogicArenaProgress();
  }
}

export function saveLogicArenaProgress(progress: LogicArenaProgress, userName?: string): void {
  try {
    const key = getStorageKey(userName);
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (err) {
    console.error('Error al guardar progreso de la Arena de Lógica:', err);
  }
}

export interface RecordAnswerResult {
  progress: LogicArenaProgress;
  isCorrect: boolean;
  xpEarned: number;
  newlyUnlockedBadges: string[];
}

export function recordLogicArenaAnswer(
  question: LogicArenaQuestion,
  selectedOption: number,
  userName?: string
): RecordAnswerResult {
  const isCorrect = selectedOption === question.correctAnswer;
  const current = getLogicArenaProgress(userName);

  const prevRecord = current.answeredQuestions[question.id];
  const attempts = (prevRecord ? prevRecord.attempts : 0) + 1;

  // Actualizar mapa de respuestas
  current.answeredQuestions[question.id] = {
    isCorrect,
    lastOption: selectedOption,
    attempts
  };

  current.totalAnswered += 1;

  let xpEarned = 0;
  const newlyUnlockedBadges: string[] = [];

  if (isCorrect) {
    current.totalCorrect += 1;
    current.currentStreak += 1;
    if (current.currentStreak > current.bestStreak) {
      current.bestStreak = current.currentStreak;
    }

    // Puntos de XP base según dificultad
    const baseXp = question.difficulty === 'desafio' ? 25 : question.difficulty === 'medio' ? 20 : 15;
    // Bonificación de racha (hasta +10 XP extra)
    const streakBonus = Math.min(10, current.currentStreak * 2);
    xpEarned = baseXp + streakBonus;
    current.totalXpEarned += xpEarned;

    // Actualizar estadística de categoría
    const cat = question.category;
    if (!current.categoryStats[cat]) {
      current.categoryStats[cat] = { total: 0, correct: 0 };
    }
    current.categoryStats[cat].total += 1;
    current.categoryStats[cat].correct += 1;

    // Evaluación de insignias
    if (current.totalCorrect === 1) {
      newlyUnlockedBadges.push('logic_arena_first');
    }
    if (current.totalCorrect === 15) {
      newlyUnlockedBadges.push('logic_arena_erudito');
    }
    if (current.totalCorrect === 30 || current.bestStreak === 10) {
      newlyUnlockedBadges.push('logic_arena_master');
    }
  } else {
    current.currentStreak = 0;
    const cat = question.category;
    if (!current.categoryStats[cat]) {
      current.categoryStats[cat] = { total: 0, correct: 0 };
    }
    current.categoryStats[cat].total += 1;
  }

  saveLogicArenaProgress(current, userName);

  return {
    progress: current,
    isCorrect,
    xpEarned,
    newlyUnlockedBadges
  };
}

/**
 * Filtra preguntas por categoría y dificultad
 */
export function getFilteredArenaQuestions(
  category?: LogicCategory | 'all',
  difficulty?: LogicDifficulty | 'all'
): LogicArenaQuestion[] {
  return LOGIC_ARENA_QUESTIONS.filter(q => {
    if (category && category !== 'all' && q.category !== category) return false;
    if (difficulty && difficulty !== 'all' && q.difficulty !== difficulty) return false;
    return true;
  });
}

/**
 * Obtiene un conjunto de preguntas aleatorias para una ronda de desafío
 */
export function getRandomArenaRoundQuestions(
  count: number = 10,
  category?: LogicCategory | 'all'
): LogicArenaQuestion[] {
  const pool = getFilteredArenaQuestions(category, 'all');
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
