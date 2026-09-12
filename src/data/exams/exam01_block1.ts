import {
  Exam,
  ExamUnifiedQuestion,
  ExamConfig,
  ExamStudentData,
  ActiveExamSession,
  ExamEvaluationResult
} from '../../types/exam';

export const EXAM01_STORAGE_KEY = 'python_active_exam_session_exam-1';
export const EXAM01_ATTEMPTS_STORAGE_KEY = 'python_exam_attempts_history_exam-1';

export const EXAM01_CONFIG: ExamConfig = {
  totalQuestions: 20,
  durationMinutes: 40,
  maxAttempts: 3,
  distribution: {
    multiple_choice: 15,
    tracing: 3,
    coding: 2
  },
  maxScore: 10.0,
  pointsPerQuestion: 0.5,
  passingScore: 6.0,
  allowDetailedReview: true
};

// ============================================================================
// 1. BANCO DE 30 PREGUNTAS TEÓRICAS Y DE ANÁLISIS (Requerimiento Sección 3)
// ============================================================================

export const EXAM01_THEORY_BANK: ExamUnifiedQuestion[] = [
  // 1
  {
    id: 'e1_th_01',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Variables',
    question: '¿Qué es una variable en programación?',
    options: [
      'Un espacio donde podemos guardar un valor.',
      'Una instrucción para cerrar el programa.',
      'Un tipo de computadora.',
      'Un operador matemático.'
    ],
    correctAnswer: 0,
    explanation: 'Una variable es un espacio en memoria donde podemos almacenar y modificar un valor mientras se ejecuta el programa.',
    points: 0.5
  },
  // 2
  {
    id: 'e1_th_02',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Asignación',
    question: '¿Cuál representa correctamente una asignación?',
    options: [
      'numero = 10',
      'numero == 10',
      'numero + 10',
      '10 = numero'
    ],
    correctAnswer: 0,
    explanation: 'En Python la asignación se escribe con un solo signo igual: variable = valor.',
    points: 0.5
  },
  // 3
  {
    id: 'e1_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Variables',
    question: '¿Qué valor queda almacenado en edad?',
    codeSnippet: 'edad = 15',
    options: [
      '5',
      '10',
      '15',
      '"edad"'
    ],
    correctAnswer: 2,
    explanation: 'La instrucción edad = 15 almacena el número 15 dentro de la variable edad.',
    points: 0.5
  },
  // 4
  {
    id: 'e1_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reasignación',
    question: '¿Qué sucede?',
    codeSnippet: 'nombre = "Juan"\nnombre = "Pedro"',
    options: [
      'Se guardan los dos nombres al mismo tiempo.',
      'La variable nombre pasa a contener "Pedro".',
      'Se produce necesariamente un error.',
      'La variable queda vacía.'
    ],
    correctAnswer: 1,
    explanation: 'Al reasignar una variable, el valor anterior se descarta y toma el nuevo valor asignado ("Pedro").',
    points: 0.5
  },
  // 5
  {
    id: 'e1_th_05',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Nombres de variables',
    question: '¿Cuál puede ser un nombre válido para una variable?',
    options: [
      'nombre_alumno',
      'nombre alumno',
      '2nombre',
      'nombre-alumno'
    ],
    correctAnswer: 0,
    explanation: 'nombre_alumno es válido porque usa letras y guión bajo. No puede tener espacios, guiones medios ni empezar con números.',
    points: 0.5
  },
  // 6
  {
    id: 'e1_th_06',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿Cuál es un número entero?',
    options: [
      '"25"',
      '25',
      '"veinticinco"',
      '25.5'
    ],
    correctAnswer: 1,
    explanation: '25 sin comillas y sin punto decimal es un número entero (tipo int).',
    points: 0.5
  },
  // 7
  {
    id: 'e1_th_07',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿Cuál representa un número decimal?',
    options: [
      '15',
      '"15"',
      '15.5',
      '"15.5"'
    ],
    correctAnswer: 2,
    explanation: '15.5 con punto y sin comillas representa un número decimal (tipo float).',
    points: 0.5
  },
  // 8
  {
    id: 'e1_th_08',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Tipos de datos',
    question: '¿Cuál es un dato de tipo texto?',
    options: [
      '20',
      '15.5',
      '"Hola"',
      'True'
    ],
    correctAnswer: 2,
    explanation: '"Hola" entre comillas es un texto o cadena de caracteres (tipo str).',
    points: 0.5
  },
  // 9
  {
    id: 'e1_th_09',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'print()',
    question: '¿Para qué se utiliza principalmente print()?',
    options: [
      'Para recibir información del usuario.',
      'Para mostrar información en pantalla.',
      'Para crear una variable.',
      'Para realizar una multiplicación.'
    ],
    correctAnswer: 1,
    explanation: 'print() es la función que permite mostrar mensajes y resultados en la pantalla.',
    points: 0.5
  },
  // 10
  {
    id: 'e1_th_10',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'print()',
    question: '¿Qué muestra?',
    codeSnippet: 'print("Hola")',
    options: [
      'El número Hola.',
      'La palabra print.',
      'Hola.',
      'Nada.'
    ],
    correctAnswer: 2,
    explanation: 'print("Hola") muestra el texto que está entre comillas: Hola.',
    points: 0.5
  },
  // 11
  {
    id: 'e1_th_11',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'print() y variables',
    question: '¿Qué muestra?',
    codeSnippet: 'nombre = "Martin"\nprint(nombre)',
    options: [
      'nombre',
      '"Martin"',
      'Martin',
      'Nada.'
    ],
    correctAnswer: 2,
    explanation: 'Al pasarle la variable sin comillas a print, muestra el valor que tiene adentro: Martin.',
    points: 0.5
  },
  // 12
  {
    id: 'e1_th_12',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'input()',
    question: '¿Para qué se utiliza input()?',
    options: [
      'Para mostrar un resultado.',
      'Para solicitar información al usuario.',
      'Para multiplicar números.',
      'Para borrar una variable.'
    ],
    correctAnswer: 1,
    explanation: 'input() pausa la ejecución para que el usuario escriba información por teclado.',
    points: 0.5
  },
  // 13
  {
    id: 'e1_th_13',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'input()',
    question: '¿Qué sucede?',
    codeSnippet: 'nombre = input("Ingrese su nombre: ")',
    options: [
      'Muestra un mensaje y permite que el usuario ingrese un dato.',
      'Multiplica el nombre por dos.',
      'Muestra automáticamente el nombre del usuario.',
      'Cierra el programa.'
    ],
    correctAnswer: 0,
    explanation: 'input() muestra el mensaje entre comillas y permite que el usuario ingrese un dato por teclado.',
    points: 0.5
  },
  // 14
  {
    id: 'e1_th_14',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    question: '¿Cuál es un operador aritmético?',
    options: [
      '+',
      '>',
      'and',
      '='
    ],
    correctAnswer: 0,
    explanation: 'El signo + es un operador aritmético que realiza la suma.',
    points: 0.5
  },
  // 15
  {
    id: 'e1_th_15',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Variables y Operadores',
    question: '¿Cuál es el resultado del programa?',
    codeSnippet: 'precio = 8\naumento = 4\n\nprint(precio + aumento)',
    options: [
      '12',
      '84',
      '4',
      'precio + aumento'
    ],
    correctAnswer: 0,
    explanation: 'precio vale 8 y aumento vale 4. La suma precio + aumento resulta en 12, que es lo que muestra print.',
    points: 0.5
  },
  // 16
  {
    id: 'e1_th_16',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Variables y Operadores',
    question: '¿Cuál es el resultado del programa?',
    codeSnippet: 'saldo = 20\ngasto = 7\n\nprint(saldo - gasto)',
    options: [
      '27',
      '13',
      '14',
      '7'
    ],
    correctAnswer: 1,
    explanation: 'saldo (20) menos gasto (7) es igual a 13, que es mostrado en pantalla por print.',
    points: 0.5
  },
  // 17
  {
    id: 'e1_th_17',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Variables y Operadores',
    question: '¿Cuál es el resultado del programa?',
    codeSnippet: 'filas = 6\nasientos = 4\n\nprint(filas * asientos)',
    options: [
      '10',
      '20',
      '24',
      '64'
    ],
    correctAnswer: 2,
    explanation: 'filas (6) multiplicado por asientos (4) da como resultado 24.',
    points: 0.5
  },
  // 18
  {
    id: 'e1_th_18',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Variables y Operadores',
    question: '¿Cuál es el resultado del programa?',
    codeSnippet: 'caramelos = 20\namigos = 5\nresultado = caramelos // amigos\nprint(resultado)',
    options: [
      '4',
      '15',
      '25',
      '100'
    ],
    correctAnswer: 0,
    explanation: 'caramelos (20) dividido entre amigos (5) da 4, que se guarda en resultado y se muestra con print.',
    points: 0.5
  },
  // 19
  {
    id: 'e1_th_19',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reasignación',
    question: 'Observá:\n```python\nnumero = 10\nnumero = numero + 5\n```\n¿Cuál es el valor final?',
    options: [
      '10',
      '5',
      '15',
      '105'
    ],
    correctAnswer: 2,
    explanation: 'numero comienza en 10 y luego se le suman 5, por lo que su valor final es 15.',
    points: 0.5
  },
  // 20
  {
    id: 'e1_th_20',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Reasignación',
    question: 'Observá:\n```python\nnumero = 21\nnumero = numero + 5\nresultado = numero + 5\n```\n¿Cuál es el valor de resultado?',
    options: [
      '26',
      '31',
      '36',
      '21'
    ],
    correctAnswer: 1,
    explanation: 'numero pasa a valer 21 + 5 = 26. Luego resultado es 26 + 5 = 31.',
    points: 0.5
  },
  // 21
  {
    id: 'e1_th_21',
    type: 'tracing',
    moduleId: 6,
    topic: 'Operaciones y print',
    question: '¿Qué muestra?',
    codeSnippet: 'a = 5\nb = 3\nresultado = a + b\nprint(resultado)',
    options: [
      '53',
      '8',
      '15',
      '2'
    ],
    correctAnswer: 1,
    explanation: 'a + b realiza la suma 5 + 3 = 8, y print(resultado) muestra 8.',
    points: 0.5
  },
  // 22
  {
    id: 'e1_th_22',
    type: 'tracing',
    moduleId: 6,
    topic: 'Operaciones y print',
    question: '¿Qué muestra?',
    codeSnippet: 'a = 10\nb = 2\nresultado = a * b\nprint(resultado)',
    options: [
      '5',
      '8',
      '12',
      '20'
    ],
    correctAnswer: 3,
    explanation: '10 multiplicado por 2 da 20, que es lo que muestra print.',
    points: 0.5
  },
  // 23
  {
    id: 'e1_th_23',
    type: 'tracing',
    moduleId: 6,
    topic: 'Operaciones',
    question: '¿Qué valor queda almacenado?',
    codeSnippet: 'precio = 1000\naumento = 200\nresultado = precio + aumento',
    options: [
      '800',
      '1000',
      '1200',
      '2000'
    ],
    correctAnswer: 2,
    explanation: '1000 + 200 es igual a 1200, que se guarda en resultado.',
    points: 0.5
  },
  // 24
  {
    id: 'e1_th_24',
    type: 'tracing',
    moduleId: 7,
    topic: 'Comparación',
    question: '¿Cuál es el resultado?',
    codeSnippet: '21 > 20',
    options: [
      'True',
      'False',
      '21',
      '20'
    ],
    correctAnswer: 0,
    explanation: '21 es mayor que 20, por lo tanto la comparación da True.',
    points: 0.5
  },
  // 25
  {
    id: 'e1_th_25',
    type: 'tracing',
    moduleId: 7,
    topic: 'Comparación',
    question: '¿Cuál es el resultado?',
    codeSnippet: '10 < 5',
    options: [
      'True',
      'False',
      '10',
      '5'
    ],
    correctAnswer: 1,
    explanation: '10 no es menor que 5, por lo tanto el resultado es False.',
    points: 0.5
  },
  // 26
  {
    id: 'e1_th_26',
    type: 'tracing',
    moduleId: 8,
    topic: 'Operadores lógicos',
    question: '¿Cuál es el resultado?',
    codeSnippet: '21 > 20 and 33 < 33',
    options: [
      'True',
      'False',
      '21',
      '33'
    ],
    correctAnswer: 1,
    explanation: '21 > 20 es True, pero 33 < 33 es False. Como el operador and exige que ambas partes sean verdaderas, el resultado es False.',
    points: 0.5
  },
  // 27
  {
    id: 'e1_th_27',
    type: 'tracing',
    moduleId: 8,
    topic: 'Operadores lógicos',
    question: '¿Cuáles son operadores lógicos?',
    options: [
      'and, or, not',
      '+, -, *',
      '>, <, ==',
      '=, +, and'
    ],
    correctAnswer: 0,
    explanation: 'and, or y not son los tres operadores lógicos de Python.',
    points: 0.5
  },
  // 28
  {
    id: 'e1_th_28',
    type: 'tracing',
    moduleId: 6,
    topic: 'Lectura de código',
    question: '¿Qué realiza?',
    codeSnippet: 'a = 5\nb = 10\nc = a + b\nprint(c)',
    options: [
      'Guarda 5 en a, 10 en b, suma ambos valores y muestra el resultado.',
      'Multiplica 5 por 10.',
      'Muestra solamente a.',
      'Solicita dos números al usuario.'
    ],
    correctAnswer: 0,
    explanation: 'El código asigna 5 a "a", 10 a "b", calcula la suma (15) en "c" y la muestra con print.',
    points: 0.5
  },
  // 29
  {
    id: 'e1_th_29',
    type: 'tracing',
    moduleId: 9,
    topic: 'print() múltiple',
    question: '¿Qué muestra?',
    codeSnippet: 'nombre = "Ana"\nedad = 15\n\nprint(nombre)\nprint(edad)',
    options: [
      'Ana y 15.',
      'nombre y edad.',
      '15 y Ana.',
      'Solamente Ana.'
    ],
    correctAnswer: 0,
    explanation: 'Muestra Ana en la primera línea y 15 en la segunda línea.',
    points: 0.5
  },
  // 30
  {
    id: 'e1_th_30',
    type: 'tracing',
    moduleId: 10,
    topic: 'input() e int()',
    question: '¿Qué realiza el programa?',
    codeSnippet: 'a = int(input("Ingrese un numero: "))\nb = int(input("Ingrese otro numero: "))\nc = a * b\nprint(c)',
    options: [
      'Solicita dos números, los multiplica y muestra el resultado.',
      'Solicita dos textos y los une.',
      'Solamente muestra los números ingresados.',
      'Suma automáticamente los dos números.'
    ],
    correctAnswer: 0,
    explanation: 'Pide dos números por teclado, los convierte a entero, calcula el producto con a * b y muestra el resultado con print.',
    points: 0.5
  },
  // 31 (Nuevo Ejercicio 1 de Análisis)
  {
    id: 'e1_th_31',
    type: 'tracing',
    moduleId: 10,
    topic: 'Análisis de programa completo',
    question: '¿Qué realiza el programa?',
    codeSnippet: 'nombre = input("Ingrese su nombre: ")\nedad = int(input("Ingrese su edad: "))\n\nprint("Hola", nombre)\nprint("El año que viene tendrás", edad + 1)',
    options: [
      'Solicita nombre y edad, y muestra el nombre y la edad que tendrá la persona el año siguiente.',
      'Solicita solamente el nombre y muestra la edad.',
      'Solicita la edad y calcula el doble.',
      'Guarda la edad como texto y no permite realizar operaciones.'
    ],
    correctAnswer: 0,
    explanation: 'El programa solicita el nombre y la edad, calcula edad + 1 y muestra ambos datos mediante print.',
    points: 0.5
  },
  // 32 (Nuevo Ejercicio 2 de Encontrar el error)
  {
    id: 'e1_th_32',
    type: 'tracing',
    moduleId: 10,
    topic: 'Detección de errores',
    question: '¿Cuál es el problema principal del programa?',
    codeSnippet: 'precio = input("Ingrese el precio: ")\ncantidad = input("Ingrese la cantidad: ")\n\ntotal = precio * cantidad\n\nprint("Total:", total)',
    options: [
      'print() no puede mostrar una variable.',
      'input() devuelve datos que deben convertirse a números para realizar cálculos numéricos.',
      'La variable total no puede utilizarse.',
      'El operador * no sirve para multiplicar.'
    ],
    correctAnswer: 1,
    explanation: 'input() siempre devuelve cadenas de texto (str). Para poder multiplicar se deben convertir con int() o float().',
    points: 0.5
  },
  // 33 (Nuevo Ejercicio 3 de ¿Qué resultado obtiene?)
  {
    id: 'e1_th_33',
    type: 'tracing',
    moduleId: 10,
    topic: 'Análisis de operaciones con input',
    question: 'Si el usuario ingresa 8 y 5 en ese orden, ¿qué mostrará?',
    codeSnippet: 'numero1 = int(input("Ingrese un numero: "))\nnumero2 = int(input("Ingrese otro numero: "))\n\nresultado = numero1 + numero2\n\nprint("Resultado:", resultado)',
    options: [
      'Resultado: 85',
      'Resultado: 13',
      'Resultado: 40',
      'Resultado: 8 + 5'
    ],
    correctAnswer: 1,
    explanation: 'Al convertirse a int(), 8 + 5 realiza la suma numérica dando como resultado 13.',
    points: 0.5
  },
  // 34 (Nuevo Ejercicio 4 de Encontrar y corregir el error)
  {
    id: 'e1_th_34',
    type: 'tracing',
    moduleId: 9,
    topic: 'Sintaxis y corrección',
    question: '¿Qué debe corregirse para que el programa funcione?',
    codeSnippet: 'nombre = input("Ingrese su nombre: ")\nedad = int(input("Ingrese su edad: "))\n\nprint("Nombre:", nombre)\nprint("Edad:", edad',
    options: [
      'Cambiar input() por print().',
      'Cambiar int por str.',
      'Agregar el paréntesis ) que falta en print("Edad:", edad).',
      'Eliminar la variable edad.'
    ],
    correctAnswer: 2,
    explanation: 'La última línea tiene un error de sintaxis porque no cierra el paréntesis de la función print().',
    points: 0.5
  },
  // 35 (Nuevo Ejercicio 5 de Analizar todo el recorrido)
  {
    id: 'e1_th_35',
    type: 'tracing',
    moduleId: 10,
    topic: 'Análisis integral de recorrido',
    question: 'Si el usuario ingresa 1500 y 2 en ese orden, ¿qué mostrará?',
    codeSnippet: 'precio = float(input("Ingrese el precio del producto: "))\ncantidad = int(input("Ingrese la cantidad: "))\n\nsubtotal = precio * cantidad\naumento = 500\n\ntotal = subtotal + aumento\n\nprint("Subtotal:", subtotal)\nprint("Total:", total)',
    options: [
      'Subtotal: 3000 y Total: 3500',
      'Subtotal: 2000 y Total: 2500',
      'Subtotal: 3000 y Total: 3000',
      'Subtotal: 1500 y Total: 2000'
    ],
    correctAnswer: 0,
    explanation: 'precio * cantidad es 1500 * 2 = 3000 (subtotal). Luego total = 3000 + 500 = 3500.',
    points: 0.5
  }
];

