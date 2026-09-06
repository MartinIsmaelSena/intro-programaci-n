import React, { useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { FeatureAnnouncement } from './announcementsConfig';

interface FeatureAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  announcement: FeatureAnnouncement;
}

export const FeatureAnnouncementModal: React.FC<FeatureAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onAction,
  announcement
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Cerrar al presionar la tecla Escape y controlar el foco
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Foco automático suave en el botón de cierre para accesibilidad
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      aria-describedby="announcement-desc"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center overflow-hidden transition-all transform duration-200 scale-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Resplandor decorativo de fondo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón de cierre X accesible */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Cerrar anuncio"
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenido desplazable para pantallas pequeñas / celulares */}
        <div className="overflow-y-auto px-5 sm:px-8 pt-6 pb-6 space-y-3.5">
          
          {/* Ícono de espadas cruzadas / cabecera */}
          {announcement.topIconImageSrc && (
            <div className="flex justify-center pt-1">
              <img
                src={announcement.topIconImageSrc}
                alt="Icono del modo"
                className="w-20 h-14 sm:w-24 sm:h-16 object-contain select-none drop-shadow-sm"
              />
            </div>
          )}

          {/* Títulos */}
          <div className="space-y-1">
            {announcement.tag && (
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {announcement.tag}
              </h3>
            )}

            {announcement.titleHighlight && (
              <h2
                id="announcement-title"
                className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent tracking-tight"
              >
                {announcement.titleHighlight}
              </h2>
            )}
          </div>

          {/* Texto explicativo */}
          <p
            id="announcement-desc"
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed px-2"
          >
            {announcement.description}
          </p>

          {/* Imagen ilustrada principal (sin deformación, contain) */}
          {announcement.bannerImageSrc && (
            <div className="w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 p-1 my-1">
              <img
                src={announcement.bannerImageSrc}
                alt={announcement.bannerAlt || 'Anuncio de funcionalidad'}
                className="w-full max-h-48 sm:max-h-56 object-contain mx-auto rounded-xl select-none"
              />
            </div>
          )}

          {/* 4 Píldoras / Beneficios destacados */}
          {announcement.features && announcement.features.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {announcement.features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl ${feat.iconBgClass} transition-all text-center`}
                  >
                    <div className="p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-1.5">
                      <IconComponent className={`w-4 h-4 ${feat.iconColorClass}`} />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                      {feat.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Botón de Acción Principal */}
          <div className="pt-2">
            <button
              onClick={onAction}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{announcement.primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
