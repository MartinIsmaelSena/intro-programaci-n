import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ALL_MODULES, isModuleUnlocked } from '../../data/modulesList';
import { calculateLevel, ALL_BADGES } from '../../data/badges';
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  Star,
  ArrowRight,
  Flame,
  Lock,
  Play,
  Sparkles,
  Lightbulb,
  FileText,
  Rocket,
  Trophy
} from 'lucide-react';

interface DashboardViewProps {
  onSelectModule: (moduleNumber: number) => void;
  onNavigate: (view: any) => void;
}

const MOTIVATIONAL_QUOTES = [
  '🔥 Cada línea de código que escribes te acerca un paso más a pensar como programador.',
  '💡 Equivocarse es la forma número uno en que los programadores aprenden cosas nuevas.',
  '🧠 No busques memorizar sintaxis. Lo importante es entender la lógica que hay detrás.',
  '🚀 La constancia diaria de 15 minutos supera a horas de estudio aisladas.',
  '✨ Python fue diseñado para ser legible, claro y divertido. ¡Disfrutá del camino!'
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectModule,
  onNavigate
}) => {
  const { progress } = useProgress();

  const totalModules = ALL_MODULES.length;
  const completedCount = progress.completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const completedExercisesCount = progress.completedExercises.length;
  const correctQuestionsCount = Object.values(progress.answeredQuestions).filter(q => q.isCorrect).length;
  const unlockedBadgesCount = progress.unlockedBadges.length;
  const currentLevel = calculateLevel(progress.xp);

  // Find next module to continue
  const nextModule = ALL_MODULES.find(m => !progress.completedModules.includes(m.number)) || ALL_MODULES[ALL_MODULES.length - 1];

  // Pick quote based on day or random
  const quote = MOTIVATIONAL_QUOTES[progress.streakDays % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-python-blue-dark via-python-blue to-sky-600 text-white p-6 sm:p-8 shadow-xl shadow-python-blue/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-sky-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Estás aprendiendo Python con éxito</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            👋 ¡Hola, {progress.userName || 'Estudiante'}!
          </h1>

          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            Te damos la bienvenida a tu panel principal. Tu aventura para convertirte en programador continúa hoy.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-sky-200">
            <Lightbulb className="w-4 h-4 text-python-yellow flex-shrink-0" />
            <span className="italic">{quote}</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 text-9xl opacity-15 select-none pointer-events-none">
          🐍
        </div>
      </div>

      {/* Progress & Next Step Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Progress Card (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tu progreso general en el curso
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {completedCount} de {totalModules} módulos completados
                </p>
              </div>
              <span className="text-2xl font-black text-python-blue dark:text-sky-400">
                {progressPercent}%
              </span>
            </div>

            {/* Custom Visual Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-python-blue via-sky-500 to-python-yellow transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* ASCII style progress indicator */}
            <div className="mt-3 font-mono text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Nivel inicial: 🌱</span>
              <span className="tracking-wider">
                {'█'.repeat(Math.round(progressPercent / 10))}
                {'░'.repeat(10 - Math.round(progressPercent / 10))}
              </span>
              <span>Meta: 🐍 Pythonista</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Nivel actual: <strong className="text-slate-800 dark:text-slate-200">{currentLevel.title}</strong>
            </span>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-python-blue dark:text-sky-400 hover:underline"
            >
              Ver reporte detallado →
            </button>
          </div>
        </div>

        {/* Hero "Continuar aprendiendo" Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-python-blue text-white p-6 shadow-lg shadow-indigo-500/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-python-yellow" />
              <span>Siguiente lección</span>
            </div>

            <div>
              <span className="text-xs text-indigo-200 font-medium">Módulo {nextModule.number}</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {nextModule.title}
              </h3>
            </div>

            <p className="text-xs text-indigo-100 line-clamp-2 leading-relaxed">
              {nextModule.description}
            </p>
          </div>

          <button
            onClick={() => onSelectModule(nextModule.number)}
            className="mt-6 w-full py-3 px-4 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <span>Continuar aprendiendo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Stat 1: Módulos */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-python-blue/40 transition-colors">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-semibold">Módulos</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {completedCount} <span className="text-xs font-normal text-slate-400">/ 14</span>
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Completados</span>
        </div>

        {/* Stat 2: Ejercicios */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Ejercicios</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {completedExercisesCount}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Resueltos</span>
        </div>

        {/* Stat 3: Preguntas */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-violet-500/40 transition-colors">
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Quizzes</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {correctQuestionsCount}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Preguntas acertadas</span>
        </div>

        {/* Stat 4: Insignias */}
        <div 
          onClick={() => onNavigate('badges')}
          className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-amber-500/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold">Insignias</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {unlockedBadgesCount} <span className="text-xs font-normal text-slate-400">/ {ALL_BADGES.length}</span>
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Ver galería →</span>
        </div>

        {/* Stat 5: XP */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:border-yellow-500/40 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
            <Star className="w-4 h-4" />
            <span className="text-xs font-semibold">Experiencia</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {progress.xp}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Puntos XP</span>
        </div>

      </div>

      {/* Block Exams Callout Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-python-blue text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider text-sky-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Evaluación Continua</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            📝 Exámenes Modulares por Bloques
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Valida tus conocimientos cada 2 o 3 módulos consecutivos con exámenes prácticos de 40 minutos (Teoría, Tracing, Debugging, Código e Integrador).
          </p>
        </div>

        <button
          onClick={() => onNavigate('exams')}
          className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all flex-shrink-0 self-start sm:self-auto"
        >
          <span>Ir a Exámenes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Python Challenges & Monthly Ranking Callout Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/15 text-[11px] font-bold uppercase tracking-wider text-amber-100">
            <Rocket className="w-3.5 h-3.5" />
            <span>Resolución de Problemas y Lógica</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            🚀 Desafíos de Python & Alumnos del Mes
          </h3>
          <p className="text-xs sm:text-sm text-amber-50 max-w-xl">
            Enfrenta problemas de lógica comercial con tiempo límite de 40 minutos, demuestra tus habilidades y compite sanamente en el podio mensual.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('challenges')}
            className="py-3 px-5 rounded-2xl bg-white hover:bg-amber-50 text-orange-700 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Ver Desafíos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('ranking')}
            className="py-3 px-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Top 5</span>
          </button>
        </div>
      </div>

      {/* Modules Quick Catalog */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              📚 Todos los módulos del curso
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Avanza en secuencia para desbloquear los siguientes conocimientos
            </p>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs sm:text-sm font-semibold text-python-blue dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Ver mapa interactivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_MODULES.map(m => {
            const isCompleted = progress.completedModules.includes(m.number);
            const isUnlocked = isModuleUnlocked(m.number, progress.completedModules);

            return (
              <div
                key={m.id}
                onClick={() => {
                  if (isUnlocked) onSelectModule(m.number);
                }}
                className={`group relative rounded-2xl p-5 border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/40 hover:shadow-md cursor-pointer'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-python-blue dark:hover:border-sky-500 hover:shadow-md cursor-pointer'
                    : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-2xl">{m.icon}</span>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Completado
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                        <Play className="w-3 h-3 fill-sky-600" />
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  MÓDULO {m.number}
                </span>

                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-python-blue dark:group-hover:text-sky-400 transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>⏱️ {m.estimatedTime}</span>
                  <span>{m.exercises.length} ejercicios</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
