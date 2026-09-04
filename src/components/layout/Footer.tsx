import React from 'react';

interface FooterProps {
  hidden?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ hidden = false }) => {
  if (hidden) return null;

  return (
    <footer className="w-full py-8 px-4 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto text-center transition-colors">
      <div className="max-w-7xl mx-auto space-y-1.5">
        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          © 2026 Ismael Sena. Todos los derechos reservados.
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Python desde Cero — Plataforma educativa profesional e interactiva
        </p>
      </div>
    </footer>
  );
};
