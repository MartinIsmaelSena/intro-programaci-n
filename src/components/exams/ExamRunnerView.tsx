import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Exam,
  ExamStudentData,
  ActiveExamSession,
  ExamEvaluationResult,
  ExamUnifiedQuestion
} from '../../types/exam';
import { useProgress } from '../../context/ProgressContext';
import {
  generateExam01Session,
  getStoredExam01Session,
  clearStoredExam01Session,
  getStudentCompletedAttemptsCount,
  recordCompletedAttempt,
  hasExceededAttempts,
  EXAM01_STORAGE_KEY
} from '../../data/exams/exam01_block1';
import {
  gradeActiveExamSession,
  saveExamAttemptToSupabase
} from '../../services/examService';
import { sendExamResultEmail } from '../../services/examEmailService';
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
  Send,
  Trophy,
  RotateCcw,
  Mail,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';

interface ExamRunnerViewProps {
  exam: Exam;
  onExit: () => void;
}

type RunnerStep = 'register' | 'warning' | 'exam' | 'result';

export const ExamRunnerView: React.FC<ExamRunnerViewProps> = ({ exam, onExit }) => {
  const { saveExamResult } = useProgress();

  // 1. Sesión activa del examen y datos del alumno inicializados desde almacenamiento
  const [session, setSession] = useState<ActiveExamSession | null>(() => getStoredExam01Session());
  const [studentData, setStudentData] = useState<ExamStudentData>(() => {
    const existing = getStoredExam01Session();
    return existing ? existing.student : {
      studentName: '',
      studentLastName: '',
      school: '',
      course: ''
    };
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [evaluationResult, setEvaluationResult] = useState<ExamEvaluationResult | null>(() => {
    const existing = getStoredExam01Session();
    return (existing?.submitted && existing.result) ? existing.result : null;
  });

  const [step, setStep] = useState<RunnerStep>(() => {
    const existing = getStoredExam01Session();
    if (!existing) return 'register';
    if (existing.submitted && existing.result) return 'result';
    return 'exam';
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 3. Temporizador real (40 minutos)
  const totalDurationSeconds = (exam.durationMinutes || 40) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const existing = getStoredExam01Session();
    if (existing && !existing.submitted) {
      const elapsed = Math.floor((Date.now() - existing.startTimestamp) / 1000);
      return Math.max(0, existing.durationMinutes * 60 - elapsed);
    }
    return totalDurationSeconds;
  });

  // 4. Estados de envío y modales
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 5. Estado de consola y pruebas para ejercicios prácticos
  const [execResults, setExecResults] = useState<Record<string, ExecutionResult>>({});
  const [runningSection, setRunningSection] = useState<string | null>(null);
  const [validationStatuses, setValidationStatuses] = useState<Record<string, boolean>>({});

  // 6. Envío opcional por email
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState<{
    loading: boolean;
    sent: boolean;
    message?: string;
    isError?: boolean;
  }>({ loading: false, sent: false });

  // 7. Toggle para revisar respuestas
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Función interna para calificar y guardar intento
  const submitExamSession = useCallback(
    async (sessionToSubmit: ActiveExamSession) => {
      setIsSubmitting(true);
      try {
        const evaluation = await gradeActiveExamSession(sessionToSubmit);

        // Actualizar sesión como entregada
        const updatedSession: ActiveExamSession = {
          ...sessionToSubmit,
          submitted: true,
          result: evaluation
        };
        setSession(updatedSession);
        try {
          localStorage.setItem(EXAM01_STORAGE_KEY, JSON.stringify(updatedSession));
        } catch {}

        // Registrar en historial de intentos locales
        recordCompletedAttempt(evaluation);

        // Guardar progreso local en el contexto
        saveExamResult({
          examId: exam.id,
          completedAt: evaluation.completedAt,
          totalScore: Math.round(evaluation.score * 10),
          passed: evaluation.passed,
          timeSpentSeconds: evaluation.durationSeconds,
          sectionScores: [
            {
              name: `Modelo de Examen N.º 1 (Intento ${evaluation.attemptNumber} de 3)`,
              maxPoints: 10,
              obtainedPoints: evaluation.score,
              feedback: `${evaluation.correctAnswersCount} de 20 preguntas correctas (${evaluation.percentage}%). Nota: ${evaluation.score}/10.`
            }
          ]
        });

        // Guardar en Supabase (tabla exam_attempts)
        await saveExamAttemptToSupabase({
          student_name: evaluation.student.studentName,
          student_last_name: evaluation.student.studentLastName,
          school: evaluation.student.school,
          course: evaluation.student.course,
          exam_id: evaluation.examId,
          attempt_number: evaluation.attemptNumber,
          score: evaluation.score,
          correct_answers: evaluation.correctAnswersCount,
          total_questions: evaluation.totalQuestions,
          percentage: evaluation.percentage,
          duration_seconds: evaluation.durationSeconds,
          started_at: evaluation.startedAt,
          completed_at: evaluation.completedAt,
          answers_summary: sessionToSubmit.answers
        });

        setEvaluationResult(evaluation);
        setStep('result');
      } finally {
        setIsSubmitting(false);
      }
    },
    [exam.id, saveExamResult]
  );

  const triggerAutoSubmit = useCallback(
    (currentSession: ActiveExamSession) => {
      if (isSubmitting || evaluationResult) return;
      submitExamSession(currentSession);
    },
    [isSubmitting, evaluationResult, submitExamSession]
  );

  // Si la sesión activa ya expiró antes de abrir la página, entregar automáticamente
  useEffect(() => {
    const existing = getStoredExam01Session();
    if (existing && !existing.submitted && !existing.result) {
      const elapsed = Math.floor((Date.now() - existing.startTimestamp) / 1000);
      const remaining = existing.durationMinutes * 60 - elapsed;
      if (remaining <= 0) {
        const timeoutId = setTimeout(() => {
          triggerAutoSubmit(existing);
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [triggerAutoSubmit]);

  // Temporizador sincronizado con el reloj real del sistema
  useEffect(() => {
    if (step !== 'exam' || !session || session.submitted || evaluationResult) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startTimestamp) / 1000);
      const remaining = session.durationMinutes * 60 - elapsed;

      if (remaining <= 0) {
        clearInterval(timer);
        setSecondsRemaining(0);
        triggerAutoSubmit(session);
      } else {
        setSecondsRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, session, evaluationResult, triggerAutoSubmit]);

  // Cantidad de intentos completados por el alumno
  const completedAttempts = useMemo(() => {
    if (!studentData.studentName || !studentData.studentLastName || !studentData.school || !studentData.course) {
      return 0;
    }
    return getStudentCompletedAttemptsCount(studentData);
  }, [studentData]);

  const attemptsExceeded = useMemo(() => {
    return completedAttempts >= 3;
  }, [completedAttempts]);

  // Manejo del formulario de inscripción
  const handleValidateStudentForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!studentData.studentName.trim()) {
      errors.studentName = 'Por favor ingresá tu nombre.';
    }
    if (!studentData.studentLastName.trim()) {
      errors.studentLastName = 'Por favor ingresá tu apellido.';
    }
    if (!studentData.school.trim()) {
      errors.school = 'Por favor ingresá tu colegio o institución.';
    }
    if (!studentData.course.trim()) {
      errors.course = 'Por favor ingresá tu curso o división (ej: 3° A).';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (hasExceededAttempts(studentData)) {
        errors.course = 'Ya has alcanzado el límite de 3 intentos permitidos para este examen.';
        setFormErrors(errors);
        return;
      }
      setStep('warning');
    }
  };

  // Inicio efectivo del examen tras presionar Comenzar Examen
  const handleStartExam = () => {
    const nextAttempt = completedAttempts + 1;
    const newSession = generateExam01Session(studentData, nextAttempt);
    setSession(newSession);
    setSecondsRemaining(newSession.durationMinutes * 60);
    setCurrentIndex(0);
    setStep('exam');
  };

  // Registro de respuestas del alumno
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
    try {
      localStorage.setItem(EXAM01_STORAGE_KEY, JSON.stringify(updatedSession));
    } catch {}
  };

  // Ejecución de código práctico en la mini consola
  const handleRunCode = async (questionId: string, code: string) => {
    setRunningSection(questionId);
    try {
      const res = await runPythonCode(code);
      setExecResults(prev => ({ ...prev, [questionId]: res }));
    } finally {
      setRunningSection(null);
    }
  };

  // Comprobación de casos de prueba para preguntas prácticas
  const handleTestCode = async (
    questionId: string,
    code: string,
    testCases: any[]
  ) => {
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

  // Envío del resultado por email
  const handleSendEmail = async () => {
    if (!evaluationResult || !emailInput.trim()) return;

    setEmailStatus({ loading: true, sent: false });
    const res = await sendExamResultEmail(evaluationResult, emailInput, exam.title);

    setEmailStatus({
      loading: false,
      sent: res.success,
      message: res.message,
      isError: !res.success
    });
  };

  // Reiniciar para rendir nuevamente (si quedan intentos disponibles)
  const handleRetakeExam = () => {
    clearStoredExam01Session();
    setSession(null);
    setEvaluationResult(null);
    setEmailStatus({ loading: false, sent: false });
    setEmailInput('');
    setCurrentIndex(0);
    setStep('register');
  };

  // Formato del temporizador MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 300; // <= 5 minutos

  // Cálculo de preguntas respondidas
  const answeredQuestionsCount = useMemo(() => {
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

  const unansweredCount = (session?.questions.length || 20) - answeredQuestionsCount;

  // ==========================================================================
  // PANTALLA 1: FORMULARIO DE REGISTRO PREVIO
  // ==========================================================================
  if (step === 'register') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-6 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-python-blue dark:text-sky-400 uppercase tracking-wider">
              {exam.title}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Identificación del Alumno
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-sky-900 dark:text-sky-200 flex items-start gap-3">
            <User className="w-5 h-5 text-python-blue dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <p>
              Completá tus datos para identificar tu examen. Cada alumno dispone de un <strong>máximo de 3 intentos</strong>.
            </p>
          </div>

          <form onSubmit={handleValidateStudentForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nombre <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentData.studentName}
                  onChange={e => {
                    setStudentData(prev => ({ ...prev, studentName: e.target.value }));
                    if (formErrors.studentName) setFormErrors(prev => ({ ...prev, studentName: '' }));
                  }}
                  placeholder="Tu nombre (ej: Lucas)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.studentName && (
                  <p className="text-xs text-rose-500 font-semibold">{formErrors.studentName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Apellido <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentData.studentLastName}
                  onChange={e => {
                    setStudentData(prev => ({ ...prev, studentLastName: e.target.value }));
                    if (formErrors.studentLastName) setFormErrors(prev => ({ ...prev, studentLastName: '' }));
                  }}
                  placeholder="Tu apellido (ej: Benítez)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
                />
                {formErrors.studentLastName && (
                  <p className="text-xs text-rose-500 font-semibold">{formErrors.studentLastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Colegio <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentData.school}
                onChange={e => {
                  setStudentData(prev => ({ ...prev, school: e.target.value }));
                  if (formErrors.school) setFormErrors(prev => ({ ...prev, school: '' }));
                }}
                placeholder="Nombre de tu colegio (ej: CPEM 69)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
              />
              {formErrors.school && (
                <p className="text-xs text-rose-500 font-semibold">{formErrors.school}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Curso <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentData.course}
                onChange={e => {
                  setStudentData(prev => ({ ...prev, course: e.target.value }));
                  if (formErrors.course) setFormErrors(prev => ({ ...prev, course: '' }));
                }}
                placeholder="Curso o división (ej: 3° A)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
              />
              {formErrors.course && (
                <p className="text-xs text-rose-500 font-semibold">{formErrors.course}</p>
              )}
            </div>

            {/* Contador de intentos previo */}
            {studentData.studentName && studentData.studentLastName && studentData.school && studentData.course && (
              <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
                attemptsExceeded
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-800 dark:text-rose-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                <div className="flex items-center gap-2">
                  {attemptsExceeded ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  ) : (
                    <Trophy className="w-4 h-4 text-python-blue flex-shrink-0" />
                  )}
                  <span>
                    {attemptsExceeded
                      ? 'No tenés más intentos disponibles (3 de 3 completados).'
                      : `Este será tu Intento ${completedAttempts + 1} de 3.`}
                  </span>
                </div>
                {!attemptsExceeded && (
                  <span className="text-slate-500 font-semibold">
                    Te quedan {3 - completedAttempts} intento{3 - completedAttempts > 1 ? 's' : ''}.
                  </span>
                )}
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={attemptsExceeded}
                className="w-full py-4 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 2: CARTEL DE ADVERTENCIA ANTES DE COMENZAR (Requerimiento Sección 8)
  // ==========================================================================
  if (step === 'warning') {
    const currentAttemptNum = completedAttempts + 1;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn py-8 px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
              Intento {currentAttemptNum} de 3
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Antes de comenzar
            </h2>
          </div>

          {/* Ficha confirmada del estudiante */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-left space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Alumno:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {studentData.studentName} {studentData.studentLastName}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Colegio y Curso:</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {studentData.school} — {studentData.course}
              </strong>
            </div>
          </div>

          {/* Texto reglamentario del aviso (Exacto según Sección 8) */}
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-left bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-900/40">
            <p className="font-semibold text-slate-900 dark:text-white">
              El examen contiene 20 preguntas y disponés de 40 minutos.
            </p>
            <p>
              Una vez que comiences, el tiempo empezará a correr.
            </p>
            <p>
              Al finalizar podrás visualizar tu nota y tendrás la posibilidad de enviar una copia del resultado a un correo electrónico.
            </p>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Tené en cuenta que disponés de un máximo de 3 intentos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setStep('register')}
              className="py-3.5 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Modificar datos
            </button>

            <button
              onClick={handleStartExam}
              className="flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Comenzar examen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 4: RESULTADO DEL EXAMEN (Requerimiento Sección 14)
  // ==========================================================================
  if (step === 'result' && evaluationResult) {
    const minutesUsed = Math.floor(evaluationResult.durationSeconds / 60);
    const secondsUsed = evaluationResult.durationSeconds % 60;
    const durationFormatted = `${minutesUsed} min ${secondsUsed < 10 ? '0' : ''}${secondsUsed} seg`;
    const attemptNum = evaluationResult.attemptNumber || 1;
    const canRetake = attemptNum < 3;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn py-6 px-4 pb-16">
        
        {/* Header Resultado */}
        <div className={`p-8 sm:p-10 rounded-3xl text-center space-y-4 text-white shadow-2xl ${
          evaluationResult.passed
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 shadow-emerald-500/20'
            : 'bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 shadow-orange-500/20'
        }`}>
          <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-md">
            {evaluationResult.passed ? (
              <Trophy className="w-12 h-12 text-yellow-200 animate-bounce" />
            ) : (
              <RotateCcw className="w-12 h-12 text-white" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
              Intento {attemptNum} de 3
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              EXAMEN FINALIZADO
            </h1>
          </div>

          {/* Ficha del alumno (Formato exacto de la Sección 14) */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 max-w-md mx-auto text-xs sm:text-sm space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-white/80">Nombre:</span>
              <strong className="font-bold">{evaluationResult.student.studentName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Apellido:</span>
              <strong className="font-bold">{evaluationResult.student.studentLastName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Colegio:</span>
              <strong className="font-bold">{evaluationResult.student.school}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Curso:</span>
              <strong className="font-bold">{evaluationResult.student.course}</strong>
            </div>
          </div>

          {/* Calificaciones (16/20, 80%, Nota: 8/10) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Resultado</span>
              <span className="text-2xl sm:text-3xl font-black">
                {evaluationResult.correctAnswersCount} / {evaluationResult.totalQuestions}
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Nota</span>
              <span className="text-2xl sm:text-3xl font-black">
                {evaluationResult.score} <span className="text-sm font-semibold opacity-80">/ 10</span>
              </span>
            </div>

            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <span className="text-[11px] font-bold text-white/80 uppercase block">Porcentaje</span>
              <span className="text-2xl sm:text-3xl font-black">
                {evaluationResult.percentage}%
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs font-medium text-white/90 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Tiempo utilizado: <strong>{durationFormatted}</strong></span>
            </div>
            <div className="font-semibold text-white/80">
              {attemptNum === 1
                ? 'Te quedan 2 intentos.'
                : attemptNum === 2
                ? 'Te queda 1 intento.'
                : 'No tenés más intentos disponibles.'}
            </div>
          </div>
        </div>

        {/* Sección Opcional: Enviar copia por email (Requerimiento Sección 15) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-python-blue dark:text-sky-400">
            <Mail className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              📧 Enviar una copia del resultado
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Si querés, podés enviar una copia de tu resultado a un correo electrónico.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="Correo electrónico"
              disabled={emailStatus.loading || emailStatus.sent}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-python-blue disabled:opacity-60"
            />
            <button
              onClick={handleSendEmail}
              disabled={emailStatus.loading || emailStatus.sent || !emailInput.trim()}
              className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {emailStatus.loading ? (
                <span>Enviando...</span>
              ) : emailStatus.sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enviado</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar resultado</span>
                </>
              )}
            </button>
          </div>

          {emailStatus.message && (
            <div className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
              emailStatus.isError
                ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}>
              {emailStatus.isError ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{emailStatus.message}</span>
            </div>
          )}
        </div>

        {/* Desglose Pedagógico de Preguntas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <button
            onClick={() => setShowDetailedReview(prev => !prev)}
            className="w-full flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-python-blue transition-colors"
          >
            <span>Detalle y corrección de las 20 preguntas</span>
            {showDetailedReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showDetailedReview && (
            <div className="space-y-4 pt-2 divide-y divide-slate-100 dark:divide-slate-800">
              {evaluationResult.questionBreakdown.map((item, idx) => (
                <div key={item.questionId} className="pt-4 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">
                      Pregunta {idx + 1} • {item.topic}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                      item.isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}>
                      {item.isCorrect ? '+0.5 Pts (Correcta)' : '0.0 Pts (Incorrecta)'}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-900 dark:text-white whitespace-pre-line">
                    {item.question}
                  </p>

                  {item.explanation && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Explicación:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onExit}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all text-center"
          >
            Volver al Portal de Exámenes
          </button>

          {canRetake ? (
            <button
              onClick={handleRetakeExam}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Rendir nuevamente (Intento {attemptNum + 1} de 3)</span>
            </button>
          ) : (
            <div className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-xs text-center border border-slate-200 dark:border-slate-700">
              No tenés más intentos disponibles (3 de 3)
            </div>
          )}
        </div>

      </div>
    );
  }

  // ==========================================================================
  // PANTALLA 3: RENDICIÓN DEL EXAMEN (20 PREGUNTAS ROTATIVAS)
  // ==========================================================================
  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-500">Cargando preguntas del examen...</p>
      </div>
    );
  }

  const currentQ: ExamUnifiedQuestion = session.questions[currentIndex] || session.questions[0];
  const totalQ = session.questions.length;
  const currentAnswer = session.answers[currentQ.id];

  return (
    <div className="space-y-6 animate-fadeIn pb-20 max-w-5xl mx-auto px-2 sm:px-4">
      
      {/* Barra superior con Temporizador persistente, Intento y entrega */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Salir del examen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-python-blue dark:text-sky-400 uppercase tracking-wider">
                {exam.title}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Intento {session.attemptNumber || 1} de 3
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {studentData.studentName} {studentData.studentLastName} ({studentData.course})
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Pregunta {currentIndex + 1} de {totalQ}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Contador de 40 minutos en tiempo real */}
          <div className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm sm:text-base flex items-center gap-2 transition-all ${
            isLowTime
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
          }`}>
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-600' : 'text-slate-500'}`} />
            <span>Tiempo restante: {formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all transform active:scale-98 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Entregar Examen</span>
          </button>
        </div>

      </div>

      {/* Navegador Rápido de 20 Preguntas (Pills) */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Respondidas: <strong>{answeredQuestionsCount} de {totalQ}</strong></span>
          <span className="text-[11px]">Hacé clic en un número para ir directo a la pregunta</span>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {session.questions.map((q, idx) => {
            const isAnswered =
              q.type === 'coding'
                ? typeof session.answers[q.id] === 'string' &&
                  (session.answers[q.id] as string).trim().length > 0 &&
                  (session.answers[q.id] as string).trim() !== q.starterCode?.trim()
                : typeof session.answers[q.id] === 'number';

            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                  isCurrent
                    ? 'ring-2 ring-python-blue ring-offset-1 border-python-blue bg-python-blue text-white shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* TARJETA DE LA PREGUNTA ACTUAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Encabezado de la pregunta */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-python-blue/10 text-python-blue dark:text-sky-400 font-bold uppercase tracking-wider">
              {currentQ.type === 'multiple_choice'
                ? 'Opción Múltiple'
                : currentQ.type === 'tracing'
                ? 'Análisis de Código'
                : 'Ejercicio Práctico'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {currentQ.topic}
            </span>
          </div>

          <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            0.5 Puntos
          </span>
        </div>

        {/* Enunciado */}
        <div className="space-y-2">
          {currentQ.title && (
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentQ.title}
            </h2>
          )}
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
            {currentQ.question}
          </p>
        </div>

        {/* CASO A: SNIPPET DE CÓDIGO (TRACING O MC CON CÓDIGO) */}
        {currentQ.codeSnippet && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm whitespace-pre overflow-x-auto shadow-inner">
            {currentQ.codeSnippet}
          </div>
        )}

        {/* CASO B: OPCIONES DE RESPUESTA (MULTIPLE CHOICE Y TRACING) */}
        {(currentQ.type === 'multiple_choice' || currentQ.type === 'tracing') && currentQ.options && (
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-python-blue bg-sky-50 dark:bg-sky-950/60 text-python-blue dark:text-sky-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border ${
                      isSelected
                        ? 'bg-python-blue text-white border-python-blue'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-mono text-xs sm:text-sm">{opt}</span>
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

        {/* CASO C: EJERCICIO PRÁCTICO DE CÓDIGO CON MINI CONSOLA Y VALIDACIÓN */}
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
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
                    Comprobación de Código
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Escribí tu programa y probalo con los casos de prueba antes de avanzar.
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
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Probar con casos de prueba 🧪</span>
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
                          <span>¡Pruebas superadas correctamente!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>Aún no cumple todos los requisitos. Revisá la salida de la consola.</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación Anterior / Siguiente */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="py-2.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs disabled:opacity-40 transition-colors"
          >
            ← Anterior
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {currentIndex + 1} de {totalQ}
          </span>

          {currentIndex < totalQ - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
              className="py-2.5 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Finalizar Examen</span>
            </button>
          )}
        </div>

      </div>

      {/* MODAL DE CONFIRMACIÓN / ADVERTENCIA DE ENTREGA */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ¿Deseas finalizar tu examen?
            </h3>

            {unansweredCount > 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <strong className="block font-bold">
                  Todavía tenés {unansweredCount} pregunta{unansweredCount > 1 ? 's' : ''} sin responder.
                </strong>
                <p>¿Querés finalizar igualmente o preferís revisar las preguntas pendientes?</p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Has respondido las <strong>20 preguntas</strong>. Al confirmar, se calculará tu nota final sobre 10 y se registrará tu intento {session.attemptNumber || 1} de 3.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => submitExamSession(session)}
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                {isSubmitting ? 'Calificando...' : 'Sí, finalizar examen'}
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Seguir respondiendo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA SALIR */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold">¿Salir del examen?</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              El temporizador de 40 minutos continuará corriendo. Tus respuestas se mantendrán guardadas y podrás reanudar este intento mientras quede tiempo disponible.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                Salir al portal
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Seguir rindiendo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
