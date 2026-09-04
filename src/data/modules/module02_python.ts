import { CourseModule } from '../../types/course';

export const module02: CourseModule = {
  id: 2,
  number: 2,
  title: '¿Qué es Python?',
  subtitle: 'Historia, filosofía, características y aplicaciones en el mundo real',
  description: 'Descubre por qué Python es el lenguaje más popular del mundo, cómo funciona un lenguaje interpretado y en qué industrias gigantescas se utiliza todos los días.',
  icon: '🐍',
  estimatedTime: '25 min',
  category: 'fundamentos',
  theory: [
    {
      id: 'm2_t1',
      title: '1. Origen y filosofía: La belleza de la sencillez',
      content: 'Python fue creado a finales de los años 80 por el programador neerlandés **Guido van Rossum** y lanzado públicamente en 1991. ¿Sabías de dónde viene su nombre? No proviene de la serpiente pitón, sino del grupo cómico británico **Monty Python**, del cual Guido era fanático.\n\nLa filosofía central de Python se resume en el **"Zen de Python"**: *La legibilidad cuenta*, *Lo simple es mejor que lo complejo*, y *Explícito es mejor que implícito*. Mientras otros lenguajes requieren escribir decenas de símbolos extraños como llaves `{}` o puntos y comas `;`, Python utiliza palabras claras en inglés y sangrías ordenadas.',
      keyTakeaways: [
        'Creado por Guido van Rossum con foco en legibilidad y productividad.',
        'Sintaxis limpia y casi idéntica al pseudocódigo en inglés.',
        'Gran lema: "El código se lee muchas más veces de las que se escribe".'
      ]
    },
    {
      id: 'm2_t2',
      title: '2. ¿Qué significa que Python sea un lenguaje interpretado?',
      content: 'A diferencia de lenguajes compilados (como C o C++) donde todo el programa debe transformarse por completo en un archivo binario `.exe` antes de poder ejecutarse, Python es **interpretado**.\n\nUn programa especial llamado **Intérprete de Python** lee tu código línea por línea, verifica su sintaxis y lo traduce a instrucciones directas en tiempo real. Esto permite probar ideas al instante, experimentar en una consola interactiva y desarrollar mucho más rápido.',
      codeExample: {
        code: '# En Python, mostrar un mensaje es tan simple como esto:\nprint("¡Hola desde Python!")\n\n# Y hacer una operación matemática:\nresultado = 5 * 10\nprint("El resultado es:", resultado)',
        explanation: 'Sin configuraciones complejas ni código repetitivo: dos líneas y el programa funciona.',
        output: '¡Hola desde Python!\nEl resultado es: 50'
      }
    },
    {
      id: 'm2_t3',
      title: '3. ¿Dónde se utiliza Python en el mundo real?',
      content: 'Hoy en día, Python es el líder indiscutible en las tecnologías más avanzadas del planeta:\n\n* 🤖 **Inteligencia Artificial y Machine Learning:** Redes neuronales, ChatGPT, visión por computadora y modelos predictivos (librerías como PyTorch y TensorFlow).\n* 🌐 **Desarrollo Web:** Aplicaciones dinámicas con frameworks robustos como Django y FastAPI (Instagram, Spotify y Netflix usan Python).\n* 📊 **Ciencia de Datos y Análisis:** Análisis financiero, visualización de datos, medicina y genómica (Pandas, NumPy).\n* ⚡ **Automatización y Scripts:** Ahorrar horas de trabajo repetitivo manipulando planillas Excel, descargando información de internet o gestionando servidores.\n* 🛡️ **Ciberseguridad:** Auditorías de seguridad, análisis de tráfico y herramientas de testeo de penetración.',
      keyTakeaways: [
        'Python es de propósito general: sirve para prácticamente cualquier área tecnológica.',
        'Tiene la comunidad de desarrolladores más grande y activa del mundo.',
        'Cuenta con el principio de "baterías incluidas": miles de librerías listas para usar.'
      ]
    }
  ],
  quiz: [
    {
      id: 'm2_q1',
      question: '¿Quién creó el lenguaje de programación Python?',
      options: [
        'Bill Gates',
        'Guido van Rossum',
        'Steve Jobs',
        'Mark Zuckerberg'
      ],
      correctAnswer: 1,
      explanation: '¡Correcto! Guido van Rossum comenzó el desarrollo de Python en 1989 y lo publicó en 1991.',
      hint: 'Es un programador holandés seguidor de la comedia británica Monty Python.'
    },
    {
      id: 'm2_q2',
      question: '¿Por qué Python se llama "Python"?',
      options: [
        'Por una peligrosa serpiente que el creador tenía de mascota',
        'En homenaje a la serie cómica británica Monty Python',
        'Es una sigla secreta militar',
        'Por el nombre de la ciudad donde nació'
      ],
      correctAnswer: 1,
      explanation: 'Guido buscaba un nombre corto, único y ligeramente misterioso, y se inspiró en el programa "Monty Python\'s Flying Circus".',
      hint: 'Recordá la anécdota sobre el grupo humorístico de televisión.'
    },
    {
      id: 'm2_q3',
      question: '¿Cuál es una de las mayores ventajas de la sintaxis de Python?',
      options: [
        'Que requiere escribir miles de símbolos obligatorios como ;; y {{}}',
        'Que es extremadamente legible, limpia y parecida al inglés',
        'Que solo funciona en computadoras cuánticas',
        'Que no permite usar números'
      ],
      correctAnswer: 1,
      explanation: 'La claridad y legibilidad son el corazón de Python: menos código visualmente cargado significa menos errores y aprendizaje más rápido.',
      hint: 'Pensá en qué busca el "Zen de Python" con respecto a la legibilidad.'
    },
    {
      id: 'm2_q4',
      question: '¿Qué significa que Python sea un lenguaje "interpretado"?',
      options: [
        'Que un actor de teatro lo lee en voz alta',
        'Que el código se procesa línea por línea por un intérprete sin requerir compilación previa completa',
        'Que el programa solo funciona si está conectado a una grabadora de audio',
        'Que solo sirve para interpretar idiomas extranjeros'
      ],
      correctAnswer: 1,
      explanation: 'Un lenguaje interpretado ejecuta el código instrucción tras instrucción a través del intérprete de Python en tiempo de ejecución.',
      hint: 'Opuesto a los lenguajes compilados que generan un ejecutable .exe completo de antemano.'
    },
    {
      id: 'm2_q5',
      question: '¿En qué área tecnológica Python es hoy en día el líder absoluto indiscutido?',
      options: [
        'Inteligencia Artificial, Machine Learning y Ciencia de Datos',
        'Reparación mecánica de impresoras',
        'Fabricación de cables submarinos',
        'Diseño de carcasas de plástico'
      ],
      correctAnswer: 0,
      explanation: 'Python es el estándar de oro de la industria en IA, Data Science y Machine Learning gracias a librerías como TensorFlow, PyTorch y Scikit-learn.',
      hint: 'Pensá en algoritmos de redes neuronales y análisis masivo de datos.'
    },
    {
      id: 'm2_q6',
      question: '¿Qué famosas plataformas digitales utilizan Python intensivamente en sus servidores?',
      options: [
        'Empresas inexistentes',
        'Instagram, Spotify, Netflix y YouTube',
        'Ninguna, solo se usa en laboratorios escolares',
        'Únicamente programas de hace 50 años'
      ],
      correctAnswer: 1,
      explanation: 'Las plataformas más grandes del mundo procesan miles de millones de peticiones diarias con la ayuda de Python y sus herramientas web.',
      hint: 'Buscá los servicios de streaming y redes sociales más populares.'
    },
    {
      id: 'm2_q7',
      question: '¿Qué expresa la frase de Python "las baterías vienen incluidas" (batteries included)?',
      options: [
        'Que tu computadora debe tener pilas recargables',
        'Que incluye una inmensa biblioteca estándar con herramientas listas para usar sin instalar cosas adicionales',
        'Que el teclado consume menos energía',
        'Que Python no funciona si la laptop no está al 100% de batería'
      ],
      correctAnswer: 1,
      explanation: 'Significa que ni bien instalas Python ya cuentas con módulos para trabajar con matemáticas, fechas, archivos, internet y mucho más.',
      hint: 'Se refiere a la riqueza y variedad de su biblioteca estándar instalada de fábrica.'
    },
    {
      id: 'm2_q8',
      question: '¿Cuál es el sitio web oficial principal de Python?',
      options: [
        'python.org',
        'python.com.ar',
        'serpientes.net',
        'descargar-programas-gratis.com'
      ],
      correctAnswer: 0,
      explanation: 'python.org es la sede oficial de la Python Software Foundation (PSF), donde se encuentra la documentación original y las descargas seguras.',
      hint: 'Es una organización sin fines de lucro con dominio .org.'
    },
    {
      id: 'm2_q9',
      question: '¿Cómo se le llama comúnmente a los desarrolladores y entusiastas que programan en Python?',
      options: [
        'Pythónicos o Pythonistas',
        'Serpenteros',
        'Cobras digitales',
        'Pitonisas'
      ],
      correctAnswer: 0,
      explanation: 'En la comunidad global nos identificamos orgullosamente como "Pythonistas".',
      hint: 'Termina en -ista, como artista o deportista.'
    },
    {
      id: 'm2_q10',
      question: '¿Python es un software libre y de código abierto (Open Source)?',
      options: [
        'No, hay que pagar una suscripción mensual de 100 dólares',
        'Sí, es 100% gratuito y libre para uso personal, educativo y comercial',
        'Solo es gratis los fines de semana',
        'Requiere permiso del gobierno de Holanda'
      ],
      correctAnswer: 1,
      explanation: 'Python tiene una licencia abierta gestionada por la PSF que permite a cualquier persona o empresa usarlo, mejorarlo y distribuirlo libremente.',
      hint: 'Es una de las razones clave de su masiva adopción global.'
    }
  ],
  exercises: [
    {
      id: 'm2_ex1',
      moduleId: 2,
      number: 1,
      title: 'El saludo del Pythonista',
      description: 'Escribe un programa en Python que muestre por pantalla la frase exacta: "Soy un futuro Pythonista"',
      difficulty: 'starter',
      realWorldContext: 'Primera declaración de identidad en la comunidad de código.',
      starterCode: '# Muestra el saludo oficial:\n',
      solution: 'print("Soy un futuro Pythonista")',
      hints: [
        'Utiliza la función print()',
        'El texto va entre comillas dobles o simples',
        'Escribe exactamente: print("Soy un futuro Pythonista")'
      ],
      xp: 20,
      testCases: [
        {
          name: 'Mostrar saludo Pythonista',
          expectedOutputs: ['Soy un futuro Pythonista'],
          description: 'Salida en consola idéntica'
        }
      ]
    },
    {
      id: 'm2_ex2',
      moduleId: 2,
      number: 2,
      title: 'Python en acción matemática',
      description: 'Python también funciona como una calculadora superpotente. Escribe una instrucción print que calcule y muestre la multiplicación de 12 por 8 usando el asterisco `*`.',
      difficulty: 'basic',
      realWorldContext: 'Cálculo de inventario en una tienda.',
      starterCode: '# Calcula 12 por 8 dentro de un print:\n',
      solution: 'print(12 * 8)',
      hints: [
        'Dentro del print, escribe la operación matemática directamente sin comillas: print(12 * 8)',
        'Si pones comillas, Python mostrará el texto "12 * 8" en lugar del resultado 96.',
        'La solución es: print(12 * 8)'
      ],
      xp: 25,
      testCases: [
        {
          name: 'Resultado 96',
          expectedOutputs: ['96'],
          description: 'Debe imprimir el número 96'
        }
      ]
    }
  ],
  optionalChallenge: {
    id: 'm2_chal1',
    title: '🚀 Ficha técnica de Python',
    description: 'Imprime en pantalla dos líneas informativas con los datos clave aprendidos:\nLínea 1: "Lenguaje: Python"\nLínea 2: "Creador: Guido van Rossum"',
    bonusXp: 100,
    starterCode: '# Imprime la ficha técnica en 2 líneas:\n',
    solution: 'print("Lenguaje: Python")\nprint("Creador: Guido van Rossum")',
    hints: [
      'Usa dos instrucciones print() consecutivas',
      'Primera línea: print("Lenguaje: Python")',
      'Segunda línea: print("Creador: Guido van Rossum")'
    ],
    testCases: [
      {
        name: 'Ficha técnica completa',
        expectedOutputs: ['Lenguaje: Python', 'Creador: Guido van Rossum'],
        description: 'Imprime las dos líneas de información'
      }
    ]
  },
  summary: {
    conceptsLearned: [
      'Historia de Python y creación por Guido van Rossum',
      'La filosofía del Zen de Python: simplicidad, claridad y elegancia',
      'Diferencia entre lenguaje interpretado y compilado',
      'Aplicaciones masivas en Inteligencia Artificial, Web, Datos y Ciberseguridad',
      'Comunidad libre y recursos oficiales en python.org'
    ],
    congratulationsMessage: '¡Excelente! Ahora comprendés el ecosistema y el poder de la herramienta que estás aprendiendo a dominar.'
  }
};
