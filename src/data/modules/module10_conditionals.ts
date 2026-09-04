import { CourseModule } from '../../types/course';

export const module10: CourseModule = {
  id: 10,
  number: 10,
  title: 'Introducción a los condicionales',
  subtitle: 'Toma de decisiones en código: if, elif y else',
  description: 'Aprende a dotar a tus programas de inteligencia y capacidad de decisión para que elijan caminos diferentes según se cumplan o no determinadas condiciones.',
  icon: '🧠',
  estimatedTime: '40 min',
  category: 'control',
  theory: [
    {
      id: 'm10_t1',
      title: '1. Las computadoras toman decisiones: El concepto de bifurcación',
      content: 'Hasta este momento, nuestros programas eran como una línea recta: cada instrucción se ejecutaba de arriba hacia abajo sin excepciones. Pero el mundo real está lleno de **decisiones**.\n\nEn la vida real decidimos según el contexto:\n- *Si llueve* ➔ Llevo paraguas.\n- *Si no llueve* ➔ No llevo paraguas.\n\nEn Python, esta estructura de decisión se escribe con las palabras clave **`if` (si)** y **`else` (si no)**.',
      analogy: {
        title: 'Analogía del semáforo',
        description: 'Cuando llegas a una esquina con semáforo:',
        steps: [
          'Si la luz está en verde ➔ Avanzas.',
          'Si la luz está en amarillo ➔ Reduces la velocidad y te preparas para frenar.',
          'Si no (rojo) ➔ Te detienes por completo.'
        ]
      },
      codeExample: {
        code: 'edad = 18\n\nif edad >= 18:\n    print("Sos mayor de edad")\nelse:\n    print("Sos menor de edad")',
        explanation: 'Fíjate en dos detalles cruciales de Python: los dos puntos (:) al final de la condición, y los 4 espacios de sangría (indentación) en el bloque de código.',
        output: 'Sos mayor de edad'
      },
      keyTakeaways: [
        'if condición: evalúa si la condición es True.',
        'Los dos puntos (:) son obligatorios al final de cada cláusula if, elif o else.',
        'Las instrucciones dentro del bloque DEBEN estar indentadas con 4 espacios o Tab.'
      ]
    },
    {
      id: 'm10_t2',
      title: '2. Múltiples alternativas con `elif`',
      content: 'Cuando tenemos más de dos opciones posibles, usamos `elif` (abreviatura de *else if* / *si no, pero si...*).\n\nPython evalúa las condiciones de arriba hacia abajo: en cuanto encuentra la **primera que sea verdadera**, ejecuta su bloque y salta el resto.',
      codeExample: {
        code: 'nota = 8\n\nif nota >= 9:\n    print("Excelente calificación")\nelif nota >= 6:\n    print("Aprobado")\nelse:\n    print("Debes recuperar")',
        explanation: 'Como nota es 8, la primera condición (>= 9) es falsa, pero la segunda (>= 6) es verdadera. Imprime "Aprobado" y omite el else.',
        output: 'Aprobado'
      },
      keyTakeaways: [
        'Podés tener tantos elif como condiciones necesites.',
        'El bloque else es opcional y actúa como red de seguridad si ninguna condición previa se cumplió.',
        'Podés usar operadores lógicos (and, or, not) dentro de la condición del if.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm10_q1',
      question: '¿Qué símbolo es OBLIGATORIO colocar al final de una línea `if`, `elif` o `else` en Python?',
      options: [
        'Punto y coma (;)',
        'Dos puntos (:)',
        'Llave de apertura ({)',
        'Signo de pregunta (?)'
      ],
      correctAnswer: 1,
      explanation: 'En Python los dos puntos `:` indican el inicio de un bloque de código anidado.',
      hint: 'Es el signo de puntuación formado por dos puntos verticales.'
    },
    {
      id: 'm10_q2',
      question: '¿Cómo sabe Python qué líneas de código pertenecen al interior de un `if`?',
      options: [
        'Por la indentación (sangría de espacios hacia la derecha)',
        'Porque van escritas entre paréntesis ()',
        'Porque terminan con la palabra "fin"',
        'Por el color del texto'
      ],
      correctAnswer: 0,
      explanation: 'A diferencia de otros lenguajes que usan llaves {}, Python utiliza la indentación obligatoria para definir la estructura de bloques.',
      hint: 'Recordá la importancia de los 4 espacios o tecla Tab.'
    },
    {
      id: 'm10_q3',
      question: '¿Para qué sirve la cláusula `elif`?',
      options: [
        'Para borrar variables de la memoria',
        'Para evaluar una condición alternativa si la condición anterior fue falsa',
        'Para repetir un código 10 veces',
        'Para imprimir en la impresora física'
      ],
      correctAnswer: 1,
      explanation: '`elif` es la contracción de "else if": permite encadenar múltiples decisiones secuenciales.',
      hint: 'Es la alternativa intermedia entre if y else.'
    },
    {
      id: 'm10_q4',
      question: 'Si ejecutamos:\nx = 5\nif x > 10:\n    print("A")\nelse:\n    print("B")\n¿Qué se imprimirá?',
      options: [
        'A',
        'B',
        'A y B',
        'Nada'
      ],
      correctAnswer: 1,
      explanation: 'Como 5 > 10 es False, la rama `if` no se ejecuta y el flujo salta directamente al bloque `else`, imprimiendo "B".',
      hint: '¿5 es mayor que 10?'
    },
    {
      id: 'm10_q5',
      question: '¿Es obligatorio que todo `if` tenga siempre un `else`?',
      options: [
        'Sí, sin else siempre da error',
        'No, el else es opcional y solo se coloca si queremos hacer algo cuando la condición sea falsa',
        'Solo si hay más de 3 variables',
        'Depende de si el número es par o impar'
      ],
      correctAnswer: 1,
      explanation: 'Podemos usar un `if` solitario si únicamente queremos reaccionar cuando la condición sea verdadera.',
      hint: 'A veces solo queremos actuar si algo ocurre.'
    }
  ],
  exercises: [
    {
      id: 'm10_ex1',
      moduleId: 10,
      number: 1,
      title: 'Condicional simple: Mayoría de edad',
      description: 'Crea `edad = 20`. Escribe un condicional: si `edad >= 18`, imprime "Acceso permitido".',
      difficulty: 'starter',
      realWorldContext: 'Control de acceso a contenidos.',
      starterCode: 'edad = 20\n# Escribe el condicional if:\n',
      solution: 'edad = 20\nif edad >= 18:\n    print("Acceso permitido")',
      hints: [
        'if edad >= 18:',
        '    print("Acceso permitido")',
        'No te olvides de los dos puntos (:) ni de los 4 espacios de sangría'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Acceso permitido',
          expectedOutputs: ['Acceso permitido'],
          description: 'Muestra Acceso permitido'
        }
      ]
    },
    {
      id: 'm10_ex2',
      moduleId: 10,
      number: 2,
      title: 'Decisión doble con if / else',
      description: 'Crea `llueve = True`. Si `llueve` es True, imprime "Llevar paraguas", si no (else), imprime "Dia despejado".',
      difficulty: 'starter',
      realWorldContext: 'App meteorológica de sugerencias cotidianas.',
      starterCode: 'llueve = True\n# Condicional if/else:\n',
      solution: 'llueve = True\nif llueve:\n    print("Llevar paraguas")\nelse:\n    print("Dia despejado")',
      hints: [
        'if llueve:',
        '    print("Llevar paraguas")',
        'else:\n    print("Dia despejado")'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Llevar paraguas',
          expectedOutputs: ['Llevar paraguas'],
          description: 'Muestra Llevar paraguas'
        }
      ]
    },
    {
      id: 'm10_ex3',
      moduleId: 10,
      number: 3,
      title: 'Número positivo o negativo',
      description: 'Crea `numero = -5`. Si `numero >= 0`, imprime "Positivo", de lo contrario imprime "Negativo".',
      difficulty: 'basic',
      realWorldContext: 'Verificación de saldos bancarios a favor o en rojo.',
      starterCode: 'numero = -5\n# Verifica positivo o negativo:\n',
      solution: 'numero = -5\nif numero >= 0:\n    print("Positivo")\nelse:\n    print("Negativo")',
      hints: [
        'if numero >= 0:\n    print("Positivo")',
        'else:\n    print("Negativo")',
        'Como es -5, imprimirá Negativo'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Negativo',
          expectedOutputs: ['Negativo'],
          description: 'Muestra Negativo'
        }
      ]
    },
    {
      id: 'm10_ex4',
      moduleId: 10,
      number: 4,
      title: 'Semáforo vial con elif',
      description: 'Crea `luz = "amarillo"`. Si `luz == "verde"`, imprime "Avanzar". Si `luz == "amarillo"`, imprime "Precaución". Si no (else), imprime "Detenerse".',
      difficulty: 'basic',
      realWorldContext: 'Controlador lógico de tránsito urbano.',
      starterCode: 'luz = "amarillo"\n# Evalúa las 3 luces del semáforo:\n',
      solution: 'luz = "amarillo"\nif luz == "verde":\n    print("Avanzar")\nelif luz == "amarillo":\n    print("Precaución")\nelse:\n    print("Detenerse")',
      hints: [
        'Usa if luz == "verde":',
        'elif luz == "amarillo":\n    print("Precaución")',
        'else:\n    print("Detenerse")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Precaución',
          expectedOutputs: ['Precaución'],
          description: 'Muestra Precaución'
        }
      ]
    },
    {
      id: 'm10_ex5',
      moduleId: 10,
      number: 5,
      title: 'Determinar si un número es Par o Impar',
      description: 'Crea `n = 8`. Si `n % 2 == 0`, imprime "Par", de lo contrario imprime "Impar".',
      difficulty: 'basic',
      realWorldContext: 'Algoritmo de clasificación numérica.',
      starterCode: 'n = 8\n# Verifica par o impar con %:\n',
      solution: 'n = 8\nif n % 2 == 0:\n    print("Par")\nelse:\n    print("Impar")',
      hints: [
        'if n % 2 == 0:\n    print("Par")',
        'else:\n    print("Impar")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Par',
          expectedOutputs: ['Par'],
          description: 'Muestra Par'
        }
      ]
    },
    {
      id: 'm10_ex6',
      moduleId: 10,
      number: 6,
      title: 'Calificación con 3 escalas de notas',
      description: 'Crea `nota = 7`. Si `nota >= 8`, imprime "Distinguido". Si `nota >= 6`, imprime "Aprobado". Si no, imprime "Reprobado".',
      difficulty: 'intermediate',
      realWorldContext: 'Boletín de calificaciones estudiantiles.',
      starterCode: 'nota = 7\n# Escalas de nota:\n',
      solution: 'nota = 7\nif nota >= 8:\n    print("Distinguido")\nelif nota >= 6:\n    print("Aprobado")\nelse:\n    print("Reprobado")',
      hints: [
        'if nota >= 8:',
        'elif nota >= 6:',
        'else:'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Aprobado',
          expectedOutputs: ['Aprobado'],
          description: 'Muestra Aprobado'
        }
      ]
    },
    {
      id: 'm10_ex7',
      moduleId: 10,
      number: 7,
      title: 'Condiciones compuestas con AND dentro de IF',
      description: 'Un postulante necesita `edad = 22` y `experiencia = 2` (en años). Si `edad >= 18 and experiencia >= 1`, imprime "Candidato calificado", si no, "No cumple requisitos".',
      difficulty: 'intermediate',
      realWorldContext: 'Filtro automático de selección en recursos humanos.',
      starterCode: 'edad = 22\nexperiencia = 2\n# Evalúa los requisitos:\n',
      solution: 'edad = 22\nexperiencia = 2\nif edad >= 18 and experiencia >= 1:\n    print("Candidato calificado")\nelse:\n    print("No cumple requisitos")',
      hints: [
        'if edad >= 18 and experiencia >= 1:\n    print("Candidato calificado")',
        'else:\n    print("No cumple requisitos")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Candidato calificado',
          expectedOutputs: ['Candidato calificado'],
          description: 'Muestra Candidato calificado'
        }
      ]
    },
    {
      id: 'm10_ex8',
      moduleId: 10,
      number: 8,
      title: 'Descuento especial de tienda con OR',
      description: 'Una compra tiene descuento si el cliente es "socio" o si compró más de 10 productos: `es_socio = False`, `productos = 12`. Si `es_socio or productos > 10`, imprime "Tiene 15% de descuento", si no, imprime "Precio regular".',
      difficulty: 'intermediate',
      realWorldContext: 'Motor de descuentos en carrito de compras.',
      starterCode: 'es_socio = False\nproductos = 12\n# Aplica regla de descuento con OR:\n',
      solution: 'es_socio = False\nproductos = 12\nif es_socio or productos > 10:\n    print("Tiene 15% de descuento")\nelse:\n    print("Precio regular")',
      hints: [
        'if es_socio or productos > 10:\n    print("Tiene 15% de descuento")',
        'else:\n    print("Precio regular")'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Tiene 15% de descuento',
          expectedOutputs: ['Tiene 15% de descuento'],
          description: 'Muestra Tiene 15% de descuento'
        }
      ]
    },
    {
      id: 'm10_ex9',
      moduleId: 10,
      number: 9,
      title: 'Sistema de Login interactivo con input()',
      description: 'Pide al usuario la contraseña con `clave = input("Contraseña: ")`. Si `clave == "secreto123"`, imprime "Bienvenido al panel", si no, imprime "Contraseña incorrecta".',
      difficulty: 'intermediate',
      realWorldContext: 'Pantalla de autenticación básica.',
      starterCode: '# Pide clave y valida:\n',
      solution: 'clave = input("Contraseña: ")\nif clave == "secreto123":\n    print("Bienvenido al panel")\nelse:\n    print("Contraseña incorrecta")',
      hints: [
        'clave = input("Contraseña: ")',
        'if clave == "secreto123":',
        '    print("Bienvenido al panel")',
        'else:\n    print("Contraseña incorrecta")'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Login exitoso',
          inputs: ['secreto123'],
          expectedOutputs: ['Bienvenido al panel'],
          description: 'Valida clave correcta'
        },
        {
          name: 'Login fallido',
          inputs: ['otra'],
          expectedOutputs: ['Contraseña incorrecta'],
          description: 'Rechaza clave incorrecta'
        }
      ]
    },
    {
      id: 'm10_ex10',
      moduleId: 10,
      number: 10,
      title: 'Desafío de Condicionales: Clasificador de edades',
      description: 'Pide la edad con `edad = int(input("Edad: "))`. Si `edad < 13`, imprime "Niño". Si `edad < 18`, imprime "Adolescente". Si `edad < 65`, imprime "Adulto". De lo contrario (else), imprime "Adulto mayor".',
      difficulty: 'challenge',
      realWorldContext: 'Segmentación etaria para encuestas y estadísticas.',
      starterCode: '# Clasifica según la edad ingresada:\n',
      solution: 'edad = int(input("Edad: "))\nif edad < 13:\n    print("Niño")\nelif edad < 18:\n    print("Adolescente")\nelif edad < 65:\n    print("Adulto")\nelse:\n    print("Adulto mayor")',
      hints: [
        'Usa int(input())',
        'Encadena los elif en orden ascendente: < 13, < 18, < 65, else',
        'Comprueba con edad 15: debe imprimir "Adolescente"'
      ],
      xp: 50,
      testCases: [
        {
          name: '15 años es Adolescente',
          inputs: ['15'],
          expectedOutputs: ['Adolescente'],
          description: 'Muestra Adolescente'
        },
        {
          name: '8 años es Niño',
          inputs: ['8'],
          expectedOutputs: ['Niño'],
          description: 'Muestra Niño'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm10_chal1',
    title: '🚀 Desafío de Condicionales: Verificador de Año Bisiesto',
    description: 'Un año es bisiesto si es divisible por 4 pero no por 100, O si es divisible por 400: `es_bisiesto = (anio % 4 == 0 and anio % 100 != 0) or (anio % 400 == 0)`. Con `anio = 2024`, imprime "Bisiesto" si se cumple o "No bisiesto" si no.',
    bonusXp: 100,
    badgeId: 'decision_maker',
    starterCode: 'anio = 2024\n# Comprueba si 2024 es bisiesto:\n',
    solution: 'anio = 2024\nif (anio % 4 == 0 and anio % 100 != 0) or (anio % 400 == 0):\n    print("Bisiesto")\nelse:\n    print("No bisiesto")',
    hints: [
      '2024 es divisible por 4 y no por 100, por lo que es bisiesto',
      'El programa debe imprimir Bisiesto'
    ],
    testCases: [
      {
        name: '2024 es Bisiesto',
        expectedOutputs: ['Bisiesto'],
        description: 'Muestra Bisiesto'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Concepto de bifurcación y toma de decisiones con if',
      'La cláusula else para el camino alternativo',
      'Múltiples opciones encadenadas con elif',
      'Reglas de indentación y dos puntos (:)',
      'Uso de operadores de comparación y lógicos dentro de las condiciones'
    ],
    congratulationsMessage: '¡Sensacional! Tus programas ahora tienen discernimiento propio y pueden tomar decisiones inteligentes.'
  }
};
