import React, { useState } from 'react';
import { Lightbulb, Eye, EyeOff, HelpCircle } from 'lucide-react';

interface HintSystemProps {
  hints: string[];
  solution: string;
  attemptCount: number;
}

export const HintSystem: React.FC<HintSystemProps> = ({
  hints,
  solution,
  attemptCount
}) => {
  const [unlockedHintLevel, setUnlockedHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const handleNextHint = () => {
    if (unlockedHintLevel < hints.length) {
      setUnlockedHintLevel(prev => prev + 1);
    }
  };

  // Solution can be revealed if all hints were viewed OR user had 2 or more attempts
  const canRevealSolution = unlockedHintLevel >= hints.length || attemptCount >= 2;

  return (
    <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 p-4 space-y-3">
      
      {/* Top action row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Sistema de Pistas Progresivas</span>
          <span className="text-[11px] font-normal text-amber-700 dark:text-amber-400">
            ({unlockedHintLevel} de {hints.length} desbloqueadas)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {unlockedHintLevel < hints.length && (
            <button
              onClick={handleNextHint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>💡 Necesito una pista</span>
            </button>
          )}

          {canRevealSolution && (
            <button
              onClick={() => setShowSolution(prev => !prev)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {showSolution ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ocultar solución</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>¿Querés ver una posible solución?</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Hints List */}
      {unlockedHintLevel > 0 && (
        <div className="space-y-2 pt-1">
          {hints.slice(0, unlockedHintLevel).map((hintText, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5 animate-fadeIn"
            >
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex-shrink-0 mt-0.5">
                Pista {index + 1}
              </span>
              <p className="leading-relaxed">{hintText}</p>
            </div>
          ))}
        </div>
      )}

      {/* Solution Block */}
      {showSolution && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans pb-1 border-b border-slate-800">
            <span>Código de solución sugerido:</span>
            <span className="text-[10px] text-amber-400">Intenta entender cómo funciona en vez de copiarlo</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre p-2 bg-[#181825] rounded-lg">
            {solution}
          </pre>
        </div>
      )}

    </div>
  );
};
