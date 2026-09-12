import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AUTHORIZED_TEACHER_EMAIL } from './teacherAuthService';

export interface ExamSettingRecord {
  exam_id: string;
  is_enabled: boolean;
  updated_at: string;
  updated_by: string | null;
}

// Configuración por defecto si la base de datos está offline o no configurada
export const DEFAULT_EXAM_SETTINGS: Record<string, boolean> = {
  'exam-1': true,
  'exam-2': false,
  'exam-3': false,
  'exam-4': false,
  'exam-5': false
};

/**
 * Consulta en Supabase la disponibilidad global de todos los exámenes.
 * Fuente única y autoritativa de la plataforma.
 */
export async function fetchExamSettings(): Promise<Record<string, boolean>> {
  if (!isSupabaseConfigured() || !supabase) {
    return { ...DEFAULT_EXAM_SETTINGS };
  }

  try {
    const { data, error } = await supabase
      .from('exam_settings')
      .select('exam_id, is_enabled');

    if (error || !data || data.length === 0) {
      console.warn('[ExamSettingsService] Usando configuración por defecto:', error?.message);
      return { ...DEFAULT_EXAM_SETTINGS };
    }

    const settingsMap: Record<string, boolean> = { ...DEFAULT_EXAM_SETTINGS };
    data.forEach((row: { exam_id: string; is_enabled: boolean }) => {
      settingsMap[row.exam_id] = Boolean(row.is_enabled);
    });

    return settingsMap;
  } catch (err) {
    console.error('[ExamSettingsService] Error al consultar disponibilidad en Supabase:', err);
    return { ...DEFAULT_EXAM_SETTINGS };
  }
}

/**
 * Actualiza en Supabase el estado de habilitación/bloqueo de un examen.
 * Operación protegida por RLS: solo tendrá éxito si el usuario autenticado
 * es el docente autorizado ('senamartin.ismael@gmail.com').
 */
export async function updateExamSetting(
  examId: string,
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { error } = await supabase
      .from('exam_settings')
      .upsert({
        exam_id: examId,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
        updated_by: AUTHORIZED_TEACHER_EMAIL
      }, {
        onConflict: 'exam_id'
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar examen en la base de datos.' };
  }
}

/**
 * Suscripción en tiempo real (Supabase Realtime) para que los alumnos
 * reciban cambios de disponibilidad instantáneamente sin recargar la página.
 */
export function subscribeToExamSettings(
  onUpdate: (updatedSettings: Record<string, boolean>) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:exam_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'exam_settings' },
        async () => {
          // Cuando hay cualquier INSERT/UPDATE/DELETE, recargamos el mapa global
          const fresh = await fetchExamSettings();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[ExamSettingsService] No se pudo inicializar canal Realtime:', err);
    return () => {};
  }
}
