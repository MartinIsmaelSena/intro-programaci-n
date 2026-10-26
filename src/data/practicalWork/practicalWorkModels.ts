import { ExamUnifiedQuestion } from '../../types/exam';
import { TPModelType, TPModality } from '../../types/practicalWorkSession';

// ============================================================================
// BANCO DE PREGUNTAS Y ACTIVIDADES PARA TRABAJO PRÁCTICO (3 MODELOS EQUIVALENTES)
//
// Distribución por Modalidad:
// - INDIVIDUAL (20 actividades):
//     * 6 Preguntas Teóricas Conceptuales
//     * 4 Preguntas de Interpretación de Código («¿Qué muestra / hace este código?»)
//     * 4 Preguntas de Detección de Errores («¿Qué problema tiene este código?»)
//     * 2 Preguntas de Expresiones Matemáticas y Lógicas (and, or, not, comparaciones)
//     * 4 Ejercicios Prácticos de Programación en Python con Pyodide
//     = 16 preguntas (4.0 pts) + 4 ejercicios de código (6.0 pts) = 10.0 pts.
//
// - EN PAREJA (40 actividades):
//     * 12 Preguntas Teóricas Conceptuales
//     * 8 Preguntas de Interpretación de Código («¿Qué muestra / hace este código?»)
//     * 8 Preguntas de Detección de Errores («¿Qué problema tiene este código?»)
//     * 4 Preguntas de Expresiones Matemáticas y Lógicas (and, or, not, comparaciones)
//     * 8 Ejercicios Prácticos de Programación en Python con Pyodide
//     = 32 preguntas (4.0 pts) + 8 ejercicios de código (6.0 pts) = 10.0 pts.
//
// Contenidos Evaluados (estrictamente limitados a los módulos 3 al 10):
// - Qué es Python y el intérprete (Módulo 3)
// - Variables, asignación con =, reasignación y reglas de nombres (Módulo 4)
// - Tipos de datos: int, float, str, bool y función type() (Módulo 5)
// - Operaciones aritméticas: +, -, *, /, //, %, ** y precedencia con () (Módulo 6)
// - Operadores de comparación: ==, !=, >, <, >=, <= y diferencia con = (Módulo 7)
// - Operadores lógicos: and, or, not y tablas de verdad (Módulo 8)
// - Función print(), concatenación, separación por coma y salto \n (Módulo 9)
// - Función input() (retorno str) y conversión obligatoria int() / float() (Módulo 10)
// ============================================================================

// ============================================================================
// --- MODELO A ---
// ============================================================================

// 1. Conceptos Teóricos (12 preguntas)
const MODEL_A_THEORY: ExamUnifiedQuestion[] = [
  {
    id: 'tp_a_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Concepto Teórico: Qué es Python',
    question: '¿Qué es Python y cuál es una de sus principales características de diseño?',
    options: [
      'Es un lenguaje de programación de alto nivel e interpretado, diseñado para que su código sea claro y legible.',
      'Es un sistema operativo que reemplaza a Windows en computadoras hogareñas.',
      'Es un programa exclusivo para diseñar páginas web estáticas sin código.',
      'Es un compilador especial para chips que solo procesa números binarios.'
    ],
    correctAnswer: 0,
    explanation: 'Python es un lenguaje de programación de alto nivel e interpretado, caracterizado por su sintaxis limpia y su alta legibilidad.',
    points: 0.5
  },
  {
    id: 'tp_a_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Concepto Teórico: Tipos de datos',
    question: '¿A qué tipos de datos pertenecen respectivamente los valores 25, 3.14, "Hola" y True en Python?',
    options: [
      'str, float, int y bool respectivamente.',
      'int, float, str y bool respectivamente.',
      'int, bool, str y float respectivamente.',
      'float, int, bool y str respectivamente.'
    ],
    correctAnswer: 1,
    explanation: 'En Python, 25 es un entero (int), 3.14 es decimal de coma flotante (float), "Hola" es texto (str) y True es booleano (bool).',
    points: 0.5
  },
  {
    id: 'tp_a_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Asignación',
    question: 'En la instrucción puntos = 100, ¿qué función cumple exactamente el signo =?',
    options: [
      'Compara si puntos y 100 son iguales y devuelve True o False.',
      'Busca el valor de puntos en una ecuación algebraica.',
      'Asigna y almacena el valor 100 dentro de la variable puntos.',
      'Elimina la variable puntos de la memoria del sistema.'
    ],
    correctAnswer: 2,
    explanation: 'Un único signo igual (=) es el operador de asignación en Python: toma el valor de la derecha y lo guarda en la variable de la izquierda.',
    points: 0.5
  },
  {
    id: 'tp_a_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Nombres de variables',
    question: '¿Cuál de los siguientes identificadores es un nombre de variable VÁLIDO en Python?',
    options: [
      '2do_parcial',
      'precio total',
      'costo-envio',
      'cantidad_alumnos'
    ],
    correctAnswer: 3,
    explanation: 'cantidad_alumnos es válido porque usa letras y guion bajo. No se permiten nombres que inicien con números (2do_parcial), contengan espacios (precio total) o guiones medios (costo-envio).',
    points: 0.5
  },
  {
    id: 'tp_a_th_05',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Concepto Teórico: Función print()',
    question: '¿Cómo separa print() los diferentes valores cuando se le pasan varios argumentos separados por coma (ej: print("Nota:", 9))?',
    options: [
      'Los une pegados sin ningún espacio intermedio.',
      'Inserta automáticamente un espacio en blanco entre cada valor.',
      'Inserta un signo de suma entre los elementos.',
      'Genera un salto de renglón entre cada argumento.'
    ],
    correctAnswer: 1,
    explanation: 'Por defecto, la función print() coloca un espacio en blanco entre los argumentos que recibe separados por coma.',
    points: 0.5
  },
  {
    id: 'tp_a_th_06',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Concepto Teórico: Salto de línea',
    question: '¿Cuál es el efecto del caracter especial \\n dentro de una cadena de texto en print()?',
    options: [
      'Provoca un salto de línea hacia el renglón siguiente.',
      'Borra la palabra que está justo antes de la barra.',
      'Convierte el texto que le sigue en un número entero.',
      'Detiene la ejecución del programa inmediatamente.'
    ],
    correctAnswer: 0,
    explanation: '\\n representa un caracter de escape de nueva línea (newline), haciendo que el texto posterior se imprima en el renglón de abajo.',
    points: 0.5
  },
  {
    id: 'tp_a_th_07',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Función input()',
    question: '¿Qué tipo de dato devuelve SIEMPRE la función input() al leer una entrada del usuario?',
    options: [
      'Devuelve int si el usuario escribe dígitos, y str si escribe letras.',
      'Devuelve siempre un dato de tipo cadena de texto (str).',
      'Devuelve un valor booleano (bool) indicando si hubo entrada.',
      'Devuelve un número decimal (float) por defecto.'
    ],
    correctAnswer: 1,
    explanation: 'input() siempre devuelve el valor ingresado como una cadena de texto (str), aun cuando el usuario solo haya escrito números.',
    points: 0.5
  },
  {
    id: 'tp_a_th_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Conversión int()',
    question: '¿Por qué debemos usar int() al solicitar un número con input() antes de realizar cálculos matemáticos?',
    options: [
      'Porque int() borra la pantalla de la consola antes de calcular.',
      'Porque sin int(), el operador + concatenaría los textos en vez de sumar los números.',
      'Porque Python no permite usar variables en sumas sin int().',
      'Porque int() transforma los textos en valores True o False.'
    ],
    correctAnswer: 1,
    explanation: 'Como input() devuelve texto (str), si sumamos sin convertir, Python concatenará las cadenas (ej: "5" + "3" da "53"). Usamos int() para obtener números reales.',
    points: 0.5
  },
  // Preguntas conceptuales complementarias (parejas):
  {
    id: 'tp_a_th_09',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Concepto Teórico: Comparación vs Asignación',
    question: '¿Cuál es la diferencia crítica entre los operadores = y == en Python?',
    options: [
      '= asigna un valor a una variable, mientras que == compara si dos valores son iguales.',
      'Son idénticos y se pueden usar indistintamente.',
      '= compara cadenas de texto y == compara números enteros.',
      '== asigna un valor y = borra la variable de la memoria.'
    ],
    correctAnswer: 0,
    explanation: '= es el operador de asignación (guarda datos); == es el operador de comparación de igualdad (devuelve True o False).',
    points: 0.5
  },
  {
    id: 'tp_a_th_10',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: División decimal vs División entera',
    question: '¿Qué diferencia existe entre el operador / y el operador // en Python?',
    options: [
      '/ suma decimales y // resta decimales.',
      '/ realiza la división decimal (devuelve float); // realiza la división entera descartando los decimales.',
      '/ solo funciona con números negativos y // con positivos.',
      'No hay diferencia; ambos devuelven siempre un número entero.'
    ],
    correctAnswer: 1,
    explanation: '/ es la división flotante (ej: 7 / 2 -> 3.5), mientras que // es la división entera que trunca los decimales (ej: 7 // 2 -> 3).',
    points: 0.5
  },
  {
    id: 'tp_a_th_11',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: Operador Módulo %',
    question: '¿Para qué sirve el operador aritmético módulo (%) en Python?',
    options: [
      'Para calcular el porcentaje de descuento de un precio.',
      'Para elevar un número a una potencia.',
      'Para obtener el resto o residuo de una división entera.',
      'Para redondear un número con decimales al entero más cercano.'
    ],
    correctAnswer: 2,
    explanation: '% calcula el resto de una división entera (ej: 7 % 2 es 1). Es la herramienta estándar para saber si un número es par (n % 2 == 0) o impar.',
    points: 0.5
  },
  {
    id: 'tp_a_th_12',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Concepto Teórico: Operador Lógico and',
    question: '¿En qué único caso la expresión condicion_1 and condicion_2 devuelve True?',
    options: [
      'Cuando ambas condiciones son verdaderas (True).',
      'Cuando al menos una de las dos condiciones es verdadera.',
      'Cuando ambas condiciones son falsas.',
      'Cuando la primera condición es falsa pero la segunda es verdadera.'
    ],
    correctAnswer: 0,
    explanation: 'El operador and exige que ambas condiciones evaluadas sean True para que el resultado final sea True.',
    points: 0.5
  }
];

// 2. Interpretación de Código («¿Qué muestra / hace este código?») (6 preguntas)
const MODEL_A_INTERPRETATION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_a_int_01',
    type: 'tracing',
    moduleId: 4,
    topic: 'Interpretación de Código: Reasignación',
    question: '¿Qué muestra en pantalla este código al ejecutarse?',
    codeSnippet: 'x = 10\nx = 25\nx = x + 5\nprint(x)',
    options: [
      '10',
      '30',
      '25',
      '35'
    ],
    correctAnswer: 1,
    explanation: 'Primero x vale 10, luego se reasigna a 25. En la tercera línea se calcula 25 + 5 = 30 y se guarda en x. Se muestra 30.',
    points: 0.5
  },
  {
    id: 'tp_a_int_02',
    type: 'tracing',
    moduleId: 9,
    topic: 'Interpretación de Código: Texto vs Variable',
    question: '¿Qué muestra en pantalla este programa al ejecutarse?',
    codeSnippet: 'ciudad = "Córdoba"\nprint("ciudad")',
    options: [
      'Córdoba',
      'ciudad',
      '"Córdoba"',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'Al colocar "ciudad" entre comillas, print() muestra el texto literal ciudad, no el contenido de la variable.',
    points: 0.5
  },
  {
    id: 'tp_a_int_03',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: Operaciones con variables',
    question: '¿Qué salida genera este código en la consola?',
    codeSnippet: 'base = 8\ndoble = base * 2\nprint("Resultado:", doble)',
    options: [
      'Resultado: 16',
      'Resultado: base * 2',
      '16',
      'Resultado:8*2'
    ],
    correctAnswer: 0,
    explanation: 'doble almacena 8 * 2 = 16. print() muestra la etiqueta textual seguida del valor 16 con un espacio intermedio.',
    points: 0.5
  },
  {
    id: 'tp_a_int_04',
    type: 'tracing',
    moduleId: 10,
    topic: 'Interpretación de Código: Conversión y suma',
    question: '¿Qué valor imprime este código al ejecutarse?',
    codeSnippet: 'texto = "15"\nnumero = int(texto) + 10\nprint(numero)',
    options: [
      '1510',
      '25',
      '15',
      'Error de tipos'
    ],
    correctAnswer: 1,
    explanation: 'int("15") transforma la cadena "15" en el número entero 15. Luego, 15 + 10 da 25.',
    points: 0.5
  },
  // Complementarias (parejas):
  {
    id: 'tp_a_int_05',
    type: 'tracing',
    moduleId: 7,
    topic: 'Interpretación de Código: Comparación',
    question: '¿Qué imprime exactamente este programa?',
    codeSnippet: 'puntos = 45\nrecord = 40\nprint(puntos > record)',
    options: [
      'puntos > record',
      'True',
      'False',
      '45'
    ],
    correctAnswer: 1,
    explanation: 'El operador > evalúa si 45 es estrictamente mayor que 40. Como es verdad, print() muestra True.',
    points: 0.5
  },
  {
    id: 'tp_a_int_06',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: División entera',
    question: '¿Qué muestra este código al ejecutarse?',
    codeSnippet: 'paquete = 14\ncajas = paquete // 4\nprint(cajas)',
    options: [
      '3.5',
      '3',
      '2',
      '14'
    ],
    correctAnswer: 1,
    explanation: '// calcula la división entera: 14 // 4 da 3 (porque 4 * 3 = 12, sobrando 2 que se descartan).',
    points: 0.5
  },
  {
    id: 'tp_a_int_07',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: Operaciones y variables',
    question: '¿Qué resultado muestra en pantalla este código?',
    codeSnippet: 'base = 8\naltura = 4\narea = (base * altura) // 2\nprint("Área:", area)',
    options: [
      'Área: 16',
      'Área: 32',
      'Área: 16.0',
      'Área: 8'
    ],
    correctAnswer: 0,
    explanation: 'Primero se calcula 8 * 4 = 32. Luego 32 // 2 da la división entera 16. Se imprime "Área: 16".',
    points: 0.5
  },
  {
    id: 'tp_a_int_08',
    type: 'tracing',
    moduleId: 9,
    topic: 'Interpretación de Código: Concatenación y repetición',
    question: '¿Qué muestra este programa al ejecutarse?',
    codeSnippet: 'saludo = "Hola"\nseparador = "-" * 3\nprint(saludo + separador + "Python")',
    options: [
      'Hola---Python',
      'Hola-3Python',
      'Hola - Python',
      'Error de sintaxis'
    ],
    correctAnswer: 0,
    explanation: 'El operador * con texto repite la cadena: "-" * 3 genera "---". Al concatenar con + resulta "Hola---Python".',
    points: 0.5
  }
];

