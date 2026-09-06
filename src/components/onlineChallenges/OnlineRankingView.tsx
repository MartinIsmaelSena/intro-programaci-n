import React, { useState, useEffect } from 'react';
import { LeaderboardPeriod, LeaderboardEntry } from '../../types/onlineChallenge';
import { getOnlineLeaderboard, getOnlineLeaderboardAsync } from '../../services/onlineChallengesService';
import { Trophy, Coins, Flame } from 'lucide-react';

export const OnlineRankingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wins' | 'xp'>('wins');
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('week');
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() =>
    getOnlineLeaderboard(selectedPeriod, activeTab)
  );

  useEffect(() => {
    let isCancelled = false;
    getOnlineLeaderboardAsync(selectedPeriod, activeTab).then(data => {
      if (!isCancelled && Array.isArray(data)) {
        setEntries(data);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [selectedPeriod, activeTab]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="text-xs font-black text-slate-500 dark:text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Ranking de Desafíos</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Clasificación general de estudiantes en duelos 1v1 de Python.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold self-start sm:self-auto">
          {(
            [
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: 'Esta semana' },
              { id: 'month', label: 'Este mes' },
              { id: 'all_time', label: 'Histórico' }
            ] as const
          ).map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPeriod(p.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedPeriod === p.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs: Ranking por Victorias vs Mayor XP Ganado */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 border border-slate-200 dark:border-slate-700/80">
        <button
          type="button"
          onClick={() => setActiveTab('wins')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'wins'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>👑 Campeón de la semana (Victorias)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('xp')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'xp'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-yellow-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>🪙 Mayor XP ganado</span>
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="py-14 px-6 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-4xl shadow-inner">
            🏆
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
              Aún no hay participantes en este ranking
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Disputá desafíos en la sala de jugadores para sumar victorias y ganar un lugar en la clasificación general.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Podio Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {entries.slice(0, 3).map((player, idx) => {
              const podiumOrder = idx === 0 ? 'order-1 md:order-2 md:-translate-y-2' : idx === 1 ? 'order-2 md:order-1' : 'order-3 md:order-3';
              const medal = idx === 0 ? '🥇 1.º lugar' : idx === 1 ? '🥈 2.º lugar' : '🥉 3.º lugar';
              const ringColor = idx === 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : idx === 1 ? 'border-slate-300' : 'border-amber-600/40';

              return (
                <div
                  key={player.playerId}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border text-center space-y-3 shadow-md relative transition-transform ${podiumOrder} ${ringColor} ${
                    player.isUser ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                  }`}
                >
                  {player.isUser && (
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      Tú
                    </span>
                  )}

                  <span className="text-xs font-black uppercase tracking-wider block text-amber-600 dark:text-amber-400">
                    {medal}
                  </span>

                  <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                    {player.avatar || '🧑‍💻'}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {player.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {player.school} · {player.course}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-4 text-xs">
                    {activeTab === 'wins' ? (
                      <div className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>{player.wins} victorias</span>
                      </div>
                    ) : (
                      <div className="font-black text-amber-600 dark:text-yellow-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span>+{player.xpWon} XP</span>
                      </div>
                    )}
                    <div className="text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span>Racha: {player.streak}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Tabla 4.° puesto en adelante */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Posiciones completas
              </span>
              <span className="text-xs text-slate-400">
                {entries.length} participantes registrados
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {entries.map(player => (
                <div
                  key={player.playerId}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    player.isUser
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 text-center flex-shrink-0">
                      {getRankBadge(player.rank)}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                      {player.avatar || '🧑‍💻'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                        <span>{player.fullName}</span>
                        {player.isUser && (
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-md">
                            Tú
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {player.school} · {player.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    {activeTab === 'wins' ? (
                      <div>
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center justify-end gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          {player.wins} victorias
                        </span>
                        <span className="text-[11px] text-slate-400">+{player.xpWon} XP</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-yellow-400 flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5 text-yellow-500" />
                          +{player.xpWon} XP
                        </span>
                        <span className="text-[11px] text-slate-400">{player.wins} victorias</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};