// ============================================================================
// 2. BANCO DE 13 EJERCICIOS PRÁCTICOS (Requerimiento Sección 4)
// ============================================================================

export const EXAM01_PRACTICAL_BANK: ExamUnifiedQuestion[] = [
  // Ejercicio 1
  {
    id: 'e1_prac_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Suma de tres números',
    title: 'Ejercicio 1: Suma de tres números',
    question: 'Crear un programa que solicite al usuario tres números y muestre el resultado de la suma.',
    starterCode: `# Solicita tres números al usuario y mostrá el resultado de la suma:\n\n`,
    solution: `n1 = int(input())\nn2 = int(input())\nn3 = int(input())\nprint(n1 + n2 + n3)`,
    testCases: [
      {
        name: 'Suma: 4 + 6 + 10 = 20',
        inputs: ['4', '6', '10'],
        expectedOutputs: ['20'],
        description: 'La suma de 4, 6 y 10 debe dar 20'
      },
      {
        name: 'Suma: 10 + 25 + 15 = 50',
        inputs: ['10', '25', '15'],
        expectedOutputs: ['50'],
        description: 'La suma de 10, 25 y 15 debe dar 50'
      }
    ],
    points: 0.5
  },
  // Ejercicio 2
  {
    id: 'e1_prac_02',
    type: 'coding',
    moduleId: 10,
    topic: 'Multiplicación de dos números',
    title: 'Ejercicio 2: Multiplicación de dos números',
    question: 'Crear un programa que solicite dos números y muestre el resultado de multiplicarlos.',
    starterCode: `# Solicita dos números y mostrá el resultado de multiplicarlos:\n\n`,
    solution: `a = int(input())\nb = int(input())\nprint(a * b)`,
    testCases: [
      {
        name: 'Multiplicación: 5 * 8 = 40',
        inputs: ['5', '8'],
        expectedOutputs: ['40'],
        description: '5 multiplicado por 8 debe dar 40'
      },
      {
        name: 'Multiplicación: 12 * 10 = 120',
        inputs: ['12', '10'],
        expectedOutputs: ['120'],
        description: '12 multiplicado por 10 debe dar 120'
      }
    ],
    points: 0.5
  },
  // Ejercicio 3
  {
    id: 'e1_prac_03',
    type: 'coding',
    moduleId: 10,
    topic: 'Mensaje de bienvenida',
    title: 'Ejercicio 3: Mensaje de bienvenida',
    question: 'Crear un programa que solicite el nombre del usuario y luego muestre un mensaje de bienvenida (por ejemplo: "Bienvenido" o "Hola" acompañado del nombre).',
    starterCode: `# Solicita el nombre del usuario y mostrá un mensaje de bienvenida:\n\n`,
    solution: `nombre = input()\nprint("Bienvenido", nombre)`,
    testCases: [
      {
        name: 'Bienvenida a Lucas',
        inputs: ['Lucas'],
        expectedOutputs: ['Lucas'],
        description: 'Debe mostrar el saludo con el nombre Lucas'
      },
      {
        name: 'Bienvenida a Martina',
        inputs: ['Martina'],
        expectedOutputs: ['Martina'],
        description: 'Debe mostrar el saludo con el nombre Martina'
      }
    ],
    points: 0.5
  },
  // Ejercicio 4
  {
    id: 'e1_prac_04',
    type: 'coding',
    moduleId: 10,
    topic: 'Precio con aumento de $500',
    title: 'Ejercicio 4: Precio con aumento fijo de $500',
    question: 'Crear un programa que solicite el precio de un producto y muestre ese precio aumentado en $500.',
    starterCode: `# Solicita el precio del producto y mostralo aumentado en 500:\n\n`,
    solution: `precio = int(input())\nprint(precio + 500)`,
    testCases: [
      {
        name: 'Precio 1500 + 500 = 2000',
        inputs: ['1500'],
        expectedOutputs: ['2000'],
        description: '1500 aumentado en 500 debe dar 2000'
      },
      {
        name: 'Precio 200 + 500 = 700',
        inputs: ['200'],
        expectedOutputs: ['700'],
        description: '200 aumentado en 500 debe dar 700'
      }
    ],
    points: 0.5
  },
  // Ejercicio 5
  {
    id: 'e1_prac_05',
    type: 'coding',
    moduleId: 10,
    topic: 'Cálculo de promedio',
    title: 'Ejercicio 5: Promedio de tres números',
    question: 'Crear un programa que solicite tres números y calcule el promedio.',
    starterCode: `# Solicita tres números y mostrá su promedio:\n\n`,
    solution: `n1 = int(input())\nn2 = int(input())\nn3 = int(input())\nprint((n1 + n2 + n3) / 3)`,
    testCases: [
      {
        name: 'Promedio de 6, 8 y 10 = 8',
        inputs: ['6', '8', '10'],
        expectedOutputs: ['8'],
        description: 'El promedio de 6, 8 y 10 es 8'
      },
      {
        name: 'Promedio de 10, 20 y 30 = 20',
        inputs: ['10', '20', '30'],
        expectedOutputs: ['20'],
        description: 'El promedio de 10, 20 y 30 es 20'
      }
    ],
    points: 0.5
  },
  // Ejercicio 6
  {
    id: 'e1_prac_06',
    type: 'coding',
    moduleId: 10,
    topic: 'Área de un triángulo',
    title: 'Ejercicio 6: Área de un triángulo',
    question: 'Solicitar base y altura de un triángulo y calcular su área. Fórmula: area = base * altura / 2.',
    starterCode: `# Pedí la base y la altura y mostrá el área (base * altura / 2):\n\n`,
    solution: `base = int(input())\naltura = int(input())\nprint(base * altura / 2)`,
    testCases: [
      {
        name: 'Base 10 y altura 4 = 20',
        inputs: ['10', '4'],
        expectedOutputs: ['20'],
        description: '10 * 4 / 2 debe dar 20'
      },
      {
        name: 'Base 6 y altura 5 = 15',
        inputs: ['6', '5'],
        expectedOutputs: ['15'],
        description: '6 * 5 / 2 debe dar 15'
      }
    ],
    points: 0.5
  },
  // Ejercicio 7
  {
    id: 'e1_prac_07',
    type: 'coding',
    moduleId: 10,
    topic: 'Precio con descuento',
    title: 'Ejercicio 7: Precio con descuento',
    question: 'Solicitar el precio de un producto y el monto del descuento a aplicar. Calcular y mostrar el precio final con el descuento.',
    starterCode: `# Pedí el precio y el descuento, y mostrá el precio final:\n\n`,
    solution: `precio = int(input())\ndescuento = int(input())\nprint(precio - descuento)`,
    testCases: [
      {
        name: 'Precio 1000 con descuento 200 = 800',
        inputs: ['1000', '200'],
        expectedOutputs: ['800'],
        description: '1000 menos 200 debe dar 800'
      },
      {
        name: 'Precio 500 con descuento 50 = 450',
        inputs: ['500', '50'],
        expectedOutputs: ['450'],
        description: '500 menos 50 debe dar 450'
      }
    ],
    points: 0.5
  },
  // Ejercicio 8
  {
    id: 'e1_prac_08',
    type: 'coding',
    moduleId: 10,
    topic: 'Suma, resta y multiplicación',
    title: 'Ejercicio 8: Suma, resta y multiplicación',
    question: 'Solicitar dos números y mostrar: su suma, su resta y su multiplicación (en líneas separadas con print).',
    starterCode: `# Pedí 2 números y mostrá la suma, la resta y la multiplicación en líneas separadas:\n\n`,
    solution: `a = int(input())\nb = int(input())\nprint(a + b)\nprint(a - b)\nprint(a * b)`,
    testCases: [
      {
        name: 'Números 10 y 4: suma 14, resta 6, mult 40',
        inputs: ['10', '4'],
        expectedOutputs: ['14', '6', '40'],
        description: 'Debe mostrar 14, 6 y 40'
      },
      {
        name: 'Números 20 y 5: suma 25, resta 15, mult 100',
        inputs: ['20', '5'],
        expectedOutputs: ['25', '15', '100'],
        description: 'Debe mostrar 25, 15 y 100'
      }
    ],
    points: 0.5
  },
  // Ejercicio 9
  {
    id: 'e1_prac_09',
    type: 'coding',
    moduleId: 10,
    topic: 'Lectura de datos personales',
    title: 'Ejercicio 9: Nombre, edad y ciudad',
    question: 'Solicitar: nombre, edad y ciudad. Luego mostrar los tres datos ingresados.',
    starterCode: `# Pedí nombre, edad y ciudad, y mostralos en pantalla:\n\n`,
    solution: `nombre = input()\nedad = input()\nciudad = input()\nprint(nombre)\nprint(edad)\nprint(ciudad)`,
    testCases: [
      {
        name: 'Ana, 16, Córdoba',
        inputs: ['Ana', '16', 'Córdoba'],
        expectedOutputs: ['Ana', '16', 'Córdoba'],
        description: 'Debe mostrar Ana, 16 y Córdoba'
      },
      {
        name: 'Leo, 15, Rosario',
        inputs: ['Leo', '15', 'Rosario'],
        expectedOutputs: ['Leo', '15', 'Rosario'],
        description: 'Debe mostrar Leo, 15 y Rosario'
      }
    ],
    points: 0.5
  },
  // Ejercicio 10
  {
    id: 'e1_prac_10',
    type: 'coding',
    moduleId: 10,
    topic: 'Nuevo sueldo con aumento',
    title: 'Ejercicio 10: Nuevo sueldo con aumento',
    question: 'Solicitar el sueldo actual y el monto del aumento. Calcular y mostrar el nuevo sueldo.',
    starterCode: `# Pedí el sueldo actual y el aumento, y mostrá el nuevo sueldo:\n\n`,
    solution: `sueldo = int(input())\naumento = int(input())\nprint(sueldo + aumento)`,
    testCases: [
      {
        name: 'Sueldo 80000 + aumento 15000 = 95000',
        inputs: ['80000', '15000'],
        expectedOutputs: ['95000'],
        description: 'Debe mostrar 95000'
      },
      {
        name: 'Sueldo 100000 + aumento 20000 = 120000',
        inputs: ['100000', '20000'],
        expectedOutputs: ['120000'],
        description: 'Debe mostrar 120000'
      }
    ],
    points: 0.5
  },
  // Ejercicio 11
  {
    id: 'e1_prac_11',
    type: 'coding',
    moduleId: 10,
    topic: 'Importe total de compra',
    title: 'Ejercicio 11: Importe total de compra',
    question: 'Solicitar precio de un producto y cantidad comprada. Calcular y mostrar el importe total.',
    starterCode: `# Pedí precio unitario y cantidad, y mostrá el importe total:\n\n`,
    solution: `precio = int(input())\ncantidad = int(input())\nprint(precio * cantidad)`,
    testCases: [
      {
        name: 'Precio 150 por 3 unidades = 450',
        inputs: ['150', '3'],
        expectedOutputs: ['450'],
        description: 'Debe mostrar 450'
      },
      {
        name: 'Precio 200 por 5 unidades = 1000',
        inputs: ['200', '5'],
        expectedOutputs: ['1000'],
        description: 'Debe mostrar 1000'
      }
    ],
    points: 0.5
  },
  // Ejercicio 12
  {
    id: 'e1_prac_12',
    type: 'coding',
    moduleId: 10,
    topic: 'Conversión Celsius a Fahrenheit',
    title: 'Ejercicio 12: Conversión Celsius a Fahrenheit',
    question: 'Solicitar temperatura en Celsius y convertirla a Fahrenheit. Fórmula: F = C * 9 / 5 + 32.',
    starterCode: `# Pedí la temperatura en Celsius y mostrá el equivalente en Fahrenheit:\n\n`,
    solution: `c = float(input())\nf = c * 9 / 5 + 32\nprint(f)`,
    testCases: [
      {
        name: '0 °C = 32 °F',
        inputs: ['0'],
        expectedOutputs: ['32'],
        description: '0 grados Celsius equivale a 32 Fahrenheit'
      },
      {
        name: '100 °C = 212 °F',
        inputs: ['100'],
        expectedOutputs: ['212'],
        description: '100 grados Celsius equivale a 212 Fahrenheit'
      }
    ],
    points: 0.5
  },
  // Ejercicio 13
  {
    id: 'e1_prac_13',
    type: 'coding',
    moduleId: 10,
    topic: 'Área y perímetro de rectángulo',
    title: 'Ejercicio 13: Área y perímetro de un rectángulo',
    question: 'Solicitar base y altura de un rectángulo y calcular: área (base * altura) y perímetro (2 * (base + altura)).',
    starterCode: `# Pedí base y altura de un rectángulo y mostrá área y perímetro:\n\n`,
    solution: `base = int(input())\naltura = int(input())\narea = base * altura\nperimetro = 2 * (base + altura)\nprint(area)\nprint(perimetro)`,
    testCases: [
      {
        name: 'Base 5 y altura 3: área 15, perímetro 16',
        inputs: ['5', '3'],
        expectedOutputs: ['15', '16'],
        description: 'Debe mostrar 15 y 16'
      },
      {
        name: 'Base 10 y altura 4: área 40, perímetro 28',
        inputs: ['10', '4'],
        expectedOutputs: ['40', '28'],
        description: 'Debe mostrar 40 y 28'
      }
    ],
    points: 0.5
  }
];

