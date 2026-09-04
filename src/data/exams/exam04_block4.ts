import { Exam } from '../../types/exam';

export const exam04: Exam = {
  id: 'exam-4',
  title: 'Modelo de Examen N.º 4',
  subtitle: 'Toma de Decisiones con if/elif/else y Automatización con bucle for',
  description: 'Evaluación del cuarto bloque (Módulos 10, 11 y 12). Comprueba la habilidad para ramificar la ejecución mediante condicionales, indentación rigurosa, comprensión de la repetición controlada e iteraciones con for y range().',
  modules: [10, 11, 12],
  moduleTitles: [
    'Módulo 10: Introducción a los condicionales',
    'Módulo 11: Introducción a los Loops',
    'Módulo 12: Bucle for'
  ],
  durationMinutes: 40,
  available: false, // 🔒 Próximamente
  totalPoints: 100,
  sections: {
    // PARTE A: TEORÍA (20 PUNTOS)
    partA_theory: [
      {
        id: 'e4_a1',
        question: '¿Qué elementos de sintaxis son OBLIGATORIOS en Python para delimitar un bloque dentro de un if o un bucle for?',
        options: [
          'Encerrar las instrucciones entre llaves { } y finalizar con punto y coma (;).',
          'Los dos puntos (:) al final de la línea de encabezado y una indentación (sangría) uniforme a la derecha para las instrucciones del cuerpo.',
          'Escribir la palabra reservada "end" o "fin" al terminar el bloque.',
          'Colocar todo el bloque en mayúsculas sostenidas.'
        ],
        correctAnswer: 1,
        explanation: 'En Python, los dos puntos (:) inician el bloque y la indentación de 4 espacios define qué código está subordinado al if o al for.',
        points: 10
      },
      {
        id: 'e4_a2',
        question: '¿Qué secuencia exacta de valores generará la función `range(2, 9, 3)`?',
        options: [
          '2, 3, 4, 5, 6, 7, 8, 9',
          '2, 5, 8 (comienza en 2, salta de 3 en 3 y termina antes de 9)',
          '3, 6, 9',
          '2, 9, 3'
        ],
        correctAnswer: 1,
        explanation: 'range(start, stop, step) inicia en 2. Primer valor: 2. Siguiente con paso 3: 5. Siguiente: 8. El próximo sería 11, que supera el límite 9. La secuencia es 2, 5, 8.',
        points: 10
      }
    ],

    // PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) (20 PUNTOS)
    partB_tracing: [
      {
        id: 'e4_b1',
        question: 'Analiza el siguiente bucle con condicional. ¿Qué número se imprimirá al final?',
        codeSnippet: `suma_pares = 0
for n in range(1, 6):
    if n % 2 == 0:
        suma_pares = suma_pares + n
print(suma_pares)`,
        options: [
          '15 (la suma de todos los números del 1 al 5)',
          '6 (la suma de los números pares 2 y 4)',
          '0',
          '20'
        ],
        correctAnswer: 1,
        explanation: 'range(1, 6) evalúa los números 1, 2, 3, 4, 5. El if filtra solo los pares: 2 y 4. Por lo tanto suma_pares = 2 + 4 = 6.',
        points: 10
      },
      {
        id: 'e4_b2',
        question: 'Si ejecutamos este programa con `puntaje = 75`, ¿qué mensaje exacto se mostrará?',
        codeSnippet: `puntaje = 75
if puntaje >= 90:
    print("Excelente")
elif puntaje >= 70:
    print("Bueno")
elif puntaje >= 50:
    print("Regular")
else:
    print("Insuficiente")`,
        options: [
          'Bueno',
          'Bueno y Regular (ambas se cumplen)',
          'Excelente',
          'Regular'
        ],
        correctAnswer: 0,
        explanation: 'Python evalúa de arriba a abajo. Como puntaje >= 90 es falso pero puntaje >= 70 es verdadero (75 >= 70), ejecuta "Bueno" y de inmediato salta fuera de la estructura elif/else.',
        points: 10
      }
    ],

    // PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) (20 PUNTOS)
    partC_debugging: {
      id: 'e4_c1',
      title: 'Corrección de Indentación y Dos Puntos en if/for',
      description: 'El siguiente código contiene dos errores típicos: falta colocar los dos puntos `:` al final del `for` y la línea del `print()` dentro del `if` carece de la sangría (indentación) adecuada. Corrige el programa para que recorra los números del 1 al 4 e imprima únicamente aquellos mayores a 2.',
      buggyCode: `# Corrige los errores en este programa:
for i in range(1, 5)
    if i > 2:
print(i)`,
      solution: `for i in range(1, 5):
    if i > 2:
        print(i)`,
      testCases: [
        {
          name: 'Imprime 3 y 4',
          expectedOutputs: ['3', '4'],
          description: 'Muestra 3 y 4'
        }
      ],
      points: 20
    },

    // PARTE D: PROGRAMACIÓN PRÁCTICA (20 PUNTOS)
    partD_coding: {
      id: 'e4_d1',
      title: 'Clasificador de Tarifas por Edad',
      description: 'Pide al usuario su edad con `edad = int(input("Edad del visitante: "))`.\nEscribe una estructura de condicionales con `if / elif / else`:\n- Si la edad es menor a 12 (`edad < 12`), imprime "Tarifa Infantil: $500".\n- Si la edad es menor a 65 (`edad < 65`), imprime "Tarifa General: $1200".\n- Para cualquier otra edad (adultos mayores), imprime "Tarifa Jubilado: $300".',
      difficulty: 'medio',
      starterCode: `# Pide la edad y clasifica la tarifa con if/elif/else:
`,
      solution: `edad = int(input("Edad del visitante: "))
if edad < 12:
    print("Tarifa Infantil: $500")
elif edad < 65:
    print("Tarifa General: $1200")
else:
    print("Tarifa Jubilado: $300")`,
      testCases: [
        {
          name: 'Edad 8 es Infantil',
          inputs: ['8'],
          expectedOutputs: ['Tarifa Infantil: $500'],
          description: 'Muestra Tarifa Infantil: $500'
        },
        {
          name: 'Edad 25 es General',
          inputs: ['25'],
          expectedOutputs: ['Tarifa General: $1200'],
          description: 'Muestra Tarifa General: $1200'
        },
        {
          name: 'Edad 70 es Jubilado',
          inputs: ['70'],
          expectedOutputs: ['Tarifa Jubilado: $300'],
          description: 'Muestra Tarifa Jubilado: $300'
        }
      ],
      points: 20
    },

    // PARTE E: PROBLEMA INTEGRADOR (20 PUNTOS)
    partE_integrator: {
      id: 'e4_e1',
      title: 'Contador de Calificaciones Aprobadas en un Bucle FOR',
      description: 'Pide al usuario cuántos exámenes desea ingresar con `cantidad = int(input("Cantidad de exámenes: "))`.\nInicia un contador en cero: `aprobados = 0`.\nCon un bucle `for i in range(cantidad):`, pide en cada iteración la nota del examen con `nota = float(input("Nota: "))`.\nDentro del bucle, si `nota >= 6`, suma 1 al contador (`aprobados = aprobados + 1`).\nAl terminar el bucle, imprime con f-string: `f"Total de exámenes aprobados: {aprobados}"`.\n(Nota: Recuerda NO usar while; usa for con range).',
      difficulty: 'integrador',
      starterCode: `# Bucle for con contador condicional de aprobados:
`,
      solution: `cantidad = int(input("Cantidad de exámenes: "))
aprobados = 0
for i in range(cantidad):
    nota = float(input("Nota: "))
    if nota >= 6:
        aprobados = aprobados + 1
print(f"Total de exámenes aprobados: {aprobados}")`,
      testCases: [
        {
          name: '3 exámenes con notas 8, 4, 7 -> 2 aprobados',
          inputs: ['3', '8', '4', '7'],
          expectedOutputs: ['Total de exámenes aprobados: 2'],
          description: 'Muestra Total de exámenes aprobados: 2'
        }
      ],
      points: 20
    }
  }
};
