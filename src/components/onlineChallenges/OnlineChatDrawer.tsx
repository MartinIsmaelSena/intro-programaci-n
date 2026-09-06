import React, { useState } from 'react';
import { InMatchChatMessage } from '../../types/onlineChallenge';
import { MessageSquare, X } from 'lucide-react';

interface OnlineChatDrawerProps {
  messages: InMatchChatMessage[];
  onSendMessage: (textOrEmoji: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  opponentName: string;
}

export const PRESET_MESSAGES = [
  '😎 ¡Vamos!',
  '🔥 ¡Buenísima!',
  '😂 Jajaja',
  '😱 ¡Qué difícil!',
  '💪 ¡Puedo hacerlo!',
  '🤔 Estoy pensando...',
  '🎉 ¡Bien!',
  '😭 Nooo',
  '🧠 Buena respuesta',
  '👏 Muy bien'
];

export const PRESET_EMOJIS = [
  '😂', '🔥', '😎', '😱', '🎉', '💪', '🤔', '👏', '🐍', '🧠'
];

export const OnlineChatDrawer: React.FC<OnlineChatDrawerProps> = ({
  messages,
  onSendMessage,
  isOpen,
  onToggle,
  opponentName
}) => {
  const [activeTab, setActiveTab] = useState<'phrases' | 'emojis'>('phrases');

  const handleSend = (content: string) => {
    onSendMessage(content);
  };

  return (
    <div className="relative">
      {/* Floating Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
          isOpen
            ? 'bg-rose-600 text-white shadow-rose-600/30'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-400'
        }`}
        title="Abrir mensajes predeterminados"
      >
        <MessageSquare className="w-4 h-4 text-rose-500" />
        <span className="hidden sm:inline">💬 Mensajes</span>
        {messages.length > 0 && (
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </button>

      {/* Drawer Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-30 animate-fadeIn">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
              <span>💬 Mensajes de partida</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Live Message Bubble Display */}
          <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-xs scrollbar-thin">
            {messages.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center py-6">
                Enviá una reacción o frase a {opponentName}
              </p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-xs font-medium ${
                      msg.isUser
                        ? 'bg-rose-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="block text-[9px] opacity-75 font-semibold">
                      {msg.isUser ? 'Tú' : opponentName}
                    </span>
                    <span className="text-sm">{msg.content}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selector Tabs: Frases vs Emojis */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('phrases')}
              className={`flex-1 py-1 rounded-lg transition-colors ${
                activeTab === 'phrases'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Frases
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('emojis')}
              className={`flex-1 py-1 rounded-lg transition-colors ${
                activeTab === 'emojis'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Emojis
            </button>
          </div>

          {/* Quick Buttons */}
          {activeTab === 'phrases' ? (
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_MESSAGES.map(phrase => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleSend(phrase)}
                  className="py-1.5 px-2 rounded-xl text-left bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700/80 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors truncate"
                  title={phrase}
                >
                  {phrase}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 py-1">
              {PRESET_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleSend(emoji)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700/80 text-xl text-center hover:scale-115 transition-transform"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center">
            🔒 Solo frases predefinidas por seguridad y respeto escolar.
          </p>

        </div>
      )}
    </div>
  );
};
