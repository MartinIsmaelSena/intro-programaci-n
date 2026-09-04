import { PythonChallenge, ParticipantData, ChallengeResult } from '../types/challenge';
import { validateExercise } from './testValidator';

/**
 * Calculates grade on a 0 to 10 scale from a 0 to 100 score.
 * E.g., 87 points -> 8.7 (or rounded to 9 depending on display preference).
 */
export function calculateGrade(score: number): number {
  const rawGrade = score / 10;
  return Math.round(rawGrade * 10) / 10; // One decimal precision: 8.7
}

/**
 * Automatically grades a challenge submission based on test cases and configurable weights.
 */
export async function gradeChallenge(
  challenge: PythonChallenge,
  code: string,
  participant: ParticipantData,
  durationSeconds: number,
  startTime: string
): Promise<ChallengeResult> {
  const endTime = new Date().toISOString();
  
  // Run all automated test cases
  const evalResult = await validateExercise(code, challenge.testCases);
  const totalTests = challenge.testCases.length;
  const testsPassed = evalResult.passedCount;
  const testsFailed = totalTests - testsPassed;

  // Calculate score according to configurable weights (total 100 points)
  const passRatio = totalTests > 0 ? testsPassed / totalTests : 0;
  
  // 1. Correctness (e.g. 70 points)
  const correctnessScore = Math.round(passRatio * challenge.weights.correctness);
  
  // 2. Problem Solving (e.g. 20 points): awarded if student solves edge cases
  const problemSolvingScore = passRatio >= 0.5
    ? Math.round(passRatio * challenge.weights.problemSolving)
    : 0;
  
  // 3. Requirements (e.g. 10 points): full compliance if all tests pass
  const requirementsScore = evalResult.allPassed
    ? challenge.weights.requirements
    : Math.round(passRatio * (challenge.weights.requirements * 0.5));

  const totalScore = Math.min(100, Math.max(0, correctnessScore + problemSolvingScore + requirementsScore));
  const grade = calculateGrade(totalScore);
  const percentage = Math.round((totalScore / challenge.totalPoints) * 100);

  return {
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    studentName: participant.studentName.trim(),
    studentLastName: participant.studentLastName.trim(),
    school: participant.school.trim(),
    course: participant.course.trim(),
    startTime,
    endTime,
    durationSeconds,
    score: totalScore,
    grade,
    percentage,
    testsPassed,
    testsFailed,
    completed: testsPassed > 0,
    syncStatus: 'pending',
    submittedAt: new Date().toISOString()
  };
}
