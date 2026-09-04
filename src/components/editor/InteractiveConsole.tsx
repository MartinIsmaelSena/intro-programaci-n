import React from 'react';
import { ExecutionResult } from '../../types/course';
import { Terminal, AlertTriangle, Lightbulb, Trash2, CheckCircle2 } from 'lucide-react';

interface InteractiveConsoleProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
}

export const InteractiveConsole: React.FC<InteractiveConsoleProps> = ({
  result,
  isRunning,
  onClear
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#12121e] text-slate-200 overflow-hidden shadow-md flex flex-col font-mono">
      
      {/* Console Header */}
      <div className="bg-[#1a1a2e] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mac-style window dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <span className="text-xs font-semibold text-slate-400 ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            Salida de Consola
          </span>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          {result && (
            <span className="text-[10px] text-slate-500">
              ⏱️ {result.executionTimeMs} ms
            </span>
          )}
          <button
            onClick={onClear}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Limpiar consola"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div className="p-4 min-h-[120px] max-h-[260px] overflow-y-auto text-xs sm:text-sm leading-relaxed space-y-3">
        
        {isRunning && (
          <div className="flex items-center gap-2 text-sky-400 animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
            <span>Ejecutando script de Python en el navegador...</span>
          </div>
        )}

        {!isRunning && !result && (
          <p className="text-slate-600 dark:text-slate-500 italic select-none">
            Presiona el botón "Ejecutar ▶" para ver la salida de tu programa aquí.
          </p>
        )}

        {/* Standard Output (stdout) */}
        {!isRunning && result && result.stdout && (
          <div className="text-emerald-400 whitespace-pre-wrap selection:bg-emerald-900/50">
            {result.stdout}
          </div>
        )}

        {/* Educational Friendly Error Box */}
        {!isRunning && result && result.friendlyError && (
          <div className="mt-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{result.friendlyError.title}</span>
            </div>

            <p className="text-xs text-rose-300 leading-relaxed">
              {result.friendlyError.message}
            </p>

            <div className="pt-2 border-t border-rose-900/50 flex items-start gap-2 text-xs text-amber-300">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{result.friendlyError.tip}</span>
            </div>
          </div>
        )}

        {/* Success marker if execution finished cleanly without errors and produced output */}
        {!isRunning && result && result.success && result.stdout && (
          <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5 select-none">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Programa finalizado con código de salida 0</span>
          </div>
        )}

      </div>
    </div>
  );
};