// 3. Detección de Errores («¿Qué problema tiene este código?») (4 preguntas)
const MODEL_A_ERROR_DETECTION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_a_err_01',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Entrada sin convertir',
    question: '¿Qué problema presenta este código al ejecutarse si el usuario ingresa el número 14?',
    codeSnippet: 'edad = input("Ingresá tu edad: ")\nprint(edad + 5)',
    options: [
      'No tiene ningún problema; muestra 19 en pantalla.',
      'input() devuelve texto (str) y Python no permite sumar directamente un texto con un número entero (+ 5).',
      'print() no permite mostrar números mayores a 10.',
      'La variable edad no puede guardar datos ingresados por teclado.'
    ],
    correctAnswer: 1,
    explanation: 'input() produce una cadena de texto. Intentar edad + 5 provoca un TypeError porque no se puede sumar str con int. Se debe usar int(edad).',
    points: 0.5
  },
  {
    id: 'tp_a_err_02',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Variable no definida',
    question: '¿Qué error ocurre al intentar ejecutar este programa?',
    codeSnippet: 'total = precio * 2\nprecio = 50\nprint(total)',
    options: [
      'Ocurre un NameError porque se intenta usar precio antes de haberle asignado un valor.',
      'El programa muestra 100 sin inconvenientes.',
      'El programa muestra 0 porque precio se inicializa automáticamente en cero.',
      'Se produce un error de sintaxis por usar el número 2.'
    ],
    correctAnswer: 0,
    explanation: 'Python ejecuta el código secuencialmente línea por línea. En la línea 1 la variable precio todavía no existe, produciendo NameError: name \'precio\' is not defined.',
    points: 0.5
  },
  {
    id: 'tp_a_err_03',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Código correcto',
    question: '¿Qué problema tiene este fragmento de código?',
    codeSnippet: 'base = 10\naltura = 6\narea = (base * altura) / 2\nprint("El área es:", area)',
    options: [
      'Las variables no pueden tener nombres en minúscula.',
      'La función print() no puede recibir texto y variable al mismo tiempo.',
      'No tiene ningún error; calcula el área del triángulo (30.0) y la muestra correctamente.',
      'Falta un punto y coma al final de cada instrucción.'
    ],
    correctAnswer: 2,
    explanation: 'El código es totalmente correcto en sintaxis y lógica: define base y altura, calcula el área con paréntesis y la muestra en consola sin fallos.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_a_err_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Sensibilidad a mayúsculas',
    question: '¿Por qué se produce un error al ejecutar este programa?',
    codeSnippet: 'nota = 9\nprint(Nota)',
    options: [
      'Porque Python distingue mayúsculas de minúsculas: nota fue creada con minúscula, pero se intenta imprimir Nota con mayúscula.',
      'Porque los números no se pueden mostrar dentro de print().',
      'Porque las variables solo pueden tener 2 letras.',
      'Porque la variable debió llamarse obligatoriamente resultado.'
    ],
    correctAnswer: 0,
    explanation: 'Python es sensible a mayúsculas y minúsculas (case-sensitive). nota y Nota son variables completamente distintas para el intérprete.',
    points: 0.5
  },
  {
    id: 'tp_a_err_05',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Espacios en nombres de variables',
    question: '¿Qué problema presenta la primera línea de este código?',
    codeSnippet: 'precio final = 250\nprint(precio final)',
    options: [
      'Los nombres de variables no pueden contener espacios en blanco; se debe usar guión bajo (precio_final).',
      'No tiene ningún error; el programa imprime 250.',
      'El número 250 debió escribirse obligatoriamente entre comillas.',
      'Las variables no pueden tener más de 5 letras.'
    ],
    correctAnswer: 0,
    explanation: 'En Python los nombres de variables deben ser un único identificador continuo sin espacios. Para separar palabras se usa guión bajo (snake_case).',
    points: 0.5
  },
  {
    id: 'tp_a_err_06',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Asignación invertida',
    question: '¿Qué error de sintaxis ocurre al intentar ejecutar este código?',
    codeSnippet: '100 = puntos\nprint(puntos)',
    options: [
      'Falla con SyntaxError porque a la izquierda del signo = siempre debe ir el nombre de una variable, no un valor literal.',
      'El código es válido y muestra 100.',
      'El error ocurre en print() porque no puede mostrar puntos.',
      'Se debe usar doble igual (==) para crear variables.'
    ],
    correctAnswer: 0,
    explanation: 'En la asignación (=), la variable receptora debe estar siempre a la izquierda y el valor o expresión a la derecha. Escribir 100 = puntos es sintácticamente inválido.',
    points: 0.5
  },
  // --- NUEVOS MODELOS DE DETECCIÓN DE ERRORES Y ANÁLISIS (MODELOS 1 AL 7) ---
  {
    id: 'tp_a_m1_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Por qué Python repite el texto en lugar de multiplicar los puntos como un número?',
    codeSnippet: "nombre = input(\"Ingresa tu nombre: \")\npuntos_nivel_1 = input(\"¿Cuántos puntos hiciste en el nivel 1?: \")\n\npuntos_totales = puntos_nivel_1 * 3\n\nprint(\"Jugador:\", nombre)\nprint(\"Tus puntos triplicados son:\", puntos_totales)",
    options: [
      "Porque input() devuelve un texto (str), aunque el usuario escriba números.",
      "Porque Python no permite multiplicar números por 3.",
      "Porque print() convierte todos los números en texto antes de calcularlos.",
      "Porque las variables deben escribirse con mayúsculas."
    ],
    correctAnswer: 0,
    explanation: "input() siempre devuelve el valor ingresado como una cadena de texto (str). Multiplicar un texto por un número entero repite la cadena en lugar de realizar una multiplicación matemática.",
    points: 0.5
  },
  {
    id: 'tp_a_m1_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Cómo se corrige el código para multiplicar los puntos numéricamente?',
    codeSnippet: "nombre = input(\"Ingresa tu nombre: \")\npuntos_nivel_1 = input(\"¿Cuántos puntos hiciste en el nivel 1?: \")\n\npuntos_totales = puntos_nivel_1 * 3\n\nprint(\"Jugador:\", nombre)\nprint(\"Tus puntos triplicados son:\", puntos_totales)",
    options: [
      "puntos_totales = str(puntos_nivel_1) * 3",
      "puntos_totales = int(puntos_nivel_1) * 3",
      "puntos_totales = print(puntos_nivel_1 * 3)",
      "puntos_totales = input(puntos_nivel_1 * 3)"
    ],
    correctAnswer: 1,
    explanation: "Para realizar una multiplicación matemática, se debe convertir la entrada de texto a número entero utilizando la función int().",
    points: 0.5
  },
  {
    id: 'tp_a_m1_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: 'Si el jugador ingresa 15, ¿qué resultado produce el código original en puntos_totales?',
    codeSnippet: "nombre = input(\"Ingresa tu nombre: \")\npuntos_nivel_1 = input(\"¿Cuántos puntos hiciste en el nivel 1?: \")\n\npuntos_totales = puntos_nivel_1 * 3\n\nprint(\"Jugador:\", nombre)\nprint(\"Tus puntos triplicados son:\", puntos_totales)",
    options: [
      "45",
      "151515",
      "18",
      "Se produce necesariamente un error porque no se puede multiplicar un texto."
    ],
    correctAnswer: 1,
    explanation: "Al ser puntos_nivel_1 una cadena (\"15\"), la operación \"15\" * 3 repite el texto tres veces, produciendo \"151515\".",
    points: 0.5
  },
  {
    id: 'tp_a_m2_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: 'Si las notas ingresadas son 6, 8 y 9, ¿qué resultado obtiene el código original?',
    codeSnippet: "estudiante = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "Aproximadamente 7.67",
      "17.0",
      "14.0",
      "23.0"
    ],
    correctAnswer: 1,
    explanation: "Por precedencia de operadores, la división nota3 / 3 se resuelve primero (9 / 3 = 3.0). Luego se suman: 6 + 8 + 3.0 = 17.0.",
    points: 0.5
  },
  {
    id: 'tp_a_m2_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: '¿Cómo se corrige la línea del promedio para que calcule la media aritmética correctamente?',
    codeSnippet: "estudiante = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "promedio = nota1 + nota2 + nota3 / 3",
      "promedio = (nota1 + nota2 + nota3) / 3",
      "promedio = (nota1 + nota2) / nota3",
      "promedio = nota1 * nota2 * nota3"
    ],
    correctAnswer: 1,
    explanation: "Los paréntesis tienen la mayor precedencia en Python y obligan a sumar las tres notas antes de dividir el total por 3.",
    points: 0.5
  },
  {
    id: 'tp_a_m2_q3',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Decimales y int()',
    question: 'Si un alumno ingresa la nota 7.5, ¿qué sucede al intentar convertirla directamente con int()?',
    codeSnippet: "estudiante = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "Python conserva automáticamente el valor 7.5.",
      "Se produce un error al intentar convertir directamente el texto \"7.5\" a entero.",
      "Python convierte el valor a 75.",
      "Python lo redondea automáticamente a 8."
    ],
    correctAnswer: 1,
    explanation: "int(\"7.5\") produce un ValueError porque la función int() sobre un texto con punto decimal no puede convertirlo directamente a entero.",
    points: 0.5
  },
  {
    id: 'tp_a_m2_q4',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Uso de float()',
    question: '¿Qué función conviene utilizar para aceptar notas que contengan decimales?',
    codeSnippet: "estudiante = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "str()",
      "print()",
      "float()",
      "input() por sí sola convierte el texto a decimal."
    ],
    correctAnswer: 2,
    explanation: "La función float() convierte cadenas de texto con decimales (como \"7.5\") a números de coma flotante válidos.",
    points: 0.5
  },
  {
    id: 'tp_a_m3_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: 'Si los precios ingresados son 100 y 50, ¿qué muestra el código original?',
    codeSnippet: "producto1 = input(\"Precio del primer producto: \")\nproducto2 = input(\"Precio del segundo producto: \")\n\ntotal = producto1 + producto2\n\nprint(\"Total a pagar:\", total)",
    options: [
      "150",
      "10050",
      "100 + 50",
      "Un error obligatorio."
    ],
    correctAnswer: 1,
    explanation: "Como input() devuelve texto, producto1 (\"100\") y producto2 (\"50\") se concatenan con el signo +, formando \"10050\".",
    points: 0.5
  },
  {
    id: 'tp_a_m3_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: '¿Qué cambio permite sumar los precios como números enteros?',
    codeSnippet: "producto1 = input(\"Precio del primer producto: \")\nproducto2 = input(\"Precio del segundo producto: \")\n\ntotal = producto1 + producto2\n\nprint(\"Total a pagar:\", total)",
    options: [
      "total = str(producto1) + str(producto2)",
      "total = int(producto1) + int(producto2)",
      "total = input(producto1) + input(producto2)",
      "total = print(producto1 + producto2)"
    ],
    correctAnswer: 1,
    explanation: "Convertir ambas variables con int() permite que el operador + actúe como suma matemática en lugar de concatenar texto.",
    points: 0.5
  },
  {
    id: 'tp_a_m3_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Precios con decimales',
    question: 'Si los productos tienen precios con decimales (por ejemplo 12.50 y 5.25), ¿qué función de conversión se debe utilizar para sumarlos correctamente?',
    codeSnippet: "producto1 = input(\"Precio del primer producto: \")\nproducto2 = input(\"Precio del segundo producto: \")\n\ntotal = producto1 + producto2\n\nprint(\"Total a pagar:\", total)",
    options: [
      "str()",
      "float()",
      "print()",
      "input()"
    ],
    correctAnswer: 1,
    explanation: "Para operar con valores monetarios que incluyen centavos o números con punto decimal, se debe utilizar float() para convertirlos.",
    points: 0.5
  },
  {
    id: 'tp_a_m4_q1',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: '¿Qué sucede si el estudiante ingresa una nota igual a 6, cuando se aprueba con 6 o más?',
    codeSnippet: "nota = int(input(\"Ingresá tu nota: \"))\n\nif nota > 6:\n    print(\"Aprobaste\")\nelse:\n    print(\"No aprobaste\")",
    options: [
      "Muestra \"Aprobaste\".",
      "Muestra \"No aprobaste\", aunque debería aprobar.",
      "No muestra ningún mensaje.",
      "Python produce un error de sintaxis."
    ],
    correctAnswer: 1,
    explanation: "La condición nota > 6 solo es verdadera para notas estrictamente mayores a 6. Para 6 es falsa y ejecuta else (\"No aprobaste\").",
    points: 0.5
  },
  {
    id: 'tp_a_m4_q2',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: '¿Cómo se corrige la condición para incluir la nota 6 como aprobada?',
    codeSnippet: "nota = int(input(\"Ingresá tu nota: \"))\n\nif nota > 6:\n    print(\"Aprobaste\")\nelse:\n    print(\"No aprobaste\")",
    options: [
      "if nota = 6:",
      "if nota <= 6:",
      "if nota >= 6:",
      "if nota == 0:"
    ],
    correctAnswer: 2,
    explanation: "El operador >= significa \"mayor o igual que\", por lo que nota >= 6 incluye la nota 6 además de las mayores.",
    points: 0.5
  },
  {
    id: 'tp_a_m5_q1',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Cuál es el error del programa?',
    codeSnippet: "numero = int(input(\"Ingresá un número: \"))\n\ndoble = numero * 2\n\nprint(\"El doble es:\", dobles)",
    options: [
      "input() no puede utilizarse con números.",
      "Se calcula la variable doble, pero se intenta mostrar dobles, que no fue definida.",
      "El operador * no sirve para multiplicar.",
      "Falta convertir numero a texto antes de multiplicar."
    ],
    correctAnswer: 1,
    explanation: "Se calculó la variable doble, pero en print() se escribió dobles con s final, generando NameError porque no existe.",
    points: 0.5
  },
  {
    id: 'tp_a_m5_q2',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Qué línea permite corregir el error?',
    codeSnippet: "numero = int(input(\"Ingresá un número: \"))\n\ndoble = numero * 2\n\nprint(\"El doble es:\", dobles)",
    options: [
      "print(\"El doble es:\", doble)",
      "print(\"El doble es:\", numero)",
      "doble = input(numero)",
      "print(\"El doble es:\", doble * doble)"
    ],
    correctAnswer: 0,
    explanation: "El nombre en print debe coincidir con la variable calculada: doble.",
    points: 0.5
  },
  {
    id: 'tp_a_m6_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué muestra el programa original al ejecutarse?',
    codeSnippet: "lapices = 17\npor_grupo = 5\n\ngrupos = lapices / por_grupo\n\nprint(\"Grupos completos:\", grupos)",
    options: [
      "3",
      "3.4",
      "4",
      "2"
    ],
    correctAnswer: 1,
    explanation: "La división simple / produce un número decimal (float): 17 / 5 = 3.4.",
    points: 0.5
  },
  {
    id: 'tp_a_m6_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué operador permite obtener únicamente la cantidad de grupos completos (cociente entero)?',
    codeSnippet: "lapices = 17\npor_grupo = 5\n\ngrupos = lapices / por_grupo\n\nprint(\"Grupos completos:\", grupos)",
    options: [
      "%",
      "*",
      "//",
      "+"
    ],
    correctAnswer: 2,
    explanation: "El operador // calcula la división entera, devolviendo solo los grupos completos (17 // 5 = 3).",
    points: 0.5
  },
  {
    id: 'tp_a_m7_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Qué error tiene el cálculo del descuento del 10 %?',
    codeSnippet: "precio = float(input(\"Precio del producto: \"))\n\ndescuento = precio * 10\n\nprint(\"Descuento aplicado:\", descuento)",
    options: [
      "Multiplica el precio por 10 en lugar de calcular el 10 %.",
      "float() no acepta precios.",
      "print() no puede mostrar decimales.",
      "El descuento debe calcularse con input()."
    ],
    correctAnswer: 0,
    explanation: "Multiplica por 10 decuplicando el valor en vez de calcular el 10 %. El 10 % se representa matemáticamente como 0.10.",
    points: 0.5
  },
  {
    id: 'tp_a_m7_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Qué fórmula calcula correctamente el importe del descuento del 10 %?',
    codeSnippet: "precio = float(input(\"Precio del producto: \"))\n\ndescuento = precio * 10\n\nprint(\"Descuento aplicado:\", descuento)",
    options: [
      "descuento = precio + 0.10",
      "descuento = precio * 0.10",
      "descuento = precio * 10",
      "descuento = precio / 10 * 100"
    ],
    correctAnswer: 1,
    explanation: "Multiplicar por 0.10 calcula el 10 % de descuento del producto.",
    points: 0.5
  },
  {
    id: 'tp_a_m7_q3',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Descuento vs Precio final',
    question: 'En el cálculo comercial de un descuento, ¿qué diferencia existe entre la variable descuento y el precio final a abonar?',
    codeSnippet: "precio = float(input(\"Precio del producto: \"))\n\ndescuento = precio * 0.10\n\nprint(\"Descuento aplicado:\", descuento)",
    options: [
      "La variable descuento contiene solo el monto que se descuenta; el precio final se calcula restando precio - descuento.",
      "La variable descuento ya es el precio total final que debe pagar el cliente.",
      "No existe ninguna diferencia; ambas variables representan el mismo número.",
      "descuento almacena el precio con un recargo del 10 %."
    ],
    correctAnswer: 0,
    explanation: "La variable descuento almacena el monto de la rebaja. Para obtener lo que debe pagar el cliente, se debe restar: precio - descuento.",
    points: 0.5
  }
];

