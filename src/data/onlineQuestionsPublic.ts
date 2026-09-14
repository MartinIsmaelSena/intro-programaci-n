import { PublicMatchQuestion } from '../types/onlineChallenge';

/**
 * Banco Integral de Preguntas para Desafíos en Línea — Banco Oficial Aprobado
 * Cobertura estructurada de los 15 módulos de "Python desde Cero" (8 preguntas por módulo = 120 preguntas).
 * No contiene respuestas correctas ni explicaciones (archivo público para clientes/alumnos).
 */
export const ONLINE_QUESTIONS_PUBLIC_BANK: PublicMatchQuestion[] = [
  // ==========================================
  // M1: INTRODUCCIÓN A LA PROGRAMACIÓN
  // ==========================================,
  {
    id: "duel_m01_q01",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Definición de programa",
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "¿Qué es un programa informático desde el punto de vista algorítmico?",
    options: [
      "Un conjunto de instrucciones secuenciales y ordenadas escritas para que una computadora resuelva un problema.",
      "Un componente físico dentro del procesador que almacena contraseñas de red.",
      "Un archivo de texto que solo contiene fórmulas matemáticas avanzadas sin instrucciones.",
      "Una pantalla gráfica donde el usuario únicamente visualiza videos.",
    ]
  },
  {
    id: "duel_m01_q02",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Secuencia de instrucciones",
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'error_detection',
    question: "¿Por qué falla el siguiente programa al ejecutarse?",
    codeSnippet: "print(precio)\nprecio = 250",
    options: [
      "Porque la función print() solo puede mostrar textos y no números.",
      "Porque la variable precio se intenta utilizar antes de haber sido creada y asignada.",
      "Porque el número 250 debe escribirse obligatoriamente con comillas dobles.",
      "Porque en Python no se pueden guardar números mayores a 100.",
    ]
  },
  {
    id: "duel_m01_q03",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Etapas Entrada-Proceso-Salida",
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "En un sistema de facturación, la acción de calcular el total a pagar sumando los precios de los artículos corresponde a la etapa de:",
    options: [
      "Entrada de datos.",
      "Salida de información.",
      "Proceso.",
      "Almacenamiento secundario permanente.",
    ]
  },
  {
    id: "duel_m01_q04",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Rol del intérprete de Python",
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "¿Cuál es la función principal del intérprete de Python?",
    options: [
      "Diseñar la interfaz visual y los colores de las ventanas del sistema operativo.",
      "Limpiar la memoria física de la computadora cuando se apaga.",
      "Corregir automáticamente la lógica de un algoritmo incorrecto.",
      "Leer, traducir y ejecutar las instrucciones del código fuente paso a paso.",
    ]
  },
  {
    id: "duel_m01_q05",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Determinismo en computación",
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "Si ejecutamos un programa cinco veces seguidas con exactamente los mismos valores de entrada, ¿qué comportamiento es el esperado?",
    options: [
      "Producirá exactamente el mismo resultado en las cinco ejecuciones.",
      "Producirá resultados distintos porque las computadoras varían su criterio en cada intento.",
      "Dará error a partir del tercer intento por sobrecarga de instrucciones repetidas.",
      "El resultado cambiará dependiendo de cuántas ventanas estén abiertas.",
    ]
  },
  {
    id: "duel_m01_q06",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Dependencia lógica en algoritmos",
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "Al diseñar un algoritmo para calcular el promedio de dos calificaciones, ¿qué paso debe realizarse obligatoriamente antes de calcular la suma?",
    options: [
      "Mostrar el resultado final en la pantalla.",
      "Obtener o ingresar los valores de las dos calificaciones.",
      "Dividir la suma por dos.",
      "Imprimir un mensaje de felicitación.",
    ]
  },
  {
    id: "duel_m01_q07",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Identificación de salida",
    difficulty: 'hard',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'concept',
    question: "En un programa que solicita el sueldo de un empleado, calcula una retención del 10% y muestra el sueldo neto en un recibo, ¿cuál es la Salida de información?",
    options: [
      "El sueldo bruto ingresado por teclado.",
      "El porcentaje del 10% utilizado en la fórmula matemática.",
      "El sueldo neto final exhibido en el recibo.",
      "La fórmula de cálculo interna de la retención.",
    ]
  },
  {
    id: "duel_m01_q08",
    moduleId: 1,
    topic: "Introducción a la programación",
    subtopic: "Orden cronológico estricto",
    difficulty: 'hard',
    category: 'intro',
    categoryLabel: "Introducción a la programación",
    type: 'error_detection',
    question: "Observá el siguiente bloque de código. ¿Qué problema presenta?",
    codeSnippet: "total = subtotal + envio\nsubtotal = 1000\nenvio = 200\nprint(total)",
    options: [
      "El operador + no funciona con números mayores a 500.",
      "Falta colocar paréntesis obligatorios alrededor de la suma en la primera línea.",
      "La instrucción print(total) debería estar ubicada al principio del programa.",
      "La variable total intenta sumar subtotal y envio antes de que ambas variables hayan sido creadas con sus valores.",
    ]
  },
  // ==========================================
  // M2: FUNDAMENTOS / ALGORITMOS
  // ==========================================,
  {
    id: "duel_m02_q01",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Propiedades de un algoritmo",
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'concept',
    question: "¿Cuál de las siguientes características es indispensable para que una secuencia de pasos sea considerada un algoritmo?",
    options: [
      "Debe ser precisa, ordenada y finalizar tras un número finito de pasos.",
      "Debe contener al menos 100 instrucciones distintas.",
      "Debe incluir obligatoriamente números decimales.",
      "Debe ejecutarse únicamente en internet.",
    ]
  },
  {
    id: "duel_m02_q02",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Precisión y ambigüedad",
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'concept',
    question: "¿Por qué una instrucción como 'revolver un rato hasta que quede bien' no es adecuada para un algoritmo computacional?",
    options: [
      "Porque usa letras en lugar de números.",
      "Porque es ambigua y no define con precisión la duración ni el criterio exacto de parada.",
      "Porque las computadoras no entienden verbos en infinitivo.",
      "Porque los algoritmos solo pueden resolver problemas bancarios.",
    ]
  },
  {
    id: "duel_m02_q03",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Seguimiento secuencial simple",
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'code_output',
    question: "¿Qué valor final imprime este algoritmo al completarse?",
    codeSnippet: "puntos = 10\npuntos = puntos + 5\npuntos = puntos * 2\nprint(puntos)",
    options: [
      "20",
      "25",
      "30",
      "15",
    ]
  },
  {
    id: "duel_m02_q04",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Detección de paso faltante",
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'concept',
    question: "Para calcular el promedio de tres exámenes se planearon los siguientes pasos:\n1. Ingresar nota 1, nota 2 y nota 3.\n2. Dividir el total obtenido entre 3.\n3. Mostrar el promedio.\n¿Qué paso indispensable falta entre el 1 y el 2?",
    options: [
      "Multiplicar las tres notas entre sí.",
      "Imprimir la nota 1 en pantalla.",
      "Restar nota 2 de nota 1.",
      "Sumar nota 1, nota 2 y nota 3 para obtener el total.",
    ]
  },
  {
    id: "duel_m02_q05",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Precondiciones de un problema",
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'concept',
    question: "En un algoritmo que calcula la velocidad promedio de un viaje dividiendo la distancia recorrida por el tiempo empleado, ¿cuál es una precondición crítica?",
    options: [
      "Que el tiempo empleado sea estrictamente mayor a cero.",
      "Que la distancia recorrida sea exactamente 100 kilómetros.",
      "Que el viaje se realice únicamente en automóvil.",
      "Que el tiempo esté expresado en números romanos.",
    ]
  },
  {
    id: "duel_m02_q06",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Seguimiento con dos variables",
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'code_output',
    question: "¿Qué valores finales se imprimen al concluir este algoritmo?",
    codeSnippet: "base = 4\naltura = 5\nsuperficie = base * altura\nprint(superficie)",
    options: [
      "9",
      "20",
      "45",
      "10",
    ]
  },
  {
    id: "duel_m02_q07",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Análisis de orden en cálculo comercial",
    difficulty: 'hard',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa al ejecutarse?",
    codeSnippet: "precio = 100\ndescuento = 20\nprecio_con_descuento = precio - descuento\nimpuesto = precio_con_descuento * 0.10\ntotal = precio_con_descuento + impuesto\nprint(total)",
    options: [
      "80.0",
      "90.0",
      "88.0",
      "110.0",
    ]
  },
  {
    id: "duel_m02_q08",
    moduleId: 2,
    topic: "Fundamentos / algoritmos",
    subtopic: "Inversión de lógica en algoritmo",
    difficulty: 'hard',
    category: 'foundations',
    categoryLabel: "Fundamentos / algoritmos",
    type: 'error_detection',
    question: "Un programador escribió este algoritmo para actualizar el stock tras una venta:\nstock = 50\nventa = 10\nstock = venta - stock\nprint(stock)\n¿Qué error de razonamiento cometió?",
    options: [
      "No se puede usar el operador de resta con números enteros.",
      "El stock inicial debería haber sido igual a cero.",
      "La variable venta debió nombrarse compra obligatoriamente.",
      "Restó el stock a la venta en lugar de restar la cantidad vendida al stock disponible.",
    ]
  },
  // ==========================================
  // M3: PRIMEROS PASOS CON PYTHON
  // ==========================================,
  {
    id: "duel_m03_q01",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Comentarios en Python",
    difficulty: 'easy',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'code_output',
    question: "¿Qué imprime este programa al ejecutarse?",
    codeSnippet: "# print(\"A\")\nprint(\"B\")\n# print(\"C\")",
    options: [
      "B",
      "A B C",
      "A\nB\nC",
      "# B",
    ]
  },
  {
    id: "duel_m03_q02",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Sensibilidad a mayúsculas",
    difficulty: 'easy',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "dato = 10\nDato = 20\nprint(dato)",
    options: [
      "20",
      "10",
      "30",
      "Error por nombre duplicado",
    ]
  },
  {
    id: "duel_m03_q03",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Extensión de archivos Python",
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'concept',
    question: "¿Cuál es la extensión estándar que deben tener los archivos de código fuente de Python para ser reconocidos y ejecutados?",
    options: [
      ".pyt",
      ".doc",
      ".py",
      ".exe",
    ]
  },
  {
    id: "duel_m03_q04",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Palabras reservadas",
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'error_detection',
    question: "¿Cuál de las siguientes líneas produce un error por intentar usar una palabra reservada del lenguaje como nombre de variable?",
    options: [
      "numero = 10",
      "valor_1 = 10",
      "dato_if = 10",
      "if = 10",
    ]
  },
  {
    id: "duel_m03_q05",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Comillas no cerradas",
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'error_detection',
    question: "¿Qué tipo de error se produce al intentar ejecutar la siguiente instrucción?",
    codeSnippet: "print(\"Bienvenidos al curso)",
    options: [
      "Un error de sintaxis porque la cadena de texto no cierra sus comillas.",
      "Un error aritmético de división por cero.",
      "No produce ningún error y muestra el texto normalmente.",
      "Un error porque print debe escribirse siempre en mayúsculas.",
    ]
  },
  {
    id: "duel_m03_q06",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Modo interactivo vs script",
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'concept',
    question: "¿Cuál es la diferencia principal entre ejecutar instrucciones en la consola interactiva de Python y guardarlas en un archivo .py?",
    options: [
      "La consola interactiva solo permite usar números decimales y los archivos .py no.",
      "En el archivo .py las instrucciones quedan guardadas para volver a ejecutarse cuantas veces sea necesario.",
      "Los archivos .py no pueden usar la función print().",
      "La consola interactiva borra el sistema operativo al cerrarse.",
    ]
  },
  {
    id: "duel_m03_q07",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Comentarios intercalados",
    difficulty: 'hard',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'code_output',
    question: "¿Qué salida produce exactamente el siguiente fragmento?",
    codeSnippet: "a = 5\n# a = a + 10\na = a * 2\n# print(a)\nprint(a)",
    options: [
      "30",
      "5",
      "10",
      "20",
    ]
  },
  {
    id: "duel_m03_q08",
    moduleId: 3,
    topic: "Primeros pasos con Python",
    subtopic: "Espacios en nombres de variables",
    difficulty: 'hard',
    category: 'python_basics',
    categoryLabel: "Primeros pasos con Python",
    type: 'error_detection',
    question: "¿Por qué la siguiente instrucción genera un error de sintaxis en Python?",
    codeSnippet: "mi puntaje = 100",
    options: [
      "Porque el valor 100 es demasiado grande para una variable.",
      "Porque falta colocar comillas dobles alrededor de 100.",
      "Porque la palabra 'mi' está prohibida en Python.",
      "Porque los nombres de variables no pueden contener espacios en blanco en su interior.",
    ]
  },
  // ==========================================
  // M4: VARIABLES
  // ==========================================,
  {
    id: "duel_m04_q01",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Concepto de variable",
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'concept',
    question: "¿Qué es una variable en programación?",
    options: [
      "Un espacio con nombre reservado en la memoria para almacenar un dato que puede cambiar a lo largo del programa.",
      "Un cable interno de la computadora que conecta el monitor con el teclado.",
      "Una función fija que siempre muestra el mismo texto en pantalla.",
      "Un error grave que congela el sistema operativo.",
    ]
  },
  {
    id: "duel_m04_q02",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Asignación simple",
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'code_output',
    question: "¿Qué valor almacena la variable x tras ejecutarse estas líneas?",
    codeSnippet: "x = 15\nprint(x)",
    options: [
      "x",
      "15",
      "\"15\"",
      "0",
    ]
  },
  {
    id: "duel_m04_q03",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Sobrescritura destructiva",
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa al finalizar?",
    codeSnippet: "valor = 50\nvalor = 80\nvalor = 20\nprint(valor)",
    options: [
      "50",
      "80",
      "20",
      "150",
    ]
  },
  {
    id: "duel_m04_q04",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Nombre de variable inválido",
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'error_detection',
    question: "¿Cuál de los siguientes nombres NO es válido para una variable en Python y provocará un error de sintaxis?",
    options: [
      "primer_puesto",
      "_puesto1",
      "puesto_1",
      "1er_puesto",
    ]
  },
  {
    id: "duel_m04_q05",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Copia de valor entre variables",
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "a = 10\nb = a\na = 99\nprint(b)",
    options: [
      "10",
      "99",
      "a",
      "Error",
    ]
  },
  {
    id: "duel_m04_q06",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Variable no inicializada",
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'error_detection',
    question: "¿Qué sucede si ejecutamos la siguiente línea de código?",
    codeSnippet: "x = y + 5",
    options: [
      "Python le asigna automáticamente a y el valor cero y continúa.",
      "Si la variable y no fue creada previamente, se produce un error porque Python no conoce su valor.",
      "La variable x toma el valor 5 y la y se borra de la memoria.",
      "El programa imprime 5 en la pantalla sin problemas.",
    ]
  },
  {
    id: "duel_m04_q07",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Intercambio clásico con variable auxiliar",
    difficulty: 'hard',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'code_output',
    question: "¿Qué valores se imprimen al concluir el siguiente código?",
    codeSnippet: "x = 3\ny = 8\naux = x\nx = y\ny = aux\nprint(x, y)",
    options: [
      "3 8",
      "8 8",
      "8 3",
      "3 3",
    ]
  },
  {
    id: "duel_m04_q08",
    moduleId: 4,
    topic: "Variables",
    subtopic: "Seguimiento acumulativo",
    difficulty: 'hard',
    category: 'variables',
    categoryLabel: "Variables",
    type: 'code_output',
    question: "¿Qué valor imprime la variable cuenta al final de este bloque?",
    codeSnippet: "cuenta = 100\ncuenta = cuenta - 30\ncuenta = cuenta + 10\ncuenta = cuenta - 5\nprint(cuenta)",
    options: [
      "85",
      "70",
      "100",
      "75",
    ]
  },
  // ==========================================
  // M5: TIPOS DE DATOS
  // ==========================================,
  {
    id: "duel_m05_q01",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Identificación de entero (int)",
    difficulty: 'easy',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'concept',
    question: "¿A qué tipo de dato pertenece el valor 42 en Python?",
    options: [
      "int (número entero)",
      "str (cadena de texto)",
      "float (número decimal)",
      "bool (booleano)",
    ]
  },
  {
    id: "duel_m05_q02",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Identificación de decimal (float)",
    difficulty: 'easy',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'concept',
    question: "¿Cómo representa Python a los números que tienen punto decimal como 3.14 o 0.5?",
    options: [
      "int (enteros)",
      "float (números de punto flotante)",
      "str (texto)",
      "char (carácter simple)",
    ]
  },
  {
    id: "duel_m05_q03",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Texto vs Número",
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'concept',
    question: "¿Cuál es la diferencia fundamental entre el valor 100 y el valor \"100\" en Python?",
    options: [
      "Son exactamente lo mismo y ocupan el mismo espacio en memoria.",
      "\"100\" es un número decimal y 100 es una palabra.",
      "100 es un número entero con el que se pueden hacer cálculos y \"100\" es una cadena de texto (str).",
      "El valor 100 da error si se intenta imprimir.",
    ]
  },
  {
    id: "duel_m05_q04",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Función type()",
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'code_output',
    question: "¿Qué muestra la siguiente instrucción al ejecutarse?",
    codeSnippet: "print(type(True))",
    options: [
      "<class 'int'>",
      "<class 'str'>",
      "True",
      "<class 'bool'>",
    ]
  },
  {
    id: "duel_m05_q05",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Mayúsculas en booleanos",
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'error_detection',
    question: "¿Por qué la siguiente instrucción genera un error en Python?",
    codeSnippet: "activo = true",
    options: [
      "Porque en Python los valores booleanos deben escribirse obligatoriamente con la primera letra en mayúscula: True y False.",
      "Porque las variables no pueden almacenar respuestas afirmativas.",
      "Porque la palabra true debe escribirse obligatoriamente entre comillas.",
      "Porque faltan los dos puntos al final.",
    ]
  },
  {
    id: "duel_m05_q06",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Concatenación de texto",
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "a = \"20\"\nb = \"30\"\nprint(a + b)",
    options: [
      "50",
      "2030",
      "\"50\"",
      "Error por sumar comillas",
    ]
  },
  {
    id: "duel_m05_q07",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Error al sumar texto y número",
    difficulty: 'hard',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'error_detection',
    question: "¿Qué ocurre al ejecutar la siguiente línea de código?",
    codeSnippet: "resultado = \"Puntos: \" + 50",
    options: [
      "El programa imprime: Puntos: 50 sin ningún problema.",
      "La variable resultado queda con el valor numérico 50.",
      "Se produce un error de tipo (TypeError) porque Python no permite concatenar directamente texto con un número entero.",
      "Python convierte automáticamente el texto a número y da 55.",
    ]
  },
  {
    id: "duel_m05_q08",
    moduleId: 5,
    topic: "Tipos de datos",
    subtopic: "Tipado dinámico",
    difficulty: 'hard',
    category: 'data_types',
    categoryLabel: "Tipos de datos",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "x = 10\nx = \"Hola\"\nprint(x)",
    options: [
      "10",
      "10 Hola",
      "Error de tipos",
      "Hola",
    ]
  },
  // ==========================================
  // M6: OPERADORES ARITMÉTICOS
  // ==========================================,
  {
    id: "duel_m06_q01",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Suma y resta básicas",
    difficulty: 'easy',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué imprime este programa?",
    codeSnippet: "a = 15\nb = 7\nprint(a - b)",
    options: [
      "8",
      "22",
      "-8",
      "7",
    ]
  },
  {
    id: "duel_m06_q02",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Multiplicación",
    difficulty: 'easy',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué operador se utiliza en Python para multiplicar dos números?",
    options: [
      "La letra x",
      "El asterisco (*)",
      "El punto (.)",
      "El signo numeral (#)",
    ]
  },
  {
    id: "duel_m06_q03",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "División real (/)",
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué imprime exactamente la siguiente operación?",
    codeSnippet: "print(7 / 2)",
    options: [
      "3",
      "3.0",
      "3.5",
      "3 resto 1",
    ]
  },
  {
    id: "duel_m06_q04",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "División entera (//)",
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué imprime la siguiente instrucción al ejecutarse?",
    codeSnippet: "print(14 // 3)",
    options: [
      "4.66",
      "2",
      "5",
      "4",
    ]
  },
  {
    id: "duel_m06_q05",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Operador módulo (%)",
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué resultado numérico produce la siguiente expresión?",
    codeSnippet: "print(19 % 4)",
    options: [
      "3",
      "4",
      "4.75",
      "1",
    ]
  },
  {
    id: "duel_m06_q06",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Precedencia estándar",
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué valor imprime la siguiente expresión matemática?",
    codeSnippet: "print(2 + 3 * 4)",
    options: [
      "20",
      "14",
      "24",
      "9",
    ]
  },
  {
    id: "duel_m06_q07",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Uso de paréntesis",
    difficulty: 'hard',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué imprime este código donde se utilizan paréntesis?",
    codeSnippet: "print((2 + 3) * 4)",
    options: [
      "14",
      "24",
      "20",
      "11",
    ]
  },
  {
    id: "duel_m06_q08",
    moduleId: 6,
    topic: "Operadores aritméticos",
    subtopic: "Operación combinada con módulo y división entera",
    difficulty: 'hard',
    category: 'arithmetic',
    categoryLabel: "Operadores aritméticos",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "x = 23 % 5 + 10 // 3\nprint(x)",
    options: [
      "7",
      "8",
      "5",
      "6",
    ]
  },
  // ==========================================
  // M7: OPERADORES DE COMPARACIÓN
  // ==========================================,
  {
    id: "duel_m07_q01",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Igualdad vs Asignación",
    difficulty: 'easy',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'concept',
    question: "¿Qué diferencia existe entre los operadores = y == en Python?",
    options: [
      "= se usa para asignar un valor a una variable y == se usa para comparar si dos valores son iguales.",
      "= compara números y == compara textos.",
      "Son exactamente iguales y pueden usarse indistintamente.",
      "== borra el contenido de una variable y = la crea.",
    ]
  },
  {
    id: "duel_m07_q02",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Operador de desigualdad (!=)",
    difficulty: 'easy',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué resultado booleano imprime la siguiente comparación?",
    codeSnippet: "print(10 != 10)",
    options: [
      "True",
      "False",
      "Error",
      "None",
    ]
  },
  {
    id: "duel_m07_q03",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Menor o igual (<=)",
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué imprime la siguiente comparación al ejecutarse?",
    codeSnippet: "print(15 <= 15)",
    options: [
      "False",
      "15",
      "True",
      "Error",
    ]
  },
  {
    id: "duel_m07_q04",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Mayor estricto (>)",
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "a = 8\nb = 12\nprint(a > b)",
    options: [
      "True",
      "8",
      "12",
      "False",
    ]
  },
  {
    id: "duel_m07_q05",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Error al usar = en condición",
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'error_detection',
    question: "¿Por qué la siguiente instrucción produce un SyntaxError si la intención era verificar si x vale 5?",
    codeSnippet: "print(x = 5)",
    options: [
      "Porque para comparar igualdad se debe utilizar el operador doble == y no el de asignación =.",
      "Porque print no puede mostrar comparaciones.",
      "Porque el número 5 debe ir entre comillas obligatoriamente.",
      "Porque las variables solo pueden compararse con letras.",
    ]
  },
  {
    id: "duel_m07_q06",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Comparación de cadenas",
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué resultado booleano imprime la siguiente comparación entre cadenas?",
    codeSnippet: "print(\"Python\" == \"python\")",
    options: [
      "True",
      "False",
      "Error",
      "None",
    ]
  },
  {
    id: "duel_m07_q07",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Comparación con cálculo previo",
    difficulty: 'hard',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "total = 25\nprint(total % 2 == 0)",
    options: [
      "True",
      "0",
      "False",
      "1",
    ]
  },
  {
    id: "duel_m07_q08",
    moduleId: 7,
    topic: "Operadores de comparación",
    subtopic: "Comparaciones múltiples de variables",
    difficulty: 'hard',
    category: 'comparison',
    categoryLabel: "Operadores de comparación",
    type: 'code_output',
    question: "¿Qué valor imprime este fragmento?",
    codeSnippet: "x = 10\ny = 20\nresultado = (x + 10) == y\nprint(resultado)",
    options: [
      "False",
      "20",
      "Error",
      "True",
    ]
  },
  // ==========================================
  // M8: OPERADORES LÓGICOS
  // ==========================================,
  {
    id: "duel_m08_q01",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Regla del operador and",
    difficulty: 'easy',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'concept',
    question: "¿Cuándo una expresión que utiliza el operador lógico and da como resultado True?",
    options: [
      "Únicamente cuando ambas condiciones que une son verdaderas (True).",
      "Cuando al menos una de las dos condiciones es verdadera.",
      "Cuando ambas condiciones son falsas.",
      "Solo cuando se comparan números positivos.",
    ]
  },
  {
    id: "duel_m08_q02",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Regla del operador or",
    difficulty: 'easy',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'concept',
    question: "¿Cuándo una expresión con el operador lógico or resulta True?",
    options: [
      "Únicamente cuando ambas condiciones son falsas.",
      "Con que al menos una de las condiciones sea verdadera (True).",
      "Solo cuando ambas condiciones son exactamente idénticas.",
      "Nunca da True con variables numéricas.",
    ]
  },
  {
    id: "duel_m08_q03",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Operador not",
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué imprime la siguiente instrucción booleana?",
    codeSnippet: "print(not False)",
    options: [
      "False",
      "None",
      "True",
      "Error",
    ]
  },
  {
    id: "duel_m08_q04",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Evaluación con and",
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué valor imprime la siguiente expresión?",
    codeSnippet: "edad = 16\ntiene_permiso = True\nprint(edad >= 18 and tiene_permiso)",
    options: [
      "True",
      "None",
      "16",
      "False",
    ]
  },
  {
    id: "duel_m08_q05",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Evaluación con or",
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué imprime este programa?",
    codeSnippet: "es_socio = False\ntiene_cupon = True\nprint(es_socio or tiene_cupon)",
    options: [
      "True",
      "False",
      "None",
      "Error",
    ]
  },
  {
    id: "duel_m08_q06",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Negación con comparación",
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué imprime la siguiente expresión lógica combinada?",
    codeSnippet: "print(not (5 > 10))",
    options: [
      "False",
      "True",
      "10",
      "Error",
    ]
  },
  {
    id: "duel_m08_q07",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Rango numérico con and",
    difficulty: 'hard',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué salida produce el siguiente código?",
    codeSnippet: "nota = 7\nesta_aprobado = nota >= 4 and nota <= 10\nprint(esta_aprobado)",
    options: [
      "False",
      "7",
      "True",
      "4",
    ]
  },
  {
    id: "duel_m08_q08",
    moduleId: 8,
    topic: "Operadores lógicos",
    subtopic: "Combinación lógica con paréntesis",
    difficulty: 'hard',
    category: 'logical',
    categoryLabel: "Operadores lógicos",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "a = True\nb = False\nc = False\nprint((a or b) and (not c))",
    options: [
      "False",
      "None",
      "Error",
      "True",
    ]
  },
  // ==========================================
  // M9: PRINT()
  // ==========================================,
  {
    id: "duel_m09_q01",
    moduleId: 9,
    topic: "print()",
    subtopic: "Texto literal entre comillas",
    difficulty: 'easy',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué texto se muestra en la consola al ejecutar esta instrucción?",
    codeSnippet: "print(\"Hola Mundo\")",
    options: [
      "Hola Mundo",
      "\"Hola Mundo\"",
      "HolaMundo",
      "print(Hola Mundo)",
    ]
  },
  {
    id: "duel_m09_q02",
    moduleId: 9,
    topic: "print()",
    subtopic: "Variable sin comillas",
    difficulty: 'easy',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "mensaje = \"Bienvenido\"\nprint(mensaje)",
    options: [
      "mensaje",
      "Bienvenido",
      "\"mensaje\"",
      "\"Bienvenido\"",
    ]
  },
  {
    id: "duel_m09_q03",
    moduleId: 9,
    topic: "print()",
    subtopic: "Múltiples argumentos con coma",
    difficulty: 'medium',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué imprime exactamente la siguiente instrucción con dos argumentos?",
    codeSnippet: "print(\"Total:\", 50)",
    options: [
      "Total:50",
      "Total:, 50",
      "Total: 50",
      "Total: (50)",
    ]
  },
  {
    id: "duel_m09_q04",
    moduleId: 9,
    topic: "print()",
    subtopic: "Variable vs Literal homónimo",
    difficulty: 'medium',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué imprime este programa?",
    codeSnippet: "x = 5\nprint(\"x\")\nprint(x)",
    options: [
      "5\nx",
      "5\n5",
      "x\nx",
      "x\n5",
    ]
  },
  {
    id: "duel_m09_q05",
    moduleId: 9,
    topic: "print()",
    subtopic: "Dos prints sucesivos",
    difficulty: 'medium',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué salida visual produce la ejecución de estas dos líneas consecutivas?",
    codeSnippet: "print(\"Línea 1\")\nprint(\"Línea 2\")",
    options: [
      "Muestra cada mensaje en una línea diferente, uno debajo del otro.",
      "Muestra ambos textos pegados en el mismo renglón.",
      "Muestra únicamente el segundo mensaje borrando el primero.",
      "Produce un error porque no se pueden poner dos prints seguidos.",
    ]
  },
  {
    id: "duel_m09_q06",
    moduleId: 9,
    topic: "print()",
    subtopic: "Error por paréntesis no cerrado",
    difficulty: 'medium',
    category: 'print',
    categoryLabel: "print()",
    type: 'error_detection',
    question: "¿Qué error arroja Python al intentar ejecutar esta instrucción?",
    codeSnippet: "print(\"Hola\"",
    options: [
      "Python lo completa automáticamente y funciona.",
      "Se produce un error de sintaxis (SyntaxError) porque falta el paréntesis de cierre.",
      "Se imprime Hola con un paréntesis al final.",
      "El programa espera a que el usuario presione una tecla.",
    ]
  },
  {
    id: "duel_m09_q07",
    moduleId: 9,
    topic: "print()",
    subtopic: "Texto fijo con cálculo adentro",
    difficulty: 'hard',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué imprime la siguiente instrucción que combina texto y cálculo?",
    codeSnippet: "print(\"Resultado:\", 10 * 3 + 2)",
    options: [
      "Resultado: 10 * 3 + 2",
      "Resultado: 50",
      "Resultado: 32",
      "Resultado:32",
    ]
  },
  {
    id: "duel_m09_q08",
    moduleId: 9,
    topic: "print()",
    subtopic: "Seguimiento de mensajes de estado",
    difficulty: 'hard',
    category: 'print',
    categoryLabel: "print()",
    type: 'code_output',
    question: "¿Qué imprime el siguiente fragmento de código?",
    codeSnippet: "vidas = 3\nprint(\"Inicio con:\", vidas)\nvidas = vidas - 1\nprint(\"Quedan:\", vidas)",
    options: [
      "Inicio con: 3\nQuedan: 3",
      "Inicio con: 2\nQuedan: 2",
      "Inicio con:vidas\nQuedan:vidas",
      "Inicio con: 3\nQuedan: 2",
    ]
  },
  // ==========================================
  // M10: INPUT() Y CONVERSIÓN
  // ==========================================,
  {
    id: "duel_m10_q01",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Tipo de retorno de input()",
    difficulty: 'easy',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'concept',
    question: "¿De qué tipo de dato es SIEMPRE el valor retornado por la función input() en Python?",
    options: [
      "str (cadena de texto)",
      "int (número entero)",
      "float (número decimal)",
      "Depende de si el usuario escribió números o letras",
    ]
  },
  {
    id: "duel_m10_q02",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Propósito del mensaje prompt",
    difficulty: 'easy',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'concept',
    question: "¿Qué función cumple el texto que se escribe dentro del paréntesis en: nombre = input(\"Ingrese su nombre: \")?",
    options: [
      "Es el valor por defecto que se guarda si el usuario no escribe nada.",
      "Es un mensaje orientativo (prompt) que se muestra en pantalla para que el usuario sepa qué escribir.",
      "Es una contraseña que valida la entrada del usuario.",
      "Es el nombre interno de la variable en memoria.",
    ]
  },
  {
    id: "duel_m10_q03",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Concatenación por omisión de conversión",
    difficulty: 'medium',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'code_output',
    question: "Si el usuario escribe 4 y luego escribe 5, ¿qué se muestra en pantalla?",
    codeSnippet: "a = input()\nb = input()\nprint(a + b)",
    options: [
      "9",
      "4 5",
      "45",
      "Error de tipos",
    ]
  },
  {
    id: "duel_m10_q04",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Conversión con int()",
    difficulty: 'medium',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'code_output',
    question: "Si el usuario ingresa 6 y luego ingresa 7, ¿qué imprime este programa?",
    codeSnippet: "x = int(input())\ny = int(input())\nprint(x * y)",
    options: [
      "67",
      "6666666",
      "Error",
      "42",
    ]
  },
  {
    id: "duel_m10_q05",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Conversión a float",
    difficulty: 'medium',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'concept',
    question: "Si un programa necesita pedirle al usuario su peso en kilogramos con decimales (por ejemplo 72.5), ¿qué función de conversión debe utilizarse?",
    options: [
      "float(input(...))",
      "int(input(...))",
      "str(input(...))",
      "bool(input(...))",
    ]
  },
  {
    id: "duel_m10_q06",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Error al operar input directo con número",
    difficulty: 'medium',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'error_detection',
    question: "¿Por qué se produce un error en la segunda línea de este código?",
    codeSnippet: "edad = input(\"Tu edad: \")\nsiguiente = edad + 1",
    options: [
      "Porque a la variable edad no se le pueden sumar números impares.",
      "Porque intenta sumar un texto (str retornado por input) con un número entero (int).",
      "Porque la función input solo acepta nombres de personas.",
      "Porque el operador + no está permitido en Python después de un input.",
    ]
  },
  {
    id: "duel_m10_q07",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Error al convertir texto con letras con int()",
    difficulty: 'hard',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'error_detection',
    question: "¿Qué ocurre si el usuario escribe la palabra 'cinco' al ejecutarse esta instrucción?",
    codeSnippet: "n = int(input(\"Número: \"))",
    options: [
      "Python lo traduce automáticamente al número 5.",
      "La variable n queda con valor 0 por defecto.",
      "Se produce un error de ejecución porque int() no puede convertir palabras con letras a números enteros.",
      "La variable n guarda la palabra 'cinco'.",
    ]
  },
  {
    id: "duel_m10_q08",
    moduleId: 10,
    topic: "input() y conversión",
    subtopic: "Cálculo de edad futura",
    difficulty: 'hard',
    category: 'input',
    categoryLabel: "input() y conversión",
    type: 'code_output',
    question: "Si el usuario escribe 15, ¿qué salida muestra este programa?",
    codeSnippet: "edad = int(input())\nedad_proxima = edad + 1\nprint(\"El año próximo tendrás:\", edad_proxima)",
    options: [
      "El año próximo tendrás: 151",
      "El año próximo tendrás: 15",
      "Error de tipos",
      "El año próximo tendrás: 16",
    ]
  },
  // ==========================================
  // M11: IF / ELIF / ELSE
  // ==========================================,
  {
    id: "duel_m11_q01",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Condicional simple verdadero",
    difficulty: 'easy',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "puntos = 120\nif puntos > 100:\n    print(\"Nivel superado\")",
    options: [
      "Nivel superado",
      "puntos",
      "120",
      "No imprime nada",
    ]
  },
  {
    id: "duel_m11_q02",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Condicional simple falso",
    difficulty: 'easy',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "puntos = 80\nif puntos > 100:\n    print(\"Nivel superado\")\nprint(\"Fin del juego\")",
    options: [
      "Nivel superado\nFin del juego",
      "Fin del juego",
      "Nivel superado",
      "No imprime nada",
    ]
  },
  {
    id: "duel_m11_q03",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Condicional if/else y actualización de saldo (Pregunta 19)",
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa al ejecutarse?",
    codeSnippet: "saldo = 500\ncompra = 300\nif compra <= saldo:\n    saldo = saldo - compra\n    print(\"Compra exitosa, saldo:\", saldo)\nelse:\n    print(\"Saldo insuficiente\")",
    options: [
      "Compra exitosa, saldo: 500",
      "Saldo insuficiente",
      "Compra exitosa, saldo: 200",
      "Compra exitosa, saldo: 300",
    ]
  },
  {
    id: "duel_m11_q04",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Ejecución de la rama else",
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime este programa?",
    codeSnippet: "temperatura = 10\nif temperatura >= 20:\n    print(\"Templado\")\nelse:\n    print(\"Fresco\")",
    options: [
      "Templado",
      "Templado\nFresco",
      "10",
      "Fresco",
    ]
  },
  {
    id: "duel_m11_q05",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Estructura if / elif / else",
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "nota = 7\nif nota >= 9:\n    print(\"Excelente\")\nelif nota >= 6:\n    print(\"Aprobado\")\nelse:\n    print(\"Desaprobado\")",
    options: [
      "Aprobado",
      "Excelente",
      "Desaprobado",
      "Excelente\nAprobado",
    ]
  },
  {
    id: "duel_m11_q06",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Error por omisión de dos puntos (:)",
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'error_detection',
    question: "¿Qué error de sintaxis presenta la primera línea de este condicional?",
    codeSnippet: "if edad >= 18\n    print(\"Mayor de edad\")",
    options: [
      "La palabra if debe escribirse con mayúscula (If).",
      "Falta colocar los dos puntos (:) obligatorios al final de la línea del if.",
      "No se puede usar el operador >= dentro de un condicional.",
      "La variable edad debe ir entre comillas.",
    ]
  },
  {
    id: "duel_m11_q07",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Error de indentación",
    difficulty: 'hard',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'error_detection',
    question: "¿Qué error arroja Python al intentar ejecutar este código?",
    codeSnippet: "x = 10\nif x > 5:\nprint(\"Mayor\")",
    options: [
      "NameError: la variable x no está definida.",
      "TypeError: no se puede comparar números con 5.",
      "IndentationError: las instrucciones dentro del bloque if deben estar indentadas con sangría.",
      "No produce ningún error y funciona.",
    ]
  },
  {
    id: "duel_m11_q08",
    moduleId: 11,
    topic: "if / elif / else",
    subtopic: "Condicionales anidados",
    difficulty: 'hard',
    category: 'conditionals',
    categoryLabel: "if / elif / else",
    type: 'code_output',
    question: "¿Qué imprime este programa con condicionales anidados?",
    codeSnippet: "es_fin_de_semana = True\nhay_sol = False\nif es_fin_de_semana:\n    if hay_sol:\n        print(\"Playa\")\n    else:\n        print(\"Cine\")\nelse:\n    print(\"Trabajar\")",
    options: [
      "Playa",
      "Trabajar",
      "Playa\nCine",
      "Cine",
    ]
  },
  // ==========================================
  // M12: INTRODUCCIÓN A BUCLES
  // ==========================================,
  {
    id: "duel_m12_q01",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Concepto de bucle",
    difficulty: 'easy',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'concept',
    question: "¿Cuál es el objetivo principal de una estructura repetitiva o bucle en programación?",
    options: [
      "Ejecutar un bloque de instrucciones múltiples veces sin necesidad de repetir el código manualmente.",
      "Borrar la memoria de la computadora cada vez que termina un cálculo.",
      "Convertir automáticamente números enteros a palabras en inglés.",
      "Impedir que el usuario ingrese datos por teclado.",
    ]
  },
  {
    id: "duel_m12_q02",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Condición de fin de ciclo",
    difficulty: 'easy',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'concept',
    question: "Para que un ciclo repetitivo pueda finalizar correctamente, ¿qué requisito debe cumplirse?",
    options: [
      "El programa debe tener al menos diez variables de nombres distintos.",
      "Debe existir una condición que en algún momento pase a ser falsa o se alcance un límite definido de vueltas.",
      "Debe llamarse a la función print() exactamente tres veces.",
      "Debe apagarse el monitor de la computadora.",
    ]
  },
  {
    id: "duel_m12_q03",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Bucle infinito",
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'concept',
    question: "¿A qué se llama 'bucle infinito' en programación?",
    options: [
      "A un bucle que resuelve problemas matemáticos de números muy grandes.",
      "A un ciclo que se ejecuta exactamente 100 veces por segundo.",
      "A un ciclo que nunca se detiene porque su condición de parada nunca se cumple.",
      "A un programa que no tiene ninguna variable.",
    ]
  },
  {
    id: "duel_m12_q04",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Variable de control",
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'concept',
    question: "¿Qué función cumple habitualmente una variable 'contador' asociada a un bucle?",
    options: [
      "Ocultar las contraseñas del usuario en la memoria.",
      "Multiplicar los resultados por 100 de forma automática.",
      "Impedir que el código use condicionales.",
      "Llevar la cuenta de la cantidad de repeticiones y ayudar a controlar cuándo debe detenerse el ciclo.",
    ]
  },
  {
    id: "duel_m12_q05",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Instrucción fuera del ciclo",
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'code_output',
    question: "¿Cuántas veces se imprimirá la palabra 'Listo' en este código?",
    codeSnippet: "for i in range(3):\n    print(\"Paso\")\nprint(\"Listo\")",
    options: [
      "1 sola vez",
      "3 veces",
      "Ninguna vez",
      "4 veces",
    ]
  },
  {
    id: "duel_m12_q06",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Ciclo que no llega a ejecutarse",
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "x = 10\nwhile x < 5:\n    print(\"Adentro\")\n    x = x + 1\nprint(\"Afuera\")",
    options: [
      "Adentro\nAfuera",
      "Afuera",
      "Adentro",
      "No imprime nada",
    ]
  },
  {
    id: "duel_m12_q07",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Conteo de iteraciones",
    difficulty: 'hard',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'code_output',
    question: "¿Cuántas líneas de salida genera este fragmento?",
    codeSnippet: "contador = 0\nwhile contador < 4:\n    print(\"Hola\")\n    contador = contador + 1",
    options: [
      "3 líneas",
      "5 líneas",
      "4 líneas",
      "1 línea",
    ]
  },
  {
    id: "duel_m12_q08",
    moduleId: 12,
    topic: "Introducción a bucles",
    subtopic: "Valor del contador al salir",
    difficulty: 'hard',
    category: 'loops_intro',
    categoryLabel: "Introducción a bucles",
    type: 'code_output',
    question: "¿Qué valor final imprime la variable i al terminar este ciclo?",
    codeSnippet: "i = 1\nwhile i <= 3:\n    i = i + 1\nprint(i)",
    options: [
      "3",
      "1",
      "2",
      "4",
    ]
  },
  // ==========================================
  // M13: FOR / RANGE
  // ==========================================,
  {
    id: "duel_m13_q01",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Valores generados por range(n)",
    difficulty: 'easy',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué valores toma la variable i durante este bucle?",
    codeSnippet: "for i in range(3):\n    print(i)",
    options: [
      "0, 1, 2 (uno por línea)",
      "1, 2, 3",
      "0, 1, 2, 3",
      "3 veces el número 3",
    ]
  },
  {
    id: "duel_m13_q02",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Cantidad de vueltas con range()",
    difficulty: 'easy',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Cuántas veces se imprimirá la palabra 'Gol' en este programa?",
    codeSnippet: "for k in range(5):\n    print(\"Gol\")",
    options: [
      "4 veces",
      "5 veces",
      "6 veces",
      "1 sola vez",
    ]
  },
  {
    id: "duel_m13_q03",
    moduleId: 13,
    topic: "for / range",
    subtopic: "range(inicio, fin)",
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué imprime el siguiente código?",
    codeSnippet: "for num in range(2, 5):\n    print(num)",
    options: [
      "2\n3\n4\n5",
      "1\n2\n3\n4",
      "2\n3\n4",
      "5\n4\n3\n2",
    ]
  },
  {
    id: "duel_m13_q04",
    moduleId: 13,
    topic: "for / range",
    subtopic: "range(inicio, fin, paso)",
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué números se imprimen al ejecutar este bucle?",
    codeSnippet: "for x in range(1, 8, 2):\n    print(x)",
    options: [
      "1\n2\n3\n4\n5\n6\n7",
      "2\n4\n6\n8",
      "1\n3\n5",
      "1\n3\n5\n7",
    ]
  },
  {
    id: "duel_m13_q05",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Acumulador en bucle for",
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué imprime este programa al terminar?",
    codeSnippet: "suma = 0\nfor i in range(1, 4):\n    suma = suma + i\nprint(suma)",
    options: [
      "6",
      "10",
      "3",
      "4",
    ]
  },
  {
    id: "duel_m13_q06",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Error de sintaxis en cabecera for",
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'error_detection',
    question: "¿Por qué arroja un error de sintaxis la primera línea de este bucle?",
    codeSnippet: "for i in range(5)\n    print(i)",
    options: [
      "La variable i debe declararse antes del bucle obligatoriamente.",
      "Falta colocar los dos puntos (:) obligatorios al final de la línea del for.",
      "La función range solo acepta dos argumentos.",
      "No se puede usar la letra i como nombre de variable.",
    ]
  },
  {
    id: "duel_m13_q07",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Multiplicador acumulado",
    difficulty: 'hard',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué valor imprime la variable producto al concluir este programa?",
    codeSnippet: "producto = 1\nfor factor in range(1, 5):\n    producto = producto * factor\nprint(producto)",
    options: [
      "10",
      "12",
      "24",
      "120",
    ]
  },
  {
    id: "duel_m13_q08",
    moduleId: 13,
    topic: "for / range",
    subtopic: "Filtrado condicional dentro del for",
    difficulty: 'hard',
    category: 'loops_for',
    categoryLabel: "for / range",
    type: 'code_output',
    question: "¿Qué imprime este código?",
    codeSnippet: "contador_pares = 0\nfor n in range(1, 6):\n    if n % 2 == 0:\n        contador_pares = contador_pares + 1\nprint(contador_pares)",
    options: [
      "3",
      "5",
      "0",
      "2",
    ]
  },
  // ==========================================
  // M14: WHILE Y CONTROL
  // ==========================================,
  {
    id: "duel_m14_q01",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Evaluación de la condición en while",
    difficulty: 'easy',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'concept',
    question: "¿Cuándo se detiene un bucle while?",
    options: [
      "Cuando su condición evaluada resulta ser falsa (False).",
      "Cuando se alcanza automáticamente la vuelta número 10.",
      "Cuando se ejecuta la función print().",
      "Cuando la computadora detecta números negativos.",
    ]
  },
  {
    id: "duel_m14_q02",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Contador ascendente en while",
    difficulty: 'easy',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "c = 1\nwhile c <= 3:\n    print(c)\n    c = c + 1",
    options: [
      "1\n2",
      "1\n2\n3",
      "3\n2\n1",
      "1 2 3",
    ]
  },
  {
    id: "duel_m14_q03",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Contador descendente en while",
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Qué salida genera este programa?",
    codeSnippet: "cuenta = 3\nwhile cuenta > 0:\n    print(cuenta)\n    cuenta = cuenta - 1\nprint(\"Despegue\")",
    options: [
      "3\n2\n1\n0\nDespegue",
      "1\n2\n3\nDespegue",
      "3\n2\n1\nDespegue",
      "Despegue",
    ]
  },
  {
    id: "duel_m14_q04",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Bucle infinito por no actualizar variable",
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'error_detection',
    question: "¿Qué problema grave tiene el siguiente código?\nx = 1\nwhile x <= 5:\n    print(x)",
    options: [
      "Arroja un error de sintaxis porque la variable x debe llamarse obligatoriamente contador.",
      "No imprime nada porque x vale menos que 5.",
      "Se detiene automáticamente en la segunda vuelta.",
      "Produce un bucle infinito porque nunca se modifica el valor de x, por lo que x <= 5 siempre será verdadero.",
    ]
  },
  {
    id: "duel_m14_q05",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Acumulación en while",
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Qué valor imprime la variable total al terminar?",
    codeSnippet: "total = 0\nn = 1\nwhile n <= 3:\n    total = total + n * 10\n    n = n + 1\nprint(total)",
    options: [
      "60",
      "30",
      "10",
      "100",
    ]
  },
  {
    id: "duel_m14_q06",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Diferencia de indentación en while",
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Cuántas veces se imprime la palabra 'Fin' en este código?",
    codeSnippet: "n = 0\nwhile n < 3:\n    n = n + 1\n    print(\"Vuelta\")\nprint(\"Fin\")",
    options: [
      "3 veces",
      "1 sola vez",
      "Ninguna vez",
      "4 veces",
    ]
  },
  {
    id: "duel_m14_q07",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Condición con límite compuesto",
    difficulty: 'hard',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa?",
    codeSnippet: "valor = 1\nwhile valor < 20:\n    valor = valor * 3\nprint(valor)",
    options: [
      "9",
      "18",
      "27",
      "21",
    ]
  },
  {
    id: "duel_m14_q08",
    moduleId: 14,
    topic: "while y control",
    subtopic: "Dos variables modificadas en while",
    difficulty: 'hard',
    category: 'loops_while',
    categoryLabel: "while y control",
    type: 'code_output',
    question: "¿Qué valores se imprimen al concluir este bucle?",
    codeSnippet: "a = 0\nb = 10\nwhile a < b:\n    a = a + 2\n    b = b - 1\nprint(a, b)",
    options: [
      "6 7",
      "10 5",
      "4 8",
      "8 6",
    ]
  },
  // ==========================================
  // M15: INTEGRACIÓN / RESOLUCIÓN DE PROBLEMAS
  // ==========================================,
  {
    id: "duel_m15_q01",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Cálculo con entrada y salida formateada",
    difficulty: 'easy',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "Observá el siguiente programa de cálculo de presupuesto. ¿Qué imprime si la cantidad es 4 y el precio unitario es 25?",
    codeSnippet: "cantidad = 4\nprecio = 25\ntotal = cantidad * precio\nprint(\"Total a abonar: $\", total)",
    options: [
      "Total a abonar: $ 100",
      "Total a abonar: $100",
      "Total a abonar: $ 254",
      "Total a abonar: $ 29",
    ]
  },
  {
    id: "duel_m15_q02",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Algoritmo de tarifa con descuento",
    difficulty: 'easy',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué total final imprime este programa de facturación comercial?",
    codeSnippet: "subtotal = 1200\nif subtotal > 1000:\n    descuento = 200\nelse:\n    descuento = 0\ntotal = subtotal - descuento\nprint(total)",
    options: [
      "1200",
      "1000",
      "800",
      "1400",
    ]
  },
  {
    id: "duel_m15_q03",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Clasificación por categorías",
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué categoría se asigna a un cliente con 65 puntos en este programa?",
    codeSnippet: "puntos = 65\nif puntos >= 100:\n    cat = \"Oro\"\nelif puntos >= 50:\n    cat = \"Plata\"\nelse:\n    cat = \"Bronce\"\nprint(cat)",
    options: [
      "Oro",
      "Bronce",
      "Plata",
      "Error",
    ]
  },
  {
    id: "duel_m15_q04",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Conteo condicional en bucle",
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué valor final imprime la variable aprobados en este código?",
    codeSnippet: "aprobados = 0\nfor nota in [4, 8, 2, 7, 3]:\n    if nota >= 4:\n        aprobados = aprobados + 1\nprint(aprobados)",
    options: [
      "2",
      "5",
      "4",
      "3",
    ]
  },
  {
    id: "duel_m15_q05",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Detección de error de orden lógico",
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'error_detection',
    question: "¿Qué error de orden lógico presenta este programa de cobro?",
    codeSnippet: "print(\"Cobro realizado: \", total)\nprecio = 500\nrecargo = 50\ntotal = precio + recargo",
    options: [
      "Intenta mostrar el total en pantalla antes de haber calculado y asignado su valor.",
      "No se puede sumar precio con recargo.",
      "Falta pedir los datos con input obligatoriamente.",
      "El recargo debió ser un número negativo.",
    ]
  },
  {
    id: "duel_m15_q06",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Simulación de caja registradora con vuelto",
    difficulty: 'hard',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué imprime el siguiente programa de cobro?",
    codeSnippet: "total_compra = 350\npago_cliente = 500\nif pago_cliente >= total_compra:\n    vuelto = pago_cliente - total_compra\n    print(\"Vuelto:\", vuelto)\nelse:\n    print(\"Falta dinero\")",
    options: [
      "Vuelto: 350",
      "Vuelto: 150",
      "Vuelto: 500",
      "Falta dinero",
    ]
  },
  {
    id: "duel_m15_q07",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Algoritmo para hallar el mayor de dos números",
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué valor imprime este algoritmo para determinar el número mayor?",
    codeSnippet: "num1 = 45\nnum2 = 78\nif num1 > num2:\n    mayor = num1\nelse:\n    mayor = num2\nprint(\"El mayor es:\", mayor)",
    options: [
      "El mayor es: 45",
      "El mayor es: 123",
      "El mayor es: 78",
      "El mayor es: mayor",
    ]
  },
  {
    id: "duel_m15_q08",
    moduleId: 15,
    topic: "Integración / resolución de problemas",
    subtopic: "Integración completa: ciclo, acumulador y condición de salida",
    difficulty: 'hard',
    category: 'integration',
    categoryLabel: "Integración / resolución de problemas",
    type: 'code_output',
    question: "¿Qué imprime este programa al concluir?",
    codeSnippet: "ahorro = 0\ndeposito = 50\nmeses = 0\nwhile ahorro < 150:\n    ahorro = ahorro + deposito\n    meses = meses + 1\nprint(\"Meta alcanzada en meses:\", meses)",
    options: [
      "Meta alcanzada en meses: 4",
      "Meta alcanzada en meses: 2",
      "Meta alcanzada en meses: 150",
      "Meta alcanzada en meses: 3",
    ]
  }
];

