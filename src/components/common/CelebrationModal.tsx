import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Sparkles, Trophy, X } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { unlockedBadgeModal, closeBadgeModal } = useProgress();

  if (!unlockedBadgeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300 dark:border-amber-700/60 p-6 sm:p-8 text-center space-y-4 overflow-hidden">
        
        {/* Confetti / Sparkle background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-python-yellow/30 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={closeBadgeModal}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Animated Badge Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-900 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-6xl shadow-xl animate-bounce">
          {unlockedBadgeModal.icon}
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>¡Nueva Insignia Desbloqueada!</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {unlockedBadgeModal.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {unlockedBadgeModal.description}
        </p>

        <div className="py-2 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-200 font-extrabold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>+{unlockedBadgeModal.xpBonus} XP de bonificación</span>
        </div>

        <div className="pt-2">
          <button
            onClick={closeBadgeModal}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-sm shadow-md transition-all transform active:scale-98"
          >
            ¡Genial, continuar aprendiendo! 🚀
          </button>
        </div>

      </div>
    </div>
  );
};