// 4. Expresiones Matemáticas y Lógicas (4 preguntas)
const MODEL_A_MATH_LOGIC: ExamUnifiedQuestion[] = [
  {
    id: 'tp_a_log_01',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Comparaciones y and',
    question: '¿Cuál es el resultado final de evaluar la siguiente expresión?',
    codeSnippet: '(25 + 5 == 30) and (14 - 4 > 12)',
    options: [
      'True',
      'False',
      '30',
      '12'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: (25 + 5 == 30) es (30 == 30) -> True. Paso 2: (14 - 4 > 12) es (10 > 12) -> False. Paso 3: True and False da False.',
    points: 0.5
  },
  {
    id: 'tp_a_log_02',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: División entera y or',
    question: '¿Qué valor booleano produce la siguiente expresión combinada?',
    codeSnippet: '(18 // 4 == 4) or (5 * 2 > 15)',
    options: [
      'False',
      'True',
      '4',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 18 // 4 es 4, y 4 == 4 es True. Paso 2: 5 * 2 es 10, y 10 > 15 es False. Paso 3: True or False da True porque con or basta que uno sea verdadero.',
    points: 0.5
  },
  {
    id: 'tp_a_log_03',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Operador not',
    question: '¿Qué resultado final produce esta expresión con negación not?',
    codeSnippet: 'not (10 + 2 * 3 == 16)',
    options: [
      'True',
      'False',
      '16',
      'None'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: dentro del paréntesis, la multiplicación tiene prioridad: 2 * 3 = 6. Paso 2: 10 + 6 = 16. Paso 3: 16 == 16 es True. Paso 4: not True invierte el valor a False.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_a_log_04',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Módulo y comparación',
    question: '¿Cuál es el resultado de evaluar esta expresión paso a paso?',
    codeSnippet: '(30 % 2 == 0) and (15 >= 10 + 5)',
    options: [
      'False',
      'True',
      '0',
      '15'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 30 % 2 es 0 (30 es par), por lo que 0 == 0 es True. Paso 2: 10 + 5 es 15, y 15 >= 15 es True. Paso 3: True and True da True.',
    points: 0.5
  }
];

// 5. Ejercicios Prácticos de Programación (4 ejercicios obligatorios)
const MODEL_A_PRACTICAL: ExamUnifiedQuestion[] = [
  {
    id: 'tp_a_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Doble de un número',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que pida un número al usuario con input(), calcule su doble (D = n * 2) y muestre el resultado en pantalla con print().',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Pedí un número con input(), convertilo con int() o float(), calculá el doble y mostralo con print()\n\nnumero = int(input("Ingresá un número: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Número 7',
        inputs: ['7'],
        expectedOutputPattern: '(?:^|\\D)14(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 7 → Doble esperado: 14'
      },
      {
        name: 'Número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → Doble esperado: 0'
      },
      {
        name: 'Número negativo -3',
        inputs: ['-3'],
        expectedOutputPattern: '(?:^|[^0-9-])-6(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -3 → Doble esperado: -6'
      },
      {
        name: 'Número 12',
        inputs: ['12'],
        expectedOutputPattern: '(?:^|\\D)24(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 12 → Doble esperado: 24'
      }
    ]
  },
  {
    id: 'tp_a_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Área de un triángulo',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Pedí la base y la altura de un triángulo mediante input(), calculá su área aplicando la fórmula A = (b * h) / 2 y mostrá el resultado con print().',
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
  {
    id: 'tp_a_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Perímetro de un cuadrado',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Pedí la longitud del lado de un cuadrado mediante input(), calculá su perímetro aplicando la fórmula P = 4 * lado y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la longitud del lado, calculá 4 * lado y mostrá el resultado con print()\n\nlado = float(input("Ingresá el lado del cuadrado: "))\n',
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
  {
    id: 'tp_a_pr_04',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Área de un rectángulo',
    title: 'Ejercicio 4: Área de un rectángulo',
    question: 'Solicitá la base y la altura de un rectángulo mediante input(), calculá su área aplicando la fórmula A = base * altura y mostrá el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Área de un rectángulo\n# Pedí base y altura con input(), calculá base * altura y mostralo con print()\n\nbase = float(input("Ingresá la base: "))\naltura = float(input("Ingresá la altura: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 7, Altura 4',
        inputs: ['7', '4'],
        expectedOutputPattern: '(?:^|\\D)28(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 7, Altura: 4 → Área esperada: 28'
      },
      {
        name: 'Base 10, Altura 5',
        inputs: ['10', '5'],
        expectedOutputPattern: '(?:^|\\D)50(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 5 → Área esperada: 50'
      },
      {
        name: 'Base 12, Altura 3',
        inputs: ['12', '3'],
        expectedOutputPattern: '(?:^|\\D)36(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 12, Altura: 3 → Área esperada: 36'
      }
    ]
  },
  {
    id: 'tp_a_pr_05',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Suma de dos enteros',
    title: 'Ejercicio 5: Suma de dos números enteros',
    question: 'Pedí dos números enteros al usuario mediante dos llamadas consecutivas a input(), convertilos con int(), calculá su suma y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 5: Suma de dos números enteros\n# Leé dos enteros con input(), sumalos y mostrá el resultado con print()\n\nnum1 = int(input("Primer número: "))\nnum2 = int(input("Segundo número: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Suma 10 + 25',
        inputs: ['10', '25'],
        expectedOutputPattern: '(?:^|\\D)35(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 10 y 25 → Suma esperada: 35'
      },
      {
        name: 'Suma 7 + 3',
        inputs: ['7', '3'],
        expectedOutputPattern: '(?:^|\\D)10(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 7 y 3 → Suma esperada: 10'
      },
      {
        name: 'Suma 100 + 250',
        inputs: ['100', '250'],
        expectedOutputPattern: '(?:^|\\D)350(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 100 y 250 → Suma esperada: 350'
      },
      {
        name: 'Suma con cero 0 + 42',
        inputs: ['0', '42'],
        expectedOutputPattern: '(?:^|\\D)42(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 0 y 42 → Suma esperada: 42'
      }
    ]
  },
  {
    id: 'tp_a_pr_06',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Superficie de un cuadrado con potencia',
    title: 'Ejercicio 6: Superficie de un cuadrado',
    question: 'Pedí la longitud del lado de un cuadrado mediante input(), calculá su superficie (área) elevando el lado al cuadrado utilizando el operador de potencia (** 2) y mostrá el resultado con print().',
    starterCode: '# Ejercicio 6: Superficie de un cuadrado\n# Leé el lado con float(input()), calculá lado ** 2 y mostrá el resultado\n\nlado = float(input("Lado del cuadrado: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Lado 5',
        inputs: ['5'],
        expectedOutputPattern: '(?:^|\\D)25(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 5 → Área esperada: 25'
      },
      {
        name: 'Lado 8',
        inputs: ['8'],
        expectedOutputPattern: '(?:^|\\D)64(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 8 → Área esperada: 64'
      },
      {
        name: 'Lado 10',
        inputs: ['10'],
        expectedOutputPattern: '(?:^|\\D)100(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 10 → Área esperada: 100'
      },
      {
        name: 'Lado 3',
        inputs: ['3'],
        expectedOutputPattern: '(?:^|\\D)9(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 3 → Área esperada: 9'
      }
    ]
  },
  {
    id: 'tp_a_pr_07',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Corregir programa de resta',
    title: 'Ejercicio 7: Corrección de resta de enteros',
    question: 'El siguiente código intenta restar dos números ingresados por el usuario, pero produce un error porque no los convierte a números. Modificá el programa para que convierta ambas entradas con int() y muestre la resta (primer número menos segundo número) con print().',
    starterCode: '# Ejercicio 7: Corregí el código para restar numéricamente dos enteros\na = input()\nb = input()\n# Corregí las líneas para convertir a int antes de restar:\nresultado = int(a) - int(b)\nprint(resultado)\n',
    points: 0.75,
    testCases: [
      {
        name: 'Resta 50 - 20',
        inputs: ['50', '20'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 50 y 20 → Resta esperada: 30'
      },
      {
        name: 'Resta 100 - 45',
        inputs: ['100', '45'],
        expectedOutputPattern: '(?:^|\\D)55(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 100 y 45 → Resta esperada: 55'
      },
      {
        name: 'Resta 15 - 5',
        inputs: ['15', '5'],
        expectedOutputPattern: '(?:^|\\D)10(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 15 y 5 → Resta esperada: 10'
      },
      {
        name: 'Resta 80 - 30',
        inputs: ['80', '30'],
        expectedOutputPattern: '(?:^|\\D)50(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 80 y 30 → Resta esperada: 50'
      }
    ]
  },
  {
    id: 'tp_a_pr_08',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Promedio de tres notas',
    title: 'Ejercicio 8: Promedio de tres calificaciones',
    question: 'Pedí tres calificaciones numéricas al usuario mediante input(), calculá su promedio sumándolas y dividiendo el total por 3: (nota1 + nota2 + nota3) / 3, y mostrá el promedio obtenido en pantalla con print().',
    starterCode: '# Ejercicio 8: Promedio de tres calificaciones\n# Leé tres notas con float(input()), calculá (n1 + n2 + n3) / 3 y mostrá el promedio\n\nn1 = float(input("Nota 1: "))\nn2 = float(input("Nota 2: "))\nn3 = float(input("Nota 3: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Notas 8, 9, 7',
        inputs: ['8', '9', '7'],
        expectedOutputPattern: '(?:^|\\D)8(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 8, 9, 7 → Promedio esperado: 8'
      },
      {
        name: 'Notas 10, 6, 8',
        inputs: ['10', '6', '8'],
        expectedOutputPattern: '(?:^|\\D)8(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 10, 6, 8 → Promedio esperado: 8'
      },
      {
        name: 'Notas 7, 7, 7',
        inputs: ['7', '7', '7'],
        expectedOutputPattern: '(?:^|\\D)7(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 7, 7, 7 → Promedio esperado: 7'
      },
      {
        name: 'Notas 4, 6, 5',
        inputs: ['4', '6', '5'],
        expectedOutputPattern: '(?:^|\\D)5(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 4, 6, 5 → Promedio esperado: 5'
      }
    ]
  }
];

// ============================================================================
// --- MODELO B ---
// ============================================================================

// 1. Conceptos Teóricos (12 preguntas)
const MODEL_B_THEORY: ExamUnifiedQuestion[] = [
  {
    id: 'tp_b_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Concepto Teórico: Lenguaje interpretado',
    question: '¿Por qué se dice que Python es un lenguaje de programación interpretado?',
    options: [
      'Porque necesita un procesador especial que solo lee texto en inglés.',
      'Porque sus instrucciones son leídas y ejecutadas línea por línea por el intérprete sin compilar previamente todo el programa a binario.',
      'Porque solo traduce voz a comandos de texto.',
      'Porque los errores únicamente se detectan cuando la computadora se reinicia.'
    ],
    correctAnswer: 1,
    explanation: 'En Python, el intérprete lee el código fuente instrucción por instrucción y las ejecuta en tiempo real.',
    points: 0.5
  },
  {
    id: 'tp_b_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Concepto Teórico: Tipo booleano',
    question: '¿Cuál de las siguientes variables almacena un dato de tipo booleano (bool) en Python?',
    options: [
      'aprobado = "True"',
      'aprobado = True',
      'aprobado = 1.0',
      'aprobado = "verdadero"'
    ],
    correctAnswer: 1,
    explanation: 'Los valores booleanos en Python son True y False (con mayúscula inicial y sin comillas). Si se escriben entre comillas ("True"), pasan a ser texto (str).',
    points: 0.5
  },
  {
    id: 'tp_b_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Asignación de variables',
    question: 'En la instrucción temperatura = 18.5, ¿cuál es el significado del operador =?',
    options: [
      'Pregunta si la variable temperatura ya contiene el valor 18.5.',
      'Calcula una división entre temperatura y 18.5.',
      'Guarda el valor decimal 18.5 dentro de la variable temperatura.',
      'Elimina la variable de la memoria.'
    ],
    correctAnswer: 2,
    explanation: 'El operador = asigna el valor de la derecha (18.5) a la variable situada a la izquierda (temperatura).',
    points: 0.5
  },
  {
    id: 'tp_b_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Nombres inválidos',
    question: '¿Por qué el identificador 1er_examen es un nombre de variable INVÁLIDO en Python?',
    options: [
      'Porque contiene un guion bajo.',
      'Porque en Python los nombres de variables no pueden comenzar con un número o dígito.',
      'Porque tiene más de cinco letras.',
      'Porque la palabra examen es una función reservada.'
    ],
    correctAnswer: 1,
    explanation: 'Una regla fundamental de Python es que los nombres de variables deben comenzar con una letra o un guion bajo, nunca con un dígito numérico.',
    points: 0.5
  },
  {
    id: 'tp_b_th_05',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Concepto Teórico: Función type()',
    question: '¿Qué resultado devuelve la función type("42") al ejecutarse en Python?',
    options: [
      '<class \'int\'>',
      '<class \'str\'>',
      '<class \'float\'>',
      '<class \'bool\'>'
    ],
    correctAnswer: 1,
    explanation: 'Aunque contiene números, "42" está encerrado entre comillas, lo que lo convierte en una cadena de texto (str).',
    points: 0.5
  },
  {
    id: 'tp_b_th_06',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Concepto Teórico: Salto de línea',
    question: '¿Qué caracter especial permite imprimir texto en dos renglones distintos dentro de una misma función print()?',
    options: [
      '\\t',
      '\\n',
      '//',
      '**'
    ],
    correctAnswer: 1,
    explanation: '\\n es la secuencia de escape para salto de línea (newline) en Python.',
    points: 0.5
  },
  {
    id: 'tp_b_th_07',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Entrada de datos',
    question: 'Si ejecutamos respuesta = input("Escribí algo: ") y el usuario ingresa el número 100, ¿qué tipo de dato tiene respuesta?',
    options: [
      'int',
      'str',
      'float',
      'bool'
    ],
    correctAnswer: 1,
    explanation: 'input() siempre entrega el contenido capturado como cadena de texto (str), independientemente de lo que haya escrito el usuario.',
    points: 0.5
  },
  {
    id: 'tp_b_th_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Conversión float()',
    question: '¿Qué función debemos utilizar para convertir la entrada del usuario en un número con decimales (por ejemplo, una altura como 1.75)?',
    options: [
      'int()',
      'float()',
      'str()',
      'round()'
    ],
    correctAnswer: 1,
    explanation: 'float() es la función encargada de convertir un texto o entero a número de coma flotante (con decimales).',
    points: 0.5
  },
  // Complementarias (parejas):
  {
    id: 'tp_b_th_09',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Concepto Teórico: Operador Desigualdad !=',
    question: '¿Qué operador se utiliza en Python para preguntar si dos valores son DISTINTOS o DIFERENTES?',
    options: [
      '<>',
      '!=',
      '==!',
      'diff'
    ],
    correctAnswer: 1,
    explanation: 'El operador != significa "distinto de" o "diferente de" en Python, devolviendo True si los valores no son iguales.',
    points: 0.5
  },
  {
    id: 'tp_b_th_10',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: Potenciación **',
    question: '¿Cuál es el operador aritmético que utiliza Python para calcular potencias (por ejemplo, 2 elevado al cubo)?',
    options: [
      '^',
      '**',
      'pow',
      '//'
    ],
    correctAnswer: 1,
    explanation: 'En Python se utiliza el doble asterisco ** para la potenciación: 2 ** 3 calcula 2 al cubo (8).',
    points: 0.5
  },
  {
    id: 'tp_b_th_11',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: Uso de paréntesis',
    question: '¿Para qué se utilizan los paréntesis () en una expresión matemática en Python?',
    options: [
      'Para convertir los números en cadenas de texto.',
      'Para alterar la precedencia y obligar a calcular primero esa operación antes que las demás.',
      'Para indicar que el resultado debe ser un número entero.',
      'Para repetir la operación dos veces seguidas.'
    ],
    correctAnswer: 1,
    explanation: 'Los paréntesis tienen la máxima prioridad de evaluación en Python, permitiendo forzar el orden en que se resuelven las operaciones.',
    points: 0.5
  },
  {
    id: 'tp_b_th_12',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Concepto Teórico: Operador Lógico or',
    question: '¿Cuándo devuelve True una expresión que utiliza el operador or (condicion_1 or condicion_2)?',
    options: [
      'Únicamente si ambas condiciones son verdaderas.',
      'Con que al menos UNA de las dos condiciones sea verdadera (True).',
      'Solo cuando ambas condiciones son falsas.',
      'Nunca puede devolver True.'
    ],
    correctAnswer: 1,
    explanation: 'El operador or es flexible: da True si la primera condición es True, si la segunda es True, o si ambas son True. Solo da False si ambas son False.',
    points: 0.5
  }
];

