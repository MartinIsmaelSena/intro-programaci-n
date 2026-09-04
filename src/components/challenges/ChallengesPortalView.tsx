import React, { useState } from 'react';
import { ALL_CHALLENGES } from '../../data/challenges/challengesList';
import { PythonChallenge, ParticipantData } from '../../types/challenge';
import { ParticipantModal } from './ParticipantModal';
import { ChallengeRunnerView } from './ChallengeRunnerView';
import {
  Rocket,
  Clock,
  Code2,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Trophy,
  BrainCircuit
} from 'lucide-react';

interface ChallengesPortalViewProps {
  onViewRanking: () => void;
}

export const ChallengesPortalView: React.FC<ChallengesPortalViewProps> = ({ onViewRanking }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<PythonChallenge | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    challenge: PythonChallenge;
    participant: ParticipantData;
  } | null>(null);

  const handleStartClick = (challenge: PythonChallenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const handleParticipantConfirmed = (data: ParticipantData) => {
    if (selectedChallenge) {
      setModalOpen(false);
      setActiveSession({
        challenge: selectedChallenge,
        participant: data
      });
    }
  };

  if (activeSession) {
    return (
      <ChallengeRunnerView
        challenge={activeSession.challenge}
        participant={activeSession.participant}
        onExit={() => setActiveSession(null)}
        onViewRanking={() => {
          setActiveSession(null);
          onViewRanking();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/15 text-xs font-bold uppercase tracking-wider text-amber-100">
            <Rocket className="w-3.5 h-3.5" />
            <span>Resolución de Problemas Reales</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            🚀 Desafíos de Python
          </h1>

          <div className="text-xs sm:text-sm text-white/95 max-w-2xl leading-relaxed space-y-1.5">
            <p className="font-semibold">
              Poné a prueba tus habilidades. En los desafíos vas a enfrentarte a problemas de lógica que deberás resolver utilizando Python.
            </p>
            <p className="opacity-90">
              Tendrás un tiempo limitado para analizar el problema, pensar una solución y escribir tu programa.
            </p>
          </div>
        </div>

        <button
          onClick={onViewRanking}
          className="bg-white text-orange-700 hover:bg-orange-50 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all flex-shrink-0 self-start sm:self-auto"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Ver Alumnos del Mes 🏆</span>
        </button>
      </div>

      {/* Difference Callout: Exams vs Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-python-blue dark:text-sky-400 uppercase">
            <span>📝 Exámenes</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Evalúan contenidos específicos del plan de estudio organizados en bloques de 2 o 3 módulos correlativos (ej: Modelo N.º 1 para Módulos 1, 2 y 3).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
            <BrainCircuit className="w-4 h-4" />
            <span>🚀 Desafíos</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Evalúan principalmente <strong>lógica, razonamiento, resolución de problemas</strong> y tu capacidad práctica para aplicar Python en problemas reales combinados.
          </p>
        </div>

      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Desafíos disponibles</span>
        </h2>

        {ALL_CHALLENGES.map(challenge => (
          <div
            key={challenge.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-black">
                  {challenge.title}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  🟢 Disponible
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {challenge.shortDescription}
                </p>
              </div>

              {/* Attributes badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span><strong>⏱️ Tiempo:</strong> {challenge.durationMinutes} minutos</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Code2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span><strong>💻 Modalidad:</strong> {challenge.modality}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 sm:col-span-1">
                  <Target className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>🎯 Objetivo:</strong> {challenge.targetObjective}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => handleStartClick(challenge)}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Comenzar desafío →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extensibility placeholder */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Próximos lanzamientos
        </span>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Desafíos N.º 2 y N.º 3 en preparación
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Nuevos escenarios de simulación y cálculo algorítmico se habilitarán periódicamente para seguir poniendo a prueba tus habilidades.
        </p>
      </div>

      {/* Modal de Participante */}
      {selectedChallenge && (
        <ParticipantModal
          challenge={selectedChallenge}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onStart={handleParticipantConfirmed}
        />
      )}

    </div>
  );
};
