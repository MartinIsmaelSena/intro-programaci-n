import React, { useState, useEffect, useRef } from 'react';
import { Exam, ExamUserAnswers, ExamResult } from '../../types/exam';
import { useProgress } from '../../context/ProgressContext';
import { gradeExam } from '../../services/examService';
import { runPythonCode } from '../../services/pythonRunner';
import { validateExercise } from '../../services/testValidator';
import { PythonEditor } from '../editor/PythonEditor';
import { InteractiveConsole } from '../editor/InteractiveConsole';
import { ExamResultModal } from './ExamResultModal';
import { ExecutionResult } from '../../types/course';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Search,
  Bug,
  Code2,
  Sparkles,
  Send,
  HelpCircle,
  Play
} from 'lucide-react';

interface ExamRunnerViewProps {
  exam: Exam;
  onExit: () => void;
}

type SectionTab = 'partA' | 'partB' | 'partC' | 'partD' | 'partE';

export const ExamRunnerView: React.FC<ExamRunnerViewProps> = ({ exam, onExit }) => {
  const { saveExamResult } = useProgress();
  const [activeTab, setActiveTab] = useState<SectionTab>('partA');
  
  // Timer (40 minutes = 2400 seconds)
  const totalDurationSeconds = exam.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalDurationSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // User answers
  const [answers, setAnswers] = useState<ExamUserAnswers>({
    theoryAnswers: {},
    tracingAnswers: {},
    debuggingCode: exam.sections.partC_debugging.buggyCode,
    codingCode: exam.sections.partD_coding.starterCode,
    integratorCode: exam.sections.partE_integrator.starterCode
  });

  // Editor runner states for code sections
  const [runningSection, setRunningSection] = useState<string | null>(null);
  const [execResults, setExecResults] = useState<Record<string, ExecutionResult>>({});
  const [validationStatuses, setValidationStatuses] = useState<Record<string, boolean>>({});

  // Countdown timer effect
  useEffect(() => {
    if (examResult) return; // Stop timer if already submitted

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examResult]);

  const handleAutoSubmit = async () => {
    if (isSubmitting || examResult) return;
    setIsSubmitting(true);
    const timeSpent = totalDurationSeconds - secondsRemaining;
    const res = await gradeExam(exam, answers, timeSpent);
    saveExamResult(res);
    setExamResult(res);
    setIsSubmitting(false);
  };

  const handleManualSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    const timeSpent = totalDurationSeconds - secondsRemaining;
    const res = await gradeExam(exam, answers, timeSpent);
    saveExamResult(res);
    setExamResult(res);
    setIsSubmitting(false);
  };

  const handleRunCodeSnippet = async (key: 'debugging' | 'coding' | 'integrator', code: string, inputs?: string[]) => {
    setRunningSection(key);
    try {
      const res = await runPythonCode(code, { inputs });
      setExecResults(prev => ({ ...prev, [key]: res }));
    } finally {
      setRunningSection(null);
    }
  };

  const handleTestSectionCode = async (
    key: 'partC' | 'partD' | 'partE',
    code: string,
    testCases: any[]
  ) => {
    setRunningSection(key);
    try {
      const evalRes = await validateExercise(code, testCases);
      setValidationStatuses(prev => ({ ...prev, [key]: evalRes.allPassed }));
      
      // Also run first test case for console output
      const runRes = await runPythonCode(code, { inputs: testCases[0]?.inputs });
      setExecResults(prev => ({ ...prev, [key]: runRes }));
    } finally {
      setRunningSection(null);
    }
  };

  // Timer format (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 300; // <= 5 minutes

  // Compute answers completed
  const theoryDone = Object.keys(answers.theoryAnswers).length === exam.sections.partA_theory.length;
  const tracingDone = Object.keys(answers.tracingAnswers).length === exam.sections.partB_tracing.length;
  const debugDone = answers.debuggingCode.trim() !== exam.sections.partC_debugging.buggyCode.trim();
  const codingDone = answers.codingCode.trim() !== exam.sections.partD_coding.starterCode.trim();
  const integratorDone = answers.integratorCode.trim() !== exam.sections.partE_integrator.starterCode.trim();

  const completedSectionsCount = [theoryDone, tracingDone, debugDone, codingDone, integratorDone].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Top Bar with Timer and Title */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
        
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
              <span className="text-xs font-bold text-python-blue dark:text-sky-400 uppercase tracking-wider">
                {exam.title}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Módulos: {exam.modules.join(', ')}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              {exam.subtitle}
            </h1>
          </div>
        </div>

        {/* Timer & Submit Button */}
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
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all transform active:scale-98 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Entregar Examen</span>
          </button>
        </div>

      </div>

      {/* Progress & Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 no-scrollbar">
        
        <button
          onClick={() => setActiveTab('partA')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeTab === 'partA'
              ? 'bg-python-blue text-white border-python-blue shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Parte A: Teoría</span>
          {theoryDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab('partB')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeTab === 'partB'
              ? 'bg-python-blue text-white border-python-blue shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Parte B: Interpretación</span>
          {tracingDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab('partC')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeTab === 'partC'
              ? 'bg-python-blue text-white border-python-blue shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Parte C: Corrección</span>
          {validationStatuses['partC'] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab('partD')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeTab === 'partD'
              ? 'bg-python-blue text-white border-python-blue shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Parte D: Programación</span>
          {validationStatuses['partD'] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab('partE')}
          className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
            activeTab === 'partE'
              ? 'bg-python-blue text-white border-python-blue shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Parte E: Integrador</span>
          {validationStatuses['partE'] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

      </div>

      {/* SECTION CONTENT */}

      {/* PARTE A: TEORÍA */}
      {activeTab === 'partA' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-3xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-sky-900 dark:text-sky-200 space-y-1">
            <span className="font-bold uppercase tracking-wider block">Parte A — Evaluación Conceptual (20 Puntos)</span>
            <p>Selecciona la opción correcta para cada una de las dos preguntas teóricas.</p>
          </div>

          {exam.sections.partA_theory.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-python-blue dark:text-sky-400">Pregunta {idx + 1} de {exam.sections.partA_theory.length}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{q.points} Puntos</span>
              </div>

              <h2 className="font-bold text-base text-slate-900 dark:text-white leading-relaxed">
                {q.question}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers.theoryAnswers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setAnswers(prev => ({
                          ...prev,
                          theoryAnswers: { ...prev.theoryAnswers, [q.id]: optIdx }
                        }));
                      }}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-python-blue bg-sky-50 dark:bg-sky-950/60 text-python-blue dark:text-sky-300 font-semibold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{opt}</span>
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
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('partB')}
              className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Siguiente: Parte B (Interpretación) →
            </button>
          </div>
        </div>
      )}

      {/* PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) */}
      {activeTab === 'partB' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-5 rounded-3xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-xs sm:text-sm text-violet-900 dark:text-violet-200 space-y-1">
            <span className="font-bold uppercase tracking-wider block">Parte B — Interpretación de Código (20 Puntos)</span>
            <p>Lee con atención cada fragmento de código y deduce mentalmente qué salida producirá la terminal.</p>
          </div>

          {exam.sections.partB_tracing.map((q, idx) => (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-violet-600 dark:text-violet-400">Ejercicio de Análisis {idx + 1} de {exam.sections.partB_tracing.length}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{q.points} Puntos</span>
              </div>

              {/* Code Snippet */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm whitespace-pre">
                {q.codeSnippet}
              </div>

              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {q.question}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers.tracingAnswers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setAnswers(prev => ({
                          ...prev,
                          tracingAnswers: { ...prev.tracingAnswers, [q.id]: optIdx }
                        }));
                      }}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-semibold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="font-mono">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-violet-600 bg-violet-600 text-white'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveTab('partA')}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              ← Volver a Parte A
            </button>
            <button
              onClick={() => setActiveTab('partC')}
              className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Siguiente: Parte C (Corrección de errores) →
            </button>
          </div>
        </div>
      )}

      {/* PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) */}
      {activeTab === 'partC' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold uppercase tracking-wider block">Parte C — Corrección de Errores (20 Puntos)</span>
            <p>Identifica y repara el error en el código utilizando el editor. Puedes probarlo cuantas veces necesites.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                    Desafío de Debugging
                  </span>
                  <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
                    20 Puntos
                  </span>
                </div>

                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  {exam.sections.partC_debugging.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {exam.sections.partC_debugging.description}
                </p>

                <button
                  onClick={() => handleTestSectionCode('partC', answers.debuggingCode, exam.sections.partC_debugging.testCases)}
                  disabled={runningSection === 'partC'}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Probar mi Corrección 🧪</span>
                </button>

                {validationStatuses['partC'] !== undefined && (
                  <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                    validationStatuses['partC']
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200'
                  }`}>
                    {validationStatuses['partC'] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>¡Pruebas superadas! El bug ha sido corregido.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>Aún no cumple con todas las salidas esperadas. Revisa la terminal.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <PythonEditor
                code={answers.debuggingCode}
                onChange={val => setAnswers(prev => ({ ...prev, debuggingCode: val }))}
                onRun={() => handleRunCodeSnippet('debugging', answers.debuggingCode)}
                onReset={() => setAnswers(prev => ({ ...prev, debuggingCode: exam.sections.partC_debugging.buggyCode }))}
                isRunning={runningSection === 'debugging'}
              />

              <InteractiveConsole
                result={execResults['debugging'] || null}
                isRunning={runningSection === 'debugging'}
                onClear={() => setExecResults(prev => ({ ...prev, debugging: null as any }))}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('partB')}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              ← Volver a Parte B
            </button>
            <button
              onClick={() => setActiveTab('partD')}
              className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Siguiente: Parte D (Programación) →
            </button>
          </div>
        </div>
      )}

      {/* PARTE D: PROGRAMACIÓN PRÁCTICA */}
      {activeTab === 'partD' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-1">
            <span className="font-bold uppercase tracking-wider block">Parte D — Programación Práctica (20 Puntos)</span>
            <p>Escribe el código desde cero para resolver el problema respetando las consignas dadas.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Consigna Práctica
                  </span>
                  <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
                    20 Puntos
                  </span>
                </div>

                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  {exam.sections.partD_coding.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {exam.sections.partD_coding.description}
                </p>

                <button
                  onClick={() => handleTestSectionCode('partD', answers.codingCode, exam.sections.partD_coding.testCases)}
                  disabled={runningSection === 'partD'}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Probar mi Código 🧪</span>
                </button>

                {validationStatuses['partD'] !== undefined && (
                  <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                    validationStatuses['partD']
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200'
                  }`}>
                    {validationStatuses['partD'] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>¡Excelente! Tu solución pasa todos los casos de prueba.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>Aún no cumple con los requisitos esperados. Revisa la terminal.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <PythonEditor
                code={answers.codingCode}
                onChange={val => setAnswers(prev => ({ ...prev, codingCode: val }))}
                onRun={() => handleRunCodeSnippet('coding', answers.codingCode)}
                onReset={() => setAnswers(prev => ({ ...prev, codingCode: exam.sections.partD_coding.starterCode }))}
                isRunning={runningSection === 'coding'}
              />

              <InteractiveConsole
                result={execResults['coding'] || null}
                isRunning={runningSection === 'coding'}
                onClear={() => setExecResults(prev => ({ ...prev, coding: null as any }))}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('partC')}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              ← Volver a Parte C
            </button>
            <button
              onClick={() => setActiveTab('partE')}
              className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Siguiente: Parte E (Problema Integrador) →
            </button>
          </div>
        </div>
      )}

      {/* PARTE E: PROBLEMA INTEGRADOR */}
      {activeTab === 'partE' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-rose-500/15 border border-orange-200 dark:border-orange-800/80 text-xs sm:text-sm text-orange-950 dark:text-orange-200 space-y-1">
            <span className="font-bold uppercase tracking-wider block">Parte E — Gran Problema Integrador (20 Puntos)</span>
            <p>Combina todos los conceptos aprendidos en este bloque para construir la solución integral.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                    Desafío Integrador
                  </span>
                  <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
                    20 Puntos
                  </span>
                </div>

                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  {exam.sections.partE_integrator.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {exam.sections.partE_integrator.description}
                </p>

                <button
                  onClick={() => handleTestSectionCode('partE', answers.integratorCode, exam.sections.partE_integrator.testCases)}
                  disabled={runningSection === 'partE'}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Probar mi Código Integrador 🧪</span>
                </button>

                {validationStatuses['partE'] !== undefined && (
                  <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                    validationStatuses['partE']
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-200'
                  }`}>
                    {validationStatuses['partE'] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>¡Extraordinario! Tu solución integradora es correcta.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <span>Revisa las entradas y salidas de la terminal para ajustar la solución.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <PythonEditor
                code={answers.integratorCode}
                onChange={val => setAnswers(prev => ({ ...prev, integratorCode: val }))}
                onRun={() => handleRunCodeSnippet('integrator', answers.integratorCode)}
                onReset={() => setAnswers(prev => ({ ...prev, integratorCode: exam.sections.partE_integrator.starterCode }))}
                isRunning={runningSection === 'integrator'}
              />

              <InteractiveConsole
                result={execResults['integrator'] || null}
                isRunning={runningSection === 'integrator'}
                onClear={() => setExecResults(prev => ({ ...prev, integrator: null as any }))}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('partD')}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
            >
              ← Volver a Parte D
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Finalizar y Entregar Examen</span>
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM SUBMIT MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ¿Deseas entregar tu examen?
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Has completado o respondido <strong className="text-python-blue">{completedSectionsCount} de 5 secciones</strong>.
              Una vez entregado, se calculará tu calificación final y recibirás el reporte con el desglose de puntos.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
              >
                {isSubmitting ? 'Calificando...' : 'Sí, entregar ahora'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Seguir revisando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT CONFIRM MODAL */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold">¿Salir del examen?</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Si sales antes de entregar, tu progreso en este intento no quedará calificado. El temporizador se cancelará.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
              >
                Sí, salir del examen
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Continuar rindiendo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULT MODAL */}
      {examResult && (
        <ExamResultModal
          result={examResult}
          exam={exam}
          onClose={onExit}
          onRetake={() => {
            setExamResult(null);
            setSecondsRemaining(totalDurationSeconds);
            setActiveTab('partA');
          }}
        />
      )}

    </div>
  );
};
