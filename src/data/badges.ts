import { Badge, UserLevel } from '../types/course';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_contact',
    title: 'Primer contacto',
    description: 'Completaste con éxito tu primera inmersión en el mundo de la programación.',
    icon: '🐍',
    category: 'starter',
    requirementText: 'Completa el Módulo 1 de Introducción a la Programación.',
    xpBonus: 100
  },
  {
    id: 'logic_foundations',
    title: 'Arquitecto lógico',
    description: 'Comprendiste qué es un algoritmo, la descomposición y el modelo Entrada-Proceso-Salida.',
    icon: '🧠',
    category: 'module',
    requirementText: 'Completa el Módulo 2 de Fundamentos de la Programación.',
    xpBonus: 100
  },
  {
    id: 'python_explorer',
    title: 'Conocedor de Python',
    description: 'Descubriste qué hace a Python un lenguaje único en la industria.',
    icon: '🌍',
    category: 'module',
    requirementText: 'Completa el Módulo 3 sobre qué es Python y sus aplicaciones.',
    xpBonus: 100
  },
  {
    id: 'variable_collector',
    title: 'Coleccionista de variables',
    description: 'Dominaste el almacenamiento y etiquetado de valores en memoria.',
    icon: '📦',
    category: 'module',
    requirementText: 'Completa todos los ejercicios del Módulo 4 de Variables.',
    xpBonus: 150
  },
  {
    id: 'type_master',
    title: 'Inspector de tipos',
    description: 'Sabes diferenciar a la perfección entre textos, enteros, flotantes y booleanos.',
    icon: '🏷️',
    category: 'module',
    requirementText: 'Completa el Módulo 5 de Tipos de Datos.',
    xpBonus: 150
  },
  {
    id: 'math_wizard',
    title: 'Mago aritmético',
    description: 'Transformas operaciones matemáticas cotidianas en código eficiente.',
    icon: '➕',
    category: 'module',
    requirementText: 'Completa el Módulo 6 de Operadores Aritméticos.',
    xpBonus: 150
  },
  {
    id: 'logical_thinker',
    title: 'Pensador lógico',
    description: 'Dominaste las comparaciones y los operadores booleanos and, or y not.',
    icon: '💡',
    category: 'skill',
    requirementText: 'Completa los Módulos 7 y 8 de Operadores de Comparación y Lógicos.',
    xpBonus: 200
  },
  {
    id: 'print_master',
    title: 'Maestro de print',
    description: 'Tus programas se comunican con claridad a través de la consola.',
    icon: '🖨️',
    category: 'module',
    requirementText: 'Completa todos los ejercicios del Módulo 9 de print().',
    xpBonus: 150
  },
  {
    id: 'data_input',
    title: 'Entrada de datos',
    description: 'Hiciste que tus programas cobren vida interactuando con el usuario.',
    icon: '🎤',
    category: 'module',
    requirementText: 'Completa el Módulo 10 de la función input().',
    xpBonus: 150
  },
  {
    id: 'decision_maker',
    title: 'Tomador de decisiones',
    description: 'Tus programas eligen el camino correcto con condicionales if, elif y else.',
    icon: '🔀',
    category: 'module',
    requirementText: 'Completa el Módulo 11 de Condicionales.',
    xpBonus: 200
  },
  {
    id: 'loop_repeater',
    title: 'Repetidor constante',
    description: 'Comprendiste el poder de la automatización y las iteraciones.',
    icon: '🔁',
    category: 'module',
    requirementText: 'Completa el Módulo 12 de Introducción a Loops.',
    xpBonus: 150
  },
  {
    id: 'loop_tamer',
    title: 'Domador de bucles',
    description: 'Manejás bucles for y while con total precisión sin ciclos infinitos.',
    icon: '🔥',
    category: 'skill',
    requirementText: 'Completa los Módulos 13 y 14 (for y while).',
    xpBonus: 250
  },
  {
    id: 'problem_solver',
    title: 'Resolutor de problemas',
    description: 'Integraste todos los conceptos en programas completos y funcionales.',
    icon: '🚀',
    category: 'module',
    requirementText: 'Completa el Módulo 15 de Integración y Proyectos.',
    xpBonus: 300
  },
  {
    id: 'challenge_seeker',
    title: 'Explorador desafiante',
    description: 'Fuiste más allá completando desafíos opcionales avanzados.',
    icon: '⭐',
    category: 'achievement',
    requirementText: 'Supera al menos 2 desafíos opcionales.',
    xpBonus: 200
  },
  {
    id: 'full_pythonista',
    title: 'Pythonista Oficial',
    description: 'Completaste con éxito todo el curso de Python desde Cero.',
    icon: '👑',
    category: 'mastery',
    requirementText: 'Completa los 15 módulos del curso.',
    xpBonus: 500
  },
  {
    id: 'first_python_challenge',
    title: '🚀 Primer desafío',
    description: 'Completaste tu primer desafío de programación con éxito.',
    icon: '🚀',
    category: 'achievement',
    requirementText: 'Completa y entrega tu primer desafío de lógica y código.',
    xpBonus: 150
  },
  {
    id: 'challenge_solver',
    title: '🧠 Resolutor',
    description: 'Superaste correctamente un desafío de Python con nota destacada.',
    icon: '🧠',
    category: 'achievement',
    requirementText: 'Obtén una nota de 8 o más en cualquier desafío.',
    xpBonus: 200
  },
  {
    id: 'iron_logic',
    title: '🔥 Lógica de acero',
    description: 'Demostraste maestría superando 3 desafíos de programación.',
    icon: '🔥',
    category: 'achievement',
    requirementText: 'Supera 3 desafíos de programación con éxito.',
    xpBonus: 300
  },
  {
    id: 'expert_challenger',
    title: '🏆 Desafiante experto',
    description: 'Alcanzaste el más alto nivel superando 5 desafíos de programación.',
    icon: '🏆',
    category: 'mastery',
    requirementText: 'Supera 5 desafíos de programación con éxito.',
    xpBonus: 400
  },
  {
    id: 'online_streak_3',
    title: '🏆 Racha de 3',
    description: 'Conseguiste 3 victorias consecutivas en Desafíos en Línea.',
    icon: '🏆',
    category: 'achievement',
    requirementText: 'Alcanza 3 victorias consecutivas en Desafíos en Línea.',
    xpBonus: 200
  },
  {
    id: 'online_streak_5',
    title: '🔥 Imparable',
    description: 'Conseguiste 5 victorias consecutivas en Desafíos en Línea.',
    icon: '🔥',
    category: 'achievement',
    requirementText: 'Alcanza 5 victorias consecutivas en Desafíos en Línea.',
    xpBonus: 350
  },
  {
    id: 'online_streak_10',
    title: '👑 Maestro del desafío',
    description: 'Conseguiste 10 victorias consecutivas en Desafíos en Línea.',
    icon: '👑',
    category: 'mastery',
    requirementText: 'Alcanza 10 victorias consecutivas en Desafíos en Línea.',
    xpBonus: 500
  },
  {
    id: 'logic_arena_first',
    title: '🧠 Primer Razonamiento',
    description: 'Resolviste con éxito tu primera pregunta en la Arena de Lógica.',
    icon: '🧠',
    category: 'achievement',
    requirementText: 'Completa correctamente tu primera pregunta en la Arena de Lógica.',
    xpBonus: 100
  },
  {
    id: 'logic_arena_erudito',
    title: '🎓 Erudito',
    description: 'Demostraste un dominio sólido del razonamiento resolviendo 15 preguntas correctamente.',
    icon: '🎓',
    category: 'skill',
    requirementText: 'Alcanza 15 respuestas correctas en la Arena de Lógica.',
    xpBonus: 250
  },
  {
    id: 'logic_arena_master',
    title: '👑 Maestro de la Lógica',
    description: 'Alcanzaste el más alto grado de agilidad mental con 30 aciertos o una racha impecable de 10.',
    icon: '👑',
    category: 'mastery',
    requirementText: 'Alcanza 30 respuestas correctas o una racha de 10 aciertos consecutivos en la Arena.',
    xpBonus: 500
  }
];

export const USER_LEVELS: UserLevel[] = [
  { level: 1, title: '🌱 Explorador', icon: '🌱', minXp: 0, maxXp: 200 },
  { level: 2, title: '🔎 Aprendiz', icon: '🔎', minXp: 201, maxXp: 600 },
  { level: 3, title: '💻 Programador Inicial', icon: '💻', minXp: 601, maxXp: 1200 },
  { level: 4, title: '🧠 Pensador Computacional', icon: '🧠', minXp: 1201, maxXp: 2200 },
  { level: 5, title: '🐍 Pythonista', icon: '🐍', minXp: 2201, maxXp: 99999 }
];

export function calculateLevel(xp: number): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= USER_LEVELS[i].minXp) {
      return USER_LEVELS[i];
    }
  }
  return USER_LEVELS[0];
}

export function getNextLevel(currentLevel: number): UserLevel | null {
  const next = USER_LEVELS.find(l => l.level === currentLevel + 1);
  return next || null;
}
