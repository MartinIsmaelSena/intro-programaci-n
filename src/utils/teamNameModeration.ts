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
const SAFE_WORDS = new Set([
  'computadora',
  'computacion',
  'computar',
  'computacional',
  'computo',
  'diputado',
  'diputada',
  'diputados',
  'diputadas',
  'reputacion',
  'reputado',
  'imputar',
  'imputacion',
  'disputar',
  'disputa',
  'input',
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
  'molecular',
  'particular',
  'curriculo',
  'analisis',
  'analizar',
  'analitico',
  'hermano',
  'hermanos',
  'plano',
  'planos',
  'verano',
  'artesano',
  'mariano',
  'humano',
  'humanos',
  'urbano',
  'enano',
  'enanos',
  'gusano',
  'manos',
  'granos',
  'abano',
  'vano',
  'tirano',
  'oceano',
  'pateta',
  'vegetal',
  'boquita',
  'boca',
  'zorritos',
  'tridente',
  'azul',
  'corto',
  'porton',
  'aborto',
  'comportar',
  'soportar',
  'exportar',
  'importar',
  'reportar',
  'pena',
  'apenas',
  'penal',
  'penales',
  'repentino',
  'depende',
  'independiente',
  'suspender',
  'compensar',
  'capitolio',
  'apetito',
  'hospital',
  'pitagoras',
  'pitonisa',
  'repito',
  'compito',
  'recoger',
  'escoger',
  'acoger',
  'pajar',
  'pajarito',
  'pajaro',
  'pajaros',
  'control',
  'controlar',
  'electro',
  'patrulla',
  'programadores',
  'algoritmos',
  'python'
]);

/**
 * Raíces y términos explícitos o insultos prohibidos en español escolar.
 */
const FORBIDDEN_ROOTS = [
  'pij',
  'porong',
  'chot',
  'conch',
  'cag',
  'pelotud',
  'bolud',
  'soret',
  'mierd',
  'mogolic',
  'maric',
  'malparid',
  'tarad',
  'imbecil',
  'estupid',
  'peter',
  'chupal',
  'chupam',
  'chupen'
];

/**
 * Frases compuestas obscenas que deben ser bloqueadas.
 */
const FORBIDDEN_PHRASES = [
  'coje enano',
  'chupa pija',
  'chupa pijas',
  'la concha',
  'me cago',
  'hijo de puta',
  'hija de puta',
  'la concha de tu madre',
  'lcdtm',
  'lpm',
  'la puta madre',
  'andate a la mierda'
];

/**
 * Palabras cortas o términos anatómicos que deben bloquearse si aparecen como token independiente, palabra completa,
 * o si la cadena compacta consiste enteramente en ellas (ej: "p.u.t.a", "p u t a").
 */
const FORBIDDEN_STANDALONE_WORDS = new Set([
  'ano',
  'anos',
  'anal',
  'anales',
  'orto',
  'ortos',
  'ortiba',
  'ortiva',
  'culo',
  'culos',
  'culon',
  'culona',
  'culones',
  'culonas',
  'culiao',
  'culia',
  'culito',
  'culitos',
  'culear',
  'culiar',
  'teta',
  'tetas',
  'tetona',
  'tetonas',
  'tetita',
  'tetitas',
  'pito',
  'pitos',
  'pitito',
  'pene',
  'penes',
  'penis',
  'paja',
  'pajas',
  'pajero',
  'pajeros',
  'pajera',
  'pajeras',
  'forro',
  'forros',
  'forra',
  'forras',
  'trolo',
  'trolos',
  'trola',
  'trolas',
  'hdp'
]);

/**
 * Reduce repeticiones excesivas de caracteres preservando dígrafos válidos como "rr" y "ll".
 */
function collapseRepeats(s: string): string {
  let res = s.replace(/([rl])\1{2,}/g, '$1$1');
  res = res.replace(/([^aeiourl])\1+/g, '$1');
  res = res.replace(/([aeiou])\1+/g, '$1');
  return res;
}

/**
 * Normaliza un texto eliminando acentos, traduciendo leetspeak común y reduciendo caracteres repetidos.
 */
