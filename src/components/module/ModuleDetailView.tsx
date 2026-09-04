import React, { useState } from 'react';
import { CourseModule } from '../../types/course';
import { useProgress } from '../../context/ProgressContext';
import { TheorySection } from './TheorySection';
import { QuizSection } from './QuizSection';
import { ExerciseSection } from './ExerciseSection';
import { ChallengeSection } from './ChallengeSection';
import { ModuleSummaryModal } from './ModuleSummaryModal';
import {
  BookOpen,
  HelpCircle,
  Code2,
  Trophy,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface ModuleDetailViewProps {
  module: CourseModule;
  onBack: () => void;
  onSelectModule: (moduleNum: number) => void;
}

type TabType = 'theory' | 'quiz' | 'exercises' | 'challenge' | 'summary';

export const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({
  module,
  onBack,
  onSelectModule
}) => {
  const { progress, completeModule } = useProgress();
  const [activeTab, setActiveTab] = useState<TabType>('theory');

  const isCompleted = progress.completedModules.includes(module.number);

  // Check if all exercises are done to allow completing the module
  const exercisesDone = module.exercises.length === 0 ||
    module.exercises.every(e => progress.completedExercises.includes(e.id));

  const handleProceedToSummary = () => {
    // Automatically mark module completed if not already done
    completeModule(module.number);
    setActiveTab('summary');
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'theory', label: '1. Teoría', icon: BookOpen },
    { id: 'quiz', label: '2. Quiz', icon: HelpCircle, badge: `${module.quiz.length}` },
    ...(module.exercises.length > 0 ? [{ id: 'exercises' as TabType, label: '3. Práctica', icon: Code2, badge: `${module.exercises.length}` }] : []),
    ...(module.optionalChallenge ? [{ id: 'challenge' as TabType, label: '4. Desafío', icon: Trophy, badge: `+${module.optionalChallenge.bonusXp} XP` }] : []),
    { id: 'summary', label: 'Resumen', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver a los módulos"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              {module.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-python-blue dark:text-sky-400 uppercase tracking-wider">
                  Módulo {module.number}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ⏱️ {module.estimatedTime}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Completado
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {module.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Quick button to complete module if all exercises are done */}
        {exercisesDone && !isCompleted && activeTab !== 'summary' && (
          <button
            onClick={handleProceedToSummary}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Finalizar Módulo (+100 XP)</span>
          </button>
        )}

      </div>

      {/* Subtitle description */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
        {module.subtitle}
      </p>

      {/* Step Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-python-blue text-white border-python-blue shadow-md dark:bg-sky-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'theory' && (
          <TheorySection
            theory={module.theory}
            onProceedToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizSection
            questions={module.quiz}
            moduleId={module.number}
            onProceedToExercises={() => {
              if (module.exercises.length > 0) {
                setActiveTab('exercises');
              } else if (module.optionalChallenge) {
                setActiveTab('challenge');
              } else {
                handleProceedToSummary();
              }
            }}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseSection
            exercises={module.exercises}
            moduleId={module.number}
            onProceedToChallenge={module.optionalChallenge ? () => setActiveTab('challenge') : undefined}
            onProceedToSummary={handleProceedToSummary}
          />
        )}

        {activeTab === 'challenge' && module.optionalChallenge && (
          <ChallengeSection
            challenge={module.optionalChallenge}
            moduleId={module.number}
            onProceedToSummary={handleProceedToSummary}
          />
        )}

        {activeTab === 'summary' && (
          <ModuleSummaryModal
            module={module}
            onContinueNext={() => onSelectModule(module.number + 1)}
            onReviewModule={() => setActiveTab('theory')}
            onBackToCourse={onBack}
          />
        )}
      </div>

    </div>
  );
};
