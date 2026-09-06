import { supabase, getOrCreateSessionId } from '../lib/supabase';
import {
  Player,
  StudentProfile,
  PlayerStats,
  IncomingChallengeData,
  InMatchChatMessage,
  LeaderboardEntry,
  LeaderboardPeriod,
  MatchResult,
  MatchAnswer,
  MatchQuestion
} from '../types/onlineChallenge';
import { getModuleTopicName } from '../utils/onlineProgressUtils';
import { validateStudentProfile, validatePlayerName } from '../utils/nameModerationUtils';

/**
 * Servicio Realtime con Supabase para Desafíos en Línea (Fase 2)
 */

export async function supabaseSyncPlayerProfile(
  profile: StudentProfile,
  xp: number,
  stats: PlayerStats
): Promise<void> {
  if (!supabase) return;

  // Capa 2: Verificación obligatoria antes de persistir en Supabase
  const { isValid, errors } = validateStudentProfile(profile);
  if (!isValid) {
    console.warn('[ONLINE] Intento de sincronizar perfil con nombre inválido o inapropiado bloqueado:', errors);
    return;
  }

  const sessionId = getOrCreateSessionId();
  const maxMod = profile.maxCompletedModule || 1;
  const topicName = profile.levelTopic || getModuleTopicName(maxMod);

  try {
    const { error } = await supabase.from('online_players').upsert(
      {
        session_id: sessionId,
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        school: profile.school.trim(),
        course: profile.course ? `${profile.course.trim()} · M${maxMod}` : `M${maxMod} (${topicName})`,
        avatar: '🧑‍💻',
        xp: xp,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.ties,
        current_streak: stats.currentStreak,
        best_streak: stats.bestStreak,
        total_xp_won: stats.totalXpWon,
        total_xp_lost: stats.totalXpLost,
        status: 'available',
        last_seen_at: new Date().toISOString()
      },
      { onConflict: 'session_id' }
    );

    if (error) {
      console.error('Error al sincronizar perfil en Supabase:', error);
    }
  } catch (err) {
    console.error('Error de red al sincronizar perfil:', err);
  }
}

/**
 * Gestión de Presencia en Tiempo Real en la Sala de Jugadores (Singleton)
 */
class LobbyPresenceManager {
  private channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
  private listeners = new Set<(players: Player[]) => void>();
  private latestPayload: any = null;
  private teardownTimeout: any = null;
  private isSubscribed = false;

  public join(
    profile: StudentProfile,
    xp: number,
    stats: PlayerStats,
    onPlayersChange: (players: Player[]) => void
  ): () => void {
    if (!supabase) return () => {};

    // Capa 2: Validación estricta antes de publicar presencia en tiempo real
    const { isValid, errors } = validateStudentProfile(profile);
    if (!isValid) {
      console.warn('[ONLINE] Intento de unirse a presencia con perfil inválido o inapropiado bloqueado:', errors);
      return () => {};
    }

    const mySessionId = getOrCreateSessionId();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
    const maxMod = profile.maxCompletedModule || 1;
    const topic = profile.levelTopic || getModuleTopicName(maxMod);

    this.latestPayload = {
      sessionId: mySessionId,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      school: profile.school.trim(),
      course: profile.course ? profile.course.trim() : '',
      avatar: '🧑‍💻',
      xp: xp,
      wins: stats.wins,
      losses: stats.losses,
      streak: stats.currentStreak,
      maxCompletedModule: maxMod,
      levelTopic: topic,
      status: 'available',
      joinedAt: Date.now()
    };

    if (this.teardownTimeout) {
      clearTimeout(this.teardownTimeout);
      this.teardownTimeout = null;
    }

    this.listeners.add(onPlayersChange);

    if (import.meta.env.DEV) {
      console.log('[ONLINE] Supabase mode active');
      console.log('[ONLINE] Session ID:', mySessionId);
      console.log('[ONLINE] Presence joined:', fullName);
    }

    if (!this.channel) {
      const existing = supabase.getChannels().find(c => c.topic === 'realtime:online-lobby-presence');
      if (existing) {
        supabase.removeChannel(existing);
      }

      this.channel = supabase.channel('online-lobby-presence', {
        config: { presence: { key: mySessionId } }
      });

      this.channel
        .on('presence', { event: 'sync' }, () => {
          this.notifyListeners(mySessionId);
        })
        .on('presence', { event: 'join' }, () => {
          this.notifyListeners(mySessionId);
        })
        .on('presence', { event: 'leave' }, () => {
          this.notifyListeners(mySessionId);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            this.isSubscribed = true;
            if (this.channel && this.latestPayload) {
              await this.channel.track(this.latestPayload);
            }
          }
        });
    } else {
      this.notifyListeners(mySessionId);
      if (this.isSubscribed && this.channel && this.latestPayload) {
        this.channel.track(this.latestPayload).catch(() => {});
      }
    }

