import React from 'react';
import {
  CheckCircle2,
  Mail,
  Clock,
  Sparkles,
  AlertTriangle,
  User,
  ShieldAlert,
  HelpCircle,
  FileText,
  RotateCcw,
  Loader2,
  BookOpen
} from 'lucide-react';
import {
  TPCpem69ActiveSession,
  TPCpem69Exercise
} from '../../types/tpCpem69';

interface TPCpem69SubmittedScreenProps {
  session: TPCpem69ActiveSession;
  exercise: TPCpem69Exercise;
  onExit: () => void;
}

export const TPCpem69SubmittedScreen: React.FC<TPCpem69SubmittedScreenProps> = ({
  session,
  exercise,
  onExit
}) => {
  const isExpired = session.status === 'expired';
  const isGraded = session.status === 'graded' && session.score !== null && session.score !== undefined;
  const isGrading = session.status === 'grading' || session.status === 'submitted';
  const isOralRequired = session.auditStatus === 'oral_exam';
  const score = session.score ?? 0;
  const isApproved = score >= 6.0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-8 px-4 pb-20">
      {/* Tarjeta de Confirmación de Entrega Oficial o Expiración de Tiempo */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
        {isExpired ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        )}

        <div className="space-y-3 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isExpired ? 'Tiempo reglamentario finalizado' : '¡Entrega confirmada!'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isExpired
              ? 'El plazo de 90 minutos para completar este trabajo práctico ha finalizado. Tus respuestas guardadas han sido registradas y cerradas para revisión y evaluación docente.'
              : 'Tu trabajo práctico fue enviado correctamente. Las respuestas serán evaluadas y recibirás la devolución en tu correo electrónico.'}
          </p>
        </div>

        {/* Resumen de Datos de la Entrega */}
        <div className="max-w-lg mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Estudiante</span>
            <strong className="text-slate-900 dark:text-white">
              {session.student.studentName} {session.student.studentLastName}
            </strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Correo registrado</span>
            <strong className="text-slate-900 dark:text-white truncate block">
              {session.student.email}
            </strong>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Institución y División</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {session.student.school || session.school || 'CPEM'} – {session.student.division || session.division || '4.º año'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] font-bold uppercase">Estado de Entrega</span>
            <span className={`font-semibold ${isExpired ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {isExpired ? 'Cerrado por tiempo (90m)' : 'Entregado'}
            </span>
          </div>
        </div>
      </div>

      {/* Estado: Calificación en Proceso */}
      {isGrading && (
        <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-100">
              Evaluación pedagógica en curso
            </h3>
            <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-300 max-w-md mx-auto">
              El sistema se encuentra analizando conceptualmente tus respuestas. En unos instantes se completará la devolución o podrás consultar tu correo electrónico.
            </p>
          </div>
        </div>
      )}

      {/* Estado: Calificado */}
      {isGraded && (
        <div className="space-y-6">
          {/* Advertencia Obligatoria de Instancia Oral si corresponde */}
          {isOralRequired && (
            <div className="p-6 sm:p-7 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 space-y-3">
              <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300 font-black text-base sm:text-lg">
                <ShieldAlert className="w-6 h-6 flex-shrink-0" />
                <h2>Aviso Importante: Instancia Oral Requerida</h2>
              </div>
              <p className="text-sm font-bold leading-relaxed">
                Deberás rendir una instancia oral para verificar los conocimientos desarrollados en este trabajo práctico.
              </p>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                Tu nota calculada tiene carácter de <strong>provisoria, pendiente de verificación oral</strong> con el docente a cargo.
              </p>
            </div>
          )}

          {/* Calificación y Devolución General */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isOralRequired ? 'Nota Provisoria' : 'Calificación Obtenida'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-4xl sm:text-5xl font-black ${
                    isOralRequired
                      ? 'text-amber-600 dark:text-amber-400'
                      : isApproved
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {score.toFixed(1)}
                  </span>
                  <span className="text-slate-400 font-bold text-xl">/ 10.0</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider ${
                  isApproved
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                }`}>
                  {isApproved ? 'Aprobado' : 'No alcanzado'}
                </span>
              </div>
            </div>

            {/* Devolución de la IA */}
            {session.aiCorrection && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Devolución Pedagógica General
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                    {session.aiCorrection.general_feedback}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {session.aiCorrection.strengths && session.aiCorrection.strengths.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm space-y-2">
                      <strong className="text-emerald-800 dark:text-emerald-300 font-bold block">
                        Fortalezas demostradas:
                      </strong>
                      <ul className="list-disc list-inside space-y-1 text-emerald-900 dark:text-emerald-200">
                        {session.aiCorrection.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {session.aiCorrection.improvements && session.aiCorrection.improvements.length > 0 && (
                    <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-xs sm:text-sm space-y-2">
                      <strong className="text-sky-800 dark:text-sky-300 font-bold block">
                        Aspectos a reforzar:
                      </strong>
                      <ul className="list-disc list-inside space-y-1 text-sky-900 dark:text-sky-200">
                        {session.aiCorrection.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Desglose Pregunta por Pregunta */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Detalle por Pregunta
                  </h4>

                  {session.aiCorrection.results.map(r => {
                    const qObj = exercise.questions.find(q => q.id === r.question);
                    return (
                      <div
                        key={r.question}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-900 dark:text-white">
                            {qObj?.prompt || `Pregunta ${r.question}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${
                            r.points >= 2
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : r.points > 0
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {r.points.toFixed(1)} / 2.0 pts
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">
                          {r.feedback}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón para volver al portal */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onExit}
          className="px-6 py-3 rounded-2xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          Volver a la portada de actividades
        </button>
      </div>
    </div>
  );
};
