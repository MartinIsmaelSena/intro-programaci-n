import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ActiveTPSession,
  TPEvaluationResult,
  TPStudentData,
  TPModality,
  TPShift
} from '../../types/practicalWorkSession';
import {
  getStoredTPSession,
  saveStoredTPSession,
  clearStoredTPSession,
  generateTPSession,
  gradeTPSession,
  saveTPAttemptToSupabase
} from '../../services/practicalWorkRunnerService';
import { runPythonCode } from '../../services/pythonRunner';
import { validateExercise } from '../../services/testValidator';
import { PythonEditor } from '../editor/PythonEditor';
import { InteractiveConsole } from '../editor/InteractiveConsole';
import { ExecutionResult } from '../../types/course';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  User,
  Users,
  Send,
  Trophy,
  RotateCcw,
  BookOpen,
  Code2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  Loader2,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

type TPStep = 'intro' | 'student_form' | 'confirm_summary' | 'runner' | 'result';

interface PracticalWorkPortalViewProps {
  onBackToPortal?: () => void;
}

export const PracticalWorkPortalView: React.FC<PracticalWorkPortalViewProps> = ({
  onBackToPortal
}) => {
  // 1. Estado de la sesión activa
  const [session, setSession] = useState<ActiveTPSession | null>(() => getStoredTPSession());
  const [evaluationResult, setEvaluationResult] = useState<TPEvaluationResult | null>(() => {
    const existing = getStoredTPSession();
    return (existing?.submitted && existing.result) ? existing.result : null;
  });

  // Determinar paso inicial según sesión guardada
  const [step, setStep] = useState<TPStep>(() => {
    const existing = getStoredTPSession();
    if (!existing) return 'intro';
    if (existing.submitted && existing.result) return 'result';
    return 'runner';
  });

  // 2. Formulario de datos institucionales
  const [studentForm, setStudentForm] = useState<TPStudentData>(() => {
    const existing = getStoredTPSession();
    if (existing) return existing.student;
    return {
      modality: 'individual',
      school: '',
      course: '',
      division: '',
      shift: 'Mañana',
      student1: { name: '', lastName: '' },
      student2: { name: '', lastName: '' }
    };
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 3. Índice de la pregunta actual en la evaluación (0 a 11)
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 4. Temporizador de 80 minutos basado en deadlineTimestamp fijo
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const existing = getStoredTPSession();
    if (existing && !existing.submitted) {
      const remaining = Math.floor((existing.deadlineTimestamp - Date.now()) / 1000);
      return Math.max(0, remaining);
    }
    return 80 * 60; // 4800 segundos
  });

  // 5. Estados de ejecución de código y modales
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [execResults, setExecResults] = useState<Record<string, ExecutionResult>>({});
  const [runningSection, setRunningSection] = useState<string | null>(null);
  const [validationStatuses, setValidationStatuses] = useState<Record<string, boolean>>({});
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Lock para evitar ejecuciones duplicadas de entrega
  const isSubmissionLockedRef = useRef(false);

  // ==========================================================================
  // FUNCIÓN CENTRAL Y SEGURA DE ENTREGA (MANUAL O AUTOMÁTICA POR TIEMPO)
  // ==========================================================================
  const handleFinalSubmit = useCallback(
    async (sessionToSubmit: ActiveTPSession, reason: 'manual_submit' | 'timeout') => {
      if (isSubmissionLockedRef.current) return;
      isSubmissionLockedRef.current = true;
      setIsSubmitting(true);

      try {
        const evaluation = await gradeTPSession(sessionToSubmit, reason);

        const updatedSession: ActiveTPSession = {
          ...sessionToSubmit,
          submitted: true,
          completionReason: reason,
          result: evaluation
        };

        setSession(updatedSession);
        saveStoredTPSession(updatedSession);

        // Guardar resultado en Supabase (tabla exam_attempts)
        await saveTPAttemptToSupabase(evaluation);

        setEvaluationResult(evaluation);
        setStep('result');
      } finally {
        setIsSubmitting(false);
        setShowConfirmSubmit(false);
      }
    },
    []
  );

  // ==========================================================================
  // TEMPORIZADOR CONTINUO SINCRONIZADO CON EL RELOJ REAL (DEADLINE FIJO)
  // ==========================================================================
  useEffect(() => {
    if (step !== 'runner' || !session || session.submitted || evaluationResult) return;

    // Comprobación inmediata al montar
    const immediateRemaining = Math.floor((session.deadlineTimestamp - Date.now()) / 1000);
    if (immediateRemaining <= 0) {
      setSecondsRemaining(0);
      handleFinalSubmit(session, 'timeout');
      return;
    } else {
      setSecondsRemaining(immediateRemaining);
    }

    const timer = setInterval(() => {
      const remaining = Math.floor((session.deadlineTimestamp - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);
        setSecondsRemaining(0);
        handleFinalSubmit(session, 'timeout');
      } else {
        setSecondsRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, session, evaluationResult, handleFinalSubmit]);

  // Formato de tiempo HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const rem = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Umbrales de advertencia de tiempo
  const isTimeUrgent = secondsRemaining <= 60; // 1 minuto
  const isTimeCritical = secondsRemaining <= 300 && secondsRemaining > 60; // 5 minutos
  const isTimeWarning = secondsRemaining <= 600 && secondsRemaining > 300; // 10 minutos
  const isTimeNotice = secondsRemaining <= 1200 && secondsRemaining > 600; // 20 minutos

  // Conteo de respuestas completadas
  const answeredCount = useMemo(() => {
    if (!session) return 0;
    let count = 0;
    session.questions.forEach(q => {
      const ans = session.answers[q.id];
      if (q.type === 'coding') {
        if (typeof ans === 'string' && ans.trim().length > 0 && ans.trim() !== q.starterCode?.trim()) {
          count++;
        }
      } else {
        if (typeof ans === 'number') count++;
      }
    });
    return count;
  }, [session]);

  const totalQuestions = session?.questions.length || 12;
  const unansweredCount = totalQuestions - answeredCount;

  // Manejo de validación de formulario de alumnos
  const handleValidateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!studentForm.school.trim()) {
      errors.school = 'Por favor ingresá el nombre de tu colegio o institución.';
    }
    if (!studentForm.course.trim()) {
      errors.course = 'Por favor ingresá tu curso o año.';
    }
    if (!studentForm.shift) {
      errors.shift = 'Por favor seleccioná el turno.';
    }
    if (!studentForm.student1.name.trim()) {
      errors.student1Name = 'Ingresá el nombre del Estudiante 1.';
    }
    if (!studentForm.student1.lastName.trim()) {
      errors.student1LastName = 'Ingresá el apellido del Estudiante 1.';
    }

    if (studentForm.modality === 'pareja') {
      if (!studentForm.student2?.name.trim()) {
        errors.student2Name = 'Ingresá el nombre del Estudiante 2.';
      }
      if (!studentForm.student2?.lastName.trim()) {
        errors.student2LastName = 'Ingresá el apellido del Estudiante 2.';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep('confirm_summary');
    }
  };

  // Inicio efectivo de la evaluación (comienza el cronómetro)
  const handleStartEvaluation = () => {
    isSubmissionLockedRef.current = false;
    const newSession = generateTPSession(studentForm);
    setSession(newSession);
    setSecondsRemaining(80 * 60);
    setCurrentIndex(0);
    setStep('runner');
  };

  // Selección de respuestas de teoría
  const handleSelectAnswer = (questionId: string, value: number | string) => {
    if (!session || session.submitted) return;

    const updatedAnswers = {
      ...session.answers,
      [questionId]: value
    };

    const updatedSession = {
      ...session,
      answers: updatedAnswers
    };

    setSession(updatedSession);
    saveStoredTPSession(updatedSession);
  };

  // Ejecución de código práctico en la consola
  const handleRunCode = async (questionId: string, code: string) => {
    setRunningSection(questionId);
    try {
      const res = await runPythonCode(code);
      setExecResults(prev => ({ ...prev, [questionId]: res }));
    } finally {
      setRunningSection(null);
    }
  };

  // Comprobación de casos de prueba
  const handleTestCode = async (questionId: string, code: string, testCases: any[]) => {
    setRunningSection(questionId);
    try {
      const evalRes = await validateExercise(code, testCases);
      setValidationStatuses(prev => ({ ...prev, [questionId]: evalRes.allPassed }));

      // Ejecutar primer caso para mostrar la salida en la consola
      const runRes = await runPythonCode(code, { inputs: testCases[0]?.inputs });
      setExecResults(prev => ({ ...prev, [questionId]: runRes }));
    } finally {
      setRunningSection(null);
    }
  };

  // Reiniciar para rendir nuevamente
  const handleResetEvaluation = () => {
    clearStoredTPSession();
    setSession(null);
    setEvaluationResult(null);
    setCurrentIndex(0);
    isSubmissionLockedRef.current = false;
    setStep('intro');
  };

  // ==========================================================================
  // PANTALLA 1: PRESENTACIÓN DEL TRABAJO PRÁCTICO
  // ==========================================================================
  if (step === 'intro') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-6 px-4 pb-16">
        {/* Banner Superior */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-python-blue text-white shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-300">
            <FileCheck className="w-4 h-4" />
            <span>Evaluación Oficial Autocorregible</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            📝 Trabajo Práctico de Python
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Evaluación integral de fundamentos de programación en Python con corrección automática y guardado institucional en Supabase.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-amber-300">
              <Clock className="w-4 h-4" />
              <span>Duración: 80 minutos</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-sky-200">
              <Users className="w-4 h-4" />
              <span>Modalidad: Individual (22 act.) o En Pareja (30 act.)</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 text-emerald-300">
              <Trophy className="w-4 h-4" />
              <span>Escala: 0 a 10 (Aprobación: 6.0)</span>
            </div>
          </div>
        </div>

        {/* Ficha de Contenidos Evaluados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-python-blue dark:text-sky-400 font-bold text-base">
              <BookOpen className="w-5 h-5" />
              <h3>Contenidos que se evaluarán</h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Introducción y filosofía:</strong> qué es Python y funcionamiento del intérprete línea por línea.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Tipos de datos:</strong> enteros (<code className="font-mono text-xs">int</code>), decimales (<code className="font-mono text-xs">float</code>), texto (<code className="font-mono text-xs">str</code>) y booleanos (<code className="font-mono text-xs">bool</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Variables y asignación:</strong> operador <code className="font-mono text-xs">=</code>, reasignación y reglas de nombres válidos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Operaciones y precedencia:</strong> operadores aritméticos (<code className="font-mono text-xs">+</code>, <code className="font-mono text-xs">-</code>, <code className="font-mono text-xs">*</code>, <code className="font-mono text-xs">/</code>, <code className="font-mono text-xs">//</code>, <code className="font-mono text-xs">%</code>, <code className="font-mono text-xs">**</code>) y uso de paréntesis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Comparaciones y lógica:</strong> operadores relacionales (<code className="font-mono text-xs">==</code>, <code className="font-mono text-xs">!=</code>, <code className="font-mono text-xs">&gt;</code>, <code className="font-mono text-xs">&lt;</code>, <code className="font-mono text-xs">&gt;=</code>, <code className="font-mono text-xs">&lt;=</code>) y operadores lógicos (<code className="font-mono text-xs">and</code>, <code className="font-mono text-xs">or</code>, <code className="font-mono text-xs">not</code>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-python-blue mt-2 flex-shrink-0" />
                <span><strong>Salida y entrada:</strong> función <code className="font-mono text-xs">print()</code> con saltos <code className="font-mono text-xs">\n</code> y <code className="font-mono text-xs">input()</code> con conversión obligatoria <code className="font-mono text-xs">int()</code> y <code className="font-mono text-xs">float()</code>.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <Code2 className="w-5 h-5" />
              <h3>Estructura y Ponderación</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 dark:text-white">Parte A: Análisis, Código y Lógica (40%)</strong>
                  <span className="text-slate-500 text-xs">Individual: 18 preguntas | En Pareja: 26 preguntas</span>
                </div>
                <span className="font-bold text-python-blue dark:text-sky-400 text-base">4.0 Pts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <strong className="block text-slate-900 dark:text-white">Parte B: Programación Práctica (60%)</strong>
                  <span className="text-slate-500 text-xs">4 programas Python (doble, triángulo, cuadrado y problema aplicado)</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">6.0 Pts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                <strong>Modelos aleatorios:</strong> Se asignará aleatoriamente uno de los tres modelos equivalentes (Modelo A, B o C) garantizando la misma dificultad.
              </div>
            </div>
          </div>
        </div>

        {/* Advertencia reglamentaria obligatoria */}
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-4">
          <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-sm">Información importante sobre el tiempo:</strong>
            <p className="leading-relaxed">
              «Disponés de 80 minutos para completar el trabajo práctico. El tiempo comenzará a correr cuando confirmes el inicio de la evaluación. Al finalizar el tiempo, tus respuestas se entregarán automáticamente».
            </p>
            <p className="text-[11px] opacity-80 pt-1">
              El contador no comenzará a correr mientras completás tus datos previos.
            </p>
          </div>
        </div>

        {/* Botón de Comienzo */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}

          <button
            onClick={() => setStep('student_form')}
            className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-98 cursor-pointer"
          >
            <span>COMENZAR TRABAJO PRÁCTICO</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 2: FORMULARIO DE DATOS INSTITUCIONALES Y MODALIDAD
  // ==========================================================================
  if (step === 'student_form') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-8 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep('intro')}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-python-blue dark:text-sky-400 uppercase tracking-wider">
              Paso 1 de 2
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Datos Institucionales y Modalidad
            </h1>
          </div>
        </div>

        <form onSubmit={handleValidateForm} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Selector de Modalidad: Individual o Pareja */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Modalidad de evaluación <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStudentForm(prev => ({ ...prev, modality: 'individual' }))}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  studentForm.modality === 'individual'
                    ? 'border-python-blue bg-python-blue/10 text-python-blue dark:text-sky-300 font-bold ring-2 ring-python-blue/40'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-python-blue/10 text-python-blue dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Individual</div>
                  <div className="text-xs text-slate-500 font-normal">1 integrante</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStudentForm(prev => ({ ...prev, modality: 'pareja' }))}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  studentForm.modality === 'pareja'
                    ? 'border-python-blue bg-python-blue/10 text-python-blue dark:text-sky-300 font-bold ring-2 ring-python-blue/40'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">En Pareja</div>
                  <div className="text-xs text-slate-500 font-normal">2 integrantes</div>
                </div>
              </button>
            </div>
          </div>

          {/* Datos del Colegio y Curso */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Colegio o institución <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentForm.school}
                onChange={e => {
                  setStudentForm(prev => ({ ...prev, school: e.target.value }));
                  if (formErrors.school) setFormErrors(prev => ({ ...prev, school: '' }));
                }}
                placeholder="Ej: CPEM 69"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
              />
              {formErrors.school && <p className="text-xs text-rose-500 font-semibold">{formErrors.school}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Curso o año <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentForm.course}
                  onChange={e => {
                    setStudentForm(prev => ({ ...prev, course: e.target.value }));
                    if (formErrors.course) setFormErrors(prev => ({ ...prev, course: '' }));
                  }}
                  placeholder="Ej: 3°"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.course && <p className="text-xs text-rose-500 font-semibold">{formErrors.course}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  División <span className="text-slate-400 font-normal">(si corresponde)</span>
                </label>
                <input
                  type="text"
                  value={studentForm.division}
                  onChange={e => setStudentForm(prev => ({ ...prev, division: e.target.value }))}
                  placeholder="Ej: A / 1ª"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Turno <span className="text-rose-500">*</span>
                </label>
                <select
                  value={studentForm.shift}
                  onChange={e => setStudentForm(prev => ({ ...prev, shift: e.target.value as TPShift }))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue cursor-pointer"
                >
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noche">Noche</option>
                  <option value="Vespertino">Vespertino</option>
                </select>
                {formErrors.shift && <p className="text-xs text-rose-500 font-semibold">{formErrors.shift}</p>}
              </div>
            </div>
          </div>

          {/* Integrante 1 */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              {studentForm.modality === 'pareja' ? 'Estudiante 1 (Responsable principal)' : 'Datos del Estudiante'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Nombre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentForm.student1.name}
                  onChange={e => {
                    const val = e.target.value;
                    setStudentForm(prev => ({ ...prev, student1: { ...prev.student1, name: val } }));
                    if (formErrors.student1Name) setFormErrors(prev => ({ ...prev, student1Name: '' }));
                  }}
                  placeholder="Nombre"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.student1Name && <p className="text-xs text-rose-500">{formErrors.student1Name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Apellido <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentForm.student1.lastName}
                  onChange={e => {
                    const val = e.target.value;
                    setStudentForm(prev => ({ ...prev, student1: { ...prev.student1, lastName: val } }));
                    if (formErrors.student1LastName) setFormErrors(prev => ({ ...prev, student1LastName: '' }));
                  }}
                  placeholder="Apellido"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.student1LastName && <p className="text-xs text-rose-500">{formErrors.student1LastName}</p>}
              </div>
            </div>
          </div>

          {/* Integrante 2 (si es en pareja) */}
          {studentForm.modality === 'pareja' && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Estudiante 2 (Compañero/a de equipo)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Nombre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentForm.student2?.name || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setStudentForm(prev => ({
                        ...prev,
                        student2: { name: val, lastName: prev.student2?.lastName || '' }
                      }));
                      if (formErrors.student2Name) setFormErrors(prev => ({ ...prev, student2Name: '' }));
                    }}
                    placeholder="Nombre"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                  />
                  {formErrors.student2Name && <p className="text-xs text-rose-500">{formErrors.student2Name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Apellido <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentForm.student2?.lastName || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setStudentForm(prev => ({
                        ...prev,
                        student2: { name: prev.student2?.name || '', lastName: val }
                      }));
                      if (formErrors.student2LastName) setFormErrors(prev => ({ ...prev, student2LastName: '' }));
                    }}
                    placeholder="Apellido"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                  />
                  {formErrors.student2LastName && <p className="text-xs text-rose-500">{formErrors.student2LastName}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>Continuar a revisión de datos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 3: RESUMEN DE DATOS Y CONFIRMACIÓN PREVIA AL RELOJ
  // ==========================================================================
  if (step === 'confirm_summary') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-8 px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
              Confirmación de inicio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Revisá tus datos antes de comenzar
            </h2>
          </div>

          {/* Ficha Resumen */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
              <span className="text-slate-500">Modalidad:</span>
              <strong className="text-slate-900 dark:text-white font-bold capitalize">
                {studentForm.modality === 'pareja' ? '👥 En pareja (2 integrantes)' : '👤 Individual'}
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
              <span className="text-slate-500">Institución / Colegio:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{studentForm.school}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
              <span className="text-slate-500">Curso / Turno:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {studentForm.course} {studentForm.division ? `Div. ${studentForm.division}` : ''} — Turno {studentForm.shift}
              </strong>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
              <span className="text-slate-500">Estudiante 1:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {studentForm.student1.name} {studentForm.student1.lastName}
              </strong>
            </div>

            {studentForm.modality === 'pareja' && studentForm.student2 && (
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <span className="text-slate-500">Estudiante 2:</span>
                <strong className="text-slate-900 dark:text-white font-bold">
                  {studentForm.student2.name} {studentForm.student2.lastName}
                </strong>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Actividades a resolver:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {studentForm.modality === 'pareja' ? '30 actividades (26 de análisis y lógica + 4 de código)' : '22 actividades (18 de análisis y lógica + 4 de código)'}
              </strong>
            </div>
          </div>

          {/* Aviso reglamentario exacto del requerimiento */}
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-left bg-amber-50/80 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-300 dark:border-amber-800">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              «Disponés de 80 minutos para completar el trabajo práctico. El tiempo comenzará a correr cuando confirmes el inicio de la evaluación. Al finalizar el tiempo, tus respuestas se entregarán automáticamente».
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Una vez iniciado, el cronómetro calculará el tiempo en base a la hora límite fija de finalización. Si recargás la página o cambiás de pestaña, el tiempo continuará corriendo sin reiniciarse.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep('student_form')}
              className="py-3.5 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
            >
              Modificar datos
            </button>

            <button
              onClick={handleStartEvaluation}
              className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>COMENZAR TRABAJO PRÁCTICO</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 4: EVALUACIÓN EN CURSO (CRONÓMETRO DE 80 MINUTOS Y RESOLUCIÓN)
  // ==========================================================================
  if (step === 'runner' && session) {
    const currentQ = session.questions[currentIndex];
    const currentAnswer = session.answers[currentQ.id];

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn py-6 px-4 pb-20">
        
        {/* Barra Superior Flotante: Cronómetro y Entrega */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-python-blue/10 dark:bg-sky-400/10 text-python-blue dark:text-sky-400 flex items-center justify-center font-bold">
              {session.model}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-python-blue dark:text-sky-400">
                  Modelo {session.model}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  {session.student.modality === 'pareja' ? 'En Pareja' : 'Individual'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {session.student.school} — {session.student.course}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Cronómetro en tiempo real */}
            <div className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
              isTimeUrgent
                ? 'bg-rose-500 text-white border-rose-600 animate-bounce shadow-lg shadow-rose-500/30'
                : isTimeCritical
                ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-400 text-rose-600 dark:text-rose-400 animate-pulse'
                : isTimeWarning
                ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-400 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
            }`}>
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>TIEMPO: {formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Entregar Trabajo</span>
            </button>
          </div>
        </div>

        {/* Banners no bloqueantes de advertencia según umbrales de tiempo */}
        {isTimeUrgent ? (
          <div className="p-3.5 rounded-2xl bg-rose-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>¡Menos de 1 minuto restante! El trabajo se entregará automáticamente al llegar a 00:00:00.</span>
          </div>
        ) : isTimeCritical ? (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-xs sm:text-sm text-rose-800 dark:text-rose-200 font-bold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>Últimos 5 minutos disponibles. Verificá que tus ejercicios de programación estén probados.</span>
          </div>
        ) : isTimeWarning ? (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>Restan 10 minutos para la finalización del trabajo práctico.</span>
          </div>
        ) : isTimeNotice ? (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Aviso de tiempo: restan 20 minutos de evaluación.</span>
          </div>
        ) : null}

        {/* Navegador Rápido de Preguntas (Pills) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Completadas: <strong>{answeredCount} de {totalQuestions}</strong></span>
            <span className="text-[11px] hidden sm:inline">Seleccioná un casillero para navegar</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {session.questions.map((q, idx) => {
              const isAnswered =
                q.type === 'coding'
                  ? typeof session.answers[q.id] === 'string' &&
                    (session.answers[q.id] as string).trim().length > 0 &&
                    (session.answers[q.id] as string).trim() !== q.starterCode?.trim()
                  : typeof session.answers[q.id] === 'number';

              const isCurrent = idx === currentIndex;
              const isPractical = q.type === 'coding';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 sm:w-11 h-10 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center border cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-python-blue ring-offset-1 border-python-blue bg-python-blue text-white shadow-md'
                      : isAnswered
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{idx + 1}</span>
                  <span className="text-[9px] font-mono opacity-80">{isPractical ? '💻' : '📖'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de la Pregunta Actual */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Header de la Pregunta */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-python-blue/10 text-python-blue dark:text-sky-400 font-bold uppercase tracking-wider">
                {currentQ.type === 'coding' ? '💻 Ejercicio Práctico' : '📖 Pregunta de Análisis y Lógica'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                Pregunta {currentIndex + 1} de {totalQuestions}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium">{currentQ.topic}</span>
            </div>

            <div className="font-bold text-python-blue dark:text-sky-400">
              Valor: {currentQ.points !== undefined ? currentQ.points : (currentQ.type === 'coding' ? '1.5' : (4.0 / (session.questions.length - 4)).toFixed(2))} puntos
            </div>
          </div>

          {/* Enunciado */}
          <div className="space-y-3">
            {currentQ.title && (
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {currentQ.title}
              </h3>
            )}
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line font-medium">
              {currentQ.question}
            </p>
          </div>

          {/* Fragmento de código si aplica (para tracing) */}
          {currentQ.codeSnippet && (
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm border border-slate-800 overflow-x-auto shadow-inner">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}

          {/* Opciones para preguntas Teóricas */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'tracing') && currentQ.options && (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = currentAnswer === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-python-blue/10 dark:bg-sky-500/10 border-python-blue dark:border-sky-500 text-slate-900 dark:text-white ring-2 ring-python-blue/30 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center border ${
                        isSelected
                          ? 'bg-python-blue text-white border-python-blue'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-python-blue bg-python-blue text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Editor de Python para Ejercicios Prácticos */}
          {currentQ.type === 'coding' && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 space-y-3">
                  <PythonEditor
                    code={typeof currentAnswer === 'string' ? currentAnswer : currentQ.starterCode || ''}
                    onChange={val => handleSelectAnswer(currentQ.id, val)}
                    onRun={() =>
                      handleRunCode(
                        currentQ.id,
                        typeof currentAnswer === 'string' ? currentAnswer : currentQ.starterCode || ''
                      )
                    }
                    onReset={() => handleSelectAnswer(currentQ.id, currentQ.starterCode || '')}
                    isRunning={runningSection === currentQ.id}
                  />

                  <InteractiveConsole
                    result={execResults[currentQ.id] || null}
                    isRunning={runningSection === currentQ.id}
                    onClear={() =>
                      setExecResults(prev => ({ ...prev, [currentQ.id]: null as any }))
                    }
                  />
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
                      🧪 Casos de Prueba Automatizados
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Escribí tu programa y probalo contra los casos de prueba para verificar que resuelva todas las entradas esperadas.
                    </p>

                    <button
                      onClick={() =>
                        handleTestCode(
                          currentQ.id,
                          typeof currentAnswer === 'string' ? currentAnswer : currentQ.starterCode || '',
                          currentQ.testCases || []
                        )
                      }
                      disabled={runningSection === currentQ.id}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {runningSection === currentQ.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluando pruebas...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Probar con casos de prueba 🧪</span>
                        </>
                      )}
                    </button>

                    {validationStatuses[currentQ.id] !== undefined && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                        validationStatuses[currentQ.id]
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200'
                          : 'bg-amber-100 dark:bg-amber-950/80 border border-amber-300 text-amber-800 dark:text-amber-200'
                      }`}>
                        {validationStatuses[currentQ.id] ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>¡Pruebas superadas con éxito!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>Aún no pasa todas las pruebas. Verificá la consola.</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Lista descriptiva de casos de prueba */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">Casos evaluados:</span>
                      {currentQ.testCases?.map((tc, tcIdx) => (
                        <div key={tcIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{tc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botones de navegación Anterior / Siguiente */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-400">
              {currentIndex + 1} de {totalQuestions}
            </span>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="py-2.5 px-5 rounded-xl bg-python-blue hover:bg-python-blue-light text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Revisar y entregar</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal de Confirmación de Entrega Manual */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Send className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  ¿Confirmás la entrega definitiva?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Una vez entregado, se calculará tu nota automáticamente y se guardará el resultado en Supabase. No podrás modificar tus respuestas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Preguntas respondidas:</span>
                  <strong className="text-emerald-600 font-bold">{answeredCount} de {totalQuestions}</strong>
                </div>
                {unansweredCount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Preguntas pendientes:</span>
                    <strong>{unansweredCount}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiempo restante:</span>
                  <strong className="font-mono">{formatTime(secondsRemaining)}</strong>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Continuar respondiendo
                </button>

                <button
                  type="button"
                  onClick={() => handleFinalSubmit(session, 'manual_submit')}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Calificando...</span>
                    </>
                  ) : (
                    <span>Confirmar y entregar</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 5: RESULTADOS Y DEVOLUCIONES PEDAGÓGICAS
  // ==========================================================================
  if (step === 'result' && evaluationResult) {
    const minutesUsed = Math.floor(evaluationResult.durationSeconds / 60);
    const secondsUsed = evaluationResult.durationSeconds % 60;
    const durationFormatted = `${minutesUsed} min ${secondsUsed < 10 ? '0' : ''}${secondsUsed} seg`;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-8 px-4 pb-20">
        
        {/* Encabezado Principal del Resultado */}
        <div className={`p-8 sm:p-10 rounded-3xl text-center space-y-5 text-white shadow-2xl ${
          evaluationResult.passed
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 shadow-emerald-500/20'
            : 'bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 shadow-orange-500/20'
        }`}>
          <div className="inline-block p-4 rounded-3xl bg-white/20 backdrop-blur-md">
            {evaluationResult.passed ? (
              <Trophy className="w-12 h-12 text-yellow-200 animate-bounce" />
            ) : (
              <RotateCcw className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              {evaluationResult.model ? `Modelo ${evaluationResult.model}` : 'Trabajo Práctico'} • {evaluationResult.student.modality === 'pareja' ? 'Evaluación en Pareja' : 'Evaluación Individual'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              TRABAJO PRÁCTICO FINALIZADO
            </h1>
            {evaluationResult.completionReason === 'timeout' && (
              <p className="text-xs sm:text-sm text-yellow-200 font-semibold max-w-lg mx-auto">
                «Se terminó el tiempo disponible. El trabajo práctico se entregó automáticamente con las respuestas que habías guardado».
              </p>
            )}
          </div>

          {/* Ficha Institucional de los Estudiantes */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 max-w-lg mx-auto text-xs sm:text-sm space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-white/80">Institución:</span>
              <strong className="font-bold">{evaluationResult.student.school}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Curso y Turno:</span>
              <strong className="font-bold">
                {evaluationResult.student.course} {evaluationResult.student.division ? `Div. ${evaluationResult.student.division}` : ''} (Turno {evaluationResult.student.shift})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Estudiante 1:</span>
              <strong className="font-bold">
                {evaluationResult.student.student1.name} {evaluationResult.student.student1.lastName}
              </strong>
            </div>
            {evaluationResult.student.student2 && (
              <div className="flex justify-between">
                <span className="text-white/80">Estudiante 2:</span>
                <strong className="font-bold">
                  {evaluationResult.student.student2.name} {evaluationResult.student.student2.lastName}
                </strong>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-white/10">
              <span className="text-white/80">Tiempo utilizado:</span>
              <strong>{durationFormatted} (de 80 min)</strong>
            </div>
          </div>

          {/* Calificaciones: Nota Final, Teoría, Práctica */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Nota Final</span>
              <span className="text-3xl sm:text-4xl font-black">
                {evaluationResult.score} <span className="text-base font-semibold opacity-80">/ 10</span>
              </span>
              <span className="text-[11px] block text-white/90 font-bold mt-1">
                {evaluationResult.passed ? '¡Aprobado!' : 'No alcanzado'} ({evaluationResult.percentage}%)
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Parte A: Análisis y Lógica (40%)</span>
              <span className="text-2xl sm:text-3xl font-black">
                {evaluationResult.theoryScore} <span className="text-sm font-semibold opacity-80">/ 4.0</span>
              </span>
              <span className="text-[11px] block text-white/80 mt-1">
                {evaluationResult.theoryBreakdown.length} preguntas de análisis y lógica
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Parte B: Práctica (60%)</span>
              <span className="text-2xl sm:text-3xl font-black">
                {evaluationResult.practicalScore} <span className="text-sm font-semibold opacity-80">/ 6.0</span>
              </span>
              <span className="text-[11px] block text-white/80 mt-1">4 programas Python</span>
            </div>
          </div>
        </div>

        {/* Notificación de guardado en Supabase */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-python-blue dark:text-sky-400 flex-shrink-0" />
          <span>
            <strong>Resultado registrado:</strong> La nota y las devoluciones de este Trabajo Práctico han sido guardadas de forma segura en la tabla de calificaciones de Supabase.
          </span>
        </div>

        {/* Botón para Desplegar Devolución Detallada */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <button
            onClick={() => setShowDetailedReview(prev => !prev)}
            className="w-full flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-python-blue transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-python-blue" />
              <span>Ver Devolución Pedagógica Completa (Teoría y Código)</span>
            </div>
            {showDetailedReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showDetailedReview && (
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              {/* Sección 1: Devoluciones de Análisis y Lógica */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Devolución de Preguntas de Análisis y Lógica ({evaluationResult.theoryBreakdown.length} preguntas)
                </h4>

                <div className="space-y-3">
                  {evaluationResult.theoryBreakdown.map((item, idx) => (
                    <div
                      key={item.questionId}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        item.isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">
                          Pregunta {idx + 1} • {item.topic}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          item.isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.isCorrect ? `+${item.pointsObtained} Pts (Correcta)` : '0.0 Pts (Incorrecta)'}
                        </span>
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {item.question}
                      </p>

                      <div className="space-y-1 text-slate-600 dark:text-slate-300">
                        <div>
                          <span className="text-slate-400">Tu respuesta:</span>{' '}
                          <strong className={item.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                            {item.userAnswerText}
                          </strong>
                        </div>
                        {!item.isCorrect && (
                          <div>
                            <span className="text-slate-400">Respuesta correcta:</span>{' '}
                            <strong className="text-emerald-600">{item.correctAnswerText}</strong>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
                        <strong>Explicación pedagógica:</strong> {item.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección 2: Devoluciones Prácticas de Código */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Devolución de Ejercicios Prácticos (4 programas)
                </h4>

                <div className="space-y-4">
                  {evaluationResult.practicalBreakdown.map((item, idx) => (
                    <div
                      key={item.questionId}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">
                          Ejercicio {idx + 1}: {item.title}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          item.allPassed
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : item.pointsObtained > 0
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.pointsObtained} / {item.maxPoints} Pts ({item.passedCount}/{item.totalCount} pruebas)
                        </span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {item.description}
                      </p>

                      {/* Código entregado */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Código entregado:</span>
                        <div className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto">
                          <pre>{item.userCode || '# No se entregó código para este ejercicio'}</pre>
                        </div>
                      </div>

                      {/* Resultados de Casos de Prueba */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Resultados de pruebas:</span>
                        <div className="space-y-1.5">
                          {item.testCasesResults.map((tc, tcIdx) => (
                            <div
                              key={tcIdx}
                              className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-[11px] ${
                                tc.passed
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="font-bold">{tc.name}:</span> {tc.expectedDescription}
                                {tc.actualOutput && !tc.passed && (
                                  <div className="text-[10px] opacity-80 font-mono">
                                    Salida generada: "{tc.actualOutput}"
                                  </div>
                                )}
                              </div>
                              <span className="font-bold flex-shrink-0">
                                {tc.passed ? '✓ Superado' : '✗ Fallido'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {item.suggestions && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          <strong>Sugerencia docente:</strong> {item.suggestions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Acciones Finales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleResetEvaluation}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Realizar nuevo trabajo práctico
          </button>

          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Volver al inicio de Python desde Cero
            </button>
          )}
        </div>

      </div>
    );
  }

  return null;
};
