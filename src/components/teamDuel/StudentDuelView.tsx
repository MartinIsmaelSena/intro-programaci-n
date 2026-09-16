import React, { useState, useEffect } from 'react';
import {
  fetchDuelMatchByPin,
  fetchDuelMatch,
  fetchDuelTeams,
  joinDuelTeam,
  saveTeamSession,
  getTeamSession,
  clearTeamSession,
  subscribeToDuelMatch,
  subscribeToDuelTeams,
  submitDuelAnswer,
  getDuelLiveProgress
} from '../../services/teamDuelService';
import { DuelMatch, DuelTeam, LocalTeamSession } from '../../types/teamDuel';
import { getPublicQuestionById } from '../../data/onlineQuestionsPublic';
import { PublicMatchQuestion } from '../../types/onlineChallenge';
import { validateTeamName } from '../../utils/teamNameModeration';
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tv,
  Sparkles,
  LogOut,
  HelpCircle,
  Check,
  Award
} from 'lucide-react';

const AVAILABLE_AVATARS = ['🐍', '🐱', '🦊', '🐼', '🦁', '🤖', '🚀', '⚡', '💻', '🛠️'];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const OPTION_LETTER_STYLES = [
  'bg-rose-500 text-white border-rose-600',
  'bg-blue-500 text-white border-blue-600',
  'bg-amber-500 text-slate-950 border-amber-600',
  'bg-emerald-500 text-white border-emerald-600'
];

interface StudentDuelViewProps {
  onNavigate?: (view: any) => void;
}

type StudentFlowStep = 'loading' | 'pin' | 'team_form' | 'lobby';

