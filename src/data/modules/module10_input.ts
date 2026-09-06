import { CourseModule } from '../../types/course';

export const module10: CourseModule = {
  id: 10,
  number: 10,
  title: 'La función input()',
  subtitle: 'Pedir información al usuario y convertir datos con int() y float()',
  description: 'Aprende a crear programas interactivos que escuchen al usuario, soliciten respuestas por teclado y conviertan textos a números para operar matemáticamente.',
  icon: '⌨️',
  estimatedTime: '35 min',
  category: 'io',
  theory: [
    {
      id: 'm9_t1',
      title: '1. Darle voz al usuario con `input()`',
      content: 'Hasta ahora, todos nuestros datos estaban escritos fijos en el código (lo que llamamos "hardcodeados"). Pero los programas reales interactúan con seres humanos: te piden tu nombre de usuario, tu edad o tu tarjeta.\n\nLa función `input()` **pausa la ejecución del programa** y espera a que el usuario escriba algo en el teclado y presione la tecla Enter.',
      codeExample: {
        code: 'nombre = input("¿Cómo te llamás? ")\nprint("Hola,", nombre)',
        explanation: 'input() muestra la pregunta entre comillas, espera la respuesta y guarda lo que el usuario escribió dentro de la variable nombre.',
        output: '¿Cómo te llamás? Martín\nHola, Martín'
      },
      keyTakeaways: [
        'input("Mensaje de pregunta") muestra un texto y espera al usuario.',
        'La ejecución se reanuda inmediatamente cuando el usuario presiona Enter.',
        'El resultado SIEMPRE debe guardarse en una variable para no perderlo.'
      ]
    },
    {
      id: 'm9_t2',
      title: '2. ¡La regla de oro de `input()`: Siempre devuelve texto (`str`)!',
      content: 'Aunque el usuario escriba el número `40`, la función `input()` lo guarda como texto con comillas: `"40"`. Si intentas sumar dos inputs directamente, Python los concatenará (pegará) como letras en lugar de sumarlos matemáticamente (`"5" + "5"` da `"55"`, no `10`).\n\nPara hacer operaciones matemáticas, debemos **convertir (castear)** la entrada usando:\n- `int(...)` para números enteros.\n- `float(...)` para números decimales.',
      codeExample: {
        code: '# Conversión a entero:\nedad = int(input("¿Cuántos años tenés? "))\nedad_el_proximo_anio = edad + 1\nprint("El año que viene tendrás:", edad_el_proximo_anio)',
        explanation: 'Al envolver input() con int(), convertimos la respuesta en un número real que se puede sumar.',
        output: '¿Cuántos años tenés? 20\nEl año que viene tendrás: 21'
      },
      keyTakeaways: [
        'input() devuelve SIEMPRE str.',
        'Usá int(input("...")) cuando necesites un número entero.',
        'Usá float(input("...")) cuando necesites un precio o medida decimal.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm9_q1',
      question: '¿Qué tipo de dato devuelve SIEMPRE la función `input()` por defecto?',
      options: [
        'int (número entero)',
        'str (cadena de texto)',
        'float (número decimal)',
        'bool (booleano)'
      ],
      correctAnswer: 1,
      explanation: '`input()` siempre devuelve lo escrito como un `str` (cadena de caracteres), incluso si el usuario solo tecleó números.',
      hint: 'Recordá la regla de oro: todo lo que entra por teclado es inicialmente texto.'
    },
    {
      id: 'm9_q2',
      question: 'Si un usuario ingresa `5` y `5` en este código:\na = input()\nb = input()\nprint(a + b)\n¿Qué se imprimirá en pantalla?',
      options: [
        '10',
        '"55" (se concatenan como textos)',
        'Error',
        '0'
      ],
      correctAnswer: 1,
      explanation: 'Como `a` y `b` son strings (`"5"` y `"5"`), el operador `+` concatena los textos dando `"55"`.',
      hint: '¿Qué hace el signo + entre dos cadenas de texto?'
    },
    {
      id: 'm9_q3',
      question: '¿Cómo convertimos una entrada a número entero correctamente al momento de pedirla?',
      options: [
        'edad = int(input("Tu edad: "))',
        'edad = input(int("Tu edad: "))',
        'edad = int + input("Tu edad: ")',
        'edad = number(input("Tu edad: "))'
      ],
      correctAnswer: 0,
      explanation: 'Envolvemos toda la llamada a `input()` dentro de `int(...)`: primero se pide el dato y luego `int()` lo transforma a número.',
      hint: 'int debe envolver por fuera a input().'
    },
    {
      id: 'm9_q4',
      question: '¿Qué función se debe usar si el usuario va a ingresar un precio con decimales (por ejemplo: 99.5)?',
      options: [
        'float(input(...))',
        'int(input(...))',
        'str(input(...))',
        'decimal(input(...))'
      ],
      correctAnswer: 0,
      explanation: '`float()` convierte el texto a un número con punto decimal.',
      hint: 'Recordá el tipo de dato para decimales: float.'
    },
    {
      id: 'm9_q5',
      question: '¿Qué ocurre si el usuario escribe "hola" cuando el código ejecuta `int(input())`?',
      options: [
        'Python lo convierte a 0',
        'Ocurre un error de valor (`ValueError`) porque "hola" no se puede transformar en número',
        'La computadora se reinicia',
        'Python lo ignora en silencio'
      ],
      correctAnswer: 1,
      explanation: 'Python arroja un `ValueError: invalid literal for int()` porque las letras no representan un número entero válido.',
      hint: 'Pensá en qué error pedagógico vimos en el explicador de errores.'
    }
  ],
  exercises: [
    {
      id: 'm9_ex1',
      moduleId: 10,
      number: 1,
      title: 'Pedir el nombre y saludar',
      description: 'Pide al usuario su nombre con `nombre = input("¿Cómo te llamas? ")` y luego muestra "Hola" seguido de su nombre usando `print("Hola", nombre)`.',
      difficulty: 'starter',
      realWorldContext: 'Onboarding de usuario en una app.',
      starterCode: '# Pide el nombre y saluda:\n',
      solution: 'nombre = input("¿Cómo te llamas? ")\nprint("Hola", nombre)',
      hints: [
        'nombre = input("¿Cómo te llamas? ")',
        'print("Hola", nombre)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Saludo a Lucas',
          inputs: ['Lucas'],
          expectedOutputs: ['Hola Lucas'],
          description: 'Lee Lucas y muestra Hola Lucas'
        }
      ]
    },
    {
      id: 'm9_ex2',
      moduleId: 10,
      number: 2,
      title: 'Pedir color favorito',
      description: 'Pide al usuario su color favorito con `color = input("Tu color favorito: ")`. Luego imprime con f-string: `f"Tu color favorito es {color}"`.',
      difficulty: 'starter',
      realWorldContext: 'Personalización del tema visual.',
      starterCode: '# Pide el color e imprímelo:\n',
      solution: 'color = input("Tu color favorito: ")\nprint(f"Tu color favorito es {color}")',
      hints: [
        'color = input("Tu color favorito: ")',
        'print(f"Tu color favorito es {color}")'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Color azul',
          inputs: ['Azul'],
          expectedOutputs: ['Tu color favorito es Azul'],
          description: 'Muestra el color favorito'
        }
      ]
    },
    {
      id: 'm9_ex3',
      moduleId: 10,
      number: 3,
      title: 'Suma interactiva de dos números con int()',
      description: 'Pide dos números enteros al usuario usando `int(input())`. Suma ambos números en una variable `suma` e imprime el resultado.',
      difficulty: 'basic',
      realWorldContext: 'Calculadora de suma en línea.',
      starterCode: '# Pide dos números, súmalos e imprime el resultado:\n',
      solution: 'n1 = int(input("Primer número: "))\nn2 = int(input("Segundo número: "))\nsuma = n1 + n2\nprint(suma)',
      hints: [
        'n1 = int(input("Primer número: "))',
        'n2 = int(input("Segundo número: "))',
        'suma = n1 + n2 y luego print(suma)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Suma 10 + 20 = 30',
          inputs: ['10', '20'],
          expectedOutputs: ['30'],
          description: 'Suma 10 y 20 produciendo 30'
        }
      ]
    },
    {
      id: 'm9_ex4',
      moduleId: 10,
      number: 4,
      title: 'Calcular el doble de un número',
      description: 'Pide un número entero al usuario con `numero = int(input("Ingresa un número: "))`. Calcula `doble = numero * 2` e imprime `doble`.',
      difficulty: 'basic',
      realWorldContext: 'Multiplicador automático de fichas de juego.',
      starterCode: '# Pide un número y muestra su doble:\n',
      solution: 'numero = int(input("Ingresa un número: "))\ndoble = numero * 2\nprint(doble)',
      hints: [
        'numero = int(input("Ingresa un número: "))',
        'doble = numero * 2',
        'print(doble)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Doble de 7 es 14',
          inputs: ['7'],
          expectedOutputs: ['14'],
          description: 'Muestra 14'
        }
      ]
    },
    {
      id: 'm9_ex5',
      moduleId: 10,
      number: 5,
      title: 'Cálculo de edad futura',
      description: 'Pide la edad actual del usuario con `edad = int(input("¿Qué edad tienes? "))`. Calcula `en_cinco_anios = edad + 5` y muestra el mensaje con f-string: `f"En 5 años tendrás {en_cinco_anios} años"`.',
      difficulty: 'basic',
      realWorldContext: 'Proyecciones de jubilación o seguros.',
      starterCode: '# Edad dentro de 5 años:\n',
      solution: 'edad = int(input("¿Qué edad tienes? "))\nen_cinco_anios = edad + 5\nprint(f"En 5 años tendrás {en_cinco_anios} años")',
      hints: [
        'Usa int(input())',
        'Suma 5 a la edad',
        'Imprime con la f-string solicitada'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Edad 20 -> 25',
          inputs: ['20'],
          expectedOutputs: ['En 5 años tendrás 25 años'],
          description: 'Muestra la edad proyectada'
        }
      ]
    },
    {
      id: 'm9_ex6',
      moduleId: 10,
      number: 6,
      title: 'Precio total con cantidad pedida por teclado',
      description: 'Un alfajor cuesta 500 pesos (`precio = 500`). Pide al usuario cuántos alfajores quiere comprar con `cantidad = int(input("¿Cuántos alfajores quieres? "))`. Calcula `total = precio * cantidad` e imprime `total`.',
      difficulty: 'intermediate',
      realWorldContext: 'Punto de venta de un quiosco.',
      starterCode: 'precio = 500\n# Pide cantidad, calcula total e imprime:\n',
      solution: 'precio = 500\ncantidad = int(input("¿Cuántos alfajores quieres? "))\ntotal = precio * cantidad\nprint(total)',
      hints: [
        'cantidad = int(input("..."))',
        'total = precio * cantidad',
        'print(total)'
      ],
      xp: 30,
      testCases: [
        {
          name: '3 alfajores = 1500',
          inputs: ['3'],
          expectedOutputs: ['1500'],
          description: 'Muestra 1500'
        }
      ]
    },
    {
      id: 'm9_ex7',
      moduleId: 10,
      number: 7,
      title: 'Entrada con números decimales con float()',
      description: 'Pide al usuario el precio en dólares de un producto con `precio = float(input("Precio en USD: "))`. Si el dólar cotiza a 1200 pesos (`tipo_cambio = 1200`), calcula `precio_pesos = precio * tipo_cambio` e imprime `precio_pesos`.',
      difficulty: 'intermediate',
      realWorldContext: 'Conversor de divisas en tiempo real.',
      starterCode: 'tipo_cambio = 1200\n# Pide precio con float(), calcula en pesos e imprime:\n',
      solution: 'tipo_cambio = 1200\nprecio = float(input("Precio en USD: "))\nprecio_pesos = precio * tipo_cambio\nprint(precio_pesos)',
      hints: [
        'Usa float(input()) para permitir decimales como 10.5',
        'precio_pesos = precio * tipo_cambio',
        'print(precio_pesos)'
      ],
      xp: 30,
      testCases: [
        {
          name: '10 USD = 12000.0 pesos',
          inputs: ['10'],
          expectedOutputs: ['12000.0'],
          description: 'Muestra 12000.0'
        }
      ]
    },
    {
      id: 'm9_ex8',
      moduleId: 10,
      number: 8,
      title: 'Repartir cuenta del restaurante entre comensales',
      description: 'Pide el total de la cuenta con `total = float(input("Total de la cuenta: "))` y la cantidad de personas con `personas = int(input("Cantidad de personas: "))`. Calcula `por_persona = total / personas` e imprime `por_persona`.',
      difficulty: 'intermediate',
      realWorldContext: 'Calculadora de propinas y división de gastos.',
      starterCode: '# Pide total y personas, divide la cuenta e imprime:\n',
      solution: 'total = float(input("Total de la cuenta: "))\npersonas = int(input("Cantidad de personas: "))\npor_persona = total / personas\nprint(por_persona)',
      hints: [
        'total = float(input(...))',
        'personas = int(input(...))',
        'por_persona = total / personas',
        'print(por_persona)'
      ],
      xp: 35,
      testCases: [
        {
          name: '6000 entre 3 = 2000.0',
          inputs: ['6000', '3'],
          expectedOutputs: ['2000.0'],
          description: 'Muestra 2000.0'
        }
      ]
    },
    {
      id: 'm9_ex9',
      moduleId: 10,
      number: 9,
      title: 'Área de un triángulo interactiva',
      description: 'Pide la base con `base = float(input("Base: "))` y la altura con `altura = float(input("Altura: "))`. Calcula el área (`area = (base * altura) / 2`) e imprime `area`.',
      difficulty: 'intermediate',
      realWorldContext: 'Herramienta de cálculo geométrico.',
      starterCode: '# Pide base y altura de un triángulo y muestra su área:\n',
      solution: 'base = float(input("Base: "))\naltura = float(input("Altura: "))\narea = (base * altura) / 2\nprint(area)',
      hints: [
        'area = (base * altura) / 2',
        'print(area)'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Base 10, Altura 5 = 25.0',
          inputs: ['10', '5'],
          expectedOutputs: ['25.0'],
          description: 'Muestra 25.0'
        }
      ]
    },
    {
      id: 'm9_ex10',
      moduleId: 10,
      number: 10,
      title: 'Desafío de input(): Generador interactivo de Carnet',
      description: 'Pide al usuario tres datos: `nombre = input("Nombre: ")`, `apellido = input("Apellido: ")` y `dni = input("DNI: ")`. Imprime exactamente un carnet de dos líneas:\n"===================="\n"SOCIO: {apellido}, {nombre} | DNI: {dni}" usando f-string.',
      difficulty: 'challenge',
      realWorldContext: 'Emisión de credenciales en un club deportivo.',
      starterCode: '# Pide nombre, apellido y dni y genera la credencial:\n',
      solution: 'nombre = input("Nombre: ")\napellido = input("Apellido: ")\ndni = input("DNI: ")\nprint("====================")\nprint(f"SOCIO: {apellido}, {nombre} | DNI: {dni}")',
      hints: [
        'Pide los 3 datos como texto (con input() común)',
        'Imprime la línea divisoria',
        'Imprime con la f-string solicitada'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Credencial generada',
          inputs: ['Martín', 'Gómez', '38999111'],
          expectedOutputs: ['SOCIO: Gómez, Martín | DNI: 38999111'],
          description: 'Muestra el carnet con los datos ingresados'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm9_chal1',
    title: '🚀 Desafío Interactivo: Calculador de Índice de Masa Corporal (IMC)',
    description: 'El IMC se calcula como: `imc = peso / (altura ** 2)`. Pide al usuario su peso en kg con `peso = float(input("Peso (kg): "))` y su altura en metros con `altura = float(input("Altura (m): "))`. Calcula `imc` e imprímelo.',
    bonusXp: 100,
    badgeId: 'data_input',
    starterCode: '# Pide peso y altura, calcula el IMC e imprímelo:\n',
    solution: 'peso = float(input("Peso (kg): "))\naltura = float(input("Altura (m): "))\nimc = peso / (altura ** 2)\nprint(imc)',
    hints: [
      'Usa float(input()) para ambos datos',
      'altura ** 2 eleva la altura al cuadrado',
      'imc = peso / (altura ** 2)',
      'print(imc)'
    ],
    testCases: [
      {
        name: 'Peso 70, Altura 1.75 -> IMC ~22.85',
        inputs: ['70', '1.75'],
        expectedOutputPattern: '22\\.85',
        description: 'Muestra el IMC aproximado'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Cómo recibir información del usuario mediante input()',
      'Por qué input() devuelve siempre cadenas de texto (str)',
      'Conversión de tipos con int() y float() para cálculos numéricos',
      'Construcción de programas interactivos que responden en tiempo real'
    ],
    congratulationsMessage: '¡Increíble! Ahora tus programas no solo hablan: también escuchan y procesan las respuestas de las personas.'
  }
};
