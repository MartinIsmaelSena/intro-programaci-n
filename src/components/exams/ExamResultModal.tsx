import React from 'react';
import { ExamResult, Exam } from '../../types/exam';
import { CheckCircle2, XCircle, Trophy, Clock, ArrowRight, RotateCcw, X, Award } from 'lucide-react';

interface ExamResultModalProps {
  result: ExamResult;
  exam: Exam;
  onClose: () => void;
  onRetake: () => void;
}

export const ExamResultModal: React.FC<ExamResultModalProps> = ({
  result,
  exam,
  onClose,
  onRetake
}) => {
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Score Header */}
        <div className={`p-6 sm:p-8 rounded-3xl text-center space-y-3 ${
          result.passed
            ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 text-white shadow-lg shadow-emerald-500/20'
            : 'bg-gradient-to-br from-amber-500 via-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20'
        }`}>
          <div className="inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            {result.passed ? (
              <Trophy className="w-10 h-10 text-yellow-200 animate-bounce" />
            ) : (
              <RotateCcw className="w-10 h-10 text-white" />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {result.passed ? '¡Felicitaciones! Examen Aprobado' : 'Examen Finalizado'}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl sm:text-6xl font-black">
              {result.totalScore}
            </span>
            <span className="text-2xl font-bold opacity-80">/ 100 pts</span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-white/90 max-w-md mx-auto">
            {result.passed
              ? `Has demostrado un sólido dominio sobre ${exam.title}. ¡Sumaste +150 XP de bonificación!`
              : `Se requiere un mínimo de 60 puntos para aprobar. Revisa los conceptos de los módulos y vuelve a intentarlo cuando estés listo.`}
          </p>

          <div className="pt-1 flex items-center justify-center gap-4 text-xs font-semibold text-white/80">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Tiempo: {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {result.passed ? 'Condición: Aprobado (>= 60)' : 'Condición: No alcanzado (< 60)'}
            </span>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Desglose por secciones evaluadas:
          </h3>

          <div className="space-y-2.5">
            {result.sectionScores.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {sec.name}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sec.feedback}
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className={`font-black text-sm ${
                    sec.obtainedPoints === sec.maxPoints
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : sec.obtainedPoints > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-500 dark:text-rose-400'
                  }`}>
                    {sec.obtainedPoints} / {sec.maxPoints} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
          >
            Volver al Portal de Exámenes
          </button>
          
          <button
            onClick={onRetake}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Rendir nuevamente</span>
          </button>
        </div>

      </div>
    </div>
  );
};
