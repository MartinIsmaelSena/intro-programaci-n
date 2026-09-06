import React, { useState, useEffect, useRef } from 'react';
import {
  Player,
  StudentProfile,
  MatchQuestion,
  MatchAnswer,
  MatchResult,
  InMatchChatMessage
} from '../../types/onlineChallenge';
import {
  calculateAnswerPoints,
  determineMatchWinner,
  simulateRivalAnswer,
  supabaseSubscribeToMatch,
  supabaseSubmitAnswer,
  supabaseSendChatMessage,
  supabaseReportAbandonment,
  supabaseCheckMatchStatus,
  supabaseGetAuthoritativeMatchResult
} from '../../services/onlineChallengesService';
import { getOrCreateSessionId } from '../../lib/supabase';
import { OnlineChatDrawer } from './OnlineChatDrawer';
import {
  Swords,
  Clock,
  CheckCircle2,
  XCircle,
  Code2,
  Sparkles,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface OnlineMatchViewProps {
  challenger: StudentProfile;
  opponent: Player;
  betXp: number;
  questions: MatchQuestion[];
  matchId?: string;
  isRealMatch?: boolean;
  onMatchFinished: (result: MatchResult) => void;
  onExitEarly?: () => void;
}

export const OnlineMatchView: React.FC<OnlineMatchViewProps> = ({
  challenger,
  opponent,
  betXp,
  questions,
  matchId,
  isRealMatch = false,
  onMatchFinished
}) => {
  const mySessionId = getOrCreateSessionId();

  // Estado de la partida
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // Puntajes y respuestas del usuario
  const [userScore, setUserScore] = useState<number>(0);
  const [userCorrectCount, setUserCorrectCount] = useState<number>(0);
  const [userTotalTime, setUserTotalTime] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, MatchAnswer>>({});

  // Puntajes y respuestas del rival
  const [rivalScore, setRivalScore] = useState<number>(0);
  const [rivalCorrectCount, setRivalCorrectCount] = useState<number>(0);
  const [rivalTotalTime, setRivalTotalTime] = useState<number>(0);
  const [rivalAnswersCount, setRivalAnswersCount] = useState<number>(0);
  const [rivalLiveNotice, setRivalLiveNotice] = useState<{
    text: string;
    isCorrect: boolean;
  } | null>(null);

  // Cronómetro de la pregunta actual
  const [questionTimer, setQuestionTimer] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Estado Realtime (Fase 2)
  const [isWaitingForRival, setIsWaitingForRival] = useState<boolean>(false);
  const [remoteWinnerSessionId, setRemoteWinnerSessionId] = useState<string | null>(null);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState<boolean>(false);
  const [disconnectSecondsLeft, setDisconnectSecondsLeft] = useState<number>(30);
  const disconnectTimerRef = useRef<any>(null);
  const userFinalDataRef = useRef<{
    finalUserCorrect: number;
    finalUserScore: number;
    finalUserTime: number;
    finalUserAnswers: Record<number, MatchAnswer>;
  } | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<InMatchChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [floatingReaction, setFloatingReaction] = useState<{
    sender: string;
    content: string;
  } | null>(null);

  // Almacenar el rival answer precalculado para la pregunta actual (solo modo bot)
  const currentQuestion = questions[currentIndex];
  const [currentRivalAnswer, setCurrentRivalAnswer] = useState<MatchAnswer | null>(() =>
    !isRealMatch ? simulateRivalAnswer(questions[0], opponent, 0) : null
  );

  // Iniciar cronómetro por pregunta
  useEffect(() => {
    setQuestionTimer(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setRivalLiveNotice(null);

    // Solo simular respuesta del rival en modo bot
    if (!isRealMatch) {
      const rivalAns = simulateRivalAnswer(questions[currentIndex], opponent, currentIndex);
      setCurrentRivalAnswer(rivalAns);
    }

    // Timer local de la pregunta
    timerRef.current = setInterval(() => {
      setQuestionTimer(prev => Math.round((prev + 0.1) * 10) / 10);
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions, opponent, isRealMatch]);

  const triggerRivalChat = (content: string) => {
    const newMsg: InMatchChatMessage = {
      id: `chat_${Date.now()}_${Math.random()}`,
      senderId: opponent.id,
      senderName: opponent.firstName,
      isUser: false,
      content,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMsg]);
    setFloatingReaction({ sender: opponent.firstName, content });
    setTimeout(() => setFloatingReaction(null), 3000);
  };
  const triggerRivalChatRef = useRef(triggerRivalChat);
  triggerRivalChatRef.current = triggerRivalChat;

  const finishMatchWithDataRef = useRef<((userData: any, winnerSessionId?: string) => void) | null>(null);

  // Simulación del momento en que el rival responde (Solo modo bot / Fase 1)
  useEffect(() => {
    if (isRealMatch || !currentRivalAnswer) return;

    const delayMs = currentRivalAnswer.timeSeconds * 1000;
    const timeout = setTimeout(() => {
      // Registrar puntaje del rival
      setRivalScore(prev => prev + currentRivalAnswer.points);
      if (currentRivalAnswer.isCorrect) {
        setRivalCorrectCount(prev => prev + 1);
      }
      setRivalTotalTime(prev => Math.round((prev + currentRivalAnswer.timeSeconds) * 10) / 10);
      setRivalAnswersCount(prev => prev + 1);

      // Aviso en pantalla
      setRivalLiveNotice({
        text: `${opponent.firstName} respondió ${
          currentRivalAnswer.isCorrect ? 'correctamente ✓' : 'incorrectamente ✗'
        } (${currentRivalAnswer.timeSeconds}s)`,
        isCorrect: currentRivalAnswer.isCorrect
      });

      // Ocasionalmente el rival envía una reacción o frase al responder
      const reactions = opponent.reactions;
      if (Math.random() < 0.35 && reactions && reactions.length > 0) {
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        setTimeout(() => {
          triggerRivalChatRef.current?.(randomReaction);
        }, 600);
      }
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [currentRivalAnswer, opponent, isRealMatch]);

  // Suscripción Realtime a eventos de la partida en Supabase (Fase 2)
  useEffect(() => {
    if (!isRealMatch || !matchId) return;

    const unsub = supabaseSubscribeToMatch(matchId, {
      onOpponentAnswered: (_qIdx, isCorrect, points, responseTime) => {
        if (points !== undefined) {
          setRivalScore(prev => prev + points);
        }
        if (isCorrect) {
          setRivalCorrectCount(prev => prev + 1);
        }
        if (responseTime !== undefined) {
          setRivalTotalTime(prev => Math.round((prev + responseTime) * 10) / 10);
        }
        setRivalAnswersCount(prev => {
          const nextCount = prev + 1;
          // Si el usuario ya terminó sus 10 preguntas y el rival acaba de terminar la última:
          if (userFinalDataRef.current && nextCount >= questions.length) {
            setTimeout(() => {
              finishMatchWithDataRef.current?.(userFinalDataRef.current!);
            }, 500);
          }
          return nextCount;
        });

        setRivalLiveNotice({
          text: `${opponent.firstName} respondió ${isCorrect ? 'correctamente ✓' : 'incorrectamente ✗'}${
            points ? ` (+${points} pts)` : ''
          }`,
          isCorrect
        });
      },
      onOpponentProgress: (rCorr, rScore, rTime, rCount) => {
        setRivalCorrectCount(rCorr);
        setRivalScore(rScore);
        if (rTime > 0) setRivalTotalTime(rTime);
        if (rCount !== undefined && rCount >= 0) {
          setRivalAnswersCount(rCount);
          if (userFinalDataRef.current && rCount >= questions.length) {
            setTimeout(() => {
              finishMatchWithDataRef.current?.(userFinalDataRef.current!);
            }, 500);
          }
        }
      },
      onMatchCompleted: winnerSessionId => {
        setRemoteWinnerSessionId(winnerSessionId);
        if (userFinalDataRef.current) {
          finishMatchWithDataRef.current?.(userFinalDataRef.current, winnerSessionId);
        }
      },
      onOpponentDisconnected: () => {
        setIsOpponentDisconnected(true);
        setDisconnectSecondsLeft(30);
      },
      onOpponentReconnected: () => {
        setIsOpponentDisconnected(false);
      },
      onChatMessage: msg => {
        if (!msg.isUser) {
          setChatMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setFloatingReaction({ sender: opponent.firstName, content: msg.content });
          setTimeout(() => setFloatingReaction(null), 3000);
        }
      }
    });

    return () => {
      unsub();
    };
  }, [isRealMatch, matchId, opponent.firstName, questions.length]);

  // Cronómetro de desconexión del oponente
  useEffect(() => {
    if (isOpponentDisconnected) {
      disconnectTimerRef.current = setInterval(() => {
        setDisconnectSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(disconnectTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (disconnectTimerRef.current) clearInterval(disconnectTimerRef.current);
    }

    return () => {
      if (disconnectTimerRef.current) clearInterval(disconnectTimerRef.current);
    };
  }, [isOpponentDisconnected]);

  const handleSendUserChat = (content: string) => {
    const newMsg: InMatchChatMessage = {
      id: `chat_${Date.now()}`,
      senderId: 'user',
      senderName: challenger.firstName,
      isUser: true,
      content,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMsg]);
    setFloatingReaction({ sender: 'Tú', content });
    setTimeout(() => setFloatingReaction(null), 2500);

    if (isRealMatch && matchId) {
      supabaseSendChatMessage(matchId, challenger.firstName, content).catch(() => {});
    } else {
      // Posibilidad de que el rival bot responda
      const reactions = opponent.reactions;
      if (Math.random() < 0.45 && reactions && reactions.length > 0) {
        setTimeout(() => {
          const reply = reactions[Math.floor(Math.random() * reactions.length)];
          if (reply) triggerRivalChat(reply);
        }, 1400);
      }
    }
  };

  const isResolvingMatchRef = useRef<boolean>(false);

  const finishAuthoritativeOrFallback = async (_userData?: any, overrideWinnerSessionId?: string) => {
    if (isResolvingMatchRef.current) return;
    isResolvingMatchRef.current = true;
    setIsWaitingForRival(false);

    if (isRealMatch && matchId) {
      try {
        const authoritativeResult = await supabaseGetAuthoritativeMatchResult(
          matchId,
          mySessionId,
          opponent,
          questions,
          userFinalDataRef.current?.finalUserAnswers || userAnswers
        );
        onMatchFinished(authoritativeResult);
        return;
      } catch (err) {
        console.error('Error al resolver partida autoritativa de Supabase:', err);
      }
    }

    // Fallback: partida simulada bot o emergencia de conexión
    const finalData = userFinalDataRef.current || {
      finalUserCorrect: userCorrectCount,
      finalUserScore: userScore,
      finalUserTime: userTotalTime,
      finalUserAnswers: userAnswers
    };
    finishMatchWithData(finalData, overrideWinnerSessionId);
  };

  // Reclamar victoria por abandono de desconexión
  const handleClaimAbandonment = async () => {
    if (matchId && opponent.sessionId) {
      await supabaseReportAbandonment(matchId, opponent.sessionId).catch(() => {});
    }
    finishAuthoritativeOrFallback(null, mySessionId);
  };

  const finishMatchWithData = (
    userData: {
      finalUserCorrect: number;
      finalUserScore: number;
      finalUserTime: number;
      finalUserAnswers: Record<number, MatchAnswer>;
    },
    overrideWinnerSessionId?: string
  ) => {
    let winnerId: string;
    let isTie = false;

    if (overrideWinnerSessionId) {
      if (overrideWinnerSessionId === 'tie') {
        isTie = true;
        winnerId = 'tie';
      } else if (overrideWinnerSessionId === mySessionId) {
        winnerId = 'user';
      } else {
        winnerId = opponent.id;
      }
    } else {
      const winnerType = determineMatchWinner(
        userData.finalUserCorrect,
        rivalCorrectCount,
        userData.finalUserScore,
        rivalScore,
        userData.finalUserTime,
        rivalTotalTime
      );
      isTie = winnerType === 'tie';
      winnerId = isTie ? 'tie' : winnerType === 'user' ? 'user' : opponent.id;
    }

    const isUserWinner = winnerId === 'user';
    const xpDelta = isTie ? 0 : isUserWinner ? betXp : -betXp;

    const userMistakes: Array<{
      question: MatchQuestion;
      userSelectedOption: number;
    }> = [];

    questions.forEach((q, idx) => {
      const ans = userData.finalUserAnswers[idx];
      if (ans && !ans.isCorrect) {
        userMistakes.push({
          question: q,
          userSelectedOption: ans.selectedOption
        });
      }
    });

    const result: MatchResult = {
      matchId: matchId || `match_${Date.now()}`,
      winnerId,
      isTie,
      userScore: userData.finalUserScore,
      rivalScore,
      userCorrectCount: userData.finalUserCorrect,
      rivalCorrectCount,
      userTimeSeconds: userData.finalUserTime,
      rivalTimeSeconds: rivalTotalTime,
      betXp,
      xpDelta,
      rival: opponent,
      date: new Date().toISOString(),
      userMistakes
    };

    onMatchFinished(result);
  };
  finishMatchWithDataRef.current = finishAuthoritativeOrFallback;

  // Polling de respaldo cuando el usuario ya terminó sus preguntas y espera la resolución final
  useEffect(() => {
    if (!isWaitingForRival || !isRealMatch || !matchId) return;

    const pollInterval = setInterval(async () => {
      try {
        const check = await supabaseCheckMatchStatus(matchId);
        if (check.isCompleted) {
          clearInterval(pollInterval);
          finishMatchWithDataRef.current?.(userFinalDataRef.current || null, check.winnerSessionId);
        }
      } catch {}
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [isWaitingForRival, isRealMatch, matchId]);

  // Enviar respuesta del usuario
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(optionIndex);
    setIsAnswerSubmitted(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const timeSpent = Math.max(0.8, questionTimer);
    const { totalPoints } = calculateAnswerPoints(isCorrect, timeSpent);

    const newAnswer: MatchAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      isCorrect,
      timeSeconds: timeSpent,
      points: totalPoints
    };

    const updatedUserAnswers = {
      ...userAnswers,
      [currentIndex]: newAnswer
    };
    setUserAnswers(updatedUserAnswers);

    const nextScore = userScore + totalPoints;
    const nextCorrect = isCorrect ? userCorrectCount + 1 : userCorrectCount;
    const nextTime = Math.round((userTotalTime + timeSpent) * 10) / 10;

    setUserScore(nextScore);
    if (isCorrect) setUserCorrectCount(nextCorrect);
    setUserTotalTime(nextTime);

    // Enviar respuesta en tiempo real a Supabase si aplica
    if (isRealMatch && matchId) {
      supabaseSubmitAnswer(
        matchId,
        currentIndex,
        currentQuestion.id,
        optionIndex,
        isCorrect,
        timeSpent,
        totalPoints
      ).catch(err => console.error('Error al enviar respuesta realtime:', err));
    }

    // Breve pausa para ver si acertó antes de pasar a la siguiente pregunta
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const completedData = {
          finalUserCorrect: nextCorrect,
          finalUserScore: nextScore,
          finalUserTime: nextTime,
          finalUserAnswers: updatedUserAnswers
        };
        userFinalDataRef.current = completedData;

        if (isRealMatch) {
          // Si el rival ya terminó sus 10 preguntas o la BD ya dio ganador
          if (rivalAnswersCount >= questions.length || remoteWinnerSessionId) {
            finishAuthoritativeOrFallback(completedData, remoteWinnerSessionId || undefined);
          } else {
            // El usuario terminó primero: esperar a que el rival concluya
            setIsWaitingForRival(true);
            setTimeout(() => {
              if (!isResolvingMatchRef.current) {
                finishAuthoritativeOrFallback(userFinalDataRef.current);
              }
            }, 60000);
          }
        } else {
          // Modo bot
          finishMatchWithData(completedData);
        }
      }
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn relative">
      
      {/* Floating Chat Reaction Banner */}
      {floatingReaction && (
        <div className="fixed top-20 right-6 z-50 animate-bounce pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 shadow-2xl border border-slate-700/40 text-sm font-extrabold flex items-center gap-2">
            <span className="text-xs opacity-75">{floatingReaction.sender}:</span>
            <span className="text-lg">{floatingReaction.content}</span>
          </div>
        </div>
      )}

      {/* Opponent Disconnection Warning Banner */}
      {isOpponentDisconnected && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-extrabold text-xs sm:text-sm">
                ⚠️ {opponent.firstName} se ha desconectado
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Esperando reconexión ({disconnectSecondsLeft}s restantes)...
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClaimAbandonment}
            className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            Reclamar victoria por abandono 🏆
          </button>
        </div>
      )}

      {/* Header: Scoreboard 1v1 */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between gap-4">
          
          {/* Jugador A (Usuario) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-2xl sm:text-3xl shadow-md text-white flex-shrink-0">
              🧑‍💻
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {challenger.firstName} {challenger.lastName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-sky-400 flex items-center gap-1">
                  ⭐ {userScore} <span className="text-[10px] font-normal text-slate-400">pts</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {userCorrectCount}✓
                </span>
              </div>
            </div>
          </div>

          {/* Centro: Marcador de Pregunta y Reloj */}
          <div className="text-center px-2 py-1 flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Swords className="w-3.5 h-3.5 text-rose-500" />
              <span>Pregunta {currentIndex + 1} de {questions.length}</span>
            </div>

            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{questionTimer.toFixed(1)}s</span>
            </div>
          </div>

          {/* Jugador B (Rival) */}
          <div className="flex items-center gap-3 min-w-0 text-right justify-end">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {opponent.firstName} {opponent.lastName}
              </p>
              <div className="flex items-center justify-end gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {rivalCorrectCount}✓
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  ⭐ {rivalScore} <span className="text-[10px] font-normal text-slate-400">pts</span>
                </span>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-orange-600 border border-rose-400/40 flex items-center justify-center text-2xl sm:text-3xl shadow-md text-white flex-shrink-0">
              {opponent.avatar || '👨‍💻'}
            </div>
          </div>

        </div>

        {/* Rival Live Notice Banner */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Estado del rival:</span>
            {rivalLiveNotice ? (
              <span className={`font-semibold flex items-center gap-1 text-[11px] ${
                rivalLiveNotice.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {rivalLiveNotice.text}
              </span>
            ) : (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-pulse">
                <span>{opponent.firstName} está pensando...</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-600 dark:text-yellow-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Pozo: 🪙 {betXp * 2} XP
            </span>
            <OnlineChatDrawer
              messages={chatMessages}
              onSendMessage={handleSendUserChat}
              isOpen={chatOpen}
              onToggle={() => setChatOpen(prev => !prev)}
              opponentName={opponent.firstName}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {isWaitingForRival ? (
          <div className="py-12 px-4 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                ¡Completaste tus 10 preguntas! 🎯
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Esperando a que <strong>{opponent.firstName}</strong> termine de responder sus preguntas ({rivalAnswersCount} de {questions.length} respondidas)...
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Progreso del rival:</span>
              <span className="font-extrabold text-rose-600 dark:text-rose-400">
                {rivalAnswersCount} / {questions.length} preguntas
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sincronizando puntaje final en tiempo real...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Category & Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{currentQuestion.categoryLabel}</span>
              </div>

              <span className="text-xs text-slate-400 font-medium">
                +100 pts base · hasta +50 bonus velocidad
              </span>
            </div>

            {/* Enunciado */}
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Code Snippet (si aplica) */}
            {currentQuestion.codeSnippet && (
              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-sky-300 shadow-inner overflow-x-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500 select-none">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Python</span>
                  </div>
                  <span>Terminal</span>
                </div>
                <pre className="whitespace-pre">{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* Opciones de respuesta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;

                let buttonClasses =
                  'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-rose-400 dark:hover:border-rose-500';

                if (isAnswerSubmitted) {
                  if (isSelected && isCorrect) {
                    buttonClasses =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-md shadow-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    buttonClasses =
                      'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-100 shadow-md shadow-rose-500/20';
                  } else if (isCorrect) {
                    buttonClasses =
                      'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-400/80 text-emerald-800 dark:text-emerald-200';
                  } else {
                    buttonClasses =
                      'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left font-medium transition-all flex items-start gap-3 transform active:scale-99 ${buttonClasses}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                        isAnswerSubmitted && isSelected && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswerSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs'
                      }`}
                    >
                      {letters[idx]}
                    </span>

                    <div className="flex-1 text-xs sm:text-sm pt-0.5 leading-relaxed">{option}</div>

                    {isAnswerSubmitted && isSelected && (
                      <div className="flex-shrink-0 pt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback inmediato visual */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fadeIn flex items-center justify-between ${
                  selectedOption === currentQuestion.correctAnswer
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">
                        ¡Respuesta correcta! +{userAnswers[currentIndex]?.points || 100} puntos
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="font-bold">Respuesta incorrecta (+0 puntos)</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] opacity-75 font-semibold">Pasando a la siguiente...</span>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
