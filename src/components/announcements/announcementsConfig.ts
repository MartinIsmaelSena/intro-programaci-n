import React from 'react';
import { Zap, Brain, Trophy, Users } from 'lucide-react';

export interface AnnouncementFeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  iconColorClass: string;
  iconBgClass: string;
}

export interface FeatureAnnouncement {
  id: string;
  tag?: string;
  titleHighlight?: string;
  description: string;
  bannerImageSrc?: string;
  bannerAlt?: string;
  topIconImageSrc?: string;
  features?: AnnouncementFeatureItem[];
  primaryButtonText: string;
  targetView?: string;
  active: boolean;
}

/**
 * Normaliza el identificador de usuario para generar claves de localStorage consistentes y seguras
 */
export function getAnnouncementStorageKey(announcementId: string, userName?: string): string {
  const sanitizedUser = (userName || 'anonymous')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos (Martín -> martin)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_');
  return `${announcementId}_seen_${sanitizedUser}`;
}

/**
 * Comprueba si un usuario específico ya vio el anuncio
 */
export function hasUserSeenAnnouncement(announcementId: string, userName?: string): boolean {
  try {
    const key = getAnnouncementStorageKey(announcementId, userName);
    return localStorage.getItem(key) === 'true';
  } catch (err) {
    console.error('Error comprobando estado de visualización de anuncio:', err);
    return false;
  }
}

/**
 * Registra que un usuario específico ya vio el anuncio
 */
export function markAnnouncementAsSeen(announcementId: string, userName?: string): void {
  try {
    const key = getAnnouncementStorageKey(announcementId, userName);
    localStorage.setItem(key, 'true');
  } catch (err) {
    console.error('Error guardando estado de visualización de anuncio:', err);
  }
}

/**
 * Configuración del anuncio oficial de Duelo 1 vs 1
 */
export const DUEL_1VS1_ANNOUNCEMENT: FeatureAnnouncement = {
  id: 'duelo_1vs1_announcement_v1',
  tag: '¡Nuevo modo de juego!',
  titleHighlight: 'Duelo 1 vs 1',
  description:
    'Ahora podés desafiar a otros estudiantes en partidas de 1 contra 1 y poner a prueba tus conocimientos de programación.',
  bannerImageSrc: '/img/duelo_1vs1_banner.png',
  bannerAlt: 'Duelo 1 vs 1 entre estudiantes en Python Academy',
  topIconImageSrc: '/img/duelo_1vs1_swords.png',
  features: [
    {
      icon: Zap,
      title: 'Desafíos en tiempo real',
      iconColorClass: 'text-amber-500',
      iconBgClass: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60'
    },
    {
      icon: Brain,
      title: 'Preguntas aleatorias',
      iconColorClass: 'text-purple-500',
      iconBgClass: 'bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60'
    },
    {
      icon: Trophy,
      title: 'Sumá puntos y subí en el ranking',
      iconColorClass: 'text-amber-600 dark:text-yellow-400',
      iconBgClass: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60'
    },
    {
      icon: Users,
      title: '¡Demostrá quién tiene más talento!',
      iconColorClass: 'text-blue-500',
      iconBgClass: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60'
    }
  ],
  primaryButtonText: '¡Vamos a jugar! →',
  targetView: 'online-challenges',
  active: true
};
