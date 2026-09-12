import React, { useState, useEffect, useCallback } from 'react';
import { ALL_EXAMS, isExamAvailable } from '../../data/exams/examsList';
import { Exam, ExamEvaluationResult, ExamAttemptRecord } from '../../types/exam';
import { useProgress } from '../../context/ProgressContext';
import { ExamRunnerView } from './ExamRunnerView';
import { EXAM01_ATTEMPTS_STORAGE_KEY } from '../../data/exams/exam01_block1';
import { supabase } from '../../lib/supabase';
import {
  getTeacherAuthState,
  logoutTeacher,
  fetchRemoteExamAttempts,
  TeacherAuthState,
  AUTHORIZED_TEACHER_EMAIL
} from '../../services/teacherAuthService';
import {
  fetchExamSettings,
  updateExamSetting,
  subscribeToExamSettings,
  DEFAULT_EXAM_SETTINGS
} from '../../services/examSettingsService';
import { TeacherLoginModal } from './TeacherLoginModal';
import {
  FileText,
  Lock,
  Unlock,
  Play,
  Clock,
  Trophy,
  ShieldCheck,
  ArrowRight,
  Users,
  X,
  Database,
  LogOut,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const ExamsPortalView: React.FC = () => {
  const { progress } = useProgress();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  
  // Disponibilidad Global autoritativa en Supabase (public.exam_settings)
  const [examSettings, setExamSettings] = useState<Record<string, boolean>>(DEFAULT_EXAM_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [updatingExamId, setUpdatingExamId] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Estado autenticado del docente (Supabase Auth)
  const [teacherAuth, setTeacherAuth] = useState<TeacherAuthState>({
    isAuthenticated: false,
    email: null,
    loading: true
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showTeacherResultsModal, setShowTeacherResultsModal] = useState(false);
  
  // Resultados remotos desde Supabase
  const [remoteAttempts, setRemoteAttempts] = useState<ExamAttemptRecord[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [resultsTab, setResultsTab] = useState<'remote' | 'local'>('remote');

  const examResults = progress.examResults || {};

  // 1. Carga inicial de disponibilidad global desde Supabase
  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoadingSettings(true);
      const settings = await fetchExamSettings();
      if (mounted) {
        setExamSettings(settings);
        setLoadingSettings(false);
      }
    }

    loadSettings();

    // Suscripción Realtime para reflejar aperturas/bloqueos inmediatamente en todos los alumnos
    const unsubscribe = subscribeToExamSettings(freshSettings => {
      if (mounted) {
        setExamSettings(freshSettings);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Verifica la sesión del docente contra Supabase Auth
  const refreshAuthState = useCallback(async () => {
    const state = await getTeacherAuthState();
    setTeacherAuth(state);
  }, []);

  useEffect(() => {
    refreshAuthState();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshAuthState();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAuthState]);

  // 3. Manejo de cambio de disponibilidad (Solo Docente Autorizado)
  const handleToggleExamAvailability = async (examId: string, currentStatus: boolean) => {
    if (!teacherAuth.isAuthenticated) return;

    setUpdatingExamId(examId);
    setSettingsError(null);
    const newStatus = !currentStatus;

    // Actualización optimista inmediata en la UI
    setExamSettings(prev => ({ ...prev, [examId]: newStatus }));

    const res = await updateExamSetting(examId, newStatus);
    if (!res.success) {
      // Revertir si hubo error en Supabase (ej: bloqueo por RLS)
      setExamSettings(prev => ({ ...prev, [examId]: currentStatus }));
      setSettingsError(res.error || 'No se pudo actualizar el examen en la base de datos.');
    }
    setUpdatingExamId(null);
  };

  // 4. Carga de intentos remotos desde Supabase (protegidos por RLS)
  const loadRemoteAttempts = async () => {
    setLoadingRemote(true);
    setRemoteError(null);
    try {
      const res = await fetchRemoteExamAttempts();
      if (res.success) {
        setRemoteAttempts(res.data);
      } else {
        setRemoteError(res.error || 'No se pudieron consultar los exámenes remotos.');
      }
    } catch (err: any) {
      setRemoteError(err.message || 'Error de conexión con la base de datos.');
    } finally {
      setLoadingRemote(false);
    }
  };

  useEffect(() => {
    if (showTeacherResultsModal && teacherAuth.isAuthenticated) {
      loadRemoteAttempts();
    }
  }, [showTeacherResultsModal, teacherAuth.isAuthenticated]);

  const getLocalAttempts = (): ExamEvaluationResult[] => {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(EXAM01_ATTEMPTS_STORAGE_KEY);
      if (!raw) return [];
      const map = JSON.parse(raw);
      const list: ExamEvaluationResult[] = [];
      Object.values(map).forEach(attempts => {
        if (Array.isArray(attempts)) {
          list.push(...(attempts as ExamEvaluationResult[]));
        }
      });
      return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    } catch {
      return [];
    }
  };

  const localAttempts = showTeacherResultsModal ? getLocalAttempts() : [];

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
            Los exámenes evalúan de forma integral los conocimientos adquiridos para acompañar tu progreso paso a paso:
            <span className="block mt-1 font-semibold text-sky-300">
              Aprender ➔ Practicar ➔ Evaluar ➔ Continuar aprendiendo
            </span>
          </p>
        </div>

        {/* Teacher Mode Control Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-2 flex-shrink-0 text-center min-w-[200px]">
          <span className="text-xs font-semibold text-slate-300">
            Panel de Disponibilidad
          </span>
          
          {teacherAuth.loading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Verificando permisos...</span>
            </div>
          ) : teacherAuth.isAuthenticated ? (
            <div className="space-y-2 w-full">
              <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                <span>Docente Verificado</span>
              </div>

              <div className="text-[10px] font-mono text-sky-200 truncate max-w-[180px] mx-auto" title={teacherAuth.email || ''}>
                {teacherAuth.email}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => setShowTeacherResultsModal(true)}
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-python-blue" />
                  <span>Resultados</span>
                </button>

                <button
                  onClick={async () => {
                    await logoutTeacher();
                    await refreshAuthState();
                  }}
                  title="Cerrar sesión de Docente"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white border border-white/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-amber-200/80 block">
                Disponibilidad global en Supabase
              </span>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Acceso Docente</span>
              </button>
              
              <span className="text-[10px] text-slate-400 block">
                Protegido por Supabase Auth
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error alert if updating settings failed */}
      {settingsError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{settingsError}</span>
          </div>
          <button
            onClick={() => setSettingsError(null)}
            className="text-rose-500 hover:text-rose-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Information Alert Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-sky-900 dark:text-sky-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-python-blue dark:text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Límites conceptuales estrictos:</strong>
          Cada examen evalúa exclusivamente los conocimientos del bloque correspondiente. No se exigirán conceptos de temas posteriores (como listas, diccionarios o bucles complejos antes de haber sido enseñados).
        </div>
      </div>

      {/* Exams Grid */}
      <div className="space-y-4">
        {ALL_EXAMS.map(exam => {
          // Fuente de verdad: Mapa global de Supabase (examSettings)
          const available = isExamAvailable(exam, examSettings);
          const result = examResults[exam.id];
          const isToggling = updatingExamId === exam.id;

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

                  {loadingSettings ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Consultando disponibilidad...
                    </span>
                  ) : available ? (
                    result ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        result.passed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}>
                        <Trophy className="w-3 h-3" />
                        Calificado: {result.totalScore > 10 ? (result.totalScore / 10).toFixed(1) : result.totalScore}/10 ({result.passed ? 'Aprobado' : 'No alcanzado'})
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
                      🔒 Bloqueado por el Profesor
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
                    <span>Bloqueado por el Docente</span>
                  </button>
                )}

                {/* Teacher Mode Toggle Button (Solo visible para docente autenticado) */}
                {teacherAuth.isAuthenticated && (
                  <button
                    disabled={isToggling}
                    onClick={() => handleToggleExamAvailability(exam.id, available)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 ${
                      available
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : available ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                    <span>{available ? 'Bloquear examen' : 'Habilitar examen'}</span>
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
          Evaluará una selección amplia de los módulos al completar todos los bloques. La plataforma ya cuenta con la arquitectura para integrarlo cuando esté listo.
        </p>
      </div>

      {/* Modal de Resultados de Exámenes para Docentes */}
      {showTeacherResultsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-python-blue/10 dark:bg-sky-500/20 text-python-blue dark:text-sky-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Resultados de Exámenes — Panel Docente
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Docente autenticado: <strong className="font-mono text-slate-700 dark:text-slate-300">{AUTHORIZED_TEACHER_EMAIL}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTeacherResultsModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Tab selector & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                  <button
                    onClick={() => setResultsTab('remote')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      resultsTab === 'remote'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-python-blue" />
                    <span>Nube Supabase ({remoteAttempts.length})</span>
                  </button>

                  <button
                    onClick={() => setResultsTab('local')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      resultsTab === 'local'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>Local / Este Equipo ({localAttempts.length})</span>
                  </button>
                </div>

                {resultsTab === 'remote' && (
                  <button
                    onClick={loadRemoteAttempts}
                    disabled={loadingRemote}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingRemote ? 'animate-spin' : ''}`} />
                    <span>Actualizar lista</span>
                  </button>
                )}
              </div>

              {/* RLS Security Box */}
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  <Database className="w-4 h-4 text-python-blue dark:text-sky-400" />
                  <span>Sincronización Criptográfica con Supabase Auth (RLS Activo)</span>
                </div>
                <p className="leading-relaxed text-[11px] sm:text-xs">
                  La tabla <code className="bg-sky-100 dark:bg-sky-900/60 px-1.5 py-0.5 rounded font-mono font-bold">exam_attempts</code> está protegida por Row Level Security. Solamente el JWT firmado de <strong className="font-mono">{AUTHORIZED_TEACHER_EMAIL}</strong> tiene autorización para leer las calificaciones globales de todos los alumnos.
                </p>
              </div>

              {/* Tabla de Resultados Remotos */}
              {resultsTab === 'remote' && (
                <div>
                  {loadingRemote ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                      <Loader2 className="w-6 h-6 animate-spin text-python-blue" />
                      <span>Consultando intentos en Supabase...</span>
                    </div>
                  ) : remoteError ? (
                    <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="block font-bold">Error al consultar datos remotos:</strong>
                        <p>{remoteError}</p>
                        <p className="text-[11px] opacity-80 mt-1">
                          Asegurate de haber ejecutado la migración de políticas RLS en el Editor SQL de Supabase.
                        </p>
                      </div>
                    </div>
                  ) : remoteAttempts.length === 0 ? (
                    <div className="p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">
                      No hay registros remotos de exámenes en Supabase todavía.
                    </div>
                  ) : (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">Alumno</th>
                            <th className="p-3">Colegio / Curso</th>
                            <th className="p-3">Examen</th>
                            <th className="p-3 text-center">Intento</th>
                            <th className="p-3 text-center">Nota</th>
                            <th className="p-3 text-center">Aciertos</th>
                            <th className="p-3 text-center">Tiempo</th>
                            <th className="p-3">Fecha y Hora</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {remoteAttempts.map((att, idx) => (
                            <tr key={att.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="p-3 font-bold text-slate-900 dark:text-white">
                                {att.student_last_name}, {att.student_name}
                              </td>
                              <td className="p-3">
                                <div>{att.school}</div>
                                <div className="text-[11px] text-slate-400">{att.course}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono">
                                  {att.exam_id}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                                  {att.attempt_number} de 3
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold">
                                <span className={att.percentage >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                  {att.score} / 10 ({att.percentage}%)
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                {att.correct_answers} / {att.total_questions}
                              </td>
                              <td className="p-3 text-center text-slate-500 font-mono">
                                {Math.floor((att.duration_seconds || 0) / 60)}m {((att.duration_seconds || 0) % 60).toString().padStart(2, '0')}s
                              </td>
                              <td className="p-3 text-slate-500 whitespace-nowrap">
                                {new Date(att.completed_at).toLocaleDateString()} {new Date(att.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tabla de Resultados Locales */}
              {resultsTab === 'local' && (
                <div>
                  {localAttempts.length === 0 ? (
                    <div className="p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 dark:text-slate-500 text-xs">
                      No se han registrado intentos completados en este navegador todavía.
                    </div>
                  ) : (
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">Alumno</th>
                            <th className="p-3">Colegio / Curso</th>
                            <th className="p-3 text-center">Intento</th>
                            <th className="p-3 text-center">Nota</th>
                            <th className="p-3 text-center">Porcentaje</th>
                            <th className="p-3 text-center">Tiempo</th>
                            <th className="p-3">Fecha</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {localAttempts.map((att, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="p-3 font-bold text-slate-900 dark:text-white">
                                {att.student.studentLastName}, {att.student.studentName}
                              </td>
                              <td className="p-3">
                                <div>{att.student.school}</div>
                                <div className="text-[11px] text-slate-400">{att.student.course}</div>
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                                  {att.attemptNumber || 1} de 3
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold">
                                <span className={att.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                  {att.score} / 10
                                </span>
                              </td>
                              <td className="p-3 text-center font-semibold">
                                {att.percentage}%
                              </td>
                              <td className="p-3 text-center text-slate-500 font-mono">
                                {Math.floor((att.durationSeconds || 0) / 60)}m {((att.durationSeconds || 0) % 60).toString().padStart(2, '0')}s
                              </td>
                              <td className="p-3 text-slate-500 whitespace-nowrap">
                                {new Date(att.completedAt).toLocaleDateString()} {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/50">
              <button
                onClick={() => setShowTeacherResultsModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Inicio de Sesión / Registro para Docente */}
      <TeacherLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={refreshAuthState}
      />

    </div>
  );
};
