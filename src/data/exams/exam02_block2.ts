import { Exam } from '../../types/exam';

export const exam02: Exam = {
  id: 'exam-2',
  title: 'Modelo de Examen N.º 2',
  subtitle: 'Tipos de Datos, Operaciones Aritméticas y Comparaciones Lógicas',
  description: 'Evaluación del segundo bloque de aprendizaje (Módulos 4, 5 y 6). Evalúa el dominio sobre tipos de datos primordiales (str, int, float, bool), la función type(), los cálculos matemáticos con división entera y resto, y la generación de booleanos mediante comparaciones.',
  modules: [4, 5, 6],
  moduleTitles: [
    'Módulo 4: Tipos de datos',
    'Módulo 5: Operadores aritméticos',
    'Módulo 6: Operadores de comparación'
  ],
  durationMinutes: 40,
  available: false, // 🔒 Próximamente
  totalPoints: 100,
  sections: {
    // PARTE A: TEORÍA (20 PUNTOS)
    partA_theory: [
      {
        id: 'e2_a1',
        question: '¿Qué tipo de dato y qué valor exacto produce la expresión `8 / 2` en Python?',
        options: [
          'Produce el entero 4 (int).',
          'Produce el número decimal 4.0 (float), porque la barra / siempre devuelve un número flotante.',
          'Produce un booleano True.',
          'Genera un error porque debe usarse // obligatoriamente.'
        ],
        correctAnswer: 1,
        explanation: 'En Python la división estándar con una sola barra `/` siempre retorna un resultado de tipo `float` (número decimal), aun cuando la división sea matemáticamente exacta.',
        points: 10
      },
      {
        id: 'e2_a2',
        question: '¿Cuál es la diferencia de significado y comportamiento entre los operadores `=` y `==`?',
        options: [
          'No hay diferencia, son sinónimos intercambiables.',
          '`=` se utiliza para guardar un valor en una variable (asignación); `==` se utiliza para verificar si dos valores son iguales (comparación) produciendo True o False.',
          '`==` solo sirve para comparar textos entre comillas.',
          '`=` compara números y `==` compara textos.'
        ],
        correctAnswer: 1,
        explanation: '`=` asigna y almacena datos; `==` realiza una comparación lógica de igualdad y evalúa a un valor booleano (True o False).',
        points: 10
      }
    ],

    // PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) (20 PUNTOS)
    partB_tracing: [
      {
        id: 'e2_b1',
        question: 'Analiza el siguiente bloque de operaciones aritméticas. ¿Qué resultado imprimirá la consola?',
        codeSnippet: `a = 17
b = 5
cociente_entero = a // b
resto = a % b
print(cociente_entero, resto)`,
        options: [
          '3.4 2',
          '3 2',
          '2 3',
          '17 5'
        ],
        correctAnswer: 1,
        explanation: '17 // 5 calcula cuántas veces entra el 5 de manera entera en 17, dando 3. 17 % 5 calcula el resto sobrante (17 - 15 = 2). La salida es 3 2.',
        points: 10
      },
      {
        id: 'e2_b2',
        question: '¿Qué valores booleanos imprimirá exactamente este código?',
        codeSnippet: `x = 20
y = 20.0
print(x == y)
print(type(x) == type(y))`,
        options: [
          'True y luego False',
          'True y luego True',
          'False y luego False',
          'Error de ejecución por comparar tipos incompatibles'
        ],
        correctAnswer: 0,
        explanation: 'x == y es True porque 20 y 20.0 representan la misma cantidad numérica. Sin embargo, type(x) es int y type(y) es float, por lo que type(x) == type(y) evalúa a False.',
        points: 10
      }
    ],

    // PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) (20 PUNTOS)
    partC_debugging: {
      id: 'e2_c1',
      title: 'Corrección de Sintaxis Numérica y Comparación',
      description: 'El siguiente código intenta calcular si el saldo alcanza para pagar un producto, pero tiene dos errores graves: usa coma en lugar de punto decimal para el precio, y usa un solo `=` en la comparación en lugar de `>=`. Corrige el código para que defina `saldo = 5000.50`, `precio = 4200.25`, calcule si alcanza con `alcanza = saldo >= precio`, e imprima `alcanza`.',
      buggyCode: `# Corrige los errores en este programa:
saldo = 5000,50
precio = 4200,25
alcanza = saldo = precio
print(alcanza)`,
      solution: `saldo = 5000.50
precio = 4200.25
alcanza = saldo >= precio
print(alcanza)`,
      testCases: [
        {
          name: 'Comparación correcta de saldo',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ],
      points: 20
    },

    // PARTE D: PROGRAMACIÓN PRÁCTICA (20 PUNTOS)
    partD_coding: {
      id: 'e2_d1',
      title: 'Cálculo de Descuento y Verificación de Límite',
      description: 'Un artículo tiene un precio de 8500 pesos (`precio_base = 8500`). Se le aplica un descuento del 15% (`monto_descuento = precio_base * 0.15`).\n1. Calcula el `precio_final = precio_base - monto_descuento`.\n2. Comprueba si el precio final es menor a 7500 guardando la comparación en `es_oferta_accesible = precio_final < 7500`.\n3. Imprime `precio_final` y en la línea siguiente imprime `es_oferta_accesible`.',
      difficulty: 'medio',
      starterCode: `precio_base = 8500
# Realiza el cálculo del descuento, precio_final y la comparación:

`,
      solution: `precio_base = 8500
monto_descuento = precio_base * 0.15
precio_final = precio_base - monto_descuento
es_oferta_accesible = precio_final < 7500
print(precio_final)
print(es_oferta_accesible)`,
      testCases: [
        {
          name: 'Precio final y oferta accesible',
          expectedOutputs: ['7225.0', 'True'],
          description: 'Muestra 7225.0 y True'
        }
      ],
      points: 20
    },

    // PARTE E: PROBLEMA INTEGRADOR (20 PUNTOS)
    partE_integrator: {
      id: 'e2_e1',
      title: 'Distribución Equitativa y Evaluación de Sobrantes',
      description: 'Un grupo de trabajo tiene 47 licencias de software (`total_licencias = 47`) para repartir entre 4 departamentos de forma equitativa (`departamentos = 4`).\n1. Calcula cuántas licencias completas le corresponden a cada departamento usando división entera (`licencias_por_depto = total_licencias // departamentos`).\n2. Calcula cuántas licencias quedan sin asignar usando el operador módulo (`licencias_sobrantes = total_licencias % departamentos`).\n3. Comprueba si el reparto fue exacto (es decir, si las sobrantes son iguales a cero): `es_reparto_exacto = licencias_sobrantes == 0`.\n4. Imprime `licencias_por_depto`, `licencias_sobrantes` y `es_reparto_exacto` en tres líneas distintas.',
      difficulty: 'integrador',
      starterCode: `total_licencias = 47
departamentos = 4

# Calcula división entera, módulo y comparación:
`,
      solution: `total_licencias = 47
departamentos = 4
licencias_por_depto = total_licencias // departamentos
licencias_sobrantes = total_licencias % departamentos
es_reparto_exacto = licencias_sobrantes == 0
print(licencias_por_depto)
print(licencias_sobrantes)
print(es_reparto_exacto)`,
      testCases: [
        {
          name: '11 licencias por departamento, sobran 3, reparto no exacto False',
          expectedOutputs: ['11', '3', 'False'],
          description: 'Muestra 11, 3 y False'
        }
      ],
      points: 20
    }
  }
};
