import React, { useState, useEffect, useMemo } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  Player,
  StudentProfile,
  MatchResult,
  MatchQuestion,
  IncomingChallengeData
} from '../../types/onlineChallenge';
import {
  getStudentMaxModule,
  getModuleTopicName,
  checkPlayersCompatibility,
  getMaxAllowedMatchModule
} from '../../utils/onlineProgressUtils';
import { validateStudentProfile } from '../../utils/nameModerationUtils';
import {
  getStoredStudentProfile,
  saveStudentProfile,
  getStoredPlayerStats,
  updateStatsAfterMatch,
  addMatchToHistory,
  recordRivalMatchPlayed,
  getRivalConsecutiveStatus,
  isRealtimeModeActive,
  supabaseSyncPlayerProfile,
  supabaseJoinLobbyPresence,
  supabaseListenForIncomingInvitations,
  supabaseRespondToInvitation
} from '../../services/onlineChallengesService';
import { getSimulatedPlayers } from '../../data/onlinePlayers';
import { getMatchQuestions } from '../../data/onlineQuestions';
import { StudentRegistrationModal } from './StudentRegistrationModal';
import { PlayerLobbyCard } from './PlayerLobbyCard';
import { ChallengeInviteModal } from './ChallengeInviteModal';
import { IncomingChallengeModal } from './IncomingChallengeModal';
import { MatchCountdownModal } from './MatchCountdownModal';
import { OnlineMatchView } from './OnlineMatchView';
import { MatchResultView } from './MatchResultView';
import { OnlineRankingView } from './OnlineRankingView';
import { OnlineHistoryView } from './OnlineHistoryView';
import {
  Swords,
  Brain,
  Zap,
  Trophy,
  History,
  Flame,
  Coins,
  ShieldCheck,
  School,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface OnlineChallengesPortalViewProps {
  onNavigate?: (view: any) => void;
}

export const OnlineChallengesPortalView: React.FC<OnlineChallengesPortalViewProps> = ({
  onNavigate: _onNavigate
}) => {
  const { progress, addXp, awardBadgeDirectly } = useProgress();

  // Perfil del estudiante
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    return getStoredStudentProfile();
  });
  const [regModalOpen, setRegModalOpen] = useState<boolean>(false);

  // Progreso pedagógico real del alumno calculado automáticamente desde completedModules
  const myMaxModule = useMemo(() => getStudentMaxModule(progress.completedModules), [progress.completedModules]);
  const myTopicName = useMemo(() => getModuleTopicName(myMaxModule), [myMaxModule]);

  // Perfil enriquecido con el nivel educativo actual
  const effectiveProfile: StudentProfile | null = useMemo(() => {
    if (!studentProfile) return null;
    return {
      ...studentProfile,
      maxCompletedModule: myMaxModule,
      levelTopic: myTopicName
    };
  }, [studentProfile, myMaxModule, myTopicName]);

  // Pestañas activas: 'lobby' | 'rankings' | 'history' | 'stats'
  const [activeTab, setActiveTab] = useState<'lobby' | 'rankings' | 'history' | 'stats'>('lobby');

  // Sección ¿Cómo funcionan? expandible
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);

  // Jugadores: simulados para práctica y jugadores reales en línea vía Supabase
  const [simulatedPlayers] = useState<Player[]>(() => getSimulatedPlayers());
  const [realPlayers, setRealPlayers] = useState<Player[]>([]);

  // Desafío entrante en tiempo real (Fase 2)
  const [incomingChallenge, setIncomingChallenge] = useState<IncomingChallengeData | null>(null);

  // Flujo de partida
  const [selectedOpponent, setSelectedOpponent] = useState<Player | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [countdownSession, setCountdownSession] = useState<{
    opponent: Player;
    betXp: number;
    matchId?: string;
    isRealMatch?: boolean;
    questions?: MatchQuestion[];
  } | null>(null);
  const [activeMatch, setActiveMatch] = useState<{
    opponent: Player;
    betXp: number;
    questions: MatchQuestion[];
    matchId?: string;
    isRealMatch?: boolean;
  } | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  // Estadísticas locales del alumno
  const [stats, setStats] = useState(() => getStoredPlayerStats());

  // Si no hay perfil válido registrado, abrir el modal de registro automáticamente
  useEffect(() => {
    if (!studentProfile || !validateStudentProfile(studentProfile).isValid) {
      setRegModalOpen(true);
    }
  }, [studentProfile]);

  // Subscripción a presencia e invitaciones en tiempo real (Fase 2)
  // Regla de Seguridad: Un alumno cuyo perfil no sea válido NUNCA publica presencia
  useEffect(() => {
    if (
      !effectiveProfile ||
      !validateStudentProfile(effectiveProfile).isValid ||
      !isRealtimeModeActive()
    ) {
      return;
    }

    // Sincronizar perfil inicial en la tabla online_players con nivel pedagógico
    supabaseSyncPlayerProfile(effectiveProfile, progress.xp, stats).catch(() => {});

    // Unirse a la sala con presencia en tiempo real
    const unsubPresence = supabaseJoinLobbyPresence(
      effectiveProfile,
      progress.xp,
      stats,
      onlineList => {
        setRealPlayers(onlineList);
      }
    );

    // Escuchar invitaciones que lleguen a este usuario
    const unsubInvitations = supabaseListenForIncomingInvitations(inv => {
      setIncomingChallenge(inv);
    });

    return () => {
      unsubPresence();
      unsubInvitations();
    };
  }, [effectiveProfile, progress.xp, stats]);

  const handleSaveProfile = (profile: StudentProfile) => {
    const { isValid, errors } = validateStudentProfile(profile);
    if (!isValid) {
      alert(
        errors.general ||
          errors.firstName ||
          errors.lastName ||
          errors.school ||
          'El perfil contiene datos no válidos. Por favor verificalos.'
      );
      setRegModalOpen(true);
      return;
    }
    saveStudentProfile(profile);
    setStudentProfile(profile);
    setRegModalOpen(false);
  };

  // Iniciar flujo de invitación con validación pedagógica
  const handleOpenChallenge = (player: Player) => {
    if (!studentProfile || !validateStudentProfile(studentProfile).isValid) {
      setRegModalOpen(true);
      return;
    }

    // Regla de Compatibilidad (Fair Play ±1 Módulo)
    const oppMaxModule = player.maxCompletedModule || 1;
    const compatibility = checkPlayersCompatibility(myMaxModule, oppMaxModule);
    if (!compatibility.compatible) {
      alert(`⚠️ Los niveles de aprendizaje son demasiado diferentes para este desafío.\n\n${compatibility.reason || ''}`);
      return;
    }

    setSelectedOpponent(player);
    setInviteModalOpen(true);
  };

  // Cuando el rival acepta el desafío (o aceptamos nosotros)
  const handleChallengeAccepted = (
    opponent: Player,
    betXp: number,
    matchId?: string,
    isRealMatch?: boolean
  ) => {
    setInviteModalOpen(false);

    // REGLA DE APUESTA (Sección 7):
    // Descontar la apuesta de XP inmediatamente al ser aceptado el desafío y comenzar la partida
    addXp(-betXp);

    // Preguntas limitadas estrictamente a los contenidos completados por ambos (intersección pedagógica)
    const oppMaxModule = opponent.maxCompletedModule || 1;
    const maxAllowedModule = getMaxAllowedMatchModule(myMaxModule, oppMaxModule);
    const matchQuestions = getMatchQuestions(matchId || `match_${Date.now()}`, maxAllowedModule);

    setCountdownSession({
      opponent,
      betXp,
      matchId,
      isRealMatch,
      questions: matchQuestions
    });
  };

  // Aceptar desafío entrante en tiempo real (Fase 2)
  const handleAcceptIncoming = async (inv: IncomingChallengeData) => {
    try {
      const oppModule = inv.challengerMaxModule || 1;
      const maxAllowedModule = getMaxAllowedMatchModule(myMaxModule, oppModule);
      const matchQuestions = getMatchQuestions(inv.invitationId, maxAllowedModule);

      const { matchId } = await supabaseRespondToInvitation(
        inv.invitationId,
        true,
        matchQuestions.map(q => q.id)
      );

      // Descontar la apuesta de XP inmediatamente
      addXp(-inv.wagerXp);

      const rivalPlayer: Player = {
        id: inv.challengerSessionId,
        sessionId: inv.challengerSessionId,
        firstName: inv.challengerName.split(' ')[0] || inv.challengerName,
        lastName: inv.challengerName.split(' ').slice(1).join(' ') || '',
        school: inv.challengerSchool,
        course: '',
        avatar: '🧑‍💻',
        xp: inv.wagerXp * 2,
        wins: 0,
        losses: 0,
        streak: 0,
        status: 'playing',
        isRealPlayer: true,
        maxCompletedModule: oppModule,
        levelTopic: getModuleTopicName(oppModule)
      };

      setIncomingChallenge(null);

      setCountdownSession({
        opponent: rivalPlayer,
        betXp: inv.wagerXp,
        matchId: matchId || inv.invitationId,
        isRealMatch: true,
        questions: matchQuestions
      });
    } catch (err: any) {
      console.error('Error al aceptar desafío entrante:', err);
      const msg = err?.message || 'Error desconocido al conectar con el servidor';
      alert(`No se pudo iniciar el desafío entrante: ${msg}`);
      setIncomingChallenge(null);
    }
  };

  // Rechazar desafío entrante (Fase 2)
  const handleRejectIncoming = async (inv: IncomingChallengeData) => {
    try {
      await supabaseRespondToInvitation(inv.invitationId, false);
    } catch (err) {
      console.error('Error al rechazar desafío:', err);
    }
    setIncomingChallenge(null);
  };

  // Cuando finaliza la cuenta regresiva 3, 2, 1
  const handleCountdownFinished = () => {
    if (!countdownSession) return;
    const oppModule = countdownSession.opponent.maxCompletedModule || 1;
    const maxAllowedModule = getMaxAllowedMatchModule(myMaxModule, oppModule);
    const matchQuestions =
      countdownSession.questions ||
      getMatchQuestions(countdownSession.matchId || `match_${Date.now()}`, maxAllowedModule);

    setActiveMatch({
      opponent: countdownSession.opponent,
      betXp: countdownSession.betXp,
      questions: matchQuestions,
      matchId: countdownSession.matchId,
      isRealMatch: countdownSession.isRealMatch
    });
    setCountdownSession(null);
  };

  // Cuando la partida 1v1 concluye
  const handleMatchFinished = (result: MatchResult) => {
    setActiveMatch(null);
    setMatchResult(result);

    // 1. Acreditación o resolución de XP
    if (result.winnerId === 'user') {
      // Ganador recibe el pozo completo (2 * apuesta). Como ya se le debitó la apuesta, sumamos 2 * apuesta (neto: +betXp)
      addXp(result.betXp * 2);
    } else if (result.isTie) {
      // Empate: devolución intacta de la apuesta
      addXp(result.betXp);
    }
    // Si perdió, ya se le debitó al comenzar, no se suma nada adicional

    // 2. Actualizar estadísticas y racha
    const outcome = result.winnerId === 'user' ? 'win' : result.isTie ? 'tie' : 'loss';
    const { stats: updatedStats, newBadgesToAward } = updateStatsAfterMatch(outcome, result.betXp);
    setStats(updatedStats);

    // 3. Registrar en historial
    addMatchToHistory(result);

    // 4. Registrar partida con este rival para límite de 3 consecutivas diarias
    recordRivalMatchPlayed(result.rival.id);

    // 5. Otorgar insignias si corresponde
    newBadgesToAward.forEach(bid => {
      awardBadgeDirectly(bid);
    });
  };

  // Volver a la sala
  const handleBackToLobby = () => {
    setMatchResult(null);
    setActiveMatch(null);
    setCountdownSession(null);
    setSelectedOpponent(null);
    setActiveTab('lobby');
  };

  // Revancha directa
  const handleRematch = () => {
    if (!matchResult) return;
    const rival = matchResult.rival;
    const consecutiveStatus = getRivalConsecutiveStatus(rival.id);

    if (consecutiveStatus.isBlockedToday) {
      alert('⏳ Ya tuvieron 3 enfrentamientos consecutivos hoy. Podrán volver a desafiarse a partir del día siguiente.');
      return;
    }

    setMatchResult(null);
    setSelectedOpponent(rival);
    setInviteModalOpen(true);
  };

  // ==========================================
  // VISTAS DE PANTALLA COMPLETA (COUNTDOWN / PARTIDA / RESULTADOS)
  // ==========================================

  if (countdownSession && (effectiveProfile || studentProfile)) {
    return (
      <MatchCountdownModal
        challenger={(effectiveProfile || studentProfile)!}
        opponent={countdownSession.opponent}
        betXp={countdownSession.betXp}
        onCountdownFinished={handleCountdownFinished}
      />
    );
  }

  if (activeMatch && (effectiveProfile || studentProfile)) {
    return (
      <OnlineMatchView
        challenger={(effectiveProfile || studentProfile)!}
        opponent={activeMatch.opponent}
        betXp={activeMatch.betXp}
        questions={activeMatch.questions}
        matchId={activeMatch.matchId}
        isRealMatch={activeMatch.isRealMatch}
        onMatchFinished={handleMatchFinished}
      />
    );
  }

  if (matchResult && (effectiveProfile || studentProfile)) {
    const consecutiveStatus = getRivalConsecutiveStatus(matchResult.rival.id);
    return (
      <MatchResultView
        result={matchResult}
        userProfile={(effectiveProfile || studentProfile)!}
        currentStreak={stats.currentStreak}
        onRematch={handleRematch}
        canRematch={!consecutiveStatus.isBlockedToday && progress.xp >= 10}
        onBackToLobby={handleBackToLobby}
        onGoToRanking={() => {
          setMatchResult(null);
          setActiveTab('rankings');
        }}
      />
    );
  }

  // ==========================================
  // VISTA PRINCIPAL DEL PORTAL
  // ==========================================

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      
      {/* Hero Banner Competitivo & Gamificado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-500 text-white shadow-xl shadow-rose-600/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-rose-100">
              <Swords className="w-3.5 h-3.5 text-amber-300" />
              <span>{isRealtimeModeActive() ? 'Duelos 1v1 en Vivo · Fase 2 Realtime' : 'Duelos 1v1 en Vivo · Modo Práctica'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>⚔️ Desafíos en línea</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              Enfrentate a otros estudiantes y poné a prueba tus conocimientos de Python en tiempo real.
            </p>

            {/* 3 Conceptos Clave */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-black">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/20">
                <Brain className="w-4 h-4 text-pink-300" />
                <span>🧠 Pensá</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/20">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>⚡ Respondé</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/20">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>🏆 Ganale a tu rival</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Identificación del Alumno */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 min-w-[240px] flex flex-col justify-between self-start md:self-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black text-base shadow-sm">
                {studentProfile ? studentProfile.firstName.charAt(0).toUpperCase() : '🐍'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-white truncate">
                  👋 {studentProfile ? `Hola, ${studentProfile.firstName} ${studentProfile.lastName}` : 'Sin registrar'}
                </p>
                <p className="text-xs text-rose-100 flex items-center gap-1 truncate">
                  <School className="w-3 h-3 flex-shrink-0" />
                  <span>{studentProfile?.school || 'Ingresá tus datos'}</span>
                </p>
                <p className="text-[11px] text-amber-200 font-bold flex items-center gap-1 truncate mt-0.5">
                  <Brain className="w-3 h-3 flex-shrink-0" />
                  <span>Nivel: {myTopicName} (Mód. {myMaxModule})</span>
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-amber-200 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-yellow-300" />
                {progress.xp} XP
              </span>
              <button
                onClick={() => setRegModalOpen(true)}
                className="text-white hover:underline text-[11px] font-semibold"
              >
                Editar perfil →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Desplegable: ¿Cómo funcionan? (Reglas) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setRulesOpen(prev => !prev)}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                ¿Cómo funcionan los desafíos?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conocé las 10 reglas oficiales sobre apuestas de XP, preguntas y desempates.
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl text-slate-400">
            {rulesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {rulesOpen && (
          <div className="px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 animate-fadeIn">
            <ol className="list-decimal list-inside space-y-1.5 font-medium leading-relaxed">
              <li><strong>Elegí un alumno disponible</strong> en la sala para desafiar.</li>
              <li><strong>Elegí cuánto XP querés apostar</strong> (10, 25, 50 o 100 XP).</li>
              <li><strong>Enviá el desafío</strong> al contrincante.</li>
              <li>Tu rival puede <strong>aceptar o rechazar</strong> la invitación.</li>
              <li>Si acepta, ambos reciben <strong>exactamente las mismas preguntas y en el mismo orden</strong>.</li>
              <li><strong>10 preguntas adaptadas al progreso:</strong> el duelo seleccionará preguntas únicamente sobre los contenidos que <strong>ambos jugadores</strong> ya hayan completado (mínimo de ambos niveles).</li>
              <li><strong>Primero importa responder correctamente:</strong> acertar más preguntas siempre vence a la velocidad.</li>
              <li>El tiempo se utilizará para obtener un <strong>bonus de velocidad</strong> (hasta +50 pts) o para resolver empates.</li>
              <li>El jugador con mayor puntuación gana la partida.</li>
              <li><strong>El ganador recibe el XP apostado por ambos jugadores</strong> (el pozo total). En caso de empate técnico, el XP se reintegra a ambos.</li>
            </ol>

            <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Regla de deportividad:</strong> Podrán enfrentarse como máximo <strong>3 veces consecutivas</strong> con el mismo contrincante por día para fomentar la variedad.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pestañas de Navegación de la Sección */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'lobby'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>🟢 Sala de Jugadores</span>
        </button>

        <button
          onClick={() => setActiveTab('rankings')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'rankings'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>🏆 Ranking de Desafíos</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>📜 Mis desafíos</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 px-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'stats'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>📊 Mis estadísticas</span>
        </button>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'lobby' && (() => {
        const allLobbyPlayers: Player[] = isRealtimeModeActive()
          ? realPlayers
          : simulatedPlayers;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🟢 Jugadores disponibles</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Seleccioná a un contrincante disponible para enviar una invitación con apuesta de XP.
                </p>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                {allLobbyPlayers.filter(p => p.status === 'available').length} disponibles ahora
              </div>
            </div>

            {/* Banner de Estado Realtime */}
            {isRealtimeModeActive() && (
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 text-xs text-sky-800 dark:text-sky-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <span>
                    {realPlayers.length > 0
                      ? `🟢 ¡Hay ${realPlayers.length} estudiante(s) en vivo conectado(s) ahora! Podés desafiarlos directamente.`
                      : '🌐 Conectado a la sala en vivo de Supabase Realtime. Esperando a que otros alumnos se conecten.'}
                  </span>
                </div>
                <span className="text-[11px] font-black text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2.5 py-1 rounded-xl self-start sm:self-auto whitespace-nowrap">
                  Multiplayer Realtime
                </span>
              </div>
            )}

            {/* Grid de Jugadores o Estado Vacío */}
            {allLobbyPlayers.length === 0 ? (
              <div className="py-14 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-4xl shadow-inner">
                  💤
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
                    No hay otros alumnos disponibles en este momento.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Cuando otro estudiante ingrese a la sala desde otro dispositivo o ventana de navegación, aparecerá aquí automáticamente en tiempo real.
                  </p>
                </div>
                <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Tu estado es "Disponible" · Esperando contrincantes</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allLobbyPlayers.map(player => {
                  const consecutiveStatus = getRivalConsecutiveStatus(player.id);
                  return (
                    <PlayerLobbyCard
                      key={player.id}
                      player={player}
                      consecutiveStatus={consecutiveStatus}
                      onChallenge={handleOpenChallenge}
                      userAvailableXp={progress.xp}
                      userMaxModule={myMaxModule}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {activeTab === 'rankings' && (
        <OnlineRankingView />
      )}

      {activeTab === 'history' && (
        <OnlineHistoryView />
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Mis estadísticas de duelos</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rendimiento acumulado en partidas en línea.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase">Victorias</span>
              <p className="text-2xl font-black text-amber-500 mt-1">{stats.wins}</p>
              <span className="text-[10px] text-slate-400">Partidas ganadas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase">Derrotas</span>
              <p className="text-2xl font-black text-rose-500 mt-1">{stats.losses}</p>
              <span className="text-[10px] text-slate-400">Partidas perdidas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase">Empates</span>
              <p className="text-2xl font-black text-slate-500 mt-1">{stats.ties}</p>
              <span className="text-[10px] text-slate-400">Partidas empatadas</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold block uppercase">Partidas</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.matchesPlayed}</p>
              <span className="text-[10px] text-slate-400">Disputadas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Racha actual</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">
                    {stats.currentStreak} victorias seguidas
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Mejor: {stats.bestStreak}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">XP Ganado en duelos</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    +{stats.totalXpWon} XP
                  </p>
                </div>
              </div>
              <span className="text-xs text-rose-500 font-medium">-{stats.totalXpLost} XP</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registro de Alumno */}
      <StudentRegistrationModal
        isOpen={regModalOpen}
        initialProfile={
          (studentProfile && validateStudentProfile(studentProfile).isValid ? studentProfile : null) ||
          (progress.userName
            ? {
                firstName: progress.userName.split(' ')[0] || '',
                lastName: progress.userName.split(' ').slice(1).join(' ') || '',
                school: ''
              }
            : null)
        }
        onSave={handleSaveProfile}
        onClose={() => {
          if (studentProfile && validateStudentProfile(studentProfile).isValid) {
            setRegModalOpen(false);
          }
        }}
        canClose={Boolean(studentProfile && validateStudentProfile(studentProfile).isValid)}
      />

      {/* Modal de Invitación y Selección de Apuesta */}
      <ChallengeInviteModal
        player={selectedOpponent}
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        userXp={progress.xp}
        onChallengeAccepted={handleChallengeAccepted}
        challengerProfile={effectiveProfile}
        userMaxModule={myMaxModule}
      />

      {/* Modal de Desafío Entrante (Fase 2 Realtime) */}
      <IncomingChallengeModal
        challenge={incomingChallenge}
        onAccept={handleAcceptIncoming}
        onReject={handleRejectIncoming}
        userAvailableXp={progress.xp}
        userMaxModule={myMaxModule}
      />

    </div>
  );
};
