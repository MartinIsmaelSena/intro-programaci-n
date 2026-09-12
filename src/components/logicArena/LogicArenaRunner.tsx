import React, { useState } from 'react';
import {
  LogicArenaQuestion,
  LogicCategory
} from '../../types/logicArena';
import {
  Brain,
  Flame,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Code2
} from 'lucide-react';

interface LogicArenaRunnerProps {
  questions: LogicArenaQuestion[];
  modeTitle: string;
  isRoundMode: boolean;
  onAnswerSubmit: (question: LogicArenaQuestion, selectedOption: number) => { isCorrect: boolean; xpEarned: number };
  onFinishRound?: () => void;
  onExit: () => void;
}

const CATEGORY_LABELS: Record<LogicCategory, { name: string; icon: string; badgeClass: string }> = {
  comparisons: {
    name: 'Comparaciones',
    icon: '⚖️',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  boolean_logic: {
    name: 'Operadores Lógicos',
    icon: '🔀',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  variables: {
    name: 'Variables y Nombres',
    icon: '📦',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  reassignment: {
    name: 'Reasignación',
    icon: '🔄',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  code_tracing: {
    name: 'Trazado de Código',
    icon: '🖥️',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  error_detection: {
    name: 'Detección de Errores',
    icon: '⚠️',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  combined_logic: {
    name: 'Lógica Combinada',
    icon: '🧩',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  }
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const LogicArenaRunner: React.FC<LogicArenaRunnerProps> = ({
  questions,
  modeTitle,
  isRoundMode,
  onAnswerSubmit,
  onFinishRound,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  const currentQuestion = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;

    setSelectedOption(index);
    setHasAnswered(true);

    const { isCorrect, xpEarned } = onAnswerSubmit(currentQuestion, index);

    if (isCorrect) {
      setSessionStreak(prev => prev + 1);
      setSessionXp(prev => prev + xpEarned);
    } else {
      setSessionStreak(0);
    }
  };

  const handleNext = () => {
    if (isRoundMode && isLastQuestion) {
      if (onFinishRound) onFinishRound();
      return;
    }

    // Avanzar a la siguiente pregunta
    const nextIdx = (currentIndex + 1) % questions.length;
    setCurrentIndex(nextIdx);
    setSelectedOption(null);
    setHasAnswered(false);
    setShowHint(false);
  };

  const catInfo = CATEGORY_LABELS[currentQuestion.category] || {
    name: 'Lógica',
    icon: '🧠',
    badgeClass: 'bg-slate-100 text-slate-700'
  };

  const isCurrentCorrect = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Barra superior de estado de la Arena */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Volver a la selección de la Arena"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Salir</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {modeTitle}
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {isRoundMode
                ? `Pregunta ${currentIndex + 1} de ${questions.length}`
                : `Pregunta ${currentIndex + 1}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Racha actual */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
              sessionStreak > 0
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-sm animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            title="Racha de respuestas correctas consecutivas"
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Racha: {sessionStreak}</span>
          </div>

          {/* XP acumulado en la sesión */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>+{sessionXp} XP</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de la Pregunta */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Cabecera de la pregunta: Categoría y Dificultad */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catInfo.badgeClass}`}>
              <span>{catInfo.icon}</span>
              <span>{catInfo.name}</span>
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              · {currentQuestion.subtopic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
              currentQuestion.difficulty === 'facil'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : currentQuestion.difficulty === 'medio'
                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
            }`}>
              {currentQuestion.difficulty}
            </span>

            {currentQuestion.hint && !hasAnswered && (
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline p-1"
                title="Ver pista"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pista</span>
              </button>
            )}
          </div>
        </div>

        {/* Pista si se activa */}
        {showHint && currentQuestion.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-fadeIn">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Pista: </span>
              <span>{currentQuestion.hint}</span>
            </div>
          </div>
        )}

        {/* Enunciado de la pregunta */}
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Bloque de Código si la pregunta incluye fragmento */}
        {currentQuestion.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Python</span>
              </div>
              <span className="text-[10px] text-slate-500">Fragmento de código</span>
            </div>
            <pre className="p-4 sm:p-5 font-mono text-sm sm:text-base text-sky-300 leading-relaxed overflow-x-auto whitespace-pre">
              <code>{currentQuestion.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* 4 Opciones de Respuesta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx];
            const isSelected = selectedOption === idx;
            const isTargetCorrect = idx === currentQuestion.correctAnswer;

            let optionStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/30';

            if (hasAnswered) {
              if (isTargetCorrect) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold shadow-sm';
              } else if (isSelected && !isTargetCorrect) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 line-through opacity-80';
              } else {
                optionStyle = 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between gap-3 ${optionStyle} ${
                  !hasAnswered ? 'cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                    hasAnswered && isTargetCorrect
                      ? 'bg-emerald-500 text-white'
                      : hasAnswered && isSelected && !isTargetCorrect
                      ? 'bg-rose-500 text-white'
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}>
                    {letter}
                  </span>
                  <span className="font-semibold text-sm sm:text-base font-mono sm:font-sans">
                    {option}
                  </span>
                </div>

                {hasAnswered && isTargetCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                {hasAnswered && isSelected && !isTargetCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Panel de Explicación Pedagógica (aparece tras responder) */}
        {hasAnswered && (
          <div className={`p-5 rounded-2xl border transition-all animate-fadeIn space-y-2 ${
            isCurrentCorrect
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              {isCurrentCorrect ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>¡Correcto! Excelente razonamiento</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>Respuesta incorrecta</span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Botón de acción: Siguiente pregunta / Finalizar */}
        {hasAnswered && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>
                {isRoundMode && isLastQuestion ? 'Ver Resumen Final' : 'Siguiente Pregunta'}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
