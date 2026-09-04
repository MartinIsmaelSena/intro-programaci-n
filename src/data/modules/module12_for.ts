import { CourseModule } from '../../types/course';

export const module12: CourseModule = {
  id: 12,
  number: 12,
  title: 'El bucle for',
  subtitle: 'Iteraciones definidas con la función range()',
  description: 'Aprende a controlar la repetición exacta con el bucle for y la función range(): conteos, acumulación de sumas, tablas de multiplicar y filtrado de números pares.',
  icon: '🔄',
  estimatedTime: '40 min',
  category: 'bucles',
  theory: [
    {
      id: 'm12_t1',
      title: '1. Anatomía del bucle `for` y la función `range()`',
      content: 'El bucle `for` toma una variable (muchas veces llamada `i` por "índice" o "iterador") y le va asignando uno por uno los números que genera la función `range()`.\n\n### La función `range()`\nLa función `range(5)` genera una secuencia de 5 números comenzando en **0** y terminando en **4** (¡atención! el número final no se incluye):\n`0, 1, 2, 3, 4`',
      codeExample: {
        code: 'for i in range(5):\n    print("Vuelta número:", i)',
        explanation: 'En la vuelta 1, i vale 0. En la vuelta 2, i vale 1. Así hasta la vuelta 5 donde i vale 4.',
        output: 'Vuelta número: 0\nVuelta número: 1\nVuelta número: 2\nVuelta número: 3\nVuelta número: 4'
      },
      keyTakeaways: [
        'range(N) genera números desde 0 hasta N - 1.',
        'La variable i se actualiza automáticamente en cada iteración.',
        'El cuerpo del bucle debe estar indentado con 4 espacios.'
      ]
    },
    {
      id: 'm12_t2',
      title: '2. Los 3 parámetros de `range(inicio, fin, paso)`',
      content: 'Podemos personalizar el rango con hasta 3 argumentos:\n\n1. `range(5)` ➔ `0, 1, 2, 3, 4` (desde 0 hasta antes de 5).\n2. `range(1, 6)` ➔ `1, 2, 3, 4, 5` (desde 1 hasta antes de 6).\n3. `range(0, 10, 2)` ➔ `0, 2, 4, 6, 8` (el tercer número es el **paso o salto**; va de 2 en 2, ideal para números pares).',
      codeExample: {
        code: '# Números del 1 al 3:\nfor numero in range(1, 4):\n    print(numero)\n\n# De dos en dos:\nfor par in range(2, 7, 2):\n    print("Par:", par)',
        explanation: 'range(1, 4) produce 1, 2 y 3. range(2, 7, 2) salta de 2 en 2: 2, 4, 6.',
        output: '1\n2\n3\nPar: 2\nPar: 4\nPar: 6'
      }
    }
  ],
  quiz: [
    {
      id: 'm12_q1',
      question: '¿Qué números genera exactamente `range(4)`?',
      options: [
        '1, 2, 3, 4',
        '0, 1, 2, 3',
        '0, 1, 2, 3, 4',
        '4, 3, 2, 1'
      ],
      correctAnswer: 1,
      explanation: 'Por defecto comienza siempre en 0 y se detiene justo antes del número indicado (llega hasta 4 - 1 = 3). Son 4 números en total: 0, 1, 2, 3.',
      hint: 'Recordá que en programación empezamos a contar desde el 0.'
    },
    {
      id: 'm12_q2',
      question: 'Si queremos contar del 1 al 10 inclusive, ¿cómo debemos escribir el `range`?',
      options: [
        'range(1, 10)',
        'range(1, 11)',
        'range(0, 10)',
        'range(10)'
      ],
      correctAnswer: 1,
      explanation: 'Como el límite superior nunca se incluye, para llegar al 10 debemos poner 11 como fin: `range(1, 11)`.',
      hint: 'El número final debe ser 1 más que el valor deseado.'
    },
    {
      id: 'm12_q3',
      question: '¿Qué hace el tercer número en `range(1, 10, 2)`?',
      options: [
        'Indica el número de errores permitidos',
        'Es el paso o salto: hace que avance de 2 en 2 (1, 3, 5, 7, 9)',
        'Divide cada número por 2',
        'Multiplica por 2 el total'
      ],
      correctAnswer: 1,
      explanation: 'El tercer argumento es el `step` (paso). Determina cuánto se incrementa la variable en cada iteración.',
      hint: 'Es el tamaño del salto entre números sucesivos.'
    },
    {
      id: 'm12_q4',
      question: '¿Qué imprimirá este código?\nsuma = 0\nfor i in range(1, 4):\n    suma = suma + i\nprint(suma)',
      options: [
        '0',
        '6 (1 + 2 + 3)',
        '10',
        '4'
      ],
      correctAnswer: 1,
      explanation: 'En las 3 vueltas se suma: 0 + 1 = 1; 1 + 2 = 3; 3 + 3 = 6. Al final imprime 6.',
      hint: 'Suma sucesivamente los números 1, 2 y 3.'
    },
    {
      id: 'm12_q5',
      question: '¿Se puede usar cualquier nombre para la variable del bucle en vez de `i`?',
      options: [
        'No, solo la letra i está permitida',
        'Sí, podés usar cualquier nombre válido de variable como "numero", "paso", "item"',
        'Solo letras mayúsculas',
        'Solo palabras de 4 letras'
      ],
      correctAnswer: 1,
      explanation: '`i` es solo una convención clásica, pero podés usar nombres descriptivos como `for producto in ...` o `for numero in ...`.',
      hint: 'Cualquier nombre de variable válido es aceptado.'
    }
  ],
  exercises: [
    {
      id: 'm12_ex1',
      moduleId: 12,
      number: 1,
      title: 'Repetir un mensaje 4 veces',
      description: 'Escribe un bucle `for` que imprima exactamente 4 veces el mensaje "Aprender Python es genial".',
      difficulty: 'starter',
      realWorldContext: 'Envío de notificaciones repetitivas.',
      starterCode: '# Imprime el mensaje 4 veces con un for:\n',
      solution: 'for i in range(4):\n    print("Aprender Python es genial")',
      hints: [
        'for i in range(4):',
        '    print("Aprender Python es genial")'
      ],
      xp: 20,
      testCases: [
        {
          name: '4 mensajes',
          expectedOutputs: ['Aprender Python es genial'],
          description: 'Muestra la frase 4 veces'
        }
      ]
    },
    {
      id: 'm12_ex2',
      moduleId: 12,
      number: 2,
      title: 'Mostrar números del 0 al 4',
      description: 'Escribe un bucle `for` con `range(5)` que imprima el valor de `i` en cada vuelta.',
      difficulty: 'starter',
      realWorldContext: 'Índices de elementos en una lista.',
      starterCode: '# Imprime 0, 1, 2, 3, 4:\n',
      solution: 'for i in range(5):\n    print(i)',
      hints: [
        'for i in range(5):',
        '    print(i)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'De 0 a 4',
          expectedOutputs: ['0', '1', '2', '3', '4'],
          description: 'Muestra los números del 0 al 4'
        }
      ]
    },
    {
      id: 'm12_ex3',
      moduleId: 12,
      number: 3,
      title: 'Contar del 1 al 5',
      description: 'Usa `range(1, 6)` para imprimir los números del 1 al 5 en líneas sucesivas.',
      difficulty: 'starter',
      realWorldContext: 'Conteo humano tradicional empezando en 1.',
      starterCode: '# Imprime del 1 al 5:\n',
      solution: 'for n in range(1, 6):\n    print(n)',
      hints: [
        'for n in range(1, 6):',
        '    print(n)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Del 1 al 5',
          expectedOutputs: ['1', '2', '3', '4', '5'],
          description: 'Muestra 1, 2, 3, 4, 5'
        }
      ]
    },
    {
      id: 'm12_ex4',
      moduleId: 12,
      number: 4,
      title: 'Mostrar números pares con salto (step)',
      description: 'Usa `range(2, 11, 2)` con salto de 2 para imprimir los números pares del 2 al 10: 2, 4, 6, 8, 10.',
      difficulty: 'basic',
      realWorldContext: 'Filtrado directo de posiciones pares.',
      starterCode: '# Números pares del 2 al 10:\n',
      solution: 'for par in range(2, 11, 2):\n    print(par)',
      hints: [
        'for par in range(2, 11, 2):',
        '    print(par)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Pares 2 al 10',
          expectedOutputs: ['2', '4', '6', '8', '10'],
          description: 'Muestra 2, 4, 6, 8, 10'
        }
      ]
    },
    {
      id: 'm12_ex5',
      moduleId: 12,
      number: 5,
      title: 'Suma acumulada del 1 al 5',
      description: 'Crea una variable `total = 0`. Luego haz un bucle `for i in range(1, 6):` que sume `i` a `total` en cada vuelta (`total = total + i`). Al final (fuera del bucle, sin sangría) imprime `total`.',
      difficulty: 'basic',
      realWorldContext: 'Cálculo de sumatoria matemática.',
      starterCode: 'total = 0\n# Bucle que acumula la suma:\n\n# Imprime total fuera del bucle:\n',
      solution: 'total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)',
      hints: [
        'Dentro del bucle: total = total + i',
        'Fuera del bucle (sin espacios): print(total)',
        '1+2+3+4+5 = 15'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Suma total 15',
          expectedOutputs: ['15'],
          description: 'Muestra 15'
        }
      ]
    },
    {
      id: 'm12_ex6',
      moduleId: 12,
      number: 6,
      title: 'Tabla de multiplicar del 5',
      description: 'Genera la tabla del 5 del 1 al 5. En cada iteración imprime con f-string: `f"5 x {i} = {5 * i}"`.',
      difficulty: 'intermediate',
      realWorldContext: 'Herramienta educativa de tablas matemáticas.',
      starterCode: '# Tabla del 5 del 1 al 5:\n',
      solution: 'for i in range(1, 6):\n    print(f"5 x {i} = {5 * i}")',
      hints: [
        'for i in range(1, 6):',
        '    print(f"5 x {i} = {5 * i}")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Tabla del 5',
          expectedOutputs: ['5 x 1 = 5', '5 x 2 = 10', '5 x 5 = 25'],
          description: 'Muestra la tabla del 5'
        }
      ]
    },
    {
      id: 'm12_ex7',
      moduleId: 12,
      number: 7,
      title: 'Cuenta regresiva con paso negativo',
      description: '`range()` también puede retroceder con un paso negativo: `range(5, 0, -1)`. Escribe el bucle e imprime cada número.',
      difficulty: 'intermediate',
      realWorldContext: 'Temporizador de cuenta atrás.',
      starterCode: '# Cuenta regresiva del 5 al 1:\n',
      solution: 'for i in range(5, 0, -1):\n    print(i)',
      hints: [
        'for i in range(5, 0, -1):',
        '    print(i)',
        'Imprimirá 5, 4, 3, 2, 1'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Cuenta regresiva 5 al 1',
          expectedOutputs: ['5', '4', '3', '2', '1'],
          description: 'Muestra 5, 4, 3, 2, 1'
        }
      ]
    },
    {
      id: 'm12_ex8',
      moduleId: 12,
      number: 8,
      title: 'Filtrar pares con IF dentro de un FOR',
      description: 'Recorre los números del 1 al 6 con `for i in range(1, 7):`. Adentro, escribe un `if i % 2 == 0:` para imprimir solamente aquellos números que sean pares.',
      difficulty: 'intermediate',
      realWorldContext: 'Filtro condicional sobre secuencias de datos.',
      starterCode: '# Imprime solo pares entre 1 y 6 usando if adentro del for:\n',
      solution: 'for i in range(1, 7):\n    if i % 2 == 0:\n        print(i)',
      hints: [
        'El if va con 4 espacios adentro del for',
        'El print va con 8 espacios adentro del if: print(i)',
        'Solo mostrará 2, 4, 6'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Pares 2, 4, 6',
          expectedOutputs: ['2', '4', '6'],
          description: 'Muestra 2, 4 y 6'
        }
      ]
    },
    {
      id: 'm12_ex9',
      moduleId: 12,
      number: 9,
      title: 'Contador de elementos aprobados',
      description: 'Tenemos las notas: 4, 8, 2, 9, 6. En cada vuelta de un bucle de 5 notas, cuenta cuántas son aprobadas (>= 6) usando una variable `aprobados = 0`. Simula las 5 notas con una lista o con condicionales y al final imprime `aprobados`.',
      difficulty: 'intermediate',
      realWorldContext: 'Estadísticas de rendimiento académico.',
      starterCode: 'notas = [4, 8, 2, 9, 6]\naprobados = 0\n# Recorre notas, si nota >= 6 suma 1 a aprobados:\nfor nota in notas:\n    if nota >= 6:\n        aprobados = aprobados + 1\nprint(aprobados)\n',
      solution: 'notas = [4, 8, 2, 9, 6]\naprobados = 0\nfor nota in notas:\n    if nota >= 6:\n        aprobados = aprobados + 1\nprint(aprobados)',
      hints: [
        'for nota in notas:',
        '    if nota >= 6: aprobados = aprobados + 1',
        'print(aprobados) mostrará 3'
      ],
      xp: 35,
      testCases: [
        {
          name: '3 aprobados',
          expectedOutputs: ['3'],
          description: 'Muestra 3'
        }
      ]
    },
    {
      id: 'm12_ex10',
      moduleId: 12,
      number: 10,
      title: 'Desafío FOR: Cálculo de Factorial',
      description: 'El factorial de 5 (5!) es `5 * 4 * 3 * 2 * 1 = 120`. Inicia con `factorial = 1`. Con un bucle `for i in range(1, 6):` multiplica `factorial = factorial * i`. Al final imprime `factorial`.',
      difficulty: 'challenge',
      realWorldContext: 'Cálculo combinatorio en estadística y probabilidad.',
      starterCode: 'factorial = 1\n# Calcula el factorial de 5 acumulando multiplicaciones:\n\nprint(factorial)\n',
      solution: 'factorial = 1\nfor i in range(1, 6):\n    factorial = factorial * i\nprint(factorial)',
      hints: [
        'En cada iteración: factorial = factorial * i',
        '1 * 1 * 2 * 3 * 4 * 5 = 120',
        'print(factorial) imprimirá 120'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Factorial 120',
          expectedOutputs: ['120'],
          description: 'Muestra 120'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm12_chal1',
    title: '🚀 Desafío FOR: Generador de Pirámide de Asteriscos',
    description: 'En Python podés multiplicar un texto por un número para repetirlo: `"*" * 3` da `"***"`. Con un bucle `for i in range(1, 5):`, imprime `f"*" * i` para dibujar una pirámide de 4 niveles en consola.',
    bonusXp: 100,
    starterCode: '# Genera la pirámide de 4 pisos:\n',
    solution: 'for i in range(1, 5):\n    print("*" * i)',
    hints: [
      'for i in range(1, 5):',
      '    print("*" * i)',
      'Imprimirá *, **, ***, ****'
    ],
    testCases: [
      {
        name: 'Pirámide de asteriscos',
        expectedOutputs: ['*', '**', '***', '****'],
        description: 'Muestra los 4 pisos de asteriscos'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Sintaxis y funcionamiento del bucle for en Python',
      'La función range() con 1, 2 y 3 argumentos (inicio, fin, paso)',
      'Acumulación de valores (sumatorias y factoriales)',
      'Combinación de for con condicionales if para filtrar datos'
    ],
    congratulationsMessage: '¡Extraordinario! Dominás el bucle for para recorrer números, acumular totales y automatizar cualquier tarea finita.'
  }
};
