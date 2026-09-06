import { UserProgress } from '../types/course';
import { ALL_BADGES, calculateLevel } from '../data/badges';

const STORAGE_KEY = 'python_desde_cero_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  userName: '',
  onboardingCompleted: false,
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedModules: [],
  completedExercises: [],
  completedChallenges: [],
  answeredQuestions: {},
  unlockedBadges: [],
  savedCode: {},
  theme: 'light',
  enabledExams: [],
  examResults: {}
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };

    const parsed = JSON.parse(raw);
    // Update streak if needed
    const today = new Date().toISOString().split('T')[0];
    let streak = parsed.streakDays || 1;

    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1; // broken streak
      }
    }

    const currentXp = parsed.xp || 0;
    const currentLevelObj = calculateLevel(currentXp);

    // Migración transparente de progreso de 14 a 15 módulos (inserción de Módulo 2)
    if (!parsed.schemaVersion || parsed.schemaVersion < 2) {
      if (Array.isArray(parsed.completedModules) && parsed.completedModules.length > 0) {
        parsed.completedModules = Array.from(
          new Set(
            parsed.completedModules.map((m: number) => (m >= 2 ? m + 1 : m))
          )
        );
      }
      parsed.schemaVersion = 2;
    }

    const merged: UserProgress = {
      ...DEFAULT_PROGRESS,
      ...parsed,
      streakDays: streak,
      lastActiveDate: today,
      level: currentLevelObj.level
    };

    return merged;
  } catch (err) {
    console.error('Error al cargar progreso de localStorage:', err);
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    progress.level = calculateLevel(progress.xp).level;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error al guardar progreso en localStorage:', err);
  }
}

export function evaluateBadgesToUnlock(progress: UserProgress): string[] {
  const newlyUnlocked: string[] = [];
  const currentlyUnlocked = new Set(progress.unlockedBadges.map(b => b.id));

  // 1. first_contact: completed module 1
  if (progress.completedModules.includes(1) && !currentlyUnlocked.has('first_contact')) {
    newlyUnlocked.push('first_contact');
  }

  // 2. logic_foundations: completed module 2
  if (progress.completedModules.includes(2) && !currentlyUnlocked.has('logic_foundations')) {
    newlyUnlocked.push('logic_foundations');
  }

  // 3. python_explorer: completed module 3
  if (progress.completedModules.includes(3) && !currentlyUnlocked.has('python_explorer')) {
    newlyUnlocked.push('python_explorer');
  }

  // 4. variable_collector: completed module 4
  if (progress.completedModules.includes(4) && !currentlyUnlocked.has('variable_collector')) {
    newlyUnlocked.push('variable_collector');
  }

  // 5. type_master: completed module 5
  if (progress.completedModules.includes(5) && !currentlyUnlocked.has('type_master')) {
    newlyUnlocked.push('type_master');
  }

  // 6. math_wizard: completed module 6
  if (progress.completedModules.includes(6) && !currentlyUnlocked.has('math_wizard')) {
    newlyUnlocked.push('math_wizard');
  }

  // 7. logical_thinker: completed modules 7 and 8
  if (progress.completedModules.includes(7) && progress.completedModules.includes(8) && !currentlyUnlocked.has('logical_thinker')) {
    newlyUnlocked.push('logical_thinker');
  }

  // 8. print_master: completed module 9
  if (progress.completedModules.includes(9) && !currentlyUnlocked.has('print_master')) {
    newlyUnlocked.push('print_master');
  }

  // 9. data_input: completed module 10
  if (progress.completedModules.includes(10) && !currentlyUnlocked.has('data_input')) {
    newlyUnlocked.push('data_input');
  }

  // 10. decision_maker: completed module 11
  if (progress.completedModules.includes(11) && !currentlyUnlocked.has('decision_maker')) {
    newlyUnlocked.push('decision_maker');
  }

  // 11. loop_repeater: completed module 12
  if (progress.completedModules.includes(12) && !currentlyUnlocked.has('loop_repeater')) {
    newlyUnlocked.push('loop_repeater');
  }

  // 12. loop_tamer: completed modules 13 and 14
  if (progress.completedModules.includes(13) && progress.completedModules.includes(14) && !currentlyUnlocked.has('loop_tamer')) {
    newlyUnlocked.push('loop_tamer');
  }

  // 13. problem_solver: completed module 15
  if (progress.completedModules.includes(15) && !currentlyUnlocked.has('problem_solver')) {
    newlyUnlocked.push('problem_solver');
  }

  // 14. challenge_seeker: 2+ challenges completed
  if (progress.completedChallenges.length >= 2 && !currentlyUnlocked.has('challenge_seeker')) {
    newlyUnlocked.push('challenge_seeker');
  }

  // 15. full_pythonista: 15 modules completed
  if (progress.completedModules.length >= 15 && !currentlyUnlocked.has('full_pythonista')) {
    newlyUnlocked.push('full_pythonista');
  }

  return newlyUnlocked;
}
