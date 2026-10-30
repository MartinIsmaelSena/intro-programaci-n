import {
  Exam,
  ExamUnifiedQuestion,
  ExamConfig,
  ExamStudentData,
  ActiveExamSession
} from '../../types/exam';

export const EXAM_PROG_VARS_LOGIC_ID = 'exam-prog-vars-logic';
export const EXAM_PROG_VARS_LOGIC_STORAGE_KEY = `python_active_exam_session_${EXAM_PROG_VARS_LOGIC_ID}`;
export const EXAM_PROG_VARS_LOGIC_ATTEMPTS_STORAGE_KEY = `python_exam_attempts_history_${EXAM_PROG_VARS_LOGIC_ID}`;

export const EXAM_PROG_VARS_LOGIC_CONFIG: ExamConfig = {
  totalQuestions: 20,
  durationMinutes: 40,
  maxAttempts: 3,
  distribution: {
    multiple_choice: 15,
    tracing: 0,
    coding: 5
  },
  maxScore: 10.0,
  pointsPerQuestion: 0.5,
  passingScore: 6.0,
  allowDetailedReview: true
};

// ============================================================================
// 1. BANCO DE 15 PREGUNTAS DE OPCIÓN MÚLTIPLE (0.4 puntos c/u = 6.0 puntos)
// ============================================================================