export function normalizeText(text: string): {
  normalizedWithSpaces: string;
  normalizedCompact: string;
  collapsedCompact: string;
  tokens: string[];
} {
  if (!text) {
    return {
      normalizedWithSpaces: '',
      normalizedCompact: '',
      collapsedCompact: '',
      tokens: []
    };
  }

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
  const withSpaces = str.replace(/[^a-z0-9]+/g, ' ').trim();

  // 4. Versión compacta sin separadores
  const compact = str.replace(/[^a-z0-9]/g, '');
  const collapsedCompact = collapseRepeats(compact);

  // 5. Tokenizar palabras individuales y sus versiones colapsadas
  const rawTokens = withSpaces.split(/\s+/).filter(Boolean);
  const collapsedTokens = rawTokens.map(tok => collapseRepeats(tok));

  return {
    normalizedWithSpaces: withSpaces,
    normalizedCompact: compact,
    collapsedCompact,
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

  const { normalizedWithSpaces, normalizedCompact, collapsedCompact, tokens } =
    normalizeText(trimmed);

  // Excepción rápida: si coincide exactamente con una palabra segura conocida
  if (
    SAFE_WORDS.has(normalizedWithSpaces) ||
    SAFE_WORDS.has(normalizedCompact) ||
    SAFE_WORDS.has(collapsedCompact)
  ) {
    return { isValid: true };
  }

  // Si todos los tokens son palabras seguras legítimas, aceptar
  if (tokens.length > 0 && tokens.every(t => SAFE_WORDS.has(t))) {
    return { isValid: true };
  }

  // 1. Comprobación de frases compuestas obscenas (en texto con espacios y compacto)
  for (const phrase of FORBIDDEN_PHRASES) {
    const normPhrase = normalizeText(phrase).normalizedWithSpaces;
    const compactPhrase = normPhrase.replace(/\s+/g, '');
    if (
      normalizedWithSpaces.includes(normPhrase) ||
      normalizedCompact.includes(compactPhrase) ||
      collapsedCompact.includes(compactPhrase)
    ) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  // 2. Familia 'put-': cubre putita, putitas, putito, putitos, puta, putas, etc.
  // Cualquier put[aeiou] a menos que esté precedida por un prefijo seguro (comput, diput, reput, imput, disput, input, output)
  const putRegex = /put[aeiou]/g;
  let putMatch: RegExpExecArray | null;
  while ((putMatch = putRegex.exec(collapsedCompact)) !== null) {
    const startIdx = putMatch.index;
    const prefix = collapsedCompact.slice(Math.max(0, startIdx - 6), startIdx);
    const hasSafePrefix = ['com', 'di', 're', 'im', 'dis', 'in', 'out'].some(p =>
      prefix.endsWith(p)
    );
    if (!hasSafePrefix) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  // 3. Familia 'coj' / 'cog': cubre cojer, coger, coje, etc. a menos que sea recog, escog, acog
  const cojRegex = /co[jg][aeiou]/g;
  let cojMatch: RegExpExecArray | null;
  while ((cojMatch = cojRegex.exec(collapsedCompact)) !== null) {
    const startIdx = cojMatch.index;
    const prefix = collapsedCompact.slice(Math.max(0, startIdx - 4), startIdx);
    const hasSafePrefix = ['re', 'es', 'ac'].some(p => prefix.endsWith(p));
    if (!hasSafePrefix) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  // 4. Familia 'verg': a menos que sea enverg, converg, diverg
  const vergRegex = /verg/g;
  let vergMatch: RegExpExecArray | null;
  while ((vergMatch = vergRegex.exec(collapsedCompact)) !== null) {
    const startIdx = vergMatch.index;
    const prefix = collapsedCompact.slice(Math.max(0, startIdx - 4), startIdx);
    const hasSafePrefix = ['en', 'con', 'di'].some(p => prefix.endsWith(p));
    if (!hasSafePrefix) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  // 5. Comprobación de raíces obscenas generales
  for (const root of FORBIDDEN_ROOTS) {
    if (collapsedCompact.includes(root) || normalizedWithSpaces.includes(root)) {
      let isSafe = false;
      for (const sw of SAFE_WORDS) {
        if (sw.includes(root) && normalizedWithSpaces.includes(sw)) {
          isSafe = true;
          break;
        }
      }
      if (!isSafe) {
        return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
      }
    }
  }

  // 6. Comprobación de palabras independientes / anatómicas
  for (const standalone of FORBIDDEN_STANDALONE_WORDS) {
    // Coincidencia exacta de token
    for (const token of tokens) {
      if (token === standalone && !SAFE_WORDS.has(token)) {
        return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
      }
    }

    // Coincidencia compacta exacta (ej: "p.u.t.a" o "p u t a")
    if (
      (normalizedCompact === standalone || collapsedCompact === standalone) &&
      !SAFE_WORDS.has(normalizedCompact)
    ) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }

    // Comprobación con límites de palabra (\b) sobre el texto con espacios
    const regex = new RegExp(`(^|\\s)${standalone}(\\s|$)`, 'i');
    if (regex.test(normalizedWithSpaces) && !SAFE_WORDS.has(standalone)) {
      return { isValid: false, error: INAPPROPRIATE_NAME_ERROR };
    }
  }

  return { isValid: true };
}
