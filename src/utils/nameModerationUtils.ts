/**
 * Utilidades de Moderación y Validación de Nombres de Alumnos
 * Plataforma: Python desde Cero
 * 
 * Implementa normalización de texto, desofuscación de leetspeak,
 * detección de expresiones inapropiadas y validación estricta de nombres reales.
 */

import {
  INAPPROPRIATE_ROOTS,
  STRICT_WORD_ONLY_TERMS,
  EXCLUDED_FALSE_POSITIVES,
  LEETSPEAK_MAP
} from '../data/inappropriateWords';
import { StudentProfile } from '../types/onlineChallenge';

/**
 * Normaliza un texto eliminando tildes, convirtiendo a minúsculas
 * y quitando espacios en los extremos.
 */
export function stripDiacritics(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Desofusca caracteres numéricos y símbolos típicos de leetspeak
 * (ej: '0' -> 'o', '1' -> 'i', '3' -> 'e', '@' -> 'a', '$' -> 's').
 */
export function desofuscateLeetspeak(text: string): string {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += LEETSPEAK_MAP[char] !== undefined ? LEETSPEAK_MAP[char] : char;
  }
  return result;
}

/**
 * Reduce repeticiones consecutivas de caracteres a un máximo de 2
 * (ej: 'puuuuto' -> 'puuto').
 */
export function collapseRepeatedChars(text: string): string {
  if (!text) return '';
  return text.replace(/(.)\1{2,}/g, '$1$1');
}

/**
 * Reduce cualquier secuencia de caracteres repetidos a un único carácter
 * (ej: 'puuuuto' -> 'puto', 'mierrrda' -> 'mierda', 'peeeelotudo' -> 'pelotudo').
 */
export function collapseRepeatedToSingle(text: string): string {
  if (!text) return '';
  return text.replace(/(.)\1+/g, '$1');
}

/**
 * Normaliza exhaustivamente un texto para análisis de contenido inapropiado.
 */
export function normalizeText(text: string): string {
  const base = stripDiacritics(text);
  const desofuscated = desofuscateLeetspeak(base);
  return collapseRepeatedToSingle(desofuscated);
}

/**
 * Evalúa si un texto (nombre, apellido o colegio) contiene términos ofensivos o inapropiados.
 * Aplica técnicas de tokenización, desofuscación y prevención de falsos positivos en nombres reales.
 */