export const EXAM_PROG_VARS_LOGIC_MC: ExamUnifiedQuestion[] = [
  // Pregunta 1 – Análisis de variables y operaciones
  {
    id: 'e_pvl_mc_01',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Variables y operaciones',
    question: 'Analizá la ejecución del siguiente código:\n\n¿Qué resultado se muestra en pantalla?',
    codeSnippet: 'a = 2\nb = 4\nc = a + b * 2\na = c - a\nprint(a, b, c)',
    options: [
      '10 4 8',
      '8 4 10',
      '6 4 10',
      '8 2 10'
    ],
    correctAnswer: 1, // '8 4 10'
    explanation: 'Primero se realiza la multiplicación 4 * 2 = 8, luego se suma 2. Por lo tanto, c = 10. Después, a = 10 - 2, por lo que vale 8. Finalmente se imprime 8 4 10.',
    points: 0.4
  },
  // Pregunta 2 – Actualización de una variable
  {
    id: 'e_pvl_mc_02',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Actualización de una variable',
    question: 'Observá el código:\n\n¿Qué resultado aparece?',
    codeSnippet: 'cuenta = 100\ncuenta = cuenta - 30\ncuenta = cuenta + 15\nprint("Total:", cuenta)',
    options: [
      'Total: 100',
      'Total: 85',
      'Total: 115',
      'Total: 145'
    ],
    correctAnswer: 1, // 'Total: 85'
    explanation: 'La variable cuenta comienza en 100, luego se resta 30 (queda 70) y finalmente se suman 15 (queda 85). Se muestra Total: 85.',
    points: 0.4
  },
  // Pregunta 3 – Copia del valor de una variable
  {
    id: 'e_pvl_mc_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Copia del valor de una variable',
    question: 'Revisá el siguiente código:\n\n¿Qué valor se imprime?',
    codeSnippet: 'p = 5\nq = p\np = p + 2\nprint(q)',
    options: [
      '5',
      '7',
      '2',
      '10'
    ],
    correctAnswer: 0, // '5'
    explanation: 'Cuando se ejecuta q = p, la variable q recibe una copia del valor actual de p (5). Modificar posteriormente p no altera el valor ya asignado a q.',
    points: 0.4
  },
  // Pregunta 4 – Operadores lógicos
  {
    id: 'e_pvl_mc_04',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Operadores lógicos',
    question: '¿Cuál de las siguientes expresiones da como resultado True?',
    options: [
      'not (4 + 2 == 6)',
      '7 > 3 and not (2 > 4)',
      '10 >= 20 and 5 == 5',
      '5 != 5 or 3 > 8'
    ],
    correctAnswer: 1, // '7 > 3 and not (2 > 4)'
    explanation: '7 > 3 es True. 2 > 4 es False, pero con not (2 > 4) se convierte en True. Ambas condiciones conectadas por and son True, por lo que el resultado global es True.',
    points: 0.4
  },
  // Pregunta 5 – Análisis de operaciones
  {
    id: 'e_pvl_mc_05',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Análisis de operaciones',
    question: 'Analizá el siguiente bloque:\n\n¿Cuál es el valor impreso?',
    codeSnippet: 'x = 10\ny = 3\nx = x + y\ny = x - y\nprint(y)',
    options: [
      '3',
      '10',
      '13',
      '7'
    ],
    correctAnswer: 1, // '10'
    explanation: 'Primero x pasa a valer 13 (10 + 3). Después y recibe el resultado de 13 - 3, es decir, 10.',
    points: 0.4
  },
  // Pregunta 6 – Concepto de variable
  {
    id: 'e_pvl_mc_06',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto de variable',
    question: '¿Qué es una variable en programación?',
    options: [
      'Una instrucción que permite mostrar mensajes en pantalla.',
      'Un espacio donde podemos guardar un dato para utilizarlo durante un programa.',
      'Un símbolo que siempre representa una operación matemática.',
      'Una función que permite cerrar un programa.'
    ],
    correctAnswer: 1, // 'Un espacio donde podemos guardar un dato para utilizarlo durante un programa.'
    explanation: 'Una variable es un identificador referenciado a un espacio de memoria donde podemos almacenar y modificar un valor mientras el programa se ejecuta.',
    points: 0.4
  },
  // Pregunta 7 – Función print()
  {
    id: 'e_pvl_mc_07',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Función print()',
    question: '¿Para qué se utiliza principalmente print() en Python?',
    options: [
      'Para ingresar información desde el teclado.',
      'Para guardar datos en una variable.',
      'Para mostrar información en pantalla.',
      'Para convertir un texto en número.'
    ],
    correctAnswer: 2, // 'Para mostrar información en pantalla.'
    explanation: 'La función print() es la instrucción estándar de salida que envía datos para ser visualizados por el usuario en la pantalla o consola.',
    points: 0.4
  },
  // Pregunta 8 – Función input()
  {
    id: 'e_pvl_mc_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Función input()',
    question: '¿Qué permite hacer la función input()?',
    options: [
      'Mostrar el resultado de una multiplicación.',
      'Solicitar información al usuario mediante el teclado.',
      'Convertir automáticamente cualquier dato en entero.',
      'Eliminar el contenido de una variable.'
    ],
    correctAnswer: 1, // 'Solicitar información al usuario mediante el teclado.'
    explanation: 'input() pausa la ejecución del programa y permite que el usuario escriba información desde el teclado, capturándola como una cadena de texto.',
    points: 0.4
  },
  // Pregunta 9 – Conversión a entero
  {
    id: 'e_pvl_mc_09',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Conversión a entero',
    question: '¿Qué función utilizamos para convertir un dato a un número entero?',
    options: [
      'print()',
      'input()',
      'int()',
      'str()'
    ],
    correctAnswer: 2, // 'int()'
    explanation: 'int() permite transformar una cadena de caracteres o un valor compatible en un número entero numérico para operar matemáticamente con él.',
    points: 0.4
  },
  // Pregunta 10 – Orden de ejecución
  {
    id: 'e_pvl_mc_10',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Orden de ejecución',
    question: '¿Qué sucede cuando ejecutamos estas instrucciones?',
    codeSnippet: 'numero = 8\nnumero = numero + 5\nprint(numero)',
    options: [
      'Se imprime 8.',
      'Se imprime 5.',
      'Se imprime 13.',
      'Se produce un error.'
    ],
    correctAnswer: 2, // 'Se imprime 13.'
    explanation: 'La variable numero se inicializa en 8. Luego se calcula 8 + 5 = 13 y se reasigna a la misma variable. Por lo tanto, print(numero) muestra 13.',
    points: 0.4
  },
  // Pregunta 11 – Operaciones matemáticas
  {
    id: 'e_pvl_mc_11',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Operaciones matemáticas',
    question: 'Si tenemos:\n\n¿Qué muestra el programa?',
    codeSnippet: 'a = 6\nb = 3\nresultado = a * b\nprint(resultado)',
    options: [
      '9',
      '18',
      '3',
      '63'
    ],
    correctAnswer: 1, // '18'
    explanation: 'El asterisco (*) representa la multiplicación aritmética en Python. 6 * 3 resulta en 18.',
    points: 0.4
  },
  // Pregunta 12 – Comparaciones
  {
    id: 'e_pvl_mc_12',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Comparaciones',
    question: '¿Qué resultado devuelve la expresión?',
    codeSnippet: '10 > 5',
    options: [
      'False',
      'True',
      '10',
      '5'
    ],
    correctAnswer: 1, // 'True'
    explanation: '10 es estrictamente mayor que 5, por lo que el operador relacional > evalúa a True (verdadero).',
    points: 0.4
  },
  // Pregunta 13 – Operador AND
  {
    id: 'e_pvl_mc_13',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Operador AND',
    question: '¿Cuándo devuelve True el operador lógico and?',
    options: [
      'Cuando al menos una condición es verdadera.',
      'Cuando todas las condiciones son verdaderas.',
      'Cuando todas las condiciones son falsas.',
      'Siempre devuelve True.'
    ],
    correctAnswer: 1, // 'Cuando todas las condiciones son verdaderas.'
    explanation: 'La conjunción and exige que todas las proposiciones evaluadas sean verdaderas para que el resultado global sea True.',
    points: 0.4
  },
  // Pregunta 14 – Operador NOT
  {
    id: 'e_pvl_mc_14',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Operador NOT',
    question: '¿Qué resultado devuelve esta expresión?',
    codeSnippet: 'not (5 > 2)',
    options: [
      'True',
      'False',
      '5',
      '2'
    ],
    correctAnswer: 1, // 'False'
    explanation: 'La condición 5 > 2 es True. El operador de negación not invierte el valor de verdad, dando como resultado False.',
    points: 0.4
  },
  // Pregunta 15 – Salto de línea
  {
    id: 'e_pvl_mc_15',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Salto de línea',
    question: '¿Para qué se utiliza \\n dentro de un texto en Python?',
    options: [
      'Para multiplicar dos números.',
      'Para crear un salto de línea.',
      'Para convertir un texto en entero.',
      'Para guardar una variable.'
    ],
    correctAnswer: 1, // 'Para crear un salto de línea.'
    explanation: '\\n representa una secuencia de escape que inserta un salto de línea (nueva línea) dentro de una cadena de texto.',
    points: 0.4
  }
];

