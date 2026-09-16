import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  DuelSettings,
  DuelMatch,
  DuelTeam,
  DuelAnswer,
  DuelLiveProgress,
  LocalTeamSession,
  CreateDuelMatchResult,
  JoinDuelTeamResult,
  StartDuelMatchResult,
  SetDuelQuestionResult,
  StartDuelRoundResult,
  SubmitDuelAnswerResult,
  ResolveDuelRoundResult,
  AdvanceDuelRoundResult,
  HeartbeatDuelTeamResult,
  DuelRoundQuestion,
  DeleteDuelTeamResult,
  EjectDuelTeamResult
} from '../types/teamDuel';

/**
 * Servicio Centralizado para el Duelo de Equipos (Fase 1 & Fase 2.1)
 * Encapsula de forma estricta las RPCs de Supabase y suscripciones Realtime permitidas.
 *
 * REGLA FUNDAMENTAL:
 * El frontend NO evalúa respuestas, NO asigna puntos, NO calcula tiempos oficiales
 * y NO accede a tablas privadas (duel_team_secrets, online_questions_truth).
 */

const AUTHORIZED_TEACHER_EMAIL = 'senamartin.ismael@gmail.com';
const SESSION_STORAGE_KEY = 'python_team_duel_session_v1';

// ==============================================================================
// 1. Gestión de Sesión Local del Equipo (sessionStorage)
// ==============================================================================

/**
 * Guarda la sesión del equipo en sessionStorage para tolerar recargas de página.
 * NOTA DE SEGURIDAD: El session_token NUNCA se emite en logs ni se expone públicamente.
 */
export function saveTeamSession(session: LocalTeamSession): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;

  if (!session.match_id || !session.team_id || !session.session_token) {
    return;
  }

  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage restringido o lleno
  }
}

/**
 * Recupera la sesión activa del equipo desde sessionStorage.
 */
export function getTeamSession(): LocalTeamSession | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && parsed.match_id && parsed.team_id && parsed.session_token) {
      return parsed as LocalTeamSession;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Elimina la sesión local del equipo al finalizar la partida o abandonar.
 */
export function clearTeamSession(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;

  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Silencioso
  }
}

// ==============================================================================
// 2. RPCs del Docente
// ==============================================================================

/**
 * RPC 8.1: create_duel_match
 * Genera atómicamente un PIN único de 6 dígitos y crea una nueva partida en estado 'lobby'.
 */
export async function createDuelMatch(pin?: string): Promise<CreateDuelMatchResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('create_duel_match', {
      p_pin: pin ? pin.trim() : null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al crear partida.' };
    }

    return data as CreateDuelMatchResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al crear partida.' };
  }
}

/**
 * RPC 8.3: start_duel_match
 * Valida que existan entre 2 y 5 equipos y transiciona la partida de 'lobby' a 'question_preview'.
 */
export async function startDuelMatch(
  matchId: string,
  initialQuestionId?: string
): Promise<StartDuelMatchResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('start_duel_match', {
      p_match_id: matchId,
      p_initial_question_id: initialQuestionId ? initialQuestionId.trim() : null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al iniciar partida.' };
    }

    return data as StartDuelMatchResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al iniciar partida.' };
  }
}

/**
 * RPC 8.4: set_duel_question
 * Asigna la pregunta activa durante 'lobby' o 'question_preview', impidiendo reutilización de preguntas.
 */
export async function setDuelQuestion(
  matchId: string,
  questionId: string
): Promise<SetDuelQuestionResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('set_duel_question', {
      p_match_id: matchId,
      p_question_id: questionId.trim()
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al asignar pregunta.' };
    }

    return data as SetDuelQuestionResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al asignar pregunta.' };
  }
}

/**
 * RPC 8.5: start_duel_round
 * Transiciona de 'question_preview' a 'question_active' fijando 30 segundos autoritativos en PostgreSQL.
 */
export async function startDuelRound(
  matchId: string,
  questionId?: string
): Promise<StartDuelRoundResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('start_duel_round', {
      p_match_id: matchId,
      p_question_id: questionId ? questionId.trim() : null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al iniciar ronda.' };
    }

    return data as StartDuelRoundResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al iniciar ronda.' };
  }
}

/**
 * RPC 8.7: resolve_duel_round
 * 100% IDEMPOTENTE con FOR UPDATE. Evalúa velocidades con DENSE_RANK (4, 2, 1 pts) y transiciona a 'round_review'.
 */
export async function resolveDuelRound(matchId: string): Promise<ResolveDuelRoundResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('resolve_duel_round', {
      p_match_id: matchId
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al resolver ronda.' };
    }

    return data as ResolveDuelRoundResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al resolver ronda.' };
  }
}

