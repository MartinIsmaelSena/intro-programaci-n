import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ALL_MODULES } from '../../data/modulesList';
import { QuizQuestion } from '../../types/course';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface ReviewViewProps {
  onSelectModule: (moduleNumber: number) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ onSelectModule }) => {
  const { progress, recordQuizAnswer } = useProgress();

  // Find all questions that were answered incorrectly at least once or are still not correct
  const missedQuestions: Array<{ question: QuizQuestion; moduleId: number }> = [];

  ALL_MODULES.forEach(m => {
    m.quiz.forEach(q => {
      const record = progress.answeredQuestions[q.id];
      if (record && !record.isCorrect) {
        missedQuestions.push({ question: q, moduleId: m.number });
      }
    });
  });

  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const handleSelect = (qId: string, optIdx: number) => {
    setSelectedOptions(prev => ({ ...prev, [qId]: optIdx }));
    setVerifiedMap(prev => ({ ...prev, [qId]: false }));
  };

  const handleVerify = (q: QuizQuestion, moduleId: number) => {
    const selected = selectedOptions[q.id];
    if (selected === undefined) return;
    const isCorrect = selected === q.correctAnswer;
    setVerifiedMap(prev => ({ ...prev, [q.id]: true }));
    recordQuizAnswer(q.id, selected, isCorrect, moduleId);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-python-blue text-white shadow-xl shadow-indigo-600/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repaso Inteligente</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            🔄 Centro de Repaso y Refuerzo
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
            Refuerza los conceptos en los que tuviste dudas para consolidar tu aprendizaje sin penalizaciones.
          </p>
        </div>
      </div>

      {/* Counter card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
            {missedQuestions.length}
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {missedQuestions.length === 0
                ? '¡No tienes preguntas pendientes de repasar!'
                : `Tienes ${missedQuestions.length} pregunta${missedQuestions.length > 1 ? 's' : ''} para repasar`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {missedQuestions.length === 0
                ? 'Has resuelto correctamente todas las preguntas que respondiste hasta el momento.'
                : 'Reintenta aquellas que tuvieron alguna dificultad inicial para sumar XP.'}
            </p>
          </div>
        </div>
      </div>

      {/* Missed Questions List */}
      {missedQuestions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Preguntas a reforzar:
          </h2>

          {missedQuestions.map(({ question, moduleId }, qIndex) => {
            const selected = selectedOptions[question.id];
            const isSubmitted = verifiedMap[question.id];
            const isAnswerCorrect = selected === question.correctAnswer;

            return (
              <div
                key={question.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-python-blue dark:text-sky-400">
                    Módulo {moduleId}
                  </span>
                  <span>Pregunta de refuerzo #{qIndex + 1}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-2">
                  {question.options.map((optText, optIdx) => {
                    const isChoice = selected === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(question.id, optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${
                          isChoice
                            ? 'border-python-blue bg-sky-50 dark:bg-sky-950/40 text-python-blue dark:text-sky-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span>{optText}</span>
                        {isSubmitted && optIdx === question.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                        {isSubmitted && isChoice && !isAnswerCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action button */}
                {!isSubmitted && (
                  <button
                    onClick={() => handleVerify(question, moduleId)}
                    disabled={selected === undefined}
                    className="py-2 px-4 rounded-xl bg-python-blue hover:bg-python-blue-light disabled:opacity-40 text-white font-bold text-xs transition-colors"
                  >
                    Verificar respuesta
                  </button>
                )}

                {/* Feedback */}
                {isSubmitted && (
                  <div className={`p-4 rounded-xl text-xs space-y-2 ${
                    isAnswerCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300'
                  }`}>
                    <p className="font-bold">
                      {isAnswerCorrect ? '✅ ¡Correcto! +10 XP' : '❌ Aún no es la respuesta correcta'}
                    </p>
                    <p>{isAnswerCorrect ? question.explanation : `Pista: ${question.hint}`}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Quick shortcuts to modules */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          📚 Repasar módulos anteriores
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Puedes volver a cualquiera de los módulos que ya has completado para releer la teoría o resolver los ejercicios nuevamente:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_MODULES.slice(0, 6).map(m => (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.number)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-python-blue flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{m.icon}</span>
                <span>Módulo {m.number}: {m.title}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-python-blue transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