// ============================================================================
// 2. BANCO DE 5 EJERCICIOS DE CONSTRUCCIÓN DE CÓDIGO (0.8 puntos c/u = 4.0 pts)
// ============================================================================

export const EXAM_PROG_VARS_LOGIC_CODING: ExamUnifiedQuestion[] = [
  // Pregunta 16 – El doble de un número
  {
    id: 'e_pvl_cd_16',
    type: 'coding',
    moduleId: 10,
    topic: 'Entrada y operaciones',
    title: 'El doble de un número',
    question: `Construí un programa en Python que solicite al usuario ingresar un número entero y muestre su doble.

Ejemplo de funcionamiento:
Ingresá un número: 8
El doble es: 16`,
    starterCode: `# Solicitá un número entero y mostrá su doble:\n\n`,
    solution: `numero = int(input("Ingresá un número: "))
doble = numero * 2
print("El doble es:", doble)`,
    testCases: [
      {
        name: 'Número 8 -> 16',
        inputs: ['8'],
        expectedOutputs: ['16'],
        description: 'Ingresando 8 el programa debe mostrar 16'
      },
      {
        name: 'Número 15 -> 30',
        inputs: ['15'],
        expectedOutputs: ['30'],
        description: 'Ingresando 15 el programa debe mostrar 30'
      }
    ],
    points: 0.8
  },
  // Pregunta 17 – Perímetro de un rectángulo
  {
    id: 'e_pvl_cd_17',
    type: 'coding',
    moduleId: 6,
    topic: 'Operaciones geométricas',
    title: 'Perímetro de un rectángulo',
    question: `Construí un programa que solicite al usuario ingresar la base y la altura de un rectángulo y calcule su perímetro.

Utilizá la siguiente fórmula:
Perímetro = 2 × (base + altura)

Ejemplo:
Ingresá la base: 5
Ingresá la altura: 3
El perímetro es: 16`,
    starterCode: `# Solicitá base y altura (enteros), calculá y mostrá el perímetro:\n\n`,
    solution: `base = int(input("Ingresá la base: "))
altura = int(input("Ingresá la altura: "))
perimetro = 2 * (base + altura)
print("El perímetro es:", perimetro)`,
    testCases: [
      {
        name: 'Base 5 y altura 3 -> 16',
        inputs: ['5', '3'],
        expectedOutputs: ['16'],
        description: '2 * (5 + 3) debe resultar en 16'
      },
      {
        name: 'Base 10 y altura 4 -> 28',
        inputs: ['10', '4'],
        expectedOutputs: ['28'],
        description: '2 * (10 + 4) debe resultar en 28'
      }
    ],
    points: 0.8
  },
  // Pregunta 18 – Suma de dos números
  {
    id: 'e_pvl_cd_18',
    type: 'coding',
    moduleId: 6,
    topic: 'Suma de datos',
    title: 'Suma de dos números',
    question: `Escribí un programa que solicite dos números enteros, los sume y muestre el resultado.

Ejemplo:
Ingresá el primer número: 12
Ingresá el segundo número: 8
La suma es: 20`,
    starterCode: `# Solicitá dos números enteros y mostrá su suma:\n\n`,
    solution: `numero1 = int(input("Ingresá el primer número: "))
numero2 = int(input("Ingresá el segundo número: "))
suma = numero1 + numero2
print("La suma es:", suma)`,
    testCases: [
      {
        name: '12 + 8 -> 20',
        inputs: ['12', '8'],
        expectedOutputs: ['20'],
        description: '12 sumado a 8 debe dar 20'
      },
      {
        name: '35 + 15 -> 50',
        inputs: ['35', '15'],
        expectedOutputs: ['50'],
        description: '35 sumado a 15 debe dar 50'
      }
    ],
    points: 0.8
  },
  // Pregunta 19 – Presentación personal
  {
    id: 'e_pvl_cd_19',
    type: 'coding',
    moduleId: 9,
    topic: 'Salto de línea y cadenas',
    title: 'Presentación personal',
    question: `Construí un programa que solicite al usuario su nombre y su edad. Luego debe mostrar un mensaje que incluya ambos datos, utilizando \\n para separar las líneas.

Ejemplo:
Ingresá tu nombre: Martín
Ingresá tu edad: 20

Datos ingresados:
Nombre: Martín
Edad: 20`,
    starterCode: `# Solicitá nombre y edad, luego mostralos en pantalla usando \\n:\n\n`,
    solution: `nombre = input("Ingresá tu nombre: ")
edad = int(input("Ingresá tu edad: "))
print("Datos ingresados:\\nNombre:", nombre, "\\nEdad:", edad)`,
    testCases: [
      {
        name: 'Martin y 20',
        inputs: ['Martin', '20'],
        expectedOutputs: ['Martin', '20'],
        description: 'Debe mostrar Martin y 20 en la salida con salto de línea'
      },
      {
        name: 'Sofia y 15',
        inputs: ['Sofia', '15'],
        expectedOutputs: ['Sofia', '15'],
        description: 'Debe mostrar Sofia y 15 en la salida con salto de línea'
      }
    ],
    points: 0.8
  },
  // Pregunta 20 – Cálculo del total
  {
    id: 'e_pvl_cd_20',
    type: 'coding',
    moduleId: 6,
    topic: 'Cálculo comercial',
    title: 'Cálculo del total de productos',
    question: `Una persona compra dos productos. Construí un programa que solicite el precio entero de cada producto, calcule el total y muestre cuánto debe pagar.

Ejemplo:
Precio del primer producto: 150
Precio del segundo producto: 250
Total a pagar: 400`,
    starterCode: `# Solicitá el precio de dos productos y calculá el total a pagar:\n\n`,
    solution: `producto1 = int(input("Precio del primer producto: "))
producto2 = int(input("Precio del segundo producto: "))
total = producto1 + producto2
print("Total a pagar:", total)`,
    testCases: [
      {
        name: 'Precios 150 y 250 -> 400',
        inputs: ['150', '250'],
        expectedOutputs: ['400'],
        description: '150 + 250 debe dar 400'
      },
      {
        name: 'Precios 99 y 1 -> 100',
        inputs: ['99', '1'],
        expectedOutputs: ['100'],
        description: '99 + 1 debe dar 100'
      }
    ],
    points: 0.8
  }
];

