import { CourseModule } from '../../types/course';

export const module14: CourseModule = {
  id: 14,
  number: 14,
  title: 'Integración y resolución de problemas',
  subtitle: 'Combinando todas las herramientas para construir programas reales y completos',
  description: 'Aplica todo lo aprendido: variables, tipos, operadores, print, input, condicionales y bucles en 5 proyectos emblemáticos y desafíos del mundo real.',
  icon: '🚀',
  estimatedTime: '45 min',
  category: 'proyectos',
  theory: [
    {
      id: 'm14_t1',
      title: '1. Pensar como programador: Deconstruir problemas complejos',
      content: 'Felicidades por llegar hasta aquí. Ya conoces las piezas fundamentales de la programación: variables para recordar, tipos para clasificar, operadores para calcular, print e input para comunicar, condicionales para decidir y bucles para automatizar.\n\nEl verdadero arte de la programación no es saberse las palabras de memoria, sino **saber combinarlas para resolver un problema de la vida real**.\n\n### La fórmula para resolver problemas:\n1. 🎯 **Entender la entrada:** ¿Qué datos necesito que me dé el usuario o el sistema?\n2. 🔄 **Definir el proceso:** ¿Qué cálculos, decisiones o repeticiones debo realizar paso a paso?\n3. 📢 **Entregar la salida:** ¿Qué resultado o mensaje debo mostrar con print()?',
      keyTakeaways: [
        'Descomponé siempre un problema grande en pequeños pasos manejables.',
        'Probá tu código con casos sencillos antes de agregar complejidad.',
        'La combinación de condicionales dentro de bucles es el patrón más común en software.'
      ]
    },
    {
      id: 'm14_t2',
      title: '2. Arquitectura de una aplicación interactiva',
      content: 'La mayoría de las aplicaciones de consola siguen un flujo estándar:\n\n1. Mensaje de bienvenida.\n2. Bucle principal de ejecución o menú de opciones.\n3. Recepción de datos del usuario con `input()`.\n4. Evaluación con `if / elif / else` para responder de acuerdo a la entrada.\n5. Salida con mensajes claros y formateados mediante f-strings.',
      codeExample: {
        code: '# Ejemplo integrador: Validador de contraseña básica\nintentos = 0\nmax_intentos = 3\nacceso = False\n\nwhile intentos < max_intentos and not acceso:\n    clave = input("Ingresa tu PIN: ")\n    if clave == "1234":\n        print("¡Acceso concedido!")\n        acceso = True\n    else:\n        intentos += 1\n        print(f"PIN incorrecto. Te quedan {max_intentos - intentos} intentos.")',
        explanation: 'Combina variables, while, if/else, input() y f-strings en un sistema de autenticación real.',
        output: 'Ingresa tu PIN: 1234\n¡Acceso concedido!'
      }
    }
  ],
  quiz: [
    {
      id: 'm14_q1',
      question: '¿Cuál es la mejor estrategia cuando un ejercicio parece demasiado difícil o largo?',
      options: [
        'Rendirse y cerrar la computadora',
        'Descomponer el problema en partes más pequeñas y resolver una por una',
        'Escribir 500 líneas al azar esperando que funcione',
        'Copiar código sin entender qué hace'
      ],
      correctAnswer: 1,
      explanation: 'Dividir y conquistar: resolver primero la entrada, luego una parte del cálculo, y finalmente la salida.',
      hint: 'Pensá en la estrategia de descomposición de problemas.'
    },
    {
      id: 'm14_q2',
      question: 'Si necesitas pedirle 5 números al usuario y sumarlos, ¿cuál es la estructura ideal?',
      options: [
        'Escribir 5 veces la misma línea a mano',
        'Usar un bucle for con range(5) que en cada vuelta pida un número con input() y lo acumule en una variable total',
        'Crear 5 archivos de Python diferentes',
        'Usar solo operadores booleanos'
      ],
      correctAnswer: 1,
      explanation: 'Un bucle `for i in range(5):` con `total += int(input(...))` es la forma limpia, escalable y profesional.',
      hint: 'Automatización con for y acumulador.'
    },
    {
      id: 'm14_q3',
      question: '¿Qué combinación es la base de la mayoría de los videojuegos y aplicaciones interactivas?',
      options: [
        'Un bucle while principal que contiene condicionales if/else para reaccionar a las acciones del usuario',
        'Solo instrucciones print',
        'Únicamente variables de texto',
        'Ninguna'
      ],
      correctAnswer: 0,
      explanation: 'El llamado "Game Loop" o "Main Loop" es un bucle que se repite continuamente evaluando las decisiones y teclas del jugador con condicionales.',
      hint: 'Es el patrón clásico while True + if.'
    },
    {
      id: 'm14_q4',
      question: '¿Qué función cumple la variable acumuladora `total = 0` antes de un bucle?',
      options: [
        'Guardar el estado inicial antes de ir sumando valores en cada iteración',
        'Borrar el historial de la terminal',
        'Contar los caracteres del código fuente',
        'Cerrar el programa'
      ],
      correctAnswer: 0,
      explanation: 'La variable acumuladora se inicializa en 0 y va recolectando las sumas parciales en cada vuelta del bucle.',
      hint: 'Es como una alcancía vacía antes de meterle monedas.'
    },
    {
      id: 'm14_q5',
      question: '¿Cuál de las siguientes es una buena práctica para que tu código sea comprensible para otros programadores?',
      options: [
        'Escribir todo en una sola línea larguísima',
        'Usar nombres de variables descriptivos y comentarios breves donde la lógica lo requiera',
        'Nombrar a todas las variables con una sola letra',
        'No usar espacios nunca'
      ],
      correctAnswer: 1,
      explanation: 'El código limpio (Clean Code) prioriza la claridad: nombres autoexplicativos como `precio_total` o `es_mayor_edad`.',
      hint: 'Recordá: "La legibilidad cuenta".'
    }
  ],
  exercises: [
    {
      id: 'm14_ex1',
      moduleId: 14,
      number: 1,
      title: 'Proyecto 1: Calculador de Promedio Escolar con Estado',
      description: 'Pide tres notas con `n1 = float(input("Nota 1: "))`, `n2 = float(input("Nota 2: "))`, `n3 = float(input("Nota 3: "))`. Calcula `promedio = (n1 + n2 + n3) / 3`. Muestra el promedio con f-string `f"Promedio: {promedio}"`. Si `promedio >= 7`, imprime "Aprobado", si no, imprime "Reprobado".',
      difficulty: 'basic',
      realWorldContext: 'Sistema de actas de examen docente.',
      starterCode: '# Pide 3 notas, calcula promedio y evalúa aprobación:\n',
      solution: 'n1 = float(input("Nota 1: "))\nn2 = float(input("Nota 2: "))\nn3 = float(input("Nota 3: "))\npromedio = (n1 + n2 + n3) / 3\nprint(f"Promedio: {promedio}")\nif promedio >= 7:\n    print("Aprobado")\nelse:\n    print("Reprobado")',
      hints: [
        'Pide las 3 notas usando float(input())',
        'promedio = (n1 + n2 + n3) / 3',
        'print(f"Promedio: {promedio}")',
        'if promedio >= 7: print("Aprobado") else: print("Reprobado")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Notas 8, 7, 9 = 8.0 Aprobado',
          inputs: ['8', '7', '9'],
          expectedOutputs: ['Promedio: 8.0', 'Aprobado'],
          description: 'Calcula 8.0 y muestra Aprobado'
        },
        {
          name: 'Notas 5, 6, 4 = 5.0 Reprobado',
          inputs: ['5', '6', '4'],
          expectedOutputs: ['Promedio: 5.0', 'Reprobado'],
          description: 'Calcula 5.0 y muestra Reprobado'
        }
      ]
    },
    {
      id: 'm14_ex2',
      moduleId: 14,
      number: 2,
      title: 'Proyecto 2: Sistema de Control de Acceso',
      description: 'Pide el usuario con `usuario = input("Usuario: ")` y la edad con `edad = int(input("Edad: "))`. Si `usuario == "admin"` y `edad >= 18`, imprime "Acceso total concedido". Si no, imprime "Acceso denegado".',
      difficulty: 'basic',
      realWorldContext: 'Módulo de seguridad de ingreso corporativo.',
      starterCode: '# Pide usuario y edad y valida acceso:\n',
      solution: 'usuario = input("Usuario: ")\nedad = int(input("Edad: "))\nif usuario == "admin" and edad >= 18:\n    print("Acceso total concedido")\nelse:\n    print("Acceso denegado")',
      hints: [
        'usuario = input("Usuario: ")',
        'edad = int(input("Edad: "))',
        'if usuario == "admin" and edad >= 18: print("Acceso total concedido")',
        'else: print("Acceso denegado")'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Admin de 25 años entra',
          inputs: ['admin', '25'],
          expectedOutputs: ['Acceso total concedido'],
          description: 'Permite acceso'
        },
        {
          name: 'Usuario común rechazado',
          inputs: ['pepe', '20'],
          expectedOutputs: ['Acceso denegado'],
          description: 'Rechaza acceso'
        }
      ]
    },
    {
      id: 'm14_ex3',
      moduleId: 14,
      number: 3,
      title: 'Proyecto 3: Generador de Tablas de Multiplicar a Pedido',
      description: 'Pide al usuario un número con `numero = int(input("Tabla del: "))`. Con un bucle `for i in range(1, 11):`, imprime cada línea con f-string: `f"{numero} x {i} = {numero * i}"`.',
      difficulty: 'intermediate',
      realWorldContext: 'App educativa para estudiantes de primaria.',
      starterCode: '# Pide un número y genera su tabla del 1 al 10:\n',
      solution: 'numero = int(input("Tabla del: "))\nfor i in range(1, 11):\n    print(f"{numero} x {i} = {numero * i}")',
      hints: [
        'numero = int(input("Tabla del: "))',
        'for i in range(1, 11):',
        '    print(f"{numero} x {i} = {numero * i}")'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Tabla del 7',
          inputs: ['7'],
          expectedOutputs: ['7 x 1 = 7', '7 x 5 = 35', '7 x 10 = 70'],
          description: 'Muestra la tabla completa del 7'
        }
      ]
    },
    {
      id: 'm14_ex4',
      moduleId: 14,
      number: 4,
      title: 'Proyecto 4: Calculadora Básica Multifunción',
      description: 'Pide dos números `a = float(input("Primer número: "))` y `b = float(input("Segundo número: "))`, y luego pide la operación con `op = input("Operación (+, -, *, /): ")`. Si `op == "+"`, imprime `a + b`. Si `op == "-"`, imprime `a - b`. Si `op == "*"`, imprime `a * b`. Si `op == "/"`, imprime `a / b`.',
      difficulty: 'intermediate',
      realWorldContext: 'Motor aritmético de una calculadora electrónica.',
      starterCode: '# Calculadora multifunción con if/elif:\n',
      solution: 'a = float(input("Primer número: "))\nb = float(input("Segundo número: "))\nop = input("Operación (+, -, *, /): ")\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\nelif op == "*":\n    print(a * b)\nelif op == "/":\n    print(a / b)',
      hints: [
        'Pide a y b como float',
        'Pide op como texto',
        'Usa if/elif para comparar op con "+", "-", "*", "/"'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Multiplicación 6 * 7 = 42.0',
          inputs: ['6', '7', '*'],
          expectedOutputs: ['42.0'],
          description: 'Calcula 42.0'
        },
        {
          name: 'Resta 10 - 4 = 6.0',
          inputs: ['10', '4', '-'],
          expectedOutputs: ['6.0'],
          description: 'Calcula 6.0'
        }
      ]
    },
    {
      id: 'm14_ex5',
      moduleId: 14,
      number: 5,
      title: 'Proyecto 5: Juego de Adivinanza de Número',
      description: 'Tenemos `secreto = 50`. Pide un número al usuario con `int(input("Adivina el número: "))`. Si es igual al secreto, imprime "¡Acertaste!". Si es mayor que el secreto, imprime "Demasiado alto". Si es menor, imprime "Demasiado bajo".',
      difficulty: 'intermediate',
      realWorldContext: 'Lógica central de juego interactivo.',
      starterCode: 'secreto = 50\n# Pide intento y da pistas:\n',
      solution: 'secreto = 50\nintento = int(input("Adivina el número: "))\nif intento == secreto:\n    print("¡Acertaste!")\nelif intento > secreto:\n    print("Demasiado alto")\nelse:\n    print("Demasiado bajo")',
      hints: [
        'intento = int(input("Adivina el número: "))',
        'if intento == secreto: print("¡Acertaste!")',
        'elif intento > secreto: print("Demasiado alto")',
        'else: print("Demasiado bajo")'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Acierto en 50',
          inputs: ['50'],
          expectedOutputs: ['¡Acertaste!'],
          description: 'Felicita por acierto'
        },
        {
          name: '75 es demasiado alto',
          inputs: ['75'],
          expectedOutputs: ['Demasiado alto'],
          description: 'Indica que es demasiado alto'
        }
      ]
    },
    {
      id: 'm14_ex6',
      moduleId: 14,
      number: 6,
      title: 'Carrito de compras con acumulador for',
      description: 'Un cliente compra 3 productos cuyos precios ingresa por teclado. Crea `total = 0`. Con un `for i in range(3):`, pide `precio = float(input("Precio producto: "))` y acumúlalo en `total`. Al terminar el bucle, muestra con f-string: `f"Total a pagar: ${total}"`.',
      difficulty: 'intermediate',
      realWorldContext: 'Punto de venta y checkout de e-commerce.',
      starterCode: 'total = 0\n# Bucle for para 3 productos:\n\n',
      solution: 'total = 0\nfor i in range(3):\n    precio = float(input("Precio producto: "))\n    total += precio\nprint(f"Total a pagar: ${total}")',
      hints: [
        'for i in range(3):',
        '    precio = float(input("Precio producto: "))',
        '    total += precio',
        'print(f"Total a pagar: ${total}")'
      ],
      xp: 40,
      testCases: [
        {
          name: '3 productos: 100, 250, 150 = 500.0',
          inputs: ['100', '250', '150'],
          expectedOutputs: ['Total a pagar: $500.0'],
          description: 'Muestra Total a pagar: $500.0'
        }
      ]
    },
    {
      id: 'm14_ex7',
      moduleId: 14,
      number: 7,
      title: 'Cajero automático: Límite de saldo con while',
      description: 'Un cliente tiene `saldo = 5000`. Con un bucle `while saldo >= 1000:`, descuenta 1000 de saldo (`saldo -= 1000`) e imprime con f-string `f"Retiro exitoso. Saldo restante: ${saldo}"`.',
      difficulty: 'intermediate',
      realWorldContext: 'Módulo de dispensación de billetes de cajero.',
      starterCode: 'saldo = 5000\n# Bucle de retiros de 1000:\n',
      solution: 'saldo = 5000\nwhile saldo >= 1000:\n    saldo -= 1000\n    print(f"Retiro exitoso. Saldo restante: ${saldo}")',
      hints: [
        'while saldo >= 1000:',
        '    saldo -= 1000',
        '    print(f"Retiro exitoso. Saldo restante: ${saldo}")'
      ],
      xp: 40,
      testCases: [
        {
          name: 'Retiros hasta saldo 0',
          expectedOutputs: ['Saldo restante: $4000', 'Saldo restante: $0'],
          description: 'Muestra retiros sucesivos'
        }
      ]
    },
    {
      id: 'm14_ex8',
      moduleId: 14,
      number: 8,
      title: 'Contador de vocales "a" en un texto',
      description: 'Pide una palabra con `palabra = input("Ingresa una palabra: ")`. Crea `cuenta = 0`. Con un `for letra in palabra:`, si `letra == "a" or letra == "A"`, suma 1 a cuenta (`cuenta += 1`). Al final imprime `cuenta`.',
      difficulty: 'intermediate',
      realWorldContext: 'Análisis de texto y procesamiento de lenguaje natural (NLP).',
      starterCode: '# Pide palabra y cuenta letras "a":\n',
      solution: 'palabra = input("Ingresa una palabra: ")\ncuenta = 0\nfor letra in palabra:\n    if letra == "a" or letra == "A":\n        cuenta += 1\nprint(cuenta)',
      hints: [
        'palabra = input("...")',
        'for letra in palabra:\n    if letra == "a" or letra == "A": cuenta += 1',
        'print(cuenta)'
      ],
      xp: 40,
      testCases: [
        {
          name: 'Palabra "banana" tiene 3 a',
          inputs: ['banana'],
          expectedOutputs: ['3'],
          description: 'Muestra 3'
        }
      ]
    },
    {
      id: 'm14_ex9',
      moduleId: 14,
      number: 9,
      title: 'Validador de longitud de contraseña',
      description: 'Pide una clave con `clave = input("Nueva contraseña: ")`. La función `len(clave)` cuenta cuántas letras tiene. Si `len(clave) >= 8`, imprime "Contraseña segura", si no, imprime "Contraseña muy corta".',
      difficulty: 'intermediate',
      realWorldContext: 'Validación de seguridad en formularios de registro.',
      starterCode: '# Valida longitud de contraseña con len():\n',
      solution: 'clave = input("Nueva contraseña: ")\nif len(clave) >= 8:\n    print("Contraseña segura")\nelse:\n    print("Contraseña muy corta")',
      hints: [
        'len(clave) te da el número de caracteres',
        'if len(clave) >= 8: print("Contraseña segura")',
        'else: print("Contraseña muy corta")'
      ],
      xp: 45,
      testCases: [
        {
          name: 'Clave segura',
          inputs: ['supersecreto123'],
          expectedOutputs: ['Contraseña segura'],
          description: 'Muestra Contraseña segura'
        },
        {
          name: 'Clave corta',
          inputs: ['1234'],
          expectedOutputs: ['Contraseña muy corta'],
          description: 'Muestra Contraseña muy corta'
        }
      ]
    },
    {
      id: 'm14_ex10',
      moduleId: 14,
      number: 10,
      title: 'Gran Proyecto Final: Simulador de Tienda con Descuento Especial',
      description: 'Pide el nombre del cliente con `nombre = input("Cliente: ")`, el total de la compra con `total = float(input("Monto: "))` y si tiene cupón con `tiene_cupon = input("¿Cupón? (si/no): ")`. Si `total > 10000` y `tiene_cupon == "si"`, aplica un 20% de descuento (`descuento = total * 0.20`), si no, el descuento es 0. Calcula `final = total - descuento`. Imprime con f-string: `f"Cliente: {nombre} | Total final: ${final}"`.',
      difficulty: 'challenge',
      realWorldContext: 'Sistema integral de facturación comercial.',
      starterCode: '# Simulador completo de tienda con descuento:\n',
      solution: 'nombre = input("Cliente: ")\ntotal = float(input("Monto: "))\ntiene_cupon = input("¿Cupón? (si/no): ")\nif total > 10000 and tiene_cupon == "si":\n    descuento = total * 0.20\nelse:\n    descuento = 0\nfinal = total - descuento\nprint(f"Cliente: {nombre} | Total final: ${final}")',
      hints: [
        'Evalúa: if total > 10000 and tiene_cupon == "si":',
        'descuento = total * 0.20',
        'final = total - descuento',
        'print(f"Cliente: {nombre} | Total final: ${final}")'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Compra 15000 con cupón (descuento a 12000.0)',
          inputs: ['Martín', '15000', 'si'],
          expectedOutputs: ['Cliente: Martín | Total final: $12000.0'],
          description: 'Aplica 20% de descuento'
        },
        {
          name: 'Compra 5000 sin cupón (mantiene 5000.0)',
          inputs: ['Ana', '5000', 'no'],
          expectedOutputs: ['Cliente: Ana | Total final: $5000.0'],
          description: 'Mantiene precio regular'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm14_chal1',
    title: '🚀 Desafío Supremo: El Mini-Cajero Automático Completo',
    description: 'Modela un cajero con saldo inicial 10000: pide al usuario la operación (`op = input("Operación (consultar/extraer): ")`). Si `op == "consultar"`, muestra `f"Saldo: $10000"`. Si `op == "extraer"`, pide el monto (`monto = int(input("Monto a extraer: "))`). Si `monto <= 10000`, muestra `f"Extracción exitosa: ${monto}"`, si no, muestra "Fondos insuficientes".',
    bonusXp: 150,
    badgeId: 'problem_solver',
    starterCode: 'saldo = 10000\n# Lógica del cajero automático:\n',
    solution: 'saldo = 10000\nop = input("Operación (consultar/extraer): ")\nif op == "consultar":\n    print(f"Saldo: ${saldo}")\nelif op == "extraer":\n    monto = int(input("Monto a extraer: "))\n    if monto <= saldo:\n        print(f"Extracción exitosa: ${monto}")\n    else:\n        print("Fondos insuficientes")',
    hints: [
      'if op == "consultar": print(f"Saldo: ${saldo}")',
      'elif op == "extraer": pide monto',
      'Compara monto con saldo'
    ],
    testCases: [
      {
        name: 'Consulta de saldo',
        inputs: ['consultar'],
        expectedOutputs: ['Saldo: $10000'],
        description: 'Muestra Saldo: $10000'
      },
      {
        name: 'Extracción permitida de 3000',
        inputs: ['extraer', '3000'],
        expectedOutputs: ['Extracción exitosa: $3000'],
        description: 'Discesa dinero'
      },
      {
        name: 'Extracción denegada de 20000',
        inputs: ['extraer', '20000'],
        expectedOutputs: ['Fondos insuficientes'],
        description: 'Rechaza por fondos insuficientes'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Integración armónica de variables, tipos, operadores, I/O, condicionales y bucles',
      'Metodología de resolución de problemas: Entrada ➔ Proceso ➔ Salida',
      'Construcción de programas completos de la vida real (cajeros, calculadoras, tiendas)',
      'Fundamentos sólidos para continuar hacia listas avanzadas, funciones y proyectos profesionales'
    ],
    congratulationsMessage: '¡ENHORABUENA! Has completado con éxito todo el plan de estudios de Python desde Cero. Ahora tienes los fundamentos para crear programas reales.'
  }
};
