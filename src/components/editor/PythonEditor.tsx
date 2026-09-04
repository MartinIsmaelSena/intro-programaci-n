import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, Trash2, Terminal, Code2, Loader2 } from 'lucide-react';

interface PythonEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onReset: () => void;
  onClearConsole?: () => void;
  isRunning: boolean;
}

export const PythonEditor: React.FC<PythonEditorProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  isRunning
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 6);

  // Handle Tab key insertion (4 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }

    // Ctrl+Enter or Cmd+Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
  };

  // Sync scroll of line numbers with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-md flex flex-col">
      
      {/* Editor Header / Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-python-yellow" />
          <span className="text-xs font-bold text-slate-300">Editor Python</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            main.py
          </span>
          <span className="hidden sm:inline text-[10px] text-slate-500">
            (Ctrl + Enter para ejecutar)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onReset}
            disabled={isRunning}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Restaurar código inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 transform active:scale-95"
            title="Ejecutar código en el navegador (Ctrl+Enter)"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Ejecutar ▶</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Editor Body: Line numbers + Textarea */}
      <div className="relative flex font-mono text-sm leading-6 min-h-[160px] max-h-[360px] overflow-hidden bg-[#1e1e2e]">
        
        {/* Line Numbers column */}
        <div
          ref={lineNumbersRef}
          className="w-10 sm:w-12 select-none py-3 text-right pr-3 text-slate-600 bg-[#181825] border-r border-slate-800/80 overflow-hidden font-mono text-xs"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 p-3 bg-transparent text-slate-100 placeholder-slate-600 resize-none focus:outline-none font-mono text-sm leading-6 selection:bg-python-blue/50 overflow-y-auto whitespace-pre tab-4"
          placeholder="# Escribe tu código Python aquí..."
        />
      </div>

    </div>
  );
};
