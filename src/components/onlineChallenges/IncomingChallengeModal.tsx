import React, { useState, useEffect } from 'react';
import { IncomingChallengeData } from '../../types/onlineChallenge';
import { Swords, Coins, Clock, BrainCircuit, X, Check, AlertCircle, BookOpen } from 'lucide-react';
import { getModuleTopicName, getMaxAllowedMatchModule } from '../../utils/onlineProgressUtils';

interface IncomingChallengeModalProps {
  challenge: IncomingChallengeData | null;
  onAccept: (challenge: IncomingChallengeData) => void;
  onReject: (challenge: IncomingChallengeData) => void;
  userAvailableXp: number;
  userMaxModule?: number;
}

export const IncomingChallengeModal: React.FC<IncomingChallengeModalProps> = ({
  challenge,
  onAccept,
  onReject,
  userAvailableXp,
  userMaxModule = 1
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);

  useEffect(() => {
    if (!challenge) {
      setSecondsRemaining(60);
      return;
    }

    // Calcular segundos restantes según expiresAt
    const calcRemaining = () => {
      const expires = new Date(challenge.expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      return diff > 0 ? diff : 0;
    };

    setSecondsRemaining(calcRemaining() || 60);

    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onReject(challenge);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [challenge, onReject]);

  if (!challenge) return null;

  const canAfford = userAvailableXp >= challenge.wagerXp;
  const oppMaxModule = challenge.challengerMaxModule || 1;
  const oppTopic = getModuleTopicName(oppMaxModule);
  const allowedMaxModule = getMaxAllowedMatchModule(userMaxModule, oppMaxModule);
  const allowedTopic = getModuleTopicName(allowedMaxModule);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-rose-500/60 p-6 sm:p-8 space-y-5 animate-scaleUp">
        
        {/* Header Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center text-3xl shadow-inner animate-bounce">
          📨
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
            <Swords className="w-3.5 h-3.5" />
            <span>Desafío Entrante</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            ¡Te desafiaron!
          </h2>

          <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
            {challenge.challengerName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {challenge.challengerSchool} quiere enfrentarte.
          </p>
          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
              🧠 Nivel rival: {oppTopic} (Módulo {oppMaxModule})
            </span>
          </div>
        </div>

        {/* Match Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Apuesta en juego:</span>
            <span className="font-extrabold text-amber-600 dark:text-yellow-400 flex items-center gap-1 text-sm">
              <Coins className="w-4 h-4 text-yellow-500" />
              {challenge.wagerXp} XP
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Premio para el ganador:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              🏆 {challenge.wagerXp * 2} XP
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Contenidos del duelo:</span>
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                Hasta Módulo {allowedMaxModule} ({allowedTopic})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-rose-500" />
                10 preguntas adaptadas
              </span>
              <span className="flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                {secondsRemaining}s para responder
              </span>
            </div>
          </div>
        </div>

        {/* Not enough XP warning */}
        {!canAfford && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p>
              No disponés de suficiente XP ({userAvailableXp} XP disponibles) para aceptar esta apuesta de {challenge.wagerXp} XP.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => onReject(challenge)}
            className="w-1/2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Rechazar</span>
          </button>

          <button
            type="button"
            disabled={!canAfford}
            onClick={() => onAccept(challenge)}
            className="w-1/2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all transform active:scale-98 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Aceptar duelo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
