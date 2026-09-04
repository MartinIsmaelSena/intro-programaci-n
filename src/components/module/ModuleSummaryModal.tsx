import React from 'react';
import { CourseModule } from '../../types/course';
import { useProgress } from '../../context/ProgressContext';
import { ALL_MODULES } from '../../data/modulesList';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Star,
  BookOpen
} from 'lucide-react';

interface ModuleSummaryModalProps {
  module: CourseModule;
  onContinueNext: () => void;
  onReviewModule: () => void;
  onBackToCourse: () => void;
}

export const ModuleSummaryModal: React.FC<ModuleSummaryModalProps> = ({
  module,
  onContinueNext,
  onReviewModule,
  onBackToCourse
}) => {
  const { progress } = useProgress();

  // Calculate results for this module
  const correctQuestions = module.quiz.filter(q => progress.answeredQuestions[q.id]?.isCorrect).length;
  const completedExercises = module.exercises.filter(e => progress.completedExercises.includes(e.id)).length;
  const hasNext = module.number < ALL_MODULES.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6">
      
      {/* Celebration Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-python-blue via-sky-600 to-indigo-700 text-white p-8 text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="text-5xl inline-block filter drop-shadow animate-bounce">
            🎉
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            ¡Módulo {module.number} Completado!
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-md mx-auto">
            {module.summary.congratulationsMessage}
          </p>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Concepts Learned Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-python-blue dark:text-sky-400" />
          <span>Lo que aprendiste en este módulo:</span>
        </h3>

        <div className="space-y-2.5">
          {module.summary.conceptsLearned.map((concept, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{concept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Module Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Quizzes correctos</span>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">
            {correctQuestions} / {module.quiz.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Ejercicios superados</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {completedExercises} / {module.exercises.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">XP Total acumulado</span>
          <p className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{progress.xp}</span>
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        {hasNext ? (
          <button
            onClick={onContinueNext}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm sm:text-base shadow-lg shadow-python-blue/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <span>Continuar al siguiente módulo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onBackToCourse}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>👑 Ver Certificación y Progreso</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onReviewModule}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Repasar módulo</span>
        </button>
      </div>

    </div>
  );
};
