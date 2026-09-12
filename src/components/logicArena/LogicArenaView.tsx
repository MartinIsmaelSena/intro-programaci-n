import React, { useState, useEffect } from 'react';
import { useProgress } from '../../context/ProgressContext';
import {
  LogicCategory,
  LogicArenaQuestion,
  LogicArenaProgress,
  LogicRoundSummary
} from '../../types/logicArena';
import {
  getLogicArenaProgress,
  recordLogicArenaAnswer,
  getRandomArenaRoundQuestions,
  getFilteredArenaQuestions
} from '../../services/logicArenaService';
import { LOGIC_ARENA_QUESTIONS } from '../../data/logicArenaQuestions';
import { LogicArenaRunner } from './LogicArenaRunner';
import { LogicArenaSummaryModal } from './LogicArenaSummaryModal';
import {
  Brain,
  Flame,
  Star,
  Trophy,
  Target,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Code2,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';

interface LogicArenaViewProps {
  onNavigate?: (view: any) => void;
}

interface CategoryCardMeta {
  id: LogicCategory;
  name: string;
  icon: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const CATEGORIES_DATA: CategoryCardMeta[] = [
  {
    id: 'comparisons',
    name: 'Comparaciones',
    icon: '⚖️',
    description: 'Menor, mayor, igual, distinto y comparaciones entre textos y números.',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50/70 dark:bg-blue-950/40',
    borderClass: 'border-blue-200 dark:border-blue-800/60'
  },
  {
    id: 'boolean_logic',
    name: 'Operadores Lógicos',
    icon: '🔀',
    description: 'Tablas de verdad con and, or y not para evaluar condiciones complejas.',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50/70 dark:bg-purple-950/40',
    borderClass: 'border-purple-200 dark:border-purple-800/60'
  },
  {
    id: 'variables',
    name: 'Variables y Nombres',
    icon: '📦',
    description: 'Reglas de identificadores válidos, palabras reservadas y buenas prácticas.',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60'
  },
  {
    id: 'reassignment',
    name: 'Reasignación en Memoria',
    icon: '🔄',
    description: 'Seguimiento del valor de variables que cambian a lo largo del programa.',
    colorClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50/70 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800/60'
  },
  {
    id: 'code_tracing',
    name: 'Trazado de Código',
    icon: '🖥️',
    description: 'Lectura de fragmentos y predicción de la salida exacta de print().',
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    bgClass: 'bg-indigo-50/70 dark:bg-indigo-950/40',
    borderClass: 'border-indigo-200 dark:border-indigo-800/60'
  },
  {
    id: 'error_detection',
    name: 'Detección de Errores',
    icon: '⚠️',
    description: 'Identificar errores de sintaxis (= vs ==), tipos incompatibles y comillas.',
    colorClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-50/70 dark:bg-rose-950/40',
    borderClass: 'border-rose-200 dark:border-rose-800/60'
  },
  {
    id: 'combined_logic',
    name: 'Lógica Combinada',
    icon: '🧩',
    description: 'Expresiones que integran comparaciones, precedencia y lógica booleana.',
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-50/70 dark:bg-cyan-950/40',
    borderClass: 'border-cyan-200 dark:border-cyan-800/60'
  }
];

export const LogicArenaView: React.FC<LogicArenaViewProps> = ({ onNavigate }) => {
  const { progress: userProgress, addXp, awardBadgeDirectly } = useProgress();
  const [arenaProgress, setArenaProgress] = useState<LogicArenaProgress>(() =>
    getLogicArenaProgress(userProgress.userName)
  );

  // Modo de práctica activo
  const [activeSession, setActiveSession] = useState<{
    questions: LogicArenaQuestion[];
    title: string;
    isRoundMode: boolean;
  } | null>(null);

  // Registro de la ronda actual
  const [roundStats, setRoundStats] = useState<{
    correctCount: number;
    incorrectCount: number;
    xpEarned: number;
    streakReached: number;
    unlockedBadgeIds: string[];
  }>({
    correctCount: 0,
    incorrectCount: 0,
    xpEarned: 0,
    streakReached: 0,
    unlockedBadgeIds: []
  });

  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  // Recargar estadísticas cuando el usuario cambia
  useEffect(() => {
    setArenaProgress(getLogicArenaProgress(userProgress.userName));
  }, [userProgress.userName]);

  // Iniciar ronda rápida de 10 preguntas
  const handleStartChallengeRound = () => {
    const questions = getRandomArenaRoundQuestions(10, 'all');
    setRoundStats({
      correctCount: 0,
      incorrectCount: 0,
      xpEarned: 0,
      streakReached: 0,
      unlockedBadgeIds: []
    });
    setActiveSession({
      questions,
      title: '🏆 Desafío de Lógica (10 Preguntas)',
      isRoundMode: true
    });
  };

  // Iniciar práctica de una categoría específica
  const handleStartCategoryTraining = (category: LogicCategory, categoryName: string) => {
    const questions = getFilteredArenaQuestions(category, 'all');
    if (questions.length === 0) return;
    setRoundStats({
      correctCount: 0,
      incorrectCount: 0,
      xpEarned: 0,
      streakReached: 0,
      unlockedBadgeIds: []
    });
    setActiveSession({
      questions,
      title: `Entrenamiento: ${categoryName}`,
      isRoundMode: false
    });
  };

  // Procesar respuesta enviada por el runner
  const handleAnswerSubmit = (question: LogicArenaQuestion, selectedOption: number) => {
    const res = recordLogicArenaAnswer(question, selectedOption, userProgress.userName);
    setArenaProgress(res.progress);

    // Otorgar XP al estudiante si acertó
    if (res.isCorrect && res.xpEarned > 0) {
      addXp(res.xpEarned);
    }

    // Otorgar insignias si se desbloquearon
    if (res.newlyUnlockedBadges.length > 0) {
      res.newlyUnlockedBadges.forEach(bId => awardBadgeDirectly(bId));
    }

    // Actualizar estadísticas de la sesión actual
    setRoundStats(prev => {
      const nextStreak = res.isCorrect ? prev.streakReached + 1 : prev.streakReached;
      return {
        correctCount: prev.correctCount + (res.isCorrect ? 1 : 0),
        incorrectCount: prev.incorrectCount + (res.isCorrect ? 0 : 1),
        xpEarned: prev.xpEarned + res.xpEarned,
        streakReached: Math.max(prev.streakReached, nextStreak),
        unlockedBadgeIds: [...new Set([...prev.unlockedBadgeIds, ...res.newlyUnlockedBadges])]
      };
    });

    return { isCorrect: res.isCorrect, xpEarned: res.xpEarned };
  };

  const handleFinishRound = () => {
    setSummaryModalOpen(true);
  };

  const handleRestartRound = () => {
    setSummaryModalOpen(false);
    handleStartChallengeRound();
  };

  const handleCloseSummary = () => {
    setSummaryModalOpen(false);
    setActiveSession(null);
  };

  // Si hay una sesión activa, renderizamos el runner interactivo
  if (activeSession) {
    return (
      <>
        <LogicArenaRunner
          questions={activeSession.questions}
          modeTitle={activeSession.title}
          isRoundMode={activeSession.isRoundMode}
          onAnswerSubmit={handleAnswerSubmit}
          onFinishRound={handleFinishRound}
          onExit={() => setActiveSession(null)}
        />
        <LogicArenaSummaryModal
          isOpen={summaryModalOpen}
          summary={
            activeSession.isRoundMode
              ? {
                  totalQuestions: activeSession.questions.length,
                  correctCount: roundStats.correctCount,
                  incorrectCount: roundStats.incorrectCount,
                  xpEarned: roundStats.xpEarned,
                  streakReached: roundStats.streakReached,
                  unlockedBadgeIds: roundStats.unlockedBadgeIds
                }
              : null
          }
          onClose={handleCloseSummary}
          onRestartRound={handleRestartRound}
        />
      </>
    );
  }

  const accuracy = arenaProgress.totalAnswered > 0
    ? Math.round((arenaProgress.totalCorrect / arenaProgress.totalAnswered) * 100)
    : 100;

  // Próxima insignia objetivo
  const nextBadgeGoal = arenaProgress.totalCorrect < 15
    ? { title: 'Erudito (15 aciertos)', target: 15, current: arenaProgress.totalCorrect }
    : arenaProgress.totalCorrect < 30
    ? { title: 'Maestro de la Lógica (30 aciertos)', target: 30, current: arenaProgress.totalCorrect }
    : null;

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto">
      
      {/* Hero Banner de la Arena de Lógica */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-900/20">
        
        {/* Resplandor decorativo */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-purple-200">
              <Brain className="w-3.5 h-3.5 text-purple-300" />
              <span>Entrenamiento de Razonamiento Puro</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>🧠 Arena de Lógica</span>
            </h1>

            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
              Poné a prueba tu capacidad analítica. Practicá comparaciones, operadores booleanos, reasignación y lectura de código paso a paso sin límite de intentos.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-purple-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {LOGIC_ARENA_QUESTIONS.length} preguntas de lógica y código
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Suma XP para tu nivel general
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-300" />
                Desbloquea insignias exclusivas
              </span>
            </div>
          </div>

          {/* Botón de acción principal: Ronda rápida de 10 preguntas */}
          <div className="flex-shrink-0 self-start md:self-auto">
            <button
              onClick={handleStartChallengeRound}
              className="py-4 px-6 rounded-2xl bg-white hover:bg-purple-50 text-purple-900 font-extrabold text-sm sm:text-base shadow-lg shadow-black/20 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-purple-900" />
              <span>Jugar Ronda (10 Preguntas)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tira de Estadísticas de la Arena */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Stat 1: Aciertos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Aciertos</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {arenaProgress.totalCorrect}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            de {arenaProgress.totalAnswered} intentos
          </span>
        </div>

        {/* Stat 2: Racha Actual */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Flame className="w-4 h-4 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Racha Actual</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {arenaProgress.currentStreak}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            consecutivas acertadas
          </span>
        </div>

        {/* Stat 3: Mejor Racha */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Mejor Racha</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {arenaProgress.bestStreak}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            récord histórico
          </span>
        </div>

        {/* Stat 4: Precisión */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Precisión</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {accuracy}%
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            efectividad global
          </span>
        </div>

      </div>

      {/* Próximo Objetivo de Insignia si aplica */}
      {nextBadgeGoal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-xl shadow-sm">
              🎓
            </div>
            <div>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
                Próxima Insignia en la Arena:
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {nextBadgeGoal.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((nextBadgeGoal.current / nextBadgeGoal.target) * 100))}%` }}
              />
            </div>
            <span className="text-xs font-black text-purple-700 dark:text-purple-300">
              {nextBadgeGoal.current}/{nextBadgeGoal.target}
            </span>
          </div>
        </div>
      )}

      {/* Sección: Entrenamiento Libre por Categorías */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              🎯 Entrenamiento Libre por Tema
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Elegí un concepto específico para concentrar tu práctica y pulir tu razonamiento:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES_DATA.map(cat => {
            const catStats = arenaProgress.categoryStats[cat.id] || { total: 0, correct: 0 };
            const qCount = LOGIC_ARENA_QUESTIONS.filter(q => q.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleStartCategoryTraining(cat.id, cat.name)}
                className={`group rounded-2xl p-5 border-2 transition-all duration-200 bg-white dark:bg-slate-900 hover:shadow-lg cursor-pointer flex flex-col justify-between ${cat.borderClass}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {qCount} ejercicios
                    </span>
                  </div>

                  <h3 className={`font-bold text-base transition-colors group-hover:${cat.colorClass}`}>
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Aciertos: <strong className="text-slate-700 dark:text-slate-200">{catStats.correct}</strong>
                  </span>
                  <span className={`font-bold inline-flex items-center gap-1 ${cat.colorClass}`}>
                    <span>Entrenar</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
