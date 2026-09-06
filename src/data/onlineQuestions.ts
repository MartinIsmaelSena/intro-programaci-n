import { MatchQuestion } from '../types/onlineChallenge';

/**
 * Banco Integral de Preguntas para Desafíos en Línea — Reorganización Pedagógica
 * Cobertura estructurada de los 15 módulos de "Python desde Cero".
 * Cada pregunta respeta estrictamente los contenidos enseñados hasta ese módulo.
 */
export const ONLINE_QUESTIONS_BANK: MatchQuestion[] = [
  // ==========================================
  // MÓDULO 1: INTRODUCCIÓN A LA PROGRAMACIÓN
  // ==========================================
  {
    id: 'q_m1_1',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Concepto de algoritmo',
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Qué es un algoritmo en programación?',
    options: [
      'Un componente físico de la placa madre',
      'Una secuencia ordenada y finita de pasos lógicos para resolver un problema',
      'Un virus informático que altera los datos',
      'El cable que conecta la computadora a internet'
    ],
    correctAnswer: 1,
    explanation: 'Un algoritmo es una secuencia de instrucciones paso a paso, precisa y finita, diseñada para resolver un problema o cumplir un objetivo determinado.'
  },
  {
    id: 'q_m1_2',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Rol del código fuente',
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Cuál es la función principal del código fuente que escribe un programador?',
    options: [
      'Dar instrucciones claras a la computadora sobre lo que debe realizar',
      'Aumentar la memoria RAM del sistema automáticamente',
      'Crear contraseñas seguras para redes sociales',
      'Enfriar los procesadores de la máquina'
    ],
    correctAnswer: 0,
    explanation: 'El código fuente contiene las instrucciones redactadas en un lenguaje formal que la computadora interpreta o ejecuta para cumplir tareas.'
  },
  {
    id: 'q_m1_3',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Concepto de bug',
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Qué término describe un error o fallo en un programa informático?',
    options: [
      'Byte',
      'Pixel',
      'Bug',
      'Kernel'
    ],
    correctAnswer: 2,
    explanation: 'En programación, un "bug" (bicho) es un defecto o error en el software que produce un resultado no deseado o detiene la ejecución.'
  },
  {
    id: 'q_m1_4',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Depuración (Debugging)',
    difficulty: 'easy',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Qué significa "depurar" (debugging) en el desarrollo de software?',
    options: [
      'Borrar todo el disco duro',
      'Buscar, identificar y corregir errores en el código',
      'Cambiar el teclado de la computadora',
      'Acelerar la velocidad de internet'
    ],
    correctAnswer: 1,
    explanation: 'Depurar o debugging es el proceso sistemático de encontrar y resolver errores en el código para que el programa funcione según lo previsto.'
  },
  {
    id: 'q_m1_5',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Ejecución secuencial',
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Qué significa que un programa informático se ejecute de forma secuencial?',
    options: [
      'Que las instrucciones se ejecutan de abajo hacia arriba de manera aleatoria',
      'Que solo se ejecutan las líneas pares del programa',
      'Que las instrucciones se leen y ejecutan en orden, una tras otra, desde la primera hacia el final',
      'Que el programa solo funciona cuando está conectado a dos monitores'
    ],
    correctAnswer: 2,
    explanation: 'La ejecución secuencial significa que el procesador sigue el flujo del programa línea por línea, de arriba hacia abajo, en el orden en que fueron escritas.'
  },
  {
    id: 'q_m1_6',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Algoritmos cotidianos',
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: 'En un algoritmo cotidiano para preparar café, ¿cuál sería un error de secuencia lógica?',
    options: [
      'Verter agua caliente antes de colocar el café en el filtro o taza',
      'Tomar la taza con la mano derecha',
      'Usar una taza de color blanco',
      'Esperar un minuto antes de beber'
    ],
    correctAnswer: 0,
    explanation: 'En los algoritmos el orden de los pasos es fundamental. Si vertemos agua caliente antes de colocar el café, el proceso falla porque la secuencia lógica fue alterada.'
  },
  {
    id: 'q_m1_7',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Determinismo de las máquinas',
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Por qué decimos que las computadoras son máquinas "deterministas"?',
    options: [
      'Porque tienen sentimientos y toman decisiones intuitivas',
      'Porque ante las mismas entradas e instrucciones siempre producen exactamente el mismo resultado',
      'Porque solo funcionan con energía solar',
      'Porque pueden adivinar lo que el usuario está pensando'
    ],
    correctAnswer: 1,
    explanation: 'Una computadora no posee intuición ni libre albedrío: ejecuta de forma rigurosa y matemática. Si los datos y pasos son idénticos, la salida siempre será la misma.'
  },
  {
    id: 'q_m1_8',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Lenguajes de alto nivel',
    difficulty: 'medium',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Cuál es el rol fundamental de un "lenguaje de programación de alto nivel"?',
    options: [
      'Permitir que los humanos escriban instrucciones legibles que luego se traducen al código binario de la máquina',
      'Aumentar el precio de venta de las computadoras',
      'Hacer que los monitores tengan mayor resolución de pantalla',
      'Impedir que personas sin título universitario puedan programar'
    ],
    correctAnswer: 0,
    explanation: 'Los lenguajes de alto nivel proporcionan una sintaxis comprensible y cercana al lenguaje humano, actuando como un puente frente al código binario (ceros y unos).'
  },
  {
    id: 'q_m1_9',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Finitud del algoritmo',
    difficulty: 'hard',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: 'Si un algoritmo no tiene una condición de fin o término, ¿qué problema fundamental presenta?',
    options: [
      'No tiene ningún problema, los programas deben durar para siempre',
      'Viola la propiedad de finitud y se convertirá en un proceso que nunca termina',
      'Se borra automáticamente del disco rígido',
      'Hace que la computadora consuma menos electricidad'
    ],
    correctAnswer: 1,
    explanation: 'Todo algoritmo válido debe ser finito: debe estar compuesto por una cantidad determinada de pasos y garantizar que en algún momento alcanzará un estado final.'
  },
  {
    id: 'q_m1_10',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Tipos de errores',
    difficulty: 'hard',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Cuál es la diferencia entre un error de sintaxis y un error de lógica?',
    options: [
      'El de sintaxis es cuando falla el monitor; el de lógica cuando se corta la luz',
      'El de sintaxis rompe las reglas del lenguaje e impide ejecutar; el de lógica permite ejecutar pero produce un resultado incorrecto',
      'Son exactamente lo mismo con dos nombres diferentes',
      'El de lógica solo ocurre en teléfonos móviles'
    ],
    correctAnswer: 1,
    explanation: 'Un error de sintaxis es como una falta de ortografía que la computadora no comprende. Un error de lógica es cuando las palabras están bien escritas pero el razonamiento del algoritmo es erróneo.'
  },
  {
    id: 'q_m1_11',
    moduleId: 1,
    topic: 'Introducción a la programación',
    subtopic: 'Propiedades del algoritmo',
    difficulty: 'hard',
    category: 'intro',
    categoryLabel: 'Introducción',
    type: 'concept',
    question: '¿Qué propiedad esencial debe tener todo algoritmo para considerarse válido?',
    options: [
      'Tener más de un millón de líneas de código',
      'Ser preciso, estar ordenado y ser finito',
      'Utilizar obligatoriamente conexión a internet',
      'Estar escrito exclusivamente en inglés'
    ],
    correctAnswer: 1,
    explanation: 'Las tres propiedades pilares de todo algoritmo formal son: precisión (cada paso es claro), orden (secuencia definida) y finitud (tiene un final determinado).'
  },

  // ==========================================
  // MÓDULO 2: FUNDAMENTOS DE LA PROGRAMACIÓN (NUEVO)
  // ==========================================
  {
    id: 'q_m2_1',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Definición de problema',
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'En informática, ¿qué se entiende por "resolver un problema"?',
    options: [
      'Comprar una computadora más rápida',
      'Diseñar un procedimiento lógico que transforme una situación inicial en un resultado o meta deseada',
      'Apagar y prender el monitor hasta que funcione',
      'Memorizar de memoria palabras en inglés'
    ],
    correctAnswer: 1,
    explanation: 'Resolver un problema consiste en idear una serie de pasos ordenados y lógicos para pasar de un estado inicial (con una necesidad o incógnita) a un estado final con la solución deseada.'
  },
  {
    id: 'q_m2_2',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Concepto de instrucción',
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿Qué es una "instrucción" para una computadora?',
    options: [
      'Una sugerencia que la máquina puede ignorar si quiere',
      'Una orden elemental y precisa que la computadora puede interpretar y ejecutar directamente',
      'Un botón en el teclado',
      'Una página de internet'
    ],
    correctAnswer: 1,
    explanation: 'Una instrucción es una directiva clara, no ambigua y concreta que le indica a la computadora qué acción exacta debe realizar.'
  },
  {
    id: 'q_m2_3',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Modelo Entrada-Proceso-Salida',
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'En el modelo universal Entrada → Proceso → Salida, ¿qué representa la "Entrada"?',
    options: [
      'El resultado final mostrado en pantalla',
      'Los datos o valores iniciales que el sistema recibe del usuario o del entorno',
      'El momento en que se apaga la computadora',
      'La caja donde viene guardado el equipo'
    ],
    correctAnswer: 1,
    explanation: 'La Entrada (Input) está constituida por todos los datos que ingresan al sistema para que el algoritmo pueda operar sobre ellos.'
  },
  {
    id: 'q_m2_4',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Dato vs Información',
    difficulty: 'easy',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿Cuál es la diferencia fundamental entre un "dato" y la "información"?',
    options: [
      'No hay ninguna diferencia, son exactamente sinónimos',
      'Un dato es un valor aislado sin procesar; la información es el resultado de procesarlo y darle contexto útil',
      'Los datos son palabras y la información son números',
      'La información se borra y los datos quedan para siempre'
    ],
    correctAnswer: 1,
    explanation: 'Un dato es un elemento crudo (por ejemplo "39"). La información es el dato procesado con significado ("Temperatura del paciente: 39°C - Fiebre").'
  },
  {
    id: 'q_m2_5',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Descomposición de problemas',
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿En qué consiste la técnica de "descomposición" en el pensamiento computacional?',
    options: [
      'En dividir un problema complejo en subproblemas más pequeños y fáciles de resolver',
      'En romper la computadora cuando el código tiene errores',
      'En juntar todos los problemas en uno solo gigante',
      'En copiar y pegar código sin entenderlo'
    ],
    correctAnswer: 0,
    explanation: 'La descomposición es la estrategia de dividir un problema grande en partes menores. Al resolver cada subproblema, se resuelve el conjunto completo (divide y vencerás).'
  },
  {
    id: 'q_m2_6',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Aplicación del modelo Entrada-Proceso-Salida',
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'En un sistema que calcula el promedio de tres notas de un alumno, ¿cuál es la "Salida"?',
    options: [
      'El teclado de la computadora',
      'Las tres notas individuales ingresadas por el profesor',
      'El valor del promedio final calculado y mostrado al usuario',
      'La suma matemática de las notas'
    ],
    correctAnswer: 2,
    explanation: 'Las entradas son las tres notas, el proceso es sumarlas y dividirlas por 3, y la salida es el promedio resultante entregado al usuario.'
  },
  {
    id: 'q_m2_7',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Algoritmo vs Programa',
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿Cuál es la relación correcta entre un algoritmo y un programa?',
    options: [
      'Un algoritmo es la idea lógica paso a paso; un programa es ese algoritmo escrito en un lenguaje para ser ejecutado por una computadora',
      'El programa se hace en papel y el algoritmo en la máquina',
      'Son dos cosas completamente opuestas que no tienen relación',
      'Un algoritmo solo se usa en matemáticas y un programa en juegos'
    ],
    correctAnswer: 0,
    explanation: 'El algoritmo es la solución conceptual independiente del lenguaje. El programa es la implementación concreta de dicho algoritmo en un lenguaje formal como Python.'
  },
  {
    id: 'q_m2_8',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Importancia del orden',
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'Si en un algoritmo para preparar fideos hervidos colocamos el paso "colar los fideos" antes de "hervir el agua", ¿qué principio fundamental se violó?',
    options: [
      'La finitud del algoritmo',
      'El orden secuencial lógico de las instrucciones',
      'El tamaño de la olla',
      'El idioma del programador'
    ],
    correctAnswer: 1,
    explanation: 'En todo algoritmo el orden temporal de las instrucciones es crucial. Alterar la secuencia produce resultados erróneos o fallas en el proceso.'
  },
  {
    id: 'q_m2_9',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Automatización de tareas',
    difficulty: 'medium',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿Qué significa "automatizar" una tarea mediante un programa informático?',
    options: [
      'Hacer que la computadora ejecute una secuencia de pasos de manera sistemática y repetible sin requerir intervención manual constante',
      'Convertir un programa en un automóvil moderno',
      'Hacer que la computadora funcione sin corriente eléctrica',
      'Escribir a mano las respuestas en un cuaderno'
    ],
    correctAnswer: 0,
    explanation: 'Automatizar consiste en confiar a una máquina la ejecución repetitiva, veloz y precisa de un algoritmo sin tener que realizar cada paso manualmente.'
  },
  {
    id: 'q_m2_10',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Errores de lógica',
    difficulty: 'hard',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'Un programa para cobrar en un supermercado se ejecuta sin fallar, pero cobra $1000 en lugar de $800 porque sumó el descuento en lugar de restarlo. ¿Qué tipo de error ocurrió?',
    options: [
      'Error de sintaxis',
      'Error de lógica',
      'Falla del monitor',
      'Virus en el teclado'
    ],
    correctAnswer: 1,
    explanation: 'Es un error de lógica. Las instrucciones están correctamente escritas en el lenguaje (no hay error de sintaxis), pero el razonamiento del algoritmo fue defectuoso.'
  },
  {
    id: 'q_m2_11',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Prueba de escritorio',
    difficulty: 'hard',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: '¿Qué es una "prueba de escritorio" en el desarrollo de algoritmos?',
    options: [
      'Comprobar si el mueble donde está la computadora es firme',
      'Un seguimiento manual paso a paso del algoritmo con lápiz y papel para verificar si produce los resultados esperados',
      'Formatear el disco duro de la computadora',
      'Instalar una aplicación de juegos'
    ],
    correctAnswer: 1,
    explanation: 'La prueba de escritorio consiste en simular a mano el comportamiento del algoritmo, probando distintos valores de entrada para asegurar que la lógica sea correcta antes de codificar.'
  },
  {
    id: 'q_m2_12',
    moduleId: 2,
    topic: 'Fundamentos de la programación',
    subtopic: 'Etapas de un sistema',
    difficulty: 'hard',
    category: 'foundations',
    categoryLabel: 'Fundamentos',
    type: 'concept',
    question: 'Al diseñar un sistema para calcular el sueldo de un trabajador, ¿cuál de las siguientes acciones pertenece a la etapa de "Proceso"?',
    options: [
      'El empleado escribe sus horas trabajadas en la pantalla',
      'Multiplicar las horas trabajadas por el valor de cada hora para calcular el total',
      'Imprimir el recibo de sueldo en papel',
      'Cerrar la sesión del usuario'
    ],
    correctAnswer: 1,
    explanation: 'La entrada es la cantidad de horas ingresadas. El cálculo matemático (multiplicación) es la transformación o Proceso. La salida es el recibo impreso.'
  },

  // ==========================================
  // MÓDULO 3: ¿QUÉ ES PYTHON? (ANTES M2)
  // ==========================================
  {
    id: 'q_m3_1',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Historia y creación',
    difficulty: 'easy',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Quién creó el lenguaje de programación Python en 1991?',
    options: [
      'Bill Gates',
      'Guido van Rossum',
      'Steve Jobs',
      'Mark Zuckerberg'
    ],
    correctAnswer: 1,
    explanation: 'Python fue concebido a finales de los años 80 y lanzado oficialmente en 1991 por el programador neerlandés Guido van Rossum.'
  },
  {
    id: 'q_m3_2',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Clasificación del lenguaje',
    difficulty: 'easy',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: 'Python se clasifica principalmente como un lenguaje:',
    options: [
      'De bajo nivel que solo entiende ceros y unos',
      'Interpretado, de alto nivel y con tipado dinámico',
      'Exclusivo para fabricar piezas de hardware',
      'Que solo funciona sin conexión eléctrica'
    ],
    correctAnswer: 1,
    explanation: 'Python es un lenguaje interpretado (se ejecuta línea por línea mediante un intérprete), de alto nivel (sintaxis legible y expresiva) y multipropósito.'
  },
  {
    id: 'q_m3_3',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Origen del nombre',
    difficulty: 'easy',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿De dónde proviene históricamente el nombre del lenguaje "Python"?',
    options: [
      'De una peligrosa serpiente que Guido van Rossum tenía como mascota',
      'Del grupo humorístico británico de comedia "Monty Python"',
      'De una antigua ciudad griega llamada Pythonia',
      'De una marca de procesadores de los años 80'
    ],
    correctAnswer: 1,
    explanation: 'Guido van Rossum eligió el nombre en homenaje a la serie de comedia británica "Monty Python\'s Flying Circus", de la cual era un gran aficionado.'
  },
  {
    id: 'q_m3_4',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Filosofía Zen de Python',
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Qué característica define la filosofía de diseño de Python expuesta en "The Zen of Python"?',
    options: [
      'Hacer el código lo más largo y críptico posible',
      'La simplicidad, legibilidad y claridad por sobre la complejidad innecesaria',
      'Que solo pueda ejecutarse en computadoras de gran tamaño',
      'Que los programas deban escribirse sin dejar espacios'
    ],
    correctAnswer: 1,
    explanation: 'El Zen de Python promueve principios fundamentales como "Simple es mejor que complejo", "Bello es mejor que feo" y "La legibilidad cuenta".'
  },
  {
    id: 'q_m3_5',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Multiplataforma',
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Qué significa que Python sea un lenguaje "multiplataforma"?',
    options: [
      'Que solo funciona en una marca específica de computadoras',
      'Que el mismo código fuente puede ejecutarse en Windows, macOS, Linux y otros sistemas operativos',
      'Que necesita obligatoriamente dos tarjetas de video para ejecutarse',
      'Que solo puede utilizarse para programar videojuegos'
    ],
    correctAnswer: 1,
    explanation: 'Multiplataforma o portable significa que un programa escrito en Python puede ejecutarse sin modificaciones estructurales en diversos entornos y sistemas operativos.'
  },
  {
    id: 'q_m3_6',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Rol del intérprete',
    difficulty: 'medium',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Qué función cumple el intérprete de Python cuando ejecutamos un archivo `.py`?',
    options: [
      'Traduce y ejecuta el código instrucción por instrucción en tiempo real',
      'Imprime el archivo en hojas de papel automáticamente',
      'Borra el archivo una vez que termina de leerlo',
      'Aumenta la memoria del monitor'
    ],
    correctAnswer: 0,
    explanation: 'El intérprete de Python lee el código fuente línea por línea, lo analiza sintácticamente y lo traduce a instrucciones directas que la máquina ejecuta de inmediato.'
  },
  {
    id: 'q_m3_7',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Características del ecosistema',
    difficulty: 'hard',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Cuál de las siguientes afirmaciones sobre Python es FALSA?',
    options: [
      'Es un lenguaje de código abierto mantenido por una comunidad global',
      'Requiere compilar manualmente todo el programa a un archivo .exe antes de probar la primera línea',
      'Tiene una sintaxis limpia basada en indentación',
      'Es ampliamente utilizado en desarrollo web, inteligencia artificial y automatización'
    ],
    correctAnswer: 1,
    explanation: 'Python es interpretado y no requiere compilar previamente a un archivo binario `.exe` para probarlo; se puede ejecutar directamente con el intérprete.'
  },
  {
    id: 'q_m3_8',
    moduleId: 3,
    topic: '¿Qué es Python?',
    subtopic: 'Aplicaciones en la industria',
    difficulty: 'hard',
    category: 'python_basics',
    categoryLabel: 'Python',
    type: 'concept',
    question: '¿Por qué Python es uno de los lenguajes más populares en ciencia de datos, inteligencia artificial y educación?',
    options: [
      'Porque es el único lenguaje que existe en el mundo',
      'Por su curva de aprendizaje amigable, enorme colección de librerías y gran legibilidad',
      'Porque la ley obliga a las escuelas a utilizarlo',
      'Porque no permite cometer ningún tipo de error'
    ],
    correctAnswer: 1,
    explanation: 'La claridad sintáctica de Python permite a los principiantes e investigadores concentrarse en resolver problemas en lugar de lidiar con complejidades técnicas del lenguaje.'
  },

  // ==========================================
  // MÓDULO 4: VARIABLES (ANTES M3)
  // ==========================================
  {
    id: 'q_m4_1',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Concepto de variable',
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'concept',
    question: 'En programación con Python, ¿qué es una variable?',
    options: [
      'Un botón que cambia de color en la pantalla',
      'Un espacio reservado y etiquetado en la memoria donde guardamos un dato para reutilizarlo',
      'Una instrucción que apaga el equipo',
      'Un tipo especial de cable'
    ],
    correctAnswer: 1,
    explanation: 'Una variable es un contenedor o espacio con nombre en la memoria RAM donde almacenamos un valor que el programa puede consultar o modificar.'
  },
  {
    id: 'q_m4_2',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Operador de asignación',
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'concept',
    question: '¿Qué símbolo se utiliza en Python para asignar un valor a una variable?',
    options: [
      'El signo igual (=)',
      'La flecha (->)',
      'Los dos puntos (:)',
      'El signo pesos ($)'
    ],
    correctAnswer: 0,
    explanation: 'El signo `=` es el operador de asignación en Python: toma el valor ubicado a la derecha y lo almacena dentro de la variable nombrada a la izquierda.'
  },
  {
    id: 'q_m4_3',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Predicción de salida con print',
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Cuál será la salida al ejecutar el siguiente código en Python?',
    codeSnippet: 'nombre = "Martin"\nprint(nombre)',
    options: [
      'Martin',
      'nombre',
      '"Martin"',
      'Error'
    ],
    correctAnswer: 0,
    explanation: 'Al pasar la variable `nombre` sin comillas a la función `print()`, Python busca el valor contenido en la variable e imprime su contenido: Martin.'
  },
  {
    id: 'q_m4_4',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Reasignación de variables',
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Cuál será la salida al ejecutar este código con reasignación?',
    codeSnippet: 'nombre = "Martin"\nnombre = "Rocio"\nprint(nombre)',
    options: [
      'Martin',
      'Rocio',
      'Martin Rocio',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'La variable `nombre` almacena un valor a la vez. Cuando se ejecuta `nombre = "Rocio"`, el valor anterior `"Martin"` es sobreescrito. Por eso se imprime Rocio.'
  },
  {
    id: 'q_m4_5',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Reasignación numérica simple',
    difficulty: 'easy',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Qué imprime en consola este programa?',
    codeSnippet: 'edad = 15\nedad = 16\nprint(edad)',
    options: [
      '15',
      '16',
      '15 16',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'La variable `edad` comenzó valiendo 15, pero en la siguiente línea se actualizó a 16. La función `print()` muestra el último valor asignado.'
  },
  {
    id: 'q_m4_6',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Múltiples reasignaciones sucesivas',
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Cuál es el valor final que imprime el siguiente código?',
    codeSnippet: 'puntos = 10\npuntos = 25\npuntos = 5\nprint(puntos)',
    options: [
      '10',
      '25',
      '5',
      '40'
    ],
    correctAnswer: 2,
    explanation: 'La variable puntos fue reasignada secuencialmente. El último valor que recibió antes del print fue 5.'
  },
  {
    id: 'q_m4_7',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Reasignación con múltiples variables',
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Qué imprime la última línea del siguiente fragmento?',
    codeSnippet: 'nombre = "Martin"\nnombre = "Rocio"\nedad = 20\nprint(nombre)',
    options: [
      'Martin',
      'Rocio',
      '20',
      'Martin Rocio 20'
    ],
    correctAnswer: 1,
    explanation: 'La instrucción `print(nombre)` solo consulta el valor de la variable `nombre`. Como su último valor asignado fue "Rocio", imprime Rocio.'
  },
  {
    id: 'q_m4_8',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Copia de valores entre variables',
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Qué imprime el siguiente fragmento de código?',
    codeSnippet: 'x = 4\ny = x\nx = 10\nprint(y)',
    options: [
      '10',
      '4',
      '14',
      'x'
    ],
    correctAnswer: 1,
    explanation: 'Cuando se ejecuta `y = x`, `y` toma una copia del valor actual de `x` (que era 4). Luego `x` cambia a 10, pero `y` conserva su valor de 4.'
  },
  {
    id: 'q_m4_9',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Reglas de identificadores válidos',
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'concept',
    question: '¿Cuál de los siguientes nombres de variable es VÁLIDO según las reglas de Python?',
    options: [
      '2do_puesto',
      'nombre-usuario',
      'nombre_usuario',
      'total puntos'
    ],
    correctAnswer: 2,
    explanation: '`nombre_usuario` es válido porque utiliza letras y guión bajo. No empieza con números, no tiene espacios ni guiones medios.'
  },
  {
    id: 'q_m4_10',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Identificadores inválidos',
    difficulty: 'medium',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'concept',
    question: '¿Por qué el nombre `1er_lugar` es un identificador INVÁLIDO en Python?',
    options: [
      'Porque en Python las variables deben comenzar siempre con letras o guión bajo, nunca con un número',
      'Porque tiene más de tres letras',
      'Porque la palabra lugar está prohibida',
      'Porque solo se pueden nombrar variables en inglés'
    ],
    correctAnswer: 0,
    explanation: 'Una de las reglas sintácticas estrictas de Python es que los nombres de variables jamás pueden comenzar con un dígito numérico.'
  },
  {
    id: 'q_m4_11',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Convención snake_case',
    difficulty: 'hard',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'concept',
    question: '¿Qué convención de estilo recomienda la guía oficial PEP 8 para nombrar variables en Python?',
    options: [
      'camelCase (ejemplo: miVariableTotal)',
      'snake_case (ejemplo: mi_variable_total en minúsculas separada por guiones bajos)',
      'kebab-case (ejemplo: mi-variable-total con guiones medios)',
      'MAYÚSCULAS_TOTALES para todas las variables'
    ],
    correctAnswer: 1,
    explanation: 'PEP 8 establece que los nombres de variables deben escribirse en minúsculas, con palabras separadas por guiones bajos (convención snake_case).'
  },
  {
    id: 'q_m4_12',
    moduleId: 4,
    topic: 'Variables',
    subtopic: 'Trazado secuencial avanzado de variables',
    difficulty: 'hard',
    category: 'variables',
    categoryLabel: 'Variables',
    type: 'code_output',
    question: '¿Cuál será la salida exacta del siguiente programa en la consola?',
    codeSnippet: 'nombre = "Martin"\nedad = 20\nnombre = "Rocio"\nedad = 21\nprint(nombre)\nprint(edad)',
    options: [
      'Martin seguido de 20 en la siguiente línea',
      'Rocio seguido de 21 en la siguiente línea',
      'Rocio 20',
      'Martin 21'
    ],
    correctAnswer: 1,
    explanation: 'Ambas variables fueron actualizadas. Al momento de ejecutarse los prints, `nombre` contiene "Rocio" y `edad` contiene 21.'
  },

  // ==========================================
  // MÓDULO 5: TIPOS DE DATOS (ANTES M4)
  // ==========================================
  {
    id: 'q_m5_1',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Enteros (int)',
    difficulty: 'easy',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'concept',
    question: '¿A qué tipo de dato fundamental pertenece el valor `42` en Python?',
    options: [
      'str (cadena de texto)',
      'int (número entero)',
      'float (número decimal)',
      'bool (booleano)'
    ],
    correctAnswer: 1,
    explanation: 'Los números completos sin coma ni punto decimal pertenecen al tipo de dato entero o `int`.'
  },
  {
    id: 'q_m5_2',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Cadenas de texto (str)',
    difficulty: 'easy',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'concept',
    question: '¿A qué tipo de dato pertenece el valor `"Python"` en Python?',
    options: [
      'int',
      'bool',
      'str (string o cadena de texto)',
      'float'
    ],
    correctAnswer: 2,
    explanation: 'Cualquier texto delimitado entre comillas simples o dobles es una cadena de caracteres del tipo `str`.'
  },
  {
    id: 'q_m5_3',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Función inspectora type()',
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'concept',
    question: '¿Qué función incorporada de Python nos permite conocer el tipo de dato de cualquier valor o variable?',
    options: [
      'inspect()',
      'type()',
      'typeof()',
      'datatype()'
    ],
    correctAnswer: 1,
    explanation: 'La función `type()` recibe un valor o variable entre paréntesis y devuelve el tipo de dato correspondiente (ej: `<class \'int\'>`).'
  },
  {
    id: 'q_m5_4',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Flotantes (float)',
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'code_output',
    question: '¿Qué tipo de dato devuelve la instrucción `type(3.14)`?',
    options: [
      '<class \'int\'>',
      '<class \'str\'>',
      '<class \'float\'>',
      '<class \'decimal\'>'
    ],
    correctAnswer: 2,
    explanation: 'Los números con punto decimal se representan en Python mediante el tipo de punto flotante o `float`.'
  },
  {
    id: 'q_m5_5',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Booleanos (bool)',
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'concept',
    question: '¿Cuáles son los dos únicos valores válidos del tipo booleano (`bool`) en Python?',
    options: [
      '1 y 2',
      'True y False (con mayúscula inicial)',
      'true y false (todo en minúsculas)',
      'SI y NO'
    ],
    correctAnswer: 1,
    explanation: 'En Python, los literales booleanos deben escribirse obligatoriamente con la primera letra mayúscula: `True` y `False`.'
  },
  {
    id: 'q_m5_6',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Concatenación de cadenas',
    difficulty: 'medium',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código al ejecutarse?',
    codeSnippet: 'resultado = "10" + "20"\nprint(resultado)',
    options: [
      '30',
      '1020',
      '"resultado"',
      'Error de tipo'
    ],
    correctAnswer: 1,
    explanation: 'Como ambos valores están entre comillas, son cadenas de texto (`str`). El operador `+` entre textos los une (concatena), formando "1020".'
  },
  {
    id: 'q_m5_7',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Consulta de tipo booleano',
    difficulty: 'hard',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'code_output',
    question: '¿Qué muestra en consola el siguiente fragmento de código?',
    codeSnippet: 'activo = True\nprint(type(activo))',
    options: [
      '<class \'bool\'>',
      '<class \'str\'>',
      '<class \'int\'>',
      'True'
    ],
    correctAnswer: 0,
    explanation: 'La variable `activo` almacena el valor booleano `True`. Al consultar su tipo con `type(activo)`, devuelve `<class \'bool\'>`.'
  },
  {
    id: 'q_m5_8',
    moduleId: 5,
    topic: 'Tipos de datos',
    subtopic: 'Diferencia conceptual entre texto y número',
    difficulty: 'hard',
    category: 'data_types',
    categoryLabel: 'Tipos de datos',
    type: 'concept',
    question: '¿Por qué en Python el valor `"100"` no es idéntico al valor `100`?',
    options: [
      'Porque `"100"` es una cadena de texto (str) y `100` es un número entero (int) con operaciones distintas',
      'Porque uno es positivo y el otro es negativo',
      'Porque las comillas duplican el tamaño del número en memoria',
      'En realidad son completamente idénticos y se comportan igual'
    ],
    correctAnswer: 0,
    explanation: 'En Python el tipo de dato define qué operaciones son posibles. Sobre un entero podemos hacer cálculos matemáticos; sobre un texto solo operaciones de caracteres.'
  },

  // ==========================================
  // MÓDULO 6: OPERADORES ARITMÉTICOS (ANTES M5)
  // ==========================================
  {
    id: 'q_m6_1',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Operador de potencia',
    difficulty: 'easy',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'concept',
    question: '¿Qué operador se utiliza en Python para calcular la potencia (elevar a un exponente)?',
    options: [
      '^ (circunflejo)',
      '** (doble asterisco)',
      '^^ (doble circunflejo)',
      'pow#'
    ],
    correctAnswer: 1,
    explanation: 'En Python la exponenciación o potencia se realiza con el doble asterisco `**` (por ejemplo, `2 ** 3` es 8).'
  },
  {
    id: 'q_m6_2',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Precedencia básica',
    difficulty: 'easy',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'code_output',
    question: '¿Cuál es el resultado de la expresión matemática `10 - 3 * 2` en Python?',
    options: [
      '14',
      '4',
      '10',
      'Error de cálculo'
    ],
    correctAnswer: 1,
    explanation: 'Por reglas de precedencia matemática, la multiplicación `3 * 2 = 6` se resuelve antes que la resta. Luego `10 - 6 = 4`.'
  },
  {
    id: 'q_m6_3',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'División entera',
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'code_output',
    question: '¿Qué valor devuelve el operador de división entera `//` en la expresión `14 // 3`?',
    options: [
      '4.66',
      '4',
      '2',
      '5'
    ],
    correctAnswer: 1,
    explanation: 'El operador `//` realiza la división entera, descartando por completo los decimales. 14 cabe 4 veces enteras en 3.'
  },
  {
    id: 'q_m6_4',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Operador módulo / resto',
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'code_output',
    question: '¿Qué calcula el operador módulo `%` en la expresión `17 % 5`?',
    options: [
      'El porcentaje del 17%',
      'El residuo o resto de la división entera, que es 2',
      'El cociente decimal 3.4',
      'La suma de ambos números'
    ],
    correctAnswer: 1,
    explanation: '17 dividido 5 es 3 con resto 2. El operador `%` (módulo) devuelve siempre el resto de la división.'
  },
  {
    id: 'q_m6_5',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Tipo devuelto por división común',
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'concept',
    question: '¿Qué tipo de dato devuelve SIEMPRE la división común `/` en Python 3?',
    options: [
      'int si la división es exacta',
      'float en todos los casos, incluso si es exacta (ej: 8 / 2 da 4.0)',
      'str',
      'bool'
    ],
    correctAnswer: 1,
    explanation: 'En Python 3 la división con una sola barra `/` siempre retorna un número decimal de punto flotante (`float`), incluso en `4 / 2 -> 2.0`.'
  },
  {
    id: 'q_m6_6',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Potencia y precedencia',
    difficulty: 'medium',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'x = 2 ** 3 + 1\nprint(x)',
    options: [
      '7',
      '9',
      '8',
      '16'
    ],
    correctAnswer: 1,
    explanation: 'La potencia tiene mayor precedencia que la suma: `2 ** 3 = 8`. Luego `8 + 1 = 9`.'
  },
  {
    id: 'q_m6_7',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Comprobación de paridad con módulo',
    difficulty: 'hard',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'concept',
    question: '¿Cómo se comprueba matemáticamente si un número entero `n` es PAR utilizando el operador módulo?',
    options: [
      'Comprobando si `n % 2 == 0` (el resto de dividir por 2 es cero)',
      'Comprobando si `n // 2 == 1`',
      'Comprobando si `n ** 2 == n`',
      'Comprobando si `n / 2 == 0`'
    ],
    correctAnswer: 0,
    explanation: 'Todo número par es divisible exactamente por 2, lo que significa que el residuo devuelto por `n % 2` es estrictamente igual a cero.'
  },
  {
    id: 'q_m6_8',
    moduleId: 6,
    topic: 'Operadores aritméticos',
    subtopic: 'Precedencia completa con paréntesis',
    difficulty: 'hard',
    category: 'arithmetic',
    categoryLabel: 'Aritmética',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código con paréntesis y operaciones combinadas?',
    codeSnippet: 'res = (8 + 2) * (5 - 3) / 2\nprint(res)',
    options: [
      '10',
      '10.0',
      '20.0',
      '5.0'
    ],
    correctAnswer: 1,
    explanation: 'Primero los paréntesis: `(8 + 2) = 10` y `(5 - 3) = 2`. Luego `10 * 2 = 20`. Finalmente `20 / 2 = 10.0` (la división siempre da float).'
  },

  // ==========================================
  // MÓDULO 7: OPERADORES DE COMPARACIÓN (ANTES M6)
  // ==========================================
  {
    id: 'q_m7_1',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Operador de igualdad',
    difficulty: 'easy',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'concept',
    question: '¿Qué operador se utiliza en Python para verificar si dos valores son IGUALES?',
    options: [
      '= (un solo igual)',
      '== (doble igual)',
      '=== (triple igual)',
      'equals'
    ],
    correctAnswer: 1,
    explanation: 'En Python, el operador para comparar si dos valores son iguales es el doble signo igual `==`. Un solo signo `=` se reserva para asignación.'
  },
  {
    id: 'q_m7_2',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Operador distinto',
    difficulty: 'easy',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'concept',
    question: '¿Qué operador se utiliza en Python para verificar si dos valores son DIFERENTES o DISTINTOS?',
    options: [
      '<>',
      '!=',
      '!==',
      'not=='
    ],
    correctAnswer: 1,
    explanation: 'El signo de admiración seguido de igual `!=` representa "distinto de" o "diferente de" en Python.'
  },
  {
    id: 'q_m7_3',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Mayor o igual',
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'code_output',
    question: '¿Qué resultado booleano produce la comparación `print(15 >= 15)`?',
    options: [
      'False',
      'True',
      '15',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'El operador `>=` evalúa si el valor izquierdo es mayor O igual que el derecho. Como 15 es igual a 15, la condición es True.'
  },
  {
    id: 'q_m7_4',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Comparación de cadenas y mayúsculas',
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'code_output',
    question: '¿Qué imprime la comparación entre textos `print("Python" == "python")`?',
    options: [
      'True',
      'False',
      'None',
      'Error de texto'
    ],
    correctAnswer: 1,
    explanation: 'Python es sensible a mayúsculas y minúsculas (case-sensitive). La "P" mayúscula no es igual a la "p" minúscula, por lo que la comparación da False.'
  },
  {
    id: 'q_m7_5',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Menor que con variables',
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'code_output',
    question: '¿Qué imprime el siguiente fragmento de código?',
    codeSnippet: 'a = 10\nb = 20\nprint(a < b)',
    options: [
      'True',
      'False',
      '10',
      '20'
    ],
    correctAnswer: 0,
    explanation: 'Como 10 es estrictamente menor que 20, la expresión `a < b` se evalúa como verdadera y el print muestra True.'
  },
  {
    id: 'q_m7_6',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Detección de error = vs ==',
    difficulty: 'medium',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'error_detection',
    question: 'Un programador quiere comparar si la variable `puntos` es igual a 50. ¿Cuál de las siguientes líneas contiene un error de sintaxis al intentar comparar?',
    options: [
      'es_igual = (puntos == 50)',
      'es_igual = (puntos = 50)',
      'es_igual = (puntos != 50)',
      'es_igual = (puntos >= 50)'
    ],
    correctAnswer: 1,
    explanation: '`puntos = 50` es una asignación, no una comparación. En Python no se puede asignar dentro de una expresión de comparación; se debe usar `==`.'
  },
  {
    id: 'q_m7_7',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Comparaciones encadenadas',
    difficulty: 'hard',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'code_output',
    question: '¿Qué imprime la comparación encadenada `print(3 < 5 < 8)` en Python?',
    options: [
      'False',
      'True',
      '8',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'Python permite comparaciones encadenadas directas. Como 3 es menor que 5 Y 5 es menor que 8 simultáneamente, el resultado es True.'
  },
  {
    id: 'q_m7_8',
    moduleId: 7,
    topic: 'Operadores de comparación',
    subtopic: 'Comparación entre tipos distintos',
    difficulty: 'hard',
    category: 'comparison',
    categoryLabel: 'Comparaciones',
    type: 'code_output',
    question: '¿Cuál es el resultado de comparar un entero con un string con `print(5 == "5")`?',
    options: [
      'True porque ambos representan el número cinco',
      'False porque son de tipos de datos diferentes (int vs str)',
      'Produce un error de tipo TypeError',
      'None'
    ],
    correctAnswer: 1,
    explanation: 'El operador `==` en Python compara tanto el valor como el tipo de dato. Un entero nunca es igual a una cadena de texto, por lo que devuelve False sin error.'
  },

  // ==========================================
  // MÓDULO 8: OPERADORES LÓGICOS (ANTES M7)
  // ==========================================
  {
    id: 'q_m8_1',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Operador and',
    difficulty: 'easy',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'concept',
    question: '¿Qué operador lógico requiere que AMBAS condiciones sean verdaderas para dar True?',
    options: [
      'and',
      'or',
      'not',
      'xor'
    ],
    correctAnswer: 0,
    explanation: 'El operador `and` solo devuelve True si tanto la condición izquierda como la derecha son simultáneamente verdaderas.'
  },
  {
    id: 'q_m8_2',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Operador not',
    difficulty: 'easy',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'concept',
    question: '¿Qué operador lógico invierte el valor de verdad de una condición booleana?',
    options: [
      'inv',
      'not',
      'reverse',
      'flip'
    ],
    correctAnswer: 1,
    explanation: 'El operador `not` invierte el valor booleano: si la condición era True pasa a ser False, y si era False pasa a ser True.'
  },
  {
    id: 'q_m8_3',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Operador or',
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'concept',
    question: '¿Qué operador lógico devuelve True si AL MENOS UNA de las dos condiciones es verdadera?',
    options: [
      'and',
      'or',
      'not',
      'both'
    ],
    correctAnswer: 1,
    explanation: 'El operador `or` solo da False cuando ambas condiciones son falsas. Si cualquiera de ellas es True, devuelve True.'
  },
  {
    id: 'q_m8_4',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Tabla de verdad and',
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'code_output',
    question: '¿Cuál es el resultado de la expresión lógica `print(True and False)`?',
    options: [
      'True',
      'False',
      'None',
      'Error'
    ],
    correctAnswer: 1,
    explanation: 'En el operador `and`, al haber una condición falsa, toda la expresión se evalúa como False.'
  },
  {
    id: 'q_m8_5',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Tabla de verdad or',
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'code_output',
    question: '¿Cuál es el resultado de la expresión lógica `print(False or True)`?',
    options: [
      'False',
      'True',
      'None',
      'True and False'
    ],
    correctAnswer: 1,
    explanation: 'En el operador `or`, basta con que una de las dos condiciones sea verdadera para que toda la expresión sea True.'
  },
  {
    id: 'q_m8_6',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Expresiones compuestas con variables',
    difficulty: 'medium',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'edad = 16\ntiene_permiso = True\nprint(edad >= 18 or tiene_permiso)',
    options: [
      'False',
      'True',
      '16',
      'Error'
    ],
    correctAnswer: 1,
    explanation: '`edad >= 18` es False (16 no es mayor o igual a 18), pero `tiene_permiso` es True. Con el operador `or`, False or True da como resultado True.'
  },
  {
    id: 'q_m8_7',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Negación con comparaciones',
    difficulty: 'hard',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'code_output',
    question: '¿Qué imprime la expresión `print(not (5 > 2 and 3 == 3))`?',
    options: [
      'True',
      'False',
      'None',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'Dentro del paréntesis: `5 > 2` es True y `3 == 3` es True. `True and True` da True. El operador `not` exterior lo invierte a False.'
  },
  {
    id: 'q_m8_8',
    moduleId: 8,
    topic: 'Operadores lógicos',
    subtopic: 'Cortocircuito lógico',
    difficulty: 'hard',
    category: 'logical',
    categoryLabel: 'Operadores lógicos',
    type: 'concept',
    question: 'En Python, ¿qué significa la "evaluación de cortocircuito" (short-circuit)?',
    options: [
      'Que la computadora se calienta cuando hay muchos operadores',
      'Que Python no evalúa la segunda condición si la primera ya define con certeza el resultado total',
      'Que el programa se apaga si hay un error de conexión',
      'Que los operadores lógicos solo funcionan dentro de bucles'
    ],
    correctAnswer: 1,
    explanation: 'En un `and`, si el primer término es False, el resultado final será False sin evaluar el segundo. En un `or`, si el primero es True, ya es True directamente.'
  },

  // ==========================================
  // MÓDULO 9: LA FUNCIÓN PRINT() (ANTES M8)
  // ==========================================
  {
    id: 'q_m9_1',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Propósito de print',
    difficulty: 'easy',
    category: 'print',
    categoryLabel: 'print()',
    type: 'concept',
    question: '¿Cuál es el propósito principal de la función `print()` en Python?',
    options: [
      'Guardar datos en la base de datos',
      'Mostrar información, texto y valores en la pantalla o consola',
      'Leer lo que el usuario escribe en el teclado',
      'Apagar el programa'
    ],
    correctAnswer: 1,
    explanation: '`print()` es la función estándar de salida en Python: proyecta textos, números y resultados de variables en la consola.'
  },
  {
    id: 'q_m9_2',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Separador por defecto',
    difficulty: 'easy',
    category: 'print',
    categoryLabel: 'print()',
    type: 'code_output',
    question: 'Si ejecutamos `print("Hola", "Python")` con una coma, ¿qué separador usa por defecto entre los argumentos?',
    options: [
      'Ninguno, los pega juntos ("HolaPython")',
      'Un espacio en blanco ("Hola Python")',
      'Un guión medio ("Hola-Python")',
      'Un salto de línea'
    ],
    correctAnswer: 1,
    explanation: 'Por defecto, la función `print()` separa cada argumento que recibe con un espacio simple en blanco.'
  },
  {
    id: 'q_m9_3',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Parámetro sep',
    difficulty: 'medium',
    category: 'print',
    categoryLabel: 'print()',
    type: 'concept',
    question: '¿Qué parámetro especial de `print()` permite cambiar el carácter que separa los elementos impresos?',
    options: [
      'separator=',
      'sep=',
      'split=',
      'divider='
    ],
    correctAnswer: 1,
    explanation: 'El parámetro con nombre `sep` (de separator) define qué carácter o texto se colocará entre cada uno de los elementos (ej: `sep="-"`).'
  },
  {
    id: 'q_m9_4',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Uso práctico de sep',
    difficulty: 'medium',
    category: 'print',
    categoryLabel: 'print()',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'print("2026", "09", "04", sep="-")',
    options: [
      '2026 09 04',
      '2026-09-04',
      '20260904',
      'Error de sintaxis'
    ],
    correctAnswer: 1,
    explanation: 'El argumento `sep="-"` reemplaza el espacio por defecto por un guión medio entre cada elemento, resultando en 2026-09-04.'
  },
  {
    id: 'q_m9_5',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Parámetro end',
    difficulty: 'medium',
    category: 'print',
    categoryLabel: 'print()',
    type: 'concept',
    question: '¿Qué parámetro de `print()` permite evitar que se realice un salto de línea automático al terminar de imprimir?',
    options: [
      'stop=',
      'no_newline=',
      'end=',
      'line='
    ],
    correctAnswer: 2,
    explanation: 'Por defecto `end="\\n"` (salto de línea). Si pasamos `end=""` o `end=" "`, el próximo print continuará en la misma línea.'
  },
  {
    id: 'q_m9_6',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Sintaxis de f-strings',
    difficulty: 'medium',
    category: 'print',
    categoryLabel: 'print()',
    type: 'code_output',
    question: '¿Cómo se formatea correctamente una f-string para mostrar `nombre = "Ana"`?',
    options: [
      'print(f"Hola {nombre}")',
      'print("Hola [nombre]")',
      'print(f"Hola %nombre%")',
      'print("Hola {nombre}") sin la f'
    ],
    correctAnswer: 0,
    explanation: 'Las f-strings requieren la letra `f` antes de las comillas iniciales y las variables encerradas entre llaves `{variable}`.'
  },
  {
    id: 'q_m9_7',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Combinación de end y texto',
    difficulty: 'hard',
    category: 'print',
    categoryLabel: 'print()',
    type: 'code_output',
    question: '¿Qué salida exacta produce este código en consola?',
    codeSnippet: 'print("A", end="")\nprint("B", end="-")\nprint("C")',
    options: [
      'A\\nB-\\nC',
      'AB-C',
      'A B - C',
      'ABC-'
    ],
    correctAnswer: 1,
    explanation: '"A" se imprime sin salto de línea. Inmediatamente se imprime "B" con un guión final sin salto. Luego se imprime "C". Queda "AB-C".'
  },
  {
    id: 'q_m9_8',
    moduleId: 9,
    topic: 'La función print()',
    subtopic: 'Secuencias de escape',
    difficulty: 'hard',
    category: 'print',
    categoryLabel: 'print()',
    type: 'concept',
    question: '¿Qué secuencia de escape representa un salto de línea dentro de una cadena de texto en Python?',
    options: [
      '/n',
      '\\n',
      '\\t',
      '#line'
    ],
    correctAnswer: 1,
    explanation: 'La barra invertida seguida de la letra n (`\\n`) representa el carácter especial de nueva línea (*newline*).'
  },

  // ==========================================
  // MÓDULO 10: LA FUNCIÓN INPUT() (ANTES M9)
  // ==========================================
  {
    id: 'q_m10_1',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Propósito de input',
    difficulty: 'easy',
    category: 'input',
    categoryLabel: 'input()',
    type: 'concept',
    question: '¿Para qué sirve la función `input()` en Python?',
    options: [
      'Para imprimir un documento en una impresora',
      'Para solicitar y capturar datos que el usuario escribe desde el teclado',
      'Para calcular raíces cuadradas',
      'Para cerrar la ventana del sistema'
    ],
    correctAnswer: 1,
    explanation: '`input()` pausa la ejecución del programa y espera que el usuario escriba un dato en la consola y presione Enter.'
  },
  {
    id: 'q_m10_2',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Tipo devuelto por input',
    difficulty: 'easy',
    category: 'input',
    categoryLabel: 'input()',
    type: 'concept',
    question: '¿Qué tipo de dato devuelve SIEMPRE la función `input()` en Python 3?',
    options: [
      'int si el usuario escribe solo números',
      'str (cadena de texto) siempre, sin importar lo que el usuario haya escrito',
      'float',
      'bool'
    ],
    correctAnswer: 1,
    explanation: 'Regla de oro de `input()`: siempre retorna una cadena de texto (`str`). Si el usuario escribe 25, devuelve el texto `"25"`.'
  },
  {
    id: 'q_m10_3',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Multiplicación de texto tras input',
    difficulty: 'medium',
    category: 'input',
    categoryLabel: 'input()',
    type: 'code_output',
    question: 'Si el usuario escribe el número 5, ¿qué imprime el siguiente código?',
    codeSnippet: '# El usuario escribe 5\nnumero = input("Ingresá un número: ")\nprint(numero * 2)',
    options: [
      '10',
      '55',
      'Error de cálculo',
      '25'
    ],
    correctAnswer: 1,
    explanation: 'Como `numero` almacena el texto `"5"`, la operación `"5" * 2` repite la cadena de caracteres dos veces, produciendo "55".'
  },
  {
    id: 'q_m10_4',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Conversión explícita con int()',
    difficulty: 'medium',
    category: 'input',
    categoryLabel: 'input()',
    type: 'concept',
    question: '¿Cómo debe escribirse la captura de edad para poder usarla como número entero matemático?',
    options: [
      'edad = input(int())',
      'edad = int(input("Ingresá tu edad: "))',
      'edad = input("Ingresá tu edad: ") + int',
      'edad = to_number(input())'
    ],
    correctAnswer: 1,
    explanation: 'Envolvemos `input()` dentro de `int()`: primero se captura el texto y luego `int()` lo convierte en número entero.'
  },
  {
    id: 'q_m10_5',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Error ValueError en conversión',
    difficulty: 'medium',
    category: 'input',
    categoryLabel: 'input()',
    type: 'error_detection',
    question: '¿Qué ocurre si el usuario escribe `"hola"` cuando el código ejecuta `int(input())`?',
    options: [
      'Se guarda como 0 automáticamente',
      'Se produce un error de tipo ValueError porque el texto no se puede convertir a número entero',
      'El programa se traduce a otro idioma',
      'Se guarda como False'
    ],
    correctAnswer: 1,
    explanation: 'Si la cadena de caracteres no contiene dígitos numéricos válidos, la función `int()` arroja una excepción `ValueError`.'
  },
  {
    id: 'q_m10_6',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Conversión a decimal con float()',
    difficulty: 'medium',
    category: 'input',
    categoryLabel: 'input()',
    type: 'concept',
    question: '¿Cómo se captura correctamente un número con decimales ingresado por el usuario?',
    options: [
      'precio = decimal(input())',
      'precio = float(input("Ingresá el precio: "))',
      'precio = int(input())',
      'precio = input().toFloat()'
    ],
    correctAnswer: 1,
    explanation: 'Para capturar y convertir un número que admita decimales, se utiliza la función `float(input(...))`.'
  },
  {
    id: 'q_m10_7',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Suma vs Concatenación tras input',
    difficulty: 'hard',
    category: 'input',
    categoryLabel: 'input()',
    type: 'code_output',
    question: 'Si el usuario ingresa 4 en el primer input y 3 en el segundo, ¿qué imprime?',
    codeSnippet: 'a = input()\nb = input()\nprint(a + b)',
    options: [
      '7',
      '43',
      '12',
      'Error de suma'
    ],
    correctAnswer: 1,
    explanation: 'Ambas variables son del tipo `str`. El operador `+` entre textos los concatena, mostrando "43" en lugar de sumar matemáticamente.'
  },
  {
    id: 'q_m10_8',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Conversión directa de texto con decimales',
    difficulty: 'hard',
    category: 'input',
    categoryLabel: 'input()',
    type: 'error_detection',
    question: '¿Qué ocurre si intentamos convertir directamente la cadena `"3.14"` con `int("3.14")`?',
    options: [
      'Devuelve el entero 3 descartando los decimales',
      'Produce un error ValueError porque la cadena contiene un punto decimal y no un entero directo',
      'Devuelve 3.14 como float',
      'Devuelve 0'
    ],
    correctAnswer: 1,
    explanation: '`int()` solo puede convertir textos que contengan dígitos enteros directos. Para convertir `"3.14"`, primero se debe convertir con `float("3.14")`.'
  },
  {
    id: 'q_m10_9',
    moduleId: 10,
    topic: 'La función input()',
    subtopic: 'Mensaje de prompt',
    difficulty: 'hard',
    category: 'input',
    categoryLabel: 'input()',
    type: 'concept',
    question: '¿Qué función cumple el argumento que se pasa dentro de `input("Escribí tu nombre: ")`?',
    options: [
      'Es el valor por defecto si el usuario no escribe nada',
      'Es el mensaje instructivo (prompt) que se muestra en consola para orientar al usuario',
      'Es la variable donde se guardará el dato',
      'Es la contraseña obligatoria del programa'
    ],
    correctAnswer: 1,
    explanation: 'El texto dentro de `input(...)` se denomina prompt o indicador: se proyecta en consola antes de la captura para que el usuario sepa qué debe tipear.'
  },

  // ==========================================
  // MÓDULO 11: INTRODUCCIÓN A CONDICIONALES (ANTES M10)
  // ==========================================
  {
    id: 'q_m11_1',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Estructura if',
    difficulty: 'easy',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'concept',
    question: '¿Qué palabra clave se utiliza en Python para ejecutar un bloque de código solo si una condición es verdadera?',
    options: [
      'when',
      'if',
      'check',
      'condition'
    ],
    correctAnswer: 1,
    explanation: 'La instrucción `if` (si condicional) evalúa una expresión lógica y ejecuta el bloque identado solo si el resultado es True.'
  },
  {
    id: 'q_m11_2',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Cláusula else',
    difficulty: 'easy',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'concept',
    question: '¿Qué palabra clave indica el bloque alternativo que se ejecuta cuando la condición del `if` es falsa?',
    options: [
      'otherwise',
      'else',
      'then',
      'default'
    ],
    correctAnswer: 1,
    explanation: 'La cláusula `else` (sino) define las instrucciones que deben ejecutarse cuando la condición del `if` no se cumplió.'
  },
  {
    id: 'q_m11_3',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Cláusula elif',
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'concept',
    question: '¿Qué palabra clave combina `else` e `if` para evaluar múltiples condiciones encadenadas en Python?',
    options: [
      'elseif',
      'elif',
      'elsif',
      'case'
    ],
    correctAnswer: 1,
    explanation: 'Python utiliza la palabra reservada `elif` (abreviatura de else if) para comprobar condiciones secundarias en secuencia.'
  },
  {
    id: 'q_m11_4',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Indentación de bloques',
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'concept',
    question: 'En Python, ¿cómo se delimita qué instrucciones pertenecen al bloque dentro de un `if`?',
    options: [
      'Encerrando las instrucciones entre llaves { }',
      'Escribiendo la palabra END al final',
      'Mediante la indentación (sangría consistente de 4 espacios a la derecha)',
      'Subrayando el texto del código'
    ],
    correctAnswer: 2,
    explanation: 'A diferencia de otros lenguajes que usan llaves, Python utiliza la indentación obligatoria para definir la jerarquía de bloques de código.'
  },
  {
    id: 'q_m11_5',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Trazado if-else básico',
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'nota = 7\nif nota >= 6:\n    print("Aprobado")\nelse:\n    print("Reprobado")',
    options: [
      'Aprobado',
      'Reprobado',
      'Aprobado Reprobado',
      'Error de sintaxis'
    ],
    correctAnswer: 0,
    explanation: 'La variable `nota` vale 7. La condición `7 >= 6` es True, por lo que se ejecuta la rama del `if` e imprime "Aprobado".'
  },
  {
    id: 'q_m11_6',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Ausencia de cláusula else',
    difficulty: 'medium',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'concept',
    question: '¿Qué ocurre si ninguna de las condiciones en una estructura `if - elif - elif` es verdadera y no hay bloque `else`?',
    options: [
      'El programa se detiene con un error crítico',
      'El programa simplemente no ejecuta ninguna de las ramas y continúa con las líneas siguientes',
      'Se repite el código desde el principio',
      'Se imprime False en pantalla'
    ],
    correctAnswer: 1,
    explanation: 'Si ninguna condición es verdadera y no existe un `else` por descarte, Python omite la estructura condicional y sigue ejecutando.'
  },
  {
    id: 'q_m11_7',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Condicionales anidados',
    difficulty: 'hard',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código condicional anidado?',
    codeSnippet: 'x = 12\nif x > 5:\n    if x < 15:\n        print("En rango")\n    else:\n        print("Mayor")',
    options: [
      'Mayor',
      'En rango',
      'En rango Mayor',
      'No imprime nada'
    ],
    correctAnswer: 1,
    explanation: '`x = 12 > 5` es True, ingresa al primer bloque. Luego `12 < 15` también es True, por lo que imprime "En rango".'
  },
  {
    id: 'q_m11_8',
    moduleId: 11,
    topic: 'Condicionales',
    subtopic: 'Encadenamiento con múltiples elif',
    difficulty: 'hard',
    category: 'conditionals',
    categoryLabel: 'Condicionales',
    type: 'code_output',
    question: '¿Qué imprime este código con múltiples ramas elif?',
    codeSnippet: 'a = 5\nif a > 10:\n    print("A")\nelif a > 3:\n    print("B")\nelif a > 0:\n    print("C")',
    options: [
      'B C',
      'B',
      'C',
      'A B C'
    ],
    correctAnswer: 1,
    explanation: 'Python evalúa en orden. `5 > 10` es False. `5 > 3` es True, por lo que ejecuta "B" y de inmediato abandona toda la estructura sin evaluar el siguiente elif.'
  },

  // ==========================================
  // MÓDULO 12: INTRODUCCIÓN A LOOPS (ANTES M11)
  // ==========================================
  {
    id: 'q_m12_1',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Concepto de bucle',
    difficulty: 'easy',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: 'En programación, ¿qué es un bucle (loop o ciclo)?',
    options: [
      'Un error que congela la máquina',
      'Una estructura de control que repite un bloque de código varias veces según una condición o secuencia',
      'Una función que borra las variables',
      'Una conexión entre dos computadoras'
    ],
    correctAnswer: 1,
    explanation: 'Un bucle permite automatizar la repetición de tareas sin tener que copiar y pegar las mismas instrucciones manualmente.'
  },
  {
    id: 'q_m12_2',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Concepto de iteración',
    difficulty: 'easy',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué término describe a cada una de las repeticiones individuales de un bucle?',
    options: [
      'Paso',
      'Iteración',
      'Vuelta de reloj',
      'Ronda'
    ],
    correctAnswer: 1,
    explanation: 'Cada repetición o ejecución completa del cuerpo de un bucle se denomina formalmente una "iteración".'
  },
  {
    id: 'q_m12_3',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Tipos de bucles',
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Cuáles son los dos tipos principales de bucles que ofrece Python?',
    options: [
      'repeat y until',
      'for y while',
      'loop y cycle',
      'do y while'
    ],
    correctAnswer: 1,
    explanation: 'Python cuenta con dos estructuras de repetición nativas: `for` (iteración sobre secuencias) y `while` (repetición condicionada).'
  },
  {
    id: 'q_m12_4',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Bucle infinito',
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué es un "bucle infinito" en un programa?',
    options: [
      'Un bucle que nunca se detiene porque su condición de parada nunca llega a ser falsa',
      'Un bucle que recorre todos los números del universo',
      'Un bucle muy rápido',
      'Un bucle que no tiene código adentro'
    ],
    correctAnswer: 0,
    explanation: 'Ocurre cuando la condición de salida del bucle nunca cambia a False, haciendo que el programa quede atrapado repitiendo para siempre.'
  },
  {
    id: 'q_m12_5',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Variables acumuladoras',
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué es una variable "acumuladora" en un ciclo?',
    options: [
      'Una variable que solo cuenta de 1 en 1',
      'Una variable que suma o acumula cantidades variables en cada vuelta (ej: `total = total + precio`)',
      'Una variable que borra datos viejos',
      'Una variable que almacena solo nombres'
    ],
    correctAnswer: 1,
    explanation: 'Un acumulador almacena sumas o totales progresivos sumando valores que pueden cambiar en cada iteración.'
  },
  {
    id: 'q_m12_6',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Variables contadoras',
    difficulty: 'medium',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué es una variable "contadora" en un bucle?',
    options: [
      'Una variable que incrementa su valor en un paso constante para registrar cuántas veces ocurrió un evento (ej: `c = c + 1`)',
      'Un contador que mide los segundos de internet',
      'Una variable que guarda contraseñas',
      'Una función de Python'
    ],
    correctAnswer: 0,
    explanation: 'Un contador suele incrementarse en 1 (o valor fijo) para contabilizar cuántas vueltas o sucesos tuvieron lugar.'
  },
  {
    id: 'q_m12_7',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Instrucción break',
    difficulty: 'hard',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué instrucción permite interrumpir y salir inmediatamente de un bucle antes de que complete sus iteraciones?',
    options: [
      'stop',
      'break',
      'exit',
      'return'
    ],
    correctAnswer: 1,
    explanation: 'La instrucción `break` cancela inmediatamente la ejecución del bucle actual y transfiere el control a la línea siguiente al bucle.'
  },
  {
    id: 'q_m12_8',
    moduleId: 12,
    topic: 'Introducción a Loops',
    subtopic: 'Instrucción continue',
    difficulty: 'hard',
    category: 'loops_intro',
    categoryLabel: 'Loops',
    type: 'concept',
    question: '¿Qué instrucción permite omitir el resto del código de la iteración actual y pasar directamente a la siguiente vuelta?',
    options: [
      'skip',
      'continue',
      'next',
      'pass'
    ],
    correctAnswer: 1,
    explanation: 'La instrucción `continue` saltea las líneas restantes de la vuelta actual y salta al inicio de la siguiente iteración.'
  },

  // ==========================================
  // MÓDULO 13: EL BUCLE FOR (ANTES M12)
  // ==========================================
  {
    id: 'q_m13_1',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'Propósito de for',
    difficulty: 'easy',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'concept',
    question: '¿Para qué se utiliza principalmente el bucle `for` en Python?',
    options: [
      'Para repetir código de forma indeterminada hasta que se corte la luz',
      'Para iterar sobre los elementos de una secuencia o un rango de valores conocido de antemano',
      'Para definir el nombre de las variables',
      'Para importar librerías'
    ],
    correctAnswer: 1,
    explanation: 'El bucle `for` está diseñado para recorrer secuencias o rangos definidos de elementos uno por uno.'
  },
  {
    id: 'q_m13_2',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'Función range()',
    difficulty: 'easy',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'concept',
    question: '¿Qué función incorporada de Python se utiliza habitualmente con `for` para generar secuencias numéricas?',
    options: [
      'numbers()',
      'range()',
      'sequence()',
      'count()'
    ],
    correctAnswer: 1,
    explanation: '`range()` genera una secuencia aritmética de números enteros muy utilizada para controlar cuántas veces itera un bucle for.'
  },
  {
    id: 'q_m13_3',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'range(stop) exclusivo',
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Qué valores imprime el siguiente bucle?',
    codeSnippet: 'for i in range(3):\n    print(i, end=" ")',
    options: [
      '1 2 3 ',
      '0 1 2 ',
      '0 1 2 3 ',
      '3 3 3 '
    ],
    correctAnswer: 1,
    explanation: '`range(3)` inicia por defecto en 0 y se detiene antes de llegar a 3 (el límite superior es excluyente). Genera 0, 1 y 2.'
  },
  {
    id: 'q_m13_4',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'range(start, stop)',
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Qué secuencia genera la instrucción `range(2, 6)`?',
    options: [
      '2, 3, 4, 5, 6',
      '2, 3, 4, 5',
      '3, 4, 5, 6',
      '2, 4, 6'
    ],
    correctAnswer: 1,
    explanation: 'Comienza en 2 y termina en el anterior a 6: los números generados son 2, 3, 4 y 5.'
  },
  {
    id: 'q_m13_5',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'range con paso (step)',
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Qué imprime el siguiente bucle con paso o salto de 2?',
    codeSnippet: 'for n in range(2, 9, 2):\n    print(n, end=" ")',
    options: [
      '2 4 6 8 ',
      '2 4 6 8 10 ',
      '2 3 4 5 6 7 8 ',
      '2 9 2 '
    ],
    correctAnswer: 0,
    explanation: 'Inicia en 2 y avanza de 2 en 2 hasta antes de 9: imprime 2, 4, 6 y 8.'
  },
  {
    id: 'q_m13_6',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'Acumulación con range',
    difficulty: 'medium',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Qué imprime el siguiente acumulador con bucle for?',
    codeSnippet: 'total = 0\nfor n in range(1, 5):\n    total += n\nprint(total)',
    options: [
      '15',
      '10',
      '4',
      '5'
    ],
    correctAnswer: 1,
    explanation: '`range(1, 5)` entrega 1, 2, 3 y 4. La sumatoria acumulada es 1 + 2 + 3 + 4 = 10.'
  },
  {
    id: 'q_m13_7',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'Iteración sobre texto',
    difficulty: 'hard',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Cuántas veces se ejecuta el bloque interno de este bucle for que recorre un string?',
    codeSnippet: 'contador = 0\nfor letra in "Python":\n    contador += 1\nprint(contador)',
    options: [
      '1',
      '5',
      '6',
      '7'
    ],
    correctAnswer: 2,
    explanation: 'La palabra "Python" tiene 6 letras. El bucle `for` itera una vez por cada carácter de la cadena, por lo que el contador llega a 6.'
  },
  {
    id: 'q_m13_8',
    moduleId: 13,
    topic: 'Bucle for',
    subtopic: 'Break dentro de for',
    difficulty: 'hard',
    category: 'loops_for',
    categoryLabel: 'Bucle for',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código con break dentro del for?',
    codeSnippet: 'for i in range(5):\n    if i == 2:\n        break\n    print(i, end="")',
    options: [
      '012',
      '01',
      '01234',
      '2'
    ],
    correctAnswer: 1,
    explanation: 'Con i=0 imprime 0. Con i=1 imprime 1. Con i=2 se activa `i == 2` y ejecuta `break`, saliendo del bucle antes de imprimir el 2.'
  },

  // ==========================================
  // MÓDULO 14: EL BUCLE WHILE (ANTES M13)
  // ==========================================
  {
    id: 'q_m14_1',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Condición de while',
    difficulty: 'easy',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'concept',
    question: '¿Cuándo continúa repitiéndose un bucle `while` en Python?',
    options: [
      'Solo se ejecuta una única vez',
      'Mientras su condición lógica se evalúe como True',
      'Cuando la condición se vuelve False',
      'Hasta que el usuario apague la computadora'
    ],
    correctAnswer: 1,
    explanation: '`while` significa "mientras". Continúa iterando siempre que la condición sea verdadera; cuando pasa a False, el ciclo termina.'
  },
  {
    id: 'q_m14_2',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Condición falsa inicial',
    difficulty: 'easy',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'concept',
    question: '¿Qué ocurre si la condición de un bucle `while` es `False` antes de ingresar por primera vez?',
    options: [
      'El programa se detiene con un error',
      'El bloque interno nunca se ejecuta (cero iteraciones)',
      'Se ejecuta al menos una vez obligatoriamente',
      'Se convierte en bucle infinito'
    ],
    correctAnswer: 1,
    explanation: 'A diferencia de otros lenguajes con "do-while", el `while` de Python evalúa la condición al inicio. Si es falsa de entrada, saltea el bucle completamente.'
  },
  {
    id: 'q_m14_3',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Trazado ascendente simple',
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'code_output',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'c = 1\nwhile c < 4:\n    c += 1\nprint(c)',
    options: [
      '3',
      '4',
      '5',
      '1 2 3 4'
    ],
    correctAnswer: 1,
    explanation: 'c=1 (<4: c pasa a 2). c=2 (<4: c pasa a 3). c=3 (<4: c pasa a 4). c=4 (4 < 4 es False: termina el ciclo). Se imprime 4.'
  },
  {
    id: 'q_m14_4',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Actualización de variable de control',
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'concept',
    question: '¿Qué elemento es indispensable dentro del cuerpo de un bucle `while` dependiente de una variable de control?',
    options: [
      'Una llamada a print()',
      'Actualizar o modificar la variable para que la condición pueda eventualmente volverse False',
      'Un comentario con #',
      'Una f-string'
    ],
    correctAnswer: 1,
    explanation: 'Si la variable que controla la condición nunca cambia dentro del cuerpo del bucle, la condición nunca será False y generará un bucle infinito.'
  },
  {
    id: 'q_m14_5',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Elección entre for y while',
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'concept',
    question: '¿Para qué escenario es más apropiado utilizar un bucle `while` en lugar de un `for`?',
    options: [
      'Cuando sabemos exactamente que queremos repetir algo 10 veces',
      'Cuando no sabemos de antemano cuántas vueltas serán necesarias (ej: esperar que el usuario ingrese una contraseña válida)',
      'Para recorrer las letras de una palabra',
      'Para sumar los números del 1 al 100'
    ],
    correctAnswer: 1,
    explanation: '`while` es ideal para repeticiones condicionadas por eventos o entradas donde el número de iteraciones es incierto al inicio.'
  },
  {
    id: 'q_m14_6',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Contador decreciente',
    difficulty: 'medium',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'code_output',
    question: '¿Qué imprime este bucle while con contador decreciente?',
    codeSnippet: 'x = 3\nwhile x > 0:\n    x -= 1\nprint(x)',
    options: [
      '1',
      '0',
      '-1',
      '3'
    ],
    correctAnswer: 1,
    explanation: 'x pasa de 3 a 2, de 2 a 1, y de 1 a 0. Cuando x vale 0, `0 > 0` es False, el bucle finaliza y se imprime 0.'
  },
  {
    id: 'q_m14_7',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Continue en while',
    difficulty: 'hard',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'code_output',
    question: '¿Qué imprime el siguiente bucle con continue?',
    codeSnippet: 'n = 0\nwhile n < 3:\n    n += 1\n    if n == 2:\n        continue\n    print(n, end="")',
    options: [
      '123',
      '13',
      '23',
      '1'
    ],
    correctAnswer: 1,
    explanation: 'n=1: imprime 1. n=2: activa `continue`, salteando el print. n=3: imprime 3. Luego termina. Salida: 13.'
  },
  {
    id: 'q_m14_8',
    moduleId: 14,
    topic: 'Bucle while',
    subtopic: 'Paso negativo y valor final',
    difficulty: 'hard',
    category: 'loops_while',
    categoryLabel: 'Bucle while',
    type: 'code_output',
    question: '¿Qué imprime este código con bucle while y decremento de 2?',
    codeSnippet: 'val = 5\nwhile val > 0:\n    val -= 2\nprint(val)',
    options: [
      '1',
      '0',
      '-1',
      '3'
    ],
    correctAnswer: 2,
    explanation: 'val=5 (>0: val pasa a 3). val=3 (>0: val pasa a 1). val=1 (>0: val pasa a -1). val=-1 (-1 > 0 es False: termina). Se imprime -1.'
  },

  // ==========================================
  // MÓDULO 15: INTEGRACIÓN Y PROYECTOS (ANTES M14)
  // ==========================================
  {
    id: 'q_m15_1',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Concepto de integración',
    difficulty: 'easy',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'concept',
    question: '¿Qué significa "integrar conceptos" en el desarrollo de un programa en Python?',
    options: [
      'Copiar código de internet sin entenderlo',
      'Combinar de manera armónica variables, operadores, entrada/salida, condicionales y bucles para resolver un problema real',
      'Escribir todo el código en un archivo de texto plano sin probarlo',
      'Borrar todas las funciones del programa'
    ],
    correctAnswer: 1,
    explanation: 'La integración consiste en articular todas las herramientas básicas aprendidas para construir aplicaciones funcionales y completas.'
  },
  {
    id: 'q_m15_2',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Patrón de menú interactivo',
    difficulty: 'easy',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'concept',
    question: 'En un programa interactivo con menú por consola, ¿qué estructura suele utilizarse para mantener el menú activo hasta que el usuario decida salir?',
    options: [
      'Un bucle infinito `while True` con condicionales para las opciones y un `break` en la opción de salida',
      'Un print() repetido 100 veces',
      'Una variable llamada menu',
      'Un if sin else'
    ],
    correctAnswer: 0,
    explanation: 'El patrón clásico de menús en consola utiliza `while True` para presentar opciones una y otra vez hasta que una rama condicional ejecuta `break`.'
  },
  {
    id: 'q_m15_3',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Combinación for, range y módulo',
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'code_output',
    question: '¿Qué imprime este algoritmo que combina for, range y condicional if?',
    codeSnippet: 'suma_pares = 0\nfor n in range(1, 6):\n    if n % 2 == 0:\n        suma_pares += n\nprint(suma_pares)',
    options: [
      '15',
      '6',
      '12',
      '2'
    ],
    correctAnswer: 1,
    explanation: 'En el rango del 1 al 5, los números pares son 2 y 4. La suma acumulada es 2 + 4 = 6.'
  },
  {
    id: 'q_m15_4',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Validación de datos',
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'concept',
    question: '¿Por qué es una buena práctica de integración validar los datos que ingresa el usuario antes de procesarlos?',
    options: [
      'Para hacer el programa más lento',
      'Para evitar errores en tiempo de ejecución y asegurar que el programa reciba valores válidos',
      'Porque Python no permite ejecutar sin validación',
      'Para ocupar más espacio en disco'
    ],
    correctAnswer: 1,
    explanation: 'La validación previene fallas del sistema asegurando que los datos coincidan con lo que el algoritmo espera antes de operar sobre ellos.'
  },
  {
    id: 'q_m15_5',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Conteo condicional con range',
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'code_output',
    question: '¿Cuántos números impares cuenta el siguiente código integrado?',
    codeSnippet: 'impares = 0\nfor x in range(3, 8):\n    if x % 2 != 0:\n        impares += 1\nprint(impares)',
    options: [
      '2',
      '3',
      '5',
      '1'
    ],
    correctAnswer: 1,
    explanation: '`range(3, 8)` genera los valores 3, 4, 5, 6 y 7. Los números impares son 3, 5 y 7. El contador se incrementa 3 veces.'
  },
  {
    id: 'q_m15_6',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Mantenimiento y modularidad',
    difficulty: 'medium',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'concept',
    question: '¿Qué principio de programación facilita el mantenimiento cuando un proyecto de Python crece?',
    options: [
      'Escribir todo el código en una sola línea larguísima',
      'Descomponer el problema en partes claras con variables descriptivas y bloques ordenados',
      'Usar variables de una sola letra sin explicación',
      'Nunca probar el programa'
    ],
    correctAnswer: 1,
    explanation: 'La modularidad, legibilidad y el uso de identificadores descriptivos reducen la complejidad cognitiva y facilitan depurar y expandir el software.'
  },
  {
    id: 'q_m15_7',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Algoritmo de búsqueda de mayor con range',
    difficulty: 'hard',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'code_output',
    question: '¿Qué imprime el siguiente algoritmo de búsqueda implementado con range?',
    codeSnippet: 'mayor = 0\nfor n in range(1, 10, 3):\n    if n > mayor:\n        mayor = n\nprint(mayor)',
    options: [
      '1',
      '4',
      '7',
      '10'
    ],
    correctAnswer: 2,
    explanation: '`range(1, 10, 3)` genera los números 1, 4 y 7. El mayor de ellos al finalizar el recorrido es 7.'
  },
  {
    id: 'q_m15_8',
    moduleId: 15,
    topic: 'Integración',
    subtopic: 'Metodología de desarrollo',
    difficulty: 'hard',
    category: 'integration',
    categoryLabel: 'Integración',
    type: 'concept',
    question: '¿Cuál es el ciclo de desarrollo recomendado para resolver un problema de programación integral?',
    options: [
      'Escribir código al azar -> cruzar los dedos -> entregar',
      '1. Comprender el problema -> 2. Diseñar el algoritmo lógico -> 3. Escribir el código en Python -> 4. Probar y depurar casos límite',
      'Copiar la primera respuesta de internet sin leer el problema',
      'Memorizar el código de memoria'
    ],
    correctAnswer: 1,
    explanation: 'El proceso metodológico de la ingeniería de software inicia siempre con el entendimiento del problema y diseño lógico antes de codificar y probar.'
  }
];

/**
 * Generador de números pseudoaleatorios (PRNG) determinístico basado en Mulberry32.
 */
function createSeededRandom(seedString: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(h ^ seedString.charCodeAt(i), 16777619);
  }
  let state = h >>> 0;

  return function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mezcla un array in-place utilizando el algoritmo Fisher-Yates con un generador determinista.
 */
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
export function getMatchQuestions(
  seedOrMatchId: string = 'match_seed_default',
  maxAllowedModule: number = 15
): MatchQuestion[] {
  const safeMaxModule = Math.max(1, Math.min(15, maxAllowedModule || 1));
  const prng = createSeededRandom(seedOrMatchId);

  // 1. Filtrar preguntas dentro del conjunto estricto de contenidos permitidos
  const allowedPool = ONLINE_QUESTIONS_BANK.filter(q => q.moduleId <= safeMaxModule);

  // Garantía pedagógica: el pool permitido NUNCA recurre a módulos posteriores
  const pool = allowedPool.length >= 10 
    ? allowedPool 
    : ONLINE_QUESTIONS_BANK.filter(q => q.moduleId <= Math.max(2, safeMaxModule));

  // 2. Separar por dificultad dentro del pool permitido
  const easyPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'easy'), prng);
  const mediumPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'medium'), prng);
  const hardPool = shuffleDeterministic(pool.filter(q => q.difficulty === 'hard'), prng);

  // 3. Objetivos pedagógicos: 3 fáciles, 4 medias, 3 difíciles
  const targetEasy = 3;
  const targetMedium = 4;
  const targetHard = 3;

  const selected: MatchQuestion[] = [];
  const selectedIds = new Set<string>();

  const takeFrom = (source: MatchQuestion[], count: number) => {
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

  // 4. Backfill de seguridad garantizando siempre que q.moduleId <= safeMaxModule
  if (selected.length < 10) {
    const remaining = shuffleDeterministic(pool.filter(q => !selectedIds.has(q.id)), prng);
    for (const q of remaining) {
      if (selected.length >= 10) break;
      selected.push(q);
      selectedIds.add(q.id);
    }
  }

  // Si aún faltara (ej. nivel 1 con repetición permitida en caso extremo)
  if (selected.length < 10) {
    for (const q of pool) {
      if (selected.length >= 10) break;
      selected.push(q);
    }
  }

  // 5. Mezclar las 10 preguntas de forma determinista para que ambos jugadores tengan el mismo orden
  const finalOrdered = shuffleDeterministic(selected, prng);

  return finalOrdered.slice(0, 10);
}

/**
 * Busca una pregunta por su identificador único.
 */
export function getQuestionById(id: string): MatchQuestion | undefined {
  return ONLINE_QUESTIONS_BANK.find(q => q.id === id);
}
