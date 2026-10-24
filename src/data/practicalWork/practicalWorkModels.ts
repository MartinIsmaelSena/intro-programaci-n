import { ExamUnifiedQuestion } from '../../types/exam';
import { TPModelType } from '../../types/practicalWorkSession';

// ============================================================================
// BANCO DE PREGUNTAS Y EJERCICIOS PARA TRABAJO PRÁCTICO (3 MODELOS)
// Cada modelo consta de 8 preguntas teóricas (0.5 pts c/u = 4.0 pts)
// y 4 ejercicios prácticos (1.5 pts c/u = 6.0 pts) para un total de 10.0 pts.
// ============================================================================

// --- MODELO A ---
export const TP_QUESTIONS_MODEL_A: ExamUnifiedQuestion[] = [
  // Teoría 1: Introducción a Python
  {
    id: 'tp_a_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Introducción a Python',
    question: '¿Qué es Python y cuál es una de sus principales características?',
    options: [
      'Es un lenguaje de programación de alto nivel, con sintaxis clara y fácil de aprender.',
      'Es un sistema operativo exclusivo para servidores de bases de datos.',
      'Es un programa de diseño gráfico para crear páginas web estáticas.',
      'Es un tipo de dato numérico que solo admite números enteros positivos.'
    ],
    correctAnswer: 0,
    explanation: 'Python es un lenguaje de programación de propósito general y alto nivel, reconocido por su legibilidad, simpleza y amplia aplicación en ciencia de datos, desarrollo web y automatización.',
    points: 0.5
  },
  // Teoría 2: Tipos de datos
  {
    id: 'tp_a_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿A qué tipos de datos pertenecen los valores 25, 3.14 y "Hola"?',
    options: [
      'int, float y str respectivamente.',
      'float, int y bool respectivamente.',
      'str, float y int respectivamente.',
      'int, bool y str respectivamente.'
    ],
    correctAnswer: 0,
    explanation: 'En Python, los números enteros son de tipo int (25), los números con decimales son float (3.14) y los textos entre comillas son str ("Hola").',
    points: 0.5
  },
  // Teoría 3: Variables y Asignación
  {
    id: 'tp_a_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Variables y Asignación',
    question: '¿Cuál es la forma correcta de crear una variable llamada puntaje con el valor 100?',
    options: [
      'puntaje = 100',
      '100 = puntaje',
      'puntaje == 100',
      'variable puntaje : 100'
    ],
    correctAnswer: 0,
    explanation: 'En Python la asignación se realiza colocando el nombre de la variable a la izquierda, seguido de un único signo igual (=) y el valor a la derecha: puntaje = 100.',
    points: 0.5
  },
  // Teoría 4: Reglas para nombres de variables
  {
    id: 'tp_a_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reglas de variables',
    question: '¿Cuál de los siguientes nombres de variable es VÁLIDO en Python?',
    options: [
      'cantidad_alumnos',
      '2do_parcial',
      'precio total',
      'costo-envio'
    ],
    correctAnswer: 0,
    explanation: 'cantidad_alumnos es válido porque usa letras y guion bajo. Los nombres no pueden comenzar con dígitos (2do_parcial), ni contener espacios (precio total) ni guiones medios (costo-envio).',
    points: 0.5
  },
  // Teoría 5: Reasignación de variables
  {
    id: 'tp_a_th_05',
    type: 'tracing',
    moduleId: 4,
    topic: 'Reasignación de variables',
    question: '¿Qué valor mostrará en pantalla el siguiente código al ejecutarse?',
    codeSnippet: 'x = 10\nx = 20\nx = x + 5\nprint(x)',
    options: [
      '25',
      '15',
      '35',
      '10'
    ],
    correctAnswer: 0,
    explanation: 'Primero x vale 10, luego se reasigna a 20. Al final, se le suma 5 al valor actual (20 + 5), resultando 25.',
    points: 0.5
  },
  // Teoría 6: Función print() y cálculos
  {
    id: 'tp_a_th_06',
    type: 'tracing',
    moduleId: 9,
    topic: 'Función print()',
    question: '¿Qué imprime exactamente la siguiente instrucción de Python?',
    codeSnippet: 'print("Resultado:", 4 * 5)',
    options: [
      'Resultado: 20',
      'Resultado: 4 * 5',
      '20',
      'Resultado:4*5'
    ],
    correctAnswer: 0,
    explanation: 'La función print() evalúa la expresión matemática 4 * 5 (que da 20) y separa los argumentos pasados por coma con un espacio por defecto.',
    points: 0.5
  },
  // Teoría 7: Saltos de línea con \n
  {
    id: 'tp_a_th_07',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Saltos de línea',
    question: '¿Cuál es el efecto del caracter especial \\n dentro de una cadena de texto en print()?',
    options: [
      'Genera un salto de línea hacia el renglón siguiente.',
      'Borra la palabra anterior en la pantalla.',
      'Agrega un espacio en blanco entre dos variables.',
      'Detiene la ejecución del programa inmediatamente.'
    ],
    correctAnswer: 0,
    explanation: 'El caracter de escape \\n representa un salto de línea (newline), haciendo que el texto posterior se imprima en el renglón de abajo.',
    points: 0.5
  },
  // Teoría 8: Función input() y conversión int()
  {
    id: 'tp_a_th_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Entrada y conversión',
    question: '¿Qué tipo de dato devuelve SIEMPRE la función input() y por qué usamos int()?',
    options: [
      'Devuelve siempre str (texto); usamos int() para convertirlo en número entero y poder realizar cálculos matemáticos.',
      'Devuelve siempre int; usamos int() solo para redondearlo si tiene decimales.',
      'Devuelve un float; usamos int() para eliminar los signos negativos.',
      'Devuelve un valor booleano; usamos int() para transformarlo en 1 o 0.'
    ],
    correctAnswer: 0,
    explanation: 'input() siempre devuelve el valor ingresado por el usuario como cadena de texto (str). Si intentamos operar sin convertir con int() o float(), Python concatenará texto en vez de sumar o multiplicará con error.',
    points: 0.5
  },

  // Práctica 1: Calcular el doble
  {
    id: 'tp_a_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación práctica',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que solicite al usuario un número con input(), calcule su doble (D = n * 2) y muestre el resultado con print().',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Pedí un número, convertilo con int() o float(), calculá el doble y mostralo con print()\n\nnumero = int(input("Ingresá un número: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Prueba con número 7',
        inputs: ['7'],
        expectedOutputPattern: '(?:^|\\D)14(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 7 → El doble esperado es 14'
      },
      {
        name: 'Prueba con número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → El doble esperado es 0'
      },
      {
        name: 'Prueba con número negativo -3',
        inputs: ['-3'],
        expectedOutputPattern: '(?:^|[^0-9-])-6(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -3 → El doble esperado es -6'
      },
      {
        name: 'Prueba con número 12',
        inputs: ['12'],
        expectedOutputPattern: '(?:^|\\D)24(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 12 → El doble esperado es 24'
      }
    ]
  },

  // Práctica 2: Calcular el área de un triángulo
  {
    id: 'tp_a_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Solicitá la base y la altura de un triángulo mediante input(), calculá su área aplicando la fórmula A = (b * h) / 2 y mostrá el resultado.',
    starterCode: '# Ejercicio 2: Área de un triángulo\n# Pedí la base y la altura con input(), calculá (base * altura) / 2 y mostrá el resultado\n\nbase = float(input("Ingresá la base: "))\naltura = float(input("Ingresá la altura: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 10, Altura 6',
        inputs: ['10', '6'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 6 → Área esperada: 30'
      },
      {
        name: 'Base 8, Altura 4',
        inputs: ['8', '4'],
        expectedOutputPattern: '(?:^|\\D)16(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 8, Altura: 4 → Área esperada: 16'
      },
      {
        name: 'Base 5, Altura 2',
        inputs: ['5', '2'],
        expectedOutputPattern: '(?:^|\\D)5(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 5, Altura: 2 → Área esperada: 5'
      },
      {
        name: 'Base 14, Altura 3',
        inputs: ['14', '3'],
        expectedOutputPattern: '(?:^|\\D)21(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 14, Altura: 3 → Área esperada: 21'
      }
    ]
  },

  // Práctica 3: Calcular el perímetro de un cuadrado
  {
    id: 'tp_a_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Solicitá la longitud de un lado del cuadrado con input(), calculá su perímetro (P = 4 * L) y mostrá el resultado en pantalla.',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la longitud del lado, calculá 4 * lado y mostrá el resultado\n\nlado = float(input("Ingresá el lado del cuadrado: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Lado 5',
        inputs: ['5'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 5 → Perímetro esperado: 20'
      },
      {
        name: 'Lado 8',
        inputs: ['8'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 8 → Perímetro esperado: 32'
      },
      {
        name: 'Lado 3',
        inputs: ['3'],
        expectedOutputPattern: '(?:^|\\D)12(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 3 → Perímetro esperado: 12'
      },
      {
        name: 'Lado 10',
        inputs: ['10'],
        expectedOutputPattern: '(?:^|\\D)40(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 10 → Perímetro esperado: 40'
      }
    ]
  },

  // Práctica 4 (Modelo A): Calcular el triple de un número
  {
    id: 'tp_a_pr_04',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación práctica',
    title: 'Ejercicio 4: Calcular el triple',
    question: 'Escribí un programa que solicite un número al usuario con input(), calcule su triple multiplicándolo por 3 (T = n * 3) y muestre el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Calcular el triple de un número\n# Pedí un número, convertilo con int() o float(), calculá n * 3 y mostrá el resultado\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Número 4',
        inputs: ['4'],
        expectedOutputPattern: '(?:^|\\D)12(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 4 → Triple esperado: 12'
      },
      {
        name: 'Número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → Triple esperado: 0'
      },
      {
        name: 'Número negativo -5',
        inputs: ['-5'],
        expectedOutputPattern: '(?:^|[^0-9-])-15(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -5 → Triple esperado: -15'
      },
      {
        name: 'Número 10',
        inputs: ['10'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 10 → Triple esperado: 30'
      }
    ]
  }
];