// ============================================================================
// 3. UTILIDADES DE ALEATORIZACIÓN Y PERSISTENCIA (Requisitos Secciones 1 y 5)
// ============================================================================

/**
 * Algoritmo Fisher-Yates para barajar arreglos de manera no sesgada
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Baraja las opciones de una pregunta de opción múltiple manteniendo sincronizado
 * el índice de la respuesta correcta.
 */
export function shuffleQuestionOptions(q: ExamUnifiedQuestion): ExamUnifiedQuestion {
  if (!q.options || q.options.length === 0 || q.correctAnswer === undefined) {
    return { ...q };
  }

  const originalCorrectText = q.options[q.correctAnswer];
  const indexedOptions = q.options.map((opt, idx) => ({ opt, originalIndex: idx }));

  for (let i = indexedOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
  }

  const shuffledOptions = indexedOptions.map(item => item.opt);
  const newCorrectAnswerIndex = shuffledOptions.indexOf(originalCorrectText);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswerIndex
  };
}

/**
 * Genera una evaluación individual de exactamente 20 actividades:
 * - Las 15 preguntas de opción múltiple del banco.
 * - Los 5 ejercicios prácticos de construcción de código.
 * - Cada evaluación presenta las 20 actividades en un orden aleatorio diferente.
 * - Sin duplicados.
 * - Las opciones de las preguntas de opción múltiple también se barajan.
 * - El orden queda fijado en la sesión para persistir en recargas.
 */
