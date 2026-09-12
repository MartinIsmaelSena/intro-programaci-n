import React from 'react';
import { Trophy, Star, Flame, ArrowRight, RotateCcw, X, Award } from 'lucide-react';
import { LogicRoundSummary } from '../../types/logicArena';
import { ALL_BADGES } from '../../data/badges';

interface LogicArenaSummaryModalProps {
  summary: LogicRoundSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onRestartRound: () => void;
}

export const LogicArenaSummaryModal: React.FC<LogicArenaSummaryModalProps> = ({
  summary,
  isOpen,
  onClose,
  onRestartRound
}) => {
  if (!isOpen || !summary) return null;

  const percentage = Math.round((summary.correctCount / Math.max(1, summary.totalQuestions)) * 100);
  const isPerfect = summary.correctCount === summary.totalQuestions && summary.totalQuestions > 0;
  const isGood = percentage >= 70;

  const unlockedBadgeObjects = summary.unlockedBadgeIds
    .map(id => ALL_BADGES.find(b => b.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-5 overflow-hidden">
        
        {/* Resplandor de celebración */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/15 dark:bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón X de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar resumen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícono de Trofeo / Medalla */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-2 border-purple-300 dark:border-purple-700/60 flex items-center justify-center text-4xl shadow-lg">
          {isPerfect ? '👑' : isGood ? '🏆' : '🧠'}
        </div>

        {/* Títulos */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {isPerfect ? '¡Ronda Perfecta!' : isGood ? '¡Excelente Razonamiento!' : '¡Buen Entrenamiento!'}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Resultados del Desafío
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isPerfect
              ? '¡Impecable! No tuviste ningún error de lógica en toda la ronda.'
              : isGood
              ? 'Dominás con solidez las comparaciones y el trazado de código.'
              : 'La práctica constante es el secreto para dominar la programación.'}
          </p>
        </div>

        {/* Estadísticas de la ronda */}
        <div className="grid grid-cols-3 gap-2.5 py-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Aciertos</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {summary.correctCount} / {summary.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 block">{percentage}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">XP Ganado</span>
            <span className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              +{summary.xpEarned}
            </span>
            <span className="text-[10px] text-slate-400 block">Puntos</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Mejor Racha</span>
            <span className="text-xl font-black text-rose-500 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-rose-400 text-rose-500" />
              {summary.streakReached}
            </span>
            <span className="text-[10px] text-slate-400 block">seguidas</span>
          </div>
        </div>

        {/* Insignias desbloqueadas si hubo */}
        {unlockedBadgeObjects.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Award className="w-4 h-4" />
              <span>¡Nueva insignia desbloqueada en esta sesión!</span>
            </div>
            {unlockedBadgeObjects.map(badge => (
              <div key={badge!.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                <span className="text-lg">{badge!.icon}</span>
                <span>{badge!.title} (+{badge!.xpBonus} XP)</span>
              </div>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="pt-2 space-y-2">
          <button
            onClick={onRestartRound}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar otra ronda</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            Volver a la Arena principal
          </button>
        </div>

      </div>
    </div>
  );
};
