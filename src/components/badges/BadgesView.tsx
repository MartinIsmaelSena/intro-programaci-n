import React, { useState } from 'react';
import { ALL_BADGES } from '../../data/badges';
import { useProgress } from '../../context/ProgressContext';
import { Badge } from '../../types/course';
import { Trophy, CheckCircle2, Lock, Sparkles, X, Calendar } from 'lucide-react';

export const BadgesView: React.FC = () => {
  const { progress } = useProgress();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedMap = new Map(
    progress.unlockedBadges.map(b => [b.id, b.unlockedAt])
  );

  const unlockedCount = progress.unlockedBadges.length;
  const totalBadges = ALL_BADGES.length;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-900 shadow-xl shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Sistema de Recompensas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            🏆 Mis Insignias y Logros
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-800/90 max-w-xl">
            Cada hito, módulo completado y desafío superado te otorga insignias exclusivas para celebrar tu crecimiento como programador.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm text-center flex-shrink-0">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
            Insignias desbloqueadas
          </span>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {unlockedCount} <span className="text-sm font-normal text-slate-400">/ {totalBadges}</span>
          </p>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {Math.round((unlockedCount / totalBadges) * 100)}% de maestría
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_BADGES.map(badge => {
          const isUnlocked = unlockedMap.has(badge.id);
          const unlockedDate = unlockedMap.get(badge.id);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group p-5 rounded-3xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950 ring-2 ring-amber-300 dark:ring-amber-700'
                      : 'bg-slate-200 dark:bg-slate-800 grayscale'
                  }`}>
                    {badge.icon}
                  </div>

                  <div>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Desbloqueada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-[11px] font-medium">
                        <Lock className="w-3 h-3" />
                        Bloqueada
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {badge.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  +{badge.xpBonus} XP
                </span>
                <span className="text-[11px] text-slate-400 group-hover:underline">
                  Ver detalles →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
            
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-5xl shadow-md">
                {selectedBadge.icon}
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Recompensa: <strong className="text-amber-600 dark:text-amber-400 font-bold">+{selectedBadge.xpBonus} XP</strong>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-center text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              {selectedBadge.description}
            </div>

            {/* How to unlock */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                ¿Qué se necesita para obtenerla?
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {selectedBadge.requirementText}
              </p>
            </div>

            {/* Date if unlocked */}
            {unlockedMap.has(selectedBadge.id) ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Obtenida el: <strong>{new Date(unlockedMap.get(selectedBadge.id)!).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Esta insignia aún se encuentra bloqueada. ¡Continúa aprendiendo para desbloquearla!</span>
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
