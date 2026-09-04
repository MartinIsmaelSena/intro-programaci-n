import { CourseModule } from '../../types/course';

export const module08: CourseModule = {
  id: 8,
  number: 8,
  title: 'La función print()',
  subtitle: 'Mostrar mensajes, números, múltiples variables y formato con f-strings',
  description: 'Domina todas las formas de comunicar los resultados de tus programas al usuario: textos, números, separación con comas y las modernas f-strings.',
  icon: '🖨️',
  estimatedTime: '30 min',
  category: 'io',
  theory: [
    {
      id: 'm8_t1',
      title: '1. El altavoz de tus programas: `print()`',
      content: 'Hasta ahora vimos cómo guardar cosas en memoria con variables. Pero si no las mostramos en la pantalla, el usuario nunca sabrá qué ocurrió.\n\nLa función `print()` es la ventana de salida de Python: toma cualquier valor o variable que le pongas entre sus paréntesis y lo escribe en la terminal o consola.',
      codeExample: {
        code: 'nombre = "Martín"\nedad = 30\n\n# Imprimir una variable:\nprint(nombre)\n\n# Imprimir múltiples cosas separadas por comas:\nprint("Hola", nombre, "tienes", edad, "años")',
        explanation: 'Al separar valores con comas dentro de print(), Python agrega un espacio en blanco automáticamente entre cada elemento.',
        output: 'Martín\nHola Martín tienes 30 años'
      },
      keyTakeaways: [
        'print() puede recibir textos, números, booleanos o variables.',
        'Separar argumentos con comas agrega automáticamente un espacio entre ellos.',
        'Al terminar de imprimir una línea, print() salta automáticamente a la siguiente.'
      ]
    },
    {
      id: 'm8_t2',
      title: '2. La forma moderna y elegante: f-strings',
      content: 'A partir de Python 3.6, existe una forma mucho más cómoda y limpia de armar oraciones con variables llamada **f-strings** (cadenas con formato).\n\nSolo agregas una letra `f` antes de abrir las comillas y escribes los nombres de las variables entre llaves `{}` directamente dentro del texto.',
      codeExample: {
        code: 'producto = "Café"\nprecio = 450\n\n# Usando una f-string limpia y legible:\nmensaje = f"El {producto} cuesta ${precio} pesos."\nprint(mensaje)',
        explanation: 'Python reemplaza {producto} y {precio} por sus valores correspondientes.',
        output: 'El Café cuesta $450 pesos.'
      },
      keyTakeaways: [
        'Colocá una f justo antes de la primera comilla: f"..."',
        'Dentro del texto, colocá cualquier variable entre llaves: {nombre_variable}',
        'Es el estándar más recomendado en la industria moderna de Python.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm8_q1',
      question: '¿Qué sucede si le pasas varios argumentos separados por coma a `print("Hola", "Mundo")`?',
      options: [
        'Se pegan juntos sin espacios: "HolaMundo"',
        'Python inserta automáticamente un espacio entre ellos: "Hola Mundo"',
        'Da un error de sintaxis',
        'Solo se imprime la primera palabra'
      ],
      correctAnswer: 1,
      explanation: 'Por defecto, la función `print()` separa cada argumento con un espacio en blanco.',
      hint: 'La coma agrega un espacio automático.'
    },
    {
      id: 'm8_q2',
      question: '¿Qué letra se coloca antes de las comillas para activar una f-string en Python?',
      options: [
        'La letra f (o F)',
        'La letra s',
        'El signo $',
        'La letra p'
      ],
      correctAnswer: 0,
      explanation: 'Se utiliza la letra `f` antes de abrir comillas, por ejemplo: `f"Hola {nombre}"`.',
      hint: 'Viene de "formatted string".'
    },
    {
      id: 'm8_q3',
      question: 'Si `x = 10`, ¿qué imprimirá `print("x")`?',
      options: [
        '10',
        'La letra x (porque está entre comillas como texto)',
        'Error',
        'None'
      ],
      correctAnswer: 1,
      explanation: 'Al tener comillas `"x"`, Python lo trata como el texto literal de la letra x, no como la variable.',
      hint: 'Para imprimir el valor de una variable no se deben usar comillas.'
    },
    {
      id: 'm8_q4',
      question: '¿Cuál es la forma correcta de usar una f-string para mostrar `nombre = "Ana"`?',
      options: [
        'print("Hola {nombre}")',
        'print(f"Hola {nombre}")',
        'print(f"Hola nombre")',
        'print("Hola" + {nombre})'
      ],
      correctAnswer: 1,
      explanation: 'Requiere la letra `f` al inicio y el nombre de la variable envuelto en llaves `{nombre}`.',
      hint: 'f antes de las comillas y llaves alrededor de la variable.'
    },
    {
      id: 'm8_q5',
      question: '¿Qué imprime por defecto `print()` al final de cada ejecución?',
      options: [
        'Un salto de línea (pasa a la línea siguiente)',
        'Un punto y coma',
        'Tres asteriscos',
        'Nada, se queda en la misma línea'
      ],
      correctAnswer: 0,
      explanation: 'Cada llamada a `print()` finaliza por defecto con un salto de línea (`\\n`), dejando el cursor listo para la próxima instrucción.',
      hint: 'Por eso sucesivos print() se muestran uno debajo del otro.'
    }
  ],
  exercises: [
    {
      id: 'm8_ex1',
      moduleId: 8,
      number: 1,
      title: 'Imprimir texto y variable juntos',
      description: 'Crea `nombre = "Martín"`. Usa `print("Hola", nombre)` para mostrar el saludo con espacio automático.',
      difficulty: 'starter',
      realWorldContext: 'Saludo de bienvenida en una aplicación.',
      starterCode: 'nombre = "Martín"\n# Imprime el saludo usando una coma:\n',
      solution: 'nombre = "Martín"\nprint("Hola", nombre)',
      hints: [
        'Usa comas dentro del print: print("Hola", nombre)',
        'Python agregará un espacio entre "Hola" y "Martín"'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Hola Martín',
          expectedOutputs: ['Hola Martín'],
          description: 'Muestra Hola Martín'
        }
      ]
    },
    {
      id: 'm8_ex2',
      moduleId: 8,
      number: 2,
      title: 'Mostrar precio con etiqueta',
      description: 'Crea `precio = 1500`. Usa print con coma para mostrar: "Precio: $ 1500" (`print("Precio: $", precio)`).',
      difficulty: 'starter',
      realWorldContext: 'Etiqueta de góndola en un supermercado.',
      starterCode: 'precio = 1500\n# Imprime la etiqueta de precio:\n',
      solution: 'precio = 1500\nprint("Precio: $", precio)',
      hints: [
        'print("Precio: $", precio)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Precio: $ 1500',
          expectedOutputs: ['Precio: $ 1500'],
          description: 'Muestra Precio: $ 1500'
        }
      ]
    },
    {
      id: 'm8_ex3',
      moduleId: 8,
      number: 3,
      title: 'Tu primera f-string',
      description: 'Crea `lenguaje = "Python"`. Imprime usando una f-string: `f"Estoy aprendiendo {lenguaje}"`.',
      difficulty: 'starter',
      realWorldContext: 'Generación dinámica de textos en interfaces.',
      starterCode: 'lenguaje = "Python"\n# Imprime con f-string:\n',
      solution: 'lenguaje = "Python"\nprint(f"Estoy aprendiendo {lenguaje}")',
      hints: [
        'Usa la f antes de la comilla: f"..."',
        'Pon la variable entre llaves: {lenguaje}',
        'print(f"Estoy aprendiendo {lenguaje}")'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Estoy aprendiendo Python',
          expectedOutputs: ['Estoy aprendiendo Python'],
          description: 'Muestra Estoy aprendiendo Python'
        }
      ]
    },
    {
      id: 'm8_ex4',
      moduleId: 8,
      number: 4,
      title: 'Ficha con múltiples variables en f-string',
      description: 'Crea `nombre = "Carlos"` y `edad = 28`. Usa una f-string para imprimir exactamente: "Me llamo Carlos y tengo 28 años".',
      difficulty: 'basic',
      realWorldContext: 'Presentación de biografía en un perfil.',
      starterCode: 'nombre = "Carlos"\nedad = 28\n# Imprime la oración con f-string:\n',
      solution: 'nombre = "Carlos"\nedad = 28\nprint(f"Me llamo {nombre} y tengo {edad} años")',
      hints: [
        'print(f"Me llamo {nombre} y tengo {edad} años")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Presentación completa',
          expectedOutputs: ['Me llamo Carlos y tengo 28 años'],
          description: 'Muestra la oración formateada'
        }
      ]
    },
    {
      id: 'm8_ex5',
      moduleId: 8,
      number: 5,
      title: 'Cálculo directo dentro de una f-string',
      description: '¡Las f-strings pueden calcular operaciones dentro de las llaves! Con `a = 5` y `b = 3`, imprime: `f"La suma es {a + b}"`.',
      difficulty: 'basic',
      realWorldContext: 'Reporte de totales en recibos de compra.',
      starterCode: 'a = 5\nb = 3\n# Imprime la suma directa en f-string:\n',
      solution: 'a = 5\nb = 3\nprint(f"La suma es {a + b}")',
      hints: [
        'Puedes escribir {a + b} directamente dentro de las llaves',
        'print(f"La suma es {a + b}")',
        'Mostrará: La suma es 8'
      ],
      xp: 25,
      testCases: [
        {
          name: 'La suma es 8',
          expectedOutputs: ['La suma es 8'],
          description: 'Muestra La suma es 8'
        }
      ]
    },
    {
      id: 'm8_ex6',
      moduleId: 8,
      number: 6,
      title: 'Separador personalizado con sep',
      description: '`print()` acepta un parámetro opcional llamado `sep`. Escribe `print("2026", "09", "15", sep="-")` para mostrar una fecha separada con guiones.',
      difficulty: 'basic',
      realWorldContext: 'Formateo de fechas ISO.',
      starterCode: '# Imprime fecha con sep="-":\n',
      solution: 'print("2026", "09", "15", sep="-")',
      hints: [
        'sep="-" reemplaza el espacio por un guión',
        'print("2026", "09", "15", sep="-")'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Fecha 2026-09-15',
          expectedOutputs: ['2026-09-15'],
          description: 'Muestra 2026-09-15'
        }
      ]
    },
    {
      id: 'm8_ex7',
      moduleId: 8,
      number: 7,
      title: 'Ticket de supermercado formateado',
      description: 'Tenemos `producto = "Leche"`, `cantidad = 2`, `precio_unitario = 950`. Calcula `total = cantidad * precio_unitario` y muestra con f-string: `f"{cantidad}x {producto} = ${total}"`.',
      difficulty: 'intermediate',
      realWorldContext: 'Línea de ítem en comprobante fiscal.',
      starterCode: 'producto = "Leche"\ncantidad = 2\nprecio_unitario = 950\n# Calcula el total e imprime con f-string:\n',
      solution: 'producto = "Leche"\ncantidad = 2\nprecio_unitario = 950\ntotal = cantidad * precio_unitario\nprint(f"{cantidad}x {producto} = ${total}")',
      hints: [
        'total = cantidad * precio_unitario (es 1900)',
        'print(f"{cantidad}x {producto} = ${total}")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Ticket 2x Leche = $1900',
          expectedOutputs: ['2x Leche = $1900'],
          description: 'Muestra la línea del ticket'
        }
      ]
    },
    {
      id: 'm8_ex8',
      moduleId: 8,
      number: 8,
      title: 'Mensaje multilínea con salto de línea \\n',
      description: 'El carácter especial `\\n` genera un salto de línea dentro de un mismo texto. Imprime en un solo print: "Línea 1\\nLínea 2".',
      difficulty: 'intermediate',
      realWorldContext: 'Párrafos ordenados en consola sin llamar a print múltiples veces.',
      starterCode: '# Usa \\n para saltar de línea:\n',
      solution: 'print("Línea 1\\nLínea 2")',
      hints: [
        'Escribe \\n dentro de las comillas',
        'print("Línea 1\\nLínea 2")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Dos líneas con salto',
          expectedOutputs: ['Línea 1', 'Línea 2'],
          description: 'Muestra Línea 1 y debajo Línea 2'
        }
      ]
    },
    {
      id: 'm8_ex9',
      moduleId: 8,
      number: 9,
      title: 'Tablero de puntuaciones',
      description: 'Crea `jugador = "Alex"`, `nivel = 5`, `puntos = 1250`. Imprime exactamente: "JUGADOR: Alex | NIVEL: 5 | SCORE: 1250" usando una f-string.',
      difficulty: 'intermediate',
      realWorldContext: 'HUD / Barra de estado en un juego.',
      starterCode: 'jugador = "Alex"\nnivel = 5\npuntos = 1250\n# Imprime la barra de estado:\n',
      solution: 'jugador = "Alex"\nnivel = 5\npuntos = 1250\nprint(f"JUGADOR: {jugador} | NIVEL: {nivel} | SCORE: {puntos}")',
      hints: [
        'print(f"JUGADOR: {jugador} | NIVEL: {nivel} | SCORE: {puntos}")'
      ],
      xp: 35,
      testCases: [
        {
          name: 'HUD completo',
          expectedOutputs: ['JUGADOR: Alex | NIVEL: 5 | SCORE: 1250'],
          description: 'Muestra la barra de estado del juego'
        }
      ]
    },
    {
      id: 'm8_ex10',
      moduleId: 8,
      number: 10,
      title: 'Desafío de print: Resumen financiero',
      description: 'Genera un balance mensual con variables: `ingresos = 80000`, `gastos = 52000`. Calcula `ahorro = ingresos - gastos`. Muestra con f-string en dos líneas:\n"Ingresos: $80000 | Gastos: $52000"\n"Ahorro del mes: $28000"',
      difficulty: 'challenge',
      realWorldContext: 'Reporte contable mensual de finanzas personales.',
      starterCode: 'ingresos = 80000\ngastos = 52000\n# Calcula ahorro e imprime las 2 líneas:\n',
      solution: 'ingresos = 80000\ngastos = 52000\nahorro = ingresos - gastos\nprint(f"Ingresos: ${ingresos} | Gastos: ${gastos}")\nprint(f"Ahorro del mes: ${ahorro}")',
      hints: [
        'ahorro = ingresos - gastos (es 28000)',
        'Primer print: print(f"Ingresos: ${ingresos} | Gastos: ${gastos}")',
        'Segundo print: print(f"Ahorro del mes: ${ahorro}")'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Balance financiero completo',
          expectedOutputs: ['Ingresos: $80000', 'Gastos: $52000', 'Ahorro del mes: $28000'],
          description: 'Muestra el balance en 2 líneas'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm8_chal1',
    title: '🚀 Desafío de print: Recibo de Compra Decorado',
    description: 'Genera un recibo decorado con líneas divisorias y f-strings:\n"------------------------"\n"FACTURA DE COMPRA"\n"Cliente: Lucía"\n"Total: $3500"\n"------------------------"',
    bonusXp: 100,
    badgeId: 'print_master',
    starterCode: 'cliente = "Lucía"\ntotal = 3500\n# Imprime el recibo completo:\n',
    solution: 'cliente = "Lucía"\ntotal = 3500\nprint("------------------------")\nprint("FACTURA DE COMPRA")\nprint(f"Cliente: {cliente}")\nprint(f"Total: ${total}")\nprint("------------------------")',
    hints: [
      'Usa las variables cliente y total dentro de las f-strings',
      'Incluye las líneas divisorias "------------------------"'
    ],
    testCases: [
      {
        name: 'Factura decorada',
        expectedOutputs: ['FACTURA DE COMPRA', 'Cliente: Lucía', 'Total: $3500'],
        description: 'Imprime el recibo completo'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Uso de print() para comunicar información en pantalla',
      'Impresión de múltiples valores con separación automática por comas',
      'f-strings modernas para integrar variables y expresiones dentro de cadenas',
      'Salto de línea implícito y uso de caracteres especiales como \\n'
    ],
    congratulationsMessage: '¡Fantástico! Ahora dominás el arte de comunicar datos de manera limpia, estética y profesional.'
  }
};
