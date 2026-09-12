import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : ({} as any);
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
const ONLINE_MODE = env.VITE_ONLINE_MODE || '';

/**
 * Verifica si las credenciales de Supabase están disponibles
 */
export function isSupabaseConfigured(): boolean {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.trim().length > 0 &&
    !SUPABASE_URL.includes('tu-proyecto') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.trim().length > 0 &&
    !SUPABASE_ANON_KEY.includes('tu-anon-key')
  );
}

/**
 * Determina si el modo realtime de Supabase debe estar activo
 */
export function isRealtimeEnabled(): boolean {
  if (ONLINE_MODE === 'mock') return false;
  return isSupabaseConfigured();
}

/**
 * Instancia singleton del cliente Supabase
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

/**
 * Obtiene o genera un identificador anónimo de sesión único y persistente para este navegador
 */
const SESSION_ID_KEY = 'python_online_session_id_v2';

export function getOrCreateSessionId(): string {
  try {
    let sid = localStorage.getItem(SESSION_ID_KEY);
    if (!sid || sid.trim().length === 0) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sid = crypto.randomUUID();
      } else {
        sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);
      }
      localStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch (err) {
    console.error('Error al obtener sessionId:', err);
    return 'sess_fallback_' + Date.now();
  }
}
