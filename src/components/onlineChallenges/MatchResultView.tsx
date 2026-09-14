import React from 'react';
import { MatchResult, StudentProfile } from '../../types/onlineChallenge';
import {
  Trophy,
  CheckCircle2,
  RotateCcw,
  Flame,
  HelpCircle
} from 'lucide-react';

interface MatchResultViewProps {
  result: MatchResult;
  userProfile: StudentProfile;
  currentStreak: number;
  onRematch?: () => void;
  canRematch?: boolean;
  onBackToLobby: () => void;
  onGoToRanking: () => void;
}

export const MatchResultView: React.FC<MatchResultViewProps> = ({
  result,
  userProfile,
  currentStreak,
  onRematch,
  canRematch = true,
  onBackToLobby,
  onGoToRanking
}) => {
  const isUserWinner = result.winnerId === 'user';
  const isTie = result.isTie;
  const isRivalWinner = !isUserWinner && !isTie;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Banner Principal de Resultado */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden text-center space-y-4 ${
        isUserWinner
          ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-orange-500/25'
          : isTie
          ? 'bg-gradient-to-br from-slate-700 via-indigo-900 to-slate-900 shadow-indigo-500/20'
          : 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 shadow-rose-950/30'
      }`}>
        
        {/* Confetti or Trophy icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-inner animate-bounce">
          {isUserWinner ? '🏆' : isTie ? '🤝' : '💪'}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-black/20 text-white/90 inline-block">
            {isUserWinner ? '¡Victoria!' : isTie ? '¡Empate Técnico!' : 'Desafío Finalizado'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {isUserWinner
              ? '🏆 ¡Ganaste!'
              : isTie
              ? '🤝 ¡Empate!'
              : `💪 ¡Buen desafío!`}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            {isUserWinner
              ? `Superaste a ${result.rival.firstName} y te llevás el pozo de XP.`
              : isTie
              ? `¡Duelo igualado! Ambos obtuvieron el mismo resultado. Se devolvió la apuesta intacta.`
              : `Esta vez ganó ${result.rival.firstName}. ¡A seguir practicando para la revancha!`}
          </p>

          {/* Motivo del Resultado / Desempate */}
          <div className="pt-1">
            {isUserWinner && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/25 border border-white/20 text-white text-xs font-medium">
                {result.userCorrectCount > result.rivalCorrectCount
                  ? `🎯 Motivo de victoria: Mayor cantidad de aciertos (${result.userCorrectCount}/10 vs ${result.rivalCorrectCount}/10)`
                  : `⚡ Motivo de victoria: Menor tiempo acumulado (${formatTime(result.userTimeSeconds)} vs ${formatTime(result.rivalTimeSeconds)})`}
              </span>
            )}

            {isRivalWinner && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/25 border border-white/20 text-white text-xs font-medium">
                {result.rivalCorrectCount > result.userCorrectCount
                  ? `🎯 Motivo: ${result.rival.firstName} obtuvo más aciertos (${result.rivalCorrectCount}/10 vs ${result.userCorrectCount}/10)`
                  : `⚡ Motivo: ${result.rival.firstName} respondió en menor tiempo (${formatTime(result.rivalTimeSeconds)} vs ${formatTime(result.userTimeSeconds)})`}
              </span>
            )}

            {isTie && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/25 border border-white/20 text-white text-xs font-medium">
                {`🤝 Motivo: Mismos aciertos (${result.userCorrectCount}/10) y mismo tiempo total (${formatTime(result.userTimeSeconds)})`}
              </span>
            )}
          </div>
        </div>

        {/* Streak Pill */}
        {isUserWinner && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/30 border border-white/20 text-amber-200 text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>Racha activa: {currentStreak} {currentStreak === 1 ? 'victoria' : 'victorias'} consecutivas</span>
          </div>
        )}

      </div>

      {/* Tarjetas Comparativas de Jugadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Tarjeta Alumno (Usuario) */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isUserWinner
            ? 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-500/60 shadow-lg ring-2 ring-amber-400/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
                🧑‍💻
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{userProfile.firstName} {userProfile.lastName}</span>
                  {isUserWinner && <span className="text-xs">🥇</span>}
                </p>
                <p className="text-[11px] text-slate-400">
                  {userProfile.school}
                </p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
              result.xpDelta > 0
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : result.xpDelta < 0
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
              {result.xpDelta > 0 ? `+${result.xpDelta * 2} XP (Neto +${result.xpDelta})` : result.xpDelta < 0 ? `${result.xpDelta} XP` : '0 XP (Devuelto)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Puntaje</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {result.userScore.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Aciertos</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {result.userCorrectCount}/10
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tiempo</span>
              <p className="text-lg font-black text-slate-700 dark:text-slate-300 font-mono">
                {formatTime(result.userTimeSeconds)}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta Rival */}
        <div className={`p-5 rounded-3xl border transition-all ${
          isRivalWinner
            ? 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-500/60 shadow-lg ring-2 ring-amber-400/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-600/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
                {result.rival.avatar || '👨‍💻'}
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{result.rival.firstName} {result.rival.lastName}</span>
                  {isRivalWinner && <span className="text-xs">🥇</span>}
                </p>
                <p className="text-[11px] text-slate-400">
                  {result.rival.school} · {result.rival.course}
                </p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
              isRivalWinner
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : isTie
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
            }`}>
              {isRivalWinner ? `+${result.betXp * 2} XP` : isTie ? '0 XP' : `-${result.betXp} XP`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Puntaje</span>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {result.rivalScore.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Aciertos</span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {result.rivalCorrectCount}/10
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tiempo</span>
              <p className="text-lg font-black text-slate-700 dark:text-slate-300 font-mono">
                {formatTime(result.rivalTimeSeconds)}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Información de Errores Pedagógica (Feedback Educativo) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <HelpCircle className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Información de errores y repaso
          </h2>
        </div>

        {result.userMistakes.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">¡Puntaje perfecto de respuestas!</p>
              <p>Respondiste correctamente las 10 preguntas del desafío. ¡Excelente dominio de los fundamentos de Python!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Revisá las preguntas en las que te equivocaste para aprender la explicación correcta:
            </p>

            <div className="space-y-3">
              {result.userMistakes.map((mistake, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                const userOptionText = mistake.question.options[mistake.userSelectedOption] || 'Sin respuesta';
                const hasCorrectAnswer = mistake.question.correctAnswer !== undefined;

                return (
                  <div
                    key={mistake.question.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {idx + 1}. {mistake.question.question}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 flex-shrink-0">
                        {mistake.question.categoryLabel || mistake.question.topic}
                      </span>
                    </div>

                    {mistake.question.codeSnippet && (
                      <pre className="p-2.5 rounded-xl bg-slate-950 text-sky-300 font-mono text-[11px] overflow-x-auto">
                        {mistake.question.codeSnippet}
                      </pre>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                        <span className="font-bold block text-[10px] uppercase opacity-80">Tu respuesta:</span>
                        <span>{letters[mistake.userSelectedOption]}) {userOptionText} ❌</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        <span className="font-bold block text-[10px] uppercase opacity-80">Resultado:</span>
                        <span>
                          {hasCorrectAnswer
                            ? `${letters[mistake.question.correctAnswer!]} ✅`
                            : 'Marcada como incorrecta por el servidor'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">💡 Recomendación pedagógica:</strong>
                      {mistake.question.explanation
                        ? mistake.question.explanation
                        : `Repasá los contenidos del Módulo ${mistake.question.moduleId} (${mistake.question.topic}) para dominar este concepto.`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Botones de Navegación Final */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onBackToLobby}
          className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
        >
          Volver a la sala
        </button>

        {canRematch && onRematch && (
          <button
            onClick={onRematch}
            className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>⚔️ Revancha</span>
          </button>
        )}

        <button
          onClick={onGoToRanking}
          className="w-full sm:w-auto flex-1 py-3.5 px-5 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Trophy className="w-4 h-4 text-amber-400 dark:text-amber-600" />
          <span>Ver ranking</span>
        </button>
      </div>

    </div>
  );
};
