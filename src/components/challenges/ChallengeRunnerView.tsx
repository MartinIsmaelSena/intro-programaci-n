import React, { useState, useEffect, useRef } from 'react';
import { PythonChallenge, ParticipantData, ChallengeResult } from '../../types/challenge';
import { gradeChallenge } from '../../services/challengeService';
import { sendChallengeResultToSheets } from '../../services/sheetsService';
import { runPythonCode } from '../../services/pythonRunner';
import { PythonEditor } from '../editor/PythonEditor';
import { InteractiveConsole } from '../editor/InteractiveConsole';
import { ChallengeResultModal } from './ChallengeResultModal';
import { ExecutionResult } from '../../types/course';
import {
  Clock,
  Send,
  User,
  Building,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ChallengeRunnerViewProps {
  challenge: PythonChallenge;
  participant: ParticipantData;
  onExit: () => void;
  onViewRanking: () => void;
}

const SESSION_STORAGE_KEY = 'python_desde_cero_active_challenge_session_v1';

export const ChallengeRunnerView: React.FC<ChallengeRunnerViewProps> = ({
  challenge,
  participant,
  onExit,
  onViewRanking
}) => {
  const totalDurationSeconds = challenge.durationMinutes * 60;

  // Initialize or restore session timestamp from localStorage
  const getInitialRemainingSeconds = () => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.challengeId === challenge.id && parsed.startTimestamp) {
          const elapsed = Math.floor((Date.now() - parsed.startTimestamp) / 1000);
          const remaining = totalDurationSeconds - elapsed;
          return Math.max(0, remaining);
        }
      }
    } catch {}
    
    // New session
    const newSession = {
      challengeId: challenge.id,
      participant,
      startTimestamp: Date.now(),
      durationMinutes: challenge.durationMinutes
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    return totalDurationSeconds;
  };

  const [secondsRemaining, setSecondsRemaining] = useState<number>(getInitialRemainingSeconds);
  const [code, setCode] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(`${SESSION_STORAGE_KEY}_code_${challenge.id}`);
      return raw || challenge.starterCode;
    } catch {
      return challenge.starterCode;
    }
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Save code changes in localStorage
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      localStorage.setItem(`${SESSION_STORAGE_KEY}_code_${challenge.id}`, newCode);
    } catch {}
  };

  // Robust countdown timer: updates against real Date.now()
  useEffect(() => {
    if (challengeResult) return; // Stop timer if already submitted

    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          const elapsed = Math.floor((Date.now() - session.startTimestamp) / 1000);
          const remaining = totalDurationSeconds - elapsed;

          if (remaining <= 0) {
            clearInterval(interval);
            setSecondsRemaining(0);
            setIsTimeUp(true);
            handleAutoSubmit();
          } else {
            setSecondsRemaining(remaining);
          }
        }
      } catch {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [challengeResult]);

  const handleAutoSubmit = async () => {
    if (isSubmitting || challengeResult) return;
    setIsSubmitting(true);
    await finalizeSubmission(true);
  };

  const handleManualSubmit = async () => {
    setShowConfirmSubmit(false);
    setIsSubmitting(true);
    await finalizeSubmission(false);
  };

  const finalizeSubmission = async (timeUp: boolean) => {
    const elapsedSeconds = totalDurationSeconds - secondsRemaining;
    let startTimeStr = new Date().toISOString();
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        startTimeStr = new Date(s.startTimestamp).toISOString();
      }
    } catch {}

    // 1. Grade the code automatically
    const initialResult = await gradeChallenge(
      challenge,
      code,
      participant,
      elapsedSeconds,
      startTimeStr
    );

    // 2. Try sending to Google Sheets
    const syncedResult = await sendChallengeResultToSheets(initialResult);

    // 3. Clear active session so timer doesn't linger
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(`${SESSION_STORAGE_KEY}_code_${challenge.id}`);
    } catch {}

    setChallengeResult(syncedResult);
    setIsSubmitting(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonCode(code);
      setExecResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 300; // <= 5 minutes

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans animate-fadeIn">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Challenge Title & Participant */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>🚀</span>
                <span>Modo Desafío de Programación</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {challenge.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <User className="w-3.5 h-3.5 text-python-blue" />
                {participant.studentName} {participant.studentLastName}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {participant.school} ({participant.course})
              </span>
            </div>
          </div>

          {/* Right: Timer & Submit Action */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              isLowTime
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
            }`}>
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Entregar Desafío</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-h-[calc(100vh-8.5rem)] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-python-blue dark:text-sky-400 uppercase tracking-wider">
                Consigna del problema
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                100 puntos totales
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
              {challenge.fullDescription}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/40 border border-amber-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-amber-800 dark:text-amber-300 block">
                💡 Pautas de evaluación:
              </span>
              <p>• Tu código será evaluado automáticamente con múltiples casos de prueba al momento de la entrega.</p>
              <p>• Utiliza el botón <strong>"Ejecutar Código"</strong> para probar tu programa interactivamente con la terminal.</p>
              <p>• No se permiten pistas durante el desafío.</p>
            </div>

          </div>
        </div>

        {/* Right Column: Python Editor & Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <PythonEditor
              code={code}
              onChange={handleCodeChange}
              onRun={handleRunCode}
              onReset={() => handleCodeChange(challenge.starterCode)}
              isRunning={isRunning}
            />

            <InteractiveConsole
              result={execResult}
              isRunning={isRunning}
              onClear={() => setExecResult(null)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[11px]">Enter</kbd> para ejecutar
            </span>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isSubmitting}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Entregar mi Solución</span>
            </button>
          </div>
        </div>

      </main>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
            <div className="space-y-2 text-center">
              <span className="text-4xl">🚀</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                ¿Deseas entregar tu solución?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Una vez confirmada la entrega, tu código será evaluado automáticamente con los casos de prueba y se registrará tu nota oficial.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                {isSubmitting ? 'Evaluando...' : 'Sí, entregar ahora'}
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Seguir editando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {challengeResult && (
        <ChallengeResultModal
          result={challengeResult}
          challenge={challenge}
          isTimeUp={isTimeUp}
          onClose={onExit}
          onViewRanking={onViewRanking}
        />
      )}

    </div>
  );
};
