import React, { useState } from 'react';
import { QuizQuestion } from '../../types/course';
import { useProgress } from '../../context/ProgressContext';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  moduleId: number;
  onProceedToExercises: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  moduleId,
  onProceedToExercises
}) => {
  const { progress, recordQuizAnswer } = useProgress();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;

  // Check if current question was previously answered in progress context
  const previousRecord = progress.answeredQuestions[currentQ.id];
  const isCorrect = selectedOption !== null && selectedOption === currentQ.correctAnswer;

  const handleSelectOption = (idx: number) => {
    if (submitted && isCorrect) return; // locked once correct
    setSelectedOption(idx);
    setSubmitted(false);
  };

  const handleVerify = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentQ.correctAnswer;
    setSubmitted(true);
    recordQuizAnswer(currentQ.id, selectedOption, correct, moduleId);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  // Calculate total correct in this module
  const answeredInModule = questions.filter(q => progress.answeredQuestions[q.id]?.isCorrect).length;
  const isQuizFinished = answeredInModule === totalQuestions || currentIdx === totalQuestions - 1;

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Quiz de comprensión
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
            Pregunta {currentIdx + 1} de {totalQuestions}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400">Acertadas:</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {answeredInModule} / {totalQuestions}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-python-blue/10 dark:bg-sky-950 flex items-center justify-center font-bold text-python-blue dark:text-sky-400 text-sm">
            {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h4>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const letter = String.fromCharCode(65 + oIdx); // A, B, C, D

            let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-python-blue dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

            if (isSelected) {
              optionStyle = 'border-python-blue dark:border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-python-blue dark:text-sky-300 font-semibold ring-2 ring-python-blue/20';
            }

            if (submitted) {
              if (oIdx === currentQ.correctAnswer) {
                optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20';
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all transform active:scale-[0.99] ${optionStyle}`}
              >
                <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-python-blue text-white dark:bg-sky-600'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {letter}
                </span>
                <span className="text-sm sm:text-base leading-relaxed flex-1">
                  {optionText}
                </span>

                {submitted && oIdx === currentQ.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                {submitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Verification Action */}
        {!submitted && (
          <div className="pt-2">
            <button
              onClick={handleVerify}
              disabled={selectedOption === null}
              className="w-full py-3.5 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Comprobar respuesta</span>
            </button>
          </div>
        )}

        {/* Formative Feedback Box */}
        {submitted && (
          <div className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>✅ ¡Muy bien! ¡Respuesta correcta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>❌ No es correcto todavía</span>
                  </>
                )}
              </div>

              {isCorrect && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                  +10 XP
                </span>
              )}
            </div>

            {/* Explanation or Hint */}
            <div className="text-xs sm:text-sm leading-relaxed">
              {isCorrect ? (
                <p>{currentQ.explanation}</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-rose-800 dark:text-rose-200">
                    No te preocupes, el error es parte fundamental del aprendizaje.
                  </p>
                  <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Pista:</strong> {currentQ.hint}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action inside feedback */}
            <div className="pt-2 flex items-center justify-between gap-3">
              {!isCorrect ? (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver a intentar</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  ¡Excelente razonamiento!
                </span>
              )}

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto shadow-sm"
                >
                  <span>Siguiente pregunta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onProceedToExercises}
                  className="px-5 py-2.5 rounded-xl bg-python-blue hover:bg-python-blue-light text-white text-xs font-bold flex items-center gap-1.5 transition-colors ml-auto shadow-md"
                >
                  <span>Avanzar a los Ejercicios de Código</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* Navigation bottom buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={handlePrevious}
            disabled={currentIdx === 0}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <span className="text-slate-400">
            {currentIdx + 1} de {totalQuestions}
          </span>

          {currentIdx < totalQuestions - 1 && (
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              Siguiente →
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
