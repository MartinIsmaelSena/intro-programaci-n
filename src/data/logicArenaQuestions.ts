import { LogicArenaQuestion } from '../types/logicArena';
import { MatchQuestion } from '../types/onlineChallenge';

export const LOGIC_ARENA_QUESTIONS: LogicArenaQuestion[] = [
  // =========================================================================
  // 1. COMPARACIONES (comparisons)
  // =========================================================================
  {
    id: 'la_comp_01',
    category: 'comparisons',
    subtopic: 'Operador menor estricto (<)',
    difficulty: 'facil',
    type: 'comparacion',
    question: '¿Qué valor booleano devuelve la siguiente expresión en Python?',
    codeSnippet: '5 < 6',
    options: ['True', 'False', 'None', 'Error de sintaxis'],
    correctAnswer: 0,
    explanation: 'El número 5 es estrictamente menor que 6, por lo que la comparación evalúa a True.',
    hint: 'El símbolo < verifica si el valor de la izquierda es menor que el de la derecha.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_02',
    category: 'comparisons',
    subtopic: 'Operador mayor o igual (>=)',
    difficulty: 'facil',
    type: 'comparacion',
    question: '¿Cuál es el resultado de evaluar esta comparación?',
    codeSnippet: '10 >= 10',
    options: ['True', 'False', '10', 'None'],
    correctAnswer: 0,
    explanation: 'El operador >= significa "mayor o igual". Como 10 es igual a 10, la condición se cumple y devuelve True.',
    hint: 'Basta con que sea mayor O que sea igual para que devuelva True.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_03',
    category: 'comparisons',
    subtopic: 'Operador distinto (!=)',
    difficulty: 'facil',
    type: 'comparacion',
    question: '¿Qué valor arroja la siguiente expresión?',
    codeSnippet: '15 != 15',
    options: ['True', 'False', '0', 'Error'],
    correctAnswer: 1,
    explanation: 'El operador != comprueba si los valores son diferentes. Como 15 es idéntico a 15, la afirmación de que son diferentes es False.',
    hint: '!= evalúa si los dos operandos son desiguales.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_04',
    category: 'comparisons',
    subtopic: 'Comparación de cadenas y mayúsculas',
    difficulty: 'medio',
    type: 'comparacion',
    question: 'En Python, ¿qué produce la comparación entre estas dos cadenas?',
    codeSnippet: '"hola" == "Hola"',
    options: ['True', 'False', 'None', 'Error de tipo'],
    correctAnswer: 1,
    explanation: 'Python es sensible a mayúsculas y minúsculas ("case-sensitive"). La letra "h" minúscula tiene un código de carácter diferente a "H" mayúscula, por lo que no son iguales (False).',
    hint: 'Python distingue estrictamente entre letras mayúsculas y minúsculas.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_05',
    category: 'comparisons',
    subtopic: 'Comparación menor o igual (<=)',
    difficulty: 'facil',
    type: 'comparacion',
    question: '¿Cuál es el resultado de la siguiente expresión?',
    codeSnippet: '7 <= 5',
    options: ['False', 'True', '7', 'None'],
    correctAnswer: 0,
    explanation: '7 no es menor que 5 ni tampoco es igual a 5. Por lo tanto, la expresión resulta en False.',
    hint: 'Verificá si 7 es menor o igual a 5.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_06',
    category: 'comparisons',
    subtopic: 'Comparación de igualdad entre int y float',
    difficulty: 'medio',
    type: 'comparacion',
    question: '¿Qué devuelve la siguiente comparación numérica en Python?',
    codeSnippet: '8.0 == 8',
    options: ['True', 'False', 'Error de tipo', 'None'],
    correctAnswer: 0,
    explanation: 'El operador == compara el valor numérico de ambos operandos. Aunque 8.0 es float y 8 es int, su valor matemático es exactamente el mismo, por lo que evalúa a True.',
    hint: '== compara el valor cuantitativo, no el tipo exacto.',
    relatedModuleId: 7
  },
  {
    id: 'la_comp_07',
    category: 'comparisons',
    subtopic: 'Comparación de cadenas distintas',
    difficulty: 'facil',
    type: 'comparacion',
    question: '¿Cuál es el resultado de la siguiente comparación de texto?',
    codeSnippet: '"python" != "java"',
    options: ['True', 'False', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'Las cadenas "python" y "java" contienen caracteres completamente diferentes. Al ser desiguales, != devuelve True.',
    hint: '!= es verdadero cuando los valores son diferentes.',
    relatedModuleId: 7
  },

  // =========================================================================
  // 2. OPERADORES LÓGICOS (boolean_logic)
  // =========================================================================
  {
    id: 'la_log_01',
    category: 'boolean_logic',
    subtopic: 'Operador lógico and con comparaciones',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Cuál es el resultado de la siguiente expresión lógica combinada?',
    codeSnippet: '21 > 20 and 18 != 18',
    options: ['False', 'True', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'Analizamos por partes: (21 > 20) es True, pero (18 != 18) es False. Para que el operador "and" sea True, AMBOS lados deben ser verdaderos. True and False resulta en False.',
    hint: 'El operador "and" exige que ambas partes sean verdaderas al mismo tiempo.',
    relatedModuleId: 8
  },
  {
    id: 'la_log_02',
    category: 'boolean_logic',
    subtopic: 'Operador de negación not',
    difficulty: 'facil',
    type: 'logica',
    question: '¿Qué valor booleano devuelve esta expresión?',
    codeSnippet: 'not (5 > 2)',
    options: ['False', 'True', 'None', '5'],
    correctAnswer: 0,
    explanation: 'La comparación interna (5 > 2) es True. El operador "not" invierte el valor de verdad, por lo que not True se convierte en False.',
    hint: 'El operador "not" invierte cualquier valor booleano: de True pasa a False y viceversa.',
    relatedModuleId: 8
  },
  {
    id: 'la_log_03',
    category: 'boolean_logic',
    subtopic: 'Operador lógico or',
    difficulty: 'facil',
    type: 'logica',
    question: '¿Cuál es el resultado de evaluar esta expresión?',
    codeSnippet: 'True or False',
    options: ['True', 'False', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'El operador "or" es verdadero si al menos una de las dos condiciones es verdadera. Como la primera parte es True, el resultado total es True.',
    hint: 'El operador "or" solo requiere que uno de los lados sea True.',
    relatedModuleId: 8
  },
  {
    id: 'la_log_04',
    category: 'boolean_logic',
    subtopic: 'Operador and con falso a la izquierda',
    difficulty: 'facil',
    type: 'logica',
    question: '¿Qué resultado produce la siguiente operación lógica?',
    codeSnippet: 'False and True',
    options: ['False', 'True', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'En el operador "and", si cualquiera de los operandos es False, el resultado entero es False.',
    hint: 'Si un lado del "and" es falso, toda la expresión es falsa.',
    relatedModuleId: 8
  },
  {
    id: 'la_log_05',
    category: 'boolean_logic',
    subtopic: 'Disyunción lógica or con falso a la derecha',
    difficulty: 'facil',
    type: 'logica',
    question: '¿Cuál es el resultado de la siguiente expresión?',
    codeSnippet: '10 > 5 or 3 < 1',
    options: ['True', 'False', '10', 'Error'],
    correctAnswer: 0,
    explanation: 'Evaluamos: (10 > 5) es True, mientras que (3 < 1) es False. Con "or", True or False da como resultado True.',
    hint: 'Al menos una condición debe cumplirse en el "or".',
    relatedModuleId: 8
  },
  {
    id: 'la_log_06',
    category: 'boolean_logic',
    subtopic: 'Doble negación con not',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Qué devuelve la siguiente expresión en Python?',
    codeSnippet: 'not False and not False',
    options: ['True', 'False', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'not False se convierte en True en ambos lados. Luego, True and True resulta en True.',
    hint: 'not False es True. Luego evalúa el and.',
    relatedModuleId: 8
  },
  {
    id: 'la_log_07',
    category: 'boolean_logic',
    subtopic: 'Negación de una conjunción',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Qué valor booleano genera esta expresión?',
    codeSnippet: 'not (10 == 10 and 4 < 2)',
    options: ['True', 'False', 'None', '10'],
    correctAnswer: 0,
    explanation: 'Dentro del paréntesis: 10 == 10 es True, pero 4 < 2 es False. True and False es False. Finalmente, not False resulta en True.',
    hint: 'Resolvé primero lo que está entre paréntesis y luego aplicá el not.',
    relatedModuleId: 8
  },

  // =========================================================================
  // 3. VARIABLES Y NOMBRES VÁLIDOS (variables)
  // =========================================================================
  {
    id: 'la_var_01',
    category: 'variables',
    subtopic: 'Convención snake_case y nombres válidos',
    difficulty: 'facil',
    type: 'variable',
    question: 'Teniendo en cuenta las reglas y buenas prácticas de nombres de variables en Python, ¿cuál es la opción más correcta y limpia para almacenar el precio de un producto?',
    codeSnippet: undefined,
    options: ['precio_producto', 'PRECIOPRODUCTO', 'p', '1precio'],
    correctAnswer: 0,
    explanation: 'En Python la convención oficial es snake_case (letras minúsculas separadas por guiones bajos). Además, "1precio" es inválido porque no puede empezar con un número, y "p" no es descriptivo.',
    hint: 'Buscá el nombre descriptivo que respete la convención de minúsculas con guión bajo.',
    relatedModuleId: 4
  },
  {
    id: 'la_var_02',
    category: 'variables',
    subtopic: 'Regla de nombres que comienzan con número',
    difficulty: 'facil',
    type: 'variable',
    question: '¿Cuál de los siguientes nombres de variables provocará un error de sintaxis (SyntaxError) en Python?',
    codeSnippet: undefined,
    options: ['2do_puesto', '_usuario', 'total_puntos', 'nombre2'],
    correctAnswer: 0,
    explanation: 'En Python los nombres de variables NO pueden comenzar con un dígito numérico. Deben empezar con una letra o con un guion bajo (_).',
    hint: 'Ningún identificador en Python puede empezar con un número.',
    relatedModuleId: 4
  },
  {
    id: 'la_var_03',
    category: 'variables',
    subtopic: 'Palabras reservadas del lenguaje',
    difficulty: 'medio',
    type: 'variable',
    question: '¿Cuál de las siguientes líneas causará un error porque utiliza una palabra clave reservada de Python como variable?',
    codeSnippet: undefined,
    options: ['for = 10', 'valor = 10', 'contador = 10', 'mi_for = 10'],
    correctAnswer: 0,
    explanation: '"for" es una palabra reservada del lenguaje utilizada para bucles de control y no puede usarse como nombre de variable.',
    hint: 'Palabras como for, if, while, class son reservadas por Python.',
    relatedModuleId: 4
  },
  {
    id: 'la_var_04',
    category: 'variables',
    subtopic: 'Uso de guion medio vs guion bajo',
    difficulty: 'facil',
    type: 'variable',
    question: '¿Por qué la instrucción `puntos-totales = 50` genera un error en Python?',
    codeSnippet: 'puntos-totales = 50',
    options: [
      'Porque el guion medio (-) es interpretado como el operador de resta',
      'Porque las variables deben escribirse en mayúsculas',
      'Porque falta colocar comillas al número 50',
      'Porque en Python las variables solo pueden tener una palabra'
    ],
    correctAnswer: 0,
    explanation: 'El guion medio (-) representa el operador de resta. Python intenta hacer la resta `puntos - totales` en lugar de crear una variable. Debe usarse guion bajo: `puntos_totales`.',
    hint: 'Pensá en qué operación matemática realiza el símbolo -.',
    relatedModuleId: 4
  },
  {
    id: 'la_var_05',
    category: 'variables',
    subtopic: 'Concepto fundamental de variable',
    difficulty: 'facil',
    type: 'conceptual',
    question: '¿Cuál es la mejor definición de una variable en programación?',
    codeSnippet: undefined,
    options: [
      'Un espacio con nombre en la memoria del equipo para guardar y consultar un dato',
      'Un comando para apagar la computadora',
      'Un tipo especial de archivo en el disco rígido',
      'Una operación que siempre devuelve True'
    ],
    correctAnswer: 0,
    explanation: 'Una variable es una etiqueta asignada a un espacio de memoria donde guardamos datos que nuestro programa puede leer, usar o modificar.',
    hint: 'Pensá en la analogía de una caja etiquetada donde guardamos un objeto.',
    relatedModuleId: 4
  },

  // =========================================================================
  // 4. REASIGNACIÓN DE VARIABLES (reassignment)
  // =========================================================================
  {
    id: 'la_reassign_01',
    category: 'reassignment',
    subtopic: 'Reasignación de cadena de texto',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Cuál será la salida en pantalla al ejecutar este código?',
    codeSnippet: 'nombre = "Martin"\nnombre = "Rocio"\nprint(nombre)',
    options: ['Rocio', 'Martin', 'Martin y Rocio', 'Error'],
    correctAnswer: 0,
    explanation: 'La variable "nombre" primero almacena "Martin", pero en la segunda línea se sobreescribe con "Rocio". Al imprimir, muestra el último valor asignado: "Rocio".',
    hint: 'Las variables almacenan únicamente el último valor que se les asignó.',
    relatedModuleId: 4
  },
  {
    id: 'la_reassign_02',
    category: 'reassignment',
    subtopic: 'Copia de valor y reasignación',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Qué valor se mostrará en pantalla tras ejecutar el siguiente código?',
    codeSnippet: 'x = 10\nx = 20\ny = x\nprint(y)',
    options: ['20', '10', 'x', 'None'],
    correctAnswer: 0,
    explanation: 'Inicialmente x vale 10, luego se reasigna a 20. Cuando hacemos `y = x`, se le asigna el valor actual de x (20) a y. Por ende, print(y) muestra 20.',
    hint: 'Seguí el valor de x paso a paso en cada línea.',
    relatedModuleId: 4
  },
  {
    id: 'la_reassign_03',
    category: 'reassignment',
    subtopic: 'Incremento de variable numérica',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Cuál es la salida del siguiente programa?',
    codeSnippet: 'puntos = 10\npuntos = puntos + 5\nprint(puntos)',
    options: ['15', '10', '5', '105'],
    correctAnswer: 0,
    explanation: 'Primero se evalúa la parte derecha: `puntos + 5` es `10 + 5 = 15`. Luego se guarda ese 15 en la variable "puntos".',
    hint: 'La parte derecha del igual se calcula antes de guardar el resultado en la variable.',
    relatedModuleId: 4
  },
  {
    id: 'la_reassign_04',
    category: 'reassignment',
    subtopic: 'Independencia de variables tras la copia',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Qué valor mostrará `print(b)` en el siguiente fragmento?',
    codeSnippet: 'a = 5\nb = a\na = 99\nprint(b)',
    options: ['5', '99', 'a', 'Error'],
    correctAnswer: 0,
    explanation: 'Cuando se ejecuta `b = a`, la variable `b` recibe una copia del valor de `a` en ese instante (5). Modificar `a` después no altera el valor ya guardado en `b`.',
    hint: 'Modificar la variable original más adelante no cambia las variables que ya guardaron su valor anterior.',
    relatedModuleId: 4
  },
  {
    id: 'la_reassign_05',
    category: 'reassignment',
    subtopic: 'Múltiples operaciones sucesivas sobre una variable',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Qué imprimirá el siguiente código?',
    codeSnippet: 'vidas = 3\nvidas = vidas - 1\nvidas = vidas + 2\nprint(vidas)',
    options: ['4', '3', '2', '5'],
    correctAnswer: 0,
    explanation: 'Comienza en 3. En la segunda línea: 3 - 1 = 2. En la tercera línea: 2 + 2 = 4. print(vidas) muestra 4.',
    hint: 'Resta 1 y luego suma 2 al resultado intermedio.',
    relatedModuleId: 4
  },
  {
    id: 'la_reassign_06',
    category: 'reassignment',
    subtopic: 'Intercambio clásico con variable auxiliar',
    difficulty: 'desafio',
    type: 'salida_codigo',
    question: '¿Qué imprimirá este programa que intercambia variables usando una variable temporal?',
    codeSnippet: 'x = "A"\ny = "B"\ntemp = x\nx = y\ny = temp\nprint(x, y)',
    options: ['B A', 'A B', 'B B', 'A A'],
    correctAnswer: 0,
    explanation: '`temp` guarda "A". Luego `x` recibe "B". Finalmente `y` recibe el valor guardado en `temp` ("A"). Por lo tanto, `x` es "B" e `y` es "A".',
    hint: 'Seguí el valor guardado en la variable auxiliar temp.',
    relatedModuleId: 4
  },

  // =========================================================================
  // 5. TRAZADO Y SALIDA DE CÓDIGO (code_tracing)
  // =========================================================================
  {
    id: 'la_trace_01',
    category: 'code_tracing',
    subtopic: 'Multiplicación aritmética simple',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Qué se muestra por pantalla al ejecutar este bloque de código?',
    codeSnippet: 'a = 3\nb = 4\nprint(a * b)',
    options: ['12', '7', '34', '3 * 4'],
    correctAnswer: 0,
    explanation: 'El asterisco (*) en Python es el operador de multiplicación. 3 multiplicado por 4 es 12.',
    hint: '* es el operador de multiplicación en Python.',
    relatedModuleId: 6
  },
  {
    id: 'la_trace_02',
    category: 'code_tracing',
    subtopic: 'División entera (//)',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Cuál será la salida por consola?',
    codeSnippet: 'x = 10\ny = 3\nprint(x // y)',
    options: ['3', '3.3333', '3.0', '1'],
    correctAnswer: 0,
    explanation: 'El operador // realiza la división entera, descartando los decimales y devolviendo solo la parte entera (10 // 3 = 3).',
    hint: '// trunca la división devolviendo solo el cociente entero.',
    relatedModuleId: 6
  },
  {
    id: 'la_trace_03',
    category: 'code_tracing',
    subtopic: 'Repetición de cadenas con multiplicación (*)',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Qué imprime el siguiente fragmento de código?',
    codeSnippet: 'texto = "Py"\nveces = 3\nprint(texto * veces)',
    options: ['PyPyPy', 'Py * 3', 'Error de tipo', 'Py 3'],
    correctAnswer: 0,
    explanation: 'En Python, multiplicar una cadena por un entero repite la cadena esa cantidad de veces ("Py" * 3 = "PyPyPy").',
    hint: 'Multiplicar un string por un entero repite el texto.',
    relatedModuleId: 5
  },
  {
    id: 'la_trace_04',
    category: 'code_tracing',
    subtopic: 'Concatenación de cadenas vs suma numérica',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Cuál es la salida del siguiente código?',
    codeSnippet: 'a = "10"\nb = "20"\nprint(a + b)',
    options: ['1020', '30', 'Error', '"30"'],
    correctAnswer: 0,
    explanation: 'Las variables a y b son de tipo cadena (str) porque tienen comillas. El operador + entre dos textos los concatena (une), formando "1020", no la suma matemática 30.',
    hint: 'Ambos valores están entre comillas, por lo que son textos.',
    relatedModuleId: 5
  },
  {
    id: 'la_trace_05',
    category: 'code_tracing',
    subtopic: 'Operador módulo o resto (%)',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Qué valor se imprimirá en pantalla?',
    codeSnippet: 'x = 14\ny = 4\nprint(x % y)',
    options: ['2', '3', '3.5', '0'],
    correctAnswer: 0,
    explanation: 'El operador % calcula el resto o residuo de la división. 14 dividido por 4 es 3 con un resto de 2 (3*4 = 12, restan 2).',
    hint: '% calcula lo que sobra en la división entera.',
    relatedModuleId: 6
  },
  {
    id: 'la_trace_06',
    category: 'code_tracing',
    subtopic: 'Operador de potencia (**)',
    difficulty: 'facil',
    type: 'salida_codigo',
    question: '¿Cuál es la salida de este cálculo en Python?',
    codeSnippet: 'base = 2\nexp = 4\nprint(base ** exp)',
    options: ['16', '8', '6', '24'],
    correctAnswer: 0,
    explanation: 'El operador ** representa la potencia. 2 elevado a la 4ta potencia es 2 * 2 * 2 * 2 = 16.',
    hint: '** es el operador para elevar a una potencia.',
    relatedModuleId: 6
  },
  {
    id: 'la_trace_07',
    category: 'code_tracing',
    subtopic: 'División común siempre devuelve float',
    difficulty: 'medio',
    type: 'salida_codigo',
    question: '¿Cuál es la salida exacta de la siguiente instrucción?',
    codeSnippet: 'print(6 / 2)',
    options: ['3.0', '3', '3,0', 'Error'],
    correctAnswer: 0,
    explanation: 'En Python 3, el operador de división simple (/) siempre produce un resultado de tipo flotante (float), por lo que 6 / 2 devuelve 3.0 y no 3 entero.',
    hint: 'La división simple con / siempre devuelve un número con punto decimal.',
    relatedModuleId: 6
  },

  // =========================================================================
  // 6. DETECCIÓN DE ERRORES (error_detection)
  // =========================================================================
  {
    id: 'la_err_01',
    category: 'error_detection',
    subtopic: 'Asignación (=) vs Comparación (==)',
    difficulty: 'facil',
    type: 'deteccion_error',
    question: '¿Qué error presenta el siguiente fragmento?',
    codeSnippet: 'edad = 18\nes_igual = (edad = 18)',
    options: [
      'Usa un solo igual (=) que es asignación en vez de dos iguales (==) para comparar',
      'No se pueden usar paréntesis en expresiones booleanas',
      'La variable edad debe llamarse en mayúsculas',
      'Faltan comillas alrededor del número 18'
    ],
    correctAnswer: 0,
    explanation: 'El símbolo = se utiliza exclusivamente para asignar valores a variables. Para verificar igualdad lógica se debe usar ==.',
    hint: 'Recordá la diferencia entre asignar un valor y comparar si dos valores son iguales.',
    relatedModuleId: 7
  },
  {
    id: 'la_err_02',
    category: 'error_detection',
    subtopic: 'Error de comilla sin cerrar (SyntaxError)',
    difficulty: 'facil',
    type: 'deteccion_error',
    question: '¿Qué tipo de error provocará la siguiente línea de código?',
    codeSnippet: 'mensaje = "Hola estudiantes',
    options: [
      'SyntaxError: cadena de texto no cerrada con comillas',
      'TypeError: intento de sumar tipos incompatibles',
      'NameError: la variable mensaje no existe',
      'Ninguno, el código es válido'
    ],
    correctAnswer: 0,
    explanation: 'Toda cadena de texto que abre con comillas dobles debe cerrarse obligatoriamente con la misma comilla antes de terminar la línea.',
    hint: 'Mirá el final de la cadena de texto.',
    relatedModuleId: 5
  },
  {
    id: 'la_err_03',
    category: 'error_detection',
    subtopic: 'Suma de entero con texto sin convertir (TypeError)',
    difficulty: 'medio',
    type: 'deteccion_error',
    question: '¿Qué sucede al ejecutar la instrucción `resultado = 10 + "5"` en Python?',
    codeSnippet: 'resultado = 10 + "5"',
    options: [
      'Lanza un TypeError porque no se puede sumar directamente un int con un str',
      'Da como resultado 15 numérico',
      'Da como resultado "105" de texto',
      'Se guarda None en resultado'
    ],
    correctAnswer: 0,
    explanation: 'Python no realiza conversión implícita entre números y cadenas. Para sumarlos matemáticamente hay que convertir con int("5"), o para concatenar hay que usar str(10). De lo contrario lanza TypeError.',
    hint: 'Python no sabe si querés hacer una suma matemática o unir textos.',
    relatedModuleId: 5
  },
  {
    id: 'la_err_04',
    category: 'error_detection',
    subtopic: 'Variable no definida (NameError)',
    difficulty: 'facil',
    type: 'deteccion_error',
    question: 'Si ejecutamos `print(puntaje_final)` sin haber creado previamente esa variable, ¿qué error arroja Python?',
    codeSnippet: 'print(puntaje_final)',
    options: [
      'NameError: name "puntaje_final" is not defined',
      'ValueError: valor inválido',
      'ZeroDivisionError',
      'IndexError'
    ],
    correctAnswer: 0,
    explanation: 'Cuando intentamos acceder al valor de una variable que nunca fue declarada ni asignada, Python arroja un NameError indicando que el nombre no está definido.',
    hint: 'Cuando un nombre no existe en memoria, el error es de tipo NameError.',
    relatedModuleId: 4
  },
  {
    id: 'la_err_05',
    category: 'error_detection',
    subtopic: 'Conversión inválida de float en texto a entero directo',
    difficulty: 'desafio',
    type: 'deteccion_error',
    question: '¿Qué sucede cuando se ejecuta `x = int("3.14")` en Python?',
    codeSnippet: 'x = int("3.14")',
    options: [
      'Lanza un ValueError porque el texto contiene un punto decimal y no es un entero directo',
      'Guarda el número 3 redondeando hacia abajo',
      'Guarda 3.14 como float',
      'Guarda la cadena "3"'
    ],
    correctAnswer: 0,
    explanation: 'La función int() solo puede convertir textos que contengan dígitos enteros directamente (como "3"). Para convertir "3.14" primero debe usarse float("3.14") y luego int(float("3.14")).',
    hint: 'int() directo sobre un string con punto decimal genera ValueError.',
    relatedModuleId: 10
  },

  // =========================================================================
  // 7. LÓGICA COMBINADA Y PRECEDENCIA (combined_logic)
  // =========================================================================
  {
    id: 'la_comb_01',
    category: 'combined_logic',
    subtopic: 'Precedencia de and y or con comparaciones',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Qué valor booleano devuelve esta expresión combinada?',
    codeSnippet: '(10 > 5 and 3 < 8) or 2 == 4',
    options: ['True', 'False', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'El primer paréntesis: (10 > 5) es True y (3 < 8) es True, por lo que True and True es True. Luego, True or (2 == 4) es True, ya que el lado izquierdo del "or" es verdadero.',
    hint: 'Resolvé primero lo que está dentro de los paréntesis.',
    relatedModuleId: 8
  },
  {
    id: 'la_comb_02',
    category: 'combined_logic',
    subtopic: 'Variables con condiciones compuestas',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Qué imprime el siguiente código?',
    codeSnippet: 'x = 5\ny = 10\nprint((x < 10 and y > 5) and not (x == y))',
    options: ['True', 'False', 'None', 'Error'],
    correctAnswer: 0,
    explanation: '1) x < 10 (5 < 10) es True. 2) y > 5 (10 > 5) es True. True and True = True. 3) x == y (5 == 10) es False, por ende not False es True. 4) True and True = True.',
    hint: 'Analizá cada una de las 3 condiciones paso a paso.',
    relatedModuleId: 8
  },
  {
    id: 'la_comb_03',
    category: 'combined_logic',
    subtopic: 'Precedencia de multiplicación sobre suma y comparación',
    difficulty: 'medio',
    type: 'comparacion',
    question: '¿Qué devuelve la siguiente expresión en Python?',
    codeSnippet: '5 + 2 * 3 == 21',
    options: ['False', 'True', '11', 'Error'],
    correctAnswer: 0,
    explanation: 'Por orden de precedencia matemática, la multiplicación se hace antes que la suma: 2 * 3 = 6. Luego 5 + 6 = 11. Como 11 no es igual a 21, la comparación devuelve False.',
    hint: 'La multiplicación tiene mayor prioridad que la suma.',
    relatedModuleId: 6
  },
  {
    id: 'la_comb_04',
    category: 'combined_logic',
    subtopic: 'Comprobación de número par y rango',
    difficulty: 'facil',
    type: 'logica',
    question: '¿Qué imprimirá el siguiente fragmento para verificar si x es par y mayor a 5?',
    codeSnippet: 'x = 8\nprint((x % 2 == 0) and (x > 5))',
    options: ['True', 'False', '8', '0'],
    correctAnswer: 0,
    explanation: '1) 8 % 2 es 0, y 0 == 0 es True (es par). 2) 8 > 5 es True. Al tener "and", True and True resulta en True.',
    hint: 'Un número es par si su residuo dividido por 2 es 0.',
    relatedModuleId: 8
  },
  {
    id: 'la_comb_05',
    category: 'combined_logic',
    subtopic: 'Negación de disyunción combinada con conjunción',
    difficulty: 'desafio',
    type: 'logica',
    question: '¿Cuál es el resultado booleano de la siguiente expresión?',
    codeSnippet: 'not (True or False) and True',
    options: ['False', 'True', 'None', 'Error'],
    correctAnswer: 0,
    explanation: 'Dentro del paréntesis: (True or False) es True. Luego aplicamos el not: not True es False. Finalmente, False and True resulta en False.',
    hint: 'not(True) es False, y cualquier cosa combinada con "and False" da False.',
    relatedModuleId: 8
  },
  {
    id: 'la_comb_06',
    category: 'combined_logic',
    subtopic: 'Rango numérico acotado',
    difficulty: 'medio',
    type: 'logica',
    question: '¿Qué resultado da evaluar si una nota está entre 1 y 10 inclusivo?',
    codeSnippet: 'nota = 7\nprint(nota >= 1 and nota <= 10)',
    options: ['True', 'False', '7', 'None'],
    correctAnswer: 0,
    explanation: 'nota >= 1 es True (7 >= 1). nota <= 10 es True (7 <= 10). True and True devuelve True.',
    hint: 'Ambas condiciones se cumplen para el número 7.',
    relatedModuleId: 8
  }
];

// =========================================================================
// ADAPTADOR PARA REUTILIZACIÓN FUTURA EN DESAFÍOS 1 VS 1
// =========================================================================

/**
 * Convierte una pregunta de la Arena de Lógica al formato estándar de MatchQuestion
 * permitiendo enriquecer el banco de partidas 1v1 sin duplicar contenido.
 */
export function adaptLogicQuestionToMatchQuestion(q: LogicArenaQuestion): MatchQuestion {
  return {
    id: `arena_${q.id}`,
    moduleId: q.relatedModuleId || 4,
    topic: 'Arena de Lógica',
    category: 'foundations',
    subtopic: q.subtopic,
    difficulty: q.difficulty === 'facil' ? 'easy' : q.difficulty === 'medio' ? 'medium' : 'hard',
    type: q.type === 'salida_codigo' ? 'code_output'
      : q.type === 'deteccion_error' ? 'error_detection'
      : q.type === 'variable' ? 'concept'
      : 'theory',
    question: q.question,
    codeSnippet: q.codeSnippet,
    options: [...q.options],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    hint: q.hint
  };
}
