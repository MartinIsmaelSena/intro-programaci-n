import { Exam } from '../../types/exam';

export const exam03: Exam = {
  id: 'exam-3',
  title: 'Modelo de Examen N.º 3',
  subtitle: 'Lógica Booleana, Formateo con f-strings y Entrada Interactiva con input()',
  description: 'Evaluación del tercer bloque (Módulos 7, 8 y 9). Comprueba la destreza para componer condiciones lógicas (and, or, not), formatear salidas profesionales con f-strings y capturar datos del usuario mediante teclado con conversiones numéricas.',
  modules: [7, 8, 9],
  moduleTitles: [
    'Módulo 7: Operadores lógicos',
    'Módulo 8: La función print()',
    'Módulo 9: La función input()'
  ],
  durationMinutes: 40,
  available: false, // 🔒 Próximamente
  totalPoints: 100,
  sections: {
    // PARTE A: TEORÍA (20 PUNTOS)
    partA_theory: [
      {
        id: 'e3_a1',
        question: '¿Por qué la instrucción `total = input("Precio: ") + 10` arroja un error de tipo (`TypeError`)?',
        options: [
          'Porque la función input() siempre devuelve una cadena de texto (str), y Python no permite sumar directamente un texto con un número entero.',
          'Porque el número 10 debe escribirse en letras ("diez").',
          'Porque input() solo funciona con preguntas que tengan menos de 3 palabras.',
          'Porque no se puede usar el signo + después de un input.'
        ],
        correctAnswer: 0,
        explanation: 'input() siempre entrega datos como `str`. Para sumar matemáticamente, se debe convertir explícitamente usando int() o float().',
        points: 10
      },
      {
        id: 'e3_a2',
        question: '¿Qué condición debe cumplirse para que el operador lógico `and` retorne `True`?',
        options: [
          'Basta con que una sola de las condiciones sea verdadera.',
          'Ambas (o todas) las condiciones evaluadas deben ser estrictamente verdaderas (True).',
          'Ambas condiciones deben ser números pares.',
          'La primera condición debe ser False y la segunda True.'
        ],
        correctAnswer: 1,
        explanation: '`and` es una conjunción estricta: únicamente evalúa a True cuando todos los operandos involucrados son verdaderos.',
        points: 10
      }
    ],

    // PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) (20 PUNTOS)
    partB_tracing: [
      {
        id: 'e3_b1',
        question: '¿Cuál será la salida exacta de este programa formateado con f-string?',
        codeSnippet: `producto = "Café"
precio = 1200
cantidad = 2
print(f"{cantidad}x {producto} = \${precio * cantidad}")`,
        options: [
          '2x Café = $2400',
          'cantidadx producto = $precio * cantidad',
          '2x Café = $1200 * 2',
          'Error: no se pueden hacer cálculos dentro de una f-string'
        ],
        correctAnswer: 0,
        explanation: 'Las f-strings evalúan variables y expresiones dentro de las llaves {}. Por tanto, {cantidad} es 2, {producto} es Café y {precio * cantidad} calcula 2400.',
        points: 10
      },
      {
        id: 'e3_b2',
        question: 'Dadas las variables de acceso, ¿qué imprimirá la instrucción lógica?',
        codeSnippet: `tiene_pase = True
es_socio = False
cuenta_activa = True
puede_ingresar = (tiene_pase or es_socio) and cuenta_activa
print(puede_ingresar)`,
        options: [
          'False',
          'True',
          'None',
          'Error por uso de paréntesis con or'
        ],
        correctAnswer: 1,
        explanation: '(tiene_pase or es_socio) evalúa a (True or False) = True. Luego True and cuenta_activa (True) resulta en True.',
        points: 10
      }
    ],

    // PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) (20 PUNTOS)
    partC_debugging: {
      id: 'e3_c1',
      title: 'Corrección de Conversión Numérica en Entrada',
      description: 'El siguiente código pide dos números enteros al usuario para calcular el total de puntos obtenidos, pero olvida convertir las entradas a entero (`int()`) y olvida la letra `f` antes de las comillas en el print. Corrige el código para que convierta las entradas a entero, sume `puntos_totales = p1 + p2`, e imprima con f-string: `f"Puntos totales: {puntos_totales}"`.',
      buggyCode: `# Corrige los errores en este programa:
p1 = input("Puntos nivel 1: ")
p2 = input("Puntos nivel 2: ")
puntos_totales = p1 + p2
print("Puntos totales: {puntos_totales}")`,
      solution: `p1 = int(input("Puntos nivel 1: "))
p2 = int(input("Puntos nivel 2: "))
puntos_totales = p1 + p2
print(f"Puntos totales: {puntos_totales}")`,
      testCases: [
        {
          name: 'Suma de puntos 50 y 30 = 80',
          inputs: ['50', '30'],
          expectedOutputs: ['Puntos totales: 80'],
          description: 'Muestra Puntos totales: 80'
        }
      ],
      points: 20
    },

    // PARTE D: PROGRAMACIÓN PRÁCTICA (20 PUNTOS)
    partD_coding: {
      id: 'e3_d1',
      title: 'Calculadora de Presupuesto con f-string',
      description: 'Pide al usuario dos datos interactivos por teclado:\n1. El valor del alquiler mensual usando `alquiler = float(input("Alquiler: "))`.\n2. El gasto en servicios usando `servicios = float(input("Servicios: "))`.\nCalcula el total sumando ambos valores (`gasto_total = alquiler + servicios`).\nFinalmente, muestra el resultado en pantalla con una f-string en el formato exacto: `f"Gasto mensual total: \${gasto_total}"`.',
      difficulty: 'medio',
      starterCode: `# Pide los datos con float(input()), calcula el gasto total e imprime con f-string:
`,
      solution: `alquiler = float(input("Alquiler: "))
servicios = float(input("Servicios: "))
gasto_total = alquiler + servicios
print(f"Gasto mensual total: \${gasto_total}")`,
      testCases: [
        {
          name: 'Alquiler 80000 y servicios 25000 = 105000.0',
          inputs: ['80000', '25000'],
          expectedOutputs: ['Gasto mensual total: $105000.0'],
          description: 'Muestra el gasto mensual formateado'
        }
      ],
      points: 20
    },

    // PARTE E: PROBLEMA INTEGRADOR (20 PUNTOS)
    partE_integrator: {
      id: 'e3_e1',
      title: 'Credencial Interactiva con Validación Lógica',
      description: 'Escribe un programa que solicite al usuario:\n1. Su nombre con `nombre = input("Nombre: ")`.\n2. Su edad con `edad = int(input("Edad: "))`.\nEvalúa en una variable booleana si cumple las condiciones para ser "socio pleno": tener 18 o más años Y que su edad sea menor a 60 (`es_socio_pleno = edad >= 18 and edad < 60`).\nFinalmente, imprime en dos líneas usando f-strings:\nLínea 1: `f"SOCIO: {nombre} ({edad} años)"`\nLínea 2: `f"¿Socio pleno? {es_socio_pleno}"`.\n(Nota: Recuerda NO usar condicionales if; evalúa la comparación lógica directamente en la variable booleana).',
      difficulty: 'integrador',
      starterCode: `# Pide nombre y edad, calcula la condición lógica booleana e imprime en 2 líneas:
`,
      solution: `nombre = input("Nombre: ")
edad = int(input("Edad: "))
es_socio_pleno = edad >= 18 and edad < 60
print(f"SOCIO: {nombre} ({edad} años)")
print(f"¿Socio pleno? {es_socio_pleno}")`,
      testCases: [
        {
          name: 'Socio Martín de 25 años es pleno True',
          inputs: ['Martín', '25'],
          expectedOutputs: ['SOCIO: Martín (25 años)', '¿Socio pleno? True'],
          description: 'Muestra credencial y True'
        },
        {
          name: 'Socio Tomás de 16 años es pleno False',
          inputs: ['Tomás', '16'],
          expectedOutputs: ['SOCIO: Tomás (16 años)', '¿Socio pleno? False'],
          description: 'Muestra credencial y False'
        }
      ],
      points: 20
    }
  }
};