/**
 * RPC 8.8: advance_duel_round
 * Rondas 1-9: valida siguiente pregunta única y pasa a 'question_preview'.
 * Ronda 10: finaliza la partida a 'finished' y libera active_match_id en duel_settings.
 */
export async function advanceDuelRound(
  matchId: string,
  nextQuestionId?: string
): Promise<AdvanceDuelRoundResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('advance_duel_round', {
      p_match_id: matchId,
      p_next_question_id: nextQuestionId ? nextQuestionId.trim() : null
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al avanzar de ronda.' };
    }

    return data as AdvanceDuelRoundResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al avanzar de ronda.' };
  }
}

/**
 * RPC: eject_duel_team
 * Permite al docente autorizado retirar/expulsar un equipo de la partida.
 * Marca el estado como 'removed', destruye sus credenciales de sesión en duel_team_secrets
 * y libera el cupo inmediatamente.
 */
export async function ejectDuelTeam(
  matchId: string,
  teamId: string
): Promise<EjectDuelTeamResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('eject_duel_team', {
      p_match_id: matchId,
      p_team_id: teamId
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al expulsar equipo.' };
    }

    return data as EjectDuelTeamResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al expulsar equipo.' };
  }
}

/**
 * RPC: delete_duel_team
 * Permite al docente autorizado eliminar permanentemente un equipo del lobby o sala de espera.
 */
export async function deleteDuelTeam(
  matchId: string,
  teamId: string
): Promise<DeleteDuelTeamResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('delete_duel_team', {
      p_match_id: matchId,
      p_team_id: teamId
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al eliminar equipo.' };
    }

    return data as DeleteDuelTeamResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al eliminar equipo.' };
  }
}

// ==============================================================================
// 3. RPCs del Alumno
// ==============================================================================

/**
 * RPC 8.2: join_duel_team
 * Registra un equipo con bloqueo pesimista contra límite de 5 equipos.
 * Devuelve team_id y session_token seguro.
 */
export async function joinDuelTeam(
  matchId: string,
  teamName: string,
  avatar: string
): Promise<JoinDuelTeamResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('join_duel_team', {
      p_match_id: matchId,
      p_team_name: teamName.trim(),
      p_avatar: avatar.trim()
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al unirse al equipo.' };
    }

    return data as JoinDuelTeamResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al unirse al equipo.' };
  }
}

/**
 * RPC 8.6: submit_duel_answer
 * Envía la opción elegida por el equipo (0-3).
 * El servidor mide el tiempo, valida el session_token, verifica contra online_questions_truth e inserta.
 */
export async function submitDuelAnswer(
  matchId: string,
  teamId: string,
  sessionToken: string,
  roundNumber: number,
  selectedOption: number
): Promise<SubmitDuelAnswerResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('submit_duel_answer', {
      p_match_id: matchId,
      p_team_id: teamId,
      p_session_token: sessionToken,
      p_round_number: roundNumber,
      p_selected_option: selectedOption
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del servidor al enviar respuesta.' };
    }

    return data as SubmitDuelAnswerResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al enviar respuesta.' };
  }
}

/**
 * RPC 8.9: get_duel_live_progress
 * Consulta qué equipos ya respondieron en la ronda activa sin filtrar respuestas ni tiempos.
 */
export async function getDuelLiveProgress(matchId: string): Promise<DuelLiveProgress[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase.rpc('get_duel_live_progress', {
      p_match_id: matchId
    });

    if (error || !data || !Array.isArray(data)) {
      return [];
    }

    return data as DuelLiveProgress[];
  } catch {
    return [];
  }
}

/**
 * RPC 8.10: heartbeat_duel_team
 * Actualiza la presencia del equipo en la partida validando el session_token.
 */
export async function heartbeatDuelTeam(
  teamId: string,
  sessionToken: string,
  status: 'connected' | 'disconnected' = 'connected'
): Promise<HeartbeatDuelTeamResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.rpc('heartbeat_duel_team', {
      p_team_id: teamId,
      p_session_token: sessionToken,
      p_status: status
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Respuesta inválida del heartbeat.' };
    }

    return data as HeartbeatDuelTeamResult;
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red en heartbeat.' };
  }
}

// ==============================================================================
// 4. Consultas y Actualizaciones Directas (Tablas Públicas)
// ==============================================================================

/**
 * Consulta el estado global del duelo en public.duel_settings.
 */
export async function fetchDuelSettings(): Promise<DuelSettings | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('duel_settings')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();

    if (error || !data) return null;
    return data as DuelSettings;
  } catch {
    return null;
  }
}

