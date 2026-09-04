import { PythonChallenge } from '../../types/challenge';
import { challenge01 } from './challenge01';

export const ALL_CHALLENGES: PythonChallenge[] = [
  challenge01
  // Futuros desafíos: challenge02, challenge03, etc.
];

export function getChallengeById(id: string): PythonChallenge | undefined {
  return ALL_CHALLENGES.find(c => c.id === id);
}
