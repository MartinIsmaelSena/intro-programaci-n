import React from 'react';
import { Player, RivalConsecutiveTracker } from '../../types/onlineChallenge';
import { checkPlayersCompatibility, getModuleTopicName } from '../../utils/onlineProgressUtils';
import { Trophy, Flame, Coins, Swords, AlertCircle, Clock, Brain, AlertTriangle } from 'lucide-react';

interface PlayerLobbyCardProps {
  player: Player;
  consecutiveStatus: RivalConsecutiveTracker;
  onChallenge: (player: Player) => void;
  userAvailableXp: number;
  userMaxModule?: number;
}

export const PlayerLobbyCard: React.FC<PlayerLobbyCardProps> = ({
  player,
  consecutiveStatus,
  onChallenge,
  userAvailableXp: _userAvailableXp,
  userMaxModule = 1
}) => {
  const isAvailable = player.status === 'available';
  const isPlaying = player.status === 'playing';
  const isOffline = player.status === 'offline';
  const isBlockedLimit = consecutiveStatus.isBlockedToday;

  const targetModule = player.maxCompletedModule || 1;
  const topic = player.levelTopic || getModuleTopicName(targetModule);
  const compatibility = checkPlayersCompatibility(userMaxModule, targetModule);
  const isCompatible = compatibility.compatible;

  const cannotChallenge = !isAvailable || isBlockedLimit || !isCompatible;

  return (
    <div className={`relative flex flex-col justify-between p-5 rounded-3xl border transition-all duration-200 ${
      cannotChallenge
        ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/60 opacity-90'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-400 dark:hover:border-rose-500/50'
    }`}>
      
      <div>
        {/* Header: Status Indicator & Avatar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-2xl shadow-inner">
                {player.avatar || '🧑‍💻'}
              </div>
              {/* Online Dot */}
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                isAvailable ? 'bg-emerald-500' : isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                  {player.firstName} {player.lastName}
                </h3>
                {player.isRealPlayer && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    En vivo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {player.school} · {player.course}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : isPlaying
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isAvailable ? 'bg-emerald-500' : isPlaying ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
            {isAvailable ? 'Disponible' : isPlaying ? 'Jugando' : 'Desconectado'}
          </span>
        </div>

        {/* Nivel / Progreso Pedagógico del Alumno */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 mb-2.5">
          <div className="flex items-center gap-1.5 truncate">
            <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="font-extrabold truncate">
              🧠 Nivel: {topic}
            </span>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
            Módulo {targetModule}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 my-3 text-center">
          <div className="px-1 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Victorias</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
              {player.wins}
            </p>
          </div>

          <div className="px-1 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Racha</span>
            </div>
            <p className="text-sm font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">
              {player.streak}
            </p>
          </div>

          <div className="px-1 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <Coins className="w-3 h-3 text-yellow-500" />
              <span>XP</span>
            </div>
            <p className="text-sm font-extrabold text-amber-600 dark:text-yellow-400 mt-0.5">
              {player.xp}
            </p>
          </div>
        </div>
      </div>

      {/* Blocked or Action Area */}
      <div className="mt-2">
        {isBlockedLimit ? (
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Límite alcanzado hoy (3 partidas)</p>
              <p className="text-[10px] opacity-90">Podrán volver a desafiarse nuevamente a partir de mañana.</p>
            </div>
          </div>
        ) : isPlaying ? (
          <div className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>En partida en este momento</span>
          </div>
        ) : isOffline ? (
          <div className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold text-center">
            <span>Jugador desconectado</span>
          </div>
        ) : !isCompatible ? (
          <div className="space-y-1.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 leading-snug flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">Niveles incompatibles</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-300">
                  Diferencia mayor a ±1 módulo (Mód. {userMaxModule} vs Mód. {targetModule}).
                </p>
              </div>
            </div>
            <button
              disabled
              title={compatibility.reason}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200 dark:border-slate-700"
            >
              <Swords className="w-3.5 h-3.5 opacity-50" />
              <span>Desafío no disponible</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onChallenge(player)}
            disabled={cannotChallenge}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <Swords className="w-4 h-4" />
            <span>⚔️ Desafiar</span>
          </button>
        )}
      </div>

    </div>
  );
};