export function generateProgVarsLogicSession(
  student: ExamStudentData,
  attemptNumber?: number
): ActiveExamSession {
  // 1. Preparar las 15 preguntas de opción múltiple con opciones barajadas
  const preparedMC = EXAM_PROG_VARS_LOGIC_MC.map(shuffleQuestionOptions);

  // 2. Preparar los 5 ejercicios prácticos de código
  const preparedCoding = EXAM_PROG_VARS_LOGIC_CODING.map(q => ({
    ...q,
    testCases: q.testCases ? [...q.testCases] : undefined
  }));

  // 3. Mezclar el orden global de las 20 actividades
  const combined = shuffleArray([...preparedMC, ...preparedCoding]);

  // 4. Inicializar mapa de respuestas (con starterCode vacío o plantilla para coding)
  const initialAnswers: Record<string, number | string> = {};
  combined.forEach(q => {
    if (q.type === 'coding') {
      initialAnswers[q.id] = q.starterCode || '';
    }
  });

  const effectiveAttempt = attemptNumber || 1;

  const session: ActiveExamSession = {
    examId: EXAM_PROG_VARS_LOGIC_ID,
    student: {
      ...student,
      attemptNumber: effectiveAttempt
    },
    attemptNumber: effectiveAttempt,
    startTimestamp: Date.now(),
    durationMinutes: EXAM_PROG_VARS_LOGIC_CONFIG.durationMinutes,
    questions: combined,
    answers: initialAnswers,
    submitted: false
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(EXAM_PROG_VARS_LOGIC_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('[ExamProgVarsLogic] Error al persistir sesión activa:', err);
  }

  return session;
}

export function getStoredProgVarsLogicSession(): ActiveExamSession | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(EXAM_PROG_VARS_LOGIC_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.examId === EXAM_PROG_VARS_LOGIC_ID && Array.isArray(parsed.questions)) {
      return parsed as ActiveExamSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearStoredProgVarsLogicSession(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(EXAM_PROG_VARS_LOGIC_STORAGE_KEY);
    }
  } catch {}
}

// ============================================================================
// 4. DEFINICIÓN DEL EXAMEN PARA EL CATÁLOGO GLOBAL
// ============================================================================

export const examProgVarsLogic: Exam = {
  id: EXAM_PROG_VARS_LOGIC_ID,
  title: 'Examen de Programación',
  subtitle: 'Variables, operaciones y lógica',
  description: 'Evaluación individual de 40 minutos con exactamente 20 actividades (15 preguntas de opción múltiple y 5 ejercicios de construcción de código) en orden aleatorio. Máximo 3 intentos por estudiante.',
  modules: [4, 5, 6, 7, 8, 9, 10],
  moduleTitles: [
    'M4: Variables y asignación',
    'M5: Tipos de datos',
    'M6: Operadores aritméticos',
    'M7: Operadores de comparación',
    'M8: Operadores lógicos',
    'M9: Función print()',
    'M10: Función input() y conversiones'
  ],
  durationMinutes: 40,
  available: true,
  totalPoints: 10,
  config: EXAM_PROG_VARS_LOGIC_CONFIG,
  questionBank: [...EXAM_PROG_VARS_LOGIC_MC, ...EXAM_PROG_VARS_LOGIC_CODING]
};
