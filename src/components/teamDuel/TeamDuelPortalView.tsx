import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  getTeacherAuthState,
  TeacherAuthState
} from '../../services/teacherAuthService';
import {
  fetchDuelSettings,
  subscribeToDuelSettings
} from '../../services/teamDuelService';
import { StudentDuelView } from './StudentDuelView';
import { TeacherDuelStage } from './TeacherDuelStage';
import {
  Lock,
  Loader2
} from 'lucide-react';

interface TeamDuelPortalViewProps {
  onNavigate?: (view: any) => void;
}

export const TeamDuelPortalView: React.FC<TeamDuelPortalViewProps> = ({ onNavigate }) => {
  // 1. Estado autenticado del docente (Supabase Auth existente)
  const [teacherAuth, setTeacherAuth] = useState<TeacherAuthState>({
    isAuthenticated: false,
    email: null,
    loading: true
  });

  // 2. Estado de habilitación global (public.duel_settings)
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);

  // Verificación de sesión docente
  const refreshAuthState = useCallback(async () => {
    const state = await getTeacherAuthState();
    setTeacherAuth(state);
  }, []);

  useEffect(() => {
    refreshAuthState();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshAuthState();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshAuthState]);

  // Carga inicial y suscripción Realtime a duel_settings
  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoadingSettings(true);
      const settings = await fetchDuelSettings();
      if (mounted) {
        setIsEnabled(settings ? Boolean(settings.is_enabled) : false);
        setLoadingSettings(false);
      }
    }

    loadSettings();

    const unsubscribe = subscribeToDuelSettings(freshSettings => {
      if (mounted && freshSettings) {
        setIsEnabled(Boolean(freshSettings.is_enabled));
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Estado general de carga inicial
  const isLoading = teacherAuth.loading || loadingSettings;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 animate-fadeIn">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Cargando Duelo de Equipos...
        </p>
      </div>
    );
  }

  // ============================================================================
  // EXPERIENCIA 1: DOCENTE AUTORIZADO (PROYECCIÓN / PANEL DE CONTROL)
  // ============================================================================
  if (teacherAuth.isAuthenticated) {
    return <TeacherDuelStage onNavigate={onNavigate} />;
  }

  // ============================================================================
  // EXPERIENCIA 2: ALUMNO - DUELO DESHABILITADO
  // ============================================================================
  if (!isEnabled) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              🏆 Duelo de Equipos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              El Duelo de Equipos no está habilitado actualmente por el docente.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              El docente activará esta sección en el aula cuando inicie la competencia presencial.
            </p>
          </div>

          {onNavigate && (
            <div className="pt-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-python-blue hover:bg-python-blue-light text-white shadow-sm transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // EXPERIENCIA 3: ALUMNO - DUELO HABILITADO
  // ============================================================================
  return (
    <StudentDuelView onNavigate={onNavigate} />
  );
};
