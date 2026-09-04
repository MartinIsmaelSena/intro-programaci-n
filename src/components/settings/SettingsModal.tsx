import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { Settings, Moon, Sun, RotateCcw, User, Check, AlertTriangle, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { progress, setUserName, toggleTheme, resetAllProgress } = useProgress();
  const [nameInput, setNameInput] = useState(progress.userName);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleReset = () => {
    resetAllProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-python-blue dark:text-sky-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Configuración de la Plataforma
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Name Form */}
        <form onSubmit={handleSaveName} className="space-y-3">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Nombre de estudiante
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Tu nombre o apodo"
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-python-blue"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : 'Guardar'}
            </button>
          </div>
          {savedSuccess && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
              ✔ Nombre actualizado correctamente
            </p>
          )}
        </form>

        {/* Theme Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Modo visual (Tema)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                if (progress.theme !== 'light') toggleTheme();
              }}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                progress.theme === 'light'
                  ? 'border-python-blue bg-sky-50 text-python-blue shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>☀️ Modo Claro</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (progress.theme !== 'dark') toggleTheme();
              }}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                progress.theme === 'dark'
                  ? 'border-sky-500 bg-sky-950/60 text-sky-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-4 h-4 text-sky-400" />
              <span>🌙 Modo Oscuro</span>
            </button>
          </div>
        </div>

        {/* Danger Zone: Reset Progress */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-rose-500 uppercase tracking-wider">
            Zona de peligro
          </label>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar todo mi progreso</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs space-y-3 animate-fadeIn">
              <div className="flex items-start gap-2 text-rose-800 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <p>
                  ¿Estás seguro? Esta acción borrará todas tus insignias, puntos XP y ejercicios completados de este navegador.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors shadow-sm"
                >
                  Sí, reiniciar todo
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
