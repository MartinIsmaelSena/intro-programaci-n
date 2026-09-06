import { CourseModule } from '../../types/course';

export const module05: CourseModule = {
  id: 5,
  number: 5,
  title: 'Tipos de datos',
  subtitle: 'Textos, enteros, decimales y valores booleanos (str, int, float, bool)',
  description: 'Conoce los 4 tipos de datos primordiales de Python, cómo saber qué tipo tiene una variable con la función type() y cómo interactúan entre sí.',
  icon: '🔢',
  estimatedTime: '35 min',
  category: 'datos',
  theory: [
    {
      id: 'm4_t1',
      title: '1. Los 4 tipos de datos fundamentales',
      content: 'En la vida real no tratamos a una palabra igual que a un número de dinero o a una decisión de sí/no. En Python ocurre exactamente lo mismo. Cada dato pertenece a un **tipo** específico:\n\n1. 📝 **`str` (String / Cadena de texto):** Texto encerrado entre comillas dobles o simples. Ej: `"Hola"`, `"Python"`, `"123"` (¡si tiene comillas, es texto!).\n2. 🔢 **`int` (Integer / Entero):** Números sin decimales, tanto positivos como negativos o cero. Ej: `40`, `-15`, `0`, `2026`.\n3. 🌊 **`float` (Flotante / Decimal):** Números con coma o punto decimal. En Python usamos siempre el punto `.`. Ej: `1.75`, `3.1416`, `-0.5`.\n4. 💡 **`bool` (Booleano / Lógico):** Solo puede tener uno de dos valores posibles: `True` (Verdadero) o `False` (Falso). ¡Atención! Van con la primera letra en mayúscula y sin comillas.',
      codeExample: {
        code: 'nombre = "Martín"    # str (cadena de texto)\nedad = 40            # int (entero)\naltura = 1.75        # float (decimal)\nestudia = True       # bool (booleano)\n\nprint(nombre)\nprint(edad)\nprint(altura)\nprint(estudia)',
        explanation: 'Python detecta automáticamente el tipo de dato de cada variable al momento de asignarle un valor (tipado dinámico).',
        output: 'Martín\n40\n1.75\nTrue'
      },
      keyTakeaways: [
        'str siempre va entre comillas.',
        'float utiliza punto (.) en vez de coma.',
        'bool solo tiene dos valores: True o False (con T y F mayúsculas).'
      ]
    },
    {
      id: 'm4_t2',
      title: '2. La función inspectora `type()`',
      content: 'Si alguna vez dudas sobre qué tipo de dato contiene una variable, Python te ofrece una función mágica llamada `type()`. Al envolver una variable con `type(...)` e imprimirla, Python te revela su clase.',
      codeExample: {
        code: 'precio = 99.5\nprint(type(precio))\n\nciudad = "Rosario"\nprint(type(ciudad))',
        explanation: 'type() nos devuelve <class \'float\'> y <class \'str\'> respectivamente.',
        output: "<class 'float'>\n<class 'str'>"
      },
      keyTakeaways: [
        'type(variable) permite inspeccionar el tipo de cualquier valor.',
        'Esencial para depurar y entender por qué una operación puede fallar.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm4_q1',
      question: '¿Qué tipo de dato es el valor `"42"` (con comillas)?',
      options: [
        'int (entero)',
        'str (texto o cadena)',
        'float (decimal)',
        'bool (booleano)'
      ],
      correctAnswer: 1,
      explanation: '¡Cuidado con la trampa! Al estar encerrado entre comillas `"42"`, Python lo interpreta como una cadena de caracteres (str) y no como un número.',
      hint: 'Fijate si tiene comillas.'
    },
    {
      id: 'm4_q2',
      question: '¿Cómo se escriben correctamente los dos valores booleanos en Python?',
      options: [
        'true y false (todo en minúsculas)',
        'True y False (con la primera letra en mayúscula y sin comillas)',
        '"True" y "False" (con comillas)',
        'VERDADERO y FALSO'
      ],
      correctAnswer: 1,
      explanation: 'En Python las palabras reservadas booleanas son `True` y `False` con la letra inicial mayúscula y sin comillas.',
      hint: 'Buscá la opción que inicia con mayúscula y no tiene comillas.'
    },
    {
      id: 'm4_q3',
      question: '¿Qué símbolo se utiliza en Python para los números decimales (float)?',
      options: [
        'El punto (.) como en 3.14',
        'La coma (,) como en 3,14',
        'El guión (-) como en 3-14',
        'La barra (/) como en 3/14'
      ],
      correctAnswer: 0,
      explanation: 'Python sigue la notación anglosajona: siempre se utiliza el punto `.` para separar la parte entera de los decimales.',
      hint: 'Por ejemplo: 1.75 en lugar de 1,75.'
    },
    {
      id: 'm4_q4',
      question: '¿Qué devolverá la instrucción `type(10)`?',
      options: [
        "<class 'int'>",
        "<class 'str'>",
        "<class 'float'>",
        "<class 'number'>"
      ],
      correctAnswer: 0,
      explanation: '10 es un número entero sin decimales, por lo tanto su clase es `int`.',
      hint: '¿10 tiene decimales o comillas?'
    },
    {
      id: 'm4_q5',
      question: 'Si ejecutamos `print(type(5.0))`, ¿cuál es el tipo de dato?',
      options: [
        'int porque 5 es entero',
        'float porque tiene punto decimal (.0)',
        'str porque tiene un punto',
        'bool'
      ],
      correctAnswer: 1,
      explanation: 'Aunque la parte decimal sea cero, la presencia del punto decimal `.0` hace que Python lo catalogue como `float`.',
      hint: 'Cualquier número con punto decimal es float.'
    }
  ],
  exercises: [
    {
      id: 'm4_ex1',
      moduleId: 5,
      number: 1,
      title: 'Crear un texto (str)',
      description: 'Crea una variable llamada `saludo` con el texto "Bienvenido al curso" e imprímela.',
      difficulty: 'starter',
      realWorldContext: 'Mensaje de cabecera en una app.',
      starterCode: '# Crea la variable saludo con texto:\n',
      solution: 'saludo = "Bienvenido al curso"\nprint(saludo)',
      hints: [
        'Usa comillas para encerrar el texto',
        'saludo = "Bienvenido al curso"',
        'Imprime con print(saludo)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Imprime el saludo',
          expectedOutputs: ['Bienvenido al curso'],
          description: 'Muestra Bienvenido al curso'
        }
      ]
    },
    {
      id: 'm4_ex2',
      moduleId: 5,
      number: 2,
      title: 'Crear un número entero (int)',
      description: 'Crea una variable llamada `anio_actual` con el año 2026 (sin comillas). Imprime la variable.',
      difficulty: 'starter',
      realWorldContext: 'Fecha de cálculo en un sistema de calendario.',
      starterCode: '# Año actual entero:\n',
      solution: 'anio_actual = 2026\nprint(anio_actual)',
      hints: [
        'Escribe 2026 directamente sin comillas',
        'anio_actual = 2026',
        'print(anio_actual)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Año 2026',
          expectedOutputs: ['2026'],
          description: 'Muestra 2026'
        }
      ]
    },
    {
      id: 'm4_ex3',
      moduleId: 5,
      number: 3,
      title: 'Crear un decimal (float)',
      description: 'Crea una variable llamada `precio_dolar` con el valor 1250.50 (usando punto decimal). Imprime la variable.',
      difficulty: 'starter',
      realWorldContext: 'Cotización de moneda en una casa de cambio.',
      starterCode: '# Precio con punto decimal:\n',
      solution: 'precio_dolar = 1250.50\nprint(precio_dolar)',
      hints: [
        'Usa el punto decimal: 1250.5 o 1250.50',
        'precio_dolar = 1250.50',
        'print(precio_dolar)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Precio decimal',
          expectedOutputs: ['1250.5'],
          description: 'Muestra el número decimal'
        }
      ]
    },
    {
      id: 'm4_ex4',
      moduleId: 5,
      number: 4,
      title: 'Crear un valor booleano (bool)',
      description: 'Crea una variable llamada `activo` con el valor `True` (con T mayúscula y sin comillas). Imprime `activo`.',
      difficulty: 'starter',
      realWorldContext: 'Estado de una cuenta de usuario (activa o suspendida).',
      starterCode: '# Variable booleana:\n',
      solution: 'activo = True\nprint(activo)',
      hints: [
        'True debe ir con T mayúscula y sin comillas.',
        'activo = True',
        'print(activo)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Booleano True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm4_ex5',
      moduleId: 5,
      number: 5,
      title: 'Inspeccionar con type()',
      description: 'Crea una variable `temperatura = 24.5`. Luego imprime el resultado de `type(temperatura)` para ver su clase float.',
      difficulty: 'basic',
      realWorldContext: 'Lectura de sensores meteorológicos.',
      starterCode: 'temperatura = 24.5\n# Muestra su tipo con type():\n',
      solution: 'temperatura = 24.5\nprint(type(temperatura))',
      hints: [
        'Envuelve la variable dentro de type: type(temperatura)',
        'Y pon todo dentro de print: print(type(temperatura))'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Tipo float',
          expectedOutputs: ['float'],
          description: 'Debe contener la palabra float en la salida de type'
        }
      ]
    },
    {
      id: 'm4_ex6',
      moduleId: 5,
      number: 6,
      title: 'Perfil completo con 4 tipos distintos',
      description: 'Modela un producto: `nombre = "Mochila"` (str), `stock = 15` (int), `peso_kg = 0.85` (float) y `en_oferta = False` (bool). Imprime las 4 variables en líneas sucesivas.',
      difficulty: 'basic',
      realWorldContext: 'Ficha técnica en inventario de depósito.',
      starterCode: '# Modela los 4 tipos de datos:\n',
      solution: 'nombre = "Mochila"\nstock = 15\npeso_kg = 0.85\nen_oferta = False\nprint(nombre)\nprint(stock)\nprint(peso_kg)\nprint(en_oferta)',
      hints: [
        'Asegúrate de definir las 4 variables exactamente con esos nombres.',
        'Recuerda: False va con F mayúscula y sin comillas.',
        'Imprime cada una con su print()'
      ],
      xp: 25,
      testCases: [
        {
          name: '4 datos impresos',
          expectedOutputs: ['Mochila', '15', '0.85', 'False'],
          description: 'Muestra todos los campos del producto'
        }
      ]
    },
    {
      id: 'm4_ex7',
      moduleId: 5,
      number: 7,
      title: 'Comillas que engañan',
      description: 'Crea una variable `numero_falso = "100"` (entre comillas) y muestra su tipo usando `print(type(numero_falso))`. Verás que Python lo reconoce como `str`.',
      difficulty: 'intermediate',
      realWorldContext: 'Datos numéricos recibidos como texto desde un formulario web.',
      starterCode: '# Demuestra que "100" es un str:\n',
      solution: 'numero_falso = "100"\nprint(type(numero_falso))',
      hints: [
        'numero_falso = "100"',
        'print(type(numero_falso))'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Es clase str',
          expectedOutputs: ['str'],
          description: 'Salida de type contiene str'
        }
      ]
    },
    {
      id: 'm4_ex8',
      moduleId: 5,
      number: 8,
      title: 'Cálculo de altura promedio',
      description: 'Dos amigos miden: `h1 = 1.70` y `h2 = 1.80`. Crea ambas variables, calcula el promedio sumándolas y dividiendo entre 2 (`promedio = (h1 + h2) / 2`), e imprime `promedio`.',
      difficulty: 'intermediate',
      realWorldContext: 'Estadísticas biométricas de un equipo deportivo.',
      starterCode: '# Altura promedio:\nh1 = 1.70\nh2 = 1.80\n',
      solution: 'h1 = 1.70\nh2 = 1.80\npromedio = (h1 + h2) / 2\nprint(promedio)',
      hints: [
        'Usa paréntesis para sumar antes de dividir: (h1 + h2) / 2',
        'Guarda el resultado en promedio',
        'print(promedio) mostrará 1.75'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Promedio 1.75',
          expectedOutputs: ['1.75'],
          description: 'Muestra 1.75'
        }
      ]
    },
    {
      id: 'm4_ex9',
      moduleId: 5,
      number: 9,
      title: 'Booleano resultante de una comparación',
      description: 'Crea una variable `mayor_de_edad = 20 >= 18`. Python evaluará la expresión matemática y guardará un bool. Imprime `mayor_de_edad` e imprime `type(mayor_de_edad)`.',
      difficulty: 'intermediate',
      realWorldContext: 'Validación de mayoría de edad en un registro.',
      starterCode: '# Guarda el resultado de la comparación:\n',
      solution: 'mayor_de_edad = 20 >= 18\nprint(mayor_de_edad)\nprint(type(mayor_de_edad))',
      hints: [
        'mayor_de_edad = 20 >= 18',
        'print(mayor_de_edad)',
        'print(type(mayor_de_edad))'
      ],
      xp: 35,
      testCases: [
        {
          name: 'True y bool',
          expectedOutputs: ['True', 'bool'],
          description: 'Muestra True y la clase bool'
        }
      ]
    },
    {
      id: 'm4_ex10',
      moduleId: 5,
      number: 10,
      title: 'Desafío de tipos: Conversor básico',
      description: 'Tenemos un valor guardado como texto: `dato = "50"`. Crea una variable `numero = int(dato)` para convertirlo a entero y súmale 10 en otra variable `total = numero + 10`. Imprime `total`.',
      difficulty: 'challenge',
      realWorldContext: 'Procesamiento de entradas de usuario que llegan como cadenas.',
      starterCode: 'dato = "50"\n# Convierte dato a entero, suma 10 e imprime el total:\n',
      solution: 'dato = "50"\nnumero = int(dato)\ntotal = numero + 10\nprint(total)',
      hints: [
        'int(dato) convierte el texto "50" en el número entero 50',
        'total = numero + 10 valdrá 60',
        'print(total) imprimirá 60'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Total 60',
          expectedOutputs: ['60'],
          description: 'Muestra 60'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm4_chal1',
    title: '🚀 Desafío de Tipos: Ficha Médica Automatizada',
    description: 'Genera la ficha médica de un paciente: crea `paciente = "Lucas"`, `edad = 28`, `peso = 72.4`, `apto_fisico = True`. Muestra en una línea el nombre y en las siguientes su edad, peso y si está apto físico.',
    bonusXp: 100,
    badgeId: 'type_master',
    starterCode: '# Crea la ficha médica e imprime cada campo:\n',
    solution: 'paciente = "Lucas"\nedad = 28\npeso = 72.4\napto_fisico = True\nprint(paciente)\nprint(edad)\nprint(peso)\nprint(apto_fisico)',
    hints: [
      'Define paciente con Lucas entre comillas',
      'edad = 28, peso = 72.4, apto_fisico = True',
      'Imprime cada variable en una línea'
    ],
    testCases: [
      {
        name: 'Ficha médica completa',
        expectedOutputs: ['Lucas', '28', '72.4', 'True'],
        description: 'Imprime todos los campos de la ficha médica'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Los 4 tipos fundamentales: str (texto), int (entero), float (decimal), bool (lógico)',
      'Por qué "100" (str) no es lo mismo que 100 (int)',
      'Uso de type() para descubrir el tipo de dato de una variable',
      'La importancia de la precisión en los tipos de datos'
    ],
    congratulationsMessage: '¡Fantástico! Ahora sabés distinguir y manipular textos, números y booleanos como un programador profesional.'
  }
};
