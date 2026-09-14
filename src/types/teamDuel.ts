/**
 * Tipos de datos para el Duelo de Equipos (Fase 1 de Supabase)
 * Fuente de verdad: supabase/migrations/20260913_create_team_duel.sql
 */

// ==============================================================================
// Estados oficiales de la partida y equipos
// ==============================================================================

export type DuelMatchStatus =
  | 'lobby'
  | 'question_preview'
  | 'question_active'
  | 'round_review'
  | 'finished';

export type DuelTeamStatus = 'connected' | 'disconnected';

// ==============================================================================
// Modelos de Tablas de Supabase
// ==============================================================================

/**
 * Registro de configuración global (tabla: duel_settings)
 */
export interface DuelSettings {
  id: string; // 'global'
  is_enabled: boolean;
  active_match_id: string | null;
  updated_at: string;
  updated_by: string | null;
}

/**
 * Registro de partida (tabla: duel_matches)
 */
export interface DuelMatch {
  id: string;
  pin: string;
  status: DuelMatchStatus;
  current_round: number;
  total_rounds: number;
  current_question_id: string | null;
  round_started_at: string | null;
  round_ends_at: string | null;
  created_at: string;
  created_by: string;
}

/**
 * Registro de equipo público (tabla: duel_teams)
 * Nota de seguridad: No contiene tokens secretos. Seguro para Realtime.
 */
export interface DuelTeam {
  id: string;
  match_id: string;
  team_name: string;
  avatar: string;
  total_score: number;
  rounds_won: number;
  total_time_ms: number;
  status: DuelTeamStatus;
  created_at: string;
}

/**
 * Secreto de sesión del equipo (tabla privada: duel_team_secrets)
 * Solo utilizado internamente para tipado de persistencia de credencial.
 */
export interface DuelTeamSecret {
  team_id: string;
  session_token: string;
  created_at: string;
}

/**
 * Registro de respuesta por ronda (tabla: duel_answers)
 * Protegido por RLS: solo visible en round_review o finished para alumnos.
 */
export interface DuelAnswer {
  id: string;
  match_id: string;
  round_number: number;
  team_id: string;
  question_id: string;
  selected_option: number;
  submitted_at: string;
  response_time_ms: number;
  is_correct: boolean;
  points_awarded: number;
}

/**
 * Registro de pregunta utilizada en una ronda (tabla: duel_round_questions)
 */
export interface DuelRoundQuestion {
  round_number: number;
  question_id: string;
  created_at?: string;
}

/**
 * Progreso en vivo de la ronda activa retornado por get_duel_live_progress()
 * Expone exclusivamente has_answered sin filtrar opciones ni tiempos.
 */
export interface DuelLiveProgress {
  match_id: string;
  round_number: number;
  team_id: string;
  has_answered: boolean;
}

// ==============================================================================
// Sesión Local del Equipo (Almacenada en sessionStorage)
// ==============================================================================

export interface LocalTeamSession {
  match_id: string;
  team_id: string;
  session_token: string;
  team_name?: string;
  avatar?: string;
}

// ==============================================================================
// Estructuras de Respuesta de las RPC de Supabase
// ==============================================================================

export interface DuelRpcError {
  success: false;
  error: string;
  already_resolved?: boolean;
}

// RPC 1: create_duel_match
export interface CreateDuelMatchSuccess {
  success: true;
  match_id: string;
  pin: string;
  status: 'lobby';
  current_round: 1;
  total_rounds: 10;
}
export type CreateDuelMatchResult = CreateDuelMatchSuccess | DuelRpcError;

// RPC 2: join_duel_team
export interface JoinDuelTeamSuccess {
  success: true;
  match_id: string;
  team_id: string;
  team_name: string;
  avatar: string;
  session_token: string;
}
export type JoinDuelTeamResult = JoinDuelTeamSuccess | DuelRpcError;

// RPC 3: start_duel_match
export interface StartDuelMatchSuccess {
  success: true;
  status: 'question_preview';
  current_round: 1;
  current_question_id: string | null;
  teams_count: number;
}
export type StartDuelMatchResult = StartDuelMatchSuccess | DuelRpcError;

// RPC 4: set_duel_question
export interface SetDuelQuestionSuccess {
  success: true;
  question_id: string;
}
export type SetDuelQuestionResult = SetDuelQuestionSuccess | DuelRpcError;

// RPC 5: start_duel_round
export interface StartDuelRoundSuccess {
  success: true;
  status: 'question_active';
  current_round: number;
  question_id: string;
  round_started_at: string;
  round_ends_at: string;
}
export type StartDuelRoundResult = StartDuelRoundSuccess | DuelRpcError;

// RPC 6: submit_duel_answer
export interface SubmitDuelAnswerSuccess {
  success: true;
  has_answered: true;
  message: string;
}
export type SubmitDuelAnswerResult = SubmitDuelAnswerSuccess | DuelRpcError;

// RPC 7: resolve_duel_round
export interface ResolveDuelRoundSuccess {
  success: true;
  status: 'round_review';
  round_number: number;
  question_id?: string;
  correct_answer?: number;
  explanation?: string;
  already_resolved?: boolean;
}
export type ResolveDuelRoundResult = ResolveDuelRoundSuccess | DuelRpcError;

export interface TeacherRoundSolution {
  question_id: string;
  correct_answer: number;
  explanation: string;
}

// RPC 8: advance_duel_round
export interface AdvanceDuelRoundNextSuccess {
  success: true;
  status: 'question_preview';
  current_round: number;
  current_question_id: string;
}

export interface AdvanceDuelRoundFinishSuccess {
  success: true;
  status: 'finished';
  message: string;
}

export type AdvanceDuelRoundSuccess =
  | AdvanceDuelRoundNextSuccess
  | AdvanceDuelRoundFinishSuccess;

export type AdvanceDuelRoundResult = AdvanceDuelRoundSuccess | DuelRpcError;

// RPC 10: heartbeat_duel_team
export interface HeartbeatDuelTeamSuccess {
  success: true;
}
export type HeartbeatDuelTeamResult = HeartbeatDuelTeamSuccess | DuelRpcError;

// RPC: get_duel_used_questions
export interface GetDuelUsedQuestionsSuccess {
  success: true;
  used_questions: DuelRoundQuestion[];
}
export type GetDuelUsedQuestionsResult = GetDuelUsedQuestionsSuccess | DuelRpcError;
