import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ALL_MODULES, isModuleUnlocked } from '../../data/modulesList';
import { CheckCircle2, Lock, Play, ArrowRight, Sparkles } from 'lucide-react';

interface RoadmapViewProps {
  onSelectModule: (moduleNumber: number) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectModule }) => {
  const { progress } = useProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-python-blue/10 dark:bg-sky-950 text-python-blue dark:text-sky-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-python-yellow" />
          <span>Progreso Secuencial y Gradual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          🗺️ Mi camino en Python
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Un sendero paso a paso diseñado para llevarte desde tus primeros pasos lógicos hasta programar tus propias aplicaciones.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-python-blue before:via-sky-400 before:to-slate-300 dark:before:to-slate-800">
        
        {ALL_MODULES.map((m, index) => {
          const isCompleted = progress.completedModules.includes(m.number);
          const isUnlocked = isModuleUnlocked(m.number, progress.completedModules);
          const isCurrent = isUnlocked && !isCompleted;

          return (
            <div key={m.id} className="relative group">
              
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-6 sm:-left-10 top-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-md transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : isCurrent
                    ? 'bg-python-blue text-white ring-4 ring-sky-100 dark:ring-sky-950 animate-bounce'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 ring-4 ring-slate-100 dark:ring-slate-900'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : isCurrent ? (
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white ml-0.5" />
                ) : (
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>

              {/* Module Card */}
              <div
                onClick={() => {
                  if (isUnlocked) onSelectModule(m.number);
                }}
                className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/40 shadow-sm hover:shadow-md cursor-pointer'
                    : isCurrent
                    ? 'bg-white dark:bg-slate-900 border-2 border-python-blue dark:border-sky-500 shadow-lg shadow-python-blue/10 cursor-pointer'
                    : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
                      {m.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          MÓDULO {m.number}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          ⏱️ {m.estimatedTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-python-blue dark:group-hover:text-sky-400 transition-colors">
                        {m.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {isCompleted ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completado
                      </span>
                    ) : isCurrent ? (
                      <button
                        onClick={() => onSelectModule(m.number)}
                        className="px-4 py-2 rounded-xl bg-python-blue hover:bg-python-blue-light text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
                      >
                        <span>Comenzar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>

                </div>

                {/* Sub-steps tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    📖 Teoría
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    🧠 {m.quiz.length} preguntas
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    💻 {m.exercises.length} ejercicios
                  </span>
                  {m.optionalChallenge && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium">
                      ⭐ Desafío +{m.optionalChallenge.bonusXp} XP
                    </span>
                  )}
                </div>

              </div>

              {/* Connecting arrow if not last */}
              {index < ALL_MODULES.length - 1 && (
                <div className="hidden sm:flex justify-center my-1 text-slate-300 dark:text-slate-700">
                  ↓
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};
