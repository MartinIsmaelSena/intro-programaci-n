import { Player } from '../types/onlineChallenge';

export interface SimulatedPlayerConfig extends Player {
  acceptanceRate: number; // Probabilidad de aceptar desafío (0.0 a 1.0)
  reactions: string[];     // Mensajes o emojis que suele enviar
}

/**
 * Capa de datos de jugadores simulados para FASE 1.
 * En la FASE 2, esta lista será reemplazada por jugadores reales
 * obtenidos desde un backend realtime (WebSockets / Supabase).
 */
export const MOCK_ONLINE_PLAYERS: SimulatedPlayerConfig[] = [
  {
    id: 'player_juan_perez',
    firstName: 'Juan',
    lastName: 'Pérez',
    school: 'CPEM 69',
    course: '3° A',
    avatar: '👨‍💻',
    xp: 450,
    wins: 12,
    losses: 4,
    streak: 3,
    status: 'available',
    maxCompletedModule: 3,
    levelTopic: 'Variables',
    accuracyRate: 0.82,
    avgResponseTimeSeconds: 3.5,
    acceptanceRate: 0.9,
    reactions: ['😎 ¡Vamos!', '🔥 ¡Buenísima!', '👏 Muy bien', '🐍']
  },
  {
    id: 'player_maria_gonzalez',
    firstName: 'María',
    lastName: 'González',
    school: 'CPEM 70',
    course: '3° B',
    avatar: '👩‍💻',
    xp: 320,
    wins: 8,
    losses: 5,
    streak: 2,
    status: 'available',
    maxCompletedModule: 4,
    levelTopic: 'Tipos de datos',
    accuracyRate: 0.78,
    avgResponseTimeSeconds: 4.2,
    acceptanceRate: 0.85,
    reactions: ['🤔 Estoy pensando...', '🎉 ¡Bien!', '🧠 Buena respuesta', '💪 ¡Puedo hacerlo!']
  },
  {
    id: 'player_pedro_lopez',
    firstName: 'Pedro',
    lastName: 'López',
    school: 'CPEM 69',
    course: '3° A',
    avatar: '🧑‍💻',
    xp: 620,
    wins: 15,
    losses: 3,
    streak: 5,
    status: 'playing', // En partida: no puede ser desafiado
    maxCompletedModule: 5,
    levelTopic: 'Aritmética',
    accuracyRate: 0.90,
    avgResponseTimeSeconds: 2.8,
    acceptanceRate: 0.7,
    reactions: ['🔥 ¡Buenísima!', '😎 ¡Vamos!', '⚡', '🏆']
  },
  {
    id: 'player_sofia_rodriguez',
    firstName: 'Sofía',
    lastName: 'Rodríguez',
    school: 'CPEM 46',
    course: '3° C',
    avatar: '👩‍🔬',
    xp: 380,
    wins: 9,
    losses: 4,
    streak: 1,
    status: 'available',
    maxCompletedModule: 2,
    levelTopic: 'Python',
    accuracyRate: 0.80,
    avgResponseTimeSeconds: 3.8,
    acceptanceRate: 0.9,
    reactions: ['🧠 Buena respuesta', '🎉 ¡Bien!', '👏 Muy bien', '💡']
  },
  {
    id: 'player_lucas_fernandez',
    firstName: 'Lucas',
    lastName: 'Fernández',
    school: 'EPET 14',
    course: '4° 1ra',
    avatar: '👨‍🔧',
    xp: 290,
    wins: 6,
    losses: 7,
    streak: 0,
    status: 'offline', // Desconectado: no puede ser desafiado
    maxCompletedModule: 2,
    levelTopic: 'Python',
    accuracyRate: 0.70,
    avgResponseTimeSeconds: 5.0,
    acceptanceRate: 0.5,
    reactions: ['😱 ¡Qué difícil!', '😭 Nooo', '😂 Jajaja', '🤔']
  },
  {
    id: 'player_camila_diaz',
    firstName: 'Camila',
    lastName: 'Díaz',
    school: 'CPEM 12',
    course: '3° 2da',
    avatar: '👩‍🎨',
    xp: 510,
    wins: 11,
    losses: 3,
    streak: 4,
    status: 'available',
    maxCompletedModule: 3,
    levelTopic: 'Variables',
    accuracyRate: 0.85,
    avgResponseTimeSeconds: 3.2,
    acceptanceRate: 0.95,
    reactions: ['🔥 ¡Buenísima!', '😎 ¡Vamos!', '💪 ¡Puedo hacerlo!', '🎉 ¡Bien!']
  },
  {
    id: 'player_mateo_benitez',
    firstName: 'Mateo',
    lastName: 'Benítez',
    school: 'EPET 20',
    course: '3° B',
    avatar: '🧑‍🚀',
    xp: 340,
    wins: 7,
    losses: 5,
    streak: 2,
    status: 'available',
    maxCompletedModule: 1,
    levelTopic: 'Introducción',
    accuracyRate: 0.75,
    avgResponseTimeSeconds: 4.0,
    acceptanceRate: 0.85,
    reactions: ['😂 Jajaja', '😱 ¡Qué difícil!', '👏 Muy bien', '😎 ¡Vamos!']
  },
  {
    id: 'player_lucas_benitez',
    firstName: 'Lautaro',
    lastName: 'Benítez',
    school: 'EPET 17',
    course: '5° A',
    avatar: '🧑‍🏫',
    xp: 780,
    wins: 18,
    losses: 2,
    streak: 6,
    status: 'available',
    maxCompletedModule: 10,
    levelTopic: 'Condicionales',
    accuracyRate: 0.92,
    avgResponseTimeSeconds: 2.5,
    acceptanceRate: 0.9,
    reactions: ['🧠 Buena respuesta', '⚡', '🏆']
  }
];

export function getSimulatedPlayers(): SimulatedPlayerConfig[] {
  return [...MOCK_ONLINE_PLAYERS];
}

export function getSimulatedPlayerById(id: string): SimulatedPlayerConfig | undefined {
  return MOCK_ONLINE_PLAYERS.find(p => p.id === id);
}
