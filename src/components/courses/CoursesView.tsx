import React, { useState } from 'react';
import { ALL_MODULES, isModuleUnlocked } from '../../data/modulesList';
import { useProgress } from '../../context/ProgressContext';
import { CheckCircle2, Lock, Play, Clock, BookOpen, Sparkles, Filter } from 'lucide-react';

interface CoursesViewProps {
  onSelectModule: (moduleNumber: number) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos los módulos' },
  { id: 'fundamentos', label: '🌱 Fundamentos' },
  { id: 'datos', label: '📦 Datos y Variables' },
  { id: 'operadores', label: '➕ Operadores' },
  { id: 'io', label: '⌨️ Entrada y Salida' },
  { id: 'control', label: '🧠 Control y Condiciones' },
  { id: 'bucles', label: '🔁 Bucles' },
  { id: 'proyectos', label: '🚀 Proyectos Finales' }
];

export const CoursesView: React.FC<CoursesViewProps> = ({ onSelectModule }) => {
  const { progress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredModules = selectedCategory === 'all'
    ? ALL_MODULES
    : ALL_MODULES.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-python-blue via-sky-600 to-indigo-700 text-white shadow-xl shadow-python-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Plan de Estudios Completo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            📚 Curso de Python desde Cero
          </h1>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl">
            14 módulos pedagógicamente ordenados desde los conceptos más elementales hasta la integración de programas complejos.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center flex-shrink-0">
          <span className="text-xs text-sky-200 block mb-0.5">Avance general</span>
          <p className="text-3xl font-black text-white">
            {progress.completedModules.length} <span className="text-sm font-normal text-sky-200">/ 14</span>
          </p>
          <span className="text-[11px] font-bold text-sky-200">
            {Math.round((progress.completedModules.length / 14) * 100)}% completado
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition-all flex-shrink-0 border ${
              selectedCategory === cat.id
                ? 'bg-python-blue text-white border-python-blue shadow-sm dark:bg-sky-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredModules.map(m => {
          const isCompleted = progress.completedModules.includes(m.number);
          const isUnlocked = isModuleUnlocked(m.number, progress.completedModules);

          return (
            <div
              key={m.id}
              onClick={() => {
                if (isUnlocked) onSelectModule(m.number);
              }}
              className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/40 shadow-sm hover:shadow-md cursor-pointer'
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-python-blue dark:hover:border-sky-500 shadow-sm hover:shadow-md cursor-pointer'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                      {m.icon}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Módulo {m.number}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {m.title}
                      </h2>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completado
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold">
                        <Play className="w-3 h-3 fill-sky-600" />
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {m.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {m.estimatedTime}
                  </span>
                  <span>•</span>
                  <span>{m.quiz.length} preguntas</span>
                  <span>•</span>
                  <span>{m.exercises.length} ejercicios</span>
                </div>

                {isUnlocked && (
                  <span className="font-bold text-python-blue dark:text-sky-400">
                    {isCompleted ? 'Repasar →' : 'Comenzar →'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