// 2. Interpretación de Código («¿Qué muestra / hace este código?») (6 preguntas)
const MODEL_B_INTERPRETATION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_b_int_01',
    type: 'tracing',
    moduleId: 4,
    topic: 'Interpretación de Código: Suma de variables',
    question: '¿Qué muestra en pantalla este programa al ejecutarse?',
    codeSnippet: 'a = 5\nb = 10\na = a + b\nprint(a)',
    options: [
      '5',
      '15',
      '10',
      'a + b'
    ],
    correctAnswer: 1,
    explanation: 'a comienza en 5 y b vale 10. En a = a + b se calcula 5 + 10 = 15 y se guarda en a. Se muestra 15.',
    points: 0.5
  },
  {
    id: 'tp_b_int_02',
    type: 'tracing',
    moduleId: 9,
    topic: 'Interpretación de Código: Texto y variable',
    question: '¿Qué salida genera este código en la consola?',
    codeSnippet: 'animal = "Gato"\nprint("Mi mascota es", animal)',
    options: [
      'Mi mascota es animal',
      'Mi mascota es Gato',
      '"Mi mascota es Gato"',
      'Mi mascota esGato'
    ],
    correctAnswer: 1,
    explanation: 'print() muestra el texto literal "Mi mascota es", agrega un espacio automático por la coma y muestra el valor de la variable animal ("Gato").',
    points: 0.5
  },
  {
    id: 'tp_b_int_03',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: Multiplicación',
    question: '¿Qué imprime este programa al ejecutarse?',
    codeSnippet: 'lado = 6\nperimetro = lado * 4\nprint(perimetro)',
    options: [
      '24',
      'lado * 4',
      '20',
      '64'
    ],
    correctAnswer: 0,
    explanation: 'perimetro almacena 6 * 4 = 24. Luego se imprime ese valor numérico en la consola.',
    points: 0.5
  },
  {
    id: 'tp_b_int_04',
    type: 'tracing',
    moduleId: 10,
    topic: 'Interpretación de Código: Conversión y multiplicación',
    question: '¿Qué resultado produce la ejecución del siguiente código?',
    codeSnippet: 'val = "20"\ntotal = int(val) * 2\nprint(total)',
    options: [
      '2020',
      '40',
      '20',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'int("20") convierte el texto a número entero 20. Luego, 20 * 2 = 40.',
    points: 0.5
  },
  // Complementarias (parejas):
  {
    id: 'tp_b_int_05',
    type: 'tracing',
    moduleId: 7,
    topic: 'Interpretación de Código: Comparación de igualdad',
    question: '¿Qué imprime en pantalla la siguiente instrucción?',
    codeSnippet: 'clave = "1234"\nprint(clave == "1234")',
    options: [
      'clave == "1234"',
      'True',
      'False',
      '1234'
    ],
    correctAnswer: 1,
    explanation: 'El operador == compara si la variable clave ("1234") es idéntica al texto "1234". Al coincidir exactamente, imprime True.',
    points: 0.5
  },
  {
    id: 'tp_b_int_06',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: División entera',
    question: '¿Qué valor imprime la siguiente operación de división entera?',
    codeSnippet: 'total = 21\nporciones = total // 5\nprint(porciones)',
    options: [
      '4.2',
      '4',
      '5',
      '1'
    ],
    correctAnswer: 1,
    explanation: '21 // 5 calcula cuántas veces cabe 5 en 21 de forma entera: cabe 4 veces (4 * 5 = 20) y descarta el resto.',
    points: 0.5
  },
  {
    id: 'tp_b_int_07',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: División entera y resto',
    question: '¿Qué muestra este código al ejecutarse para descomponer segundos?',
    codeSnippet: 'segundos = 125\nminutos = segundos // 60\nresto = segundos % 60\nprint(minutos, "min y", resto, "seg")',
    options: [
      '2 min y 5 seg',
      '2.08 min y 0 seg',
      '1 min y 65 seg',
      '2 min y 25 seg'
    ],
    correctAnswer: 0,
    explanation: '125 // 60 da 2 (minutos enteros). 125 % 60 da 5 (segundos restantes). Se imprime "2 min y 5 seg".',
    points: 0.5
  },
  {
    id: 'tp_b_int_08',
    type: 'tracing',
    moduleId: 8,
    topic: 'Interpretación de Código: Precedencia lógica',
    question: '¿Qué valor imprime la siguiente combinación de operadores lógicos?',
    codeSnippet: 'a = True\nb = False\nc = True\nresultado = a or (b and not c)\nprint(resultado)',
    options: [
      'True',
      'False',
      'None',
      'Error de sintaxis'
    ],
    correctAnswer: 0,
    explanation: 'not c es False. b and False es False. Finalmente True or False resulta True.',
    points: 0.5
  }
];

// 3. Detección de Errores («¿Qué problema tiene este código?») (4 preguntas)
const MODEL_B_ERROR_DETECTION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_b_err_01',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto sin convertir',
    question: 'Si un alumno ejecuta este programa e ingresa 5, ¿qué sucede y por qué?',
    codeSnippet: 'num = input("Número: ")\nprint(num * 2)',
    options: [
      'Muestra 10 porque Python multiplica el número ingresado.',
      'Muestra "55" porque num es de tipo texto (str) y multiplicar un texto por 2 lo repite dos veces en lugar de multiplicar matemáticamente.',
      'El programa se detiene con un error en input().',
      'Muestra 25 porque calcula el cuadrado.'
    ],
    correctAnswer: 1,
    explanation: 'Al no usar int(), num guarda el texto "5". En Python, "5" * 2 repite la cadena ("55"). Para obtener 10 se debe convertir con int(num).',
    points: 0.5
  },
  {
    id: 'tp_b_err_02',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Uso antes de asignación',
    question: '¿Qué problema presenta este código al ejecutarse?',
    codeSnippet: 'print(resultado)\nresultado = 10 + 20',
    options: [
      'Muestra 30 sin inconvenientes.',
      'Ocurre un error NameError porque se intenta imprimir resultado en la primera línea antes de haberle dado un valor.',
      'Muestra None.',
      'Las sumas solo pueden hacerse en la función print().'
    ],
    correctAnswer: 1,
    explanation: 'El intérprete ejecuta de arriba hacia abajo. En la línea 1 la variable resultado aún no fue creada en memoria.',
    points: 0.5
  },
  {
    id: 'tp_b_err_03',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Código sin errores',
    question: '¿Qué error contiene este programa de cálculo?',
    codeSnippet: 'radio = 5\ndiametro = radio * 2\nprint("Diámetro:", diametro)',
    options: [
      'No se puede multiplicar una variable por 2.',
      'La función print() tiene un error de sintaxis en la coma.',
      'No contiene ningún error: calcula el diámetro (10) y lo muestra correctamente.',
      'radio debe declararse obligatoriamente con comillas.'
    ],
    correctAnswer: 2,
    explanation: 'El código es totalmente correcto y no tiene fallas de sintaxis ni de ejecución.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_b_err_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Comparar en vez de asignar',
    question: '¿Qué problema conceptual tiene el siguiente código si queríamos cambiar el valor de puntos a 20?',
    codeSnippet: 'puntos = 10\npuntos == 20\nprint(puntos)',
    options: [
      'En la segunda línea se utilizó == (comparación) en vez de = (asignación), por lo que puntos sigue valiendo 10.',
      'El programa se detiene con un SyntaxError.',
      'print() no puede mostrar la variable puntos.',
      'puntos se convierte en 30.'
    ],
    correctAnswer: 0,
    explanation: '== evalúa si puntos es igual a 20 (lo cual da False), pero no modifica el valor de la variable. Para modificarlo se debe usar puntos = 20.',
    points: 0.5
  },
  {
    id: 'tp_b_err_05',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Guión medio en variable',
    question: '¿Qué error ocurre en este programa?',
    codeSnippet: 'costo-envio = 300\nprint(costo-envio)',
    options: [
      'Ocurre un SyntaxError porque el guión medio (-) es el operador de resta en Python, no un caracter válido para nombres de variables.',
      'El programa muestra 300 sin inconvenientes.',
      'El error ocurre en print() por no usar comillas.',
      'El número 300 debió escribirse como texto.'
    ],
    correctAnswer: 0,
    explanation: 'Python interpreta costo-envio como la resta costo menos envio. Para nombres compuestos se debe usar guión bajo: costo_envio.',
    points: 0.5
  },
  {
    id: 'tp_b_err_06',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División por cero',
    question: '¿Qué tipo de error se genera al ejecutar la tercera línea de este código?',
    codeSnippet: 'dividendo = 50\ndivisor = 10 - 10\nresultado = dividendo / divisor\nprint(resultado)',
    options: [
      'ZeroDivisionError, porque la variable divisor vale 0 y matemáticamente no es posible dividir por cero.',
      'TypeError porque divisor es un texto.',
      'ValueError porque 50 es un número entero.',
      'El programa muestra 0 en pantalla sin errores.'
    ],
    correctAnswer: 0,
    explanation: '10 - 10 resulta en 0. Al intentar dividir 50 / 0, Python detiene la ejecución arrojando ZeroDivisionError: division by zero.',
    points: 0.5
  },
  // --- NUEVAS VARIANTES DE DETECCIÓN DE ERRORES Y ANÁLISIS (MODELOS 1 AL 7) ---
  {
    id: 'tp_b_m1_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Por qué en este programa se repite el texto en lugar de multiplicar las vidas numéricamente?',
    codeSnippet: "jugador = input(\"Nombre del jugador: \")\nvidas_iniciales = input(\"¿Cuántas vidas iniciales tenés?: \")\n\nvidas_totales = vidas_iniciales * 4\n\nprint(\"Jugador:\", jugador)\nprint(\"Tus vidas cuadruplicadas son:\", vidas_totales)",
    options: [
      "Porque input() siempre devuelve una cadena de texto (str), aunque se ingresen dígitos numéricos.",
      "Porque Python solo puede multiplicar por números impares.",
      "Porque la función print() concatena automáticamente todas las operaciones.",
      "Porque falta una variable auxiliar obligatoria."
    ],
    correctAnswer: 0,
    explanation: "input() devuelve siempre un dato tipo str. Al multiplicar una cadena por un entero, Python repite el texto en vez de calcular una multiplicación aritmética.",
    points: 0.5
  },
  {
    id: 'tp_b_m1_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Cómo se corrige la línea de cálculo para multiplicar las vidas como número?',
    codeSnippet: "jugador = input(\"Nombre del jugador: \")\nvidas_iniciales = input(\"¿Cuántas vidas iniciales tenés?: \")\n\nvidas_totales = vidas_iniciales * 4\n\nprint(\"Jugador:\", jugador)\nprint(\"Tus vidas cuadruplicadas son:\", vidas_totales)",
    options: [
      "vidas_totales = str(vidas_iniciales) * 4",
      "vidas_totales = int(vidas_iniciales) * 4",
      "vidas_totales = float(input(4))",
      "vidas_totales = print(vidas_iniciales * 4)"
    ],
    correctAnswer: 1,
    explanation: "Convertir la variable con int(vidas_iniciales) permite que el operador * realice una multiplicación aritmética por 4.",
    points: 0.5
  },
  {
    id: 'tp_b_m1_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: 'Si el jugador ingresa 20, ¿qué valor almacena vidas_totales en el código original sin corregir?',
    codeSnippet: "jugador = input(\"Nombre del jugador: \")\nvidas_iniciales = input(\"¿Cuántas vidas iniciales tenés?: \")\n\nvidas_totales = vidas_iniciales * 4\n\nprint(\"Jugador:\", jugador)\nprint(\"Tus vidas cuadruplicadas son:\", vidas_totales)",
    options: [
      "80",
      "20202020",
      "24",
      "Se interrumpe el programa con un error de sintaxis."
    ],
    correctAnswer: 1,
    explanation: "\"20\" * 4 repite la cadena de texto 4 veces dando como resultado \"20202020\".",
    points: 0.5
  },
  {
    id: 'tp_b_m2_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: 'Si las tres notas ingresadas son 7, 7 y 6, ¿qué resultado calcula el código original?',
    codeSnippet: "alumno = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Alumno:\", alumno)\nprint(\"Promedio obtenido:\", promedio)",
    options: [
      "Aproximadamente 6.67",
      "16.0",
      "14.0",
      "20.0"
    ],
    correctAnswer: 1,
    explanation: "Python ejecuta primero la división nota3 / 3 (6 / 3 = 2.0) y después suma 7 + 7 + 2.0 = 16.0.",
    points: 0.5
  },
  {
    id: 'tp_b_m2_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: '¿Qué modificación debe realizarse en la fórmula para obtener el promedio real?',
    codeSnippet: "alumno = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Alumno:\", alumno)\nprint(\"Promedio obtenido:\", promedio)",
    options: [
      "promedio = nota1 + nota2 + (nota3 / 3)",
      "promedio = (nota1 + nota2 + nota3) / 3",
      "promedio = nota1 + nota2 + nota3 // 3",
      "promedio = (nota1 + nota2) / (nota3 * 3)"
    ],
    correctAnswer: 1,
    explanation: "Encerrar la suma entre paréntesis (nota1 + nota2 + nota3) garantiza que se sumen todas las notas antes de dividir entre 3.",
    points: 0.5
  },
  {
    id: 'tp_b_m2_q3',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Decimales y int()',
    question: '¿Qué ocurre si el usuario ingresa "8.5" en nota1 = int(input("Nota 1: "))?',
    codeSnippet: "alumno = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Alumno:\", alumno)\nprint(\"Promedio obtenido:\", promedio)",
    options: [
      "Python guarda el valor 8 descartando el decimal.",
      "Ocurre un error ValueError porque int() no puede convertir un texto decimal directamente.",
      "Python redondea automáticamente a 9.",
      "El programa continúa normalmente convirtiéndolo a float."
    ],
    correctAnswer: 1,
    explanation: "int(\"8.5\") lanza ValueError porque no admite cadenas con punto flotante.",
    points: 0.5
  },
  {
    id: 'tp_b_m2_q4',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Uso de float()',
    question: '¿Cómo debe solicitarse la nota para permitir calificaciones con coma o punto decimal?',
    codeSnippet: "alumno = input(\"Nombre del alumno: \")\nnota1 = int(input(\"Nota 1: \"))\nnota2 = int(input(\"Nota 2: \"))\nnota3 = int(input(\"Nota 3: \"))\n\npromedio = nota1 + nota2 + nota3 / 3\n\nprint(\"Alumno:\", alumno)\nprint(\"Promedio obtenido:\", promedio)",
    options: [
      "nota1 = str(input(\"Nota 1: \"))",
      "nota1 = bool(input(\"Nota 1: \"))",
      "nota1 = float(input(\"Nota 1: \"))",
      "nota1 = round(input(\"Nota 1: \"))"
    ],
    correctAnswer: 2,
    explanation: "float(input(...)) convierte el texto ingresado en un número con decimales.",
    points: 0.5
  },
  {
    id: 'tp_b_m3_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: 'Si los precios ingresados son 200 y 80, ¿qué resultado imprime el programa?',
    codeSnippet: "articulo1 = input(\"Precio del artículo 1: \")\narticulo2 = input(\"Precio del artículo 2: \")\n\ntotal = articulo1 + articulo2\n\nprint(\"Total a abonar:\", total)",
    options: [
      "280",
      "20080",
      "200 + 80",
      "None"
    ],
    correctAnswer: 1,
    explanation: "Al no convertir las cadenas de input(), el operador + concatena los dos textos: \"200\" + \"80\" = \"20080\".",
    points: 0.5
  },
  {
    id: 'tp_b_m3_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: '¿Cómo se modifica el código para que realice la suma numérica de los importes?',
    codeSnippet: "articulo1 = input(\"Precio del artículo 1: \")\narticulo2 = input(\"Precio del artículo 2: \")\n\ntotal = articulo1 + articulo2\n\nprint(\"Total a abonar:\", total)",
    options: [
      "total = str(articulo1) + str(articulo2)",
      "total = int(articulo1) + int(articulo2)",
      "total = input(articulo1 + articulo2)",
      "total = print(articulo1, articulo2)"
    ],
    correctAnswer: 1,
    explanation: "Usar int() convierte ambas cadenas en números enteros permitiendo la suma aritmética.",
    points: 0.5
  },
  {
    id: 'tp_b_m3_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Precios con decimales',
    question: 'Si los artículos tienen centavos (por ejemplo 199.99 y 49.50), ¿qué función debe utilizarse para sumarlos?',
    codeSnippet: "articulo1 = input(\"Precio del artículo 1: \")\narticulo2 = input(\"Precio del artículo 2: \")\n\ntotal = articulo1 + articulo2\n\nprint(\"Total a abonar:\", total)",
    options: [
      "int()",
      "float()",
      "str()",
      "type()"
    ],
    correctAnswer: 1,
    explanation: "float() permite procesar valores numéricos con parte fraccionaria o decimal.",
    points: 0.5
  },
  {
    id: 'tp_b_m4_q1',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: 'Si un estudiante obtiene exactamente 70 puntos y la regla dice que con 70 o más se promueve, ¿qué muestra el código?',
    codeSnippet: "puntaje = int(input(\"Ingresá tu puntaje: \"))\n\nif puntaje > 70:\n    print(\"Promovido\")\nelse:\n    print(\"No promovido\")",
    options: [
      "Promovido",
      "No promovido, debido a que > 70 excluye al número 70.",
      "Da error en la línea del if.",
      "Muestra ambos mensajes."
    ],
    correctAnswer: 1,
    explanation: "> 70 solo incluye valores estrictamente mayores a 70. Para 70 es falso y entra al else.",
    points: 0.5
  },
  {
    id: 'tp_b_m4_q2',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: '¿Qué operador relacional debe usarse para incluir el 70 en la promoción?',
    codeSnippet: "puntaje = int(input(\"Ingresá tu puntaje: \"))\n\nif puntaje > 70:\n    print(\"Promovido\")\nelse:\n    print(\"No promovido\")",
    options: [
      "if puntaje = 70:",
      "if puntaje < 70:",
      "if puntaje >= 70:",
      "if puntaje == 0:"
    ],
    correctAnswer: 2,
    explanation: ">= significa \"mayor o igual que\", incluyendo el 70 como aprobado.",
    points: 0.5
  },
  {
    id: 'tp_b_m5_q1',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Qué problema de ejecución presenta este fragmento de código?',
    codeSnippet: "cantidad = int(input(\"Ingresá una cantidad: \"))\n\ntriple = cantidad * 3\n\nprint(\"El triple es:\", triples)",
    options: [
      "cantidad no puede multiplicarse por 3.",
      "Se definió la variable triple pero en print() se solicita triples, causando un NameError.",
      "El texto dentro de print() tiene demasiadas palabras.",
      "input() requiere obligatoriamente float."
    ],
    correctAnswer: 1,
    explanation: "Python no encuentra triples porque fue definida como triple.",
    points: 0.5
  },
  {
    id: 'tp_b_m5_q2',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Cuál es la corrección correspondiente para imprimir el resultado calculado?',
    codeSnippet: "cantidad = int(input(\"Ingresá una cantidad: \"))\n\ntriple = cantidad * 3\n\nprint(\"El triple es:\", triples)",
    options: [
      "print(\"El triple es:\", triple)",
      "print(\"El triple es:\", cantidad)",
      "triple = str(triples)",
      "print(\"El triple es:\", 3 * 3)"
    ],
    correctAnswer: 0,
    explanation: "Debe llamarse a la variable exacta: triple.",
    points: 0.5
  },
  {
    id: 'tp_b_m6_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué valor muestra en pantalla el programa original?',
    codeSnippet: "caramelos = 23\npor_bolsa = 4\n\nbolsas = caramelos / por_bolsa\n\nprint(\"Bolsas completas:\", bolsas)",
    options: [
      "5",
      "5.75",
      "6",
      "3"
    ],
    correctAnswer: 1,
    explanation: "23 / 4 produce un float: 5.75.",
    points: 0.5
  },
  {
    id: 'tp_b_m6_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué operador de Python calcula exactamente cuántas bolsas completas (5) se pueden armar?',
    codeSnippet: "caramelos = 23\npor_bolsa = 4\n\nbolsas = caramelos / por_bolsa\n\nprint(\"Bolsas completas:\", bolsas)",
    options: [
      "%",
      "*",
      "//",
      "**"
    ],
    correctAnswer: 2,
    explanation: "El operador de división entera // descarta los decimales y devuelve 5.",
    points: 0.5
  },
  {
    id: 'tp_b_m7_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Qué fallo lógico comete este programa si el objetivo es calcular un descuento del 15 %?',
    codeSnippet: "precio = float(input(\"Precio del producto: \"))\n\ndescuento = precio * 15\n\nprint(\"Descuento aplicado:\", descuento)",
    options: [
      "Multiplica por 15 en lugar de multiplicar por 0.15 (15 %).",
      "float() solo funciona con valores enteros.",
      "print() no puede concatenar texto con la variable descuento.",
      "Falta importar una librería de finanzas."
    ],
    correctAnswer: 0,
    explanation: "Multiplicar por 15 agranda el precio 15 veces. El 15 % es precio * 0.15.",
    points: 0.5
  },
  {
    id: 'tp_b_m7_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Cuál es la expresión correcta para calcular el monto del 15 % de descuento?',
    codeSnippet: "precio = float(input(\"Precio del producto: \"))\n\ndescuento = precio * 15\n\nprint(\"Descuento aplicado:\", descuento)",
    options: [
      "descuento = precio - 15",
      "descuento = precio * 0.15",
      "descuento = precio / 15",
      "descuento = precio + 0.15"
    ],
    correctAnswer: 1,
    explanation: "precio * 0.15 calcula el 15 % del valor original.",
    points: 0.5
  },
  {
    id: 'tp_b_m7_q3',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Descuento vs Precio final',
    question: '¿Cómo se calcula el total final a pagar luego de aplicar el descuento?',
    codeSnippet: "precio = float(input(\"Precio: \"))\ndescuento = precio * 0.15\ntotal_pagar = precio - descuento\nprint(\"Total:\", total_pagar)",
    options: [
      "Restando el descuento al precio original (precio - descuento).",
      "Sumando el precio con el descuento (precio + descuento).",
      "Multiplicando precio * descuento.",
      "El total a pagar es directamente la variable descuento."
    ],
    correctAnswer: 0,
    explanation: "El importe final resulta de restar el descuento obtenido al precio base del producto.",
    points: 0.5
  }
];