export function isInappropriateText(rawText: string): boolean {
  if (!rawText || !rawText.trim()) return false;

  const baseClean = stripDiacritics(rawText);

  // 1. Extraer tokens individuales (palabras)
  const tokens = baseClean.split(/[\s\-'.",_#*+!@$0-9]+/g).filter(Boolean);

  // Verificar cada token individual
  for (const token of tokens) {
    const desofuscatedToken = desofuscateLeetspeak(token);
    const collapsedToken = collapseRepeatedChars(desofuscatedToken);
    const singleToken = collapseRepeatedToSingle(desofuscatedToken);

    // Si el token es un nombre/apellido real conocido en la lista de excepciones, es seguro
    if (
      EXCLUDED_FALSE_POSITIVES.has(token) ||
      EXCLUDED_FALSE_POSITIVES.has(collapsedToken) ||
      EXCLUDED_FALSE_POSITIVES.has(singleToken)
    ) {
      continue;
    }

    // Comprobar términos que solo aplican a palabras completas (ej: 'ano', 'culo', 'teta')
    if (
      STRICT_WORD_ONLY_TERMS.has(token) ||
      STRICT_WORD_ONLY_TERMS.has(collapsedToken) ||
      STRICT_WORD_ONLY_TERMS.has(singleToken)
    ) {
      return true;
    }

    // Comprobar raíces ofensivas en el token
    for (const root of INAPPROPRIATE_ROOTS) {
      if (STRICT_WORD_ONLY_TERMS.has(root)) {
        if (collapsedToken === root || singleToken === root) return true;
      } else {
        if (collapsedToken.includes(root) || singleToken.includes(root)) return true;
      }
    }
  }

  // 2. Comprobar texto compacto (evasión con espacios o signos entre letras: 'p u t o', 'p.u.t.o', 'p_u_t_o')
  const compactBase = baseClean.replace(/[\s\.\-_*#+!@$',"/]+/g, '');
  const compactDesofuscated = desofuscateLeetspeak(compactBase);
  const compactCollapsed = collapseRepeatedChars(compactDesofuscated);
  const compactSingle = collapseRepeatedToSingle(compactDesofuscated);

  // Si toda la cadena compactada es una excepción legítima conocida (ej: 'mariano', 'oconnor')
  if (
    EXCLUDED_FALSE_POSITIVES.has(compactBase) ||
    EXCLUDED_FALSE_POSITIVES.has(compactCollapsed) ||
    EXCLUDED_FALSE_POSITIVES.has(compactSingle)
  ) {
    return false;
  }

  for (const root of INAPPROPRIATE_ROOTS) {
    if (STRICT_WORD_ONLY_TERMS.has(root)) {
      // Para términos estrictos como 'ano' o 'pito', solo comprobar si la palabra entera compactada coincide exactamente
      // para no bloquear nombres que la contienen como subcadena (ej: Mariano -> mariano)
      if (compactCollapsed === root || compactSingle === root) {
        return true;
      }
    } else {
      // Para raíces sin ambigüedad (ej: 'pelotud', 'mierd', 'puto', 'puta', 'forr0', 'hitler')
      if (compactCollapsed.includes(root) || compactSingle.includes(root)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Expresión regular que define los caracteres permitidos en nombres y apellidos reales:
 * Letras castellanas e internacionales, tildes (á-ú, Á-Ú), ñ/Ñ, diéresis (ü/Ü),
 * espacios, guiones simples y apóstrofes.
 */
const VALID_NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

/**
 * Valida un nombre o apellido individual.
 */
export function validatePlayerName(
  name: string,
  fieldName: 'Nombre' | 'Apellido'
): { isValid: boolean; error?: string } {
  const trimmed = (name || '').trim();

  // 1. Obligatorio
  if (!trimmed) {
    return {
      isValid: false,
      error: `⚠️ Por favor ingresá tu ${fieldName.toLowerCase()}.`
    };
  }

  // 2. Longitud mínima y máxima
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: `⚠️ El ${fieldName.toLowerCase()} debe tener al menos 2 caracteres.`
    };
  }

  if (trimmed.length > 35) {
    return {
      isValid: false,
      error: `⚠️ El ${fieldName.toLowerCase()} no puede tener más de 35 caracteres.`
    };
  }

  // 3. Verificación prioritaria de contenido inapropiado / moderación (incluso si tiene números o símbolos de evasión)
  if (isInappropriateText(trimmed)) {
    return {
      isValid: false,
      error: '⚠️ El nombre ingresado no es válido. Utilizá tu nombre y apellido reales y evitá palabras o expresiones inapropiadas.'
    };
  }

  // 4. Caracteres válidos (letras, espacios, guiones, apóstrofes)
  if (!VALID_NAME_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: `⚠️ El ${fieldName.toLowerCase()} solo puede contener letras, espacios, guiones o apóstrofes.`
    };
  }

  // 5. Evitar signos de puntuación iniciales, finales o repetidos (ej: '--', "''", '-Juan')
  if (/^[-']|[-']$/.test(trimmed) || /[-']{2,}/.test(trimmed)) {
    return {
      isValid: false,
      error: `⚠️ El ${fieldName.toLowerCase()} contiene caracteres en una posición no válida.`
    };
  }

  return { isValid: true };
}

/**
 * Valida el nombre de la escuela o colegio del alumno.
 */
export function validateSchoolName(school: string): { isValid: boolean; error?: string } {
  const trimmed = (school || '').trim();

  // 1. Obligatorio
  if (!trimmed) {
    return {
      isValid: false,
      error: '⚠️ Por favor ingresá tu colegio o escuela.'
    };
  }

  // 2. Longitud
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: '⚠️ El nombre del colegio debe tener al menos 2 caracteres.'
    };
  }

  if (trimmed.length > 60) {
    return {
      isValid: false,
      error: '⚠️ El nombre del colegio no puede superar los 60 caracteres.'
    };
  }

  // 3. Contenido apropiado
  if (isInappropriateText(trimmed)) {
    return {
      isValid: false,
      error: '⚠️ El nombre del colegio contiene términos no permitidos. Evitá palabras o expresiones inapropiadas.'
    };
  }

  return { isValid: true };
}

/**
 * Valida de forma centralizada el perfil completo del estudiante.
 * Retorna si es válido y los mensajes de error correspondientes.
 */
export function validateStudentProfile(profile: Partial<StudentProfile> | null | undefined): {
  isValid: boolean;
  errors: {
    firstName?: string;
    lastName?: string;
    school?: string;
    general?: string;
  };
} {
  const errors: {
    firstName?: string;
    lastName?: string;
    school?: string;
    general?: string;
  } = {};

  if (!profile) {
    return {
      isValid: false,
      errors: { general: '⚠️ Por favor completá tus datos de perfil.' }
    };
  }

  const nameVal = validatePlayerName(profile.firstName || '', 'Nombre');
  if (!nameVal.isValid && nameVal.error) {
    errors.firstName = nameVal.error;
  }

  const lastNameVal = validatePlayerName(profile.lastName || '', 'Apellido');
  if (!lastNameVal.isValid && lastNameVal.error) {
    errors.lastName = lastNameVal.error;
  }

  const schoolVal = validateSchoolName(profile.school || '');
  if (!schoolVal.isValid && schoolVal.error) {
    errors.school = schoolVal.error;
  }

  // Si ambos campos de nombre tienen el error educativo de contenido inapropiado, unificar mensaje
  const isOffensive =
    nameVal.error?.includes('evitá palabras o expresiones') ||
    lastNameVal.error?.includes('evitá palabras o expresiones');

  if (isOffensive) {
    errors.general =
      '⚠️ El nombre ingresado no es válido. Utilizá tu nombre y apellido reales y evitá palabras o expresiones inapropiadas.';
  }

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors };
}
