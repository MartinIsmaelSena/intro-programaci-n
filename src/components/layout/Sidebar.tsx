import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  Home,
  Map,
  BookOpen,
  FileText,
  Award,
  BarChart3,
  RotateCcw,
  Globe,
  Settings,
  Rocket,
  Trophy,
  Swords,
  Brain,
  X,
  Users
} from 'lucide-react';

export type ViewType = 'dashboard' | 'roadmap' | 'courses' | 'module' | 'exams' | 'challenges' | 'online-challenges' | 'team-duel' | 'logic-arena' | 'ranking' | 'badges' | 'progress' | 'review' | 'resources' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile
}) => {
  const { progress } = useProgress();

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Inicio', icon: Home, badge: null },
    { id: 'roadmap' as ViewType, label: 'Mi camino', icon: Map, badge: 'Ruta' },
    { id: 'courses' as ViewType, label: 'Curso', icon: BookOpen, badge: '15 Módulos' },
    { id: 'exams' as ViewType, label: 'Exámenes', icon: FileText, badge: '5 Bloques' },
    { id: 'challenges' as ViewType, label: 'Desafíos', icon: Rocket, badge: 'Nuevo' },
    { id: 'online-challenges' as ViewType, label: 'Desafíos en línea', icon: Swords, badge: '⚔️ 1v1' },
    { id: 'team-duel' as ViewType, label: 'Duelo de Equipos', icon: Users, badge: '🏆 Equipos' },
    { id: 'logic-arena' as ViewType, label: 'Arena de Lógica', icon: Brain, badge: '🧠 Práctica' },
    { id: 'ranking' as ViewType, label: 'Alumnos del mes', icon: Trophy, badge: 'Top 5' },
    { id: 'badges' as ViewType, label: 'Mis insignias', icon: Award, badge: `${progress.unlockedBadges.length}` },
    { id: 'progress' as ViewType, label: 'Mi progreso', icon: BarChart3, badge: null },
    { id: 'review' as ViewType, label: 'Repasar', icon: RotateCcw, badge: null },
    { id: 'resources' as ViewType, label: 'Sobre Python', icon: Globe, badge: 'Oficial' },
    { id: 'settings' as ViewType, label: 'Configuración', icon: Settings, badge: null },
  ];

  const handleSelect = (view: ViewType) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between pb-3 mb-2 md:hidden border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐍</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">Menú</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'module');

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-python-blue text-white shadow-md shadow-python-blue/25 dark:bg-sky-600'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Status Card */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-python-blue/10 dark:bg-python-blue/20 text-python-blue dark:text-sky-400 flex items-center justify-center font-bold text-base border border-python-blue/20">
                {progress.userName ? progress.userName.charAt(0).toUpperCase() : '🐍'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  👋 {progress.userName ? `Hola, ${progress.userName}` : 'Bienvenido'}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Estás aprendiendo Python
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelect('settings')}
              className="mt-2.5 w-full py-1.5 text-xs text-center font-medium text-slate-500 dark:text-slate-400 hover:text-python-blue dark:hover:text-sky-400 transition-colors"
            >
              Cambiar nombre o ajustar perfil →
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
