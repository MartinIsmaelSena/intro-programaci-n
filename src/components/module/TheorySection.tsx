import React from 'react';
import { TheorySection as ITheorySection } from '../../types/course';
import { Lightbulb, Code, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

interface TheorySectionProps {
  theory: ITheorySection[];
  onProceedToQuiz: () => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({
  theory,
  onProceedToQuiz
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {theory.map((section, idx) => (
        <article
          key={section.id}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5"
        >
          {/* Section Header */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="w-8 h-8 rounded-xl bg-python-blue/10 dark:bg-sky-950 text-python-blue dark:text-sky-400 font-bold flex items-center justify-center text-sm">
              {idx + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {section.title}
            </h2>
          </div>

          {/* Section Prose Content */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {section.content}
          </div>

          {/* Everyday Analogy Card (if present) */}
          {section.analogy && (
            <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
                <span>{section.analogy.title}</span>
              </div>

              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                {section.analogy.description}
              </p>

              {section.analogy.steps && section.analogy.steps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {section.analogy.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Code Example Card (if present) */}
          {section.codeExample && (
            <div className="rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 overflow-hidden space-y-0">
              <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-python-yellow" />
                  <span className="font-semibold text-slate-300">Ejemplo en Python</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">código interactivo</span>
              </div>

              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-sky-200 bg-[#1e1e2e] whitespace-pre">
                {section.codeExample.code}
              </pre>

              {section.codeExample.output && (
                <div className="px-4 py-3 bg-[#13131f] border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-500 block mb-1">Salida de consola:</span>
                  <div className="text-emerald-400 whitespace-pre">
                    {section.codeExample.output}
                  </div>
                </div>
              )}

              <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-xs text-slate-400 italic">
                💡 {section.codeExample.explanation}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {section.keyTakeaways && section.keyTakeaways.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Puntos clave para recordar
              </h4>
              <div className="space-y-1.5">
                {section.keyTakeaways.map((point, kIdx) => (
                  <div key={kIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </article>
      ))}

      {/* Bottom Proceed Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 border border-sky-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            ¿Comprendiste los conceptos teóricos?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Pon a prueba tu entendimiento con el quiz interactivo de preguntas.
          </p>
        </div>

        <button
          onClick={onProceedToQuiz}
          className="px-6 py-3 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 flex-shrink-0"
        >
          <span>Ir al Quiz de Preguntas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
