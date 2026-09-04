import { TestCase } from './course';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface ParticipantData {
  studentName: string;
  studentLastName: string;
  school: string;
  course: string;
}

export interface ChallengeWeights {
  correctness: number; // e.g. 70 points
  problemSolving: number; // e.g. 20 points
  requirements: number; // e.g. 10 points
}

export interface PythonChallenge {
  id: string;
  number: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  available: boolean;
  difficulty: ChallengeDifficulty;
  modality: string;
  targetObjective: string;
  starterCode: string;
  solution: string;
  weights: ChallengeWeights;
  totalPoints: number;
  testCases: TestCase[];
}

export interface ChallengeResult {
  challengeId: string;
  challengeTitle: string;
  studentName: string;
  studentLastName: string;
  school: string;
  course: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  score: number; // 0 to 100
  grade: number; // 0 to 10 (e.g. 8.7 or 9)
  percentage: number;
  testsPassed: number;
  testsFailed: number;
  completed: boolean;
  syncStatus: 'synced' | 'pending' | 'failed';
  syncErrorMessage?: string;
  submittedAt: string;
}

export interface ActiveChallengeSession {
  challengeId: string;
  participant: ParticipantData;
  startTimestamp: number; // Date.now()
  durationMinutes: number;
  currentCode: string;
}

export interface RankingEntry {
  id: string;
  studentName: string;
  studentLastName: string;
  school: string;
  course: string;
  grade: number; // 0 to 10
  score: number; // 0 to 100
  timeSpentSeconds: number;
  date: string;
  challengeTitle: string;
}
