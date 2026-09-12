import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, Badge } from '../types/course';
import { ALL_BADGES } from '../data/badges';
import {
  loadUserProgress,
  saveUserProgress,
  evaluateBadgesToUnlock
} from '../services/storageService';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  progress: UserProgress;
  setUserName: (name: string) => void;
  addXp: (amount: number) => void;
  recordQuizAnswer: (questionId: string, selectedOption: number, isCorrect: boolean, moduleId: number) => void;
  completeExercise: (exerciseId: string, moduleId: number, xp: number) => void;
  completeChallenge: (challengeId: string, moduleId: number, xp: number) => void;
  completeModule: (moduleId: number) => void;
  saveExerciseCode: (exerciseId: string, code: string) => void;
  toggleTheme: () => void;
  resetAllProgress: () => void;
  unlockedBadgeModal: Badge | null;
  closeBadgeModal: () => void;
  completedModuleModal: number | null;
  closeModuleModal: () => void;
  toggleExamAvailability: (examId: string) => void;
  saveExamResult: (result: any) => void;
  awardBadgeDirectly: (badgeId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [unlockedBadgeModal, setUnlockedBadgeModal] = useState<Badge | null>(null);
  const [completedModuleModal, setCompletedModuleModal] = useState<number | null>(null);

  // Sync theme to document class
  useEffect(() => {
    if (progress.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.theme]);

  // Persist whenever progress updates
  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress(prev => {
      const next = updater(prev);

      // Check for newly unlocked badges
      const newBadgeIds = evaluateBadgesToUnlock(next);
      if (newBadgeIds.length > 0) {
        const now = new Date().toISOString();
        const newlyAdded = newBadgeIds.map(id => ({ id, unlockedAt: now }));
        next.unlockedBadges = [...next.unlockedBadges, ...newlyAdded];

        // Bonus XP for badges
        let bonusXpTotal = 0;
        newBadgeIds.forEach(bid => {
          const badgeObj = ALL_BADGES.find(b => b.id === bid);
          if (badgeObj) {
            bonusXpTotal += badgeObj.xpBonus;
            setUnlockedBadgeModal(badgeObj);
          }
        });
        next.xp += bonusXpTotal;

        // Fire celebration confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti is not rendered
        }
      }

      saveUserProgress(next);
      return next;
    });
  };

  const setUserName = (name: string) => {
    updateProgress(prev => ({
      ...prev,
      userName: name.trim(),
      onboardingCompleted: true
    }));
  };

  const addXp = (amount: number) => {
    updateProgress(prev => ({
      ...prev,
      xp: Math.max(0, prev.xp + amount)
    }));
  };

  const recordQuizAnswer = (questionId: string, selectedOption: number, isCorrect: boolean, _moduleId: number) => {
    updateProgress(prev => {
      const existing = prev.answeredQuestions[questionId];
      const attempts = (existing?.attempts || 0) + 1;
      const wasAlreadyCorrect = existing?.isCorrect || false;

      // Only grant XP if first time getting it right
      const xpGain = (!wasAlreadyCorrect && isCorrect) ? 10 : 0;

      return {
        ...prev,
        xp: prev.xp + xpGain,
        answeredQuestions: {
          ...prev.answeredQuestions,
          [questionId]: {
            selectedOption,
            isCorrect,
            attempts
          }
        }
      };
    });
  };

  const completeExercise = (exerciseId: string, _moduleId: number, xp: number) => {
    updateProgress(prev => {
      if (prev.completedExercises.includes(exerciseId)) {
        return prev;
      }
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}

      return {
        ...prev,
        xp: prev.xp + xp,
        completedExercises: [...prev.completedExercises, exerciseId]
      };
    });
  };

  const completeChallenge = (challengeId: string, _moduleId: number, xp: number) => {
    updateProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) {
        return prev;
      }
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      return {
        ...prev,
        xp: prev.xp + xp,
        completedChallenges: [...prev.completedChallenges, challengeId]
      };
    });
  };

  const completeModule = (moduleId: number) => {
    updateProgress(prev => {
      if (prev.completedModules.includes(moduleId)) {
        return prev;
      }
      setCompletedModuleModal(moduleId);
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch {}

      return {
        ...prev,
        xp: prev.xp + 100,
        completedModules: [...prev.completedModules, moduleId]
      };
    });
  };

  const saveExerciseCode = (exerciseId: string, code: string) => {
    updateProgress(prev => ({
      ...prev,
      savedCode: {
        ...prev.savedCode,
        [exerciseId]: code
      }
    }));
  };

  const toggleTheme = () => {
    updateProgress(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const resetAllProgress = () => {
    localStorage.removeItem('python_desde_cero_user_progress_v1');
    const fresh = loadUserProgress();
    setProgress(fresh);
  };

  const closeBadgeModal = () => setUnlockedBadgeModal(null);
  const closeModuleModal = () => setCompletedModuleModal(null);

  /** @deprecated La disponibilidad de exámenes se gestiona en Supabase (public.exam_settings) */
  const toggleExamAvailability = (_examId: string) => {
    // No-op: Supabase es la única fuente de verdad autoritativa para la disponibilidad global
  };

  const saveExamResult = (result: any) => {
    updateProgress(prev => {
      const existing = (prev.examResults || {})[result.examId];
      const wasPassed = existing?.passed || false;
      const xpBonus = (!wasPassed && result.passed) ? 150 : 0;

      if (result.passed) {
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch {}
      }

      return {
        ...prev,
        xp: prev.xp + xpBonus,
        examResults: {
          ...(prev.examResults || {}),
          [result.examId]: result
        }
      };
    });
  };

  const awardBadgeDirectly = (badgeId: string) => {
    updateProgress(prev => {
      if (prev.unlockedBadges.some(b => b.id === badgeId)) {
        return prev;
      }
      const badgeObj = ALL_BADGES.find(b => b.id === badgeId);
      if (!badgeObj) return prev;

      setUnlockedBadgeModal(badgeObj);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      return {
        ...prev,
        xp: prev.xp + badgeObj.xpBonus,
        unlockedBadges: [
          ...prev.unlockedBadges,
          { id: badgeId, unlockedAt: new Date().toISOString() }
        ]
      };
    });
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        setUserName,
        addXp,
        recordQuizAnswer,
        completeExercise,
        completeChallenge,
        completeModule,
        saveExerciseCode,
        toggleTheme,
        resetAllProgress,
        unlockedBadgeModal,
        closeBadgeModal,
        completedModuleModal,
        closeModuleModal,
        toggleExamAvailability,
        saveExamResult,
        awardBadgeDirectly
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress debe ser utilizado dentro de un ProgressProvider');
  }
  return context;
};