/**
 * Habilita o deshabilita globalmente el Duelo de Equipos.
 * Solo permitido para el docente autenticado ('senamartin.ismael@gmail.com').
 */
export async function updateDuelSetting(
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { error } = await supabase
      .from('duel_settings')
      .update({
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
        updated_by: AUTHORIZED_TEACHER_EMAIL
      })
      .eq('id', 'global');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar configuración de duelo.' };
  }
}

/**
 * Consulta los datos de una partida por su UUID.
 */
export async function fetchDuelMatch(matchId: string): Promise<DuelMatch | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('duel_matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (error || !data) return null;
    return data as DuelMatch;
  } catch {
    return null;
  }
}

/**
 * Consulta una partida activa por su PIN de 6 dígitos.
 */
export async function fetchDuelMatchByPin(pin: string): Promise<DuelMatch | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const cleanPin = pin.trim();
  if (cleanPin.length !== 6) return null;

  try {
    const { data, error } = await supabase
      .from('duel_matches')
      .select('*')
      .eq('pin', cleanPin)
      .maybeSingle();

    if (error || !data) return null;
    return data as DuelMatch;
  } catch {
    return null;
  }
}

/**
 * Consulta la lista de equipos de una partida ordenados por puntuación y velocidad.
 */
export async function fetchDuelTeams(matchId: string): Promise<DuelTeam[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from('duel_teams')
      .select('*')
      .eq('match_id', matchId)
      .neq('status', 'removed')
      .order('total_score', { ascending: false })
      .order('total_time_ms', { ascending: true });

    if (error || !data) return [];
    return data as DuelTeam[];
  } catch {
    return [];
  }
}

/**
 * Consulta las respuestas de una partida para revisión (solo accesible en round_review/finished).
 */
export async function fetchDuelAnswers(
  matchId: string,
  roundNumber?: number
): Promise<DuelAnswer[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  try {
    let query = supabase
      .from('duel_answers')
      .select('*')
      .eq('match_id', matchId);

    if (roundNumber !== undefined) {
      query = query.eq('round_number', roundNumber);
    }

    const { data, error } = await query.order('points_awarded', { ascending: false });

    if (error || !data) return [];
    return data as DuelAnswer[];
  } catch {
    return [];
  }
}

/**
 * Consulta el historial persistente de preguntas utilizadas en la partida.
 * Solo accesible para el docente autenticado.
 */
export async function fetchDuelUsedQuestions(
  matchId: string
): Promise<DuelRoundQuestion[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  try {
    // 1. Intentar mediante RPC segura get_duel_used_questions
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_duel_used_questions', {
      p_match_id: matchId
    });

    if (!rpcError && rpcData && (rpcData as any).success && Array.isArray((rpcData as any).used_questions)) {
      return (rpcData as any).used_questions as DuelRoundQuestion[];
    }

    // 2. Fallback a consulta directa sobre duel_round_questions (protegida por RLS)
    const { data, error } = await supabase
      .from('duel_round_questions')
      .select('round_number, question_id, created_at')
      .eq('match_id', matchId)
      .order('round_number', { ascending: true });

    if (error || !data) return [];
    return data as DuelRoundQuestion[];
  } catch {
    return [];
  }
}

// ==============================================================================
// 5. Suscripciones Realtime Seguras (Únicamente Tablas Públicas)
// ==============================================================================

/**
 * Suscripción Realtime a duel_settings para reflejar habilitación/bloqueo instantáneo.
 */
export function subscribeToDuelSettings(
  onUpdate: (settings: DuelSettings) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:duel_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'duel_settings' },
        async () => {
          const fresh = await fetchDuelSettings();
          if (fresh) onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

/**
 * Suscripción Realtime a duel_matches para sincronizar transiciones de estado de la partida.
 */
export function subscribeToDuelMatch(
  matchId: string,
  onUpdate: (match: DuelMatch) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  try {
    const channel = supabase
      .channel(`duel_match_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'duel_matches',
          filter: `id=eq.${matchId}`
        },
        payload => {
          if (payload.new) {
            onUpdate(payload.new as DuelMatch);
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

/**
 * Suscripción Realtime a duel_teams para reflejar nuevos equipos y actualización de puntuaciones.
 */
export function subscribeToDuelTeams(
  matchId: string,
  onUpdate: (teams: DuelTeam[]) => void
): () => void {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  try {
    const channel = supabase
      .channel(`duel_teams_${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'duel_teams',
          filter: `match_id=eq.${matchId}`
        },
        async () => {
          const freshTeams = await fetchDuelTeams(matchId);
          onUpdate(freshTeams);
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