// ============================================================================
// 3. FUNCIONES DE ROTACIÓN Y GESTIÓN DE INTENTOS
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleQuestionOptions(q: ExamUnifiedQuestion): ExamUnifiedQuestion {
  if (!q.options || q.options.length <= 1 || q.correctAnswer === undefined) {
    return { ...q };
  }

  const originalCorrectOption = q.options[q.correctAnswer];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectAnswerIndex = shuffledOptions.indexOf(originalCorrectOption);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswerIndex
  };
}

/**
 * Clave única y normalizada del alumno para control de intentos
 */
export function getStudentKey(student: ExamStudentData): string {
  const s = (student.school || '').trim().toLowerCase();
  const c = (student.course || '').trim().toLowerCase();
  const l = (student.studentLastName || '').trim().toLowerCase();
  const n = (student.studentName || '').trim().toLowerCase();
  return `${s}::${c}::${l}::${n}`;
}

/**
 * Obtiene la cantidad de intentos completados por el alumno
 */
export function getStudentCompletedAttemptsCount(student: ExamStudentData): number {
  try {
    if (typeof localStorage === 'undefined') return 0;
    const raw = localStorage.getItem(EXAM01_ATTEMPTS_STORAGE_KEY);
    if (!raw) return 0;
    const map = JSON.parse(raw);
    const key = getStudentKey(student);
    const list = map[key] || [];
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Registra un intento finalizado en el historial local
 */
export function recordCompletedAttempt(result: ExamEvaluationResult): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(EXAM01_ATTEMPTS_STORAGE_KEY) || '{}';
    const map = JSON.parse(raw);
    const key = getStudentKey(result.student);
    if (!map[key]) map[key] = [];
    map[key].push(result);
    localStorage.setItem(EXAM01_ATTEMPTS_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Error al guardar historial de intentos:', err);
  }
}

/**
 * Verifica si el alumno ya alcanzó los 3 intentos máximos
 */
export function hasExceededAttempts(student: ExamStudentData): boolean {
  return getStudentCompletedAttemptsCount(student) >= EXAM01_CONFIG.maxAttempts;
}

/**
 * Genera un intento rotativo de exactamente 20 preguntas:
 * - 15 preguntas de opción múltiple del banco teórico
 * - 3 preguntas de análisis de código del banco de tracing
 * - 2 ejercicios prácticos del banco de 13 problemas (sin repetir)
 * - Mezcla opciones y orden de preguntas una sola vez al iniciar el intento
 */
export function generateExam01Session(student: ExamStudentData, attemptNumber?: number): ActiveExamSession {
  if (hasExceededAttempts(student)) {
    throw new Error('Has alcanzado el límite máximo de 3 intentos para este examen.');
  }

  // 1. Separar preguntas teóricas conceptuales y de análisis/tracing
  const mcPool = EXAM01_THEORY_BANK.filter(q => q.type === 'multiple_choice');
  const tracingPool = EXAM01_THEORY_BANK.filter(q => q.type === 'tracing');

  // Seleccionar 16 de opción múltiple
  const selectedMC = shuffleArray(mcPool).slice(0, EXAM01_CONFIG.distribution.multiple_choice);

  // Seleccionar 2 de análisis de código
  const selectedTracing = shuffleArray(tracingPool).slice(0, EXAM01_CONFIG.distribution.tracing);

  // Seleccionar 2 ejercicios prácticos del banco de 13 ejercicios
  const selectedCoding = shuffleArray(EXAM01_PRACTICAL_BANK).slice(0, EXAM01_CONFIG.distribution.coding);

  // Mezclar las opciones de respuesta para las preguntas de opción múltiple y tracing
  const preparedMC = selectedMC.map(shuffleQuestionOptions);
  const preparedTracing = selectedTracing.map(shuffleQuestionOptions);
  const preparedCoding = selectedCoding.map(q => ({ ...q }));

  // Unir y mezclar el orden de las 20 preguntas
  const combined = shuffleArray([...preparedMC, ...preparedTracing, ...preparedCoding]);

  const initialAnswers: Record<string, number | string> = {};
  combined.forEach(q => {
    if (q.type === 'coding') {
      initialAnswers[q.id] = q.starterCode || '';
    }
  });

  const effectiveAttempt = attemptNumber || (getStudentCompletedAttemptsCount(student) + 1);

  const session: ActiveExamSession = {
    examId: 'exam-1',
    student: {
      ...student,
      attemptNumber: effectiveAttempt
    },
    attemptNumber: effectiveAttempt,
    startTimestamp: Date.now(),
    durationMinutes: EXAM01_CONFIG.durationMinutes,
    questions: combined,
    answers: initialAnswers,
    submitted: false
  };

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(EXAM01_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error('Error al persistir sesión de examen:', err);
  }

  return session;
}

export function getStoredExam01Session(): ActiveExamSession | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(EXAM01_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.examId === 'exam-1' && Array.isArray(parsed.questions)) {
      return parsed as ActiveExamSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearStoredExam01Session(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(EXAM01_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Objeto del Examen para integración global
 */
export const exam01: Exam = {
  id: 'exam-1',
  title: 'Modelo de Examen N.º 1',
  subtitle: 'Fundamentos, Variables, Operadores e I/O',
  description: 'Evaluación de 20 preguntas (15 conceptuales, 3 de interpretación y 2 prácticas) con 40 minutos de duración. Máximo 3 intentos por alumno.',
  modules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  moduleTitles: [
    'M1: Introducción a la programación',
    'M2: Fundamentos de la programación',
    'M3: ¿Qué es Python?',
    'M4: Variables y asignación',
    'M5: Tipos de datos básicos',
    'M6: Operadores aritméticos',
    'M7: Operadores de comparación',
    'M8: Operadores lógicos',
    'M9: Función print()',
    'M10: Función input() y conversiones'
  ],
  durationMinutes: 40,
  available: true,
  totalPoints: 10,
  config: EXAM01_CONFIG,
  questionBank: [...EXAM01_THEORY_BANK, ...EXAM01_PRACTICAL_BANK]
};

export const EXAM01_QUESTION_BANK = exam01.questionBank;
