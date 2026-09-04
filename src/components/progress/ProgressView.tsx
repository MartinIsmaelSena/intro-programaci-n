import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ALL_MODULES } from '../../data/modulesList';
import { ALL_BADGES, calculateLevel, getNextLevel } from '../../data/badges';
import {
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Code2,
  Trophy,
  Star,
  Award,
  Flame,
  ArrowUpRight
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { progress } = useProgress();

  const totalModules = ALL_MODULES.length;
  const completedModulesCount = progress.completedModules.length;
  const moduleCompletionPercent = Math.round((completedModulesCount / totalModules) * 100);

  // Total exercises across course
  const totalExercises = ALL_MODULES.reduce((acc, m) => acc + m.exercises.length, 0);
  const completedExercisesCount = progress.completedExercises.length;
  const exerciseCompletionPercent = Math.round((completedExercisesCount / totalExercises) * 100);

  // Questions stats
  const totalQuestions = ALL_MODULES.reduce((acc, m) => acc + m.quiz.length, 0);
  const answeredEntries = Object.values(progress.answeredQuestions);
  const answeredCount = answeredEntries.length;
  const correctCount = answeredEntries.filter(q => q.isCorrect).length;
  const accuracyPercent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Level & XP calculation
  const currentLevel = calculateLevel(progress.xp);
  const nextLevel = getNextLevel(currentLevel.level);
  const xpNeeded = nextLevel ? nextLevel.minXp - progress.xp : 0;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-python-blue text-white shadow-xl shadow-sky-600/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Métricas de Aprendizaje</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              📊 Mi Progreso Detallado
            </h1>
            <p className="text-sm sm:text-base text-sky-100 max-w-xl">
              Aquí puedes auditar tu avance global, nivel de aciertos en ejercicios y camino hacia el siguiente rango de maestría.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
            <span className="text-xs text-sky-200 block mb-0.5">Rango Actual</span>
            <p className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
              <span>{currentLevel.icon}</span>
              <span>{currentLevel.title}</span>
            </p>
            {nextLevel && (
              <span className="text-[11px] text-sky-200 block mt-1">
                Faltan {xpNeeded} XP para {nextLevel.title}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Módulos del Curso</span>
            <CheckCircle2 className="w-4 h-4 text-python-blue" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {completedModulesCount} <span className="text-sm font-normal text-slate-400">/ {totalModules}</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-python-blue rounded-full"
              style={{ width: `${moduleCompletionPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">{moduleCompletionPercent}% completado</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Ejercicios Prácticos</span>
            <Code2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {completedExercisesCount} <span className="text-sm font-normal text-slate-400">/ {totalExercises}</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${exerciseCompletionPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">{exerciseCompletionPercent}% de código resuelto</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Tasa de Acierto en Quizzes</span>
            <HelpCircle className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {accuracyPercent}%
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${accuracyPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">{correctCount} respuestas acertadas</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Desafíos & Insignias</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {progress.completedChallenges.length} <span className="text-sm font-normal text-slate-400">desafíos</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold pt-1">
            <Award className="w-4 h-4" />
            <span>{progress.unlockedBadges.length} insignias obtenidas</span>
          </div>
          <span className="text-[11px] text-slate-500">{progress.xp} XP totales</span>
        </div>

      </div>

      {/* Module Breakdown Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Desglose de avance por módulo
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="pb-3 pr-4">Módulo</th>
                <th className="pb-3 px-4">Quizzes</th>
                <th className="pb-3 px-4">Ejercicios</th>
                <th className="pb-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {ALL_MODULES.map(m => {
                const isCompleted = progress.completedModules.includes(m.number);
                const quizScore = m.quiz.filter(q => progress.answeredQuestions[q.id]?.isCorrect).length;
                const exCount = m.exercises.filter(e => progress.completedExercises.includes(e.id)).length;

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{m.icon}</span>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            Módulo {m.number}: {m.title}
                          </span>
                          <span className="text-xs text-slate-400">{m.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {quizScore} / {m.quiz.length}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {exCount} / {m.exercises.length}
                    </td>

                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          100%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          {Math.round(((quizScore + exCount) / (m.quiz.length + (m.exercises.length || 1))) * 100)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
