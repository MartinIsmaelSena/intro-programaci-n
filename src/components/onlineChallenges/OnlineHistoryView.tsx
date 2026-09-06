import React from 'react';
import { getStoredMatchHistory, getTodayDateString } from '../../services/onlineChallengesService';
import { History } from 'lucide-react';

export const OnlineHistoryView: React.FC = () => {
  const history = getStoredMatchHistory();
  const today = getTodayDateString();

  const formatRelativeDate = (isoDate: string) => {
    try {
      const matchDay = isoDate.split('T')[0];
      if (matchDay === today) return 'Hoy';

      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];
      if (matchDay === yesterday) return 'Ayer';

      const d = new Date(isoDate);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    } catch {
      return 'Reciente';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-6 h-6 text-rose-500" />
          <span>📜 Mis desafíos</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Historial completo de partidas 1v1 disputadas en la plataforma.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-2xl">
            ⚔️
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Aún no has disputado ningún desafío
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Elegí a un rival disponible en la sala, fijá tu apuesta de XP y poné a prueba tus conocimientos.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Rival</th>
                  <th className="py-3.5 px-4 sm:px-6">Resultado</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Puntaje</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">XP</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map(match => {
                  const isWin = match.winnerId === 'user';
                  const isTie = match.isTie;

                  return (
                    <tr key={match.matchId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Rival */}
                      <td className="py-3.5 px-4 sm:px-6 font-extrabold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{match.rival.avatar || '👨‍💻'}</span>
                          <div>
                            <span>{match.rival.firstName} {match.rival.lastName}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {match.rival.school}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Resultado */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {isWin ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                            <span>🏆</span>
                            <span>Victoria</span>
                          </span>
                        ) : isTie ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
                            <span>🤝</span>
                            <span>Empate</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                            <span>❌</span>
                            <span>Derrota</span>
                          </span>
                        )}
                      </td>

                      {/* Puntaje */}
                      <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {match.userScore} <span className="text-slate-400 font-normal text-xs">vs {match.rivalScore}</span>
                      </td>

                      {/* XP */}
                      <td className="py-3.5 px-4 sm:px-6 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          match.xpDelta > 0
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : match.xpDelta < 0
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {match.xpDelta > 0 ? `+${match.xpDelta * 2}` : match.xpDelta < 0 ? `${match.xpDelta}` : '0'} XP
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 sm:px-6 text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatRelativeDate(match.date)}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