// --- MODELO B ---
export const TP_QUESTIONS_MODEL_B: ExamUnifiedQuestion[] = [
  // Teoría 1: Introducción a Python
  {
    id: 'tp_b_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Introducción a Python',
    question: '¿Por qué se dice que Python es un lenguaje interpretado?',
    options: [
      'Porque sus instrucciones son leídas y ejecutadas línea por línea por el intérprete sin compilar previamente a binario.',
      'Porque solo se puede utilizar mediante un traductor de voz en inglés.',
      'Porque necesita un procesador especial que solo interpreta código numérico binario.',
      'Porque los errores únicamente se detectan cuando la computadora se reinicia.'
    ],
    correctAnswer: 0,
    explanation: 'Python es un lenguaje interpretado: el intérprete lee el código fuente instrucción por instrucción y las ejecuta en tiempo real.',
    points: 0.5
  },
  // Teoría 2: Tipos de datos
  {
    id: 'tp_b_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿Cuál de las siguientes variables almacena un dato de tipo booleano (bool)?',
    options: [
      'aprobado = True',
      'aprobado = "True"',
      'aprobado = 1.0',
      'aprobado = "verdadero"'
    ],
    correctAnswer: 0,
    explanation: 'En Python los valores booleanos son True y False (con la primera letra en mayúscula y sin comillas). Si se escriben entre comillas ("True"), pasan a ser de tipo str.',
    points: 0.5
  },
  // Teoría 3: Variables y Asignación
  {
    id: 'tp_b_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Variables y Asignación',
    question: 'En la instrucción temperatura = 18.5, ¿cuál es el rol del signo =?',
    options: [
      'Es el operador de asignación: guarda el valor 18.5 dentro de la variable temperatura.',
      'Compara si la variable temperatura ya era igual a 18.5.',
      'Calcula una división entre temperatura y 18.5.',
      'Borra el contenido de la variable temperatura.'
    ],
    correctAnswer: 0,
    explanation: 'El operador de asignación (=) toma el resultado del lado derecho y lo deposita en la variable ubicada en el lado izquierdo.',
    points: 0.5
  },
  // Teoría 4: Reglas para nombres de variables
  {
    id: 'tp_b_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reglas de variables',
    question: '¿Por qué nombre-estudiante NO es un nombre válido de variable en Python?',
    options: [
      'Porque el guion medio (-) se interpreta como el operador matemático de resta.',
      'Porque las variables no pueden tener más de 10 letras.',
      'Porque los nombres deben escribirse obligatoriamente en mayúsculas.',
      'Porque no contiene números al final.'
    ],
    correctAnswer: 0,
    explanation: 'El guion medio (-) es interpretado por Python como el operador de sustracción. Para unir palabras en nombres de variables se utiliza el guion bajo (_): nombre_estudiante.',
    points: 0.5
  },
  // Teoría 5: Reasignación de variables
  {
    id: 'tp_b_th_05',
    type: 'tracing',
    moduleId: 4,
    topic: 'Reasignación de variables',
    question: '¿Qué valor final tiene la variable a al terminar estas instrucciones?',
    codeSnippet: 'a = 5\nb = 3\na = a * b\nprint(a)',
    options: [
      '15',
      '8',
      '5',
      '3'
    ],
    correctAnswer: 0,
    explanation: 'La variable a comienza con 5. Luego a = a * b multiplica 5 * 3 y reasigna el resultado (15) en la variable a.',
    points: 0.5
  },
  // Teoría 6: Función print() y formato
  {
    id: 'tp_b_th_06',
    type: 'tracing',
    moduleId: 9,
    topic: 'Función print()',
    question: '¿Qué salida genera la ejecución del siguiente código?',
    codeSnippet: 'materia = "Python"\nprint("Curso de", materia)',
    options: [
      'Curso de Python',
      'Curso de materia',
      '"Curso de" "Python"',
      'Curso dePython'
    ],
    correctAnswer: 0,
    explanation: 'print("Curso de", materia) reemplaza la variable materia por su valor ("Python") y agrega un espacio de separación entre los argumentos.',
    points: 0.5
  },
  // Teoría 7: Saltos de línea con \n
  {
    id: 'tp_b_th_07',
    type: 'tracing',
    moduleId: 9,
    topic: 'Saltos de línea',
    question: '¿En cuántos renglones se imprimirá la salida del siguiente print?',
    codeSnippet: 'print("Línea 1\\nLínea 2\\nLínea 3")',
    options: [
      'En 3 renglones.',
      'En 1 solo renglón con los caracteres \\n visibles.',
      'En 2 renglones.',
      'Produce un error de sintaxis.'
    ],
    correctAnswer: 0,
    explanation: 'Cada aparición de \\n produce un salto de línea inmediato. Al haber dos \\n, el texto se divide y ocupa 3 renglones.',
    points: 0.5
  },
  // Teoría 8: Función input() y concatenación
  {
    id: 'tp_b_th_08',
    type: 'tracing',
    moduleId: 10,
    topic: 'Entrada y conversión',
    question: 'Si un alumno escribe a = "4" y b = "5", ¿qué imprime print(a + b)?',
    options: [
      '45 (los concatena como texto)',
      '9 (los suma matemáticamente)',
      'Error de tipos',
      '4 5'
    ],
    correctAnswer: 0,
    explanation: 'Al ser variables de tipo str (texto con comillas), el operador + actúa como concatenación, uniendo "4" y "5" para formar "45". Para sumarlos habría que usar int(a) + int(b).',
    points: 0.5
  },

  // Práctica 1: Calcular el doble
  {
    id: 'tp_b_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación práctica',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que solicite un valor numérico al usuario con input(), calcule su doble (D = n * 2) y muestre el resultado con print().',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Solicitá un número, convertilo a int o float, calculá el doble y mostralo\n\nnum = int(input("Ingresá un número: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Prueba con número 7',
        inputs: ['7'],
        expectedOutputPattern: '(?:^|\\D)14(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 7 → El doble esperado es 14'
      },
      {
        name: 'Prueba con número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → El doble esperado es 0'
      },
      {
        name: 'Prueba con número negativo -3',
        inputs: ['-3'],
        expectedOutputPattern: '(?:^|[^0-9-])-6(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -3 → El doble esperado es -6'
      },
      {
        name: 'Prueba con número 12',
        inputs: ['12'],
        expectedOutputPattern: '(?:^|\\D)24(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 12 → El doble esperado es 24'
      }
    ]
  },

  // Práctica 2: Calcular el área de un triángulo
  {
    id: 'tp_b_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Solicitá la base y la altura de un triángulo, calculá su área con la fórmula A = (b * h) / 2 y mostrá el resultado.',
    starterCode: '# Ejercicio 2: Área de un triángulo\n# Pedí base y altura con input(), calculá (base * altura) / 2 y mostrá el resultado\n\nb = float(input("Base: "))\nh = float(input("Altura: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 10, Altura 6',
        inputs: ['10', '6'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 6 → Área esperada: 30'
      },
      {
        name: 'Base 8, Altura 4',
        inputs: ['8', '4'],
        expectedOutputPattern: '(?:^|\\D)16(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 8, Altura: 4 → Área esperada: 16'
      },
      {
        name: 'Base 5, Altura 2',
        inputs: ['5', '2'],
        expectedOutputPattern: '(?:^|\\D)5(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 5, Altura: 2 → Área esperada: 5'
      },
      {
        name: 'Base 14, Altura 3',
        inputs: ['14', '3'],
        expectedOutputPattern: '(?:^|\\D)21(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 14, Altura: 3 → Área esperada: 21'
      }
    ]
  },

  // Práctica 3: Calcular el perímetro de un cuadrado
  {
    id: 'tp_b_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Solicitá la longitud de un lado del cuadrado, calculá su perímetro (P = 4 * L) y mostrá el resultado con print().',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la medida del lado, calculá 4 * lado y mostralo\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Lado 5',
        inputs: ['5'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 5 → Perímetro esperado: 20'
      },
      {
        name: 'Lado 8',
        inputs: ['8'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 8 → Perímetro esperado: 32'
      },
      {
        name: 'Lado 3',
        inputs: ['3'],
        expectedOutputPattern: '(?:^|\\D)12(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 3 → Perímetro esperado: 12'
      },
      {
        name: 'Lado 10',
        inputs: ['10'],
        expectedOutputPattern: '(?:^|\\D)40(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 10 → Perímetro esperado: 40'
      }
    ]
  },

  // Práctica 4 (Modelo B): Calcular el área de un rectángulo
  {
    id: 'tp_b_pr_04',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 4: Área de un rectángulo',
    question: 'Escribí un programa que solicite la base y la altura de un rectángulo mediante input(), calcule su área multiplicando base por altura (A = base * altura) y muestre el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Área de un rectángulo\n# Pedí la base y la altura con input(), calculá base * altura y mostrá el resultado\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 5, Altura 4',
        inputs: ['5', '4'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 5, Altura: 4 → Área esperada: 20'
      },
      {
        name: 'Base 10, Altura 3',
        inputs: ['10', '3'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 3 → Área esperada: 30'
      },
      {
        name: 'Base 7, Altura 2',
        inputs: ['7', '2'],
        expectedOutputPattern: '(?:^|\\D)14(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 7, Altura: 2 → Área esperada: 14'
      },
      {
        name: 'Base 6, Altura 6',
        inputs: ['6', '6'],
        expectedOutputPattern: '(?:^|\\D)36(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 6, Altura: 6 → Área esperada: 36'
      }
    ]
  }
];

