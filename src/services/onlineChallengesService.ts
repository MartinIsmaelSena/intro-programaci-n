import {
  StudentProfile,
  PlayerStats,
  MatchResult,
  RivalConsecutiveTracker,
  MatchQuestion,
  MatchAnswer,
  Player,
  LeaderboardEntry,
  LeaderboardPeriod
} from '../types/onlineChallenge';
import { isRealtimeEnabled } from '../lib/supabase';
import {
  mockGetStoredPlayerStats,
  mockSavePlayerStats,
  mockUpdateStatsAfterMatch,
  mockGetStoredMatchHistory,
  mockAddMatchToHistory,
  mockGetTodayDateString,
  mockGetRivalConsecutiveStatus,
  mockRecordRivalMatchPlayed,
  mockSimulateRivalAnswer,
  mockSimulateInvitationResponse,
  mockGetOnlineLeaderboard
} from './mockOnlineChallengeService';
import {
  supabaseSyncPlayerProfile,
  supabaseJoinLobbyPresence,
  supabaseListenForIncomingInvitations,
  supabaseSendChallengeInvitation,
  supabaseRespondToInvitation,
  supabaseCheckDailyConsecutiveLimit,
  supabaseSubscribeToMatch,
  supabaseSubmitAnswer,
  supabaseSendChatMessage,
  supabaseReportAbandonment,
  supabaseGetLeaderboard,
  supabaseCheckMatchStatus,
  supabaseGetAuthoritativeMatchResult
} from './supabaseOnlineChallengeService';

import { validateStudentProfile } from '../utils/nameModerationUtils';

const PROFILE_KEY = 'python_online_student_profile_v1';

// ==========================================
// MODO DE EJECUCIÓN (REALTIME SUPABASE VS MOCK DEMO)
// ==========================================

export function isRealtimeModeActive(): boolean {
  return isRealtimeEnabled();
}

// ==========================================
// GESTIÓN DE PERFIL DEL ALUMNO (LOCALSTORAGE)
// ==========================================

export function getStoredStudentProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const { isValid } = validateStudentProfile(parsed);
      if (isValid) {
        return parsed;
      } else {
        console.warn('[ONLINE] Perfil en almacenamiento local inválido o con contenido no permitido. Eliminando...');
        localStorage.removeItem(PROFILE_KEY);
      }
    }
    return null;
  } catch (err) {
    console.error('Error al cargar perfil de desafío online:', err);
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    const sanitized: StudentProfile = {
      firstName: (profile.firstName || '').trim(),
      lastName: (profile.lastName || '').trim(),
      school: (profile.school || '').trim(),
      course: profile.course ? profile.course.trim() : undefined,
      maxCompletedModule: profile.maxCompletedModule,
      levelTopic: profile.levelTopic
    };

    const { isValid, errors } = validateStudentProfile(sanitized);
    if (!isValid) {
      console.error('[ONLINE] Intento de guardar perfil con datos o nombres inválidos bloqueado:', errors);
      throw new Error(errors.general || errors.firstName || errors.lastName || errors.school || 'Perfil inválido');
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));

    // Si Supabase está activo, sincronizar en la nube
    if (isRealtimeEnabled()) {
      let currentXp = 0;
      try {
        const raw = localStorage.getItem('python_progress_data');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.xp === 'number') currentXp = parsed.xp;
        }
      } catch {}

      const stats = getStoredPlayerStats();
      supabaseSyncPlayerProfile(sanitized, currentXp, stats).catch(() => {});
    }
  } catch (err) {
    console.error('Error al guardar perfil de desafío online:', err);
  }
}

// ==========================================
// ESTADÍSTICAS Y RACHAS
// ==========================================

export function getStoredPlayerStats(): PlayerStats {
  return mockGetStoredPlayerStats();
}

export function savePlayerStats(stats: PlayerStats): void {
  mockSavePlayerStats(stats);
}

export function updateStatsAfterMatch(
  result: 'win' | 'loss' | 'tie',
  betXp: number
): { stats: PlayerStats; newBadgesToAward: string[] } {
  return mockUpdateStatsAfterMatch(result, betXp);
}

// ==========================================
// HISTORIAL DE PARTIDAS
// ==========================================

