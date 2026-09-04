import { CourseModule } from '../../types/course';

export const module06: CourseModule = {
  id: 6,
  number: 6,
  title: 'Operadores de comparación',
  subtitle: 'Comparar valores para obtener respuestas de Verdadero o Falso (True/False)',
  description: 'Descubre los 6 operadores de comparación (==, !=, >, <, >=, <=) y cómo la computadora evalúa preguntas lógicas generando resultados booleanos.',
  icon: '⚖️',
  estimatedTime: '30 min',
  category: 'operadores',
  theory: [
    {
      id: 'm6_t1',
      title: '1. Comparar valores en Python',
      content: 'Los operadores de comparación nos permiten hacerle preguntas a Python sobre dos valores. La respuesta a toda comparación siempre es un valor booleano: **`True` (Verdadero)** o **`False` (Falso)**.\n\n* `==` : **Igual a** (¿son idénticos? ¡Ojo! Son dos signos igual juntos).\n* `!=` : **Distinto o diferente de** (el signo de exclamación significa negación).\n* `>`  : **Mayor que**\n* `<`  : **Menor que**\n* `>=` : **Mayor o igual que**\n* `<=` : **Menor o igual que**',
      codeExample: {
        code: 'edad = 20\n\n# ¿Es mayor o igual a 18?\nprint(edad >= 18)\n\n# ¿Es exactamente igual a 15?\nprint(edad == 15)',
        explanation: 'La primera comparación produce True y la segunda False.',
        output: 'True\nFalse'
      },
      keyTakeaways: [
        'Un solo = ASIGNA un valor a una variable.',
        'Dos signos juntos == COMPARAN si dos valores son iguales.',
        'El resultado de comparar siempre es True o False.'
      ]
    },
    {
      id: 'm6_t2',
      title: '2. Comparar textos y números',
      content: 'También podemos comparar cadenas de texto (`str`). Python compara si el texto es exactamente idéntico, respetando mayúsculas, minúsculas y espacios.',
      codeExample: {
        code: 'clave_ingresada = "admin123"\nclave_correcta = "admin123"\n\nprint(clave_ingresada == clave_correcta)\nprint("hola" == "Hola")  # False por la mayúscula',
        explanation: '"hola" == "Hola" es False porque Python es sensible a mayúsculas.',
        output: 'True\nFalse'
      }
    }
  ],
  quiz: [
    {
      id: 'm6_q1',
      question: '¿Cuál es la diferencia crítica entre `=` y `==` en Python?',
      options: [
        'No hay diferencia, son idénticos',
        '`=` es para asignar un valor a una variable; `==` es para comparar si dos valores son iguales',
        '`==` solo sirve para números decimales',
        '`=` es un error de sintaxis'
      ],
      correctAnswer: 1,
      explanation: 'Este es uno de los errores más comunes al aprender a programar: `=` guarda datos, mientras que `==` evalúa igualdad y devuelve True o False.',
      hint: 'Recordá: 1 signo igual asigna, 2 signos iguales comparan.'
    },
    {
      id: 'm6_q2',
      question: '¿Qué operador se utiliza para preguntar si dos valores son DIFERENTES o DISTINTOS?',
      options: [
        '<>',
        '!=',
        '==!',
        'diff()'
      ],
      correctAnswer: 1,
      explanation: 'En Python (y en casi todos los lenguajes de programación modernos) `!=` significa "distinto de".',
      hint: 'El signo de admiración representa "no".'
    },
    {
      id: 'm6_q3',
      question: '¿Qué resultado da la instrucción `print(10 >= 10)`?',
      options: [
        'False',
        'True',
        'None',
        '10'
      ],
      correctAnswer: 1,
      explanation: '10 no es estrictamente mayor que 10, pero SÍ es igual a 10. Como el operador es "mayor o igual" (`>=`), la condición se cumple y devuelve `True`.',
      hint: '¿10 es mayor O igual a 10?'
    },
    {
      id: 'm6_q4',
      question: '¿Qué valor produce `"Python" == "python"`?',
      options: [
        'True',
        'False',
        'Error de tipo',
        'Undefined'
      ],
      correctAnswer: 1,
      explanation: 'Produce `False` porque la primera letra es una "P" mayúscula y en la otra es minúscula.',
      hint: 'Python distingue estrictamente entre mayúsculas y minúsculas.'
    },
    {
      id: 'm6_q5',
      question: 'Si `vidas = 0`, ¿qué devuelve `vidas <= 0`?',
      options: [
        'True (el personaje perdió todas sus vidas)',
        'False',
        'Error',
        '0'
      ],
      correctAnswer: 0,
      explanation: '0 es menor o igual a 0, por lo que la comparación evalúa a `True`.',
      hint: '0 es igual a 0.'
    }
  ],
  exercises: [
    {
      id: 'm6_ex1',
      moduleId: 6,
      number: 1,
      title: 'Verificar igualdad numérica',
      description: 'Crea `a = 15` y `b = 15`. Imprime la comparación `a == b`.',
      difficulty: 'starter',
      realWorldContext: 'Verificación de dos montos iguales.',
      starterCode: '# Compara a y b:\n',
      solution: 'a = 15\nb = 15\nprint(a == b)',
      hints: [
        'a = 15',
        'b = 15',
        'print(a == b) imprimirá True'
      ],
      xp: 20,
      testCases: [
        {
          name: 'True por igualdad',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex2',
      moduleId: 6,
      number: 2,
      title: 'Verificar diferencia (!=)',
      description: 'Crea `color_semaforo = "rojo"`. Comprueba si es distinto de "verde" imprimiendo `color_semaforo != "verde"`.',
      difficulty: 'starter',
      realWorldContext: 'Sensor de tránsito vial.',
      starterCode: 'color_semaforo = "rojo"\n# Imprime si es diferente a "verde":\n',
      solution: 'color_semaforo = "rojo"\nprint(color_semaforo != "verde")',
      hints: [
        'Usa el operador !=',
        'print(color_semaforo != "verde")',
        'Dará True porque "rojo" no es "verde"'
      ],
      xp: 20,
      testCases: [
        {
          name: 'True por diferencia',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex3',
      moduleId: 6,
      number: 3,
      title: 'Mayoría de edad (>=)',
      description: 'Crea una variable `edad = 17`. Imprime si `edad >= 18`.',
      difficulty: 'starter',
      realWorldContext: 'Validación de acceso legal para conducir un vehículo.',
      starterCode: 'edad = 17\n# Comprueba si tiene 18 o más años:\n',
      solution: 'edad = 17\nprint(edad >= 18)',
      hints: [
        'edad = 17',
        'print(edad >= 18)',
        'Como 17 es menor que 18, mostrará False'
      ],
      xp: 20,
      testCases: [
        {
          name: 'False por edad menor',
          expectedOutputs: ['False'],
          description: 'Muestra False'
        }
      ]
    },
    {
      id: 'm6_ex4',
      moduleId: 6,
      number: 4,
      title: 'Comprobar si alcanza el dinero',
      description: 'Tenemos `billetera = 5000` y el `costo_entrada = 4200`. Imprime si `billetera >= costo_entrada`.',
      difficulty: 'basic',
      realWorldContext: 'Validación de fondos antes de realizar un pago.',
      starterCode: 'billetera = 5000\ncosto_entrada = 4200\n# Imprime si alcanza el dinero:\n',
      solution: 'billetera = 5000\ncosto_entrada = 4200\nprint(billetera >= costo_entrada)',
      hints: [
        'Compara si el dinero disponible es mayor o igual al costo',
        'print(billetera >= costo_entrada)',
        'Devolverá True'
      ],
      xp: 25,
      testCases: [
        {
          name: 'True alcanza el dinero',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex5',
      moduleId: 6,
      number: 5,
      title: 'Temperatura bajo cero (<)',
      description: 'Un termómetro marca `temp = -3.5`. Imprime si la temperatura es menor a cero (`temp < 0`).',
      difficulty: 'basic',
      realWorldContext: 'Alerta de congelamiento en carreteras de montaña.',
      starterCode: 'temp = -3.5\n# Imprime si está bajo cero:\n',
      solution: 'temp = -3.5\nprint(temp < 0)',
      hints: [
        'Usa el operador menor que: <',
        'print(temp < 0)',
        'Mostrará True'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Bajo cero True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex6',
      moduleId: 6,
      number: 6,
      title: 'Límite de velocidad superado',
      description: 'Un auto circula a `velocidad = 135` en una autopista con límite de `limite = 130`. Guarda en una variable `exceso = velocidad > limite` e imprime `exceso`.',
      difficulty: 'basic',
      realWorldContext: 'Radar automático de infracciones de tránsito.',
      starterCode: 'velocidad = 135\nlimite = 130\n# Determina si hay exceso e imprímelo:\n',
      solution: 'velocidad = 135\nlimite = 130\nexceso = velocidad > limite\nprint(exceso)',
      hints: [
        'exceso = velocidad > limite',
        'print(exceso)',
        'Mostrará True'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Exceso de velocidad True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex7',
      moduleId: 6,
      number: 7,
      title: 'Comparación de cadenas de texto',
      description: 'Compara si `password_guardado = "secreto"` coincide con `password_intento = "secreto"`. Imprime el resultado de compararlas con `==`.',
      difficulty: 'intermediate',
      realWorldContext: 'Sistema de autenticación y login.',
      starterCode: 'password_guardado = "secreto"\npassword_intento = "secreto"\n# Imprime si coinciden:\n',
      solution: 'password_guardado = "secreto"\npassword_intento = "secreto"\nprint(password_guardado == password_intento)',
      hints: [
        'password_guardado == password_intento',
        'print(password_guardado == password_intento)'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Coincidencia de contraseña True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm6_ex8',
      moduleId: 6,
      number: 8,
      title: 'Stock disponible mayor que cero',
      description: 'Una tienda online tiene `stock = 0`. Crea una variable booleana `hay_stock = stock > 0` e imprime `hay_stock`.',
      difficulty: 'intermediate',
      realWorldContext: 'Habilitar o deshabilitar botón "Comprar ahora" en e-commerce.',
      starterCode: 'stock = 0\n# Verifica si hay stock e imprímelo:\n',
      solution: 'stock = 0\nhay_stock = stock > 0\nprint(hay_stock)',
      hints: [
        'hay_stock = stock > 0',
        'Como stock es 0, no es mayor a 0, dará False.',
        'print(hay_stock)'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Stock disponible False',
          expectedOutputs: ['False'],
          description: 'Muestra False'
        }
      ]
    },
    {
      id: 'm6_ex9',
      moduleId: 6,
      number: 9,
      title: 'Aprobación escolar (nota >= 6)',
      description: 'Un alumno se sacó `nota = 6`. Comprueba si aprobó imprimiendo `nota >= 6`. Luego cambia la variable a `nota = 5` y vuelve a imprimir `nota >= 6`.',
      difficulty: 'intermediate',
      realWorldContext: 'Determinación de notas de corte en exámenes.',
      starterCode: 'nota = 6\n# Imprime primera comparación, reasigna a 5 e imprime de nuevo:\n',
      solution: 'nota = 6\nprint(nota >= 6)\nnota = 5\nprint(nota >= 6)',
      hints: [
        'print(nota >= 6) con nota 6 imprimirá True',
        'nota = 5',
        'print(nota >= 6) con nota 5 imprimirá False'
      ],
      xp: 35,
      testCases: [
        {
          name: 'True y False consecutivos',
          expectedOutputs: ['True', 'False'],
          description: 'Muestra True y luego False'
        }
      ]
    },
    {
      id: 'm6_ex10',
      moduleId: 6,
      number: 10,
      title: 'Desafío de Comparaciones: Capacidad de una sala de cine',
      description: 'Una sala de cine tiene `capacidad_maxima = 150` y se han vendido `entradas_vendidas = 150`. Crea una variable `sala_llena = entradas_vendidas >= capacidad_maxima` e imprime `sala_llena`.',
      difficulty: 'challenge',
      realWorldContext: 'Gestión de butacas en ticketing.',
      starterCode: 'capacidad_maxima = 150\nentradas_vendidas = 150\n# Comprueba si la sala está llena e imprime:\n',
      solution: 'capacidad_maxima = 150\nentradas_vendidas = 150\nsala_llena = entradas_vendidas >= capacidad_maxima\nprint(sala_llena)',
      hints: [
        'entradas_vendidas es 150 y capacidad es 150',
        '150 >= 150 es True',
        'sala_llena valdrá True'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Sala llena True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm6_chal1',
    title: '🚀 Desafío de Comparaciones: Rango de Temperatura Ideal',
    description: 'En un invernadero la temperatura óptima es entre 18 y 28 grados. Con `temp = 25`, comprueba si es mayor o igual a 18 imprimiendo `temp >= 18` y si es menor o igual a 28 imprimiendo `temp <= 28`.',
    bonusXp: 100,
    starterCode: 'temp = 25\n# Imprime si cumple ambos extremos:\n',
    solution: 'temp = 25\nprint(temp >= 18)\nprint(temp <= 28)',
    hints: [
      'Haz dos prints separados',
      'print(temp >= 18) dará True',
      'print(temp <= 28) dará True'
    ],
    testCases: [
      {
        name: 'Rango óptimo True y True',
        expectedOutputs: ['True', 'True'],
        description: 'Muestra True y True'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Los 6 operadores de comparación: ==, !=, >, <, >=, <=',
      'Diferencia fundamental entre asignación (=) e igualdad (==)',
      'Producción de valores lógicos True y False',
      'Sensibilidad a mayúsculas en comparación de textos'
    ],
    congratulationsMessage: '¡Magnífico! Ahora tu código puede hacer comparaciones y evaluar situaciones del mundo real.'
  }
};
