/**
 * Diccionario de Términos Inapropiados y Excepciones para Moderación de Nombres
 * Plataforma: Python desde Cero
 * 
 * Este archivo está desacoplado de la interfaz y es mantenible por administradores
 * y docentes para actualizar términos ofensivos o agregar excepciones legítimas.
 */

/**
 * Raíces y términos ofensivos que NUNCA deben permitirse en nombres, apellidos o colegios.
 * Se procesan normalizados (sin tildes, en minúsculas, desofuscados de leetspeak).
 */
export const INAPPROPRIATE_ROOTS: string[] = [
  // Insultos y vulgaridades frecuentes (Rioplatense / Español general / Latinoamérica)
  'pelotud',
  'bolud',
  'forr',
  'forr0',
  'tarad',
  'idiot',
  'imbecil',
  'estupid',
  'estupido',
  'estupida',
  'mierd',
  'caraj',
  'puto',
  'puta',
  'putita',
  'putito',
  'puton',
  'hdp',
  'lpm',
  'pajero',
  'pajera',
  'paja',
  'sorete',
  'malparid',
  'cornud',
  'culiao',
  'culiazo',
  'culiada',
  'chupala',
  'chupame',
  'mamala',
  'chupapija',
  'chupaverga',
  'chupapito',
  'lameculos',
  'bastard',
  'porro',

  // Contenido sexualmente explícito y anatomía vulgar
  'pija',
  'verga',
  'poronga',
  'chota',
  'choto',
  'pito',
  'concha',
  'conchuda',
  'conchudo',
  'tetas',
  'tetona',
  'culon',
  'culona',
  'culo',
  'orto',
  'ojete',
  'ano',
  'pene',
  'vagina',
  'follar',
  'coger',
  'cojer',
  'semen',
  'esperma',
  'porno',
  'pornografia',
  'sexo',
  'masturba',
  'orgasmo',
  'clitoris',
  'teta',

  // Expresiones discriminatorias, xenofobia, racismo, homofobia y capacitismo
  'trolo',
  'trola',
  'maricon',
  'marica',
  'putazo',
  'mogolic',
  'retrasad',
  'down',
  'taradito',
  'negrodemierda',
  'villero',

  // Violencia, crímenes, odio y amenazas
  'nazi',
  'hitler',
  'asesin',
  'matar',
  'muerte',
  'violad',
  'violador',
  'violacion',
  'pedofil',
  'suicid',
  'terrorist',
  'bomba',

  // Términos comunes en inglés (de uso habitual en internet)
  'fuck',
  'bitch',
  'shit',
  'asshole',
  'dick',
  'cunt',
  'whore',
  'slut',
  'nigger',
  'nigga',
  'faggot',
  'bastard',
  'cock',
  'pussy'
];

/**
 * Palabras cortas o ambiguas que SOLO deben comprobarse como palabra completa
 * (evita falsos positivos en nombres como Mariano, Conrado, Analía, etc.)
 */
export const STRICT_WORD_ONLY_TERMS: Set<string> = new Set([
  'ano',
  'culo',
  'teta',
  'pito',
  'paja',
  'pedo',
  'gay',
  'hdp',
  'lpm',
  'choto',
  'chota',
  'down'
]);

/**
 * Lista blanca de nombres reales legítimos y palabras en español
 * que podrían colisionar accidentalmente con partes de palabras bloqueadas.
 * Si un token analizado coincide exactamente con esta lista, es aceptado.
 */
export const EXCLUDED_FALSE_POSITIVES: Set<string> = new Set([
  // Nombres y apellidos comunes que contienen subcadenas como 'ano', 'con', etc.
  'mariano',
  'luciano',
  'damiano',
  'emiliano',
  'fabiano',
  'cristiano',
  'germano',
  'silvano',
  'gaetano',
  'sebastiano',
  'romano',
  'adriano',
  'maximiano',
  'aureliano',
  'conrado',
  'constanza',
  'constantino',
  'consuelo',
  'concepcion',
  'anastasia',
  'anastasio',
  'analia',
  'penelope',
  'tito',
  'pascual',
  'asuncion',
  'casimiro',
  'placido',
  'roman',
  'agustin',
  'facundo',
  'lucas',
  'tomas',
  'amador',
  'candela',
  'marcos',
  'gonzalez',
  'perez',
  'rodriguez',
  'martinez',
  'munoz',
  'gutierrez',
  'dominguez',
  'alvarez',
  'benitez',
  'fernandez',
  'lopez',
  'gomez',
  'diaz',
  'ruiz',
  'hernandez',
  'torres',
  'flores',
  'acosta',
  'medina',
  'herrera',
  'aguirre',
  'pereyra',
  'castro',
  'romero',
  'molina',
  'silva',
  'vega',
  'rios',
  'morales',
  'suarez',
  'ortiz',
  'navarro',
  'connor',
  'oconnor'
]);

/**
 * Tabla de reemplazos habituales de leetspeak para desofuscación.
 */
export const LEETSPEAK_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '+': 't'
};
