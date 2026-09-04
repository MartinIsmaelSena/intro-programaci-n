import { RankingEntry } from '../types/challenge';

export const INITIAL_MONTHLY_RANKING: RankingEntry[] = [
  {
    id: 'rank-1',
    studentName: 'Juan',
    studentLastName: 'Pérez',
    school: 'CPEM 69',
    course: '3° A',
    grade: 9.8,
    score: 98,
    timeSpentSeconds: 1540, // 25m 40s
    date: '2026-09-01',
    challengeTitle: 'Desafío de Python N.º 1'
  },
  {
    id: 'rank-2',
    studentName: 'María',
    studentLastName: 'González',
    school: 'CPEM 46',
    course: '3° B',
    grade: 9.5,
    score: 95,
    timeSpentSeconds: 1710, // 28m 30s
    date: '2026-09-02',
    challengeTitle: 'Desafío de Python N.º 1'
  },
  {
    id: 'rank-3',
    studentName: 'Pedro',
    studentLastName: 'López',
    school: 'CPEM 69',
    course: '3° A',
    grade: 9.2,
    score: 92,
    timeSpentSeconds: 1890, // 31m 30s
    date: '2026-09-02',
    challengeTitle: 'Desafío de Python N.º 1'
  },
  {
    id: 'rank-4',
    studentName: 'Lucía',
    studentLastName: 'Martínez',
    school: 'EPET 14',
    course: '4° 1ra',
    grade: 9.0,
    score: 90,
    timeSpentSeconds: 1950, // 32m 30s
    date: '2026-09-03',
    challengeTitle: 'Desafío de Python N.º 1'
  },
  {
    id: 'rank-5',
    studentName: 'Facundo',
    studentLastName: 'Romero',
    school: 'CPEM 12',
    course: '3° C',
    grade: 8.9,
    score: 89,
    timeSpentSeconds: 2040, // 34m 00s
    date: '2026-09-03',
    challengeTitle: 'Desafío de Python N.º 1'
  }
];

/**
 * Sorts ranking entries by:
 * 1. Highest grade (descending)
 * 2. Highest score (descending)
 * 3. Lowest time spent (ascending)
 */
export function sortRankingEntries(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort((a, b) => {
    if (b.grade !== a.grade) {
      return b.grade - a.grade;
    }
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });
}
