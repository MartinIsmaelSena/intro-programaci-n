import { Exam } from '../../types/exam';

export const exam05: Exam = {
  id: 'exam-5',
  title: 'Modelo de Examen N.º 5',
  subtitle: 'Bucles Condicionados con while e Integración de Problemas Complejos',
  description: 'Evaluación del quinto y último bloque modular (Módulos 13 y 14). Evalúa el dominio del bucle while, el control de iteraciones indefinidas, la prevención de bucles infinitos y la capacidad de integrar todas las herramientas del curso en aplicaciones funcionales completas.',
  modules: [13, 14],
  moduleTitles: [
    'Módulo 13: Bucle while',
    'Módulo 14: Integración y resolución de problemas'
  ],
  durationMinutes: 40,
  available: false, // 🔒 Próximamente
  totalPoints: 100,
  sections: {
    // PARTE A: TEORÍA (20 PUNTOS)
    partA_theory: [
      {
        id: 'e5_a1',
        question: '¿Bajo qué circunstancias específicas es indispensable usar un bucle `while` en lugar de un bucle `for`?',
        options: [
          'Cuando no conocemos con anticipación la cantidad exacta de veces que se repetirá el proceso, ya que depende de una condición dinámica (como las acciones del usuario o el azar).',
          'Cuando solo queremos repetir una instrucción exactamente 3 veces.',
          'Cuando el programa no utiliza variables numéricas.',
          'Únicamente cuando se programan juegos 3D.'
        ],
        correctAnswer: 0,
        explanation: '`while` es el bucle por excelencia para repeticiones condicionadas donde el número de iteraciones es incierto al iniciar la ejecución.',
        points: 10
      },
      {
        id: 'e5_a2',
        question: '¿Qué acción es obligatoria dentro del cuerpo de un bucle `while` para evitar caer en un bucle infinito?',
        options: [
          'Escribir al menos 10 líneas de código.',
          'Modificar o actualizar de alguna manera las variables que intervienen en la condición para que en algún momento evalúe a False (o usar break).',
          'Reiniciar la computadora antes de ejecutarlo.',
          'No usar nunca operadores de comparación.'
        ],
        correctAnswer: 1,
        explanation: 'Si la condición del bucle nunca cambia a False y no hay un break, el programa continuará ejecutándose infinitamente consumiendo recursos.',
        points: 10
      }
    ],

    // PARTE B: INTERPRETACIÓN DE CÓDIGO (TRACING) (20 PUNTOS)
    partB_tracing: [
      {
        id: 'e5_b1',
        question: 'Analiza la ejecución de este bucle while con interrupción break. ¿Qué valores imprimirá la consola?',
        codeSnippet: `contador = 1
while contador <= 10:
    if contador == 4:
        break
    print(contador)
    contador += 1`,
        options: [
          '1, 2, 3, 4 (en líneas sucesivas)',
          '1, 2, 3 (en líneas sucesivas)',
          '4',
          'Bucle infinito'
        ],
        correctAnswer: 1,
        explanation: 'Cuando contador es 1, 2 y 3, el if es falso, imprime el número y suma 1. Cuando contador llega a 4, entra al if y ejecuta break de inmediato sin llegar al print, terminando el bucle.',
        points: 10
      },
      {
        id: 'e5_b2',
        question: '¿Cuál será el valor final impreso de la variable `total` al concluir este programa?',
        codeSnippet: `total = 1
pasos = 0
while total < 20:
    total = total * 2
    pasos += 1
print(total, pasos)`,
        options: [
          '20 4',
          '32 5',
          '16 4',
          '64 6'
        ],
        correctAnswer: 1,
        explanation: 'Secuencia de total y pasos: 1(inicio) -> 2(paso 1) -> 4(paso 2) -> 8(paso 3) -> 16(paso 4, aún < 20) -> 32(paso 5). Al llegar a 32, 32 < 20 es False y sale. Imprime 32 5.',
        points: 10
      }
    ],

    // PARTE C: CORRECCIÓN DE ERRORES (DEBUGGING) (20 PUNTOS)
    partC_debugging: {
      id: 'e5_c1',
      title: 'Reparación de Bucle Infinito en Cuenta Regresiva',
      description: 'El siguiente programa intenta hacer una cuenta regresiva desde 5 hasta 1, pero tiene un bug crítico: en lugar de restar al contador dentro del bucle, le suma, o olvida modificarlo, provocando que el bucle nunca termine. Corrige el código para que imprima 5, 4, 3, 2, 1 y termine imprimiendo "¡Despegue!".',
      buggyCode: `# Corrige el bucle infinito:
segundos = 5
while segundos > 0:
    print(segundos)
    segundos = segundos + 1  # ❌ ¡Error de dirección!
print("¡Despegue!")`,
      solution: `segundos = 5
while segundos > 0:
    print(segundos)
    segundos = segundos - 1
print("¡Despegue!")`,
      testCases: [
        {
          name: 'Cuenta regresiva completa 5 a 1 y despegue',
          expectedOutputs: ['5', '4', '3', '2', '1', '¡Despegue!'],
          description: 'Muestra la cuenta y el mensaje final'
        }
      ],
      points: 20
    },

    // PARTE D: PROGRAMACIÓN PRÁCTICA (20 PUNTOS)
    partD_coding: {
      id: 'e5_d1',
      title: 'Cajero Automático con Retiros Sucesivos (while)',
      description: 'Un cliente tiene un saldo inicial en su cuenta bancaria de 6000 pesos (`saldo = 6000`).\nCon un bucle `while saldo >= 2000:`, descuenta 2000 de saldo (`saldo -= 2000`) e imprime con f-string en cada vuelta: `f"Retiro de \$2000 | Saldo restante: \${saldo}"`.\nAl terminar el bucle, imprime con f-string: `f"Operaciones finalizadas. Saldo final: \${saldo}"`.',
      difficulty: 'medio',
      starterCode: `saldo = 6000
# Implementa el bucle while de retiros sucesivos:
`,
      solution: `saldo = 6000
while saldo >= 2000:
    saldo -= 2000
    print(f"Retiro de \$2000 | Saldo restante: \${saldo}")
print(f"Operaciones finalizadas. Saldo final: \${saldo}")`,
      testCases: [
        {
          name: 'Retiros hasta agotar el saldo a 0',
          expectedOutputs: [
            'Retiro de $2000 | Saldo restante: $4000',
            'Retiro de $2000 | Saldo restante: $2000',
            'Retiro de $2000 | Saldo restante: $0',
            'Operaciones finalizadas. Saldo final: $0'
          ],
          description: 'Ejecuta 3 retiros y muestra saldo final 0'
        }
      ],
      points: 20
    },

    // PARTE E: PROBLEMA INTEGRADOR (20 PUNTOS)
    partE_integrator: {
      id: 'e5_e1',
      title: 'Gran Desafío Integrador: Simulador de Caja de Supermercado con Bucle',
      description: 'Construye un sistema completo de punto de venta:\n1. Pide al usuario el nombre del cliente con `cliente = input("Nombre del cliente: ")`.\n2. Inicia el acumulador de la compra en cero: `total_compra = 0.0`.\n3. Pide cuántos productos compró con `cantidad_articulos = int(input("Cantidad de articulos: "))`.\n4. Con un bucle `for i in range(cantidad_articulos):`, pide el precio de cada artículo con `precio = float(input("Precio: "))` y acumúlalo en `total_compra`.\n5. Si el total supera los 5000 pesos (`total_compra > 5000`), aplica un 10% de descuento (`descuento = total_compra * 0.10`), de lo contrario el descuento es 0.\n6. Calcula `total_final = total_compra - descuento`.\n7. Muestra el resumen final en dos líneas con f-strings:\nLínea 1: `f"Cliente: {cliente} | Subtotal: \${total_compra}"`\nLínea 2: `f"Total a pagar: \${total_final}"`.',
      difficulty: 'integrador',
      starterCode: `# Sistema integrador de caja registradora:
`,
      solution: `cliente = input("Nombre del cliente: ")
total_compra = 0.0
cantidad_articulos = int(input("Cantidad de articulos: "))
for i in range(cantidad_articulos):
    precio = float(input("Precio: "))
    total_compra += precio

if total_compra > 5000:
    descuento = total_compra * 0.10
else:
    descuento = 0

total_final = total_compra - descuento
print(f"Cliente: {cliente} | Subtotal: \${total_compra}")
print(f"Total a pagar: \${total_final}")`,
      testCases: [
        {
          name: 'Cliente Ana con 2 productos de 3000 (total 6000 con descuento a 5400.0)',
          inputs: ['Ana', '2', '3000', '3000'],
          expectedOutputs: [
            'Cliente: Ana | Subtotal: $6000.0',
            'Total a pagar: $5400.0'
          ],
          description: 'Aplica 10% de descuento sobre 6000'
        },
        {
          name: 'Cliente Luis con 2 productos de 1500 (total 3000 sin descuento)',
          inputs: ['Luis', '2', '1500', '1500'],
          expectedOutputs: [
            'Cliente: Luis | Subtotal: $3000.0',
            'Total a pagar: $3000.0'
          ],
          description: 'Mantiene precio regular de 3000.0'
        }
      ],
      points: 20
    }
  }
};
