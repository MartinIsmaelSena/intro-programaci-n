import React, { useState, useRef } from 'react';
import { Player, StudentProfile } from '../../types/onlineChallenge';
import {
  simulateInvitationResponse,
  isRealtimeModeActive,
  supabaseSendChallengeInvitation
} from '../../services/onlineChallengesService';
import { getModuleTopicName, getMaxAllowedMatchModule } from '../../utils/onlineProgressUtils';
import { Swords, Coins, Clock, BrainCircuit, X, AlertCircle, XCircle, Loader2, BookOpen } from 'lucide-react';

interface ChallengeInviteModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
  userXp: number;
  onChallengeAccepted: (player: Player, betXp: number, matchId?: string, isRealMatch?: boolean) => void;
  challengerProfile?: StudentProfile | null;
  userMaxModule?: number;
}

const BET_OPTIONS = [10, 25, 50, 100];

export const ChallengeInviteModal: React.FC<ChallengeInviteModalProps> = ({
  player,
  isOpen,
  onClose,
  userXp,
  onChallengeAccepted,
  challengerProfile,
  userMaxModule = 1
}) => {
  const [selectedBet, setSelectedBet] = useState<number>(50);
  const [inviteState, setInviteState] = useState<'selecting' | 'sending' | 'rejected'>('selecting');
  const [forceResult, setForceResult] = useState<'auto' | 'accept' | 'reject'>('auto');
  const [rejectReason, setRejectReason] = useState<string | null>(null);
  const cancelRef = useRef<(() => Promise<void>) | null>(null);

  const oppMaxModule = player?.maxCompletedModule || 1;
  const oppTopic = player?.levelTopic || getModuleTopicName(oppMaxModule);
  const allowedMaxModule = getMaxAllowedMatchModule(userMaxModule, oppMaxModule);
  const allowedTopic = getModuleTopicName(allowedMaxModule);

  if (!isOpen || !player) return null;

  const handleSendChallenge = async () => {
    if (userXp < selectedBet) return;

    setInviteState('sending');
    setRejectReason(null);

    // Flujo Realtime: Jugador real en línea vía Supabase
    if (isRealtimeModeActive() && player.isRealPlayer && challengerProfile && (player.sessionId || player.id)) {
      try {
        const { waitForResponse, cancel } = await supabaseSendChallengeInvitation(
          player.sessionId || player.id,
          selectedBet,
          challengerProfile
        );
        cancelRef.current = cancel;

        const resp = await waitForResponse();
        cancelRef.current = null;

        if (resp.accepted && resp.matchId) {
          onChallengeAccepted(player, selectedBet, resp.matchId, true);
        } else {
          setRejectReason(resp.reason || 'El contrincante rechazó el desafío.');
          setInviteState('rejected');
        }
      } catch (err: any) {
        console.error('Error al enviar invitación en tiempo real:', err);
        setRejectReason(err?.message || 'No se pudo conectar con el rival.');
        setInviteState('rejected');
      }
      return;
    }

    // Flujo Mock / Simulado (Fase 1)
    let willAccept = true;
    if (forceResult === 'reject') {
      willAccept = false;
    } else if (forceResult === 'accept') {
      willAccept = true;
    } else {
      const resp = await simulateInvitationResponse(player.accuracyRate ? 0.85 : 0.8);
      willAccept = resp.accepted;
    }

    if (forceResult !== 'auto') {
      // Breve pausa para efecto de red
      await new Promise(r => setTimeout(r, 1200));
    }

    if (willAccept) {
      onChallengeAccepted(player, selectedBet, undefined, false);
    } else {
      setRejectReason(`${player.firstName} no puede jugar en este momento o rechazó la partida.`);
      setInviteState('rejected');
    }
  };

  const handleCancelSending = async () => {
    if (cancelRef.current) {
      await cancelRef.current().catch(() => {});
      cancelRef.current = null;
    }
    handleReset();
  };

  const handleReset = () => {
    setInviteState('selecting');
    setRejectReason(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
        
        {inviteState !== 'sending' && (
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {inviteState === 'selecting' && (
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5" />
                <span>Desafío 1v1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>⚔️ Desafiar a</span>
                <span className="text-rose-600 dark:text-rose-400">{player.firstName} {player.lastName}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {player.school} · {player.course}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                  🧠 Nivel: {oppTopic} (Módulo {oppMaxModule})
                </span>
              </div>
            </div>

            {/* Apuesta de XP */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tu XP disponible:
                </span>
                <span className="text-sm font-black text-amber-600 dark:text-yellow-400 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  {userXp} XP
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  Elegí cuánto XP querés apostar:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BET_OPTIONS.map(amount => {
                    const canAfford = userXp >= amount;
                    const isSelected = selectedBet === amount;

                    return (
                      <button
                        key={amount}
                        type="button"
                        disabled={!canAfford}
                        onClick={() => setSelectedBet(amount)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25 scale-102'
                            : canAfford
                            ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border-dashed border-slate-200 dark:border-slate-700/50 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-0.5">
                          <span>🪙</span>
                          <span>{amount}</span>
                        </div>
                        <span className="text-[9px] block uppercase font-normal opacity-80 mt-0.5">XP</span>
                      </button>
                    );
                  })}
                </div>

                {userXp < 10 && (
                  <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Necesitás al menos 10 XP para apostar. Resolvé ejercicios o quizzes en el curso.
                  </p>
                )}
              </div>
            </div>

            {/* Resumen del Duelo */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Apuesta seleccionada:</span>
                <span className="font-extrabold text-amber-600 dark:text-yellow-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-yellow-500" />
                  {selectedBet} XP
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Premio para el ganador:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  🏆 {selectedBet * 2} XP
                </span>
              </div>
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Contenidos del desafío:</span>
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Hasta Módulo {allowedMaxModule} ({allowedTopic})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-rose-500" />
                    <span>10 preguntas adaptadas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Sin límite general</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Simulation selector */}
            <div className="flex items-center justify-between px-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Simulación de respuesta:</span>
              <select
                value={forceResult}
                onChange={e => setForceResult(e.target.value as any)}
                className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="auto">Automática (~85% acepta)</option>
                <option value="accept">Forzar Aceptación ✓</option>
                <option value="reject">Forzar Rechazo ❌</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={userXp < selectedBet}
                onClick={handleSendChallenge}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
              >
                <Swords className="w-4 h-4" />
                <span>Enviar desafío</span>
              </button>
            </div>
          </div>
        )}

        {inviteState === 'sending' && (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                📨 ¡Desafío enviado!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Esperando la respuesta de <strong>{player.firstName} {player.lastName}</strong>...
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 inline-block">
              🪙 Apuesta: <strong>{selectedBet} XP</strong> · ⚔️ 10 preguntas (hasta Módulo {allowedMaxModule})
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancelSending}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar invitación
              </button>
            </div>
          </div>
        )}

        {inviteState === 'rejected' && (
          <div className="py-6 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-rose-600 dark:text-rose-400">
                ❌ Desafío rechazado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {rejectReason || `${player.firstName} no puede jugar en este momento o rechazó la partida.`}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
              ✓ Tu apuesta de <strong>{selectedBet} XP</strong> no fue descontada.
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 px-5 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                Volver a la sala
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
