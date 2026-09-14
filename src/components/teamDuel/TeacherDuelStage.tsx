import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  createDuelMatch,
  startDuelMatch,
  startDuelRound,
  resolveDuelRound,
  advanceDuelRound,
  fetchDuelMatch,
  fetchDuelTeams,
  fetchDuelSettings,
  subscribeToDuelMatch,
  subscribeToDuelTeams,
  fetchDuelUsedQuestions
} from '../../services/teamDuelService';
import { DuelMatch, DuelTeam, DuelRoundQuestion, TeacherRoundSolution } from '../../types/teamDuel';
import { ONLINE_QUESTIONS_PUBLIC_BANK, getPublicQuestionById } from '../../data/onlineQuestionsPublic';
import { PublicMatchQuestion } from '../../types/onlineChallenge';
import {
  Users,
  Tv,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Code2,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Loader2,
  Lock,
  Volume2
} from 'lucide-react';

interface TeacherDuelStageProps {
  onNavigate?: (view: any) => void;
}

export const TeacherDuelStage: React.FC<TeacherDuelStageProps> = ({ onNavigate }) => {
  // Partida y equipos en curso
  const [match, setMatch] = useState<DuelMatch | null>(null);
  const [teams, setTeams] = useState<DuelTeam[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [creatingMatch, setCreatingMatch] = useState<boolean>(false);
  const [processingAction, setProcessingAction] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Selector de preguntas
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [filterModule, setFilterModule] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [usedQuestions, setUsedQuestions] = useState<DuelRoundQuestion[]>([]);

  // Solución y explicación pedagógica oficial para el docente (solo disponible en round_review)
  const [roundSolution, setRoundSolution] = useState<TeacherRoundSolution | null>(null);

  // Mapa de preguntas utilizadas en esta partida -> número de ronda
  const usedQuestionsMap = useMemo(() => {
    const map = new Map<string, number>();
    usedQuestions.forEach(uq => {
      map.set(uq.question_id, uq.round_number);
    });
    return map;
  }, [usedQuestions]);

  // Temporizador visual de 30 segundos (solo orientativo para la proyección)
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const timerRef = useRef<any>(null);

  // 1. Restaurar partida activa si existe en duel_settings
  useEffect(() => {
    let mounted = true;

    async function checkActiveMatch() {
      setLoadingInitial(true);
      try {
        const settings = await fetchDuelSettings();
        if (settings?.active_match_id && mounted) {
          const existingMatch = await fetchDuelMatch(settings.active_match_id);
          if (existingMatch && existingMatch.status !== 'finished') {
            setMatch(existingMatch);
            const existingTeams = await fetchDuelTeams(existingMatch.id);
            setTeams(existingTeams);
            const pastQuestions = await fetchDuelUsedQuestions(existingMatch.id);
            setUsedQuestions(pastQuestions);
            if (existingMatch.current_question_id) {
              setSelectedQuestionId(existingMatch.current_question_id);
            }
            // Si la partida está en round_review, recuperar solución oficial de la ronda para el docente
            if (existingMatch.status === 'round_review') {
              const solRes = await resolveDuelRound(existingMatch.id);
              if (solRes.success && solRes.correct_answer !== undefined) {
                setRoundSolution({
                  question_id: existingMatch.current_question_id || '',
                  correct_answer: solRes.correct_answer,
                  explanation: solRes.explanation || 'Explicación no disponible.'
                });
              }
            }
          }
        }
      } catch {
        // Fallback silencioso a pantalla de creación
      } finally {
        if (mounted) setLoadingInitial(false);
      }
    }

    checkActiveMatch();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Suscripciones Realtime a la partida y a los equipos
  useEffect(() => {
    if (!match?.id) return;

    const unsubscribeMatch = subscribeToDuelMatch(match.id, async updatedMatch => {
      setMatch(updatedMatch);
      if (updatedMatch.current_question_id) {
        const freshUsed = await fetchDuelUsedQuestions(match.id);
        if (freshUsed.length > 0) {
          setUsedQuestions(freshUsed);
        }
      }
    });

    const unsubscribeTeams = subscribeToDuelTeams(match.id, updatedTeams => {
      setTeams(updatedTeams);
    });

    return () => {
      unsubscribeMatch();
      unsubscribeTeams();
    };
  }, [match?.id]);

  // 3. Temporizador visual durante question_active sincronizado con round_ends_at
  useEffect(() => {
    if (match?.status === 'question_active' && match.round_ends_at) {
      const updateTimer = () => {
        const remaining = Math.max(
          0,
          Math.ceil((new Date(match.round_ends_at!).getTime() - Date.now()) / 1000)
        );
        setSecondsLeft(remaining);
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 500);
    } else {
      setSecondsLeft(30);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [match?.status, match?.round_ends_at]);

  // Pregunta activa actual consultada desde el banco pedagógico
  const currentQuestion: PublicMatchQuestion | undefined = useMemo(() => {
    if (!match?.current_question_id) return undefined;
    return getPublicQuestionById(match.current_question_id);
  }, [match?.current_question_id]);

  // Preguntas para el selector (filtradas por módulo y búsqueda, manteniendo las ya usadas visibles)
  const filteredQuestions = useMemo(() => {
    return ONLINE_QUESTIONS_PUBLIC_BANK.filter(q => {
      if (filterModule !== 'all' && q.moduleId !== filterModule) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesSub = q.subtopic?.toLowerCase().includes(query) || false;
        return matchesText || matchesTopic || matchesSub;
      }
      return true;
    });
  }, [filterModule, searchQuery]);

  // Pregunta activa seleccionada o la primera disponible que no esté utilizada
  const activeQuestionId = useMemo(() => {
    if (selectedQuestionId && !usedQuestionsMap.has(selectedQuestionId)) {
      return selectedQuestionId;
    }
    const firstAvailable = filteredQuestions.find(q => !usedQuestionsMap.has(q.id));
    return firstAvailable ? firstAvailable.id : '';
  }, [selectedQuestionId, filteredQuestions, usedQuestionsMap]);

  // Sincronizar estado completo con Supabase (reconciliación ante errores o desincronización)
  const syncMatchState = async (matchId: string) => {
    try {
      const freshMatch = await fetchDuelMatch(matchId);
      if (freshMatch) {
        setMatch(freshMatch);
        if (freshMatch.status === 'finished') {
          const finalTeams = await fetchDuelTeams(matchId);
          setTeams(finalTeams);
        }
      }
      const freshTeams = await fetchDuelTeams(matchId);
      setTeams(freshTeams);
      const freshUsed = await fetchDuelUsedQuestions(matchId);
      setUsedQuestions(freshUsed);
    } catch {
      // Fallo de red ignorado en background
    }
  };

  // Manejador: Crear nueva partida
  const handleCreateMatch = async () => {
    if (creatingMatch) return;
    setCreatingMatch(true);
    setActionError(null);

    const res = await createDuelMatch();
    if (res.success) {
      const freshMatch: DuelMatch = {
        id: res.match_id,
        pin: res.pin,
        status: 'lobby',
        current_round: 1,
        total_rounds: 10,
        current_question_id: null,
        round_started_at: null,
        round_ends_at: null,
        created_at: new Date().toISOString(),
        created_by: 'senamartin.ismael@gmail.com'
      };
      setMatch(freshMatch);
      setTeams([]);
      setUsedQuestions([]);
      setRoundSolution(null);
      setSelectedQuestionId(ONLINE_QUESTIONS_PUBLIC_BANK[0]?.id || '');
    } else {
      setActionError(res.error || 'No se pudo crear la partida.');
    }
    setCreatingMatch(false);
  };

  // Manejador: Iniciar duelo (Lobby -> question_preview)
  const handleStartDuel = async () => {
    if (!match || processingAction || teams.length < 2 || !activeQuestionId) return;

    setProcessingAction(true);
    setActionError(null);

    const res = await startDuelMatch(match.id, activeQuestionId);
    if (res.success) {
      setMatch(prev =>
        prev
          ? {
              ...prev,
              status: 'question_preview',
              current_round: 1,
              current_question_id: activeQuestionId
            }
          : null
      );
      const freshUsed = await fetchDuelUsedQuestions(match.id);
      setUsedQuestions(freshUsed.length > 0 ? freshUsed : [{ round_number: 1, question_id: activeQuestionId }]);
    } else {
      setActionError(res.error || 'Error al iniciar el duelo.');
      await syncMatchState(match.id);
    }
    setProcessingAction(false);
  };

  // Manejador: Iniciar ronda (question_preview -> question_active)
  const handleStartRound = async () => {
    if (!match || processingAction) return;

    setProcessingAction(true);
    setActionError(null);

    const res = await startDuelRound(match.id, match.current_question_id || activeQuestionId);
    if (res.success) {
      setMatch(prev =>
        prev
          ? {
              ...prev,
              status: 'question_active',
              round_started_at: res.round_started_at,
              round_ends_at: res.round_ends_at
            }
          : null
      );
    } else {
      setActionError(res.error || 'Error al iniciar la ronda activa.');
      await syncMatchState(match.id);
    }
    setProcessingAction(false);
  };

  // Manejador: Resolver ronda (question_active -> round_review)
  const handleResolveRound = async () => {
    if (!match || processingAction) return;

    setProcessingAction(true);
    setActionError(null);

    const res = await resolveDuelRound(match.id);
    if (res.success) {
      setMatch(prev =>
        prev
          ? {
              ...prev,
              status: 'round_review'
            }
          : null
      );
      // Guardar solución oficial (respuesta y explicación) para el docente
      if (res.correct_answer !== undefined) {
        setRoundSolution({
          question_id: match.current_question_id || '',
          correct_answer: res.correct_answer,
          explanation: res.explanation || 'Explicación no disponible.'
        });
      }
      // Actualizar tabla de posiciones oficial desde duel_teams
      const updatedTeams = await fetchDuelTeams(match.id);
      setTeams(updatedTeams);

      // Re-fetch used questions from DB
      const freshUsed = await fetchDuelUsedQuestions(match.id);
      setUsedQuestions(freshUsed);

      // Preseleccionar la siguiente pregunta para la ronda posterior saltando las utilizadas
      const usedIds = new Set(freshUsed.map(uq => uq.question_id));
      if (match.current_question_id) usedIds.add(match.current_question_id);

      const nextAvailable = ONLINE_QUESTIONS_PUBLIC_BANK.find(
        q => !usedIds.has(q.id)
      );
      if (nextAvailable) {
        setSelectedQuestionId(nextAvailable.id);
      }
    } else {
      setActionError(res.error || 'Error al resolver la ronda.');
      await syncMatchState(match.id);
    }
    setProcessingAction(false);
  };

  // Manejador: Avanzar ronda (round_review -> question_preview O finished)
  const handleAdvanceRound = async () => {
    if (!match || processingAction) return;

    const isLastRound = match.current_round >= 10;
    const nextQId = isLastRound ? undefined : activeQuestionId;
    if (!isLastRound && !nextQId) {
      setActionError('Por favor seleccioná la pregunta para la próxima ronda.');
      return;
    }

    setProcessingAction(true);
    setActionError(null);

    const res = await advanceDuelRound(match.id, nextQId);
    if (res.success) {
      setRoundSolution(null);
      if (res.status === 'finished') {
        setMatch(prev => (prev ? { ...prev, status: 'finished' } : null));
        const finalTeams = await fetchDuelTeams(match.id);
        setTeams(finalTeams);
      } else {
        setMatch(prev =>
          prev
            ? {
                ...prev,
                status: 'question_preview',
                current_round: res.current_round,
                current_question_id: res.current_question_id
              }
            : null
        );
        const freshUsed = await fetchDuelUsedQuestions(match.id);
        setUsedQuestions(freshUsed);
      }
    } else {
      setActionError(res.error || 'Error al avanzar de ronda.');
      await syncMatchState(match.id);
    }
    setProcessingAction(false);
  };

  // Reiniciar estado para crear otra partida
  const handleResetMatch = () => {
    setMatch(null);
    setTeams([]);
    setUsedQuestions([]);
    setRoundSolution(null);
    setSelectedQuestionId('');
    setActionError(null);
  };

  // ============================================================================
  // PANTALLA: CARGA INICIAL
  // ============================================================================
  if (loadingInitial) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 animate-fadeIn">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs font-medium text-slate-400">
          Sincronizando panel del docente...
        </p>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 1: CREAR PARTIDA (SIN PARTIDA ACTIVA)
  // ============================================================================
  if (!match) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn pb-12">
        {/* Banner Docente */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl shadow-amber-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-bold uppercase tracking-wider text-amber-100">
              <Tv className="w-3.5 h-3.5 text-amber-300" />
              <span>Modo Proyector de Aula</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              🏆 Duelo de Equipos
            </h1>

            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Iniciá una nueva competencia presencial de 10 rondas. Los alumnos se unirán con el PIN de 6 dígitos desde sus dispositivos.
            </p>
          </div>

          <button
            onClick={handleCreateMatch}
            disabled={creatingMatch}
            className="py-4 px-8 rounded-2xl bg-white text-slate-900 hover:bg-amber-50 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
          >
            {creatingMatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>Generando PIN...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-900" />
                <span>Crear nueva partida</span>
              </>
            )}
          </button>
        </div>

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Guía Pedagógica Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Proyectar PIN</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              El docente proyecta el PIN gigante. Cada equipo designa a un representante para unirse.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Debate en Mesa</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              En cada ronda de 30s, los alumnos debaten el ejercicio antes de votar su respuesta en equipo.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Puntos por Velocidad</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              1er tiempo correcto: 4 pts | 2do: 2 pts | 3er: 1 pt. Podio final tras 10 rondas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 2: LOBBY DE ESPERA (PIN PROYECTADO + EQUIPOS)
  // ============================================================================
  if (match.status === 'lobby') {
    const pinFormatted = match.pin.split('').join(' ');

    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-16">
        {/* Banner Proyector: PIN Gigante */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-python-blue text-white text-center shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-sky-300">
            <Tv className="w-4 h-4" />
            <span>PANTALLA DE PROYECCIÓN DEL AULA</span>
          </div>

          <h2 className="text-lg sm:text-xl font-medium text-slate-300">
            Unite con tu equipo en la plataforma con este código:
          </h2>

          <div className="py-2">
            <span className="text-5xl sm:text-7xl lg:text-8xl font-mono font-black tracking-[0.25em] text-python-yellow drop-shadow-lg select-all">
              {pinFormatted}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Esperando equipos en tiempo real...</span>
          </div>
        </div>

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="font-bold text-xs">✕</button>
          </div>
        )}

        {/* Sección de Equipos Conectados */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-python-blue" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Equipos Conectados
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              teams.length >= 2
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
            }`}>
              {teams.length} / 5 equipos {teams.length >= 2 ? '(Listo para iniciar)' : '(Mínimo 2)'}
            </span>
          </div>

          {teams.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Ningún equipo conectado todavía. Los alumnos deben ingresar el PIN en sus dispositivos.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {teams.map((t, idx) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2 animate-fadeIn"
                >
                  <span className="text-4xl">{t.avatar}</span>
                  <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-full">
                    {t.team_name}
                  </strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Equipo {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selector de Pregunta para Ronda 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Selección de Pregunta para la Ronda 1
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Elegí una pregunta oficial del banco pedagógico de "Python desde Cero".
              </p>
            </div>

            {/* Filtro por Módulo */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterModule}
                onChange={e => setFilterModule(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="all">Todos los módulos</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Módulo {m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Listado de Preguntas Filtradas */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredQuestions.slice(0, 40).map(q => {
              const isUsed = usedQuestionsMap.has(q.id);
              const usedRound = usedQuestionsMap.get(q.id);
              const isSelected = activeQuestionId === q.id && !isUsed;

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    if (!isUsed) setSelectedQuestionId(q.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isUsed
                      ? 'bg-slate-100/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/60 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isUsed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>✓ Ya utilizada — Ronda {usedRound}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Disponible</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        M{q.moduleId}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{q.topic}</span>
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold truncate ${
                      isUsed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'
                    }`}>
                      {q.question}
                    </p>
                  </div>

                  <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-1">
                    {isUsed ? (
                      <Lock className="w-3 h-3 text-slate-400" />
                    ) : isSelected ? (
                      <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón de Inicio */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {teams.length < 2 ? '⚠️ Se necesitan al menos 2 equipos para comenzar' : '✅ Cupo listo para iniciar'}
            </span>

            <button
              disabled={teams.length < 2 || teams.length > 5 || !activeQuestionId || processingAction}
              onClick={handleStartDuel}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {processingAction ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iniciando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Comenzar Duelo (Ronda 1)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 3: VISTA PREVIA O RONDA ACTIVA (PROYECCIÓN EN EL AULA)
  // ============================================================================
  if (match.status === 'question_preview' || match.status === 'question_active') {
    const isPreview = match.status === 'question_preview';

    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-16">
        {/* Cabecera de la Ronda */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-300">
              RONDA {match.current_round} / {match.total_rounds}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isPreview ? '👀 Vista Previa de la Pregunta' : '⏱️ Ronda en Curso — ¡A Responder!'}
            </h2>
          </div>

          {/* Temporizador o Estado */}
          <div className="flex items-center gap-3">
            {isPreview ? (
              <span className="px-4 py-2 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold">
                Debate en mesa
              </span>
            ) : (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono text-xl sm:text-2xl font-black">
                <Clock className="w-6 h-6 animate-pulse" />
                <span>{secondsLeft}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de la Pregunta Proyectada (Letras grandes y legibles desde distancia) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-lg space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {currentQuestion?.topic || 'Pregunta de Python'}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {currentQuestion?.question || 'Cargando pregunta...'}
            </h1>
          </div>

          {/* Snippet de código si existe */}
          {currentQuestion?.codeSnippet && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-sky-300 font-mono text-sm sm:text-base border border-slate-800 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre">{currentQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Opciones A, B, C, D (Sin revelar la correcta) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion?.options.map((opt, idx) => {
              const letters = ['A', 'B', 'C', 'D'];
              const letterColors = [
                'bg-rose-500 text-white',
                'bg-blue-500 text-white',
                'bg-amber-500 text-slate-950',
                'bg-emerald-500 text-white'
              ];

              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700 flex items-start gap-4 shadow-sm"
                >
                  <span className={`w-9 h-9 rounded-xl font-mono font-black flex items-center justify-center flex-shrink-0 text-base shadow-sm ${letterColors[idx % 4]}`}>
                    {letters[idx]}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 pt-0.5 leading-snug">
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Barra de Equipos y Puntos Actuales */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-400">EQUIPOS PARTICIPANTES:</span>
            <div className="flex flex-wrap gap-2">
              {teams.map(t => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{t.avatar}</span>
                  <span>{t.team_name}</span>
                  <span className="font-mono text-python-blue dark:text-sky-400">({t.total_score} pts)</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
            {actionError}
          </div>
        )}

        {/* Panel de Control Docente */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {isPreview ? (
              <span>📌 Los alumnos están leyendo. Presioná <strong>Iniciar ronda</strong> para activar el reloj de 30 segundos.</span>
            ) : (
              <span>⏱️ Reloj corriendo. Cuando todos los equipos respondan o termine el tiempo, presioná <strong>Resolver ronda</strong>.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isPreview ? (
              <button
                disabled={processingAction}
                onClick={handleStartRound}
                className="py-3 px-6 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                <span>Iniciar ronda (30s)</span>
              </button>
            ) : (
              <button
                disabled={processingAction}
                onClick={handleResolveRound}
                className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {processingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Resolver ronda y asignar puntos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 4: RESULTADOS DE LA RONDA (ROUND_REVIEW)
  // ============================================================================
  if (match.status === 'round_review') {
    const isLastRound = match.current_round >= 10;
    const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score || a.total_time_ms - b.total_time_ms);

    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-16">
        {/* Cabecera Resultados */}
        <div className="p-6 rounded-3xl bg-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-indigo-300">
              RONDA {match.current_round} / {match.total_rounds} FINALIZADA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              🔍 Resultados y Solución Oficial
            </h2>
          </div>

          <span className="px-4 py-1.5 rounded-2xl bg-amber-400 text-slate-950 text-xs font-bold">
            Puntos calculados por RPC
          </span>
        </div>

        {/* Solución y Explicación Pedagógica */}
        {currentQuestion && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pregunta Resuelta</span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Snippet de código si existe */}
            {currentQuestion.codeSnippet && (
              <div className="p-4 rounded-2xl bg-slate-950 text-sky-300 font-mono text-xs sm:text-sm border border-slate-800 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre">{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* Opciones de la Pregunta con Resaltado de la Opción Correcta para Debate en el Aula */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Opciones Evaluadas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isCorrect = roundSolution !== null && roundSolution.correct_answer === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {letters[idx]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs sm:text-sm leading-relaxed block ${
                            isCorrect
                              ? 'text-emerald-950 dark:text-emerald-100 font-medium'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </span>
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Opción Correcta
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel Pedagógico Exclusivo del Docente: Solución Oficial y Explicación */}
            <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Solución Oficial y Explicación Pedagógica
                  </span>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 uppercase tracking-wider self-start sm:self-auto">
                  🔒 Exclusivo para el Docente
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Respuesta correcta:
                  </span>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {roundSolution && roundSolution.correct_answer !== undefined && currentQuestion ? (
                      <>
                        <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-mono text-sm shadow-sm">
                          Opción {['A', 'B', 'C', 'D'][roundSolution.correct_answer]}
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                          {currentQuestion.options[roundSolution.correct_answer]}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Cargando solución oficial...</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-500/20">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Explicación:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-amber-500/20 shadow-sm font-normal">
                    {roundSolution?.explanation ? roundSolution.explanation : 'Explicación no disponible.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmación de Evaluación Oficial del Servidor */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase">
                  Ronda Evaluada Oficialmente por el Servidor
                </strong>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Las respuestas de los equipos fueron verificadas de forma autoritativa en Supabase y los puntos asignados según velocidad (4, 2, 1, 0 pts). Podés debatir las opciones con el aula antes de avanzar a la siguiente ronda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Posiciones Acumulada */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Tabla de Posiciones Acumulada</span>
            </h3>
            <span className="text-xs text-slate-400">Orden oficial por puntaje y velocidad</span>
          </div>

          <div className="space-y-2">
            {sortedTeams.map((t, idx) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm flex items-center justify-center">
                    {idx + 1}º
                  </span>
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      {t.team_name}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Rondas ganadas: {t.rounds_won}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-python-blue dark:text-sky-400 block font-mono">
                    {t.total_score} pts
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(t.total_time_ms / 1000).toFixed(1)}s total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selector de Pregunta para Siguiente Ronda (Solo si ronda < 10) */}
        {!isLastRound && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Seleccionar Pregunta para la Ronda {match.current_round + 1}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Las preguntas ya jugadas en rondas anteriores se encuentran deshabilitadas.
                </p>
              </div>

              {/* Filtro por Módulo */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterModule}
                  onChange={e => setFilterModule(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="all">Todos los módulos</option>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Módulo {m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listado de Preguntas Filtradas con estado de disponibilidad */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {filteredQuestions.slice(0, 40).map(q => {
                const isUsed = usedQuestionsMap.has(q.id);
                const usedRound = usedQuestionsMap.get(q.id);
                const isSelected = activeQuestionId === q.id && !isUsed;

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      if (!isUsed) setSelectedQuestionId(q.id);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isUsed
                        ? 'bg-slate-100/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/60 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm cursor-pointer'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isUsed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>✓ Ya utilizada — Ronda {usedRound}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Disponible</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          M{q.moduleId}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{q.topic}</span>
                      </div>
                      <p className={`text-xs sm:text-sm font-semibold truncate ${
                        isUsed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'
                      }`}>
                        {q.question}
                      </p>
                    </div>

                    <div className="w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-1">
                      {isUsed ? (
                        <Lock className="w-3 h-3 text-slate-400" />
                      ) : isSelected ? (
                        <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
            {actionError}
          </div>
        )}

        {/* Botón de Avance */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            disabled={processingAction || (!isLastRound && !activeQuestionId)}
            onClick={handleAdvanceRound}
            className="py-3.5 px-8 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {processingAction ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Avanzando...</span>
              </>
            ) : isLastRound ? (
              <>
                <Trophy className="w-4 h-4 text-python-yellow" />
                <span>Finalizar Duelo y Ver Podio 🏆</span>
              </>
            ) : (
              <>
                <span>Avanzar a Ronda {match.current_round + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA 5: FINALIZADO (FINISHED) — PODIO FINAL PARA PROYECCIÓN
  // ============================================================================
  const sortedTeams = [...teams].sort((a, b) => b.total_score - a.total_score || a.total_time_ms - b.total_time_ms);
  const first = sortedTeams[0];
  const second = sortedTeams[1];
  const third = sortedTeams[2];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn pb-16 text-center">
      {/* Banner de Ceremonia */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/20 text-xs font-black uppercase tracking-widest text-amber-200">
          <Sparkles className="w-4 h-4 text-python-yellow" />
          <span>COMPETENCIA COMPLETADA — 10 RONDAS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
          🏆 DUELO DE EQUIPOS FINALIZADO
        </h1>

        <p className="text-sm sm:text-base text-amber-100 max-w-xl mx-auto leading-relaxed">
          ¡Felicitaciones a todos los equipos por su participación, velocidad y trabajo en equipo!
        </p>
      </div>

      {/* Podio Olímpico para Proyector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-3xl mx-auto pt-4">
        {/* 2do Puesto */}
        {second && (
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-md flex flex-col items-center space-y-2 h-64 justify-end">
            <span className="text-4xl">{second.avatar}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">🥈 2º Puesto</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate max-w-full">
              {second.team_name}
            </h3>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">
              {second.total_score} pts
            </span>
          </div>
        )}

        {/* 1er Puesto (Campeón) */}
        {first && (
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-amber-100 to-white dark:from-amber-950/60 dark:to-slate-900 border-4 border-amber-400 dark:border-amber-500 shadow-2xl flex flex-col items-center space-y-3 h-80 justify-end transform md:-translate-y-4">
            <div className="text-6xl animate-bounce">{first.avatar}</div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
              <span>🥇 Campeón</span>
            </div>
            <h2 className="font-black text-xl text-slate-900 dark:text-white truncate max-w-full">
              {first.team_name}
            </h2>
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {first.total_score} pts
            </span>
          </div>
        )}

        {/* 3er Puesto */}
        {third && (
          <div className="order-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-700/40 dark:border-amber-900/60 shadow-md flex flex-col items-center space-y-2 h-56 justify-end">
            <span className="text-4xl">{third.avatar}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">🥉 3º Puesto</span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate max-w-full">
              {third.team_name}
            </h3>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-200 font-mono">
              {third.total_score} pts
            </span>
          </div>
        )}
      </div>

      {/* Tabla Completa de Todos los Equipos */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto text-left space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Posiciones Finales
        </h4>

        <div className="space-y-2">
          {sortedTeams.map((t, idx) => (
            <div
              key={t.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{t.avatar}</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{t.team_name}</span>
              </div>

              <span className="font-mono font-bold text-xs text-python-blue dark:text-sky-400">
                {t.total_score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón Nueva Partida */}
      <div className="pt-4">
        <button
          onClick={handleResetMatch}
          className="py-3.5 px-8 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Iniciar Nueva Partida</span>
        </button>
      </div>
    </div>
  );
};