    return () => {
      this.listeners.delete(onPlayersChange);

      if (this.listeners.size === 0) {
        this.teardownTimeout = setTimeout(() => {
          if (this.listeners.size === 0 && this.channel) {
            this.isSubscribed = false;
            this.channel.untrack().catch(() => {});
            if (supabase) {
              supabase.removeChannel(this.channel);
            }
            this.channel = null;
          }
        }, 1200);
      }
    };
  }

  private notifyListeners(mySessionId: string) {
    if (!this.channel) return;
    const state = this.channel.presenceState();
    const onlineList: Player[] = [];

    Object.keys(state).forEach(key => {
      if (key === mySessionId) return;

      const presences = state[key];
      if (presences && presences.length > 0) {
        const p: any = presences[0];
        if (!p.firstName || !p.firstName.trim()) return;

        // Defensa en profundidad: Filtrar jugadores remotos con nombres no permitidos
        const nameVal = validatePlayerName(p.firstName, 'Nombre');
        const lastNameVal = p.lastName ? validatePlayerName(p.lastName, 'Apellido') : { isValid: true };
        if (!nameVal.isValid || !lastNameVal.isValid) {
          if (import.meta.env.DEV) {
            console.warn('[ONLINE] Jugador remoto con nombre no válido filtrado del lobby:', p.firstName, p.lastName);
          }
          return;
        }

        const maxMod = typeof p.maxCompletedModule === 'number' ? p.maxCompletedModule : 1;
        const topic = p.levelTopic || getModuleTopicName(maxMod);

        onlineList.push({
          id: p.sessionId || key,
          sessionId: p.sessionId || key,
          firstName: p.firstName.trim(),
          lastName: (p.lastName || '').trim(),
          school: (p.school || 'Colegio').trim(),
          course: (p.course || '').trim(),
          avatar: p.avatar || '🧑‍💻',
          xp: typeof p.xp === 'number' ? p.xp : 0,
          wins: typeof p.wins === 'number' ? p.wins : 0,
          losses: typeof p.losses === 'number' ? p.losses : 0,
          streak: typeof p.streak === 'number' ? p.streak : 0,
          maxCompletedModule: maxMod,
          levelTopic: topic,
          status: (p.status === 'playing' || p.status === 'in_match') ? 'playing' : 'available',
          isRealPlayer: true
        });
      }
    });

    if (import.meta.env.DEV) {
      console.log('[ONLINE] Players received:', onlineList.length, onlineList);
    }

    this.listeners.forEach(callback => {
      try {
        callback(onlineList);
      } catch (err) {
        console.error('Error al notificar callback de presencia:', err);
      }
    });
  }
}

const lobbyPresenceManager = new LobbyPresenceManager();

export function supabaseJoinLobbyPresence(
  profile: StudentProfile,
  xp: number,
  stats: PlayerStats,
  onPlayersChange: (players: Player[]) => void
): () => void {
  return lobbyPresenceManager.join(profile, xp, stats, onPlayersChange);
}

/**
 * Escucha de invitaciones entrantes en tiempo real
 */
