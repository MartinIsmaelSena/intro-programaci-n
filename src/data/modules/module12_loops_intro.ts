import { CourseModule } from '../../types/course';

export const module12: CourseModule = {
  id: 12,
  number: 12,
  title: 'Introducción a los Loops (Bucles)',
  subtitle: 'El poder de la repetición y la automatización',
  description: 'Comprende el concepto fundamental de bucle: por qué no tiene sentido escribir la misma línea 100 veces a mano y cómo las computadoras automatizan tareas repetitivas en milisegundos.',
  icon: '🔁',
  estimatedTime: '25 min',
  category: 'bucles',
  theory: [
    {
      id: 'm11_t1',
      title: '1. ¿Qué es un bucle y por qué lo necesitamos?',
      content: 'Imagina que tu jefe o tu profesor te pide enviar un mensaje a 1.000 clientes o mostrar los números del 1 al 1.000 en la pantalla.\n\nSin bucles, tendrías que escribir:\n```python\nprint(1)\nprint(2)\nprint(3)\n# ... ¡997 líneas más!\nprint(1000)\n```\nEscribir eso sería aburrido, agotador, lento y una pésima práctica. Los seres humanos nos cansamos de hacer tareas repetitivas; las computadoras, en cambio, **adoran la repetición y no se cansan jamás**.',
      analogy: {
        title: 'Analogía: Saltar la soga o dar vueltas a la pista',
        description: 'En el mundo físico encontramos dos tipos claros de repetición:',
        steps: [
          'Repetición por cantidad fija: "Voy a dar exactamente 5 vueltas a la manzana". Sabemos de antemano cuántas vueltas daremos (esto es un bucle FOR).',
          'Repetición condicionada: "Voy a seguir corriendo HASTA QUE me canse (o mientras tenga energía)". No sabemos el número exacto de vueltas, depende de una condición que cambia con el tiempo (esto es un bucle WHILE).'
        ]
      },
      keyTakeaways: [
        'Un bucle (loop) ejecuta un mismo bloque de código una y otra vez de forma automática.',
        'Ahorra cientos de líneas de código y evita errores humanos por duplicación.',
        'El principio de programación DRY: "Don\'t Repeat Yourself" (No te repitas).'
      ]
    },
    {
      id: 'm11_t2',
      title: '2. Los dos grandes tipos de bucles: `for` y `while`',
      content: 'En los próximos dos módulos profundizaremos en los dos reyes de la repetición en Python:\n\n* 🔄 **Bucle `for` (Repetición definida):** Lo usamos cuando sabemos cuántas veces queremos repetir algo o cuando queremos recorrer cada elemento de una lista o secuencia (ej: "por cada producto del carrito, calcula su precio").\n* ♻️ **Bucle `while` (Repetición condicionada):** Lo usamos cuando queremos que algo se repita *mientras* una condición sea verdadera (ej: "mientras el usuario no escriba la contraseña correcta, vuelve a pedirla").',
      codeExample: {
        code: '# En vez de escribir 5 prints manuales:\n# Con un bucle for lo hacemos en 2 líneas:\nfor i in range(5):\n    print("Hola, Python!")',
        explanation: 'En solo dos líneas, Python repite la instrucción tantas veces como le ordenes.',
        output: 'Hola, Python!\nHola, Python!\nHola, Python!\nHola, Python!\nHola, Python!'
      }
    }
  ],
  quiz: [
    {
      id: 'm11_q1',
      question: '¿Cuál es el propósito principal de un bucle o loop en programación?',
      options: [
        'Apagar la computadora cuando termina de hacer cálculos',
        'Repetir una serie de instrucciones de forma automática sin reescribir el código',
        'Cambiar los colores de la pantalla',
        'Acelerar la conexión a internet'
      ],
      correctAnswer: 1,
      explanation: 'Los bucles permiten automatizar la ejecución repetida de un bloque de código tantas veces como sea necesario.',
      hint: 'Pensá en evitar copiar y pegar la misma línea muchas veces.'
    },
    {
      id: 'm11_q2',
      question: '¿Qué significa el principio pedagógico DRY en programación?',
      options: [
        'Do Repeat Yourself (Repite tu código siempre)',
        'Don\'t Repeat Yourself (No te repitas a ti mismo)',
        'Data Ready Year (Datos listos cada año)',
        'Download Real Youtube'
      ],
      correctAnswer: 1,
      explanation: 'DRY busca evitar la duplicación de lógica. Si tienes código repetido, casi siempre la solución ideal es un bucle o una función.',
      hint: 'Se enfoca en no duplicar código innecesariamente.'
    },
    {
      id: 'm11_q3',
      question: '¿Cuándo es más conveniente utilizar un bucle `for`?',
      options: [
        'Cuando sabemos de antemano cuántas veces queremos iterar o queremos recorrer una colección',
        'Cuando no tenemos idea de cuándo terminará el programa',
        'Solo cuando hay errores en el código',
        'Únicamente para restar números negativos'
      ],
      correctAnswer: 0,
      explanation: 'El bucle `for` es ideal para repeticiones con una cantidad determinada de pasos (con `range`) o para recorrer secuencias.',
      hint: 'Recordá la analogía de las 5 vueltas a la manzana.'
    },
    {
      id: 'm11_q4',
      question: '¿Cuándo es más conveniente utilizar un bucle `while`?',
      options: [
        'Cuando queremos repetir instrucciones mientras se cumpla una condición específica que no sabemos cuándo cambiará',
        'Solo cuando el usuario presiona el botón rojo',
        'Cuando queremos escribir menos de 2 letras',
        'Nunca, está en desuso'
      ],
      correctAnswer: 0,
      explanation: '`while` (mientras) se utiliza cuando el número de repeticiones depende de un estado dinámico (por ejemplo, reintentar hasta que la contraseña sea correcta).',
      hint: 'Recordá correr mientras tengas energía.'
    },
    {
      id: 'm11_q5',
      question: '¿Qué es una "iteración"?',
      options: [
        'Una marca de procesadores',
        'Cada una de las vueltas o repeticiones individuales que realiza un bucle',
        'Un virus de correo electrónico',
        'Un cable de red'
      ],
      correctAnswer: 1,
      explanation: 'En ciencias de la computación, una "iteración" es el acto de ejecutar una vez el cuerpo o bloque del bucle.',
      hint: 'Es sinónimo de cada vuelta del ciclo.'
    },
    {
      id: 'm11_q6',
      question: 'Si queremos procesar una lista de 50 facturas, ¿cuántas iteraciones hará el bucle?',
      options: [
        '1 sola',
        '50 iteraciones (una por cada factura)',
        '500 iteraciones',
        'Infinitas'
      ],
      correctAnswer: 1,
      explanation: 'Hará 50 iteraciones: una vuelta por cada factura a procesar.',
      hint: 'Una iteración por elemento.'
    },
    {
      id: 'm11_q7',
      question: '¿Qué peligro existe al programar un bucle si la condición de salida nunca llega a cumplirse?',
      options: [
        'La computadora explota físicamente',
        'Un bucle infinito (el programa se cuelga y nunca termina de repetirse)',
        'El código se borra solo',
        'Se desconecta el teclado'
      ],
      correctAnswer: 1,
      explanation: 'Un bucle infinito ocurre cuando la condición siempre permanece verdadera. El programa queda atrapado consumiendo recursos hasta que se lo detiene forzosamente.',
      hint: 'Pensá en qué pasa si nunca salís del ciclo.'
    },
    {
      id: 'm11_q8',
      question: '¿En cuál de estos casos reales usarías un bucle?',
      options: [
        'Pedir la fecha de nacimiento una sola vez al registrarte',
        'Revisar 10.000 comentarios para detectar palabras ofensivas',
        'Declarar tu nombre como variable',
        'Definir que el número PI es 3.14'
      ],
      correctAnswer: 1,
      explanation: 'Revisar miles de comentarios uno a uno es la tarea por excelencia para un bucle automatizado.',
      hint: 'Buscá la tarea masiva y repetitiva.'
    },
    {
      id: 'm11_q9',
      question: '¿Qué ocurre con la memoria y el esfuerzo del programador al usar bucles?',
      options: [
        'El código es más corto, elegante, fácil de corregir y más rápido de escribir',
        'El programa se hace 100 veces más largo',
        'Aumenta el riesgo de confundirse con números manuales',
        'No cambia absolutamente nada'
      ],
      correctAnswer: 0,
      explanation: 'Los bucles reducen el código a unas pocas líneas reutilizables y permiten cambiar la cantidad de repeticiones modificando un solo número.',
      hint: 'La automatización es el mayor superpoder del programador.'
    },
    {
      id: 'm11_q10',
      question: 'En Python, las instrucciones que se repiten dentro del bucle:',
      options: [
        'Van pegadas al margen izquierdo sin espacios',
        'Llevan sangría o indentación (4 espacios a la derecha) respecto al for o while',
        'Van dentro de un archivo separado',
        'Se escriben todas en mayúsculas'
      ],
      correctAnswer: 1,
      explanation: 'Al igual que en los condicionales `if`, en los bucles la indentación es la que le indica a Python qué líneas pertenecen al ciclo repetitivo.',
      hint: 'Recordá la regla de oro de la indentación en Python.'
    }
  ],
  exercises: [
    {
      id: 'm11_ex1',
      moduleId: 12,
      number: 1,
      title: 'Comparación: Repetición manual',
      description: 'Muestra tres veces la palabra "Repetición" escribiendo tres líneas con `print("Repetición")` consecutivas.',
      difficulty: 'starter',
      realWorldContext: 'Visualización del método manual antes de automatizar.',
      starterCode: '# Muestra 3 veces "Repetición" con print:\n',
      solution: 'print("Repetición")\nprint("Repetición")\nprint("Repetición")',
      hints: [
        'Escribe 3 veces print("Repetición") una debajo de la otra'
      ],
      xp: 20,
      testCases: [
        {
          name: '3 repeticiones',
          expectedOutputs: ['Repetición', 'Repetición', 'Repetición'],
          description: 'Muestra 3 veces la palabra'
        }
      ]
    },
    {
      id: 'm11_ex2',
      moduleId: 12,
      number: 2,
      title: 'Tu primer bucle de prueba',
      description: 'Escribe tu primer bucle `for` de dos líneas para imprimir "Python es poderoso" 3 veces:\n`for i in range(3):`\n`    print("Python es poderoso")`',
      difficulty: 'starter',
      realWorldContext: 'Primer contacto práctico con la sintaxis de repetición.',
      starterCode: '# Escribe el bucle for de 3 vueltas:\n',
      solution: 'for i in range(3):\n    print("Python es poderoso")',
      hints: [
        'Primera línea: for i in range(3):',
        'Segunda línea con 4 espacios:     print("Python es poderoso")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Bucle ejecutado 3 veces',
          expectedOutputs: ['Python es poderoso'],
          description: 'Muestra la frase 3 veces'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm11_chal1',
    title: '🚀 Desafío Conceptual: Conteo regresivo visual',
    description: 'Imprime en pantalla la secuencia de despegue con tres prints:\n"3"\n"2"\n"1"\n"¡Despegue!"',
    bonusXp: 100,
    badgeId: 'loop_repeater',
    starterCode: '# Cuenta regresiva:\n',
    solution: 'print("3")\nprint("2")\nprint("1")\nprint("¡Despegue!")',
    hints: [
      'Imprime 3, luego 2, luego 1 y al final ¡Despegue!'
    ],
    testCases: [
      {
        name: 'Despegue',
        expectedOutputs: ['3', '2', '1', '¡Despegue!'],
        description: 'Muestra el conteo de despegue'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Qué es un bucle y por qué la automatización es la base del software',
      'El principio DRY (Don\'t Repeat Yourself)',
      'Diferencia entre repetición definida (for) y condicionada (while)',
      'Qué es una iteración y qué es un bucle infinito'
    ],
    congratulationsMessage: '¡Excelente! Comprendés la teoría detrás de los bucles. En el próximo módulo dominaremos el bucle for paso a paso.'
  }
};
