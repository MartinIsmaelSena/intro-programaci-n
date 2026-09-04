import { CourseModule } from '../../types/course';

export const module01: CourseModule = {
  id: 1,
  number: 1,
  title: 'Introducción a la programación',
  subtitle: '¿Qué significa programar y cómo piensa una computadora?',
  description: 'Descubre los fundamentos del pensamiento computacional, qué es un algoritmo y cómo traducir problemas de la vida cotidiana en instrucciones lógicas paso a paso.',
  icon: '🌱',
  estimatedTime: '25 min',
  category: 'fundamentos',
  theory: [
    {
      id: 'm1_t1',
      title: '1. ¿Qué es la programación y qué hace un programador?',
      content: 'Programar no es magia ni memorizar fórmulas complejas. **Programar es comunicarte con una computadora para darle instrucciones precisas que le permitan resolver un problema o realizar una tarea automatizada**.\n\nUna computadora es una máquina increíblemente veloz para hacer cálculos, pero carece de sentido común e intuición. No puede "adivinar" lo que queremos. Un programador actúa como un **traductor y estratega**: descompone un problema grande en pequeños pasos lógicos y los escribe en un lenguaje que la máquina pueda interpretar y ejecutar de forma rigurosa.',
      keyTakeaways: [
        'Una computadora ejecuta exactamente lo que se le indica, ni más ni menos.',
        'Programar consiste en pensar soluciones paso a paso y expresarlas en un lenguaje formal.',
        'El rol del programador es resolver problemas mediante la lógica.'
      ]
    },
    {
      id: 'm1_t2',
      title: '2. ¿Qué es un algoritmo? El ejemplo del mate o café',
      content: 'Un **algoritmo** es una secuencia ordenada, finita y precisa de instrucciones para alcanzar un objetivo o resolver una situación.\n\nTodos los días ejecutamos algoritmos sin darnos cuenta: al seguir una receta de cocina, al atarnos los cordones o al preparar una infusión caliente.',
      analogy: {
        title: 'Analogía cotidiana: Preparar un Mate',
        description: 'Si tuvieras que darle instrucciones a un robot que no sabe nada sobre costumbres humanas, no bastaría con decirle "hacete un mate". Necesita cada paso detallado:',
        steps: [
          'Paso 1: Buscar el recipiente del mate y la bombilla.',
          'Paso 2: Llenar tres cuartas partes del mate con yerba.',
          'Paso 3: Tapar la boca del mate con la mano, darlo vuelta y sacudirlo suavemente para quitar el polvillo.',
          'Paso 4: Inclinar la yerba a 45 grados e introducir la bombilla en el espacio libre.',
          'Paso 5: Calentar agua a 75°C - 80°C (¡sin que hierva!).',
          'Paso 6: Verter un chorrito de agua tibia cerca de la bombilla y esperar que absorba.',
          'Paso 7: Cebar con agua caliente y disfrutar.'
        ]
      },
      keyTakeaways: [
        'El orden de los pasos es fundamental: no podés verter el agua antes de poner la yerba.',
        'La precisión evita errores inesperados (si el agua hierve a 100°C, quemás la yerba).',
        'Un programa informático es simplemente un algoritmo escrito para una computadora.'
      ]
    },
    {
      id: 'm1_t3',
      title: '3. ¿Cómo ejecuta instrucciones una computadora?',
      content: 'En el hardware más profundo (el procesador central o CPU), la computadora solo entiende ceros y unos (**código binario**, presencia o ausencia de impulsos eléctricos). Como sería extremadamente lento y propenso a errores escribir millones de ceros y unos a mano, los humanos creamos los **lenguajes de programación de alto nivel** como Python.\n\nPython nos permite escribir instrucciones en palabras cercanas al idioma humano y la lógica matemática, mientras un traductor interno (el intérprete) se encarga de convertirlo al lenguaje de la máquina en tiempo real.',
      keyTakeaways: [
        'El procesador ejecuta millones de instrucciones por segundo de manera secuencial.',
        'Los lenguajes modernos nos permiten expresar ideas complejas de forma limpia y legible.',
        'Python es conocido mundialmente como el lenguaje más amigable para comenzar.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm1_q1',
      question: '¿Qué es programar?',
      options: [
        'Arreglar partes físicas de una computadora',
        'Escribir instrucciones ordenadas para resolver un problema',
        'Navegar por páginas de Internet y redes sociales',
        'Instalar juegos y aplicaciones en el teléfono'
      ],
      correctAnswer: 1,
      explanation: '¡Exacto! Programar consiste en diseñar y escribir una secuencia de instrucciones para que una computadora resuelva una tarea o problema.',
      hint: 'Pensá en qué necesita la computadora para saber exactamente qué debe hacer.'
    },
    {
      id: 'm1_q2',
      question: '¿Qué es un algoritmo?',
      options: [
        'Un componente físico de la computadora como el teclado',
        'Una serie de pasos ordenados y finitos para lograr un objetivo',
        'Un virus informático que borra archivos',
        'Una marca de computadoras portátiles'
      ],
      correctAnswer: 1,
      explanation: '¡Muy bien! Un algoritmo es una receta lógica: un conjunto de pasos claros y ordenados para llegar a un resultado.',
      hint: 'Recordá el ejemplo de la receta de cocina o preparar un mate.'
    },
    {
      id: 'm1_q3',
      question: 'Si alteramos el orden de las instrucciones en un algoritmo, ¿qué suele ocurrir?',
      options: [
        'Nada, la computadora siempre adivina nuestra verdadera intención',
        'El resultado puede fallar, ser incorrecto o generar un error',
        'La computadora se vuelve automáticamente el doble de rápida',
        'El programa se traduce solo a otro idioma'
      ],
      correctAnswer: 1,
      explanation: 'Las computadoras ejecutan paso a paso en estricto orden. Si vertés agua hirviendo en la taza antes de poner el café o la yerba, el resultado no es el deseado.',
      hint: '¿Qué pasa si intentás ponerte los zapatos antes de ponerte las medias?'
    },
    {
      id: 'm1_q4',
      question: '¿Por qué no programamos directamente escribiendo ceros y unos (código binario)?',
      options: [
        'Porque está prohibido por las leyes internacionales',
        'Porque sería sumamente lento, agotador y propenso a equivocaciones para las personas',
        'Porque las computadoras actuales ya no utilizan electricidad',
        'Porque el código binario solo funciona en teléfonos móviles'
      ],
      correctAnswer: 1,
      explanation: '¡Así es! Los lenguajes de alto nivel como Python existen para que los humanos podamos expresar lógica de forma legible y eficiente.',
      hint: 'Imaginate tener que escribir 10.000 ceros y unos sin equivocarte en ninguno.'
    },
    {
      id: 'm1_q5',
      question: '¿Cuál de las siguientes actividades humanas cotidianas representa mejor un algoritmo?',
      options: [
        'Mirar una puesta de sol en silencio',
        'Seguir los pasos de una receta para hornear un bizcochuelo',
        'Dormir una siesta',
        'Sentir frío cuando llega el invierno'
      ],
      correctAnswer: 1,
      explanation: 'Una receta de cocina especifica ingredientes, cantidades y un orden estricto de pasos para obtener la torta.',
      hint: 'Buscá la opción que involucre instrucciones secuenciales para lograr una meta.'
    },
    {
      id: 'm1_q6',
      question: '¿Qué cualidad NO describe a una computadora estándar?',
      options: [
        'Gran velocidad para procesar cálculos numéricos',
        'Capacidad de almacenar enormes volúmenes de datos',
        'Intuición humana y sentido común para corregir pedidos ambiguos',
        'Ejecución estricta de las órdenes que recibe'
      ],
      correctAnswer: 2,
      explanation: 'Las computadoras no tienen sentido común ni intuición. Si le das una instrucción equivocada, la ejecutará fielmente.',
      hint: 'Pensá en qué cosas solo puede aportar un ser humano consciente.'
    },
    {
      id: 'm1_q7',
      question: '¿A qué se le llama "lenguaje de programación de alto nivel"?',
      options: [
        'A un lenguaje con sintaxis cercana al razonamiento humano y fácil de leer',
        'A un lenguaje que solo pueden usar personas con doctorados universitarios',
        'A un lenguaje que cuesta mucho dinero comprar',
        'A un programa que solo funciona en satélites espaciales'
      ],
      correctAnswer: 0,
      explanation: '"Alto nivel" significa que está alejado de los detalles mecánicos del silicio y cercano al entendimiento conceptual de las personas.',
      hint: 'Se refiere al nivel de abstracción respecto al hardware físico.'
    },
    {
      id: 'm1_q8',
      question: '¿Qué es un "bug" o error en programación?',
      options: [
        'Un insecto que entra físicamente adentro del monitor',
        'Un fallo o comportamiento no deseado en el código de un programa',
        'Una tecla especial que tienen los teclados para programar',
        'Un tipo especial de computadora moderna'
      ],
      correctAnswer: 1,
      explanation: 'Un bug es un error o defecto en el código que hace que el programa no funcione como se esperaba. El proceso de encontrarlo y arreglarlo se llama depuración (debugging).',
      hint: 'Es cuando el programa no hace lo que querías que hiciera.'
    },
    {
      id: 'm1_q9',
      question: 'Cuando un programador se equivoca al escribir una instrucción:',
      options: [
        'Debe tirar la computadora y comprar una nueva',
        'Es algo totalmente normal y parte natural del proceso de aprendizaje y creación',
        'Significa que nunca podrá aprender a programar',
        'La computadora se apaga para siempre'
      ],
      correctAnswer: 1,
      explanation: '¡Totalmente cierto! Los errores son la principal fuente de aprendizaje en la programación. Todos los programadores del mundo conviven con errores a diario.',
      hint: 'Recordá la frase pedagógica: equivocarse es parte esencial del camino.'
    },
    {
      id: 'm1_q10',
      question: '¿Cuál es el primer paso antes de ponerse a escribir código en cualquier lenguaje?',
      options: [
        'Comprar la computadora más cara del mercado',
        'Entender bien el problema que se quiere resolver y planificar los pasos',
        'Memorizar todo el diccionario de palabras reservadas',
        'Apagar el monitor y escribir a oscuras'
      ],
      correctAnswer: 1,
      explanation: 'Antes de escribir una sola línea de código, lo más importante es tener total claridad sobre el problema y la estrategia de solución.',
      hint: '¿Qué hacés antes de empezar a construir una casa?'
    }
  ],
  exercises: [
    {
      id: 'm1_ex1',
      moduleId: 1,
      number: 1,
      title: 'Tu primer mensaje a la computadora',
      description: 'En programación, la instrucción más clásica para comenzar es hacer que la computadora imprima un saludo en la pantalla con `print()`. Escribe una instrucción que muestre: "Hola Mundo"',
      difficulty: 'starter',
      realWorldContext: 'Tradición informática universal desde los años 70.',
      starterCode: '# Escribe tu instrucción debajo:\n',
      solution: 'print("Hola Mundo")',
      hints: [
        'Utiliza la palabra clave print seguida de paréntesis: print(...)',
        'El texto debe ir entre comillas: "Hola Mundo"',
        'Tu código final debería ser exactamente: print("Hola Mundo")'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Mostrar Hola Mundo',
          expectedOutputs: ['Hola Mundo'],
          description: 'La salida debe contener el texto Hola Mundo'
        }
      ]
    },
    {
      id: 'm1_ex2',
      moduleId: 1,
      number: 2,
      title: 'Presentándote en la terminal',
      description: 'Haz que la computadora muestre tu profesión futura: imprime exactamente: "Estoy aprendiendo a programar"',
      difficulty: 'starter',
      realWorldContext: 'Mensaje de bienvenida al iniciar una aplicación educativa.',
      starterCode: '# Muestra en consola el mensaje solicitado:\n',
      solution: 'print("Estoy aprendiendo a programar")',
      hints: [
        'Usa la función print()',
        'Coloca el texto entre comillas dobles o simples dentro de los paréntesis',
        'Comprueba que no falte ninguna palabra ni tilde'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Mostrar mensaje de aprendizaje',
          expectedOutputs: ['Estoy aprendiendo a programar'],
          description: 'Debe imprimir Estoy aprendiendo a programar'
        }
      ]
    },
    {
      id: 'm1_ex3',
      moduleId: 1,
      number: 3,
      title: 'Secuencia de pasos para preparar mate',
      description: 'Escribe tres instrucciones print consecutivas que muestren los primeros 3 pasos de un algoritmo cotidiano:\nLínea 1: "Paso 1: Colocar yerba"\nLínea 2: "Paso 2: Calentar agua"\nLínea 3: "Paso 3: Servir mate"',
      difficulty: 'basic',
      realWorldContext: 'Secuencia lógica en una guía de preparación.',
      starterCode: '# Escribe los 3 pasos en líneas separadas:\n',
      solution: 'print("Paso 1: Colocar yerba")\nprint("Paso 2: Calentar agua")\nprint("Paso 3: Servir mate")',
      hints: [
        'Debes utilizar tres instrucciones print() separadas, una debajo de la otra.',
        'Cada print mostrará un paso diferente entre comillas.',
        'Asegúrate de respetar los textos: "Paso 1: Colocar yerba", etc.'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Secuencia completa de pasos',
          expectedOutputs: ['Paso 1: Colocar yerba', 'Paso 2: Calentar agua', 'Paso 3: Servir mate'],
          description: 'Debe imprimir los 3 pasos en orden secuencial'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm1_chal1',
    title: '🚀 Algoritmo de bienvenida personalizada',
    description: 'Crea un pequeño programa que imprima un cartel de bienvenida con 3 líneas:\n"===================="\n"  BIENVENIDO AL CURSO  "\n"===================="',
    bonusXp: 100,
    starterCode: '# Imprime el cartel decorativo:\n',
    solution: 'print("====================")\nprint("  BIENVENIDO AL CURSO  ")\nprint("====================")',
    hints: [
      'Utiliza tres llamadas a print()',
      'La primera y tercera línea son una serie de signos de igual "="',
      'La línea central contiene el texto rodeado de espacios'
    ],
    testCases: [
      {
        name: 'Cartel impreso correctamente',
        expectedOutputs: ['====================', 'BIENVENIDO AL CURSO'],
        description: 'Muestra el banner de apertura'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Qué es programar y el rol del pensamiento computacional',
      'Qué es un algoritmo y la importancia del orden estricto de las instrucciones',
      'Diferencia entre código binario y lenguajes de alto nivel como Python',
      'Los errores (bugs) como parte natural del aprendizaje'
    ],
    congratulationsMessage: '¡Completaste tu primer módulo! Ya entendés la lógica fundamental detrás de cómo piensan las computadoras.'
  }
};
