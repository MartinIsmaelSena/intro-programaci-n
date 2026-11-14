import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Code2,
  FileText,
  User,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  TPCpem69ActiveSession,
  TPCpem69Exercise
} from '../../types/tpCpem69';

interface TPCpem69WorkspaceProps {
  session: TPCpem69ActiveSession;
  exercise: TPCpem69Exercise;
  onAutoSave: (answers: Record<string, string>) => Promise<boolean>;
  onSubmit: (answers: Record<string, string>) => Promise<void>;
  isSubmitting: boolean;
  saveStatus: 'saved' | 'saving' | 'error';
}

export const TPCpem69Workspace: React.FC<TPCpem69WorkspaceProps> = ({
  session,
  exercise,
  onAutoSave,
  onSubmit,
  isSubmitting,
  saveStatus: initialSaveStatus
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(() => session.answers || {});
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>(initialSaveStatus);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isTimeExpired, setIsTimeExpired] = useState(false);

  // 1. Cronómetro sincronizado con el deadline del servidor
  const calculateRemainingSeconds = useCallback(() => {
    const deadlineMs = new Date(session.deadlineAt).getTime();
    const nowMs = Date.now();
    const remaining = Math.floor((deadlineMs - nowMs) / 1000);
    return Math.max(0, remaining);
  }, [session.deadlineAt]);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(calculateRemainingSeconds);

  // Ref para debounce de auto-guardado
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestAnswersRef = useRef<Record<string, string>>(answers);
  latestAnswersRef.current = answers;

  // Actualización del temporizador
  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateRemainingSeconds();
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        setIsTimeExpired(true);
        // Entrega obligatoria al vencer el tiempo si aún no se entregó
        if (!isSubmitting) {
          onSubmit(latestAnswersRef.current);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [calculateRemainingSeconds, isSubmitting, onSubmit]);

  // Formato HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejador del cambio de texto con debounce de 1000ms
  const handleAnswerChange = (questionId: number, text: string) => {
    if (isTimeExpired || isSubmitting) return;

    const updated = {
      ...answers,
      [String(questionId)]: text
    };
    setAnswers(updated);
    setSaveStatus('saving');

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const ok = await onAutoSave(updated);
        setSaveStatus(ok ? 'saved' : 'error');
      } catch {
        setSaveStatus('error');
      }
    }, 1000);
  };

  // Conteo de preguntas respondidas (no vacías)
  const answeredCount = exercise.questions.filter(q => {
    const ans = answers[String(q.id)] || answers[q.id];
    return ans && ans.trim().length > 0;
  }).length;

  const isUrgent = secondsRemaining <= 300; // Últimos 5 minutos
  const isCritical = secondsRemaining <= 60; // Último minuto

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-4 px-4 pb-24">
      {/* Barra de Encabezado Superior Fija con Datos del Alumno y Cronómetro */}
      <header className="sticky top-2 z-30 p-4 sm:p-5 rounded-3xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              {session.student.school || session.school || 'Institución'} – {session.student.division || session.division || '4.º año'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Ejercicio {exercise.number} de 5
            </span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <User className="w-4 h-4 text-python-blue" />
            <span>{session.student.studentName} {session.student.studentLastName}</span>
            <span className="text-xs text-slate-400 font-normal">({session.student.email})</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          {/* Indicador de Auto-guardado */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="text-amber-300">Guardando...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Guardado</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-300">Error al guardar</span>
              </>
            )}
          </div>

          {/* Reloj Regresivo sincronizado con el Servidor */}
          <div
            className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm sm:text-base flex items-center gap-2 shadow-inner transition-colors ${
              isCritical
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : isUrgent
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <Clock className={`w-4 h-4 ${isUrgent ? 'animate-bounce' : 'text-sky-400'}`} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Botón de Entrega Directo */}
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting || isTimeExpired}
            className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Entregar TP</span>
          </button>
        </div>
      </header>

      {/* Alerta de Tiempo Agotado */}
      {isTimeExpired && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-200 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>
            El tiempo límite de 90 minutos ha finalizado. La evaluación se ha bloqueado y se procederá con la entrega de tus respuestas registradas.
          </span>
        </div>
      )}

      {/* Bloque de Ejercicio y Código Python */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-python-blue dark:text-sky-400">
              Consigna Oficial Asignada
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {exercise.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Progreso:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold ${
              answeredCount === 5
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
            }`}>
              {answeredCount} de 5 respondidas
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {exercise.description}
        </p>

        {/* Visualizador de Código Python con Estilo Editor */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 text-slate-100 font-mono text-sm sm:text-base">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-sans font-semibold">
              <Code2 className="w-4 h-4 text-python-blue" />
              <span>programa.py</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <div className="p-5 overflow-x-auto">
            <pre className="text-sky-300 leading-relaxed whitespace-pre font-mono">
              {exercise.pythonCode}
            </pre>
          </div>
        </div>
      </section>

      {/* Preguntas Escritas Obligatorias */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
          <FileText className="w-5 h-5 text-python-blue" />
          <h2>Preguntas para responder (2.0 puntos cada una)</h2>
        </div>

        {exercise.questions.map((q, idx) => {
          const currentAnswer = answers[String(q.id)] || answers[q.id] || '';
          const hasContent = currentAnswer.trim().length > 0;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                hasContent
                  ? 'border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'border-amber-300 dark:border-amber-800/80 shadow-md shadow-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <label
                  htmlFor={`question-${q.id}`}
                  className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug cursor-pointer"
                >
                  {q.prompt}
                </label>

                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">
                  2.0 pts
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Escribí tu explicación clara y razonada. No dejes el campo vacío.
              </p>

              <div className="relative">
                <textarea
                  id={`question-${q.id}`}
                  rows={4}
                  value={currentAnswer}
                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                  disabled={isTimeExpired || isSubmitting}
                  placeholder="Escribí aquí tu respuesta detallada..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm sm:text-base font-sans focus:outline-none focus:ring-2 focus:ring-python-blue transition-all resize-y min-h-[110px]"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                  <span>
                    {hasContent ? (
                      <span className="text-emerald-500 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Respuesta registrada</span>
                      </span>
                    ) : (
                      <span className="text-amber-500 font-medium">
                        Pendiente de respuesta
                      </span>
                    )}
                  </span>
                  <span>{currentAnswer.length} caracteres</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Botón de Entrega Inferior */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg">¿Listo para finalizar?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Comprobá haber respondido las 5 preguntas antes de realizar la entrega definitiva.
          </p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isSubmitting || isTimeExpired}
          className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer flex-shrink-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Entregando y corrigiendo...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Entregar trabajo práctico</span>
            </>
          )}
        </button>
      </div>

      {/* Modal de Confirmación de Entrega Definitiva */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Confirmar entrega definitiva
                </h3>
                <span className="text-xs text-slate-500">
                  Trabajo práctico CPEM N.º 69 – 4.º A
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Has respondido <strong>{answeredCount} de 5 preguntas</strong>.
              </p>

              {answeredCount < 5 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                  ⚠️ Tenés {5 - answeredCount} pregunta(s) sin responder. Las preguntas vacías recibirán 0 puntos.
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Al confirmar la entrega, se bloquearán todas las respuestas y el sistema iniciará la corrección automática mediante Inteligencia Artificial. No se permiten nuevas entregas.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Volver a revisar
              </button>

              <button
                type="button"
                onClick={async () => {
                  setShowConfirmModal(false);
                  await onSubmit(answers);
                }}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Entregando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar entrega</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
