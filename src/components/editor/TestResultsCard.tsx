import React from 'react';
import { TestEvaluationResult } from '../../services/testValidator';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface TestResultsCardProps {
  evaluation: TestEvaluationResult | null;
  xpAwarded: number;
}

export const TestResultsCard: React.FC<TestResultsCardProps> = ({
  evaluation,
  xpAwarded
}) => {
  if (!evaluation) return null;

  return (
    <div className={`rounded-2xl p-4 border transition-all duration-300 animate-fadeIn ${
      evaluation.allPassed
        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
    }`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-current/10">
        <div className="flex items-center gap-2">
          {evaluation.allPassed ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base text-emerald-800 dark:text-emerald-200">
                  🎉 ¡Prueba superada con éxito!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Todas las pruebas ({evaluation.passedCount}/{evaluation.totalCount}) produjeron el resultado esperado.
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base text-rose-800 dark:text-rose-200">
                  Casi 👍 El programa todavía no produce el resultado esperado
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  Superadas {evaluation.passedCount} de {evaluation.totalCount} pruebas. Revisa las pistas o la salida de consola.
                </p>
              </div>
            </>
          )}
        </div>

        {evaluation.allPassed && (
          <div className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>+{xpAwarded} XP</span>
          </div>
        )}
      </div>

      {/* Individual Test Cases */}
      <div className="space-y-2 mt-3 text-xs">
        {evaluation.results.map((res, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 ${
              res.passed
                ? 'bg-white/80 dark:bg-slate-900/60 border-emerald-200 dark:border-emerald-900/60'
                : 'bg-white/80 dark:bg-slate-900/60 border-rose-200 dark:border-rose-900/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${res.passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                  {res.passed ? '✔' : '✖'} {res.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  — {res.expectedDescription}
                </span>
              </div>

              {!res.passed && (
                <p className="text-rose-600 dark:text-rose-400 text-[11px] font-mono leading-relaxed">
                  {res.feedbackMessage}
                </p>
              )}
            </div>

            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              res.passed
                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
            }`}>
              {res.passed ? 'PASÓ' : 'FALLÓ'}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