// 4. Expresiones Matemáticas y Lógicas (4 preguntas)
const MODEL_B_MATH_LOGIC: ExamUnifiedQuestion[] = [
  {
    id: 'tp_b_log_01',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Multiplicación, resta y and',
    question: '¿Cuál es el resultado de evaluar la siguiente expresión?',
    codeSnippet: '(12 * 2 > 20) and (80 - 15 < 60)',
    options: [
      'True',
      'False',
      '24',
      '65'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 12 * 2 es 24; 24 > 20 es True. Paso 2: 80 - 15 es 65; 65 < 60 es False. Paso 3: True and False da False.',
    points: 0.5
  },
  {
    id: 'tp_b_log_02',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: División entera y or',
    question: '¿Qué resultado produce la siguiente expresión con or?',
    codeSnippet: '(20 // 3 == 6) or (7 + 8 == 20)',
    options: [
      'False',
      'True',
      '6',
      '20'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 20 // 3 es 6; 6 == 6 es True. Paso 2: 7 + 8 es 15; 15 == 20 es False. Paso 3: True or False da True.',
    points: 0.5
  },
  {
    id: 'tp_b_log_03',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Negación not con precedencia',
    question: '¿Qué valor booleano genera esta expresión con not?',
    codeSnippet: 'not (4 + 5 * 2 == 14)',
    options: [
      'True',
      'False',
      '14',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: multiplicación 5 * 2 = 10. Paso 2: suma 4 + 10 = 14. Paso 3: 14 == 14 es True. Paso 4: not True produce False.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_b_log_04',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Impar con % y and',
    question: '¿Cuál es el resultado final de evaluar esta expresión?',
    codeSnippet: '(45 % 2 != 0) and (3 * 3 == 9)',
    options: [
      'False',
      'True',
      '1',
      '9'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 45 % 2 es 1 (45 es impar); 1 != 0 es True. Paso 2: 3 * 3 es 9; 9 == 9 es True. Paso 3: True and True resulta True.',
    points: 0.5
  }
];

// 5. Ejercicios Prácticos de Programación (4 ejercicios obligatorios)
const MODEL_B_PRACTICAL: ExamUnifiedQuestion[] = [
  {
    id: 'tp_b_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Doble de un número',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que pida un número al usuario con input(), calcule su doble (D = n * 2) y muestre el resultado en pantalla con print().',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Pedí un número con input(), convertilo con int() o float(), calculá el doble y mostralo con print()\n\nnumero = int(input("Ingresá un número: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Número 9',
        inputs: ['9'],
        expectedOutputPattern: '(?:^|\\D)18(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 9 → Doble esperado: 18'
      },
      {
        name: 'Número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → Doble esperado: 0'
      },
      {
        name: 'Número negativo -5',
        inputs: ['-5'],
        expectedOutputPattern: '(?:^|[^0-9-])-10(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -5 → Doble esperado: -10'
      },
      {
        name: 'Número 15',
        inputs: ['15'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 15 → Doble esperado: 30'
      }
    ]
  },
  {
    id: 'tp_b_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Área de un triángulo',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Pedí la base y la altura de un triángulo mediante input(), calculá su área aplicando la fórmula A = (b * h) / 2 y mostrá el resultado con print().',
    starterCode: '# Ejercicio 2: Área de un triángulo\n# Pedí la base y la altura con input(), calculá (base * altura) / 2 y mostrá el resultado\n\nbase = float(input("Ingresá la base: "))\naltura = float(input("Ingresá la altura: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 12, Altura 5',
        inputs: ['12', '5'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 12, Altura: 5 → Área esperada: 30'
      },
      {
        name: 'Base 6, Altura 4',
        inputs: ['6', '4'],
        expectedOutputPattern: '(?:^|\\D)12(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 6, Altura: 4 → Área esperada: 12'
      },
      {
        name: 'Base 7, Altura 2',
        inputs: ['7', '2'],
        expectedOutputPattern: '(?:^|\\D)7(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 7, Altura: 2 → Área esperada: 7'
      }
    ]
  },
  {
    id: 'tp_b_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Perímetro de un cuadrado',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Pedí la longitud del lado de un cuadrado mediante input(), calculá su perímetro aplicando la fórmula P = 4 * lado y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la longitud del lado, calculá 4 * lado y mostrá el resultado con print()\n\nlado = float(input("Ingresá el lado del cuadrado: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Lado 6',
        inputs: ['6'],
        expectedOutputPattern: '(?:^|\\D)24(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 6 → Perímetro esperado: 24'
      },
      {
        name: 'Lado 9',
        inputs: ['9'],
        expectedOutputPattern: '(?:^|\\D)36(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 9 → Perímetro esperado: 36'
      },
      {
        name: 'Lado 2.5',
        inputs: ['2.5'],
        expectedOutputPattern: '(?:^|\\D)10(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 2.5 → Perímetro esperado: 10'
      }
    ]
  },
  {
    id: 'tp_b_pr_04',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Promedio de 3 notas',
    title: 'Ejercicio 4: Promedio de tres notas',
    question: 'Solicitá 3 calificaciones al usuario mediante input(), calculá el promedio aritmético aplicando la fórmula Prom = (n1 + n2 + n3) / 3 y mostrá el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Promedio de 3 calificaciones\n# Pedí nota1, nota2 y nota3 con input(), calculá (nota1 + nota2 + nota3) / 3 y mostralo con print()\n\nnota1 = float(input("Ingresá la primera nota: "))\nnota2 = float(input("Ingresá la segunda nota: "))\nnota3 = float(input("Ingresá la tercera nota: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Notas 8, 7, 9',
        inputs: ['8', '7', '9'],
        expectedOutputPattern: '(?:^|\\D)8(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 8, 7, 9 → Promedio esperado: 8'
      },
      {
        name: 'Notas 10, 10, 10',
        inputs: ['10', '10', '10'],
        expectedOutputPattern: '(?:^|\\D)10(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 10, 10, 10 → Promedio esperado: 10'
      },
      {
        name: 'Notas 6, 8, 10',
        inputs: ['6', '8', '10'],
        expectedOutputPattern: '(?:^|\\D)8(?:\\.0*)?(?:\\D|$)',
        description: 'Notas: 6, 8, 10 → Promedio esperado: 8'
      }
    ]
  },
  {
    id: 'tp_b_pr_05',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Perímetro de un rectángulo',
    title: 'Ejercicio 5: Perímetro de un rectángulo',
    question: 'Pedí la base y la altura de un rectángulo mediante input(), calculá su perímetro aplicando la fórmula P = 2 * (base + altura) y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 5: Perímetro de un rectángulo\n# Pedí base y altura con float(input()), calculá 2 * (base + altura) y mostrá el resultado\n\nbase = float(input("Base: "))\naltura = float(input("Altura: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Base 4, Altura 6',
        inputs: ['4', '6'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 4, Altura: 6 → Perímetro esperado: 20'
      },
      {
        name: 'Base 10, Altura 5',
        inputs: ['10', '5'],
        expectedOutputPattern: '(?:^|\\D)30(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 5 → Perímetro esperado: 30'
      },
      {
        name: 'Base 8, Altura 2',
        inputs: ['8', '2'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 8, Altura: 2 → Perímetro esperado: 20'
      },
      {
        name: 'Base 15, Altura 5',
        inputs: ['15', '5'],
        expectedOutputPattern: '(?:^|\\D)40(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 15, Altura: 5 → Perímetro esperado: 40'
      }
    ]
  },
  {
    id: 'tp_b_pr_06',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Multiplicación de dos enteros',
    title: 'Ejercicio 6: Multiplicación de dos números enteros',
    question: 'Pedí dos números enteros mediante dos llamadas consecutivas a input(), convertilos con int(), calculá su producto (multiplicación) y mostrá el resultado con print().',
    starterCode: '# Ejercicio 6: Multiplicación de dos enteros\n# Leé dos enteros con input(), multiplicalos y mostrá el resultado con print()\n\nn1 = int(input("Primer número: "))\nn2 = int(input("Segundo número: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Producto 6 * 7',
        inputs: ['6', '7'],
        expectedOutputPattern: '(?:^|\\D)42(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 6 y 7 → Producto esperado: 42'
      },
      {
        name: 'Producto 9 * 5',
        inputs: ['9', '5'],
        expectedOutputPattern: '(?:^|\\D)45(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 9 y 5 → Producto esperado: 45'
      },
      {
        name: 'Producto 8 * 4',
        inputs: ['8', '4'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 8 y 4 → Producto esperado: 32'
      },
      {
        name: 'Producto 10 * 10',
        inputs: ['10', '10'],
        expectedOutputPattern: '(?:^|\\D)100(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 10 y 10 → Producto esperado: 100'
      }
    ]
  },
  {
    id: 'tp_b_pr_07',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Corregir concatenación accidental',
    title: 'Ejercicio 7: Corrección de suma con conversión',
    question: 'El siguiente código intenta sumar dos valores, pero al no convertirlos a int() los concatena como texto (ej: "15" + "25" da "1525"). Corregilo para que convierta los valores a enteros y muestre la suma matemática real.',
    starterCode: '# Ejercicio 7: Corregí el código para que sume matemáticamente\nx = input()\ny = input()\n# Corregí para convertir x e y a int:\ntotal = int(x) + int(y)\nprint(total)\n',
    points: 0.75,
    testCases: [
      {
        name: 'Suma 15 + 25',
        inputs: ['15', '25'],
        expectedOutputPattern: '(?:^|\\D)40(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 15 y 25 → Suma esperada: 40'
      },
      {
        name: 'Suma 30 + 70',
        inputs: ['30', '70'],
        expectedOutputPattern: '(?:^|\\D)100(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 30 y 70 → Suma esperada: 100'
      },
      {
        name: 'Suma 50 + 50',
        inputs: ['50', '50'],
        expectedOutputPattern: '(?:^|\\D)100(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 50 y 50 → Suma esperada: 100'
      },
      {
        name: 'Suma 12 + 8',
        inputs: ['12', '8'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 12 y 8 → Suma esperada: 20'
      }
    ]
  },
  {
    id: 'tp_b_pr_08',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Cálculo de vuelto',
    title: 'Ejercicio 8: Cálculo de vuelto en una compra',
    question: 'Pedí el costo total de una compra y el dinero entregado por el cliente mediante float(input()), calculá el vuelto restando lo entregado menos el costo: entregado - costo, y mostrá el valor del vuelto en pantalla con print().',
    starterCode: '# Ejercicio 8: Cálculo de vuelto\n# Leé el costo y el dinero entregado con float(input()), calculá entregado - costo\n\ncosto = float(input("Costo de la compra: "))\nentregado = float(input("Dinero entregado: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Costo 150, Entregado 200',
        inputs: ['150', '200'],
        expectedOutputPattern: '(?:^|\\D)50(?:\\.0*)?(?:\\D|$)',
        description: 'Costo: 150, Entregado: 200 → Vuelto: 50'
      },
      {
        name: 'Costo 80, Entregado 100',
        inputs: ['80', '100'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Costo: 80, Entregado: 100 → Vuelto: 20'
      },
      {
        name: 'Costo 35, Entregado 50',
        inputs: ['35', '50'],
        expectedOutputPattern: '(?:^|\\D)15(?:\\.0*)?(?:\\D|$)',
        description: 'Costo: 35, Entregado: 50 → Vuelto: 15'
      },
      {
        name: 'Costo 250, Entregado 500',
        inputs: ['250', '500'],
        expectedOutputPattern: '(?:^|\\D)250(?:\\.0*)?(?:\\D|$)',
        description: 'Costo: 250, Entregado: 500 → Vuelto: 250'
      }
    ]
  }
];

