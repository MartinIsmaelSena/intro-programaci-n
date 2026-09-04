import { PythonChallenge } from '../../types/challenge';

export const challenge01: PythonChallenge = {
  id: 'challenge-1',
  number: 1,
  title: 'Desafío de Python N.º 1',
  shortDescription: 'Resolvé un problema de lógica utilizando Python.',
  fullDescription: `Una tienda digital necesita un sistema automático para facturar las compras de sus clientes aplicando reglas comerciales de descuentos por volumen y costos de envío condicionados.

Tu programa debe solicitar interactivamente dos datos por teclado:
1. La cantidad de artículos comprados: \`int(input("Cantidad de articulos: "))\`
2. El precio unitario de cada artículo: \`float(input("Precio unitario: "))\`

Luego debe calcular y aplicar las siguientes reglas comerciales:
• **Subtotal inicial:** se calcula multiplicando la cantidad de artículos por el precio unitario.
• **Descuentos por volumen escalonados:**
  - Si la cantidad de artículos es 10 o más (\`articulos >= 10\`), se aplica un 15% de descuento sobre el subtotal (\`subtotal * 0.15\`).
  - Si la cantidad está entre 5 y 9 artículos inclusive (\`articulos >= 5 and articulos <= 9\`), se aplica un 10% de descuento (\`subtotal * 0.10\`).
  - Si compró menos de 5 artículos, el descuento es de $0 (\`0.0\`).
• **Subtotal con descuento:** es el subtotal inicial menos el descuento obtenido.
• **Costo de envío condicional:**
  - Si el subtotal con descuento es mayor o igual a $15000 (\`subtotal_con_descuento >= 15000\`), el envío es **gratuito** (\`costo_envio = 0.0\`).
  - Si el subtotal con descuento es menor a $15000, el costo de envío fijo es de **$1200.0** (\`costo_envio = 1200.0\`).
• **Total final a pagar:** es el subtotal con descuento más el costo de envío.

Finalmente, tu programa debe imprimir en pantalla exactamente estas 4 líneas utilizando f-strings:
Línea 1: \`f"Subtotal: \${subtotal}"\`
Línea 2: \`f"Descuento aplicado: \${descuento}"\`
Línea 3: \`f"Costo de envio: \${costo_envio}"\`
Línea 4: \`f"Total final a pagar: \${total_pagar}"\``,
  durationMinutes: 40,
  available: true, // 🟢 Disponible
  difficulty: 'medium',
  modality: 'Programación',
  targetObjective: 'Resolver correctamente el problema planteado.',
  starterCode: `# 🚀 Desafío de Python N.º 1 - Facturación con Reglas Comerciales
# Escribe tu programa aquí:

`,
  solution: `articulos = int(input("Cantidad de articulos: "))
precio_unitario = float(input("Precio unitario: "))

subtotal = articulos * precio_unitario

if articulos >= 10:
    descuento = subtotal * 0.15
elif articulos >= 5:
    descuento = subtotal * 0.10
else:
    descuento = 0.0

subtotal_con_descuento = subtotal - descuento

if subtotal_con_descuento >= 15000:
    costo_envio = 0.0
else:
    costo_envio = 1200.0

total_pagar = subtotal_con_descuento + costo_envio

print(f"Subtotal: \${subtotal}")
print(f"Descuento aplicado: \${descuento}")
print(f"Costo de envio: \${costo_envio}")
print(f"Total final a pagar: \${total_pagar}")`,
  weights: {
    correctness: 70,
    problemSolving: 20,
    requirements: 10
  },
  totalPoints: 100,
  testCases: [
    {
      name: 'Caso 1: 12 artículos a $2000 (15% descuento y envío gratis)',
      inputs: ['12', '2000'],
      expectedOutputs: [
        'Subtotal: $24000.0',
        'Descuento aplicado: $3600.0',
        'Costo de envio: $0.0',
        'Total final a pagar: $20400.0'
      ],
      description: 'Evalúa descuento del 15% y envío gratuito superando $15000'
    },
    {
      name: 'Caso 2: 6 artículos a $1000 (10% descuento con envío de $1200)',
      inputs: ['6', '1000'],
      expectedOutputs: [
        'Subtotal: $6000.0',
        'Descuento aplicado: $600.0',
        'Costo de envio: $1200.0',
        'Total final a pagar: $6600.0'
      ],
      description: 'Evalúa descuento del 10% y costo de envío de $1200'
    },
    {
      name: 'Caso 3: 2 artículos a $3000 (Sin descuento con costo de envío)',
      inputs: ['2', '3000'],
      expectedOutputs: [
        'Subtotal: $6000.0',
        'Descuento aplicado: $0.0',
        'Costo de envio: $1200.0',
        'Total final a pagar: $7200.0'
      ],
      description: 'Evalúa compra menor a 5 artículos sin descuento y con envío'
    },
    {
      name: 'Caso 4: 1 artículo a $20000 (Sin descuento por cantidad pero con envío gratis)',
      inputs: ['1', '20000'],
      expectedOutputs: [
        'Subtotal: $20000.0',
        'Descuento aplicado: $0.0',
        'Costo de envio: $0.0',
        'Total final a pagar: $20000.0'
      ],
      description: 'Evalúa 1 artículo superando umbral de envío gratuito'
    }
  ]
};
