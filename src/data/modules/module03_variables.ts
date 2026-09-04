import { CourseModule } from '../../types/course';

export const module03: CourseModule = {
  id: 3,
  number: 3,
  title: 'Variables',
  subtitle: 'Almacenar, recordar y manipular información en la memoria',
  description: 'Aprende a guardar datos usando variables, aplicar buenas prácticas de nomenclatura (snake_case) y actualizar sus valores a lo largo de un programa.',
  icon: '📦',
  estimatedTime: '35 min',
  category: 'datos',
  theory: [
    {
      id: 'm3_t1',
      title: '1. ¿Qué es una variable? La caja etiquetada',
      content: 'Imagina que tienes una caja de cartón en tu habitación. Para saber qué contiene sin tener que abrirla a cada segundo, le pegas una etiqueta por fuera que dice: `zapatillas`. Cuando necesitas las zapatillas, buscas la caja con esa etiqueta.\n\nEn programación, una **variable** es exactamente eso: un **espacio en la memoria de la computadora con un nombre (etiqueta) donde guardamos un dato** para poder utilizarlo más adelante las veces que queramos.',
      analogy: {
        title: 'Analogía de la caja con etiqueta',
        description: 'La memoria RAM de tu computadora es como un depósito con millones de estantes:',
        steps: [
          'Creamos una etiqueta: "nombre"',
          'Guardamos un contenido adentro: "Martín"',
          'Cuando decimos print(nombre), Python va al estante, abre la caja "nombre" y nos da su contenido: "Martín".'
        ]
      },
      codeExample: {
        code: 'nombre = "Martín"\nedad = 25\n\nprint(nombre)\nprint(edad)',
        explanation: 'El signo "=" se llama operador de asignación. Significa: "guarda lo que está a la derecha dentro de la variable de la izquierda".',
        output: 'Martín\n25'
      },
      keyTakeaways: [
        'Una variable guarda un valor en memoria.',
        'El signo = NO significa igualdad matemática aquí; significa ASIGNAR o guardar.',
        'Podemos usar el nombre de la variable tantas veces como queramos.'
      ]
    },
    {
      id: 'm3_t2',
      title: '2. Reglas y buenas prácticas para nombrar variables',
      content: 'Python tiene reglas estrictas sobre qué nombres son válidos y qué nombres causarán un error:\n\n* ✅ **Permitido:** letras (a-z, A-Z), números (0-9) y guiones bajos (`_`).\n* ❌ **Prohibido:** comenzar un nombre con un número (`2nombre` es error).\n* ❌ **Prohibido:** espacios en blanco (`mi variable` es error).\n* ❌ **Prohibido:** caracteres especiales como guión medio `-`, `@`, `!`, `$` ni tildes.\n* ⚠️ **Sensible a mayúsculas/minúsculas:** `edad`, `Edad` y `EDAD` son tres variables completamente distintas.\n\n### La convención estándar: `snake_case`\nEn la comunidad Python se utiliza la convención **snake_case** (palabras en minúsculas separadas por guión bajo):\n- `nombre_usuario = "Elena"`\n- `precio_con_descuento = 4500`\n- `puntos_totales = 120`',
      keyTakeaways: [
        'Los nombres deben ser descriptivos: preferí precio_total en lugar de p o x.',
        'Nunca comiences con un número ni dejes espacios.',
        'Usá siempre minúsculas con guión bajo (snake_case).'
      ]
    },
    {
      id: 'm3_t3',
      title: '3. Cambiar (reasignar) el valor de una variable',
      content: 'Las variables se llaman "variables" precisamente porque su valor puede **variar** durante la ejecución del programa. Si le asignas un nuevo valor a una variable existente, el valor viejo se descarta y se reemplaza por el nuevo.',
      codeExample: {
        code: 'vidas = 3\nprint("Vidas iniciales:", vidas)\n\n# El jugador recibe daño:\nvidas = 2\nprint("Vidas actuales:", vidas)',
        explanation: 'La variable vidas comenzó valiendo 3 y luego cambió a 2.',
        output: 'Vidas iniciales: 3\nVidas actuales: 2'
      }
    }
  ],
  quiz: [
    {
      id: 'm3_q1',
      question: '¿Qué hace el signo igual `=` en una línea como `puntos = 100`?',
      options: [
        'Pregunta si puntos es igual a 100',
        'Asigna o guarda el valor 100 dentro de la variable puntos',
        'Borra la variable puntos de la memoria',
        'Multiplica puntos por 100'
      ],
      correctAnswer: 1,
      explanation: 'En Python, un solo `=` es el operador de asignación: toma el valor de la derecha y lo almacena en la variable de la izquierda.',
      hint: 'Recordá que no es una comparación matemática, sino una acción de guardar.'
    },
    {
      id: 'm3_q2',
      question: '¿Cuál de los siguientes es un nombre de variable VÁLIDO en Python?',
      options: [
        '2do_lugar',
        'nombre de usuario',
        'nombre_usuario',
        'precio-total'
      ],
      correctAnswer: 2,
      explanation: '`nombre_usuario` cumple todas las reglas: no empieza con número, no tiene espacios ni caracteres prohibidos como guión medio.',
      hint: 'Revisá la convención snake_case.'
    },
    {
      id: 'm3_q3',
      question: 'Si ejecutamos:\nx = 5\nx = 10\nprint(x)\n¿Qué número se imprimirá?',
      options: [
        '5',
        '10',
        '15',
        'Error'
      ],
      correctAnswer: 1,
      explanation: 'Al reasignar `x = 10`, el antiguo valor 5 es reemplazado por 10.',
      hint: '¿Cuál fue el último valor que guardamos en x?'
    },
    {
      id: 'm3_q4',
      question: '¿`mi_variable` y `Mi_Variable` son la misma variable en Python?',
      options: [
        'Sí, a Python no le importan las mayúsculas',
        'No, Python distingue estrictamente mayúsculas de minúsculas (es case-sensitive)',
        'Solo si ambas valen cero',
        'Depende del sistema operativo'
      ],
      correctAnswer: 1,
      explanation: 'Python es sensible a mayúsculas y minúsculas (case-sensitive). Trata a ambas como dos variables totalmente distintas e independientes.',
      hint: 'Recordá la advertencia sobre sensibilidad a mayúsculas.'
    },
    {
      id: 'm3_q5',
      question: '¿Por qué es una mala práctica nombrar variables como `a`, `b`, `x1`, `cosa`?',
      options: [
        'Porque Python tarda más tiempo en ejecutarlas',
        'Porque hace que el código sea confuso, difícil de entender y de mantener',
        'Porque la computadora se sobrecalienta',
        'Porque está prohibido por el compilador'
      ],
      correctAnswer: 1,
      explanation: 'Los nombres claros y descriptivos como `precio_total` o `nombre_cliente` permiten que cualquier persona (¡incluido vos mismo en el futuro!) entienda qué hace el programa.',
      hint: 'Pensá en la legibilidad del código.'
    }
  ],
  exercises: [
    {
      id: 'm3_ex1',
      moduleId: 3,
      number: 1,
      title: 'Crear una variable nombre',
      description: 'Crea una variable llamada `nombre` y guárdale el texto "Martín". Luego, usa `print(nombre)` para mostrarla.',
      difficulty: 'starter',
      realWorldContext: 'Registro de perfil de usuario.',
      starterCode: '# Crea la variable nombre e imprímela:\n',
      solution: 'nombre = "Martín"\nprint(nombre)',
      hints: [
        'Para crear una variable escribe su nombre seguido del signo =',
        'Recuerda colocar el texto entre comillas: "Martín"',
        'Usa print(nombre) sin comillas dentro del print para mostrar el valor de la variable'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Imprime el nombre',
          expectedOutputs: ['Martín'],
          description: 'Muestra Martín en consola'
        }
      ]
    },
    {
      id: 'm3_ex2',
      moduleId: 3,
      number: 2,
      title: 'Crear una variable edad',
      description: 'Crea una variable llamada `edad` con el valor numérico 40 (sin comillas) y muéstrala con `print(edad)`.',
      difficulty: 'starter',
      realWorldContext: 'Datos de registro de usuario.',
      starterCode: '# Crea la variable edad e imprímela:\n',
      solution: 'edad = 40\nprint(edad)',
      hints: [
        'Los números enteros se escriben directamente sin comillas: edad = 40',
        'Luego escribe print(edad)',
        'Verifica que el nombre de la variable sea exactamente edad'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Imprime la edad',
          expectedOutputs: ['40'],
          description: 'Muestra 40 en la terminal'
        }
      ]
    },
    {
      id: 'm3_ex3',
      moduleId: 3,
      number: 3,
      title: 'Dos variables en acción',
      description: 'Crea una variable `ciudad` con el valor "Córdoba" y otra variable `pais` con "Argentina". Muestra primero la ciudad y en la siguiente línea el país usando dos print.',
      difficulty: 'starter',
      realWorldContext: 'Geolocalización básica de una cuenta.',
      starterCode: '# Define ciudad y pais, luego imprímelas:\n',
      solution: 'ciudad = "Córdoba"\npais = "Argentina"\nprint(ciudad)\nprint(pais)',
      hints: [
        'Crea ciudad = "Córdoba"',
        'Crea pais = "Argentina"',
        'Haz print(ciudad) y luego print(pais)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Mostrar ciudad y país',
          expectedOutputs: ['Córdoba', 'Argentina'],
          description: 'Salida de ambas variables'
        }
      ]
    },
    {
      id: 'm3_ex4',
      moduleId: 3,
      number: 4,
      title: 'Cambiar el valor de una variable',
      description: 'Crea una variable `puntaje` que comience con valor 10. Luego, en la siguiente línea, cámbiale el valor a 50. Finalmente, imprime `puntaje` para comprobar su nuevo valor.',
      difficulty: 'basic',
      realWorldContext: 'Actualización de puntos en un videojuego.',
      starterCode: '# Crea puntaje, actualízalo e imprímelo:\n',
      solution: 'puntaje = 10\npuntaje = 50\nprint(puntaje)',
      hints: [
        'Primero escribe puntaje = 10',
        'Luego reasigna con puntaje = 50',
        'Finalmente print(puntaje). Debería mostrar únicamente 50.'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Puntaje actualizado a 50',
          expectedOutputs: ['50'],
          description: 'Muestra el valor final 50'
        }
      ]
    },
    {
      id: 'm3_ex5',
      moduleId: 3,
      number: 5,
      title: 'Ficha de un alumno',
      description: 'Crea tres variables: `alumno` con "Sofía", `curso` con "Python" y `nota` con 10. Imprime `alumno`, `curso` y `nota` en tres líneas distintas.',
      difficulty: 'basic',
      realWorldContext: 'Sistema de gestión de calificaciones escolares.',
      starterCode: '# Variables del alumno:\n',
      solution: 'alumno = "Sofía"\ncurso = "Python"\nnota = 10\nprint(alumno)\nprint(curso)\nprint(nota)',
      hints: [
        'Usa comillas para alumno y curso (son textos)',
        'Para nota pon 10 sin comillas',
        'Imprime cada una con su propio print'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Datos del alumno',
          expectedOutputs: ['Sofía', 'Python', '10'],
          description: 'Muestra Sofía, Python y 10'
        }
      ]
    },
    {
      id: 'm3_ex6',
      moduleId: 3,
      number: 6,
      title: 'Precio de un producto',
      description: 'Crea una variable `producto` con el valor "Auriculares" y `precio` con 3500. Imprime `producto` y luego `precio`.',
      difficulty: 'basic',
      realWorldContext: 'Catálogo de comercio electrónico.',
      starterCode: '# Producto y precio:\n',
      solution: 'producto = "Auriculares"\nprecio = 3500\nprint(producto)\nprint(precio)',
      hints: [
        'producto = "Auriculares"',
        'precio = 3500',
        'print(producto) seguido de print(precio)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Producto y precio',
          expectedOutputs: ['Auriculares', '3500'],
          description: 'Muestra Auriculares y 3500'
        }
      ]
    },
    {
      id: 'm3_ex7',
      moduleId: 3,
      number: 7,
      title: 'Traspaso de valores entre variables',
      description: 'Crea una variable `a` con el valor 100. Luego crea una variable `b` e iguálala a `a` (`b = a`). Imprime el valor de `b`.',
      difficulty: 'intermediate',
      realWorldContext: 'Copia de seguridad de un valor en memoria.',
      starterCode: '# Traspaso de variable a a b:\n',
      solution: 'a = 100\nb = a\nprint(b)',
      hints: [
        'Define a = 100',
        'Define b = a (esto copia el valor de a en la caja b)',
        'Haz print(b)'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Valor de b igual a 100',
          expectedOutputs: ['100'],
          description: 'Muestra 100'
        }
      ]
    },
    {
      id: 'm3_ex8',
      moduleId: 3,
      number: 8,
      title: 'Contador de pasos diarios',
      description: 'Crea una variable `pasos` con 2000. Luego suma 500 pasos más a esa misma variable asignándole `pasos = pasos + 500`. Imprime `pasos`.',
      difficulty: 'intermediate',
      realWorldContext: 'Aplicación de salud y actividad física en un reloj inteligente.',
      starterCode: '# Contador de pasos:\n',
      solution: 'pasos = 2000\npasos = pasos + 500\nprint(pasos)',
      hints: [
        'Inicia con pasos = 2000',
        'Luego escribe pasos = pasos + 500 (toma el valor actual, le suma 500 y lo guarda)',
        'Muestra print(pasos). El resultado debe ser 2500.'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Pasos actualizados a 2500',
          expectedOutputs: ['2500'],
          description: 'Muestra 2500'
        }
      ]
    },
    {
      id: 'm3_ex9',
      moduleId: 3,
      number: 9,
      title: 'Intercambio de dos variables (Swap)',
      description: 'Tenemos dos variables: vaso1 = "Agua" y vaso2 = "Jugo". Para intercambiar sus contenidos usamos una variable auxiliar: `temporal = vaso1`, luego `vaso1 = vaso2`, y finalmente `vaso2 = temporal`. Escribe este proceso e imprime vaso1 y vaso2.',
      difficulty: 'intermediate',
      realWorldContext: 'Algoritmo clásico de intercambio de elementos en ordenamiento.',
      starterCode: 'vaso1 = "Agua"\nvaso2 = "Jugo"\n# Intercambia sus contenidos usando una variable temporal:\n\nprint(vaso1)\nprint(vaso2)\n',
      solution: 'vaso1 = "Agua"\nvaso2 = "Jugo"\ntemporal = vaso1\nvaso1 = vaso2\nvaso2 = temporal\nprint(vaso1)\nprint(vaso2)',
      hints: [
        'Guarda el contenido de vaso1 en temporal: temporal = vaso1',
        'Pasa el contenido de vaso2 a vaso1: vaso1 = vaso2',
        'Pasa temporal a vaso2: vaso2 = temporal'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Vasos intercambiados',
          expectedOutputs: ['Jugo', 'Agua'],
          description: 'vaso1 ahora es Jugo y vaso2 es Agua'
        }
      ]
    },
    {
      id: 'm3_ex10',
      moduleId: 3,
      number: 10,
      title: 'Mini desafío de variables: Estado de videojuego',
      description: 'Modela el estado de un personaje en un juego: crea `personaje = "Guerrero"`, `nivel = 1`, `vida = 100`. Simula que sube de nivel (`nivel = 2`) y que recibe un golpe (`vida = 80`). Imprime `personaje`, `nivel` y `vida` actualizados.',
      difficulty: 'challenge',
      realWorldContext: 'Motor de juego para seguimiento de estado de personajes.',
      starterCode: '# Estado inicial y actualización del personaje:\n',
      solution: 'personaje = "Guerrero"\nnivel = 1\nvida = 100\nnivel = 2\nvida = 80\nprint(personaje)\nprint(nivel)\nprint(vida)',
      hints: [
        'Crea las 3 variables con sus valores de partida.',
        'Reasigna nivel = 2 y vida = 80.',
        'Imprime las 3 variables con print() en líneas separadas.'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Personaje nivel 2 y 80 de vida',
          expectedOutputs: ['Guerrero', '2', '80'],
          description: 'Salida con valores actualizados'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm3_chal1',
    title: '🚀 Desafío Opcional: Banco y Saldo',
    description: 'Simula una cuenta bancaria: inicia con `saldo = 10000`. Luego descuenta un pago de servicios de 2500 (`saldo = saldo - 2500`). Después suma un depósito de 4000 (`saldo = saldo + 4000`). Imprime el saldo final resultante.',
    bonusXp: 100,
    badgeId: 'variable_collector',
    starterCode: '# Simulación de cuenta bancaria:\nsaldo = 10000\n# Realiza las operaciones e imprime saldo:\n',
    solution: 'saldo = 10000\nsaldo = saldo - 2500\nsaldo = saldo + 4000\nprint(saldo)',
    hints: [
      'Empieza con saldo = 10000',
      'Descuenta 2500: saldo = saldo - 2500',
      'Suma 4000: saldo = saldo + 4000',
      'Al final print(saldo) debe dar exactamente 11500'
    ],
    testCases: [
      {
        name: 'Saldo final 11500',
        expectedOutputs: ['11500'],
        description: 'Saldo resultante tras compras y depósitos'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Concepto de variable como espacio etiquetado en memoria',
      'El operador de asignación (=)',
      'Reglas válidas y convención snake_case para nombres limpios',
      'Reasignación y actualización dinámica de valores'
    ],
    congratulationsMessage: '¡Gran trabajo! Las variables son el corazón de cualquier programa; ahora puedes guardar cualquier información que necesites.'
  }
};