// ============================================================================
// --- MODELO C ---
// ============================================================================

// 1. Conceptos Teóricos (12 preguntas)
// Notar que la pregunta de "campo destacado de aplicación" fue reemplazada por la función del intérprete.
const MODEL_C_THEORY: ExamUnifiedQuestion[] = [
  {
    id: 'tp_c_th_01',
    type: 'multiple_choice',
    moduleId: 3,
    topic: 'Concepto Teórico: Función del intérprete',
    question: '¿Qué función cumple el intérprete de Python al ejecutar un programa?',
    options: [
      'Lee, analiza y ejecuta el código instrucción por instrucción en tiempo real.',
      'Transforma la computadora en un servidor web físico sin internet.',
      'Convierte archivos de sonido a texto impreso en pantalla.',
      'Apaga el monitor cada vez que detecta un error de sintaxis.'
    ],
    correctAnswer: 0,
    explanation: 'Python es un lenguaje interpretado: el intérprete lee el código fuente línea por línea y ejecuta cada instrucción en el momento sin generar previamente un archivo ejecutable compilado.',
    points: 0.5
  },
  {
    id: 'tp_c_th_02',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Concepto Teórico: Tipo float',
    question: '¿Qué tipo de dato devolverá la función type(15.0) en Python?',
    options: [
      '<class \'float\'>',
      '<class \'int\'>',
      '<class \'str\'>',
      '<class \'bool\'>'
    ],
    correctAnswer: 0,
    explanation: '15.0 tiene punto decimal, por lo que pertenece a la clase float (número de coma flotante o decimal).',
    points: 0.5
  },
  {
    id: 'tp_c_th_03',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Sensibilidad a mayúsculas',
    question: '¿Qué significa que Python sea sensible a mayúsculas y minúsculas (case-sensitive) en los nombres de variables?',
    options: [
      'Que las variables deben escribirse obligatoriamente en mayúsculas.',
      'Que valor, Valor y VALOR representan tres variables totalmente distintas e independientes en memoria.',
      'Que el intérprete no permite usar mayúsculas en ningún programa.',
      'Que las mayúsculas solo se pueden usar para nombres de personas.'
    ],
    correctAnswer: 1,
    explanation: 'Python distingue estrictamente entre mayúsculas y minúsculas: cambiar una letra crea una variable completamente diferente.',
    points: 0.5
  },
  {
    id: 'tp_c_th_04',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Espacios en variables',
    question: '¿Por qué el nombre total final es inválido para una variable en Python?',
    options: [
      'Porque no puede contener espacios en blanco.',
      'Porque la palabra total está prohibida en Python.',
      'Porque las variables no pueden tener dos palabras.',
      'Porque debe terminar con un número.'
    ],
    correctAnswer: 0,
    explanation: 'Los nombres de variables en Python no pueden contener espacios en blanco. Para separar palabras se debe usar guion bajo (total_final).',
    points: 0.5
  },
  {
    id: 'tp_c_th_05',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Concepto Teórico: Reasignación secuencial',
    question: 'Si a una variable que ya tiene un valor le asignamos uno nuevo (ej: x = 10 y luego x = 20), ¿qué ocurre con el primer valor?',
    options: [
      'Se suma al nuevo valor automáticamente.',
      'Se descarta y la variable adopta el nuevo valor asignado.',
      'Provoca un error de sintaxis porque las variables no pueden cambiar.',
      'Se guarda en una variable oculta llamada x_anterior.'
    ],
    correctAnswer: 1,
    explanation: 'En Python las variables son mutables en su contenido asignado: al hacer x = 20, la variable ahora almacena 20 y el valor 10 anterior se reemplaza.',
    points: 0.5
  },
  {
    id: 'tp_c_th_06',
    type: 'multiple_choice',
    moduleId: 9,
    topic: 'Concepto Teórico: Cálculos dentro de print()',
    question: '¿Qué hace la función print() cuando recibe una operación matemática como print(4 + 6 * 2)?',
    options: [
      'Muestra el texto "4 + 6 * 2" literalmente.',
      'Evalúa y calcula la operación matemática respetando la precedencia y muestra el resultado (16).',
      'Da un error porque print() solo acepta texto.',
      'Calcula la operación pero no muestra nada en pantalla.'
    ],
    correctAnswer: 1,
    explanation: 'Python evalúa primero las expresiones pasadas como argumento a print() (respetando la precedencia: 6 * 2 = 12, más 4 = 16) y luego muestra el resultado final.',
    points: 0.5
  },
  {
    id: 'tp_c_th_07',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Concatenación accidental',
    question: 'Si pedimos dos números con input() y hacemos n1 + n2 sin convertirlos a int(), ¿qué resultado obtendremos si ingresamos 3 y 4?',
    options: [
      '7 (la suma numérica).',
      '"34" (la concatenación de ambos textos).',
      '12 (la multiplicación).',
      'Error de sintaxis inmediato.'
    ],
    correctAnswer: 1,
    explanation: 'El operador + entre dos cadenas de texto (str) realiza concatenación (unión de textos), produciendo "34". Para sumar se debe usar int(n1) + int(n2).',
    points: 0.5
  },
  {
    id: 'tp_c_th_08',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Concepto Teórico: Conversión int() con decimales',
    question: '¿Qué resultado produce la conversión int(8.9) en Python?',
    options: [
      '9 (redondea hacia arriba).',
      '8 (trunca y descarta la parte decimal).',
      '8.9',
      'Error porque no se pueden convertir flotantes a enteros.'
    ],
    correctAnswer: 1,
    explanation: 'La función int() descarta por completo los decimales (truncamiento directo), por lo que int(8.9) da como resultado 8.',
    points: 0.5
  },
  // Complementarias (parejas):
  {
    id: 'tp_c_th_09',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Concepto Teórico: Operador Mayor o Igual >=',
    question: '¿Qué evalúa exactamente la comparación a >= b en Python?',
    options: [
      'Si a es estrictamente mayor que b únicamente.',
      'Si a es mayor o es igual a b; dará True si se cumple cualquiera de las dos condiciones.',
      'Si a y b son de tipos de datos diferentes.',
      'Calcula la resta entre a y b.'
    ],
    correctAnswer: 1,
    explanation: '>= es el operador relacional "mayor o igual que". Devuelve True si el valor de la izquierda es mayor o si es igual al de la derecha.',
    points: 0.5
  },
  {
    id: 'tp_c_th_10',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: Detección de paridad con %',
    question: '¿Cuál de las siguientes condiciones en Python permite verificar si un número entero n es PAR?',
    options: [
      'n / 2 == 0',
      'n % 2 == 0',
      'n // 2 == 1',
      'n ** 2 == 2'
    ],
    correctAnswer: 1,
    explanation: 'Si el resto de dividir un número por 2 es 0 (n % 2 == 0), significa que la división es exacta y por definición el número es par.',
    points: 0.5
  },
  {
    id: 'tp_c_th_11',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Concepto Teórico: Precedencia aritmética',
    question: 'En la expresión 2 + 3 * 4, ¿cuál es el resultado y por qué?',
    options: [
      '20, porque se evalúa de izquierda a derecha (2 + 3 = 5, y 5 * 4 = 20).',
      '14, porque la multiplicación (*) tiene mayor precedencia que la suma (+) y se resuelve primero (3 * 4 = 12, y 12 + 2 = 14).',
      '24.',
      'Error de cálculo.'
    ],
    correctAnswer: 1,
    explanation: 'En Python la multiplicación y división tienen mayor jerarquía que la suma y la resta. Por eso 3 * 4 = 12 se ejecuta primero, dando 14.',
    points: 0.5
  },
  {
    id: 'tp_c_th_12',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Concepto Teórico: Operador Lógico not',
    question: '¿Qué función cumple el operador lógico not en Python?',
    options: [
      'Convierte números positivos en negativos.',
      'Invierte el valor de verdad: si algo es True lo convierte en False, y si es False lo convierte en True.',
      'Borra la condición anterior.',
      'Compara si dos textos no son iguales.'
    ],
    correctAnswer: 1,
    explanation: 'not es el operador unario de negación lógica: invierte el valor booleano (not True -> False; not False -> True).',
    points: 0.5
  }
];

// 2. Interpretación de Código («¿Qué muestra / hace este código?») (6 preguntas)
const MODEL_C_INTERPRETATION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_c_int_01',
    type: 'tracing',
    moduleId: 4,
    topic: 'Interpretación de Código: Reasignación múltiple',
    question: '¿Qué valor final mostrará en pantalla el siguiente programa?',
    codeSnippet: 'n = 8\nn = n * 2\nn = n - 3\nprint(n)',
    options: [
      '8',
      '13',
      '16',
      '10'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: n vale 8. Paso 2: n = 8 * 2 = 16. Paso 3: n = 16 - 3 = 13. Se imprime 13.',
    points: 0.5
  },
  {
    id: 'tp_c_int_02',
    type: 'tracing',
    moduleId: 9,
    topic: 'Interpretación de Código: Texto literal entre comillas',
    question: '¿Qué imprime exactamente este código al ejecutarse?',
    codeSnippet: 'mensaje = "Python"\nprint("mensaje")',
    options: [
      'Python',
      'mensaje',
      '"Python"',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'Al estar entre comillas ("mensaje"), print() muestra la palabra literal mensaje, no el valor de la variable.',
    points: 0.5
  },
  {
    id: 'tp_c_int_03',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: Multiplicación de variables',
    question: '¿Qué salida muestra este código en consola?',
    codeSnippet: 'precio = 50\ncantidad = 3\ntotal = precio * cantidad\nprint(total)',
    options: [
      '150',
      '503',
      'precio * cantidad',
      '50'
    ],
    correctAnswer: 0,
    explanation: 'total guarda 50 * 3 = 150. Luego se imprime ese número.',
    points: 0.5
  },
  {
    id: 'tp_c_int_04',
    type: 'tracing',
    moduleId: 10,
    topic: 'Interpretación de Código: int() y división entera',
    question: '¿Qué valor se muestra al ejecutar este programa?',
    codeSnippet: 's = "30"\nr = int(s) // 3\nprint(r)',
    options: [
      '10.0',
      '10',
      '30',
      'Error de tipos'
    ],
    correctAnswer: 1,
    explanation: 'int("30") da el entero 30. // es la división entera: 30 // 3 da el entero 10.',
    points: 0.5
  },
  // Complementarias (parejas):
  {
    id: 'tp_c_int_05',
    type: 'tracing',
    moduleId: 7,
    topic: 'Interpretación de Código: Mayor o igual',
    question: '¿Qué imprime este programa al ejecutarse?',
    codeSnippet: 'x = 18\nprint(x >= 18)',
    options: [
      'x >= 18',
      'True',
      'False',
      '18'
    ],
    correctAnswer: 1,
    explanation: '18 es igual a 18, por lo que la condición x >= 18 es verdadera y print() muestra True.',
    points: 0.5
  },
  {
    id: 'tp_c_int_06',
    type: 'tracing',
    moduleId: 6,
    topic: 'Interpretación de Código: División entera en horas',
    question: '¿Qué muestra este código al ejecutarse?',
    codeSnippet: 'horas = 50\ndias = horas // 24\nprint(dias)',
    options: [
      '2.0833',
      '2',
      '3',
      '50'
    ],
    correctAnswer: 1,
    explanation: '50 // 24 calcula los días completos enteros: 24 * 2 = 48, por lo que el cociente entero es 2.',
    points: 0.5
  },
  {
    id: 'tp_c_int_07',
    type: 'tracing',
    moduleId: 9,
    topic: 'Interpretación de Código: Salto de línea',
    question: '¿Cómo muestra print() en pantalla el siguiente texto con salto de línea?',
    codeSnippet: 'texto1 = "Python"\ntexto2 = "Desde Cero"\nprint(texto1 + "\\n" + texto2)',
    options: [
      'Imprime Python en la primera línea y Desde Cero en la línea siguiente.',
      'Imprime todo en una sola línea: Python\\nDesde Cero.',
      'Genera un error porque \\n solo se puede usar con números.',
      'Solo muestra la palabra Python.'
    ],
    correctAnswer: 0,
    explanation: '\\n representa un salto de línea (escape sequence), por lo que print() muestra "Python" en una línea y "Desde Cero" en la siguiente.',
    points: 0.5
  },
  {
    id: 'tp_c_int_08',
    type: 'tracing',
    moduleId: 4,
    topic: 'Interpretación de Código: Reasignación acumulativa',
    question: '¿Qué valor final tiene la variable puntos al ejecutarse este programa?',
    codeSnippet: 'puntos = 50\npuntos = puntos + 25\npuntos = puntos - 10\nprint(puntos)',
    options: [
      '65',
      '75',
      '50',
      '40'
    ],
    correctAnswer: 0,
    explanation: 'Primero vale 50. Luego 50 + 25 = 75. Finalmente 75 - 10 = 65. Se imprime 65.',
    points: 0.5
  }
];

