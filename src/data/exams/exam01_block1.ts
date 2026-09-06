import { Exam } from '../../types/exam';

export const exam01: Exam = {
  id: 'exam-1',
  title: 'Modelo de Examen N.º 1',
  subtitle: 'Fundamentos, Ecosistema Python y Manejo de Variables',
  description: 'Evaluación de los primeros tres módulos del curso. Comprueba tu dominio sobre el pensamiento algorítmico, las características clave de Python y la creación, manipulación y nombrado de variables en memoria.',
  modules: [1, 2, 3, 4],
  moduleTitles: [
    'Módulo 1: Introducción a la programación',
    'Módulo 2: Fundamentos de la programación',
    'Módulo 3: ¿Qué es Python?',
    'Módulo 4: Variables'
  ],
  durationMinutes: 40,
  available: false, // 🔒 Próximamente (inicialmente bloqueado)
  totalPoints: 100,
  sections: {
    // PARTE A: TEORÍA (20 PUNTOS)
    partA_theory: [
      {
        id: 'e1_a1',
        question: '¿Cuál de las siguientes afirmaciones describe con mayor rigor el concepto de ALGORITMO?',
        options: [
          'Es un circuito electrónico de silicio dentro del procesador central.',
          'Es una secuencia finita, ordenada y sin ambigüedades de pasos para resolver un problema o alcanzar un objetivo.',
          'Es un tipo de archivo comprimido que solo las computadoras más veloces pueden abrir.',
          'Es un comando especial de Python que repara errores automáticamente.'
        ],
        correctAnswer: 1,
        explanation: 'Un algoritmo es una secuencia lógica y ordenada de instrucciones paso a paso para alcanzar una meta.',
        points: 10
      },
      {
        id: 'e1_a2',
        question: 'Respecto a la naturaleza de Python, ¿qué significa que sea un lenguaje "interpretado"?',
        options: [
          'Que el código fuente es ejecutado y traducido instrucción por instrucción en tiempo real por el intérprete sin compilarlo previamente a un binario .exe.',
          'Que solo puede ser leído por personas que hablen inglés como idioma nativo.',
          'Que necesita que un actor de teatro recite las líneas de código.',
          'Que no funciona en ninguna computadora física, solo en la nube.'
        ],
        correctAnswer: 0,
        explanation: 'En Python, el intérprete lee, analiza y ejecuta el código línea por línea en tiempo real.',
        points: 10
      }
    ],

    // PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) (20 PUNTOS)
    partB_tracing: [
      {
        id: 'e1_b1',
        question: 'Observa detenidamente el siguiente código. ¿Cuál será la salida exacta en la terminal al ejecutarse?',
        codeSnippet: `puntos = 10
puntos = 25
puntos = puntos
print(puntos)`,
        options: [
          '10',
          '25',
          '35',
          'Error de sintaxis en puntos = puntos'
        ],
        correctAnswer: 1,
        explanation: 'La variable puntos comenzó en 10, luego fue reasignada a 25. La tercera línea asigna el valor actual (25) nuevamente a puntos. El print muestra 25.',
        points: 10
      },
      {
        id: 'e1_b2',
        question: '¿Qué imprimirá exactamente en pantalla este programa?',
        codeSnippet: `nombre = "Lucas"
rol = "Estudiante"
print(rol, nombre)`,
        options: [
          'Lucas Estudiante',
          'Estudiante Lucas',
          'rol nombre',
          'Error: las variables deben imprimirse en orden alfabético'
        ],
        correctAnswer: 1,
        explanation: 'print(rol, nombre) imprime primero el contenido de rol ("Estudiante"), luego un espacio, y finalmente el contenido de nombre ("Lucas").',
        points: 10
      }
    ],

    // PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) (20 PUNTOS)
    partC_debugging: {
      id: 'e1_c1',
      title: 'Corrección de Nombres y Asignación de Variables',
      description: 'El siguiente programa contiene dos errores típicos de un programador principiante: un nombre de variable que comienza con un número prohibido (2da_posicion) y un texto al que le faltan las comillas. Corrige el código para que defina `posicion = "Oro"` y `premio = 5000`, e imprima ambas variables con print.',
      buggyCode: `# Corrige los errores en este código:
2da_posicion = Oro
premio = 5000
print(2da_posicion)
print(premio)`,
      solution: `posicion = "Oro"
premio = 5000
print(posicion)
print(premio)`,
      testCases: [
        {
          name: 'Variables corregidas y valores impresos',
          expectedOutputs: ['Oro', '5000'],
          description: 'Muestra Oro y 5000'
        }
      ],
      points: 20
    },

    // PARTE D: PROGRAMACIÓN PRÁCTICA (20 PUNTOS)
    partD_coding: {
      id: 'e1_d1',
      title: 'Modelado de un Perfil de Jugador',
      description: 'Escribe un programa que cree las siguientes 3 variables siguiendo la convención snake_case:\n1. `alias_jugador` con el texto "PythonPro"\n2. `nivel_inicial` con el número 1\n3. `energia` con el número 100\nLuego, imprime cada una de las 3 variables en líneas separadas usando print().',
      difficulty: 'medio',
      starterCode: `# Define las 3 variables solicitadas e imprímelas:
`,
      solution: `alias_jugador = "PythonPro"
nivel_inicial = 1
energia = 100
print(alias_jugador)
print(nivel_inicial)
print(energia)`,
      testCases: [
        {
          name: 'Datos del jugador impresos',
          expectedOutputs: ['PythonPro', '1', '100'],
          description: 'Muestra PythonPro, 1 y 100'
        }
      ],
      points: 20
    },

    // PARTE E: PROBLEMA INTEGRADOR (20 PUNTOS)
    partE_integrator: {
      id: 'e1_e1',
      title: 'Simulación de Intercambio de Inventario',
      description: 'En un juego de rol, dos personajes intercambian sus armas principales.\nPersonaje 1 tiene `arma1 = "Espada"` y Personaje 2 tiene `arma2 = "Arco"`.\nUtiliza una variable auxiliar `arma_temporal` para intercambiar los contenidos de ambas variables (de modo que arma1 termine teniendo "Arco" y arma2 termine teniendo "Espada").\nFinalmente, imprime `arma1` y en la siguiente línea `arma2`. (Recuerda: NO uses condicionales ni funciones aún no vistas).',
      difficulty: 'integrador',
      starterCode: `arma1 = "Espada"
arma2 = "Arco"

# Realiza el intercambio utilizando arma_temporal:

# Imprime arma1 y arma2 actualizadas:
`,
      solution: `arma1 = "Espada"
arma2 = "Arco"
arma_temporal = arma1
arma1 = arma2
arma2 = arma_temporal
print(arma1)
print(arma2)`,
      testCases: [
        {
          name: 'Armas correctamente intercambiadas',
          expectedOutputs: ['Arco', 'Espada'],
          description: 'arma1 es Arco y arma2 es Espada'
        }
      ],
      points: 20
    }
  }
};
