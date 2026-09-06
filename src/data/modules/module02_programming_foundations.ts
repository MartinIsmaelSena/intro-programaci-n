import { CourseModule } from '../../types/course';

export const module02: CourseModule = {
  id: 2,
  number: 2,
  title: 'Fundamentos de la programación',
  subtitle: 'Lógica, algoritmos, instrucciones y el modelo Entrada-Proceso-Salida',
  description: 'Comprende qué es un problema, cómo pensar de manera lógica y estructurada, y cómo diseñar algoritmos precisos utilizando el modelo universal Entrada → Proceso → Salida antes de escribir código.',
  icon: '🧠',
  estimatedTime: '30 min',
  category: 'fundamentos',
  theory: [
    {
      id: 'm2_t1',
      title: '1. ¿Qué es un problema y qué significa resolverlo mediante la lógica?',
      content: 'En nuestra vida diaria nos enfrentamos a desafíos constantemente: calcular cuánto vuelto debemos recibir, elegir el camino más rápido a la escuela o preparar una merienda. En informática, un **problema** es simplemente una situación inicial que queremos transformar en un resultado o meta deseada.\n\nPara resolver un problema con una computadora no basta con tener "buenas intenciones": se necesita **pensamiento lógico**. La lógica es la disciplina que nos enseña a razonar de forma ordenada, sin ambigüedades ni contradicciones.\n\nUna de las estrategias más poderosas del pensamiento computacional es la **descomposición**: tomar un problema grande y complejo y dividirlo en partes más pequeñas y manejables (*"divide y vencerás"*). Si sabemos resolver cada pequeña parte, resolveremos el problema completo.',
      keyTakeaways: [
        'Un problema es una brecha entre una situación actual y un objetivo que queremos alcanzar.',
        'La lógica nos permite razonar de manera clara, estructurada y sin contradicciones.',
        'La descomposición consiste en dividir un problema grande en pequeños pasos sencillos.'
      ]
    },
    {
      id: 'm2_t2',
      title: '2. Algoritmos, instrucciones y la importancia del orden',
      content: 'Un **algoritmo** es el corazón de la programación. Es un conjunto finito, ordenado y no ambiguo de instrucciones que indican, paso a paso, exactamente qué hacer para resolver una tarea.\n\nUna **instrucción** es una orden elemental y precisa que la computadora sabe ejecutar directamente. Las computadoras son máquinas estrictamente deterministas: si le damos la misma instrucción con los mismos datos, siempre producirá exactamente el mismo resultado.\n\nEl **orden de las instrucciones** es vital. En la vida real no podés ponerte las zapatillas antes de ponerte las medias; en la informática ocurre lo mismo: cambiar el orden de dos instrucciones suele provocar que el algoritmo falle por completo o entregue un resultado equivocado.',
      analogy: {
        title: 'Analogía: Cruzar la calle con seguridad',
        description: 'Imaginate un algoritmo para cruzar una avenida transitada:',
        steps: [
          'Paso 1: Detenerse en la esquina antes de bajar del cordón.',
          'Paso 2: Mirar hacia la izquierda y hacia la derecha.',
          'Paso 3: Esperar a que el semáforo peatonal esté en verde y no vengan vehículos.',
          'Paso 4: Caminar a paso firme en línea recta por la senda peatonal.'
        ]
      },
      keyTakeaways: [
        'Un algoritmo debe ser finito (tener principio y fin) y preciso (sin dudas de interpretación).',
        'Una instrucción es un paso individual que la máquina debe ejecutar al pie de la letra.',
        'Alterar el orden de las instrucciones en un algoritmo altera el resultado final o genera un error.'
      ]
    },
    {
      id: 'm2_t3',
      title: '3. El modelo universal: Entrada → Proceso → Salida (Dato vs. Información)',
      content: 'Casi cualquier sistema informático en el planeta (desde una calculadora de bolsillo hasta los algoritmos de las redes sociales) funciona bajo el esquema universal **Entrada → Proceso → Salida**:\n\n* **Entrada (Input):** Los datos iniciales que el sistema recibe del exterior (lo que ingresa el usuario o captan sensores).\n* **Proceso:** La transformación, cálculos matemáticos, comparaciones o decisiones que el algoritmo realiza sobre los datos de entrada.\n* **Salida (Output):** La información procesada y útil que se entrega al usuario (un mensaje en pantalla, un ticket, un sonido).\n\n### Dato vs. Información\n* Un **Dato** es un valor aislado y sin procesar, carente de contexto (por ejemplo, el número `39`).\n* La **Información** es el dato ya procesado, organizado y con significado práctico útil (por ejemplo: *"Temperatura corporal: 39°C — Estado: Fiebre alta"*).',
      keyTakeaways: [
        'Entrada: lo que entra al sistema. Proceso: lo que el algoritmo hace con ello. Salida: el resultado final útil.',
        'Los datos son la materia prima; la información es el producto final con sentido.',
        'Automatizar una tarea significa hacer que la computadora repita este proceso sin intervención humana constante.'
      ]
    },
    {
      id: 'm2_t4',
      title: '4. Algoritmo vs. Programa y errores de lógica',
      content: 'A menudo se confunden los términos **algoritmo** y **programa**:\n\n* Un **algoritmo** es la idea, la estrategia o la receta lógica. Podés escribir un algoritmo en un papel, en castellano o dibujarlo con flechas.\n* Un **programa** es ese mismo algoritmo traducido a un lenguaje de programación específico (como Python) para que una computadora real pueda ejecutarlo.\n\n### Errores de sintaxis vs. Errores de lógica\nCuando programamos podemos cometer dos grandes tipos de errores:\n1. **Error de sintaxis:** Escribir mal una palabra del lenguaje (por ejemplo, escribir `prnt` en lugar de `print`). La computadora avisa y se detiene.\n2. **Error de lógica:** El programa no se detiene ni da error rojo, pero el resultado que muestra es incorrecto porque el algoritmo estuvo mal pensado (por ejemplo, sumar cuando correspondía restar el descuento de una compra).\n\nPara encontrar errores de lógica usamos la **prueba de escritorio**: seguir el algoritmo paso a paso con lápiz y papel anotando qué hace en cada línea.',
      keyTakeaways: [
        'El algoritmo es la idea lógica; el programa es el código escrito en un lenguaje como Python.',
        'El error de sintaxis frena el programa; el error de lógica entrega resultados equivocados sin avisar.',
        'La prueba de escritorio nos permite verificar a mano que el razonamiento sea correcto antes de codificar.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm2_q1',
      question: '¿Qué es un algoritmo?',
      options: [
        'Una parte física de la computadora como el monitor o el teclado',
        'Una secuencia ordenada, finita y precisa de pasos para resolver un problema',
        'Un tipo de cable que conecta internet a la computadora',
        'Un virus informático que borra la memoria de la máquina'
      ],
      correctAnswer: 1,
      explanation: '¡Exacto! Un algoritmo es una receta lógica: un conjunto de pasos finitos y ordenados que resuelven una tarea sin ambigüedades.',
      hint: 'Recordá la analogía de la receta de cocina o las instrucciones para cruzar la calle.'
    },
    {
      id: 'm2_q2',
      question: 'En el modelo universal de sistemas, ¿cuál es el orden correcto de las tres etapas?',
      options: [
        'Proceso → Salida → Entrada',
        'Salida → Entrada → Proceso',
        'Entrada → Proceso → Salida',
        'Proceso → Entrada → Salida'
      ],
      correctAnswer: 2,
      explanation: '¡Muy bien! Primero ingresan los datos (Entrada), luego el algoritmo los opera o transforma (Proceso), y finalmente se entrega el resultado útil (Salida).',
      hint: 'Pensá en qué necesitás primero para cocinar: ¿los ingredientes o el plato terminado?'
    },
    {
      id: 'm2_q3',
      question: '¿Cuál es la diferencia fundamental entre un "dato" y la "información"?',
      options: [
        'Los datos siempre son falsos y la información siempre es verdadera',
        'Un dato es un valor aislado sin contexto; la información es el dato procesado con significado',
        'La información solo existe en papel y los datos en computadoras',
        'Son exactamente la misma palabra con diferente escritura'
      ],
      correctAnswer: 1,
      explanation: '¡Correcto! El número "18" es solo un dato bruto; saber que "el alumno tiene 18 años y es mayor de edad" es información útil.',
      hint: '¿Qué aporta más valor: el número 40 solo o saber que es la temperatura de un paciente con fiebre?'
    },
    {
      id: 'm2_q4',
      question: '¿En qué consiste la técnica de "descomposición" en el pensamiento computacional?',
      options: [
        'Desarmar la computadora físicamente con un destornillador',
        'Dividir un problema grande y complejo en problemas más pequeños y fáciles de resolver',
        'Borrar todas las instrucciones de un programa cuando falla',
        'Escribir todo el código en una sola línea larguísima'
      ],
      correctAnswer: 1,
      explanation: '¡Excelente! La descomposición permite abordar desafíos complejos resolviendo una pequeña parte a la vez ("divide y vencerás").',
      hint: 'Pensá en cómo ordenarías una habitación entera: parte por parte.'
    },
    {
      id: 'm2_q5',
      question: '¿Qué ocurre si alteramos el orden de las instrucciones en un algoritmo?',
      options: [
        'La computadora se vuelve automáticamente el doble de rápida',
        'El resultado puede ser incorrecto o el algoritmo puede fallar por completo',
        'Nada, las computadoras adivinan nuestra intención sin importar el orden',
        'El programa se traduce solo a otro idioma'
      ],
      correctAnswer: 1,
      explanation: 'Las computadoras ejecutan en estricto orden secuencial. Si intentás servir el café antes de poner el agua, el proceso falla.',
      hint: '¿Qué pasa si intentás ponerte los zapatos antes de ponerte las medias?'
    },
    {
      id: 'm2_q6',
      question: '¿Cuál es la diferencia entre un algoritmo y un programa?',
      options: [
        'El algoritmo es el hardware y el programa es el software',
        'El algoritmo es la estrategia o idea lógica; el programa es ese algoritmo escrito en un lenguaje como Python',
        'Los algoritmos solo los usan los matemáticos y los programas los jugadores de videojuegos',
        'No hay ninguna diferencia, son nombres idénticos para lo mismo'
      ],
      correctAnswer: 1,
      explanation: '¡Exacto! El algoritmo es la receta conceptual; el programa es la implementación de esa receta en código ejecutable.',
      hint: 'Recordá: podés escribir un algoritmo en una servilleta, pero necesitás una computadora para ejecutar un programa.'
    },
    {
      id: 'm2_q7',
      question: 'Si un programa para calcular sueldos suma un bono en lugar de restar un descuento, pero no se detiene ni muestra error rojo, ¿qué tipo de error ocurrió?',
      options: [
        'Error de sintaxis',
        'Error de lógica',
        'Error de cableado',
        'Falla de la memoria RAM'
      ],
      correctAnswer: 1,
      explanation: 'Es un error de lógica. La sintaxis del código está bien escrita, pero el razonamiento del algoritmo fue incorrecto y dio un resultado erróneo.',
      hint: 'El programa no se rompió, pero calculó mal el número final.'
    },
    {
      id: 'm2_q8',
      question: '¿Para qué sirve realizar una "prueba de escritorio"?',
      options: [
        'Para comprobar si el escritorio de madera resiste el peso de la pantalla',
        'Para seguir el algoritmo paso a paso con lápiz y papel verificando que el resultado sea correcto',
        'Para limpiar los archivos temporales de la computadora',
        'Para pintar el fondo de pantalla de color azul'
      ],
      correctAnswer: 1,
      explanation: 'La prueba de escritorio es un ensayo manual: se simula ser la computadora siguiendo cada paso para cazar errores de razonamiento antes de codificar.',
      hint: 'Se hace a mano con papel antes o durante la programación.'
    },
    {
      id: 'm2_q9',
      question: '¿Qué característica define a una máquina "determinista" como la computadora?',
      options: [
        'Que cambia de opinión según su estado de ánimo',
        'Que ante las mismas entradas y las mismas instrucciones, siempre produce exactamente el mismo resultado',
        'Que solo funciona durante las horas de la mañana',
        'Que adivina los resultados sin procesar los datos'
      ],
      correctAnswer: 1,
      explanation: 'Las computadoras no tienen creatividad ni intuición: ejecutan de forma matemática y exacta. Siempre que repitas la misma operación con los mismos valores, dará el mismo resultado.',
      hint: 'Dos más dos siempre dará cuatro en cualquier computadora.'
    },
    {
      id: 'm2_q10',
      question: '¿Qué significa "automatizar" un proceso?',
      options: [
        'Hacer que una tarea se realice de forma sistemática y repetida por una máquina sin requerir intervención humana constante',
        'Hacer que una computadora funcione sin electricidad',
        'Comprar un automóvil moderno con conexión a internet',
        'Escribir a mano en un cuaderno todos los días'
      ],
      correctAnswer: 0,
      explanation: '¡Así es! Automatizar consiste en diseñar un algoritmo para que la computadora ejecute una tarea rutinaria de forma veloz y precisa una y otra vez.',
      hint: 'Pensá en enviar miles de correos de confirmación en un segundo en lugar de escribir uno por uno a mano.'
    }
  ],
  exercises: [
    {
      id: 'm2_ex1',
      moduleId: 2,
      number: 1,
      title: 'El modelo Entrada → Proceso → Salida en consola',
      description: 'Representa el flujo universal de un sistema en tres líneas de texto:\nLínea 1: "1. Entrada: Datos recibidos"\nLínea 2: "2. Proceso: Operación lógica"\nLínea 3: "3. Salida: Información entregada"',
      difficulty: 'starter',
      realWorldContext: 'Esquema universal de la arquitectura de software.',
      starterCode: '# Muestra las 3 etapas del modelo universal:\n',
      solution: 'print("1. Entrada: Datos recibidos")\nprint("2. Proceso: Operación lógica")\nprint("3. Salida: Información entregada")',
      hints: [
        'Utiliza tres instrucciones print() separadas, una en cada línea.',
        'Respeta las mayúsculas y la puntuación de cada texto.',
        'La primera línea debe ser: print("1. Entrada: Datos recibidos")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Etapas del modelo universal',
          expectedOutputs: ['1. Entrada: Datos recibidos', '2. Proceso: Operación lógica', '3. Salida: Información entregada'],
          description: 'Muestra las 3 fases en estricto orden'
        }
      ]
    },
    {
      id: 'm2_ex2',
      moduleId: 2,
      number: 2,
      title: 'Secuencia lógica para hornear pan',
      description: 'Escribe tres instrucciones print consecutivas que representen los pasos ordenados de un algoritmo cotidiano:\nLínea 1: "Paso 1: Mezclar harina, agua y levadura"\nLínea 2: "Paso 2: Amasar y dejar leudar"\nLínea 3: "Paso 3: Hornear a 200 grados"',
      difficulty: 'starter',
      realWorldContext: 'Secuencia estricta en procesos de manufactura o recetas.',
      starterCode: '# Escribe los 3 pasos en líneas ordenadas:\n',
      solution: 'print("Paso 1: Mezclar harina, agua y levadura")\nprint("Paso 2: Amasar y dejar leudar")\nprint("Paso 3: Hornear a 200 grados")',
      hints: [
        'No podés hornear antes de mezclar los ingredientes.',
        'Usa tres print() con comillas.',
        'Copia exactamente los textos pedidos.'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Pasos secuenciales para hornear',
          expectedOutputs: ['Paso 1: Mezclar harina, agua y levadura', 'Paso 2: Amasar y dejar leudar', 'Paso 3: Hornear a 200 grados'],
          description: 'Imprime los pasos en secuencia'
        }
      ]
    },
    {
      id: 'm2_ex3',
      moduleId: 2,
      number: 3,
      title: 'Diferenciando Dato e Información',
      description: 'Muestra en consola cómo un dato sin contexto se convierte en información procesada útil:\nLínea 1: "Dato sin procesar: 39"\nLínea 2: "Información útil: El paciente tiene 39 grados de fiebre"',
      difficulty: 'basic',
      realWorldContext: 'Transformación de datos en valor informativo para la toma de decisiones.',
      starterCode: '# Muestra la diferencia entre dato e información:\n',
      solution: 'print("Dato sin procesar: 39")\nprint("Información útil: El paciente tiene 39 grados de fiebre")',
      hints: [
        'Usa dos llamadas a print().',
        'La primera muestra el dato aislado.',
        'La segunda muestra el dato contextualizado.'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Dato e Información',
          expectedOutputs: ['Dato sin procesar: 39', 'Información útil: El paciente tiene 39 grados de fiebre'],
          description: 'Muestra la transformación de dato en información'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm2_chal1',
    title: '🚀 Algoritmo de Descomposición de un Lavado de Autos',
    description: 'Aplica la técnica de descomposición: divide la tarea "Lavar un auto" en 4 subproblemas secuenciales y muéstralos en pantalla:\n"1. Descomposición: Enjuague inicial"\n"2. Descomposición: Enjabonar carrocería"\n"3. Descomposición: Limpiar llantas"\n"4. Descomposición: Secado final"',
    bonusXp: 100,
    starterCode: '# Muestra las 4 fases de descomposición:\n',
    solution: 'print("1. Descomposición: Enjuague inicial")\nprint("2. Descomposición: Enjabonar carrocería")\nprint("3. Descomposición: Limpiar llantas")\nprint("4. Descomposición: Secado final")',
    hints: [
      'Utiliza cuatro instrucciones print().',
      'Cada línea debe iniciar con el número y "Descomposición: ..."'
    ],
    testCases: [
      {
        name: 'Descomposición completa',
        expectedOutputs: ['1. Descomposición: Enjuague inicial', '2. Descomposición: Enjabonar carrocería', '3. Descomposición: Limpiar llantas', '4. Descomposición: Secado final'],
        description: 'Imprime las 4 fases de la descomposición'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Qué es un problema y el rol de la lógica y la descomposición',
      'Qué es un algoritmo y la vital importancia del orden de las instrucciones',
      'El modelo universal Entrada → Proceso → Salida',
      'La diferencia fundamental entre dato aislado e información procesada con sentido',
      'La distinción entre error de sintaxis y error de lógica'
    ],
    congratulationsMessage: '¡Excelente trabajo! Ya dominás los fundamentos de cómo pensar como programador. Ahora sí estás listo para conocer el lenguaje que usaremos: ¡Python!'
  }
};