export function getStoredMatchHistory(): MatchResult[] {
  return mockGetStoredMatchHistory();
}

export function addMatchToHistory(result: MatchResult): void {
  mockAddMatchToHistory(result);
}

// ==========================================
// LÍMITE DE 3 ENFRENTAMIENTOS CONSECUTIVOS POR DÍA
// ==========================================

export function getTodayDateString(): string {
  return mockGetTodayDateString();
}

export function getRivalConsecutiveStatus(rivalId: string): RivalConsecutiveTracker {
  return mockGetRivalConsecutiveStatus(rivalId);
}

export function recordRivalMatchPlayed(rivalId: string): void {
  mockRecordRivalMatchPlayed(rivalId);
}

// ==========================================
// CÁLCULO DE PUNTUACIÓN Y TIEMPO
// ==========================================

export function calculateAnswerPoints(isCorrect: boolean, timeSeconds: number): {
  basePoints: number;
  speedBonus: number;
  totalPoints: number;
} {
  if (!isCorrect) {
    return { basePoints: 0, speedBonus: 0, totalPoints: 0 };
  }

  let speedBonus = 5;
  if (timeSeconds <= 2) {
    speedBonus = 50;
  } else if (timeSeconds <= 15) {
    speedBonus = Math.max(5, Math.round(50 - (timeSeconds - 2) * 3.46));
  }

  return {
    basePoints: 100,
    speedBonus,
    totalPoints: 100 + speedBonus
  };
}

export function determineMatchWinner(
  userCorrect: number,
  rivalCorrect: number,
  _userScore: number,
  _rivalScore: number,
  userTimeSeconds: number,
  rivalTimeSeconds: number
): 'user' | 'rival' | 'tie' {
  // 1. Mayor cantidad de aciertos
  if (userCorrect > rivalCorrect) return 'user';
  if (rivalCorrect > userCorrect) return 'rival';

  // 2. Si empatan en aciertos, menor tiempo total acumulado
  const diffTime = Math.round((userTimeSeconds - rivalTimeSeconds) * 10) / 10;
  if (diffTime < 0) return 'user';
  if (diffTime > 0) return 'rival';

  // 3. Si empatan en aciertos y tiempo: Empate
  return 'tie';
}

// ==========================================
// SIMULACIÓN (MODO DEMO)
// ==========================================

export function simulateRivalAnswer(
  question: MatchQuestion,
  rival: Player,
  _questionIndex?: number
): MatchAnswer {
  return mockSimulateRivalAnswer(question, rival);
}

export function simulateInvitationResponse(
  acceptanceRate = 0.85
): Promise<{ accepted: boolean; delayMs: number }> {
  return mockSimulateInvitationResponse(acceptanceRate);
}

// ==========================================
// TABLA DE CLASIFICACIÓN / RANKINGS
// ==========================================

export async function getOnlineLeaderboardAsync(
  period: LeaderboardPeriod,
  sortBy: 'wins' | 'xp' = 'wins'
): Promise<LeaderboardEntry[]> {
  if (isRealtimeEnabled()) {
    return await supabaseGetLeaderboard(period, sortBy);
  }

  const profile = getStoredStudentProfile();
  return mockGetOnlineLeaderboard(period, sortBy, profile);
}

export function getOnlineLeaderboard(
  period: LeaderboardPeriod,
  sortBy: 'wins' | 'xp' = 'wins'
): LeaderboardEntry[] {
  if (isRealtimeEnabled()) {
    return [];
  }

  const profile = getStoredStudentProfile();
  return mockGetOnlineLeaderboard(period, sortBy, profile);
}

// ==========================================
// EXPORTACIÓN DE MÉTODOS REALTIME DE SUPABASE
// ==========================================

export {
  supabaseSyncPlayerProfile,
  supabaseJoinLobbyPresence,
  supabaseListenForIncomingInvitations,
  supabaseSendChallengeInvitation,
  supabaseRespondToInvitation,
  supabaseCheckDailyConsecutiveLimit,
  supabaseSubscribeToMatch,
  supabaseSubmitAnswer,
  supabaseSendChatMessage,
  supabaseReportAbandonment,
  supabaseCheckMatchStatus,
  supabaseGetAuthoritativeMatchResult
};
