import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { calculateLevel, getNextLevel } from '../../data/badges';
import { Flame, Star, Sun, Moon, Menu, Award } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { progress, toggleTheme } = useProgress();
  const currentLevel = calculateLevel(progress.xp);
  const nextLevel = getNextLevel(currentLevel.level);

  // Calculate XP progress in current level bracket
  const xpInLevel = progress.xp - currentLevel.minXp;
  const levelSpan = nextLevel ? nextLevel.minXp - currentLevel.minXp : 1000;
  const progressPercent = nextLevel
    ? Math.min(100, Math.round((xpInLevel / levelSpan) * 100))
    : 100;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-2xl filter drop-shadow">🐍</span>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-python-blue to-python-blue-light dark:from-sky-400 dark:to-python-yellow bg-clip-text text-transparent">
                Python desde Cero
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                v1.0 Interactivo
              </span>
            </div>
          </div>
        </div>

        {/* Right: Gamification Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Streak */}
          <div 
            title={`Racha activa de ${progress.streakDays} días consecutivos aprendiendo`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-sm"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{progress.streakDays} <span className="hidden sm:inline">días</span></span>
          </div>

          {/* Level Pill */}
          <div 
            title={`Nivel ${currentLevel.level}: ${currentLevel.title}`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm"
          >
            <Award className="w-4 h-4 text-indigo-500" />
            <span>{currentLevel.title}</span>
          </div>

          {/* XP Pill */}
          <div 
            title={`Puntos de experiencia acumulados: ${progress.xp} XP`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-python-yellow/20 dark:bg-yellow-950/40 border border-python-yellow/50 dark:border-yellow-700/50 text-slate-800 dark:text-yellow-300 text-xs sm:text-sm font-bold shadow-sm"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{progress.xp} <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">XP</span></span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none"
            aria-label="Cambiar modo de luz"
            title={progress.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {progress.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>

      {/* Progress Bar for Current Level */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-python-blue to-python-yellow transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
          title={`Progreso hacia el siguiente nivel: ${progressPercent}%`}
        />
      </div>
    </header>
  );
};