// 3. Detección de Errores («¿Qué problema tiene este código?») (4 preguntas)
const MODEL_C_ERROR_DETECTION: ExamUnifiedQuestion[] = [
  {
    id: 'tp_c_err_01',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Resta con texto',
    question: '¿Qué problema presenta este código al ejecutarse?',
    codeSnippet: 'precio = input("Precio: ")\ntotal = precio - 10\nprint(total)',
    options: [
      'Muestra el precio restándole 10 sin errores.',
      'Ocurre un error TypeError porque precio es de tipo texto (str) y no se puede restar un número a un texto sin convertirlo.',
      'precio se multiplica automáticamente por 10.',
      'print() no puede imprimir variables llamadas total.'
    ],
    correctAnswer: 1,
    explanation: 'input() devuelve una cadena de texto. El operador de resta (-) no está definido entre str e int. Se debe usar int(precio) o float(precio).',
    points: 0.5
  },
  {
    id: 'tp_c_err_02',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Mayúscula en variable',
    question: '¿Por qué falla este programa al ejecutarse?',
    codeSnippet: 'cantidad = 5\ntotal = Cantidad * 10\nprint(total)',
    options: [
      'Porque Python no permite multiplicar números por 10.',
      'Porque la variable se creó como cantidad (con minúscula) pero en el cálculo se escribió Cantidad (con mayúscula), produciendo NameError.',
      'Porque total debe crearse antes que cantidad.',
      'Porque falta convertir el número 5 con int().'
    ],
    correctAnswer: 1,
    explanation: 'Python es case-sensitive. Cantidad no está definida en memoria porque fue creada con minúscula (cantidad).',
    points: 0.5
  },
  {
    id: 'tp_c_err_03',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Código sin errores',
    question: '¿Qué error contiene el siguiente código de cálculo de perímetro?',
    codeSnippet: 'lado = 7\nperimetro = lado * 4\nprint("Perímetro:", perimetro)',
    options: [
      'No se puede multiplicar una variable por 4.',
      'La función print() tiene un error en el texto.',
      'No contiene ningún error: calcula el perímetro de un cuadrado (28) y lo muestra correctamente.',
      'Falta convertir lado con str().'
    ],
    correctAnswer: 2,
    explanation: 'El código es totalmente correcto y produce la salida "Perímetro: 28" sin fallos.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_c_err_04',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Confusión de asignación en comparación',
    question: '¿Qué error de sintaxis tiene este código si queríamos comparar si puntos era igual a 100?',
    codeSnippet: 'puntos = 100\nresultado = (puntos = 100)\nprint(resultado)',
    options: [
      'Dentro del paréntesis se usó = (asignación) en lugar de == (operador de comparación de igualdad).',
      'No se pueden usar paréntesis en Python.',
      'puntos no puede valer 100.',
      'resultado es una palabra reservada del sistema.'
    ],
    correctAnswer: 0,
    explanation: 'En Python no se puede realizar una asignación (=) dentro de una expresión de comparación. Se debe usar el doble igual (puntos == 100).',
    points: 0.5
  },
  {
    id: 'tp_c_err_05',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Palabra reservada',
    question: '¿Por qué no es válida la primera línea de este programa?',
    codeSnippet: 'class = "Tercer Año"\nprint(class)',
    options: [
      'Porque class es una palabra reservada del lenguaje Python y no puede utilizarse como nombre de variable.',
      'Porque el texto debió escribirse con comillas simples obligatoriamente.',
      'Porque no se pueden crear variables de tipo texto.',
      'El programa es perfectamente válido y muestra Tercer Año.'
    ],
    correctAnswer: 0,
    explanation: 'class es una palabra clave reservada de la sintaxis de Python. Intentar usarla como identificador genera SyntaxError.',
    points: 0.5
  },
  {
    id: 'tp_c_err_06',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Conversión inválida',
    question: '¿Qué error se produce al intentar ejecutar la segunda línea de este código?',
    codeSnippet: 'palabra = "veinte"\nnumero = int(palabra)\nprint(numero * 2)',
    options: [
      'Falla con ValueError porque "veinte" contiene letras y la función int() solo puede convertir cadenas formadas por dígitos numéricos (como "20").',
      'Python traduce automáticamente la palabra y numero pasa a valer 20.',
      'numero se convierte en 0.',
      'print() produce un error de memoria.'
    ],
    correctAnswer: 0,
    explanation: 'int() solo puede convertir textos que contengan dígitos numéricos válidos (ej: "20"). Si se le pasa una palabra con letras genera ValueError: invalid literal for int().',
    points: 0.5
  },
  // --- NUEVAS VARIANTES DE DETECCIÓN DE ERRORES Y ANÁLISIS (MODELOS 1 AL 7) ---
  {
    id: 'tp_c_m1_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Por qué Python repite el valor ingresado en lugar de multiplicarlo numéricamente por 3?',
    codeSnippet: "usuario = input(\"Tu apodo: \")\nmonedas_cofre = input(\"Monedas encontradas en el cofre: \")\n\nmonedas_finales = monedas_cofre * 3\n\nprint(\"Usuario:\", usuario)\nprint(\"Monedas triplicadas:\", monedas_finales)",
    options: [
      "Porque la función input() siempre retorna un dato de tipo cadena (str).",
      "Porque el operador * solo sirve para repetir texto y no para multiplicar números.",
      "Porque la variable usuario no fue convertida a número.",
      "Porque print() transforma internamente los enteros en texto antes de operar."
    ],
    correctAnswer: 0,
    explanation: "input() siempre devuelve un dato str; al multiplicarlo por un entero se produce repetición del texto.",
    points: 0.5
  },
  {
    id: 'tp_c_m1_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: '¿Cuál es la forma correcta de modificar el cálculo para obtener el triple matemático?',
    codeSnippet: "usuario = input(\"Tu apodo: \")\nmonedas_cofre = input(\"Monedas encontradas en el cofre: \")\n\nmonedas_finales = monedas_cofre * 3\n\nprint(\"Usuario:\", usuario)\nprint(\"Monedas triplicadas:\", monedas_finales)",
    options: [
      "monedas_finales = str(monedas_cofre) * 3",
      "monedas_finales = int(monedas_cofre) * 3",
      "monedas_finales = input(monedas_cofre * 3)",
      "monedas_finales = print(monedas_cofre * 3)"
    ],
    correctAnswer: 1,
    explanation: "int(monedas_cofre) convierte el texto en número entero permitiendo triplicar su valor numérico.",
    points: 0.5
  },
  {
    id: 'tp_c_m1_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Multiplicación de texto',
    question: 'Si el usuario ingresa 12, ¿qué resultado se muestra en pantalla con el código original?',
    codeSnippet: "usuario = input(\"Tu apodo: \")\nmonedas_cofre = input(\"Monedas encontradas en el cofre: \")\n\nmonedas_finales = monedas_cofre * 3\n\nprint(\"Usuario:\", usuario)\nprint(\"Monedas triplicadas:\", monedas_finales)",
    options: [
      "36",
      "121212",
      "15",
      "Un error ValueError de Python."
    ],
    correctAnswer: 1,
    explanation: "\"12\" * 3 repite la cadena tres veces produciendo \"121212\".",
    points: 0.5
  },
  {
    id: 'tp_c_m2_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: 'Si las notas son 8, 4 y 6, ¿qué promedio calcula el código original?',
    codeSnippet: "estudiante = input(\"Nombre: \")\nn1 = int(input(\"Nota 1: \"))\nn2 = int(input(\"Nota 2: \"))\nn3 = int(input(\"Nota 3: \"))\n\npromedio = n1 + n2 + n3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "6.0",
      "14.0",
      "18.0",
      "12.0"
    ],
    correctAnswer: 1,
    explanation: "La división n3 / 3 tiene prioridad y da 2.0. Luego 8 + 4 + 2.0 da 14.0.",
    points: 0.5
  },
  {
    id: 'tp_c_m2_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Jerarquía de Operaciones: Promedio de notas',
    question: '¿Cuál es la corrección correcta para que el promedio sume las tres notas antes de dividir?',
    codeSnippet: "estudiante = input(\"Nombre: \")\nn1 = int(input(\"Nota 1: \"))\nn2 = int(input(\"Nota 2: \"))\nn3 = int(input(\"Nota 3: \"))\n\npromedio = n1 + n2 + n3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "promedio = n1 + (n2 + n3) / 3",
      "promedio = (n1 + n2 + n3) / 3",
      "promedio = (n1 + n2) / n3",
      "promedio = n1 * n2 * n3 / 3"
    ],
    correctAnswer: 1,
    explanation: "Los paréntesis fuerzan a realizar primero la suma de las tres notas antes de la división.",
    points: 0.5
  },
  {
    id: 'tp_c_m2_q3',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Decimales y int()',
    question: '¿Por qué se interrumpe el programa si se ingresa "6.5" en int(input(...))?',
    codeSnippet: "estudiante = input(\"Nombre: \")\nn1 = int(input(\"Nota 1: \"))\nn2 = int(input(\"Nota 2: \"))\nn3 = int(input(\"Nota 3: \"))\n\npromedio = n1 + n2 + n3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "Porque 6.5 es un número negativo.",
      "Porque int() no acepta una cadena con punto decimal (\"6.5\") para convertirla directamente a entero.",
      "Porque input() solo admite números menores a 5.",
      "Porque print() no puede recibir texto."
    ],
    correctAnswer: 1,
    explanation: "int(\"6.5\") arroja ValueError ya que la cadena contiene un punto decimal.",
    points: 0.5
  },
  {
    id: 'tp_c_m2_q4',
    type: 'multiple_choice',
    moduleId: 5,
    topic: 'Conversión de Tipos: Uso de float()',
    question: '¿Qué función de conversión resuelve este inconveniente para admitir decimales?',
    codeSnippet: "estudiante = input(\"Nombre: \")\nn1 = int(input(\"Nota 1: \"))\nn2 = int(input(\"Nota 2: \"))\nn3 = int(input(\"Nota 3: \"))\n\npromedio = n1 + n2 + n3 / 3\n\nprint(\"Estudiante:\", estudiante)\nprint(\"Promedio final:\", promedio)",
    options: [
      "int()",
      "str()",
      "float()",
      "len()"
    ],
    correctAnswer: 2,
    explanation: "float() es la función adecuada para convertir cadenas con números decimales.",
    points: 0.5
  },
  {
    id: 'tp_c_m3_q1',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: 'Si se ingresan los valores 300 y 75, ¿cuál es la salida en pantalla del código original?',
    codeSnippet: "precio_item1 = input(\"Precio primer ítem: \")\nprecio_item2 = input(\"Precio segundo ítem: \")\n\ntotal_compra = precio_item1 + precio_item2\n\nprint(\"Total:\", total_compra)",
    options: [
      "375",
      "30075",
      "300",
      "Un mensaje de error de sintaxis."
    ],
    correctAnswer: 1,
    explanation: "\"300\" y \"75\" son cadenas y se concatenan como \"30075\".",
    points: 0.5
  },
  {
    id: 'tp_c_m3_q2',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Suma de precios',
    question: '¿Cuál es la forma correcta de sumar ambos precios como números?',
    codeSnippet: "precio_item1 = input(\"Precio primer ítem: \")\nprecio_item2 = input(\"Precio segundo ítem: \")\n\ntotal_compra = precio_item1 + precio_item2\n\nprint(\"Total:\", total_compra)",
    options: [
      "total_compra = text(precio_item1) + text(precio_item2)",
      "total_compra = int(precio_item1) + int(precio_item2)",
      "total_compra = input(precio_item1 + precio_item2)",
      "total_compra = bool(precio_item1) + bool(precio_item2)"
    ],
    correctAnswer: 1,
    explanation: "int(precio_item1) + int(precio_item2) realiza la suma aritmética de ambos enteros.",
    points: 0.5
  },
  {
    id: 'tp_c_m3_q3',
    type: 'multiple_choice',
    moduleId: 10,
    topic: 'Detección de Errores: Precios con decimales',
    question: 'Para permitir precios con centavos (como 250.75), ¿qué función se debe utilizar?',
    codeSnippet: "precio_item1 = input(\"Precio primer ítem: \")\nprecio_item2 = input(\"Precio segundo ítem: \")\n\ntotal_compra = precio_item1 + precio_item2\n\nprint(\"Total:\", total_compra)",
    options: [
      "int()",
      "float()",
      "str()",
      "tuple()"
    ],
    correctAnswer: 1,
    explanation: "float() es la función requerida para números con decimales.",
    points: 0.5
  },
  {
    id: 'tp_c_m4_q1',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: 'Si una persona tiene exactamente 18 años y la regla permite el ingreso desde los 18 años cumplidos, ¿qué imprime el programa?',
    codeSnippet: "edad = int(input(\"Ingresá tu edad: \"))\n\nif edad > 18:\n    print(\"Acceso permitido\")\nelse:\n    print(\"Acceso denegado\")",
    options: [
      "Acceso permitido",
      "Acceso denegado, porque > no incluye el valor 18.",
      "Un error NameError.",
      "No imprime nada en pantalla."
    ],
    correctAnswer: 1,
    explanation: "> 18 excluye al 18, por lo que entra al bloque else.",
    points: 0.5
  },
  {
    id: 'tp_c_m4_q2',
    type: 'multiple_choice',
    moduleId: 7,
    topic: 'Detección de Errores: Condición if',
    question: '¿Cómo se corrige la condición para admitir a las personas con 18 años o más?',
    codeSnippet: "edad = int(input(\"Ingresá tu edad: \"))\n\nif edad > 18:\n    print(\"Acceso permitido\")\nelse:\n    print(\"Acceso denegado\")",
    options: [
      "if edad = 18:",
      "if edad != 18:",
      "if edad >= 18:",
      "if edad < 18:"
    ],
    correctAnswer: 2,
    explanation: ">= es el operador relacional para mayor o igual que.",
    points: 0.5
  },
  {
    id: 'tp_c_m5_q1',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Por qué Python detiene el programa en la última línea con NameError?',
    codeSnippet: "valor = int(input(\"Ingresá un valor: \"))\n\nresultado = valor * valor\n\nprint(\"El resultado es:\", resultados)",
    options: [
      "Porque multiplicar valor * valor no es válido en Python.",
      "Porque la variable calculada se llama resultado y print intenta imprimir resultados, que no existe.",
      "Porque int() no acepta variables llamadas valor.",
      "Porque print() solo admite una única variable sin texto."
    ],
    correctAnswer: 1,
    explanation: "La variable definida es resultado (en singular) mientras que en print() se invocó resultados (en plural).",
    points: 0.5
  },
  {
    id: 'tp_c_m5_q2',
    type: 'multiple_choice',
    moduleId: 4,
    topic: 'Detección de Errores: Nombre de variable',
    question: '¿Qué línea soluciona el fallo en la salida?',
    codeSnippet: "valor = int(input(\"Ingresá un valor: \"))\n\nresultado = valor * valor\n\nprint(\"El resultado es:\", resultados)",
    options: [
      "print(\"El resultado es:\", resultado)",
      "print(\"El resultado es:\", valor)",
      "resultados = input(valor)",
      "print(resultado = valor)"
    ],
    correctAnswer: 0,
    explanation: "Se debe imprimir la variable con el nombre exacto asignado: resultado.",
    points: 0.5
  },
  {
    id: 'tp_c_m6_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué resultado produce la variable equipos con el código original?',
    codeSnippet: "alumnos = 29\npor_equipo = 6\n\nequipos = alumnos / por_equipo\n\nprint(\"Equipos completos:\", equipos)",
    options: [
      "4",
      "Aproximadamente 4.8333",
      "5",
      "24"
    ],
    correctAnswer: 1,
    explanation: "29 / 6 produce un resultado float aproximado a 4.8333.",
    points: 0.5
  },
  {
    id: 'tp_c_m6_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: División entera',
    question: '¿Qué operador se debe utilizar para obtener los 4 equipos completos?',
    codeSnippet: "alumnos = 29\npor_equipo = 6\n\nequipos = alumnos / por_equipo\n\nprint(\"Equipos completos:\", equipos)",
    options: [
      "%",
      "//",
      "**",
      "/"
    ],
    correctAnswer: 1,
    explanation: "// realiza la división entera sin decimales (29 // 6 = 4).",
    points: 0.5
  },
  {
    id: 'tp_c_m7_q1',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Cuál es el problema con la fórmula utilizada para calcular el 20 % de descuento?',
    codeSnippet: "monto = float(input(\"Monto de compra: \"))\n\ndescuento = monto * 20\n\nprint(\"Descuento:\", descuento)",
    options: [
      "Multiplica por 20 agrandando el valor 20 veces en lugar de obtener el 20 % (multiplicar por 0.20).",
      "monto no puede ser tipo float.",
      "descuento es una palabra reservada en Python.",
      "input() no admite el signo de porcentaje."
    ],
    correctAnswer: 0,
    explanation: "El 20 % de un monto se obtiene multiplicando por 0.20, no por 20.",
    points: 0.5
  },
  {
    id: 'tp_c_m7_q2',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Cálculo de descuento',
    question: '¿Qué instrucción calcula correctamente el descuento del 20 %?',
    codeSnippet: "monto = float(input(\"Monto de compra: \"))\n\ndescuento = monto * 20\n\nprint(\"Descuento:\", descuento)",
    options: [
      "descuento = monto * 0.20",
      "descuento = monto / 20",
      "descuento = monto - 20",
      "descuento = monto + 0.20"
    ],
    correctAnswer: 0,
    explanation: "monto * 0.20 es la expresión que calcula el 20 % de descuento.",
    points: 0.5
  },
  {
    id: 'tp_c_m7_q3',
    type: 'multiple_choice',
    moduleId: 6,
    topic: 'Detección de Errores: Descuento vs Precio final',
    question: '¿Cómo se obtiene el importe neto que debe pagar el cliente tras deducir el descuento?',
    codeSnippet: "monto = float(input(\"Monto: \"))\ndescuento = monto * 0.20\nimporte_neto = monto - descuento\nprint(\"Neto:\", importe_neto)",
    options: [
      "Calculando importe_neto = monto - descuento.",
      "Calculando importe_neto = monto + descuento.",
      "El importe neto es igual a la variable descuento sin cambios.",
      "Dividiendo monto entre descuento."
    ],
    correctAnswer: 0,
    explanation: "El valor neto final se obtiene restando el descuento al precio bruto.",
    points: 0.5
  }
];

