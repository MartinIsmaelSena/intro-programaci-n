/**
 * Utilidad de moderación de nombres de equipo para el entorno escolar.
 * Detecta obscenidades, insultos y variantes evasivas (leetspeak, tildes, caracteres repetidos, separadores)
 * sin generar falsos positivos en palabras comunes de programación o nombres legítimos.
 */

export const INAPPROPRIATE_NAME_ERROR =
  'Ese nombre no está permitido. Elegí un nombre apropiado para el entorno escolar.';

/**
 * Palabras o fragmentos legítimos permitidos que podrían contener subcadenas sensibles (Efecto Scunthorpe).
 * Se normalizan para comprobar excepciones directas.
 */
const SAFE_WORDS = [
  'computadora',
  'computacion',
  'computar',
  'diputado',
  'reputacion',
  'imputar',
  'output',
  'discutir',
  'discursion',
  'calculo',
  'calcular',
  'circulo',
  'musculo',
  'vehiculo',
  'articulo',
  'ocular',
  'analisis',
  'analizar',
  'analitico',
  'hermano',
  'plano',
  'verano',
  'artesano',
  'mariano',
  'humano',
  'pateta',
  'vegetal',
  'boquita',
  'boca',
  'zorritos',
  'tridente',
  'azul'
];

/**
 * Raíces y términos explícitos o insultos prohibidos en español/argentino escolar.
 */
const FORBIDDEN_ROOTS = [
  'pija',
  'verga',
  'poronga',
  'chota',
  'choto',
  'concha',
  'conchud',
  'cojer',
  'coger',
  'coje',
  'culear',
  'culiar',
  'culiao',
  'culia',
  'chupala',
  'chupamela',
  'chupame',
  'pajero',
  'pajera',
  'petera',
  'pelotud',
  'forro',
  'forra',
  'mogolic',
  'maricon',
  'sorete',
  'malparid',
  'mierda',
  'vagina',
  'penis'
];

/**
 * Frases compuestas obscenas que deben ser bloqueadas.
 */
const FORBIDDEN_PHRASES = [
  'coje enano',
  'chupa pija',
  'la concha',
  'me cago',
  'hijo de puta',
  'hija de puta',
  'la concha de tu madre',
  'lcdtm'
];

/**
 * Palabras cortas que deben bloquearse si aparecen como token independiente, palabra completa,
 * o si la cadena compacta consiste enteramente en ellas (ej: "p.u.t.a", "p u t a").
 */
const FORBIDDEN_STANDALONE_WORDS = [
  'puta',
  'putas',
  'puto',
  'putos',
  'putita',
  'putito',
  'trolo',
  'trolos',
  'trola',
  'trolas',
  'ano',
  'anos',
  'orto',
  'ortos',
  'culo',
  'culos',
  'teta',
  'tetas',
  'pito',
  'pitos',
  'pene',
  'penes',
  'paja',
  'pajas',
  'forro',
  'forros',
  'forra',
  'forras',
  'hdp'
];

/**
 * Reduce repeticiones excesivas de caracteres preservando dígrafos válidos como "rr" y "ll".
 */
function collapseRepeats(s: string): string {
  // 1. Reducir 3 o más repeticiones de r o l a 2
  let res = s.replace(/([rl])\1{2,}/g, '$1$1');
  // 2. Reducir 2 o más repeticiones de otras consonantes a 1
  res = res.replace(/([^aeiourl])\1+/g, '$1');
  // 3. Vocales repetidas (2 o más -> 1)
  res = res.replace(/([aeiou])\1+/g, '$1');
  return res;
}

/**
 * Normaliza un texto eliminando acentos, traduciendo leetspeak común y reduciendo caracteres repetidos.
 */
export function normalizeText(text: string): {
  normalizedWithSpaces: string;
  normalizedCompact: string;
  tokens: string[];
} {
  if (!text) return { normalizedWithSpaces: '', normalizedCompact: '', tokens: [] };

  // 1. Minúsculas y quitar tildes/diacríticos
  let str = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Traducción de leetspeak común
  str = str
    .replace(/0/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[@4]/g, 'a')
    .replace(/[$5]/g, 's')
    .replace(/7/g, 't');

  // 3. Reemplazar separadores por espacios
  const withSpaces = str
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  // 4. Tokenizar palabras individuales
  const rawTokens = withSpaces.split(/\s+/).filter(Boolean);
  const collapsedTokens = rawTokens.map(tok => collapseRepeats(tok));

  // 5. Versión compacta sin ningún espacio para detectar palabras separadas con puntos/guiones (ej: "c-o-j-e-r")
  const compact = str.replace(/[^a-z0-9]/g, '');
  const collapsedCompact = collapseRepeats(compact);

  return {
    normalizedWithSpaces: withSpaces,
    normalizedCompact: collapsedCompact,
    tokens: [...new Set([...rawTokens, ...collapsedTokens])]
  };
}

/**
 * Valida si un nombre de equipo es apropiado para el aula escolar.
 * Devuelve `{ isValid: true }` si es aceptable, o `{ isValid: false, error: string }` si es rechazado.
 */
export function validateTeamName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name ? name.trim() : '';

  if (!trimmed || trimmed.length < 2) {
    return {
      isValid: false,
      error: 'El nombre del equipo debe tener al menos 2 caracteres.'
    };
  }

  if (trimmed.length > 30) {
    return {
      isValid: false,
      error: 'El nombre del equipo no puede superar los 30 caracteres.'
    };
  }

  const { normalizedWithSpaces, normalizedCompact, tokens } = normalizeText(trimmed);

  // Excepción rápida: si coincide exactamente con una palabra segura conocida
  const lowerTrimmed = trimmed.toLowerCase();
  if (SAFE_WORDS.some(w => lowerTrimmed === w || normalizedWithSpaces === w)) {
    return { isValid: true };
  }

  // 1. Comprobación de frases compuestas obscenas (en texto con espacios y compacto)
  for (const phrase of FORBIDDEN_PHRASES) {
    const normPhrase = normalizeText(phrase).normalizedWithSpaces;
    const compactPhrase = normPhrase.replace(/\s+/g, '');
    if (
      normalizedWithSpaces.includes(normPhrase) ||
      normalizedCompact.includes(compactPhrase)
    ) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  // 2. Comprobación de raíces obscenas (subcadenas en texto o en tokens)
  for (const root of FORBIDDEN_ROOTS) {
    // Si la raíz está contenida en el texto compacto o con espacios
    if (normalizedCompact.includes(root) || normalizedWithSpaces.includes(root)) {
      // Verificar si está justificada por una palabra segura que la contiene
      const isSafe = SAFE_WORDS.some(sw => sw.includes(root) && normalizedWithSpaces.includes(sw));
      if (!isSafe) {
        return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
      }
    }
  }

  // 3. Comprobación de palabras independientes (para evitar el efecto Scunthorpe en palabras cortas)
  for (const standalone of FORBIDDEN_STANDALONE_WORDS) {
    // Coincidencia exacta de token
    for (const token of tokens) {
      if (token === standalone) {
        return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
      }
    }

    // Coincidencia compacta exacta (ej: "p.u.t.a" o "p u t a" -> compact es "puta")
    if (normalizedCompact === standalone) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }

    // Comprobación con límites de palabra (\b) sobre el texto con espacios
    const regex = new RegExp(`(^|\\s)${standalone}(\\s|$)`, 'i');
    if (regex.test(normalizedWithSpaces)) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  return { isValid: true };
}
