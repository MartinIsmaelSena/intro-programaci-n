import React, { useState } from 'react';
import { ChallengeResult, PythonChallenge } from '../../types/challenge';
import { sendChallengeResultToSheets, isSheetsEndpointConfigured } from '../../services/sheetsService';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Clock,
  Award,
  X,
  ExternalLink,
  MailCheck,
  Building,
  UserCheck
} from 'lucide-react';

interface ChallengeResultModalProps {
  result: ChallengeResult;
  challenge: PythonChallenge;
  isTimeUp?: boolean;
  onClose: () => void;
  onViewRanking: () => void;
}

export const ChallengeResultModal: React.FC<ChallengeResultModalProps> = ({
  result,
  challenge,
  isTimeUp = false,
  onClose,
  onViewRanking
}) => {
  const [currentResult, setCurrentResult] = useState<ChallengeResult>(result);
  const [isRetryingSync, setIsRetryingSync] = useState(false);

  const minutes = Math.floor(currentResult.durationSeconds / 60);
  const seconds = currentResult.durationSeconds % 60;
  const isPassed = currentResult.grade >= 6.0;

  const handleRetrySync = async () => {
    setIsRetryingSync(true);
    try {
      const updated = await sendChallengeResultToSheets(currentResult);
      setCurrentResult(updated);
    } finally {
      setIsRetryingSync(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Time up banner if applicable */}
        {isTimeUp && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4 text-rose-600 flex-shrink-0 animate-bounce" />
            <span>⏰ Tiempo agotado: El tiempo disponible terminó. Tu solución fue entregada y evaluada automáticamente.</span>
          </div>
        )}

        {/* Hero Score Header */}
        <div className={`p-6 sm:p-8 rounded-3xl text-center space-y-3 ${
          isPassed
            ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 text-white shadow-xl shadow-emerald-500/20'
            : 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl shadow-orange-500/20'
        }`}>
          <div className="inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Trophy className="w-10 h-10 text-yellow-200 animate-bounce" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            🎉 Resultado del Desafío
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
            <div className="bg-white/15 px-6 py-2 rounded-2xl border border-white/20">
              <span className="text-xs text-white/80 uppercase font-semibold block">Nota Final</span>
              <span className="text-4xl sm:text-5xl font-black">
                {currentResult.grade} <span className="text-xl font-normal opacity-80">/ 10</span>
              </span>
            </div>

            <div className="bg-white/15 px-6 py-2 rounded-2xl border border-white/20">
              <span className="text-xs text-white/80 uppercase font-semibold block">Puntaje Obtenido</span>
              <span className="text-4xl sm:text-5xl font-black">
                {currentResult.score} <span className="text-xl font-normal opacity-80">/ 100</span>
              </span>
            </div>
          </div>

          {/* Student metadata */}
          <div className="pt-2 text-xs font-medium text-white/90 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              {currentResult.studentName} {currentResult.studentLastName}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {currentResult.school} ({currentResult.course})
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
            </span>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            🔎 Evaluación de Pruebas y Comportamiento
          </h3>

          <div className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
            currentResult.testsFailed === 0
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            <p className="font-bold text-base flex items-center gap-2">
              {currentResult.testsFailed === 0 ? '🟢 ¡Excelente!' : '🟡 El programa funciona parcialmente.'}
            </p>
            <p>
              {currentResult.testsFailed === 0
                ? 'Tu programa resolvió correctamente todas las condiciones y reglas de negocio del problema planteado.'
                : 'Tu código resolvió algunas situaciones pero falló en ciertos casos particulares de prueba.'}
            </p>
            <div className="pt-1 font-semibold flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {currentResult.testsPassed} pruebas superadas
              </span>
              {currentResult.testsFailed > 0 && (
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  {currentResult.testsFailed} pruebas fallidas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Google Sheets / Server Sync Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Registro Central en Google Sheets
            </span>
            {currentResult.syncStatus === 'synced' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Sincronizado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                <Clock className="w-3 h-3" />
                Guardado en local
              </span>
            )}
          </div>

          {currentResult.syncStatus === 'synced' ? (
            <div className="space-y-1 text-emerald-700 dark:text-emerald-300">
              <p className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ✅ Resultado registrado correctamente en la hoja de cálculo de Google Sheets.
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <MailCheck className="w-4 h-4 text-emerald-500" />
                📧 Notificación por email enviada automáticamente al docente.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-300">
                {currentResult.syncErrorMessage || '⚠️ El resultado fue calculado correctamente, pero el envío automático quedó en espera.'}
              </p>

              {isSheetsEndpointConfigured() && (
                <button
                  onClick={handleRetrySync}
                  disabled={isRetryingSync}
                  className="py-2 px-4 rounded-xl bg-python-blue hover:bg-python-blue-light text-white font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRetryingSync ? 'animate-spin' : ''}`} />
                  <span>{isRetryingSync ? 'Reintentando envío...' : 'Reintentar envío ahora'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onViewRanking}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Ver Alumnos del Mes 🏆</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            Volver a Desafíos
          </button>
        </div>

      </div>
    </div>
  );
};