// 4. Expresiones Matemáticas y Lógicas (4 preguntas)
const MODEL_C_MATH_LOGIC: ExamUnifiedQuestion[] = [
  {
    id: 'tp_c_log_01',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Resta, multiplicación y and',
    question: '¿Cuál es el resultado de evaluar la siguiente expresión?',
    codeSnippet: '(40 - 10 > 25) and (6 * 3 == 20)',
    options: [
      'True',
      'False',
      '30',
      '18'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 40 - 10 es 30; 30 > 25 es True. Paso 2: 6 * 3 es 18; 18 == 20 es False. Paso 3: True and False da False.',
    points: 0.5
  },
  {
    id: 'tp_c_log_02',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: División entera y or',
    question: '¿Qué valor booleano produce la siguiente expresión?',
    codeSnippet: '(35 // 5 == 7) or (12 - 5 > 10)',
    options: [
      'False',
      'True',
      '7',
      '10'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 35 // 5 es 7; 7 == 7 es True. Paso 2: 12 - 5 es 7; 7 > 10 es False. Paso 3: True or False da True.',
    points: 0.5
  },
  {
    id: 'tp_c_log_03',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Precedencia con not',
    question: '¿Qué resultado final produce esta expresión con negación not?',
    codeSnippet: 'not (15 - 3 * 4 == 3)',
    options: [
      'True',
      'False',
      '3',
      'None'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 3 * 4 = 12. Paso 2: 15 - 12 = 3. Paso 3: 3 == 3 es True. Paso 4: not True da False.',
    points: 0.5
  },
  // Complementaria (parejas):
  {
    id: 'tp_c_log_04',
    type: 'multiple_choice',
    moduleId: 8,
    topic: 'Expresión Lógica: Paridad con % y mayor o igual',
    question: '¿Cuál es el resultado final de evaluar esta expresión?',
    codeSnippet: '(22 % 2 == 0) and (7 * 2 >= 14)',
    options: [
      'False',
      'True',
      '0',
      '14'
    ],
    correctAnswer: 1,
    explanation: 'Paso 1: 22 % 2 es 0 (22 es par); 0 == 0 es True. Paso 2: 7 * 2 es 14; 14 >= 14 es True. Paso 3: True and True resulta True.',
    points: 0.5
  }
];

// 5. Ejercicios Prácticos de Programación (4 ejercicios obligatorios)
const MODEL_C_PRACTICAL: ExamUnifiedQuestion[] = [
  {
    id: 'tp_c_pr_01',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Doble de un número',
    title: 'Ejercicio 1: Calcular el doble',
    question: 'Escribí un programa que pida un número al usuario con input(), calcule su doble (D = n * 2) y muestre el resultado en pantalla con print().',
    starterCode: '# Ejercicio 1: Calcular el doble\n# Pedí un número con input(), convertilo con int() o float(), calculá el doble y mostralo con print()\n\nnumero = int(input("Ingresá un número: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Número 11',
        inputs: ['11'],
        expectedOutputPattern: '(?:^|\\D)22(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 11 → Doble esperado: 22'
      },
      {
        name: 'Número 0',
        inputs: ['0'],
        expectedOutputPattern: '(?:^|\\D)0(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 0 → Doble esperado: 0'
      },
      {
        name: 'Número negativo -7',
        inputs: ['-7'],
        expectedOutputPattern: '(?:^|[^0-9-])-14(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: -7 → Doble esperado: -14'
      },
      {
        name: 'Número 25',
        inputs: ['25'],
        expectedOutputPattern: '(?:^|\\D)50(?:\\.0*)?(?:\\D|$)',
        description: 'Entrada: 25 → Doble esperado: 50'
      }
    ]
  },
  {
    id: 'tp_c_pr_02',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Área de un triángulo',
    title: 'Ejercicio 2: Área de un triángulo',
    question: 'Pedí la base y la altura de un triángulo mediante input(), calculá su área aplicando la fórmula A = (b * h) / 2 y mostrá el resultado con print().',
    starterCode: '# Ejercicio 2: Área de un triángulo\n# Pedí la base y la altura con input(), calculá (base * altura) / 2 y mostrá el resultado\n\nbase = float(input("Ingresá la base: "))\naltura = float(input("Ingresá la altura: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Base 16, Altura 4',
        inputs: ['16', '4'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 16, Altura: 4 → Área esperada: 32'
      },
      {
        name: 'Base 9, Altura 6',
        inputs: ['9', '6'],
        expectedOutputPattern: '(?:^|\\D)27(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 9, Altura: 6 → Área esperada: 27'
      },
      {
        name: 'Base 10, Altura 3',
        inputs: ['10', '3'],
        expectedOutputPattern: '(?:^|\\D)15(?:\\.0*)?(?:\\D|$)',
        description: 'Base: 10, Altura: 3 → Área esperada: 15'
      }
    ]
  },
  {
    id: 'tp_c_pr_03',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Perímetro de un cuadrado',
    title: 'Ejercicio 3: Perímetro de un cuadrado',
    question: 'Pedí la longitud del lado de un cuadrado mediante input(), calculá su perímetro aplicando la fórmula P = 4 * lado y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 3: Perímetro de un cuadrado\n# Pedí la longitud del lado, calculá 4 * lado y mostrá el resultado con print()\n\nlado = float(input("Ingresá el lado del cuadrado: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Lado 7',
        inputs: ['7'],
        expectedOutputPattern: '(?:^|\\D)28(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 7 → Perímetro esperado: 28'
      },
      {
        name: 'Lado 11',
        inputs: ['11'],
        expectedOutputPattern: '(?:^|\\D)44(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 11 → Perímetro esperado: 44'
      },
      {
        name: 'Lado 4.5',
        inputs: ['4.5'],
        expectedOutputPattern: '(?:^|\\D)18(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 4.5 → Perímetro esperado: 18'
      }
    ]
  },
  {
    id: 'tp_c_pr_04',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Precio con descuento',
    title: 'Ejercicio 4: Precio final con descuento',
    question: 'Pedí el precio de un producto y el monto del descuento mediante input(), calculá el precio final (precio_final = precio - descuento) y mostrá el resultado en pantalla.',
    starterCode: '# Ejercicio 4: Precio final con descuento\n# Pedí precio y descuento con input(), calculá precio - descuento y mostralo con print()\n\nprecio = float(input("Ingresá el precio del producto: "))\ndescuento = float(input("Ingresá el monto de descuento: "))\n',
    points: 1.5,
    testCases: [
      {
        name: 'Precio 100, Descuento 20',
        inputs: ['100', '20'],
        expectedOutputPattern: '(?:^|\\D)80(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 100, Descuento: 20 → Total esperado: 80'
      },
      {
        name: 'Precio 250, Descuento 50',
        inputs: ['250', '50'],
        expectedOutputPattern: '(?:^|\\D)200(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 250, Descuento: 50 → Total esperado: 200'
      },
      {
        name: 'Precio 80, Descuento 15',
        inputs: ['80', '15'],
        expectedOutputPattern: '(?:^|\\D)65(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 80, Descuento: 15 → Total esperado: 65'
      }
    ]
  },
  {
    id: 'tp_c_pr_05',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Perímetro de un rombo',
    title: 'Ejercicio 5: Perímetro de un rombo',
    question: 'Un rombo tiene 4 lados de igual longitud. Pedí la longitud del lado mediante float(input()), calculá su perímetro con P = 4 * lado y mostrá el resultado en pantalla con print().',
    starterCode: '# Ejercicio 5: Perímetro de un rombo\n# Pedí la longitud del lado con float(input()), calculá 4 * lado y mostrá el resultado\n\nlado = float(input("Longitud del lado: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Lado 8',
        inputs: ['8'],
        expectedOutputPattern: '(?:^|\\D)32(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 8 → Perímetro esperado: 32'
      },
      {
        name: 'Lado 12',
        inputs: ['12'],
        expectedOutputPattern: '(?:^|\\D)48(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 12 → Perímetro esperado: 48'
      },
      {
        name: 'Lado 5',
        inputs: ['5'],
        expectedOutputPattern: '(?:^|\\D)20(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 5 → Perímetro esperado: 20'
      },
      {
        name: 'Lado 15',
        inputs: ['15'],
        expectedOutputPattern: '(?:^|\\D)60(?:\\.0*)?(?:\\D|$)',
        description: 'Lado: 15 → Perímetro esperado: 60'
      }
    ]
  },
  {
    id: 'tp_c_pr_06',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Cociente de división entera',
    title: 'Ejercicio 6: Cociente de división entera',
    question: 'Pedí dos números enteros a y b mediante dos llamadas a input(), calculá el cociente de la división entera mediante el operador // y mostrá el resultado con print().',
    starterCode: '# Ejercicio 6: Cociente entero\n# Leé dos enteros a y b con int(input()), calculá a // b y mostrá el resultado\n\na = int(input("Dividendo a: "))\nb = int(input("Divisor b: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Cociente 27 // 4',
        inputs: ['27', '4'],
        expectedOutputPattern: '(?:^|\\D)6(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 27 y 4 → Cociente entero: 6'
      },
      {
        name: 'Cociente 50 // 6',
        inputs: ['50', '6'],
        expectedOutputPattern: '(?:^|\\D)8(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 50 y 6 → Cociente entero: 8'
      },
      {
        name: 'Cociente 100 // 10',
        inputs: ['100', '10'],
        expectedOutputPattern: '(?:^|\\D)10(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 100 y 10 → Cociente entero: 10'
      },
      {
        name: 'Cociente 17 // 5',
        inputs: ['17', '5'],
        expectedOutputPattern: '(?:^|\\D)3(?:\\.0*)?(?:\\D|$)',
        description: 'Entradas: 17 y 5 → Cociente entero: 3'
      }
    ]
  },
  {
    id: 'tp_c_pr_07',
    type: 'coding',
    moduleId: 10,
    topic: 'Programación Práctica: Corregir suma de variables',
    title: 'Ejercicio 7: Corrección de variables inicializadas como texto',
    question: 'En el siguiente programa las variables val1 y val2 están escritas entre comillas como texto ("35" y "15"), haciendo que val1 + val2 dé "3515". Modificá el código para que las variables almacenen números enteros y print() muestre la suma matemática correcta (50).',
    starterCode: '# Ejercicio 7: Modificá las variables para que la suma sea matemática\nval1 = 35\nval2 = 15\nsuma = val1 + val2\nprint(suma)\n',
    points: 0.75,
    testCases: [
      {
        name: 'Suma matemática de 35 y 15',
        inputs: [],
        expectedOutputPattern: '(?:^|\\D)50(?:\\.0*)?(?:\\D|$)',
        description: 'Salida esperada: 50'
      }
    ]
  },
  {
    id: 'tp_c_pr_08',
    type: 'coding',
    moduleId: 6,
    topic: 'Programación Práctica: Costo total por cantidad',
    title: 'Ejercicio 8: Total de compra por cantidad',
    question: 'Pedí el precio unitario de un artículo con float(input()) y la cantidad comprada con int(input()). Calculá el costo total multiplicando precio * cantidad y mostrá el valor total con print().',
    starterCode: '# Ejercicio 8: Total de compra por cantidad\n# Leé precio con float(input()) y cantidad con int(input()), calculá precio * cantidad\n\nprecio = float(input("Precio unitario: "))\ncantidad = int(input("Cantidad: "))\n',
    points: 0.75,
    testCases: [
      {
        name: 'Precio 120, Cantidad 3',
        inputs: ['120', '3'],
        expectedOutputPattern: '(?:^|\\D)360(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 120, Cantidad: 3 → Total: 360'
      },
      {
        name: 'Precio 50, Cantidad 4',
        inputs: ['50', '4'],
        expectedOutputPattern: '(?:^|\\D)200(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 50, Cantidad: 4 → Total: 200'
      },
      {
        name: 'Precio 25, Cantidad 10',
        inputs: ['25', '10'],
        expectedOutputPattern: '(?:^|\\D)250(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 25, Cantidad: 10 → Total: 250'
      },
      {
        name: 'Precio 15, Cantidad 5',
        inputs: ['15', '5'],
        expectedOutputPattern: '(?:^|\\D)75(?:\\.0*)?(?:\\D|$)',
        description: 'Precio: 15, Cantidad: 5 → Total: 75'
      }
    ]
  }
];

// ============================================================================
// FUNCIONES DE SELECCIÓN Y GENERACIÓN DE PREGUNTAS
// ============================================================================

/**
 * Obtiene las preguntas del Trabajo Práctico adaptadas a la modalidad:
 * - Individual: 18 actividades (5 teoría + 4 interp. + 3 errores + 2 lógica + 4 código)
 * - En pareja: 36 actividades (10 teoría + 8 interp. + 6 errores + 4 lógica + 8 código)
 */
/**
 * Realiza un muestreo aleatorio sin reemplazo de un array (Fisher-Yates).
 * Si randomize es false, devuelve los primeros count elementos sin mezclar.
 */
function sampleWithoutReplacement<T>(arr: T[], count: number, randomize = true): T[] {
  if (!randomize) {
    return arr.slice(0, count);
  }
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Obtiene las preguntas del Trabajo Práctico adaptadas a la modalidad:
 * - Individual: exactamente 20 actividades (6 teoría + 4 interp. + 4 errores + 2 lógica + 4 código)
 * - En pareja: exactamente 40 actividades (12 teoría + 8 interp. + 8 errores + 4 lógica + 8 código)
 */
export function getPracticalWorkQuestions(
  model: TPModelType,
  modality: TPModality = 'individual',
  randomize = true
): ExamUnifiedQuestion[] {
  let theory: ExamUnifiedQuestion[];
  let interp: ExamUnifiedQuestion[];
  let errorDet: ExamUnifiedQuestion[];
  let mathLogic: ExamUnifiedQuestion[];
  let practical: ExamUnifiedQuestion[];

  switch (model) {
    case 'B':
      theory = MODEL_B_THEORY;
      interp = MODEL_B_INTERPRETATION;
      errorDet = MODEL_B_ERROR_DETECTION;
      mathLogic = MODEL_B_MATH_LOGIC;
      practical = MODEL_B_PRACTICAL;
      break;
    case 'C':
      theory = MODEL_C_THEORY;
      interp = MODEL_C_INTERPRETATION;
      errorDet = MODEL_C_ERROR_DETECTION;
      mathLogic = MODEL_C_MATH_LOGIC;
      practical = MODEL_C_PRACTICAL;
      break;
    case 'A':
    default:
      theory = MODEL_A_THEORY;
      interp = MODEL_A_INTERPRETATION;
      errorDet = MODEL_A_ERROR_DETECTION;
      mathLogic = MODEL_A_MATH_LOGIC;
      practical = MODEL_A_PRACTICAL;
      break;
  }

  if (modality === 'pareja') {
    // Exactamente 40 actividades evaluables en evaluación compartida:
    // 12 teoría + 8 interpretación + 8 detección de errores + 4 expresiones matemáticas y lógicas + 8 ejercicios prácticos
    return [
      ...sampleWithoutReplacement(theory, 12, randomize),      // 12 preguntas teóricas
      ...sampleWithoutReplacement(interp, 8, randomize),       // 8 interpretación de código
      ...sampleWithoutReplacement(errorDet, 8, randomize),     // 8 detección de errores (incluye los nuevos modelos)
      ...sampleWithoutReplacement(mathLogic, 4, randomize),    // 4 expresiones matemáticas y lógicas
      ...sampleWithoutReplacement(practical, 8, randomize)     // 8 ejercicios prácticos de programación
    ];
  }

  // Modalidad individual: Exactamente 20 actividades evaluables:
  // 6 teoría + 4 interpretación + 4 detección de errores + 2 expresiones matemáticas y lógicas + 4 ejercicios prácticos
  return [
    ...sampleWithoutReplacement(theory, 6, randomize),       // 6 preguntas teóricas
    ...sampleWithoutReplacement(interp, 4, randomize),        // 4 interpretación de código
    ...sampleWithoutReplacement(errorDet, 4, randomize),      // 4 detección de errores (incluye los nuevos modelos)
    ...sampleWithoutReplacement(mathLogic, 2, randomize),     // 2 expresiones matemáticas y lógicas
    ...sampleWithoutReplacement(practical, 4, randomize)      // 4 ejercicios prácticos de programación
  ];
}

/**
 * Selecciona aleatoriamente uno de los tres modelos disponibles (A, B o C)
 */
export function getRandomTPModel(): TPModelType {
  const models: TPModelType[] = ['A', 'B', 'C'];
  const randomIndex = Math.floor(Math.random() * models.length);
  return models[randomIndex];
}