// --- MODELO C ---
export const TP_QUESTIONS_MODEL_C: ExamUnifiedQuestion[] = [
  // Teoría 1: Introducción a Python
  {
    id: 'tp_c_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Introducción a Python',
    question: '¿Cuál de las siguientes áreas es un campo destacado de aplicación de Python en la actualidad?',
    options: [
      'Inteligencia artificial, ciencia de datos, desarrollo backend y automatización.',
      'Microcontroladores analógicos de 4 bits sin software.',
      'Creación exclusiva de hojas de cálculo de papel.',
      'Sustituir a los cables de fibra óptica.'
    ],
    correctAnswer: 0,
    explanation: 'Python es uno de los lenguajes más populares en el mundo para Inteligencia Artificial (machine learning), análisis de datos, servidores web y scripting.',
    points: 0.5
  },
  // Teoría 2: Tipos de datos
  {
    id: 'tp_c_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿Qué tipo de dato devolverá la función type(15.0) en Python?',
    options: [
      "<class 'float'>",
      "<class 'int'>",
      "<class 'str'>",
      "<class 'bool'>"
    ],
    correctAnswer: 0,
    explanation: '15.0 tiene punto decimal, por lo que pertenece a la clase float (número de coma flotante o decimal).',
    points: 0.5
  },
  // Teoría 3: Variables y Asignación
  {
    id: 'tp_c_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Variables y Asignación',
    question: '¿Cuál es la diferencia entre el operador de asignación (=) y el operador de comparación (==)?',
    options: [
      'El signo = asigna o guarda un valor en una variable; el signo == compara si dos valores son iguales.',
      'El signo = compara dos valores; el signo == guarda una variable.',
      'Ambos signos hacen exactamente lo mismo en Python.',
      'El signo = solo se usa con texto y == solo con números.'
    ],
    correctAnswer: 0,
    explanation: 'Un solo signo igual (=) se utiliza para asignar valores a variables, mientras que el doble signo igual (==) es un operador de comparación que evalúa si dos expresiones son iguales y devuelve True o False.',
    points: 0.5
  },
  // Teoría 4: Reglas para nombres de variables
  {
    id: 'tp_c_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reglas de variables',
    question: '¿Por qué es una buena práctica elegir nombres descriptivos como total_factura en lugar de tf?',
    options: [
      'Porque hace que el código sea mucho más legible, fácil de entender y de mantener para nosotros y otros programadores.',
      'Porque Python ejecuta más rápido las variables con nombres largos.',
      'Porque las variables cortas como tf dan error de compilación.',
      'Porque la memoria RAM funciona mejor con guiones bajos.'
    ],
    correctAnswer: 0,
    explanation: 'Elegir nombres descriptivos y claros (como total_factura o cantidad_alumnos) es una regla fundamental de calidad de código: comunica de inmediato el propósito de la variable.',
    points: 0.5
  },
  // Teoría 5: Reasignación de variables
  {
    id: 'tp_c_th_05',
    type: 'tracing',
    moduleId: 4,
    topic: 'Reasignación de variables',
    question: '¿Qué valor se mostrará en pantalla al finalizar este bloque de código?',
    codeSnippet: 'puntos = 50\npuntos = puntos - 10\npuntos = puntos * 2\nprint(puntos)',
    options: [
      '80',
      '40',
      '100',
      '50'
    ],
    correctAnswer: 0,
    explanation: 'Inicia en 50. Luego se le restan 10 (50 - 10 = 40). Finalmente se multiplica por 2 (40 * 2 = 80).',
    points: 0.5
  },
  // Teoría 6: Función print() con múltiples valores
  {
    id: 'tp_c_th_06',
    type: 'tracing',
    moduleId: 9,
    topic: 'Función print()',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'nombre = "Ana"\nedad = 16\nprint("Estudiante:", nombre, "- Edad:", edad)',
    options: [
      'Estudiante: Ana - Edad: 16',
      'Estudiante:nombre - Edad:edad',
      'Estudiante: Ana-Edad: 16',
      'Ana 16'
    ],
    correctAnswer: 0,
    explanation: 'print() une todos los argumentos separados por comas intercalando un espacio entre ellos: "Estudiante: Ana - Edad: 16".',
    points: 0.5
  },
  // Teoría 7: Saltos de línea
  {
    id: 'tp_c_th_07',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Saltos de línea',
    question: 'Para mostrar dos renglones con un solo print(), ¿cuál es la sintaxis adecuada?',
    options: [
      'print("Primer renglón\\nSegundo renglón")',
      'print("Primer renglón /n Segundo renglón")',
      'print("Primer renglón enter Segundo renglón")',
      'print("Primer renglón" + "\\t" + "Segundo renglón")'
    ],
    correctAnswer: 0,
    explanation: 'La secuencia de escape correcta es con barra invertida \\n: print("Primer renglón\\nSegundo renglón").',
    points: 0.5
  },
  // Teoría 8: Conversión de tipos
  {
    id: 'tp_c_th_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Entrada y conversión',
    question: 'Si ejecutamos n = int(input("Ingresá un número: ")) y el usuario escribe 8, ¿qué tipo de dato tiene n?',
    options: [
      'int (número entero)',
      'str (cadena de texto)',
      'float (número decimal)',
      'list (lista)'
    ],
    correctAnswer: 0,
    explanation: 'Aunque input() devuelve "8" (texto), la función int(...) convierte ese texto en el número entero 8 de tipo int.',
    points: 0.5
  },

  // Práctica 1: Calcular el doble
  {
    id: 'tp_c_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación práctica',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que solicite un número al usuario con input(), calcule su doble (D = n * 2) y muestre el resultado en pantalla.',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Pedí un número con input(), convertilo con int() o float(), calculá n * 2 y mostralo\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Prueba con número 7',
        inputs: ['7'],
        expectedOutputPattern: '(?:^|\\D)14(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 7 → El doble esperado es 14'
      },
      {
        name: 'Prueba con número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → El doble esperado es 0'
      },
      {
        name: 'Prueba con número negativo -3',
        inputs: ['-3'],
        expectedOutputPattern: '(?:^|[^0-9-])-6(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -3 → El doble esperado es -6'
      },
      {
        name: 'Prueba con número 12',
        inputs: ['12'],
        expectedOutputPattern: '(?:^|\\D)24(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 12 → El doble esperado es 24'
      }
    ]
  },

  // Práctica 2: Calcular el área de un triángulo
  {
    id: 'tp_c_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Solicitá la base y la altura de un triángulo mediante input(), calculá su área aplicando A = (b * h) / 2 y mostrá el resultado.',
    starterCode: '# Ejercicio 2: Área de un triángulo\n# Pedí la base y la altura, calculá (base * altura) / 2 y mostrá el resultado\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 10, Altura 6',
        inputs: ['10', '6'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 6 → Área esperada: 30'
      },
      {
        name: 'Base 8, Altura 4',
        inputs: ['8', '4'],
        expectedOutputPattern: '(?:^|\\D)16(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 8, Altura: 4 → Área esperada: 16'
      },
      {
        name: 'Base 5, Altura 2',
        inputs: ['5', '2'],
        expectedOutputPattern: '(?:^|\\D)5(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 5, Altura: 2 → Área esperada: 5'
      },
      {
        name: 'Base 14, Altura 3',
        inputs: ['14', '3'],
        expectedOutputPattern: '(?:^|\\D)21(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 14, Altura: 3 → Área esperada: 21'
      }
    ]
  },

  // Práctica 3: Calcular el perímetro de un cuadrado
  {
    id: 'tp_c_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Solicitá la longitud de un lado del cuadrado con input(), calculá su perímetro aplicando P = 4 * L y mostrá el resultado.',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la medida del lado, calculá 4 * lado y mostralo\n\n',
    points: 1.5,
    testCases: [
      {
        name: 'Lado 5',
        inputs: ['5'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 5 → Perímetro esperado: 20'
      },
      {
        name: 'Lado 8',
        inputs: ['8'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 8 → Perímetro esperado: 32'
      },
      {
        name: 'Lado 3',
        inputs: ['3'],
        expectedOutputPattern: '(?:^|\\D)12(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 3 → Perímetro esperado: 12'
      },
      {
        name: 'Lado 10',
        inputs: ['10'],
        expectedOutputPattern: '(?:^|\\D)40(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 10 → Perímetro esperado: 40'
      }
    ]
  },

  // Práctica 4 (Modelo C): Calcular el total de una compra
  {
    id: 'tp_c_pr_04',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación práctica',
    title: 'Ejercicio 4: Total de compra',
    question: 'Escribí un programa que solicite al usuario el precio unitario de un producto y la cantidad de unidades compradas con input(), calcule el total a pagar (total = precio * cantidad) y muestre el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Total de una compra\n# Pedí el precio y la cantidad, calculá precio * cantidad y mostrá el resultado\n\nprecio = float(input("Precio unitario: "))\ncantidad = int(input("Cantidad: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Precio 150, Cantidad 3',
        inputs: ['150', '3'],
        expectedOutputPattern: '(?:^|\\D)450(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 150, Cantidad: 3 → Total esperado: 450'
      },
      {
        name: 'Precio 50, Cantidad 4',
        inputs: ['50', '4'],
        expectedOutputPattern: '(?:^|\\D)200(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 50, Cantidad: 4 → Total esperado: 200'
      },
      {
        name: 'Precio 25, Cantidad 5',
        inputs: ['25', '5'],
        expectedOutputPattern: '(?:^|\\D)125(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 25, Cantidad: 5 → Total esperado: 125'
      },
      {
        name: 'Precio 100, Cantidad 2',
        inputs: ['100', '2'],
        expectedOutputPattern: '(?:^|\\D)200(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 100, Cantidad: 2 → Total esperado: 200'
      }
    ]
  }
];

export function getPracticalWorkQuestions(model: TPModelType): ExamUnifiedQuestion[] {
  switch (model) {
    case 'A':
      return TP_QUESTIONS_MODEL_A;
    case 'B':
      return TP_QUESTIONS_MODEL_B;
    case 'C':
      return TP_QUESTIONS_MODEL_C;
    default:
      return TP_QUESTIONS_MODEL_A;
  }
}

export function getRandomTPModel(): TPModelType {
  const models: TPModelType[] = ['A', 'B', 'C'];
  const randomIndex = Math.floor(Math.random() * models.length);
  return models[randomIndex];
}
