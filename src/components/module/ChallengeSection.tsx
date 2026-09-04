import React, { useState } from 'react';
import { OptionalChallenge, ExecutionResult } from '../../types/course';
import { useProgress } from '../../context/ProgressContext';
import { runPythonCode } from '../../services/pythonRunner';
import { validateExercise, TestEvaluationResult } from '../../services/testValidator';
import { PythonEditor } from '../editor/PythonEditor';
import { InteractiveConsole } from '../editor/InteractiveConsole';
import { HintSystem } from '../editor/HintSystem';
import { TestResultsCard } from '../editor/TestResultsCard';
import { Sparkles, Trophy, ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';

interface ChallengeSectionProps {
  challenge: OptionalChallenge;
  moduleId: number;
  onProceedToSummary: () => void;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  challenge,
  moduleId,
  onProceedToSummary
}) => {
  const { progress, completeChallenge } = useProgress();
  const [code, setCode] = useState(challenge.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [testEvaluation, setTestEvaluation] = useState<TestEvaluationResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const isCompleted = progress.completedChallenges.includes(challenge.id);

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestEvaluation(null);
    try {
      const res = await runPythonCode(code);
      setExecResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidate = async () => {
    setIsRunning(true);
    setAttemptCount(prev => prev + 1);
    try {
      const evalRes = await validateExercise(code, challenge.testCases);
      setTestEvaluation(evalRes);

      const singleRun = await runPythonCode(code, {
        inputs: challenge.testCases[0]?.inputs
      });
      setExecResult(singleRun);

      if (evalRes.allPassed) {
        completeChallenge(challenge.id, moduleId, challenge.bonusXp);
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Challenge Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 shadow-xl shadow-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-yellow-200" />
              <span>Desafío Opcional — Nivel Avanzado</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {challenge.title}
            </h2>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              ¿Querés ir un poco más allá? Los desafíos ponen a prueba tu capacidad de pensar por tu cuenta. No bloquean el curso, pero otorgan recompensas extraordinarias.
            </p>
          </div>

          <div className="text-center sm:text-right flex-shrink-0 bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <span className="text-xs text-yellow-100 font-medium block">Recompensa Extra</span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              +{challenge.bonusXp} XP
            </span>
            {isCompleted && (
              <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-xs font-bold">
                <CheckCircle2 className="w-3 h-3" />
                ¡Completado!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Consigna del desafío
            </h3>

            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-amber-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-amber-100 dark:border-slate-700">
              {challenge.description}
            </div>

            <button
              onClick={handleValidate}
              disabled={isRunning}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Validar Desafío 🧪</span>
            </button>
          </div>

          <HintSystem
            hints={challenge.hints}
            solution={challenge.solution}
            attemptCount={attemptCount}
          />

          <TestResultsCard
            evaluation={testEvaluation}
            xpAwarded={challenge.bonusXp}
          />

          <button
            onClick={onProceedToSummary}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Continuar al Resumen del Módulo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Code & Console */}
        <div className="lg:col-span-7 space-y-4">
          <PythonEditor
            code={code}
            onChange={setCode}
            onRun={handleRunCode}
            onReset={() => setCode(challenge.starterCode)}
            isRunning={isRunning}
          />

          <InteractiveConsole
            result={execResult}
            isRunning={isRunning}
            onClear={() => setExecResult(null)}
          />
        </div>

      </div>

    </div>
  );
};
