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
import { MOCK_ONLINE_PLAYERS } from '../data/onlinePlayers';

const STATS_KEY = 'python_online_challenge_stats_v1';
const HISTORY_KEY = 'python_online_challenge_history_v1';
const RIVAL_TRACKER_KEY = 'python_online_rival_history_v1';

const DEFAULT_STATS: PlayerStats = {
  wins: 0,
  losses: 0,
  ties: 0,
  matchesPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalXpWon: 0,
  totalXpLost: 0
};

export function mockGetStoredPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error al cargar estadísticas mock online:', err);
    return { ...DEFAULT_STATS };
  }
}

export function mockSavePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error al guardar estadísticas mock online:', err);
  }
}

export function mockUpdateStatsAfterMatch(
  result: 'win' | 'loss' | 'tie',
  betXp: number
): { stats: PlayerStats; newBadgesToAward: string[] } {
  const current = mockGetStoredPlayerStats();
  const next: PlayerStats = { ...current };

  next.matchesPlayed += 1;

  if (result === 'win') {
    next.wins += 1;
    next.currentStreak += 1;
    next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
    next.totalXpWon += betXp;
  } else if (result === 'loss') {
    next.losses += 1;
    next.currentStreak = 0;
    next.totalXpLost += betXp;
  } else {
    next.ties += 1;
  }

  mockSavePlayerStats(next);

  const newBadgesToAward: string[] = [];
  if (next.currentStreak >= 3) newBadgesToAward.push('online_streak_3');
  if (next.currentStreak >= 5) newBadgesToAward.push('online_streak_5');
  if (next.currentStreak >= 10) newBadgesToAward.push('online_streak_10');

  return { stats: next, newBadgesToAward };
}

export function mockGetStoredMatchHistory(): MatchResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al cargar historial mock online:', err);
    return [];
  }
}

export function mockAddMatchToHistory(result: MatchResult): void {
  try {
    const history = mockGetStoredMatchHistory();
    const updated = [result, ...history].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error al guardar partida en historial mock:', err);
  }
}

interface RivalTrackerStore {
  [rivalId: string]: {
    consecutiveMatchesCount: number;
    lastMatchDate: string;
  };
}

export function mockGetTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function mockGetRivalConsecutiveStatus(rivalId: string): RivalConsecutiveTracker {
  try {
    const raw = localStorage.getItem(RIVAL_TRACKER_KEY);
    const store: RivalTrackerStore = raw ? JSON.parse(raw) : {};
    const entry = store[rivalId];
    const today = mockGetTodayDateString();

    if (!entry) {
      return { consecutiveMatchesCount: 0, lastMatchDate: '', isBlockedToday: false };
    }

    if (entry.lastMatchDate !== today) {
      return { consecutiveMatchesCount: 0, lastMatchDate: entry.lastMatchDate, isBlockedToday: false };
    }

    return {
      consecutiveMatchesCount: entry.consecutiveMatchesCount,
      lastMatchDate: entry.lastMatchDate,
      isBlockedToday: entry.consecutiveMatchesCount >= 3
    };
  } catch (err) {
    console.error('Error al verificar estado mock de rival:', err);
    return { consecutiveMatchesCount: 0, lastMatchDate: '', isBlockedToday: false };
  }
}

export function mockRecordRivalMatchPlayed(rivalId: string): void {
  try {
    const raw = localStorage.getItem(RIVAL_TRACKER_KEY);
    const store: RivalTrackerStore = raw ? JSON.parse(raw) : {};
    const today = mockGetTodayDateString();
    const entry = store[rivalId];

    if (!entry || entry.lastMatchDate !== today) {
      store[rivalId] = { consecutiveMatchesCount: 1, lastMatchDate: today };
    } else {
      store[rivalId] = {
        consecutiveMatchesCount: entry.consecutiveMatchesCount + 1,
        lastMatchDate: today
      };
    }

    localStorage.setItem(RIVAL_TRACKER_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Error al registrar enfrentamiento mock con rival:', err);
  }
}

export function mockSimulateRivalAnswer(
  question: MatchQuestion,
  rival: Player
): MatchAnswer {
  const accuracy = rival.accuracyRate ?? 0.8;
  const avgTime = rival.avgResponseTimeSeconds ?? 3.5;

  const timeSeconds = Math.max(1.8, Math.round((avgTime + (Math.random() * 2.4 - 1.2)) * 10) / 10);
  const isCorrect = Math.random() < accuracy;
  let selectedOption = question.correctAnswer ?? Math.floor(Math.random() * (question.options?.length || 4));

  if (!isCorrect) {
    const wrongOptions = [0, 1, 2, 3].filter(idx => idx !== selectedOption);
    selectedOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  }

  let speedBonus = 5;
  if (timeSeconds <= 2) {
    speedBonus = 50;
  } else if (timeSeconds <= 15) {
    speedBonus = Math.max(5, Math.round(50 - (timeSeconds - 2) * 3.46));
  }

  const points = isCorrect ? 100 + speedBonus : 0;

  return {
    questionId: question.id,
    selectedOption,
    isCorrect,
    timeSeconds,
    points
  };
}

export function mockSimulateInvitationResponse(
  acceptanceRate = 0.85
): Promise<{ accepted: boolean; delayMs: number }> {
  const delayMs = Math.floor(1500 + Math.random() * 1000);
  const accepted = Math.random() < acceptanceRate;

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ accepted, delayMs });
    }, delayMs);
  });
}

export function mockGetOnlineLeaderboard(
  period: LeaderboardPeriod,
  sortBy: 'wins' | 'xp' = 'wins',
  profile: StudentProfile | null
): LeaderboardEntry[] {
  const stats = mockGetStoredPlayerStats();
  const periodFactor = period === 'today' ? 0.25 : period === 'week' ? 1 : period === 'month' ? 3.5 : 8;

  const entries: LeaderboardEntry[] = MOCK_ONLINE_PLAYERS.map(p => {
    const wins = Math.round(p.wins * (period === 'all_time' ? 1.8 : period === 'today' ? Math.max(1, Math.round(p.wins * 0.2)) : p.wins));
    const xpWon = Math.round((p.xp + p.wins * 35) * (period === 'all_time' ? 2 : periodFactor));
    return {
      rank: 1,
      playerId: p.id,
      fullName: `${p.firstName} ${p.lastName}`,
      school: p.school,
      course: p.course,
      avatar: p.avatar,
      wins,
      xpWon,
      streak: p.streak,
      isUser: false
    };
  });

  if (profile) {
    entries.push({
      rank: 1,
      playerId: 'user_player',
      fullName: `${profile.firstName} ${profile.lastName}`,
      school: profile.school,
      course: profile.course || 'Estudiante',
      avatar: '🧑‍🎓',
      wins: stats.wins,
      xpWon: stats.totalXpWon,
      streak: stats.currentStreak,
      isUser: true
    });
  }

  if (sortBy === 'wins') {
    entries.sort((a, b) => b.wins - a.wins || b.xpWon - a.xpWon);
  } else {
    entries.sort((a, b) => b.xpWon - a.xpWon || b.wins - a.wins);
  }

  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}