export const StudentDuelView: React.FC<StudentDuelViewProps> = () => {
  const [step, setStep] = useState<StudentFlowStep>('loading');

  // Estado del paso PIN
  const [pin, setPin] = useState<string>('');
  const [validatingPin, setValidatingPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [matchedDuel, setMatchedDuel] = useState<DuelMatch | null>(null);

  // Estado del paso Creación de Equipo
  const [teamName, setTeamName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🐍');
  const [joining, setJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Estado de la Sesión y Partida Activa
  const [currentSession, setCurrentSession] = useState<LocalTeamSession | null>(null);
  const [activeMatch, setActiveMatch] = useState<DuelMatch | null>(null);
  const [teams, setTeams] = useState<DuelTeam[]>([]);

  // Estado de Respuesta en la Ronda Actual
  const [answeredRound, setAnsweredRound] = useState<number | null>(null);
  const [selectedOptionThisRound, setSelectedOptionThisRound] = useState<number | null>(null);
  const [hasAnsweredThisRound, setHasAnsweredThisRound] = useState<boolean>(false);
  const [submittingAnswer, setSubmittingAnswer] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<string | null>(null);

  // Temporizador Visual de Ronda Activa (autoridad final siempre en PostgreSQL)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);

  // 1. Recuperación de sesión persistida al montar (sessionStorage)
  useEffect(() => {
    let mounted = true;

    async function recoverSession() {
      const session = getTeamSession();
      if (!session || !session.match_id || !session.team_id || !session.session_token) {
        if (mounted) setStep('pin');
        return;
      }

      try {
        const match = await fetchDuelMatch(session.match_id);
        if (!mounted) return;

        // Comprueba que la partida siga existiendo y no haya sido cancelada
        if (!match || (match.status as string) === 'cancelled') {
          clearTeamSession();
          setStep('pin');
          return;
        }

        // Comprueba que la sesión recuperada corresponda a un equipo registrado en esta partida
        const matchTeams = await fetchDuelTeams(session.match_id);
        if (!mounted) return;

        const registeredTeam = matchTeams.find(t => t.id === session.team_id);
        if (!registeredTeam) {
          clearTeamSession();
          setStep('pin');
          return;
        }

        // Sesión plenamente validada
        const validatedSession: LocalTeamSession = {
          ...session,
          team_name: registeredTeam.team_name,
          avatar: registeredTeam.avatar
        };

        setCurrentSession(validatedSession);
        setActiveMatch(match);
        setTeams(matchTeams);

        // Si la partida está activa, comprobar si este equipo ya envió respuesta
        if (match.status === 'question_active') {
          try {
            const liveProgress = await getDuelLiveProgress(match.id);
            const myProgress = liveProgress.find(p => p.team_id === registeredTeam.id);
            if (myProgress?.has_answered) {
              setHasAnsweredThisRound(true);
              setAnsweredRound(match.current_round);
            }
          } catch {
            // No bloquea la recuperación de sesión
          }
        }

        setStep('lobby');
      } catch {
        if (mounted) {
          clearTeamSession();
          setStep('pin');
        }
      }
    }

    recoverSession();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Suscripción Realtime a la partida y a los equipos de la sala
  useEffect(() => {
    if (!activeMatch?.id || step !== 'lobby') return;

    // Obtener lista inicial de equipos si no está cargada
    fetchDuelTeams(activeMatch.id).then(matchTeams => {
      setTeams(matchTeams);
    });

    const unsubscribeMatch = subscribeToDuelMatch(activeMatch.id, updatedMatch => {
      setActiveMatch(updatedMatch);
    });

    const unsubscribeTeams = subscribeToDuelTeams(activeMatch.id, updatedTeams => {
      setTeams(updatedTeams);
    });

    return () => {
      unsubscribeMatch();
      unsubscribeTeams();
    };
  }, [activeMatch?.id, step]);

  // 2.5. Detección en tiempo real si el equipo del alumno fue retirado/sacado o eliminado por el docente
  useEffect(() => {
    if (currentSession?.team_id && (step === 'lobby' || step === 'loading') && teams.length > 0) {
      const myTeam = teams.find(t => t.id === currentSession.team_id);
      if (!myTeam || myTeam.status === 'removed') {
        clearTeamSession();
        setCurrentSession(null);
        setStep('team_form');
        setJoinError('Tu equipo fue retirado de la partida por el docente.');
      }
    }
  }, [teams, currentSession?.team_id, step]);

  // 3. Reinicio automático del estado de respuesta al cambiar de ronda
  useEffect(() => {
    if (!activeMatch?.current_round) return;

    if (activeMatch.current_round !== answeredRound) {
      setHasAnsweredThisRound(false);
      setSelectedOptionThisRound(null);
      setAnswerError(null);
      setSubmittingAnswer(false);
    }
  }, [activeMatch?.current_round, answeredRound]);

  // 4. Verificación de respuesta ya enviada al entrar en question_active
  useEffect(() => {
    if (!activeMatch?.id || !currentSession?.team_id || activeMatch.status !== 'question_active') {
      return;
    }

    let mounted = true;
    getDuelLiveProgress(activeMatch.id).then(progress => {
      if (!mounted) return;
      const myProgress = progress.find(p => p.team_id === currentSession.team_id);
      if (myProgress?.has_answered) {
        setHasAnsweredThisRound(true);
        setAnsweredRound(activeMatch.current_round);
      }
    });

    return () => {
      mounted = false;
    };
  }, [activeMatch?.id, activeMatch?.status, activeMatch?.current_round, currentSession?.team_id]);

  // 5. Contador visual de la ronda (30 segundos según round_ends_at del servidor)
  useEffect(() => {
    if (activeMatch?.status !== 'question_active') {
      setRemainingSeconds(30);
      return;
    }

    const updateTimer = () => {
      if (!activeMatch.round_ends_at) {
        setRemainingSeconds(30);
        return;
      }
      const endsAt = new Date(activeMatch.round_ends_at).getTime();
      const now = Date.now();
      const diff = Math.ceil((endsAt - now) / 1000);
      setRemainingSeconds(Math.max(0, Math.min(30, diff)));
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 500);

    return () => {
      clearInterval(timerId);
    };
  }, [activeMatch?.status, activeMatch?.round_ends_at]);

  // Pregunta pública activa obtenida únicamente mediante el banco público saneado
  const currentQuestion: PublicMatchQuestion | null = activeMatch?.current_question_id
    ? getPublicQuestionById(activeMatch.current_question_id) || null
    : null;

  // Datos del equipo actual desde duel_teams
  const myTeam = currentSession?.team_id
    ? teams.find(t => t.id === currentSession.team_id) || null
    : null;

  // Manejador del cambio de PIN (filtra no dígitos y limita a 6)
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(clean);
    if (pinError) setPinError(null);
  };

  // Validación y búsqueda de partida por PIN
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (cleanPin.length !== 6) {
      setPinError('El PIN debe tener exactamente 6 números.');
      return;
    }

    setValidatingPin(true);
    setPinError(null);

    try {
      const match = await fetchDuelMatchByPin(cleanPin);

      if (!match) {
        setPinError('No encontramos una partida con ese PIN.');
        setValidatingPin(false);
        return;
      }

      if (match.status !== 'lobby') {
        const statusMsg =
          match.status === 'finished'
            ? 'Esta partida ya ha finalizado.'
            : 'Esta partida ya comenzó y no admite nuevos equipos.';
        setPinError(statusMsg);
        setValidatingPin(false);
        return;
      }

      setMatchedDuel(match);
      setStep('team_form');
    } catch (err: any) {
      setPinError(err.message || 'Error de conexión al verificar el PIN.');
    } finally {
      setValidatingPin(false);
    }
  };

  // Creación y registro de equipo mediante la RPC join_duel_team
  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedDuel) return;

    const cleanName = teamName.trim();
    if (!cleanName) {
      setJoinError('Por favor ingresá el nombre de tu equipo.');
      return;
    }

    const validation = validateTeamName(cleanName);
    if (!validation.isValid) {
      setJoinError(validation.error || 'Nombre de equipo no permitido.');
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      const res = await joinDuelTeam(matchedDuel.id, cleanName, selectedAvatar);

      if (!res.success) {
        setJoinError(res.error || 'No fue posible registrar el equipo.');
        setJoining(false);
        return;
      }

      // Guardar sesión en sessionStorage de forma segura
      const newSession: LocalTeamSession = {
        match_id: matchedDuel.id,
        team_id: res.team_id,
        session_token: res.session_token,
        team_name: res.team_name,
        avatar: res.avatar
      };
      saveTeamSession(newSession);

      setCurrentSession(newSession);
      setActiveMatch(matchedDuel);
      setStep('lobby');
    } catch (err: any) {
      setJoinError(err.message || 'Error de red al unirse a la partida.');
    } finally {
      setJoining(false);
    }
  };

  // Envío de respuesta a través de submitDuelAnswer (RPC segura en Supabase)
  const handleSelectOption = async (optionIndex: number) => {
    if (submittingAnswer || hasAnsweredThisRound) return;
    if (!activeMatch || activeMatch.status !== 'question_active') return;

    if (remainingSeconds <= 0) {
      setAnswerError('El tiempo para responder esta ronda ha finalizado.');
      return;
    }

    if (!currentSession?.team_id || !currentSession?.session_token) {
      setAnswerError('Sesión de equipo no válida. Por favor recargá la página.');
      return;
    }

    setSubmittingAnswer(true);
    setAnswerError(null);
    setSelectedOptionThisRound(optionIndex);

    try {
      const res = await submitDuelAnswer(
        activeMatch.id,
        currentSession.team_id,
        currentSession.session_token,
        activeMatch.current_round,
        optionIndex
      );

      if (!res.success) {
        const errorMsg = res.error || 'No fue posible registrar tu respuesta.';
        const lowerErr = errorMsg.toLowerCase();

        if (lowerErr.includes('ya respondió') || lowerErr.includes('already')) {
          setHasAnsweredThisRound(true);
          setAnsweredRound(activeMatch.current_round);
        } else if (
          lowerErr.includes('tiempo') ||
          lowerErr.includes('cerrada') ||
          lowerErr.includes('activa')
        ) {
          setAnswerError('El tiempo de la ronda ha finalizado en el servidor.');
        } else {
          setAnswerError(errorMsg);
          setSelectedOptionThisRound(null);
        }
      } else {
        setHasAnsweredThisRound(true);
        setAnsweredRound(activeMatch.current_round);
      }
    } catch (err: any) {
      setAnswerError(err.message || 'Error de conexión al enviar tu respuesta.');
      setSelectedOptionThisRound(null);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Abandonar / Salir de la partida
  const handleLeaveMatch = () => {
    clearTeamSession();
    setCurrentSession(null);
    setActiveMatch(null);
    setMatchedDuel(null);
    setTeams([]);
    setPin('');
    setTeamName('');
    setPinError(null);
    setJoinError(null);
    setAnswerError(null);
    setHasAnsweredThisRound(false);
    setSelectedOptionThisRound(null);
    setStep('pin');
  };

  // ============================================================================
  // PANTALLA 0: CARGANDO SESIÓN
  // ============================================================================
  if (step === 'loading') {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3 animate-fadeIn">
        <Loader2 className="w-8 h-8 animate-spin text-python-blue dark:text-sky-400" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Comprobando sesión del equipo...
        </p>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 1: INGRESO POR PIN
  // ============================================================================
  if (step === 'pin') {
    return (
      <div className="space-y-6 max-w-xl mx-auto animate-fadeIn pb-12">
        {/* Banner Alumno */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-python-blue via-indigo-700 to-sky-600 text-white shadow-xl shadow-python-blue/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-sky-200 mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Competencia Presencial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            🏆 Duelo de Equipos
          </h1>

          <p className="text-sky-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Ingresá el PIN que aparece en la pantalla del aula para unirte a la partida con tu grupo.
          </p>
        </div>

        {/* Tarjeta de Entrada de PIN */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleVerifyPin} className="space-y-5">
            <div className="space-y-2 text-center">
              <label htmlFor="duel-pin" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                PIN de la Partida (6 dígitos)
              </label>

              <div className="relative max-w-xs mx-auto">
                <input
                  id="duel-pin"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="000000"
                  disabled={validatingPin}
                  className="w-full text-center text-3xl sm:text-4xl font-mono font-black tracking-[0.35em] py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-python-blue dark:focus:border-sky-500 transition-all disabled:opacity-50"
                  autoFocus
                />
              </div>

              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Solamente números sin espacios
              </span>
            </div>

            {/* Error Message */}
            {pinError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2 text-center animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Botón Continuar */}
            <button
              type="submit"
              disabled={validatingPin || pin.length !== 6}
              className="w-full py-3.5 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md shadow-python-blue/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {validatingPin ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando PIN...</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Ayuda de mesa */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-[11px] text-sky-800 dark:text-sky-300 flex items-start gap-2.5 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-python-blue flex-shrink-0 mt-0.5" />
            <div>
              <strong>Consejo de equipo:</strong> Solo <strong>un alumno por grupo</strong> debe ingresar a la plataforma para registrar las respuestas en representación del equipo.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 2: FORMULARIO DE CREACIÓN DE EQUIPO
  // ============================================================================
  if (step === 'team_form') {
    return (
      <div className="space-y-6 max-w-xl mx-auto animate-fadeIn pb-12">
        {/* Encabezado con PIN validado */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setStep('pin');
              setJoinError(null);
            }}
            disabled={joining}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cambiar PIN</span>
          </button>

          <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            PIN: {matchedDuel?.pin}
          </span>
        </div>

        {/* Tarjeta de Formulario de Equipo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Crear tu equipo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Elegí el nombre que identificará a tu grupo en el proyector del aula.
            </p>
          </div>

          <form onSubmit={handleJoinTeam} className="space-y-6">
            {/* Selección de Avatar */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avatar del equipo
              </label>

              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {AVAILABLE_AVATARS.map(avatar => {
                  const isSelected = selectedAvatar === avatar;
                  return (
                    <button
                      key={avatar}
                      type="button"
                      disabled={joining}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`h-12 sm:h-14 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-500 scale-105 shadow-md shadow-amber-500/10'
                          : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{avatar}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nombre del Equipo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="team-name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nombre del equipo
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {teamName.length}/24
                </span>
              </div>

              <input
                id="team-name"
                type="text"
                maxLength={24}
                value={teamName}
                onChange={e => {
                  setTeamName(e.target.value);
                  if (joinError) setJoinError(null);
                }}
                placeholder="Ej: Equipo Python 🐍"
                disabled={joining}
                className="w-full text-base font-semibold py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-python-blue dark:focus:border-sky-500 transition-all disabled:opacity-50"
                autoFocus
              />
            </div>

            {/* Error Message */}
            {joinError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{joinError}</span>
              </div>
            )}

            {/* Botón Unirse */}
            <button
              type="submit"
              disabled={joining || !teamName.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {joining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando equipo...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Unirse a la Partida</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 3: LOBBY Y SALA DE ESPERA DEL ALUMNO
  // ============================================================================
  const matchStatus = activeMatch?.status || 'lobby';
  const currentRound = activeMatch?.current_round || 1;
  const totalRounds = activeMatch?.total_rounds || 10;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn pb-16">
      {/* Header del Equipo Conectado */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-amber-500/10 text-2xl sm:text-3xl flex items-center justify-center flex-shrink-0 shadow-inner">
            {currentSession?.avatar || '🐍'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Conectado
              </span>
              <span className="text-xs font-mono text-slate-400">
                PIN: {activeMatch?.pin}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {currentSession?.team_name || 'Mi Equipo'}
            </h1>
          </div>
        </div>

        {/* Puntos acumulados en vivo & Botón Salir */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-right">
            <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
              Puntaje
            </div>
            <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-300 leading-none">
              {myTeam?.total_score ?? 0} pts
            </div>
          </div>

          {(matchStatus === 'lobby' || matchStatus === 'finished') && (
            <button
              onClick={handleLeaveMatch}
              title="Salir de la partida"
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================
          SUB-PANTALLA: LOBBY (SALA DE ESPERA INICIAL)
          ======================================================================== */}
      {matchStatus === 'lobby' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <span>🟡 Sala de Espera</span>
            </span>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              🎉 ¡Equipo registrado!
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Esperando que el docente inicie el duelo...
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed pt-1">
              Tu grupo ya aparece en el proyector del aula. Cuando todos los equipos estén listos, comenzará la ronda 1.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================
          SUB-PANTALLA: QUESTION_PREVIEW (VISTA PREVIA - OPCIONES BLOQUEADAS)
          ======================================================================== */}
      {matchStatus === 'question_preview' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Banner de Aviso de Vista Previa */}
          <div className="p-4 sm:p-5 rounded-3xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-300 flex items-center justify-center flex-shrink-0">
                <Tv className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
                  Ronda {currentRound} de {totalRounds} — Vista Previa
                </span>
                <span className="text-xs text-sky-900 dark:text-sky-200 font-medium">
                  Leé la consigna con tu equipo. Las opciones se habilitarán cuando el docente inicie la ronda.
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-sky-200 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200 text-[11px] font-bold uppercase whitespace-nowrap">
              Debate en mesa
            </span>
          </div>

          {/* Tarjeta de la Pregunta */}
          {currentQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {currentQuestion.topic} • {currentQuestion.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentQuestion.difficulty === 'easy'
                    ? 'Fácil'
                    : currentQuestion.difficulty === 'medium'
                    ? 'Media'
                    : 'Difícil'}
                </span>
              </div>

              {/* Enunciado */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Snippet de Código */}
              {currentQuestion.codeSnippet && (
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre leading-relaxed">{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Opciones Bloqueadas durante la vista previa */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  <span>Opciones de respuesta</span>
                  <span>🔒 Bloqueadas temporalmente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 opacity-60 cursor-not-allowed select-none"
                    >
                      <span
                        className={`w-7 h-7 rounded-xl font-mono font-bold flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${OPTION_LETTER_STYLES[idx % 4]}`}
                      >
                        {OPTION_LETTERS[idx]}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 pt-0.5">
                        {opt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs text-center space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto" />
              <p className="font-bold">
                Cargando la consigna de la ronda {currentRound}...
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
                Mirá la pantalla del aula mientras se sincroniza el enunciado.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================
          SUB-PANTALLA: QUESTION_ACTIVE (RONDA EN CURSO - BOTONERA HABILITADA)
          ======================================================================== */}
      {matchStatus === 'question_active' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Barra de Tiempo Visual y Estado de Ronda */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                  Ronda {currentRound} / {totalRounds}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>¡Ronda en curso!</span>
                </span>
              </div>

              {/* Temporizador Visual */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl font-mono text-sm font-black transition-colors ${
                  remainingSeconds <= 5
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-400 animate-pulse'
                    : remainingSeconds <= 10
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{remainingSeconds}s</span>
              </div>
            </div>

            {/* Barra de progreso de tiempo visual */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remainingSeconds <= 5
                    ? 'bg-rose-500'
                    : remainingSeconds <= 10
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${(remainingSeconds / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Tarjeta de la Pregunta y Opciones de Respuesta */}
          {currentQuestion ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {currentQuestion.topic}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {hasAnsweredThisRound
                    ? '✅ Respuesta enviada'
                    : remainingSeconds <= 0
                    ? '⏰ Tiempo agotado'
                    : 'Debatan y elijan una opción'}
                </span>
              </div>

              {/* Enunciado */}
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Snippet de Código */}
              {currentQuestion.codeSnippet && (
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800 overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre leading-relaxed">{currentQuestion.codeSnippet}</pre>
                </div>
              )}

              {/* Botonera de Opciones Táctiles */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQuestion.options.map((opt: string, idx: number) => {
                    const isSelected = selectedOptionThisRound === idx;
                    const isDisabled =
                      submittingAnswer || hasAnsweredThisRound || remainingSeconds <= 0;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={isDisabled}
                        className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all relative ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/50 border-python-blue dark:border-sky-400 shadow-md shadow-sky-500/10 scale-[1.01]'
                            : hasAnsweredThisRound
                            ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-40 cursor-not-allowed'
                            : isDisabled
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                            : 'bg-slate-50 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-python-blue dark:hover:border-sky-500 hover:shadow-md cursor-pointer active:scale-98'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-mono font-black flex items-center justify-center flex-shrink-0 text-xs sm:text-sm shadow-sm ${OPTION_LETTER_STYLES[idx % 4]}`}
                        >
                          {OPTION_LETTERS[idx]}
                        </span>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 block leading-snug">
                            {opt}
                          </span>

                          {isSelected && hasAnsweredThisRound && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-python-blue dark:text-sky-400 mt-2">
                              <Check className="w-3.5 h-3.5" />
                              <span>Opción registrada</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Banners de Estado y Confirmación Segura */}
              {hasAnsweredThisRound && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2.5 text-center shadow-sm animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">
                    Respuesta enviada. Esperando la resolución de la ronda por parte del docente.
                  </span>
                </div>
              )}

              {submittingAnswer && (
                <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-300 flex items-center justify-center gap-2 text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando respuesta en la partida...</span>
                </div>
              )}

              {answerError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center gap-2 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{answerError}</span>
                </div>
              )}

              {remainingSeconds <= 0 && !hasAnsweredThisRound && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2 text-xs font-semibold text-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Tiempo finalizado. Esperando que el docente resuelva la ronda.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs text-center space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto" />
              <p className="font-bold">
                Cargando la consigna activa...
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
                Mirá la pantalla del aula para leer la consigna.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================
          SUB-PANTALLA: ROUND_REVIEW (REVISIÓN DE RONDA - ESPERANDO SIGUIENTE)
          ======================================================================== */}
      {matchStatus === 'round_review' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold">
                <span>Ronda {currentRound} Finalizada</span>
              </span>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                La ronda terminó
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                El docente está mostrando la solución y los puntos oficiales en la pantalla del aula.
              </p>
            </div>

            {/* Resumen Seguro de Participación del Equipo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 max-w-md mx-auto text-left space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Estado del equipo en esta ronda
              </div>

              {selectedOptionThisRound !== null ? (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Opción elegida por tu equipo:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    Opción {OPTION_LETTERS[selectedOptionThisRound]}
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Tu equipo no llegó a registrar una respuesta en esta ronda.
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 dark:text-slate-400">Puntaje acumulado:</span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-base">
                  {myTeam?.total_score ?? 0} pts
                </span>
              </div>
            </div>

            {/* Mensaje de espera para la siguiente ronda */}
            <div className="pt-2 text-xs text-slate-400 dark:text-slate-500">
              Esperando que el docente avance a la próxima ronda...
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          SUB-PANTALLA: FINISHED (PARTIDA FINALIZADA)
          ======================================================================== */}
      {matchStatus === 'finished' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-3xl flex items-center justify-center mx-auto shadow-inner">
              🏆
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <span>Duelo Completado</span>
              </span>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                ¡Duelo de Equipos Finalizado!
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                ¡Gran trabajo en equipo! Mirá el podio final y las menciones de honor en la pantalla gigante del aula.
              </p>
            </div>

            {/* Tarjeta de Resumen Final del Equipo */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 max-w-md mx-auto space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentSession?.avatar || '🐍'}</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                      Equipo
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {currentSession?.team_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                    Puntos Finales
                  </span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-300">
                    {myTeam?.total_score ?? 0}
                  </span>
                </div>
              </div>

              {myTeam?.rounds_won !== undefined && myTeam.rounds_won > 0 && (
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rondas ganadas (1.º puesto):</span>
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {myTeam.rounds_won}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleLeaveMatch}
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
              >
                Volver a la Pantalla de PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
