import { ExecutionResult } from '../types/course';
import { explainPythonError } from './errorExplainer';

declare global {
  interface Window {
    loadPyodide?: (config: any) => Promise<any>;
    pyodideInstance?: any;
    handlePythonInputCallback?: (promptText: string) => string;
  }
}

let pyodideLoadingPromise: Promise<any> | null = null;
let isPyodideReady = false;

// Initialize or get Pyodide instance
export async function getPyodide(): Promise<any> {
  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = (async () => {
    try {
      // Check if script already loaded
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('No se pudo cargar el script de Pyodide desde el CDN'));
          document.head.appendChild(script);
        });
      }

      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });
        window.pyodideInstance = pyodide;
        isPyodideReady = true;
        return pyodide;
      }
    } catch (err) {
      console.warn('Pyodide no pudo ser cargado desde CDN, se utilizará el motor interpretador integrado:', err);
      return null;
    }
  })();

  return pyodideLoadingPromise;
}

export function isPythonReady(): boolean {
  return isPyodideReady;
}

// Interactive input prompt handler
let customInputHandler: ((promptText: string) => Promise<string> | string) | null = null;

export function setCustomInputHandler(handler: ((promptText: string) => Promise<string> | string) | null) {
  customInputHandler = handler;
}

/**
 * Executes Python code in browser.
 * Captures stdout, handles input(), records execution time and formats errors.
 */
export async function runPythonCode(
  code: string,
  options: {
    inputs?: string[];
    onInputRequired?: (promptText: string) => Promise<string>;
  } = {}
): Promise<ExecutionResult> {
  const startTime = performance.now();
  let stdout = '';
  let stderr = '';
  let inputQueue = [...(options.inputs || [])];

  const handleInput = (promptText: string): string => {
    if (inputQueue.length > 0) {
      const val = inputQueue.shift()!;
      stdout += (promptText ? promptText + ' ' : '') + val + '\n';
      return val;
    }

    if (options.onInputRequired) {
      // Synchronous prompt fallback for Pyodide or browser window prompt
      const result = window.prompt(promptText || 'Ingresa un valor para Python:') || '';
      stdout += (promptText ? promptText + ' ' : '') + result + '\n';
      return result;
    }

    if (customInputHandler) {
      const res = customInputHandler(promptText);
      const val = typeof res === 'string' ? res : '';
      stdout += (promptText ? promptText + ' ' : '') + val + '\n';
      return val;
    }

    const fallback = window.prompt(promptText || 'Ingresa un valor para Python:') || '';
    stdout += (promptText ? promptText + ' ' : '') + fallback + '\n';
    return fallback;
  };

  try {
    const pyodide = await getPyodide();

    if (pyodide) {
      // Setup stdout capture and input handler in Pyodide
      window.handlePythonInputCallback = handleInput;

      pyodide.setStdout({
        batched: (text: string) => {
          stdout += text + '\n';
        }
      });
      pyodide.setStderr({
        batched: (text: string) => {
          stderr += text + '\n';
        }
      });

      // Hook python builtins.input
      await pyodide.runPythonAsync(`
import builtins
import js

def _custom_web_input(prompt_text=""):
    return js.handlePythonInputCallback(str(prompt_text))

builtins.input = _custom_web_input
`);

      // Run user code
      await pyodide.runPythonAsync(code);

      const endTime = performance.now();
      return {
        stdout: stdout.trimEnd(),
        stderr: stderr.trimEnd(),
        success: true,
        executionTimeMs: Math.round(endTime - startTime)
      };
    } else {
      // Offline fallback: lightweight pedagogical python interpreter
      return runFallbackPython(code, options.inputs || []);
    }
  } catch (err: any) {
    const endTime = performance.now();
    const rawError = String(err?.message || err);
    const friendly = explainPythonError(rawError);

    return {
      stdout: stdout.trimEnd(),
      stderr: rawError,
      error: rawError,
      friendlyError: friendly,
      success: false,
      executionTimeMs: Math.round(endTime - startTime)
    };
  }
}

/**
 * Lightweight safe fallback interpreter for basic Python constructs when Pyodide is loading or offline
 */
function runFallbackPython(code: string, inputs: string[] = []): ExecutionResult {
  const startTime = performance.now();
  let output = '';
  let inputIdx = 0;
  const env: Record<string, any> = {};

  try {
    const lines = code.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;

      // Handle simple print(...)
      const printMatch = line.match(/^print\((.*)\)$/);
      if (printMatch) {
        const inside = printMatch[1].trim();
        // Support f-strings
        if (inside.startsWith('f"') || inside.startsWith("f'")) {
          const content = inside.slice(2, -1);
          const evaluated = content.replace(/\{([^}]+)\}/g, (_, expr) => {
            return String(evalSimpleExpr(expr.trim(), env));
          });
          output += evaluated + '\n';
          continue;
        }

        // Multiple arguments split by comma outside quotes
        const args = splitCommaArgs(inside);
        const resolved = args.map(arg => {
          return evalSimpleExpr(arg.trim(), env);
        });
        output += resolved.join(' ') + '\n';
        continue;
      }

      // Handle input assignment: x = input("...") or x = int(input("..."))
      const inputAssignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(int|float)?\(?input\((.*?)\)\)?$/);
      if (inputAssignMatch) {
        const varName = inputAssignMatch[1];
        const converter = inputAssignMatch[2];
        const promptText = inputAssignMatch[3] ? inputAssignMatch[3].replace(/['"]/g, '') : '';
        let userVal = inputs[inputIdx++];
        if (userVal === undefined) {
          userVal = window.prompt(promptText || 'Ingresa valor:') || '0';
        }
        output += (promptText ? promptText + ' ' : '') + userVal + '\n';
        if (converter === 'int') {
          env[varName] = parseInt(userVal, 10);
        } else if (converter === 'float') {
          env[varName] = parseFloat(userVal);
        } else {
          env[varName] = userVal;
        }
        continue;
      }

      // Handle simple assignment: x = ...
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const expr = assignMatch[2].trim();
        env[varName] = evalSimpleExpr(expr, env);
        continue;
      }
    }

    return {
      stdout: output.trimEnd(),
      stderr: '',
      success: true,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  } catch (err: any) {
    const raw = String(err?.message || err);
    return {
      stdout: output.trimEnd(),
      stderr: raw,
      error: raw,
      friendlyError: explainPythonError(raw),
      success: false,
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }
}

function splitCommaArgs(str: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (quoteChar === char) {
        inQuotes = false;
      }
    }

    if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) result.push(current);
  return result;
}

function evalSimpleExpr(expr: string, env: Record<string, any>): any {
  expr = expr.trim();
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }
  if (expr === 'True') return true;
  if (expr === 'False') return false;
  if (!isNaN(Number(expr))) return Number(expr);
  if (expr in env) return env[expr];

  // Try math evaluation with variables
  try {
    let replaced = expr;
    for (const [k, v] of Object.entries(env)) {
      const reg = new RegExp(`\\b${k}\\b`, 'g');
      replaced = replaced.replace(reg, JSON.stringify(v));
    }
    // Replace python operators
    replaced = replaced.replace(/\/\//g, '/Math.floor');
    replaced = replaced.replace(/\*\*/g, '**');
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${replaced})`)();
  } catch {
    return expr;
  }
}
