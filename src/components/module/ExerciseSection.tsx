import React, { useState, useEffect } from 'react';
import { Exercise, ExecutionResult } from '../../types/course';
import { useProgress } from '../../context/ProgressContext';
import { runPythonCode } from '../../services/pythonRunner';
import { validateExercise, TestEvaluationResult } from '../../services/testValidator';
import { PythonEditor } from '../editor/PythonEditor';
import { InteractiveConsole } from '../editor/InteractiveConsole';
import { HintSystem } from '../editor/HintSystem';
import { TestResultsCard } from '../editor/TestResultsCard';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Tag
} from 'lucide-react';

interface ExerciseSectionProps {
  exercises: Exercise[];
  moduleId: number;
  onProceedToChallenge?: () => void;
  onProceedToSummary?: () => void;
}

const DIFFICULTY_MAP = {
  starter: { label: '🟢 Nivel 1 — Inicial', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300' },
  basic: { label: '🟡 Nivel 2 — Básico', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300' },
  intermediate: { label: '🟠 Nivel 3 — Intermedio', color: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-300' },
  challenge: { label: '🔴 Nivel 4 — Desafío', color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300' }
};

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exercises,
  moduleId,
  onProceedToChallenge,
  onProceedToSummary
}) => {
  const { progress, completeExercise, saveExerciseCode } = useProgress();

  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const currentEx = exercises[currentExerciseIdx];

  // User code state (restored from savedCode if available, else starterCode)
  const [code, setCode] = useState<string>(() => {
    return progress.savedCode[currentEx.id] ?? currentEx.starterCode;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [testEvaluation, setTestEvaluation] = useState<TestEvaluationResult | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  // Sync code whenever exercise changes
  useEffect(() => {
    const saved = progress.savedCode[currentEx.id];
    setCode(saved !== undefined ? saved : currentEx.starterCode);
    setExecResult(null);
    setTestEvaluation(null);
    setAttemptCount(0);
  }, [currentEx.id]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    saveExerciseCode(currentEx.id, newCode);
  };

  const handleResetCode = () => {
    setCode(currentEx.starterCode);
    saveExerciseCode(currentEx.id, currentEx.starterCode);
    setExecResult(null);
    setTestEvaluation(null);
  };

  // Run code directly
  const handleRunCode = async () => {
    setIsRunning(true);
    setTestEvaluation(null);
    try {
      const res = await runPythonCode(code);
      setExecResult(res);
    } catch (err: any) {
      setExecResult({
        stdout: '',
        stderr: String(err),
        success: false,
        executionTimeMs: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Validate code against test cases
  const handleValidate = async () => {
    setIsRunning(true);
    setAttemptCount(prev => prev + 1);
    try {
      const evaluation = await validateExercise(code, currentEx.testCases);
      setTestEvaluation(evaluation);

      // Also update console with the first test run output for visibility
      const singleRun = await runPythonCode(code, {
        inputs: currentEx.testCases[0]?.inputs
      });
      setExecResult(singleRun);

      if (evaluation.allPassed) {
        completeExercise(currentEx.id, moduleId, currentEx.xp);
      }
    } catch (err: any) {
      console.error('Error al validar ejercicio:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const isCompleted = progress.completedExercises.includes(currentEx.id);
  const totalCompletedInModule = exercises.filter(e => progress.completedExercises.includes(e.id)).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Exercise Selection Carousel / Tabs */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-python-blue dark:text-sky-400" />
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Laboratorio de Programación
            </span>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {totalCompletedInModule} de {exercises.length} resueltos
          </span>
        </div>

        {/* Exercises Badges Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {exercises.map((ex, idx) => {
            const exDone = progress.completedExercises.includes(ex.id);
            const isSelected = idx === currentExerciseIdx;

            return (
              <button
                key={ex.id}
                onClick={() => setCurrentExerciseIdx(idx)}
                className={`flex-shrink-0 px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-python-blue text-white border-python-blue shadow-md scale-105'
                    : exDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span>{ex.number}.</span>
                <span className="max-w-[100px] truncate">{ex.title}</span>
                {exDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Exercise Layout: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Instructions & Hints (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Exercise Info Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_MAP[currentEx.difficulty].color}`}>
                {DIFFICULTY_MAP[currentEx.difficulty].label}
              </span>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-yellow-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-yellow-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{currentEx.xp} XP</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                EJERCICIO {currentEx.number} DE {exercises.length}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {currentEx.title}
              </h3>
            </div>

            {/* Real World Context Pill */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Tag className="w-3.5 h-3.5 text-python-blue dark:text-sky-400 flex-shrink-0" />
              <span><strong>Contexto:</strong> {currentEx.realWorldContext}</span>
            </div>

            {/* Prompt Description */}
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-sky-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-sky-100 dark:border-slate-700">
              {currentEx.description}
            </div>

            {/* Test Validation Button */}
            <div className="pt-2">
              <button
                onClick={handleValidate}
                disabled={isRunning}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Comprobar solución 🧪</span>
              </button>
            </div>

          </div>

          {/* Progressive Hint System */}
          <HintSystem
            hints={currentEx.hints}
            solution={currentEx.solution}
            attemptCount={attemptCount}
          />

          {/* Test Evaluation Card */}
          <TestResultsCard
            evaluation={testEvaluation}
            xpAwarded={currentEx.xp}
          />

        </div>

        {/* Right Column: Code Editor & Live Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <PythonEditor
            code={code}
            onChange={handleCodeChange}
            onRun={handleRunCode}
            onReset={handleResetCode}
            isRunning={isRunning}
          />

          <InteractiveConsole
            result={execResult}
            isRunning={isRunning}
            onClear={() => setExecResult(null)}
          />

          {/* Navigation between exercises */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentExerciseIdx(prev => Math.max(0, prev - 1))}
              disabled={currentExerciseIdx === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Ejercicio anterior
            </button>

            {currentExerciseIdx < exercises.length - 1 ? (
              <button
                onClick={() => setCurrentExerciseIdx(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-python-blue hover:bg-python-blue-light text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Siguiente ejercicio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : onProceedToChallenge ? (
              <button
                onClick={onProceedToChallenge}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span>🚀 Ver Desafío Opcional</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : onProceedToSummary ? (
              <button
                onClick={onProceedToSummary}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span>🎉 Completar Módulo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

        </div>

      </div>

    </div>
  );
};