export function supabaseListenForIncomingInvitations(
  onIncoming: (inv: IncomingChallengeData) => void
): () => void {
  if (!supabase) return () => {};

  const mySessionId = getOrCreateSessionId();
  const channelName = `invitations_${mySessionId}`;

  const existing = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
  if (existing) {
    supabase.removeChannel(existing);
  }

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'online_invitations',
        filter: `opponent_session_id=eq.${mySessionId}`
      },
      payload => {
        const newRow: any = payload.new;
        if (newRow && newRow.status === 'pending') {
          const rawSchool = newRow.challenger_school || 'Colegio';
          const matchMod = rawSchool.match(/ · M(\d+)/);
          const challengerMaxModule = matchMod ? parseInt(matchMod[1], 10) : 1;
          const cleanSchool = rawSchool.replace(/ · M\d+/, '').trim();

          onIncoming({
            invitationId: newRow.id,
            challengerSessionId: newRow.challenger_session_id,
            challengerName: newRow.challenger_name,
            challengerSchool: cleanSchool,
            challengerMaxModule,
            wagerXp: newRow.wager_xp,
            questionCount: 10,
            expiresAt: newRow.expires_at
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

/**
 * Enviar invitación y esperar respuesta del rival en tiempo real
 */
export async function supabaseSendChallengeInvitation(
  opponentSessionId: string,
  wagerXp: number,
  challenger: StudentProfile
): Promise<{
  invitationId: string;
  waitForResponse: () => Promise<{ accepted: boolean; matchId?: string; reason?: string }>;
  cancel: () => Promise<void>;
}> {
  if (!supabase) throw new Error('Supabase no está configurado');

  // Validación de seguridad de identidad del retador
  const { isValid } = validateStudentProfile(challenger);
  if (!isValid) {
    throw new Error('No es posible enviar desafíos con un perfil que contiene datos no válidos.');
  }

  const mySessionId = getOrCreateSessionId();
  const challengerFullName = `${challenger.firstName} ${challenger.lastName}`.trim();
  const challengerSchoolWithMod = challenger.maxCompletedModule
    ? `${challenger.school} · M${challenger.maxCompletedModule}`
    : challenger.school;

  // 1. Crear invitación en BD
  const { data, error } = await supabase
    .from('online_invitations')
    .insert({
      challenger_session_id: mySessionId,
      challenger_name: challengerFullName,
      challenger_school: challengerSchoolWithMod,
      opponent_session_id: opponentSessionId,
      wager_xp: wagerXp,
      status: 'pending'
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('No se pudo enviar la invitación: ' + (error?.message || 'Error desconocido'));
  }

  const invitationId = data.id;

  const waitForResponse = (): Promise<{ accepted: boolean; matchId?: string; reason?: string }> => {
    return new Promise(resolve => {
      let resolved = false;

      const subChannel = supabase!
        .channel(`invitation_watch_${invitationId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'online_invitations',
            filter: `id=eq.${invitationId}`
          },
          payload => {
            const updated: any = payload.new;
            if (updated && updated.status !== 'pending' && !resolved) {
              resolved = true;
              supabase?.removeChannel(subChannel);
              if (updated.status === 'accepted') {
                resolve({ accepted: true, matchId: updated.match_id });
              } else if (updated.status === 'rejected') {
                resolve({ accepted: false, reason: 'El contrincante rechazó el desafío.' });
              } else {
                resolve({ accepted: false, reason: 'La invitación expiró.' });
              }
            }
          }
        )
        .subscribe();

      // Timeout de seguridad en cliente (65 segundos)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          supabase?.removeChannel(subChannel);
          resolve({ accepted: false, reason: 'Tiempo de espera agotado.' });
        }
      }, 65000);
    });
  };

  const cancel = async () => {
    await supabase!
      .from('online_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);
  };

  return {
    invitationId,
    waitForResponse,
    cancel
  };
}

/**
 * Responder a invitación entrante (Aceptar / Rechazar)
 */
export async function supabaseRespondToInvitation(
  invitationId: string,
  accept: boolean,
  questionIds?: string[]
): Promise<{ matchId?: string }> {
  if (!supabase) throw new Error('Supabase no está configurado');

  if (accept) {
    if (!questionIds || questionIds.length === 0) {
      throw new Error('Se requieren los IDs de las 10 preguntas para crear la partida');
    }

    const mySessionId = getOrCreateSessionId();
    let rpcRes = await supabase.rpc('fn_accept_invitation_and_create_match', {
      p_invitation_id: invitationId,
      p_question_ids: questionIds,
      p_acceptor_session_id: mySessionId
    });

    if (rpcRes.error && rpcRes.error.message.includes('Could not find the function')) {
      // Fallback a versión previa si la migración de hardening aún no fue ejecutada
      rpcRes = await supabase.rpc('fn_accept_invitation_and_create_match', {
        p_invitation_id: invitationId,
        p_question_ids: questionIds
      });
    }

    if (rpcRes.error) {
      throw new Error('Error al aceptar desafío: ' + rpcRes.error.message);
    }

    return { matchId: rpcRes.data };
  } else {
    await supabase
      .from('online_invitations')
      .update({ status: 'rejected' })
      .eq('id', invitationId);

    return {};
  }
}

/**
 * Validar límite de 3 enfrentamientos consecutivos diarios en BD
 */
export async function supabaseCheckDailyConsecutiveLimit(
  opponentSessionId: string
): Promise<boolean> {
  if (!supabase) return false;

  const mySessionId = getOrCreateSessionId();
  try {
    const { data, error } = await supabase.rpc('fn_check_daily_consecutive_matches', {
      p_player1: mySessionId,
      p_player2: opponentSessionId
    });

    if (error) {
      console.error('Error al verificar límite de partidas en BD:', error);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error('Error de conexión al verificar límite:', err);
    return false;
  }
}

/**
 * Suscripción al ciclo de vida de la partida en tiempo real
 */
export function supabaseSubscribeToMatch(
  matchId: string,
  callbacks: {
    onOpponentAnswered: (questionIndex: number, isCorrect: boolean, points?: number, responseTime?: number) => void;
    onOpponentProgress?: (rivalCorrect: number, rivalScore: number, rivalTime: number, rivalAnswerCount?: number) => void;
    onMatchCompleted: (winnerSessionId: string, matchData?: any) => void;
    onOpponentDisconnected?: () => void;
    onOpponentReconnected?: () => void;
    onChatMessage: (msg: InMatchChatMessage) => void;
  }
): () => void {
  if (!supabase) return () => {};

  const mySessionId = getOrCreateSessionId();

  // Canal de tiempo real y presencia para la partida
  const channel = supabase
    .channel(`match_${matchId}`, {
      config: { presence: { key: mySessionId } }
    })
    // Escuchar respuestas de la partida
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'online_match_answers',
        filter: `match_id=eq.${matchId}`
      },
      payload => {
        const newAns: any = payload.new;
        if (newAns && newAns.player_session_id !== mySessionId) {
          callbacks.onOpponentAnswered(
            newAns.question_index,
            Boolean(newAns.is_correct),
            Number(newAns.points || 0),
            Number(newAns.response_time_seconds || 0)
          );
        }
      }
    )
    // Escuchar cambios de estado y acumuladores en la partida (Redundancia y Finalización)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'online_matches',
        filter: `id=eq.${matchId}`
      },
      payload => {
        const updatedMatch: any = payload.new;
        if (!updatedMatch) return;

        const isP1 = updatedMatch.player1_session_id === mySessionId;
        const rivalCorrect = isP1 ? Number(updatedMatch.player2_correct || 0) : Number(updatedMatch.player1_correct || 0);
        const rivalScore = isP1 ? Number(updatedMatch.player2_score || 0) : Number(updatedMatch.player1_score || 0);
        const rivalTime = isP1 ? Number(updatedMatch.player2_time_seconds || 0) : Number(updatedMatch.player1_time_seconds || 0);
        const rivalFinished = isP1 ? Boolean(updatedMatch.player2_finished) : Boolean(updatedMatch.player1_finished);

        if (callbacks.onOpponentProgress) {
          callbacks.onOpponentProgress(rivalCorrect, rivalScore, rivalTime, rivalFinished ? 10 : undefined);
        }

        if (updatedMatch.status === 'completed') {
          callbacks.onMatchCompleted(updatedMatch.winner_session_id, updatedMatch);
        }
      }
    )
    // Escuchar mensajes de chat
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'online_match_messages',
        filter: `match_id=eq.${matchId}`
      },
      payload => {
        const newMsg: any = payload.new;
        if (newMsg) {
          callbacks.onChatMessage({
            id: newMsg.id,
            senderId: newMsg.sender_session_id,
            senderName: newMsg.sender_name,
            isUser: newMsg.sender_session_id === mySessionId,
            content: newMsg.content,
            timestamp: new Date(newMsg.created_at).getTime()
          });
        }
      }
    )
    .on('presence', { event: 'leave' }, ({ key }) => {
      if (key !== mySessionId && callbacks.onOpponentDisconnected) {
        callbacks.onOpponentDisconnected();
      }
    })
    .on('presence', { event: 'join' }, ({ key }) => {
      if (key !== mySessionId && callbacks.onOpponentReconnected) {
        callbacks.onOpponentReconnected();
      }
    })
    .subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ sessionId: mySessionId, inMatch: true });
      }
    });

  return () => {
    channel.untrack().catch(() => {});
    supabase?.removeChannel(channel);
  };
}

export const ALLOWED_CHAT_ITEMS = new Set([
  '😎 ¡Vamos!',
  '🔥 ¡Buenísima!',
  '😂 Jajaja',
  '😱 ¡Qué difícil!',
  '💪 ¡Puedo hacerlo!',
  '🤔 Estoy pensando...',
  '🎉 ¡Bien!',
  '😭 Nooo',
  '🧠 Buena respuesta',
  '👏 Muy bien',
  '😂', '🔥', '😎', '😱', '🎉', '💪', '🤔', '👏', '🐍', '🧠'
]);

/**
 * Enviar respuesta individual de una pregunta en tiempo real
 */
export async function supabaseSubmitAnswer(
  matchId: string,
  questionIndex: number,
  questionId: string,
  selectedOption: number,
  isCorrect: boolean,
  responseTime: number,
  points: number
): Promise<{
  completed: boolean;
  winnerSessionId?: string;
  serverIsCorrect?: boolean;
  serverPoints?: number;
}> {
  if (!supabase) throw new Error('Supabase no disponible');

  const mySessionId = getOrCreateSessionId();

  const { data, error } = await supabase.rpc('fn_submit_match_answer', {
    p_match_id: matchId,
    p_player_session_id: mySessionId,
    p_question_index: questionIndex,
    p_question_id: questionId,
    p_selected_option: selectedOption,
    p_is_correct: isCorrect,
    p_response_time: responseTime,
    p_points: points
  });

  if (error) {
    console.error('Error al enviar respuesta a Supabase:', error);
    return { completed: false };
  }

  return {
    completed: Boolean(data?.completed),
    winnerSessionId: data?.winner_session_id,
    serverIsCorrect: data?.is_correct,
    serverPoints: data?.points
  };
}

/**
 * Enviar mensaje de chat durante la partida
 */
export async function supabaseSendChatMessage(
  matchId: string,
  senderName: string,
  content: string
): Promise<void> {
  if (!supabase) return;

  // Capa 1 de validación: Restricción estricta en cliente a frases y emojis oficiales
  if (!ALLOWED_CHAT_ITEMS.has(content)) {
    console.warn('[SEGURIDAD] Intento de enviar mensaje de chat no autorizado bloqueado:', content);
    return;
  }

  const mySessionId = getOrCreateSessionId();

  await supabase.from('online_match_messages').insert({
    match_id: matchId,
    sender_session_id: mySessionId,
    sender_name: senderName,
    content: content
  });
}

/**
 * Reportar abandono por desconexión del oponente
 */
export async function supabaseReportAbandonment(
  matchId: string,
  opponentSessionId: string
): Promise<void> {
  if (!supabase) return;

  const mySessionId = getOrCreateSessionId();
  const { error } = await supabase.rpc('fn_abandon_match', {
    p_match_id: matchId,
    p_abandoning_session_id: opponentSessionId,
    p_caller_session_id: mySessionId
  });

  if (error && error.message.includes('Could not find the function')) {
    await supabase.rpc('fn_abandon_match', {
      p_match_id: matchId,
      p_abandoning_session_id: opponentSessionId
    });
  }
}

/**
 * Obtener ranking de jugadores desde la base de datos de Supabase
 */
export async function supabaseGetLeaderboard(
  _period: LeaderboardPeriod,
  sortBy: 'wins' | 'xp' = 'wins'
): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];

  const mySessionId = getOrCreateSessionId();
  const orderCol = sortBy === 'wins' ? 'wins' : 'total_xp_won';

  const { data, error } = await supabase
    .from('online_players')
    .select('*')
    .order(orderCol, { ascending: false })
    .limit(50);

  if (error || !data) {
    console.error('Error al cargar ranking de Supabase:', error);
    return [];
  }

  return data.map((row: any, index: number) => ({
    rank: index + 1,
    playerId: row.session_id,
    fullName: `${row.first_name} ${row.last_name}`,
    school: row.school,
    course: row.course || 'Estudiante',
    avatar: row.avatar || '🧑‍💻',
    wins: row.wins || 0,
    xpWon: row.total_xp_won || 0,
    streak: row.current_streak || 0,
    isUser: row.session_id === mySessionId
  }));
}

/**
 * Verificar de forma autoritativa el estado de una partida en Supabase
 */
export async function supabaseCheckMatchStatus(matchId: string): Promise<{
  isCompleted: boolean;
  winnerSessionId?: string;
  match?: any;
}> {
  if (!supabase) return { isCompleted: false };
  try {
    const { data, error } = await supabase
      .from('online_matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (error || !data) return { isCompleted: false };
    return {
      isCompleted: data.status === 'completed',
      winnerSessionId: data.winner_session_id,
      match: data
    };
  } catch (err) {
    console.error('Error al verificar estado de la partida:', err);
    return { isCompleted: false };
  }
}

/**
 * Obtener el resultado autoritativo final de una partida desde PostgreSQL/Supabase
 * SINGLE SOURCE OF TRUTH:
 * Ningún resumen post-partida se genera desde variables volátiles del cliente.
 */
export async function supabaseGetAuthoritativeMatchResult(
  matchId: string,
  mySessionId: string,
  currentOpponent: Player,
  questions: MatchQuestion[],
  userLocalAnswers?: Record<number, MatchAnswer>
): Promise<MatchResult> {
  if (!supabase) {
    throw new Error('Supabase no está configurado');
  }

  // 1. Intentar obtener el resumen autoritativo mediante la RPC oficial
  let summaryData: any = null;
  try {
    const { data, error } = await supabase.rpc('fn_get_match_summary', {
      p_match_id: matchId
    });
    if (!error && data) {
      summaryData = data;
    }
  } catch (_e) {
    // Continuar con consulta directa si la RPC no está lista
  }

  // 2. Si no se obtuvo de la RPC, consultar directamente las tablas online_matches y online_match_answers
  let matchRow: any = null;
  let answersRows: any[] = [];

  if (!summaryData) {
    const matchRes = await supabase
      .from('online_matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchRes.error || !matchRes.data) {
      throw new Error(`No se pudo obtener la partida autoritativa: ${matchRes.error?.message || 'No encontrada'}`);
    }
    matchRow = matchRes.data;

    const answersRes = await supabase
      .from('online_match_answers')
      .select('*')
      .eq('match_id', matchId)
      .order('question_index', { ascending: true });

    answersRows = answersRes.data || [];
  }

  // 3. Extraer métricas autoritativas de ambos jugadores
  const isP1 = summaryData
    ? summaryData.player1?.session_id === mySessionId
    : matchRow.player1_session_id === mySessionId;

  const p1Data = summaryData
    ? summaryData.player1
    : {
        session_id: matchRow.player1_session_id,
        name: matchRow.player1_name,
        score: matchRow.player1_score,
        correct: matchRow.player1_correct,
        time_seconds: matchRow.player1_time_seconds
      };

  const p2Data = summaryData
    ? summaryData.player2
    : {
        session_id: matchRow.player2_session_id,
        name: matchRow.player2_name,
        score: matchRow.player2_score,
        correct: matchRow.player2_correct,
        time_seconds: matchRow.player2_time_seconds
      };

  const myAuthoritative = isP1 ? p1Data : p2Data;
  const rivalAuthoritative = isP1 ? p2Data : p1Data;

  const myCorrect = Number(myAuthoritative.correct || 0);
  const rivalCorrect = Number(rivalAuthoritative.correct || 0);
  const myTime = Number(myAuthoritative.time_seconds || 0);
  const rivalTime = Number(rivalAuthoritative.time_seconds || 0);

  const winnerSessionId = summaryData
    ? summaryData.winner_session_id
    : matchRow.winner_session_id;

  const wagerXp = summaryData
    ? Number(summaryData.wager_xp || 0)
    : Number(matchRow.wager_xp || 0);

  const finishedAt = summaryData?.finished_at || matchRow?.finished_at || new Date().toISOString();

  // Resolución definitiva de ganador y empate (ÚNICA FUENTE DE VERDAD)
  let winnerId: string;
  let isTie = false;
  let tiebreakerReason: 'correct_count' | 'time' | 'tie' = summaryData?.tiebreaker_reason || 'correct_count';

  if (summaryData?.is_tie || winnerSessionId === 'tie') {
    winnerId = 'tie';
    isTie = true;
    tiebreakerReason = 'tie';
  } else if (winnerSessionId) {
    if (winnerSessionId === mySessionId) {
      winnerId = 'user';
      isTie = false;
      tiebreakerReason = myCorrect !== rivalCorrect ? 'correct_count' : 'time';
    } else {
      winnerId = currentOpponent.id;
      isTie = false;
      tiebreakerReason = myCorrect !== rivalCorrect ? 'correct_count' : 'time';
    }
  } else {
    // Si en BD winner_session_id es NULL (ej: empate exacto o resolución complementaria):
    // 1. Mayor cantidad de aciertos gana
    // 2. Menor tiempo acumulado gana
    // 3. Empate técnico
    if (myCorrect > rivalCorrect) {
      winnerId = 'user';
      isTie = false;
      tiebreakerReason = 'correct_count';
    } else if (rivalCorrect > myCorrect) {
      winnerId = currentOpponent.id;
      isTie = false;
      tiebreakerReason = 'correct_count';
    } else {
      const diffTime = Math.round((myTime - rivalTime) * 10) / 10;
      if (diffTime < 0) {
        winnerId = 'user';
        isTie = false;
        tiebreakerReason = 'time';
      } else if (diffTime > 0) {
        winnerId = currentOpponent.id;
        isTie = false;
        tiebreakerReason = 'time';
      } else {
        winnerId = 'tie';
        isTie = true;
        tiebreakerReason = 'tie';
      }
    }
  }

  const isUserWinner = winnerId === 'user';
  const xpDelta = isTie ? 0 : isUserWinner ? wagerXp : -wagerXp;

  // 4. Reconstruir los errores del usuario (para el feedback de respuestas erróneas)
  const userMistakes: Array<{
    question: MatchQuestion;
    userSelectedOption: number;
  }> = [];

  const registeredAnswers = summaryData?.answers || answersRows;
  questions.forEach((q, idx) => {
    const ansRecord = registeredAnswers.find(
      (a: any) => a.player_session_id === mySessionId && a.question_index === idx
    );

    if (ansRecord && !ansRecord.is_correct) {
      userMistakes.push({
        question: q,
        userSelectedOption: ansRecord.selected_option
      });
    } else if (!ansRecord && userLocalAnswers && userLocalAnswers[idx] && !userLocalAnswers[idx].isCorrect) {
      userMistakes.push({
        question: q,
        userSelectedOption: userLocalAnswers[idx].selectedOption
      });
    }
  });

  return {
    matchId,
    winnerId,
    isTie,
    userScore: Number(myAuthoritative.score || 0),
    rivalScore: Number(rivalAuthoritative.score || 0),
    userCorrectCount: myCorrect,
    rivalCorrectCount: rivalCorrect,
    userTimeSeconds: myTime,
    rivalTimeSeconds: rivalTime,
    betXp: wagerXp,
    xpDelta,
    rival: currentOpponent,
    date: finishedAt,
    userMistakes,
    tiebreakerReason
  };
}

