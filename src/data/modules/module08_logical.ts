import { CourseModule } from '../../types/course';

export const module08: CourseModule = {
  id: 8,
  number: 8,
  title: 'Operadores lógicos',
  subtitle: 'Conectar múltiples condiciones usando and, or y not',
  description: 'Aprende a combinar varias condiciones lógicas a la vez: cómo funciona la conjunción (and), la disyunción (or) y la negación (not) con analogías cotidianas.',
  icon: '💡',
  estimatedTime: '30 min',
  category: 'operadores',
  theory: [
    {
      id: 'm7_t1',
      title: '1. ¿Qué son los operadores lógicos? El control de acceso',
      content: 'En la vida diaria rara vez tomamos decisiones basándonos en una sola condición aislada. Casi siempre evaluamos dos o más factores al mismo tiempo.\n\nPython tiene tres operadores lógicos esenciales en inglés sencillo:\n\n1. 🤝 **`and` (Y):** Da `True` **únicamente si TODAS las condiciones son verdaderas**. Si tan solo una es falsa, todo es falso.\n2. 🔀 **`or` (O):** Da `True` **si AL MENOS UNA de las condiciones es verdadera**. Solo es falso si todas son falsas.\n3. 🚫 **`not` (NO / Negación):** **Invierte** el valor: si algo es `True`, lo convierte en `False`, y si es `False`, lo convierte en `True`.',
      analogy: {
        title: 'Analogía: Entrada a un recital o concierto',
        description: 'Imagina las reglas del guardia de seguridad en la puerta:',
        steps: [
          'Regla AND: Para entrar a la zona VIP necesitas tener entrada VIP Y presentar documento de identidad. Si te falta cualquiera de los dos, no pasas.',
          'Regla OR: Para obtener descuento de estudiante, puedes presentar credencial universitaria O certificado de alumno regular. Con cualquiera de las dos opciones alcanza.',
          'Regla NOT: not tiene_deudas significa que tu cuenta está al día.'
        ]
      },
      codeExample: {
        code: 'tiene_entrada = True\ntiene_documento = True\n\n# Ambas son verdaderas:\npuede_entrar = tiene_entrada and tiene_documento\nprint("¿Puede entrar al recital?", puede_entrar)\n\n# Negación:\nes_menor = False\nprint("¿Es mayor de edad?", not es_menor)',
        explanation: 'and exige que ambas variables sean True. not invierte False a True.',
        output: '¿Puede entrar al recital? True\n¿Es mayor de edad? True'
      }
    }
  ],
  quiz: [
    {
      id: 'm7_q1',
      question: '¿Cuándo devuelve `True` el operador `and`?',
      options: [
        'Cuando al menos una condición es verdadera',
        'Solo y únicamente cuando TODAS las condiciones evaluadas son verdaderas (True and True)',
        'Cuando todas son falsas',
        'Nunca devuelve True'
      ],
      correctAnswer: 1,
      explanation: '`and` es muy estricto: requiere que ambos lados sean `True` para que el resultado final sea `True`.',
      hint: 'Pensá en la entrada VIP: necesitás entrada Y documento.'
    },
    {
      id: 'm7_q2',
      question: '¿Qué resultado produce la expresión: `True or False`?',
      options: [
        'False',
        'True',
        'Error',
        'None'
      ],
      correctAnswer: 1,
      explanation: 'El operador `or` es flexible: alcanza con que uno solo de los lados sea `True` para que toda la expresión sea `True`.',
      hint: 'En un "o", basta con que una opción se cumpla.'
    },
    {
      id: 'm7_q3',
      question: '¿Qué hace el operador `not` sobre el valor `True` (`not True`)?',
      options: [
        'Lo deja igual en True',
        'Lo convierte en False',
        'Produce un error de sintaxis',
        'Devuelve 0'
      ],
      correctAnswer: 1,
      explanation: '`not` invierte el valor lógico: `not True` se convierte en `False`, y `not False` se convierte en `True`.',
      hint: 'Es la negación lógica.'
    },
    {
      id: 'm7_q4',
      question: 'Si `edad = 25` y `tiene_registro = True`, ¿qué resultado da: `edad >= 18 and tiene_registro`?',
      options: [
        'True (puede conducir legalmente)',
        'False',
        '25',
        'Error'
      ],
      correctAnswer: 0,
      explanation: '25 >= 18 es True, y tiene_registro es True. True and True resulta en `True`.',
      hint: 'Ambas condiciones son verdaderas.'
    },
    {
      id: 'm7_q5',
      question: '¿Cuál de las siguientes expresiones evaluará a `False`?',
      options: [
        'True or False',
        'False or True',
        'True and True',
        'True and False'
      ],
      correctAnswer: 3,
      explanation: 'En `True and False`, como hay un `False` involucrado en una operación `and`, el resultado final es `False`.',
      hint: 'El operador and requiere que ambos lados sean True.'
    }
  ],
  exercises: [
    {
      id: 'm7_ex1',
      moduleId: 8,
      number: 1,
      title: 'Acceso al evento con AND',
      description: 'Crea `tiene_entrada = True` y `tiene_documento = True`. Imprime el resultado de `tiene_entrada and tiene_documento`.',
      difficulty: 'starter',
      realWorldContext: 'Control de admisión en eventos masivos.',
      starterCode: '# Verifica acceso con and:\n',
      solution: 'tiene_entrada = True\ntiene_documento = True\nprint(tiene_entrada and tiene_documento)',
      hints: [
        'tiene_entrada = True',
        'tiene_documento = True',
        'print(tiene_entrada and tiene_documento)'
      ],
      xp: 20,
      testCases: [
        {
          name: 'True por ambas condiciones',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex2',
      moduleId: 8,
      number: 2,
      title: 'Falta un requisito con AND',
      description: 'Crea `tiene_entrada = True` pero `tiene_documento = False`. Imprime `tiene_entrada and tiene_documento`.',
      difficulty: 'starter',
      realWorldContext: 'Rechazo de ingreso por falta de documentación.',
      starterCode: '# Requisito incompleto:\n',
      solution: 'tiene_entrada = True\ntiene_documento = False\nprint(tiene_entrada and tiene_documento)',
      hints: [
        'tiene_documento debe ser False',
        'print(tiene_entrada and tiene_documento)',
        'Como falta el documento, mostrará False'
      ],
      xp: 20,
      testCases: [
        {
          name: 'False por falta de documento',
          expectedOutputs: ['False'],
          description: 'Muestra False'
        }
      ]
    },
    {
      id: 'm7_ex3',
      moduleId: 8,
      number: 3,
      title: 'Descuento con OR (Tarjeta o Efectivo)',
      description: 'Una tienda da descuento si pagas con efectivo o si eres socio del club: `paga_efectivo = False`, `es_socio = True`. Imprime `paga_efectivo or es_socio`.',
      difficulty: 'starter',
      realWorldContext: 'Criterio de promociones comerciales.',
      starterCode: '# Descuento con or:\n',
      solution: 'paga_efectivo = False\nes_socio = True\nprint(paga_efectivo or es_socio)',
      hints: [
        'paga_efectivo = False',
        'es_socio = True',
        'print(paga_efectivo or es_socio) dará True porque es socio'
      ],
      xp: 20,
      testCases: [
        {
          name: 'True por socio',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex4',
      moduleId: 8,
      number: 4,
      title: 'Inversión con NOT',
      description: 'Crea `llueve = False`. Imprime `not llueve` para saber si el día está despejado.',
      difficulty: 'basic',
      realWorldContext: 'Lógica inversa en sensores climáticos.',
      starterCode: 'llueve = False\n# Imprime el valor negado:\n',
      solution: 'llueve = False\nprint(not llueve)',
      hints: [
        'not False se convierte en True',
        'print(not llueve)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'not llueve True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex5',
      moduleId: 8,
      number: 5,
      title: 'Rango numérico: Entre 10 y 20',
      description: 'Tenemos un número: `numero = 15`. Comprueba si está dentro del rango de 10 a 20 comprobando si es mayor o igual a 10 Y menor o igual a 20: `en_rango = numero >= 10 and numero <= 20`. Imprime `en_rango`.',
      difficulty: 'basic',
      realWorldContext: 'Validación de formularios numéricos.',
      starterCode: 'numero = 15\n# Verifica si está en rango:\n',
      solution: 'numero = 15\nen_rango = numero >= 10 and numero <= 20\nprint(en_rango)',
      hints: [
        'en_rango = numero >= 10 and numero <= 20',
        'print(en_rango)',
        '15 cumple ambas, mostrará True'
      ],
      xp: 25,
      testCases: [
        {
          name: 'En rango True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex6',
      moduleId: 8,
      number: 6,
      title: 'Número fuera de rango',
      description: 'Con `numero = 25`, evalúa la misma condición: `en_rango = numero >= 10 and numero <= 20` e imprime `en_rango`. Comprobarás que da `False`.',
      difficulty: 'basic',
      realWorldContext: 'Detección de valores fuera de escala.',
      starterCode: 'numero = 25\n# Evalúa si 25 está en rango:\n',
      solution: 'numero = 25\nen_rango = numero >= 10 and numero <= 20\nprint(en_rango)',
      hints: [
        'numero = 25',
        'en_rango = numero >= 10 and numero <= 20',
        'Como 25 no es <= 20, dará False'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Fuera de rango False',
          expectedOutputs: ['False'],
          description: 'Muestra False'
        }
      ]
    },
    {
      id: 'm7_ex7',
      moduleId: 8,
      number: 7,
      title: 'Día de descanso (Fin de semana)',
      description: 'Crea una variable `dia = "sábado"`. Comprueba si es día de descanso evaluando: `es_descanso = dia == "sábado" or dia == "domingo"`. Imprime `es_descanso`.',
      difficulty: 'intermediate',
      realWorldContext: 'Planificador de turnos laborales.',
      starterCode: 'dia = "sábado"\n# Comprueba si es descanso e imprime:\n',
      solution: 'dia = "sábado"\nes_descanso = dia == "sábado" or dia == "domingo"\nprint(es_descanso)',
      hints: [
        'es_descanso = dia == "sábado" or dia == "domingo"',
        'print(es_descanso)'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Descanso True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex8',
      moduleId: 8,
      number: 8,
      title: 'Aprobación de beca estudiantil',
      description: 'Para obtener una beca se requiere: `promedio >= 8.5` AND `asistencia >= 90`. Con `promedio = 9.0` y `asistencia = 95`, guarda el resultado en `obtiene_beca` e imprímelo.',
      difficulty: 'intermediate',
      realWorldContext: 'Asignación automática de beneficios académicos.',
      starterCode: 'promedio = 9.0\nasistencia = 95\n# Determina si obtiene beca:\n',
      solution: 'promedio = 9.0\nasistencia = 95\nobtiene_beca = promedio >= 8.5 and asistencia >= 90\nprint(obtiene_beca)',
      hints: [
        'obtiene_beca = promedio >= 8.5 and asistencia >= 90',
        'print(obtiene_beca)',
        'Ambos requisitos se cumplen, devolverá True'
      ],
      xp: 30,
      testCases: [
        {
          name: 'Beca aprobada True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex9',
      moduleId: 8,
      number: 9,
      title: 'Combinando NOT con AND',
      description: 'Un usuario puede publicar un comentario si está registrado y NO está bloqueado: `esta_registrado = True`, `esta_bloqueado = False`. Crea `puede_comentar = esta_registrado and not esta_bloqueado` e imprime `puede_comentar`.',
      difficulty: 'intermediate',
      realWorldContext: 'Moderación comunitaria en foros y redes sociales.',
      starterCode: 'esta_registrado = True\nesta_bloqueado = False\n# Evalúa si puede comentar:\n',
      solution: 'esta_registrado = True\nesta_bloqueado = False\npuede_comentar = esta_registrado and not esta_bloqueado\nprint(puede_comentar)',
      hints: [
        'not esta_bloqueado invierte False a True',
        'True and True da True',
        'print(puede_comentar)'
      ],
      xp: 35,
      testCases: [
        {
          name: 'Puede comentar True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    },
    {
      id: 'm7_ex10',
      moduleId: 8,
      number: 10,
      title: 'Desafío Lógico: Sistema de alarma doméstica',
      description: 'Una alarma suena si: (hay movimiento O una puerta fue abierta) Y el sistema está armado: `hay_movimiento = True`, `puerta_abierta = False`, `sistema_armado = True`. Crea `suena_alarma = (hay_movimiento or puerta_abierta) and sistema_armado` e imprime `suena_alarma`.',
      difficulty: 'challenge',
      realWorldContext: 'Circuito lógico de seguridad para el hogar.',
      starterCode: 'hay_movimiento = True\npuerta_abierta = False\nsistema_armado = True\n# Calcula suena_alarma:\n',
      solution: 'hay_movimiento = True\npuerta_abierta = False\nsistema_armado = True\nsuena_alarma = (hay_movimiento or puerta_abierta) and sistema_armado\nprint(suena_alarma)',
      hints: [
        'Usa paréntesis para agrupar el OR: (hay_movimiento or puerta_abierta)',
        '(True or False) resulta en True',
        'True and True resulta en True'
      ],
      xp: 50,
      testCases: [
        {
          name: 'Alarma activada True',
          expectedOutputs: ['True'],
          description: 'Muestra True'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm7_chal1',
    title: '🚀 Desafío Lógico: Validación de Compra Segura',
    description: 'Una compra con tarjeta se aprueba si: tiene fondos suficientes (`fondos >= precio`), la tarjeta no está vencida (`not vencida`) y el usuario confirmó el SMS (`sms_confirmado`). Con `fondos = 15000`, `precio = 12000`, `vencida = False` y `sms_confirmado = True`, evalúa si la compra es aprobada e imprime el resultado.',
    bonusXp: 100,
    badgeId: 'logical_thinker',
    starterCode: 'fondos = 15000\nprecio = 12000\nvencida = False\nsms_confirmado = True\n# Verifica las 3 condiciones e imprime:\n',
    solution: 'fondos = 15000\nprecio = 12000\nvencida = False\nsms_confirmado = True\naprobada = (fondos >= precio) and (not vencida) and sms_confirmado\nprint(aprobada)',
    hints: [
      'fondos >= precio es True (15000 >= 12000)',
      'not vencida es True (not False)',
      'sms_confirmado es True',
      'True and True and True es True'
    ],
    testCases: [
      {
        name: 'Compra aprobada True',
        expectedOutputs: ['True'],
        description: 'Muestra True'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Operador and (ambas condiciones deben ser verdaderas)',
      'Operador or (basta con que una sola sea verdadera)',
      'Operador not (inversión lógica del valor booleano)',
      'Agrupación de condiciones complejas mediante paréntesis'
    ],
    congratulationsMessage: '¡Excelente razonamiento lógico! Ya dominás las combinaciones de condiciones booleanas como un experto.'
  }
};
