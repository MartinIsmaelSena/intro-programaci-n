import { CourseModule } from '../../types/course';

export const module14: CourseModule = {
  id: 14,
  number: 14,
  title: 'El bucle while',
  subtitle: 'Repetición condicionada y prevención de bucles infinitos',
  description: 'Aprende a ejecutar código mientras una condición permanezca verdadera, controlar variables de corte, actualizar contadores y evitar el riesgo de bucles infinitos.',
  icon: '♻️',
  estimatedTime: '40 min',
  category: 'bucles',
  theory: [
    {
      id: 'm13_t1',
      title: '1. ¿Qué es el bucle `while` y cómo funciona?',
      content: 'La palabra en inglés `while` significa **"mientras"**.\n\nA diferencia del bucle `for` (que recorre una cantidad fija de pasos en un rango), el bucle `while` **evalúa una condición booleana antes de cada vuelta**: si la condición es `True`, ejecuta el bloque de código. Luego vuelve a evaluar la condición; si sigue siendo `True`, repite; y en cuanto se vuelve `False`, el bucle se detiene.',
      codeExample: {
        code: 'contador = 1\n\nwhile contador <= 5:\n    print("Número:", contador)\n    contador = contador + 1  # o contador += 1\n\nprint("¡Bucle finalizado!")',
        explanation: 'En cada vuelta aumentamos el contador en 1. Cuando contador llega a 6, la condición 6 <= 5 es False y el bucle termina.',
        output: 'Número: 1\nNúmero: 2\nNúmero: 3\nNúmero: 4\nNúmero: 5\n¡Bucle finalizado!'
      },
      keyTakeaways: [
        'while condición: se repite mientras la condición sea True.',
        'Es fundamental que dentro del bucle ocurra algo que eventualmente cambie la condición a False.',
        'contador += 1 es la forma abreviada de contador = contador + 1.'
      ]
    },
    {
      id: 'm13_t2',
      title: '2. El peligro del bucle infinito y cómo evitarlo',
      content: 'Si olvidas modificar la variable de control dentro del bucle, la condición seguirá siendo `True` eternamente y la computadora se quedará atrapada en un **bucle infinito** consumiendo procesador.\n\n```python\n# ❌ BUCLE INFINITO PELIGROSO:\ncontador = 1\nwhile contador <= 5:\n    print(contador)\n    # ¡Olvidamos incrementar el contador!\n    # contador siempre valdrá 1 y nunca terminará\n```',
      keyTakeaways: [
        'Asegúrate SIEMPRE de actualizar la variable de control dentro del bloque del while.',
        'La instrucción break permite cortar y salir de un bucle inmediatamente si ocurre algo especial.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm13_q1',
      question: '¿Qué significa la palabra `while` en español en el contexto de programación?',
      options: [
        'Por siempre',
        'Mientras (se cumpla una condición)',
        'Hasta nunca',
        'Durante el día'
      ],
      correctAnswer: 1,
      explanation: '`while` indica que el bloque se ejecutará "mientras" la condición evaluada siga siendo verdadera.',
      hint: 'Es la traducción directa de while al español.'
    },
    {
      id: 'm13_q2',
      question: '¿Qué sucede si la condición de un bucle `while` es `False` desde el inicio?',
      options: [
        'Se ejecuta exactamente una vez',
        'Nunca llega a ejecutarse ni una sola vez',
        'Da un error de compilación',
        'Se repite infinitamente'
      ],
      correctAnswer: 1,
      explanation: 'Como la comprobación se realiza antes de entrar, si la condición es falsa desde el principio, el bloque se omite por completo.',
      hint: 'La comprobación es previa a la primera iteración.'
    },
    {
      id: 'm13_q3',
      question: '¿Qué es la instrucción `contador += 1`?',
      options: [
        'Una forma abreviada y elegante de escribir `contador = contador + 1`',
        'Un comando para reiniciar la variable a cero',
        'Un error de tipeo que no compila',
        'Una función para multiplicar por 1'
      ],
      correctAnswer: 0,
      explanation: '`+=` es el operador de asignación aumentada: le suma el valor de la derecha a la variable actual.',
      hint: 'Suma 1 al valor que ya tenía la variable.'
    },
    {
      id: 'm13_q4',
      question: '¿Cómo se llama la palabra reservada de Python que permite frenar y salir forzosamente de un bucle?',
      options: [
        'stop',
        'break',
        'exit_loop',
        'cancel'
      ],
      correctAnswer: 1,
      explanation: '`break` interrumpe de manera inmediata la ejecución de cualquier bucle (`for` o `while`) y salta a la primera línea que esté fuera de él.',
      hint: 'En inglés significa "romper" o "freno".'
    },
    {
      id: 'm13_q5',
      question: '¿Cuál es la causa más frecuente de un bucle infinito en un `while`?',
      options: [
        'Usar números negativos',
        'Olvidar modificar o incrementar la variable de control dentro del bucle',
        'Tener más de un print',
        'Usar comillas dobles en vez de simples'
      ],
      correctAnswer: 1,
      explanation: 'Si la variable nunca cambia, la condición siempre es `True` y el bucle nunca encuentra motivo para detenerse.',
      hint: 'Pensá en qué hace que la condición cambie a False.'
    }
  ],
  exercises: [
    {
      id: 'm13_ex1',
      moduleId: 14,
      number: 1,
      title: 'Contador simple con while',
      description: 'Crea `contador = 1`. Con un bucle `while contador <= 3:`, imprime `contador` e increméntalo con `contador = contador + 1`.',
      difficulty: 'starter',
      realWorldContext: 'Conteo básico de repeticiones.',
      starterCode: 'contador = 1\n# Escribe el while e incrementa el contador:\n',
      solution: 'contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador = contador + 1',
      hints: [
        'while contador <= 3:',
        '    print(contador)',
        '    contador = contador + 1'
      ],
      xp: 20,
      testCases: [
        {
          name: '1, 2, 3',
          expectedOutputs: ['1', '2', '3'],
          description: 'Muestra 1, 2 y 3'
        }
      ]
    },
    {
      id: 'm13_ex2',
      moduleId: 14,
      number: 2,
      title: 'Cuenta regresiva con while',
      description: 'Inicia con `segundos = 5`. Con un `while segundos > 0:`, imprime `segundos` y réstale 1 (`segundos = segundos - 1`).',
      difficulty: 'starter',
      realWorldContext: 'Cuenta regresiva de lanzamiento.',
      starterCode: 'segundos = 5\n# Cuenta regresiva hasta 1:\n',
      solution: 'segundos = 5\nwhile segundos > 0:\n    print(segundos)\n    segundos = segundos - 1',
      hints: [
        'while segundos > 0:',
        '    print(segundos)',
        '    segundos = segundos - 1'
      ],
      xp: 20,
      testCases: [
        {
          name: '5 al 1',
          expectedOutputs: ['5', '4', '3', '2', '1'],
          description: 'Muestra 5, 4, 3, 2, 1'
        }
      ]
    },
    {
      id: 'm13_ex3',
      moduleId: 14,
      number: 3,
      title: 'Uso del operador +=',
      description: 'Crea `x = 2`. Con un `while x <= 10:`, imprime `x` y súmale 2 usando `x += 2`.',
      difficulty: 'basic',
      realWorldContext: 'Avance de a pares con operador compacto.',
      starterCode: 'x = 2\n# While con paso += 2:\n',
      solution: 'x = 2\nwhile x <= 10:\n    print(x)\n    x += 2',
      hints: [
        'while x <= 10:\n    print(x)\n    x += 2'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Pares hasta 10',
          expectedOutputs: ['2', '4', '6', '8', '10'],
          description: 'Muestra 2, 4, 6, 8, 10'
        }
      ]
    },
    {
      id: 'm13_ex4',
      moduleId: 14,
      number: 4,
      title: 'Acumulador de ahorros',
      description: 'Crea `ahorro = 0` y `mes = 1`. Con `while mes <= 4:`, suma 500 al ahorro (`ahorro += 500`) y avanza de mes (`mes += 1`). Al final del bucle imprime `ahorro`.',
      difficulty: 'basic',
      realWorldContext: 'Plan de ahorro mensual.',
      starterCode: 'ahorro = 0\nmes = 1\n# Acumula ahorros durante 4 meses:\n\n# Imprime ahorro:\n',
      solution: 'ahorro = 0\nmes = 1\nwhile mes <= 4:\n    ahorro += 500\n    mes += 1\nprint(ahorro)',
      hints: [
        'while mes <= 4:',
        '    ahorro += 500',
        '    mes += 1',
        'print(ahorro) dará 2000'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Ahorro 2000',
          expectedOutputs: ['2000'],
          description: 'Muestra 2000'
        }
      ]
    },
    {
      id: 'm13_ex5',
      moduleId: 14,
      number: 5,
      title: 'Duplicar hasta superar 100',
      description: 'Crea `numero = 3`. Con un `while numero < 100:`, duplica el número (`numero = numero * 2`). Al final imprime el valor final de `numero`.',
      difficulty: 'basic',
      realWorldContext: 'Crecimiento exponencial en cultivos biológicos.',
      starterCode: 'numero = 3\n# Duplica hasta superar 100:\n\nprint(numero)\n',
      solution: 'numero = 3\nwhile numero < 100:\n    numero = numero * 2\nprint(numero)',
      hints: [
        'while numero < 100:\n    numero = numero * 2',
        'La secuencia es 3 -> 6 -> 12 -> 24 -> 48 -> 96 -> 192',
        'Imprimirá 192'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Supera 100 en 192',
          expectedOutputs: ['192'],
          description: 'Muestra 192'
        }
      ]
    },
    {
      id: 'm13_ex6',
      moduleId: 14,
      number: 6,
      title: 'Salida de bucle con break',
      description: 'Crea `n = 1`. Con un `while True:` (bucle potencialmente infinito), imprime `n`. Si `n == 3:`, ejecuta `break`. Al final de cada vuelta incrementa `n += 1`.',
      difficulty: 'intermediate',
      realWorldContext: 'Corte inmediato de bucle por evento externo.',
      starterCode: 'n = 1\n# Usa while True y corta con break cuando n sea 3:\n',
      solution: 'n = 1\nwhile True:\n    print(n)\n    if n == 3:\n        break\n    n += 1',
      hints: [
        'while True:\n    print(n)\n    if n == 3:\n        break\n    n += 1',
        'Imprimirá 1, 2, 3 y se detendrá'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Corte en 3 con break',
          expectedOutputs: ['1', '2', '3'],
          description: 'Muestra 1, 2, 3'
        }
      ]
    },
    {
      id: 'm13_ex7',
      moduleId: 14,
      number: 7,
      title: 'Simulación de descarga de batería',
      description: 'Un teléfono tiene `bateria = 100`. Con `while bateria > 70:`, imprime con f-string `f"Bateria: {bateria}%"` y descuenta 10 (`bateria -= 10`).',
      difficulty: 'intermediate',
      realWorldContext: 'Monitor de energía de dispositivo móvil.',
      starterCode: 'bateria = 100\n# Bucle de descarga hasta 70%:\n',
      solution: 'bateria = 100\nwhile bateria > 70:\n    print(f"Bateria: {bateria}%")\n    bateria -= 10',
      hints: [
        'while bateria > 70:',
        '    print(f"Bateria: {bateria}%")',
        '    bateria -= 10'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Descarga de batería',
          expectedOutputs: ['Bateria: 100%', 'Bateria: 90%', 'Bateria: 80%'],
          description: 'Muestra 100%, 90% y 80%'
        }
      ]
    },
    {
      id: 'm13_ex8',
      moduleId: 14,
      number: 8,
      title: 'División sucesiva entera',
      description: 'Comenzando con `valor = 80`, divide sucesivamente por 2 (`valor = valor // 2`) mientras `valor > 5`. Al terminar imprime `valor`.',
      difficulty: 'intermediate',
      realWorldContext: 'Algoritmo de búsqueda binaria o reducción.',
      starterCode: 'valor = 80\n# Divide por 2 mientras sea > 5:\n\nprint(valor)\n',
      solution: 'valor = 80\nwhile valor > 5:\n    valor = valor // 2\nprint(valor)',
      hints: [
        '80 -> 40 -> 20 -> 10 -> 5 (aquí ya no es > 5 y sale)',
        'print(valor) dará 5'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Resultado 5',
          expectedOutputs: ['5'],
          description: 'Muestra 5'
        }
      ]
    },
    {
      id: 'm13_ex9',
      moduleId: 14,
      number: 9,
      title: 'Validación de contraseña con reintentos simulada',
      description: 'Simula un sistema con `intentos = 0` y `clave_correcta = False`. Con `while intentos < 3 and not clave_correcta:`, suma 1 a intentos (`intentos += 1`). Si `intentos == 2`, cambia `clave_correcta = True`. Al final imprime `intentos`.',
      difficulty: 'intermediate',
      realWorldContext: 'Límite de intentos de inicio de sesión.',
      starterCode: 'intentos = 0\nclave_correcta = False\n# Bucle de reintentos:\n\nprint(intentos)\n',
      solution: 'intentos = 0\nclave_correcta = False\nwhile intentos < 3 and not clave_correcta:\n    intentos += 1\n    if intentos == 2:\n        clave_correcta = True\nprint(intentos)',
      hints: [
        'En el segundo intento clave_correcta pasa a True',
        'La condición del bucle se rompe y sale con intentos = 2',
        'print(intentos) mostrará 2'
      ],
      xp: 35,
      testCases: [
        {
          name: '2 intentos',
          expectedOutputs: ['2'],
          description: 'Muestra 2'
        }
      ]
    },
    {
      id: 'm13_ex10',
      moduleId: 14,
      number: 10,
      title: 'Desafío WHILE: Cálculo de Potencia sin operador **',
      description: 'Calcula 2 elevado a la 5ta potencia (2⁵ = 32) usando un bucle `while` sin usar `**`. Inicia con `base = 2`, `exponente = 5`, `resultado = 1` y `contador = 0`. Multiplica `resultado = resultado * base` e incrementa `contador += 1` mientras `contador < exponente`. Al final imprime `resultado`.',
      difficulty: 'challenge',
      realWorldContext: 'Implementación algorítmica de bajo nivel para operadores matemáticos.',
      starterCode: 'base = 2\nexponente = 5\nresultado = 1\ncontador = 0\n# Calcula la potencia con while:\n\nprint(resultado)\n',
      solution: 'base = 2\nexponente = 5\nresultado = 1\ncontador = 0\nwhile contador < exponente:\n    resultado = resultado * base\n    contador += 1\nprint(resultado)',
      hints: [
        'while contador < exponente:',
        '    resultado = resultado * base',
        '    contador += 1',
        'print(resultado) debe mostrar 32'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Potencia 32',
          expectedOutputs: ['32'],
          description: 'Muestra 32'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm13_chal1',
    title: '🚀 Desafío WHILE: Adivina el Número con Intentos Limitados',
    description: 'Simula un juego donde `secreto = 7`, `intento = 1`, `adivinado = False`. En cada vuelta del while (mientras `not adivinado`), incrementa `intento += 1` hasta que `intento == 7`, donde pones `adivinado = True`. Al terminar imprime con f-string: `f"Adivinado en el intento {intento}"`.',
    bonusXp: 100,
    badgeId: 'loop_tamer',
    starterCode: 'secreto = 7\nintento = 1\nadivinado = False\n# Bucle de adivinanza:\n\n',
    solution: 'secreto = 7\nintento = 1\nadivinado = False\nwhile not adivinado:\n    if intento == secreto:\n        adivinado = True\n    else:\n        intento += 1\nprint(f"Adivinado en el intento {intento}")',
    hints: [
      'while not adivinado:',
      '    if intento == secreto: adivinado = True',
      '    else: intento += 1',
      'print(f"Adivinado en el intento {intento}")'
    ],
    testCases: [
      {
        name: 'Adivinado en intento 7',
        expectedOutputs: ['Adivinado en el intento 7'],
        description: 'Muestra Adivinado en el intento 7'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Sintaxis y lógica del bucle while (repetición condicionada)',
      'Actualización obligatoria de variables de control y operador +=',
      'Causas y prevención del bucle infinito',
      'Uso de la instrucción break para interrupción inmediata'
    ],
    congratulationsMessage: '¡Magnífico! Ya dominas los dos bucles principales de Python: for y while. Ahora estás listo para integrar todo.'
  }
};
