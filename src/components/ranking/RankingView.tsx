import React, { useState } from 'react';
import { INITIAL_MONTHLY_RANKING, sortRankingEntries } from '../../data/rankingData';
import { RankingEntry } from '../../types/challenge';
import { Trophy, Medal, Star, Clock, School, Calendar, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface RankingViewProps {
  onGoToChallenges: () => void;
}

export const RankingView: React.FC<RankingViewProps> = ({ onGoToChallenges }) => {
  const [period, setPeriod] = useState<'mes' | 'semana' | 'trimestre' | 'anio'>('mes');
  const sortedRanking = sortRankingEntries(INITIAL_MONTHLY_RANKING).slice(0, 5);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem < 10 ? `0${rem}` : rem}s`;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Trophy className="w-3.5 h-3.5" />
            <span>Cuadro de Honor</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            🏆 Alumnos del Mes
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-900/90 max-w-xl leading-relaxed">
            Reconocimiento a los estudiantes con mejor desempeño en los desafíos de programación y lógica en Python.
          </p>
        </div>

        {/* Period selector */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/40 shadow-sm flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2">Período:</span>
          <button
            onClick={() => setPeriod('mes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              period === 'mes'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Mes Actual
          </button>
          <button
            onClick={() => setPeriod('trimestre')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              period === 'trimestre'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Trimestre
          </button>
        </div>
      </div>

      {/* Motivational Message Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-sky-950 dark:text-sky-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>¿Querés aparecer entre los alumnos destacados?</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Resolvé los desafíos, mejorá tu lógica y superá tu propio resultado. El ranking premia la perseverancia y el razonamiento analítico.
          </p>
        </div>

        <button
          onClick={onGoToChallenges}
          className="py-3 px-5 rounded-2xl bg-python-blue hover:bg-python-blue-light text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all flex-shrink-0 self-start sm:self-auto"
        >
          <span>Ir a los Desafíos 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top 5 Ranking List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Top 5 de Participantes
          </h2>
          <span className="text-xs text-slate-400">
            Criterio: 1.º Mayor nota • 2.º Mayor puntaje • 3.º Menor tiempo
          </span>
        </div>

        <div className="space-y-3">
          {sortedRanking.map((student, index) => {
            const isGold = index === 0;
            const isSilver = index === 1;
            const isBronze = index === 2;

            return (
              <div
                key={student.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isGold
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50/60 dark:from-amber-950/40 dark:to-yellow-950/20 border-amber-300 dark:border-amber-700/60 shadow-md ring-1 ring-amber-300/50'
                    : isSilver
                    ? 'bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-900 dark:to-slate-850 border-slate-300 dark:border-slate-700 shadow-sm'
                    : isBronze
                    ? 'bg-gradient-to-r from-orange-50/50 to-amber-50/30 dark:from-orange-950/30 dark:to-slate-900 border-amber-200 dark:border-amber-900/50 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Left: Medal & Student info */}
                <div className="flex items-center gap-4">
                  
                  {/* Position Badge / Medal */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm flex-shrink-0 ${
                    isGold
                      ? 'bg-gradient-to-br from-amber-300 to-yellow-400 text-slate-950'
                      : isSilver
                      ? 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-900'
                      : isBronze
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-base'
                  }`}>
                    {isGold && '🥇'}
                    {isSilver && '🥈'}
                    {isBronze && '🥉'}
                    {!isGold && !isSilver && !isBronze && `⭐ ${index + 1}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {student.studentName} {student.studentLastName}
                      </h3>
                      {isGold && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                          Oro
                        </span>
                      )}
                      {isSilver && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          Plata
                        </span>
                      )}
                      {isBronze && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-950 text-orange-900 dark:text-orange-200 uppercase tracking-wider">
                          Bronce
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <School className="w-3.5 h-3.5" />
                        {student.school} — {student.course}
                      </span>
                      <span>•</span>
                      <span>{student.challengeTitle}</span>
                    </div>
                  </div>

                </div>

                {/* Right: Grade & Time */}
                <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(student.timeSpentSeconds)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Nota oficial</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {student.grade.toFixed(1).replace('.', ',')} <span className="text-xs font-normal text-slate-400">/ 10</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
