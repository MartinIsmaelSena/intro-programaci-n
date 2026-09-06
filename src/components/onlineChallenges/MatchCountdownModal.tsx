import React, { useState, useEffect } from 'react';
import { Player, StudentProfile } from '../../types/onlineChallenge';
import { Swords } from 'lucide-react';

interface MatchCountdownModalProps {
  challenger: StudentProfile;
  opponent: Player;
  betXp: number;
  onCountdownFinished: () => void;
}

export const MatchCountdownModal: React.FC<MatchCountdownModalProps> = ({
  challenger,
  opponent,
  betXp,
  onCountdownFinished
}) => {
  const [count, setCount] = useState<number>(3);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 1 && !isStarting) {
      const timer = setTimeout(() => {
        setIsStarting(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isStarting) {
      const timer = setTimeout(() => {
        onCountdownFinished();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [count, isStarting, onCountdownFinished]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-lg text-center space-y-6">
        
        {/* Matchup Header */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-indigo-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-blue-500/30 text-white">
              🧑‍💻
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base text-white">
                {challenger.firstName} {challenger.lastName}
              </p>
              <p className="text-[11px] text-blue-200">
                {challenger.school}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 mx-auto animate-pulse">
              <Swords className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-rose-400 uppercase tracking-widest block">VS</span>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/40">
              🪙 {betXp} XP
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-orange-600 border-2 border-rose-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-rose-500/30 text-white">
              {opponent.avatar || '👨‍💻'}
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base text-white">
                {opponent.firstName} {opponent.lastName}
              </p>
              <p className="text-[11px] text-rose-200">
                {opponent.school}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Number / Start message */}
        <div className="py-6">
          {!isStarting ? (
            <div key={count} className="inline-block animate-ping text-7xl sm:text-8xl font-black bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 bg-clip-text text-transparent filter drop-shadow-lg">
              {count}
            </div>
          ) : (
            <div className="space-y-2 animate-bounce">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 uppercase tracking-tight filter drop-shadow-md">
                ⚔️ ¡COMIENZA EL DESAFÍO!
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                10 preguntas · Módulos 1 al 9 de Python
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
