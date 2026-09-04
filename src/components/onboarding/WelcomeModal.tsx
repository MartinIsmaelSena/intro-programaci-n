import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { progress, setUserName } = useProgress();
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');

  // If user already has a name or completed onboarding, do not show
  if (progress.userName && progress.onboardingCompleted) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError('Por favor escribe tu nombre o apodo para continuar.');
      return;
    }
    setUserName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-python-blue/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-python-yellow/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-python-blue/10 dark:bg-sky-950 text-python-blue dark:text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-python-yellow" />
            <span>Plataforma Interactiva para Principiantes</span>
          </div>
        </div>

        {/* Title & Introduction */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          👋 ¡Hola! Bienvenido a <span className="bg-gradient-to-r from-python-blue to-sky-500 bg-clip-text text-transparent">Python desde Cero</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Antes de comenzar esta emocionante aventura de programar, queremos conocerte. No necesitas registrarte ni crear contraseñas.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="user-name-input"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2"
            >
              ¿Cuál es tu nombre o apodo?
            </label>
            <input
              id="user-name-input"
              type="text"
              value={inputName}
              onChange={e => {
                setInputName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Escribe tu nombre aquí (ej: Martín)"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-python-blue dark:focus:ring-sky-500 transition-all text-base"
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Value props bullets */}
          <div className="space-y-2 pt-1 pb-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Aprende a tu propio ritmo con teoría clara y analogías cotidianas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Ejecuta código Python real directamente en tu navegador sin instalar nada</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Desbloquea insignias, acumula XP y sigue tu progreso en tiempo real</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-python-blue to-python-blue-dark hover:from-python-blue-light hover:to-python-blue text-white font-bold text-base shadow-lg shadow-python-blue/30 hover:shadow-python-blue/40 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
          >
            <span>Comenzar a aprender</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};
