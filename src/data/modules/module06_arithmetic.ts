import { CourseModule } from '../../types/course';

export const module06: CourseModule = {
  id: 6,
  number: 6,
  title: 'Operadores aritméticos',
  subtitle: 'Cálculos matemáticos, división entera, resto (%) y potencias',
  description: 'Aprende a realizar operaciones matemáticas esenciales en Python: suma, resta, multiplicación, división flotante y entera, módulo/resto (%) y potenciación con aplicaciones reales.',
  icon: '➕',
  estimatedTime: '35 min',
  category: 'operadores',
  theory: [
    {
      id: 'm5_t1',
      title: '1. Los operadores matemáticos en Python',
      content: 'Python cuenta con un conjunto completo de operadores aritméticos para realizar cálculos con precisión milimétrica:\n\n* `+` : **Suma** (`10 + 5` -> `15`)\n* `-` : **Resta** (`20 - 7` -> `13`)\n* `*` : **Multiplicación** (`6 * 4` -> `24`)\n* `/` : **División decimal** (`7 / 2` -> `3.5`)\n* `//` : **División entera** (descarta decimales, `7 // 2` -> `3`)\n* `%` : **Módulo o Resto** (lo que sobra de una división entera, `7 % 2` -> `1`)\n* `**` : **Potencia** (`2 ** 3` -> `8`, es decir 2 elevado al cubo)',
      codeExample: {
        code: 'precio = 1200\ncantidad = 3\ntotal = precio * cantidad\n\nprint("Total a pagar:", total)',
        explanation: 'Multiplicamos precio por cantidad y guardamos el resultado en la variable total.',
        output: 'Total a pagar: 3600'
      },
      keyTakeaways: [
        'La división simple / siempre devuelve un float, incluso si la división es exacta (ej: 4 / 2 -> 2.0).',
        'La división // solo conserva la parte entera.',
        '% devuelve el resto de la división (ideal para saber si un número es par o impar).'
      ]
    },
    {
      id: 'm5_t2',
      title: '2. ¿Para qué sirve el operador módulo (`%`) en la vida real?',
      content: 'El operador `%` calcula el **resto que sobra** cuando repartimos cosas en partes iguales. Por ejemplo:\n- Si tienes 7 caramelos y los repartes entre 2 niños, cada niño recibe 3 caramelos y **sobra 1** (`7 % 2 == 1`).\n\n**Regla de oro de la programación:**\n- Si `numero % 2 == 0`, el número es **PAR** (no sobra nada).\n- Si `numero % 2 == 1`, el número es **IMPAR** (sobra 1).',
      codeExample: {
        code: 'caramelos = 11\nninios = 4\nsobran = caramelos % ninios\nprint("Caramelos que sobran:", sobran)',
        explanation: '11 dividido 4 es 2 (reparto 8 caramelos) y sobran 3.',
        output: 'Caramelos que sobran: 3'
      }
    }
  ],
  quiz: [
    {
      id: 'm5_q1',
      question: '¿Qué resultado produce la operación `10 / 2` en Python?',
      options: [
        '5',
        '5.0 (un número float)',
        'Error',
        '2'
      ],
      correctAnswer: 1,
      explanation: 'En Python la barra `/` siempre produce un número decimal (`float`), por lo que `10 / 2` es `5.0`.',
      hint: 'Recordá que la división simple siempre devuelve tipo float.'
    },
    {
      id: 'm5_q2',
      question: '¿Qué operador calcula la potencia (elevar un número a un exponente)?',
      options: [
        '^ (sombrerito)',
        '** (dos asteriscos)',
        '^^',
        'pow*'
      ],
      correctAnswer: 1,
      explanation: 'En Python la potencia se escribe con doble asterisco `**`, por ejemplo `2 ** 3` equivale a 2³ = 8.',
      hint: 'No uses ^ porque en Python tiene otro significado (XOR a nivel de bits).'
    },
    {
      id: 'm5_q3',
      question: '¿Qué devolverá la operación `10 % 3`?',
      options: [
        '3',
        '1 (porque 3 entra 3 veces en 10 y sobra 1)',
        '0.33',
        '10'
      ],
      correctAnswer: 1,
      explanation: '10 dividido 3 da cociente 3 (3 * 3 = 9) y el resto que sobra para llegar a 10 es 1.',
      hint: 'El operador % calcula el resto que sobra de la división entera.'
    },
    {
      id: 'm5_q4',
      question: '¿Cuál es el resultado de `17 // 5` (división entera)?',
      options: [
        '3.4',
        '3',
        '2',
        '4'
      ],
      correctAnswer: 1,
      explanation: 'La división entera `//` trunca y descarta los decimales, devolviendo únicamente el entero 3.',
      hint: '¿Cuántas veces entra 5 completo en 17?'
    },
    {
      id: 'm5_q5',
      question: '¿Cómo podemos saber si un número guardado en la variable `n` es par?',
      options: [
        'Si n / 2 da error',
        'Si n % 2 es igual a 0',
        'Si n ** 2 es menor a 100',
        'Si n // 2 es impar'
      ],
      correctAnswer: 1,
      explanation: 'Cualquier número par dividido por 2 tiene un resto de cero (`n % 2 == 0`).',
      hint: 'Pensá en qué sobra al dividir un número par entre 2.'
    }
  ],
  exercises: [
    {
      id: 'm5_ex1',
      moduleId: 6,
      number: 1,
      title: 'Suma de dos números',
      description: 'Crea dos variables: `num1 = 25` y `num2 = 15`. Crea una variable `suma` con su adición (`num1 + num2`) e imprímela.',
      difficulty: 'starter',
      realWorldContext: 'Suma de puntuaciones en un juego.',
      starterCode: '# Suma dos variables:\n',
      solution: 'num1 = 25\nnum2 = 15\nsuma = num1 + num2\nprint(suma)',
      hints: [
        'num1 = 25',
        'num2 = 15',
        'suma = num1 + num2 y luego print(suma)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Suma 40',
          expectedOutputs: ['40'],
          description: 'Muestra 40'
        }
      ]
    },
    {
      id: 'm5_ex2',
      moduleId: 6,
      number: 2,
      title: 'Calcular el precio total de una compra',
      description: 'Un cliente compra 4 botellas de agua. Cada botella cuesta 350 pesos. Crea `precio = 350`, `cantidad = 4`, calcula `total = precio * cantidad` e imprime `total`.',
      difficulty: 'starter',
      realWorldContext: 'Caja registradora de supermercado.',
      starterCode: '# Calcula el precio total:\n',
      solution: 'precio = 350\ncantidad = 4\ntotal = precio * cantidad\nprint(total)',
      hints: [
        'Multiplica con el asterisco (*)',
        'total = precio * cantidad',
        'print(total) imprimirá 1400'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Total 1400',
          expectedOutputs: ['1400'],
          description: 'Muestra 1400'
        }
      ]
    },
    {
      id: 'm5_ex3',
      moduleId: 6,
      number: 3,
      title: 'Promedio de tres calificaciones',
      description: 'Un estudiante obtuvo las notas: `nota1 = 8`, `nota2 = 9` y `nota3 = 7`. Calcula el promedio sumándolas y dividiéndolas entre 3: `promedio = (nota1 + nota2 + nota3) / 3`. Imprime `promedio`.',
      difficulty: 'basic',
      realWorldContext: 'Boletín escolar de calificaciones.',
      starterCode: '# Promedio de 3 notas:\n',
      solution: 'nota1 = 8\nnota2 = 9\nnota3 = 7\npromedio = (nota1 + nota2 + nota3) / 3\nprint(promedio)',
      hints: [
        'Usa paréntesis para garantizar que la suma se haga antes de dividir entre 3',
        'promedio = (nota1 + nota2 + nota3) / 3',
        'print(promedio) mostrará 8.0'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Promedio 8.0',
          expectedOutputs: ['8.0'],
          description: 'Muestra 8.0'
        }
      ]
    },
    {
      id: 'm5_ex4',
      moduleId: 6,
      number: 4,
      title: 'Calcular un descuento',
      description: 'Una remera cuesta `precio_original = 8000`. Tiene un descuento de `descuento = 1500`. Calcula `precio_final = precio_original - descuento` e imprímelo.',
      difficulty: 'basic',
      realWorldContext: 'Promoción de temporada en tienda de ropa.',
      starterCode: '# Descuento de producto:\n',
      solution: 'precio_original = 8000\ndescuento = 1500\nprecio_final = precio_original - descuento\nprint(precio_final)',
      hints: [
        'Resta el descuento del precio original con el signo -',
        'precio_final = precio_original - descuento',
        'print(precio_final) dará 6500'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Precio final 6500',
          expectedOutputs: ['6500'],
          description: 'Muestra 6500'
        }
      ]
    },
    {
      id: 'm5_ex5',
      moduleId: 6,
      number: 5,
      title: 'Área de un rectángulo',
      description: 'Calcula el área de un terreno rectangular con `base = 15` y `altura = 8`. El área se obtiene multiplicando `base * altura`. Guarda el resultado en `area` e imprímelo.',
      difficulty: 'basic',
      realWorldContext: 'Planos de arquitectura y agrimensura.',
      starterCode: '# Área de rectángulo:\n',
      solution: 'base = 15\naltura = 8\narea = base * altura\nprint(area)',
      hints: [
        'base = 15',
        'altura = 8',
        'area = base * altura'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Área 120',
          expectedOutputs: ['120'],
          description: 'Muestra 120'
        }
      ]
    },
    {
      id: 'm5_ex6',
      moduleId: 6,
      number: 6,
      title: 'Perímetro de un rectángulo',
      description: 'Con `base = 10` y `altura = 5`, el perímetro es la suma de los 4 lados: `perimetro = 2 * (base + altura)`. Calcula e imprime `perimetro`.',
      difficulty: 'intermediate',
      realWorldContext: 'Cálculo de alambre para cercar un jardín.',
      starterCode: '# Perímetro de rectángulo:\n',
      solution: 'base = 10\naltura = 5\nperimetro = 2 * (base + altura)\nprint(perimetro)',
      hints: [
        'perimetro = 2 * (base + altura)',
        'Multiplica 2 por 15 = 30',
        'print(perimetro)'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Perímetro 30',
          expectedOutputs: ['30'],
          description: 'Muestra 30'
        }
      ]
    },
    {
      id: 'm5_ex7',
      moduleId: 6,
      number: 7,
      title: 'Reparto en partes iguales y resto (%)',
      description: 'Tenemos `alfajores = 23` y `amigos = 4`. Calcula cuántos sobran usando el operador de módulo (`sobrantes = alfajores % amigos`) e imprime `sobrantes`.',
      difficulty: 'intermediate',
      realWorldContext: 'Reparto equitativo de meriendas escolares.',
      starterCode: '# Cálculo de sobrantes con módulo %:\n',
      solution: 'alfajores = 23\namigos = 4\nsobrantes = alfajores % amigos\nprint(sobrantes)',
      hints: [
        'Usa el operador %',
        'sobrantes = alfajores % amigos',
        '23 dividido 4 es 5 (20 alfajores) y sobran 3. print(sobrantes) mostrará 3.'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Sobran 3',
          expectedOutputs: ['3'],
          description: 'Muestra 3'
        }
      ]
    },
    {
      id: 'm5_ex8',
      moduleId: 6,
      number: 8,
      title: 'Horas y minutos con división entera y resto',
      description: 'Tenemos `minutos_totales = 135`. Calcula cuántas horas completas son con `horas = minutos_totales // 60` y cuántos minutos sobran con `minutos_restantes = minutos_totales % 60`. Imprime `horas` y en la siguiente línea `minutos_restantes`.',
      difficulty: 'intermediate',
      realWorldContext: 'Conversión de tiempo en reproductores de video y cronómetros.',
      starterCode: 'minutos_totales = 135\n# Calcula horas y minutos_restantes:\n',
      solution: 'minutos_totales = 135\nhoras = minutos_totales // 60\nminutos_restantes = minutos_totales % 60\nprint(horas)\nprint(minutos_restantes)',
      hints: [
        'horas = minutos_totales // 60 (da 2 horas)',
        'minutos_restantes = minutos_totales % 60 (da 15 minutos)',
        'Imprime ambas variables'
      ],
      xp: 35,
      testCases: [
        {
          name: '2 horas y 15 minutos',
          expectedOutputs: ['2', '15'],
          description: 'Muestra 2 y 15'
        }
      ]
    },
    {
      id: 'm5_ex9',
      moduleId: 6,
      number: 9,
      title: 'Potencia matemática',
      description: 'Calcula cuánto es 2 elevado a la 8va potencia (2⁸) usando el operador de potencia `**`. Guarda el resultado en `resultado` e imprímelo.',
      difficulty: 'intermediate',
      realWorldContext: 'Cálculo de combinaciones binarias posibles en 1 Byte (8 bits).',
      starterCode: '# Potencia de 2 a la 8:\n',
      solution: 'resultado = 2 ** 8\nprint(resultado)',
      hints: [
        'Usa el doble asterisco **',
        'resultado = 2 ** 8',
        'El resultado debe ser 256'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Potencia 256',
          expectedOutputs: ['256'],
          description: 'Muestra 256'
        }
      ]
    },
    {
      id: 'm5_ex10',
      moduleId: 6,
      number: 10,
      title: 'Desafío Aritmético: Cuenta compartida con propina',
      description: 'Tres amigos cenan en una pizzería: la cuenta es `total_comida = 12000`. Quieren dejar una propina del 10% (`propina = total_comida * 0.10`). El gran total es `total_pagar = total_comida + propina`, y se divide entre 3 amigos: `pago_individual = total_pagar / 3`. Calcula e imprime `pago_individual`.',
      difficulty: 'challenge',
      realWorldContext: 'Calculadora de división de gastos en una cena grupal.',
      starterCode: 'total_comida = 12000\n# Calcula la propina, total_pagar y pago_individual:\n',
      solution: 'total_comida = 12000\npropina = total_comida * 0.10\ntotal_pagar = total_comida + propina\npago_individual = total_pagar / 3\nprint(pago_individual)',
      hints: [
        'propina = 12000 * 0.10 = 1200',
        'total_pagar = 12000 + 1200 = 13200',
        'pago_individual = 13200 / 3 = 4400.0'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Pago de cada amigo 4400.0',
          expectedOutputs: ['4400.0'],
          description: 'Muestra 4400.0'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm5_chal1',
    title: '🚀 Desafío Aritmético: Conversor de Temperatura Fahrenheit a Celsius',
    description: 'La fórmula para convertir grados Fahrenheit a Celsius es: `celsius = (fahrenheit - 32) * 5 / 9`. Si `fahrenheit = 68`, calcula la temperatura en Celsius e imprime el resultado.',
    bonusXp: 100,
    badgeId: 'math_wizard',
    starterCode: 'fahrenheit = 68\n# Aplica la fórmula e imprime celsius:\n',
    solution: 'fahrenheit = 68\ncelsius = (fahrenheit - 32) * 5 / 9\nprint(celsius)',
    hints: [
      'Usa paréntesis exactamente como en la fórmula: (fahrenheit - 32) * 5 / 9',
      '68 - 32 es 36; 36 * 5 / 9 es 20.0',
      'print(celsius) debe dar 20.0'
    ],
    testCases: [
      {
        name: 'Temperatura 20.0 grados Celsius',
        expectedOutputs: ['20.0'],
        description: 'Muestra 20.0'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Operadores aritméticos básicos: +, -, *, /',
      'División entera (//) y operador módulo / resto (%)',
      'Potenciación con **',
      'Precedencia de operaciones matemáticas con paréntesis'
    ],
    congratulationsMessage: '¡Excelente! Ahora puedes resolver cualquier problema numérico de la vida real con Python.'
  }
};