function createSeededRandom(seed: string): () => number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic<T>(array: T[], randomFn: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Genera el conjunto de exactamente 10 preguntas para una partida 1v1:
 * 1. Filtra estrictamente el banco por contenidos permitidos: q.moduleId <= maxAllowedModule.
 * 2. Agrupa por dificultad: fácil (3), media (4), difícil (3).
 * 3. Selecciona de forma determinista con la semilla de la partida (seedOrMatchId).
 * 4. Si alguna dificultad no alcanza el cupo, realiza un backfill equilibrado exclusivamente dentro del pool permitido.
 * 5. Mezcla determinísticamente las 10 preguntas seleccionadas para que ambos jugadores las reciban en el mismo orden.
 */
export function getPublicMatchQuestions(
  seedOrMatchId: string = 'match_seed_default',
  maxAllowedModule: number = 15
): PublicMatchQuestion[] {
  const safeMaxModule = Math.max(1, Math.min(15, maxAllowedModule || 1));
  const prng = createSeededRandom(seedOrMatchId);

  const allowedPool = ONLINE_QUESTIONS_PUBLIC_BANK.filter(q => q.moduleId <= safeMaxModule);
  const pool = allowedPool.length >= 10 
    ? allowedPool 
    : ONLINE_QUESTIONS_PUBLIC_BANK.filter(q => q.moduleId <= Math.max(2, safeMaxModule));

  const easyPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'easy'), prng);
  const mediumPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'medium'), prng);
  const hardPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'hard'), prng);

  const targetEasy = 3;
  const targetMedium = 4;
  const targetHard = 3;

  const selected: PublicMatchQuestion[] = [];
  const selectedIds = new Set<string>();

  const takeFrom = (source: PublicMatchQuestion[], count: number) => {
    for (const q of source) {
      if (selected.length >= 10) break;
      if (!selectedIds.has(q.id) && count > 0) {
        selected.push(q);
        selectedIds.add(q.id);
        count--;
      }
    }
  };

  takeFrom(easyPool, targetEasy);
  takeFrom(mediumPool, targetMedium);
  takeFrom(hardPool, targetHard);

  if (selected.length < 10) {
    const remaining = shuffleDeterministic(pool.filter(q => !selectedIds.has(q.id)), prng);
    for (const q of remaining) {
      if (selected.length >= 10) break;
      selected.push(q);
      selectedIds.add(q.id);
    }
  }

  if (selected.length < 10) {
    for (const q of pool) {
      if (selected.length >= 10) break;
      selected.push(q);
    }
  }

  const finalOrdered = shuffleDeterministic(selected, prng);
  return finalOrdered.slice(0, 10);
}

/**
 * Busca una pregunta por su identificador único.
 */
export function getPublicQuestionById(id: string): PublicMatchQuestion | undefined {
  return ONLINE_QUESTIONS_PUBLIC_BANK.find(q => q.id === id);
}
