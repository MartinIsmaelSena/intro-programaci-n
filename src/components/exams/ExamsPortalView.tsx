import React, { useState } from 'react';
import { ALL_EXAMS, isExamAvailable } from '../../data/exams/examsList';
import { Exam } from '../../types/exam';
import { useProgress } from '../../context/ProgressContext';
import { ExamRunnerView } from './ExamRunnerView';
import {
  FileText,
  Lock,
  Play,
  Clock,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const ExamsPortalView: React.FC = () => {
  const { progress, toggleExamAvailability } = useProgress();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [teacherMode, setTeacherMode] = useState(false);

  const enabledExams = progress.enabledExams || [];
  const examResults = progress.examResults || {};

  if (activeExam) {
    return (
      <ExamRunnerView
        exam={activeExam}
        onExit={() => setActiveExam(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-python-blue text-white shadow-xl shadow-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Ciclo de Aprendizaje Continuo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            📝 Exámenes Modulares por Bloques
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Los exámenes evalúan únicamente <strong>2 o 3 módulos consecutivos</strong> para acompañar tu progreso paso a paso:
            <span className="block mt-1 font-semibold text-sky-300">
              Aprender ➔ Practicar ➔ Evaluar ➔ Continuar aprendiendo
            </span>
          </p>
        </div>

        {/* Teacher Mode Control Toggle */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 flex-shrink-0 text-center">
          <span className="text-xs font-semibold text-slate-300">
            Panel de Disponibilidad
          </span>
          
          <button
            onClick={() => setTeacherMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              teacherMode
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {teacherMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span>Modo Profesor: {teacherMode ? 'ACTIVO' : 'Desactivado'}</span>
          </button>
          
          <span className="text-[10px] text-slate-400">
            {teacherMode ? 'Puedes habilitar/bloquear cada examen' : 'Permite habilitar exámenes'}
          </span>
        </div>
      </div>

      {/* Information Alert Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-sky-900 dark:text-sky-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-python-blue dark:text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Límites conceptuales estrictos:</strong>
          Cada examen evalúa exclusivamente los conocimientos del bloque correspondiente. No se exigirán conceptos de temas posteriores (como condicionales o bucles antes de haber sido enseñados).
        </div>
      </div>

      {/* Exams Grid */}
      <div className="space-y-4">
        {ALL_EXAMS.map(exam => {
          const available = isExamAvailable(exam, enabledExams);
          const result = examResults[exam.id];

          return (
            <div
              key={exam.id}
              className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                available
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-python-blue dark:hover:border-sky-500'
                  : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-75'
              }`}
            >
              <div className="space-y-3 max-w-2xl">
                
                {/* Header tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                    {exam.title}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    {exam.durationMinutes} minutos
                  </span>

                  {available ? (
                    result ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        result.passed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        <Trophy className="w-3 h-3" />
                        Calificado: {result.totalScore}/100 pts ({result.passed ? 'Aprobado' : 'No alcanzado'})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        <Play className="w-3 h-3 fill-emerald-600" />
                        Disponible para rendir
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800">
                      <Lock className="w-3 h-3" />
                      🔒 Próximamente
                    </span>
                  )}
                </div>

                {/* Subtitle & Description */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {exam.subtitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                {/* Module badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exam.moduleTitles.map((modTitle, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-slate-800/80 text-sky-800 dark:text-sky-300 text-[11px] font-semibold border border-sky-100 dark:border-slate-700"
                    >
                      {modTitle}
                    </span>
                  ))}
                </div>

              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end justify-center gap-2.5 flex-shrink-0">
                {available ? (
                  <button
                    onClick={() => setActiveExam(exam)}
                    className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
                  >
                    <span>{result ? 'Rendir de nuevo' : 'Comenzar Examen (40 min)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="py-3 px-6 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Bloqueado (Próximamente)</span>
                  </button>
                )}

                {/* Teacher Mode Toggle Button */}
                {teacherMode && (
                  <button
                    onClick={() => toggleExamAvailability(exam.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      available
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    <span>{available ? '🔒 Bloquear examen' : '🔓 Habilitar examen'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Future Final Exam Teaser */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <span>🎓 Arquitectura Preparada</span>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Examen Final Integrador del Curso
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Evaluará una selección amplia de los 14 módulos al completar todos los bloques. La plataforma ya cuenta con la arquitectura para integrarlo cuando esté listo.
        </p>
      </div>

    </div>
  );
};
