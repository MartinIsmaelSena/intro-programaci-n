-- ==============================================================================
-- MIGRACIÓN INCREMENTAL: EXPLICACIONES PEDAGÓGICAS PARA EL DOCENTE (FASE 2.8)
-- Agrega la columna explanation a online_questions_truth si no existe,
-- puebla las explicaciones pedagógicas de las preguntas sin alterar sus IDs,
-- asegura RLS restrictivo (solo docente/admin) y actualiza resolve_duel_round()
-- para devolver respuesta correcta y explicación exclusivamente al docente.
-- ==============================================================================

-- 1. Agregar columna explanation a online_questions_truth si no existe
ALTER TABLE public.online_questions_truth
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- 2. Poblar/actualizar explicaciones oficiales
-- Utiliza ON CONFLICT (id) DO UPDATE SET explanation = EXCLUDED.explanation
-- para preservar el correct_answer y los IDs existentes sin alterar claves primarias.
INSERT INTO public.online_questions_truth (id, module_id, correct_answer, explanation) VALUES
    ('q_m1_1', 1, 1, 'Un algoritmo es una secuencia de instrucciones paso a paso, precisa y finita, diseñada para resolver un problema o cumplir un objetivo determinado.'),
    ('q_m1_2', 1, 0, 'El código fuente contiene las instrucciones redactadas en un lenguaje formal que la computadora interpreta o ejecuta para cumplir tareas.'),
    ('q_m1_3', 1, 2, 'En programación, un "bug" (bicho) es un defecto o error en el software que produce un resultado no deseado o detiene la ejecución.'),
    ('q_m1_4', 1, 1, 'Depurar o debugging es el proceso sistemático de encontrar y resolver errores en el código para que el programa funcione según lo previsto.'),
    ('q_m1_5', 1, 2, 'La ejecución secuencial significa que el procesador sigue el flujo del programa línea por línea, de arriba hacia abajo, en el orden en que fueron escritas.'),
    ('q_m1_6', 1, 0, 'En los algoritmos el orden de los pasos es fundamental. Si vertemos agua caliente antes de colocar el café, el proceso falla porque la secuencia lógica fue alterada.'),
    ('q_m1_7', 1, 1, 'Una computadora no posee intuición ni libre albedrío: ejecuta de forma rigurosa y matemática. Si los datos y pasos son idénticos, la salida siempre será la misma.'),
    ('q_m1_8', 1, 0, 'Los lenguajes de alto nivel proporcionan una sintaxis comprensible y cercana al lenguaje humano, actuando como un puente frente al código binario (ceros y unos).'),
    ('q_m1_9', 1, 1, 'Todo algoritmo válido debe ser finito: debe estar compuesto por una cantidad determinada de pasos y garantizar que en algún momento alcanzará un estado final.'),
    ('q_m1_10', 1, 1, 'Un error de sintaxis es como una falta de ortografía que la computadora no comprende. Un error de lógica es cuando las palabras están bien escritas pero el razonamiento del algoritmo es erróneo.'),
    ('q_m1_11', 1, 1, 'Las tres propiedades pilares de todo algoritmo formal son: precisión (cada paso es claro), orden (secuencia definida) y finitud (tiene un final determinado).'),
    ('q_m2_1', 2, 1, 'Resolver un problema consiste en idear una serie de pasos ordenados y lógicos para pasar de un estado inicial (con una necesidad o incógnita) a un estado final con la solución deseada.'),
    ('q_m2_2', 2, 1, 'Una instrucción es una directiva clara, no ambigua y concreta que le indica a la computadora qué acción exacta debe realizar.'),
    ('q_m2_3', 2, 1, 'La Entrada (Input) está constituida por todos los datos que ingresan al sistema para que el algoritmo pueda operar sobre ellos.'),
    ('q_m2_4', 2, 1, 'Un dato es un elemento crudo (por ejemplo "39"). La información es el dato procesado con significado ("Temperatura del paciente: 39°C - Fiebre").'),
    ('q_m2_5', 2, 0, 'La descomposición es la estrategia de dividir un problema grande en partes menores. Al resolver cada subproblema, se resuelve el conjunto completo (divide y vencerás).'),
    ('q_m2_6', 2, 2, 'Las entradas son las tres notas, el proceso es sumarlas y dividirlas por 3, y la salida es el promedio resultante entregado al usuario.'),
    ('q_m2_7', 2, 0, 'El algoritmo es la solución conceptual independiente del lenguaje. El programa es la implementación concreta de dicho algoritmo en un lenguaje formal como Python.'),
    ('q_m2_8', 2, 1, 'En todo algoritmo el orden temporal de las instrucciones es crucial. Alterar la secuencia produce resultados erróneos o fallas en el proceso.'),
    ('q_m2_9', 2, 0, 'Automatizar consiste en confiar a una máquina la ejecución repetitiva, veloz y precisa de un algoritmo sin tener que realizar cada paso manualmente.'),
    ('q_m2_10', 2, 1, 'Es un error de lógica. Las instrucciones están correctamente escritas en el lenguaje (no hay error de sintaxis), pero el razonamiento del algoritmo fue defectuoso.'),
    ('q_m2_11', 2, 1, 'La prueba de escritorio consiste en simular a mano el comportamiento del algoritmo, probando distintos valores de entrada para asegurar que la lógica sea correcta antes de codificar.'),
    ('q_m2_12', 2, 1, 'La entrada es la cantidad de horas ingresadas. El cálculo matemático (multiplicación) es la transformación o Proceso. La salida es el recibo impreso.'),
    ('q_m3_1', 3, 1, 'Python fue concebido a finales de los años 80 y lanzado oficialmente en 1991 por el programador neerlandés Guido van Rossum.'),
    ('q_m3_2', 3, 1, 'Python es un lenguaje interpretado (se ejecuta línea por línea mediante un intérprete), de alto nivel (sintaxis legible y expresiva) y multipropósito.'),
    ('q_m3_3', 3, 1, 'Guido van Rossum eligió el nombre en homenaje a la serie de comedia británica "Monty Python\''s Flying Circus", de la cual era un gran aficionado.'),
    ('q_m3_4', 3, 1, 'El Zen de Python promueve principios fundamentales como "Simple es mejor que complejo", "Bello es mejor que feo" y "La legibilidad cuenta".'),
    ('q_m3_5', 3, 1, 'Multiplataforma o portable significa que un programa escrito en Python puede ejecutarse sin modificaciones estructurales en diversos entornos y sistemas operativos.'),
    ('q_m3_6', 3, 0, 'El intérprete de Python lee el código fuente línea por línea, lo analiza sintácticamente y lo traduce a instrucciones directas que la máquina ejecuta de inmediato.'),
    ('q_m3_7', 3, 1, 'Python es interpretado y no requiere compilar previamente a un archivo binario `.exe` para probarlo; se puede ejecutar directamente con el intérprete.'),
    ('q_m3_8', 3, 1, 'La claridad sintáctica de Python permite a los principiantes e investigadores concentrarse en resolver problemas en lugar de lidiar con complejidades técnicas del lenguaje.'),
    ('q_m4_1', 4, 1, 'Una variable es un contenedor o espacio con nombre en la memoria RAM donde almacenamos un valor que el programa puede consultar o modificar.'),
    ('q_m4_2', 4, 0, 'El signo `=` es el operador de asignación en Python: toma el valor ubicado a la derecha y lo almacena dentro de la variable nombrada a la izquierda.'),
    ('q_m4_3', 4, 0, 'Al pasar la variable `nombre` sin comillas a la función `print()`, Python busca el valor contenido en la variable e imprime su contenido: Martin.'),
    ('q_m4_4', 4, 1, 'La variable `nombre` almacena un valor a la vez. Cuando se ejecuta `nombre = "Rocio"`, el valor anterior `"Martin"` es sobreescrito. Por eso se imprime Rocio.'),
    ('q_m4_5', 4, 1, 'La variable `edad` comenzó valiendo 15, pero en la siguiente línea se actualizó a 16. La función `print()` muestra el último valor asignado.'),
    ('q_m4_6', 4, 2, 'La variable puntos fue reasignada secuencialmente. El último valor que recibió antes del print fue 5.'),
    ('q_m4_7', 4, 1, 'La instrucción `print(nombre)` solo consulta el valor de la variable `nombre`. Como su último valor asignado fue "Rocio", imprime Rocio.'),
    ('q_m4_8', 4, 1, 'Cuando se ejecuta `y = x`, `y` toma una copia del valor actual de `x` (que era 4). Luego `x` cambia a 10, pero `y` conserva su valor de 4.'),
    ('q_m4_9', 4, 2, '`nombre_usuario` es válido porque utiliza letras y guión bajo. No empieza con números, no tiene espacios ni guiones medios.'),
    ('q_m4_10', 4, 0, 'Una de las reglas sintácticas estrictas de Python es que los nombres de variables jamás pueden comenzar con un dígito numérico.'),
    ('q_m4_11', 4, 1, 'PEP 8 establece que los nombres de variables deben escribirse en minúsculas, con palabras separadas por guiones bajos (convención snake_case).'),
    ('q_m4_12', 4, 1, 'Ambas variables fueron actualizadas. Al momento de ejecutarse los prints, `nombre` contiene "Rocio" y `edad` contiene 21.'),
    ('q_m5_1', 5, 1, 'Los números completos sin coma ni punto decimal pertenecen al tipo de dato entero o `int`.'),
    ('q_m5_2', 5, 2, 'Cualquier texto delimitado entre comillas simples o dobles es una cadena de caracteres del tipo `str`.'),
    ('q_m5_3', 5, 1, 'La función `type()` recibe un valor o variable entre paréntesis y devuelve el tipo de dato correspondiente (ej: `<class \''int\''>`).'),
    ('q_m5_4', 5, 2, 'Los números con punto decimal se representan en Python mediante el tipo de punto flotante o `float`.'),
    ('q_m5_5', 5, 1, 'En Python, los literales booleanos deben escribirse obligatoriamente con la primera letra mayúscula: `True` y `False`.'),
    ('q_m5_6', 5, 1, 'Como ambos valores están entre comillas, son cadenas de texto (`str`). El operador `+` entre textos los une (concatena), formando "1020".'),
    ('q_m5_7', 5, 0, 'La variable `activo` almacena el valor booleano `True`. Al consultar su tipo con `type(activo)`, devuelve `<class \''bool\''>`.'),
    ('q_m5_8', 5, 0, 'En Python el tipo de dato define qué operaciones son posibles. Sobre un entero podemos hacer cálculos matemáticos; sobre un texto solo operaciones de caracteres.'),
    ('q_m6_1', 6, 1, 'En Python la exponenciación o potencia se realiza con el doble asterisco `**` (por ejemplo, `2 ** 3` es 8).'),
    ('q_m6_2', 6, 1, 'Por reglas de precedencia matemática, la multiplicación `3 * 2 = 6` se resuelve antes que la resta. Luego `10 - 6 = 4`.'),
    ('q_m6_3', 6, 1, 'El operador `//` realiza la división entera, descartando por completo los decimales. 14 cabe 4 veces enteras en 3.'),
    ('q_m6_4', 6, 1, '17 dividido 5 es 3 con resto 2. El operador `%` (módulo) devuelve siempre el resto de la división.'),
    ('q_m6_5', 6, 1, 'En Python 3 la división con una sola barra `/` siempre retorna un número decimal de punto flotante (`float`), incluso en `4 / 2 -> 2.0`.'),
    ('q_m6_6', 6, 1, 'La potencia tiene mayor precedencia que la suma: `2 ** 3 = 8`. Luego `8 + 1 = 9`.'),
    ('q_m6_7', 6, 0, 'Todo número par es divisible exactamente por 2, lo que significa que el residuo devuelto por `n % 2` es estrictamente igual a cero.'),
    ('q_m6_8', 6, 1, 'Primero los paréntesis: `(8 + 2) = 10` y `(5 - 3) = 2`. Luego `10 * 2 = 20`. Finalmente `20 / 2 = 10.0` (la división siempre da float).'),
    ('q_m7_1', 7, 1, 'En Python, el operador para comparar si dos valores son iguales es el doble signo igual `==`. Un solo signo `=` se reserva para asignación.'),
    ('q_m7_2', 7, 1, 'El signo de admiración seguido de igual `!=` representa "distinto de" o "diferente de" en Python.'),
    ('q_m7_3', 7, 1, 'El operador `>=` evalúa si el valor izquierdo es mayor O igual que el derecho. Como 15 es igual a 15, la condición es True.'),
    ('q_m7_4', 7, 1, 'Python es sensible a mayúsculas y minúsculas (case-sensitive). La "P" mayúscula no es igual a la "p" minúscula, por lo que la comparación da False.'),
    ('q_m7_5', 7, 0, 'Como 10 es estrictamente menor que 20, la expresión `a < b` se evalúa como verdadera y el print muestra True.'),
    ('q_m7_6', 7, 1, '`puntos = 50` es una asignación, no una comparación. En Python no se puede asignar dentro de una expresión de comparación; se debe usar `==`.'),
    ('q_m7_7', 7, 1, 'Python permite comparaciones encadenadas directas. Como 3 es menor que 5 Y 5 es menor que 8 simultáneamente, el resultado es True.'),
    ('q_m7_8', 7, 1, 'El operador `==` en Python compara tanto el valor como el tipo de dato. Un entero nunca es igual a una cadena de texto, por lo que devuelve False sin error.'),
    ('q_m8_1', 8, 0, 'El operador `and` solo devuelve True si tanto la condición izquierda como la derecha son simultáneamente verdaderas.'),
    ('q_m8_2', 8, 1, 'El operador `not` invierte el valor booleano: si la condición era True pasa a ser False, y si era False pasa a ser True.'),
    ('q_m8_3', 8, 1, 'El operador `or` solo da False cuando ambas condiciones son falsas. Si cualquiera de ellas es True, devuelve True.'),
    ('q_m8_4', 8, 1, 'En el operador `and`, al haber una condición falsa, toda la expresión se evalúa como False.'),
    ('q_m8_5', 8, 1, 'En el operador `or`, basta con que una de las dos condiciones sea verdadera para que toda la expresión sea True.'),
    ('q_m8_6', 8, 1, '`edad >= 18` es False (16 no es mayor o igual a 18), pero `tiene_permiso` es True. Con el operador `or`, False or True da como resultado True.'),
    ('q_m8_7', 8, 1, 'Dentro del paréntesis: `5 > 2` es True y `3 == 3` es True. `True and True` da True. El operador `not` exterior lo invierte a False.'),
    ('q_m8_8', 8, 1, 'En un `and`, si el primer término es False, el resultado final será False sin evaluar el segundo. En un `or`, si el primero es True, ya es True directamente.'),
    ('q_m9_1', 9, 1, '`print()` es la función estándar de salida en Python: proyecta textos, números y resultados de variables en la consola.'),
    ('q_m9_2', 9, 1, 'Por defecto, la función `print()` separa cada argumento que recibe con un espacio simple en blanco.'),
    ('q_m9_3', 9, 1, 'El parámetro con nombre `sep` (de separator) define qué carácter o texto se colocará entre cada uno de los elementos (ej: `sep="-"`).'),
    ('q_m9_4', 9, 1, 'El argumento `sep="-"` reemplaza el espacio por defecto por un guión medio entre cada elemento, resultando en 2026-09-04.'),
    ('q_m9_5', 9, 2, 'Por defecto `end="\\n"` (salto de línea). Si pasamos `end=""` o `end=" "`, el próximo print continuará en la misma línea.'),
    ('q_m9_6', 9, 0, 'Las f-strings requieren la letra `f` antes de las comillas iniciales y las variables encerradas entre llaves `{variable}`.'),
    ('q_m9_7', 9, 1, '"A" se imprime sin salto de línea. Inmediatamente se imprime "B" con un guión final sin salto. Luego se imprime "C". Queda "AB-C".'),
    ('q_m9_8', 9, 1, 'La barra invertida seguida de la letra n (`\\n`) representa el carácter especial de nueva línea (*newline*).'),
    ('q_m10_1', 10, 1, '`input()` pausa la ejecución del programa y espera que el usuario escriba un dato en la consola y presione Enter.'),
    ('q_m10_2', 10, 1, 'Regla de oro de `input()`: siempre retorna una cadena de texto (`str`). Si el usuario escribe 25, devuelve el texto `"25"`.'),
    ('q_m10_3', 10, 1, 'Como `numero` almacena el texto `"5"`, la operación `"5" * 2` repite la cadena de caracteres dos veces, produciendo "55".'),
    ('q_m10_4', 10, 1, 'Envolvemos `input()` dentro de `int()`: primero se captura el texto y luego `int()` lo convierte en número entero.'),
    ('q_m10_5', 10, 1, 'Si la cadena de caracteres no contiene dígitos numéricos válidos, la función `int()` arroja una excepción `ValueError`.'),
    ('q_m10_6', 10, 1, 'Para capturar y convertir un número que admita decimales, se utiliza la función `float(input(...))`.'),
    ('q_m10_7', 10, 1, 'Ambas variables son del tipo `str`. El operador `+` entre textos los concatena, mostrando "43" en lugar de sumar matemáticamente.'),
    ('q_m10_8', 10, 1, '`int()` solo puede convertir textos que contengan dígitos enteros directos. Para convertir `"3.14"`, primero se debe convertir con `float("3.14")`.'),
    ('q_m10_9', 10, 1, 'El texto dentro de `input(...)` se denomina prompt o indicador: se proyecta en consola antes de la captura para que el usuario sepa qué debe tipear.'),
    ('q_m11_1', 11, 1, 'La instrucción `if` (si condicional) evalúa una expresión lógica y ejecuta el bloque identado solo si el resultado es True.'),
    ('q_m11_2', 11, 1, 'La cláusula `else` (sino) define las instrucciones que deben ejecutarse cuando la condición del `if` no se cumplió.'),
    ('q_m11_3', 11, 1, 'Python utiliza la palabra reservada `elif` (abreviatura de else if) para comprobar condiciones secundarias en secuencia.'),
    ('q_m11_4', 11, 2, 'A diferencia de otros lenguajes que usan llaves, Python utiliza la indentación obligatoria para definir la jerarquía de bloques de código.'),
    ('q_m11_5', 11, 0, 'La variable `nota` vale 7. La condición `7 >= 6` es True, por lo que se ejecuta la rama del `if` e imprime "Aprobado".'),
    ('q_m11_6', 11, 1, 'Si ninguna condición es verdadera y no existe un `else` por descarte, Python omite la estructura condicional y sigue ejecutando.'),
    ('q_m11_7', 11, 1, '`x = 12 > 5` es True, ingresa al primer bloque. Luego `12 < 15` también es True, por lo que imprime "En rango".'),
    ('q_m11_8', 11, 1, 'Python evalúa en orden. `5 > 10` es False. `5 > 3` es True, por lo que ejecuta "B" y de inmediato abandona toda la estructura sin evaluar el siguiente elif.'),
    ('q_m12_1', 12, 1, 'Un bucle permite automatizar la repetición de tareas sin tener que copiar y pegar las mismas instrucciones manualmente.'),
    ('q_m12_2', 12, 1, 'Cada repetición o ejecución completa del cuerpo de un bucle se denomina formalmente una "iteración".'),
    ('q_m12_3', 12, 1, 'Python cuenta con dos estructuras de repetición nativas: `for` (iteración sobre secuencias) y `while` (repetición condicionada).'),
    ('q_m12_4', 12, 0, 'Ocurre cuando la condición de salida del bucle nunca cambia a False, haciendo que el programa quede atrapado repitiendo para siempre.'),
    ('q_m12_5', 12, 1, 'Un acumulador almacena sumas o totales progresivos sumando valores que pueden cambiar en cada iteración.'),
    ('q_m12_6', 12, 0, 'Un contador suele incrementarse en 1 (o valor fijo) para contabilizar cuántas vueltas o sucesos tuvieron lugar.'),
    ('q_m12_7', 12, 1, 'La instrucción `break` cancela inmediatamente la ejecución del bucle actual y transfiere el control a la línea siguiente al bucle.'),
    ('q_m12_8', 12, 1, 'La instrucción `continue` saltea las líneas restantes de la vuelta actual y salta al inicio de la siguiente iteración.'),
    ('q_m13_1', 13, 1, 'El bucle `for` está diseñado para recorrer secuencias o rangos definidos de elementos uno por uno.'),
    ('q_m13_2', 13, 1, '`range()` genera una secuencia aritmética de números enteros muy utilizada para controlar cuántas veces itera un bucle for.'),
    ('q_m13_3', 13, 1, '`range(3)` inicia por defecto en 0 y se detiene antes de llegar a 3 (el límite superior es excluyente). Genera 0, 1 y 2.'),
    ('q_m13_4', 13, 1, 'Comienza en 2 y termina en el anterior a 6: los números generados son 2, 3, 4 y 5.'),
    ('q_m13_5', 13, 0, 'Inicia en 2 y avanza de 2 en 2 hasta antes de 9: imprime 2, 4, 6 y 8.'),
    ('q_m13_6', 13, 1, '`range(1, 5)` entrega 1, 2, 3 y 4. La sumatoria acumulada es 1 + 2 + 3 + 4 = 10.'),
    ('q_m13_7', 13, 2, 'La palabra "Python" tiene 6 letras. El bucle `for` itera una vez por cada carácter de la cadena, por lo que el contador llega a 6.'),
    ('q_m13_8', 13, 1, 'Con i=0 imprime 0. Con i=1 imprime 1. Con i=2 se activa `i == 2` y ejecuta `break`, saliendo del bucle antes de imprimir el 2.'),
    ('q_m14_1', 14, 1, '`while` significa "mientras". Continúa iterando siempre que la condición sea verdadera; cuando pasa a False, el ciclo termina.'),
    ('q_m14_2', 14, 1, 'A diferencia de otros lenguajes con "do-while", el `while` de Python evalúa la condición al inicio. Si es falsa de entrada, saltea el bucle completamente.'),
    ('q_m14_3', 14, 1, 'c=1 (<4: c pasa a 2). c=2 (<4: c pasa a 3). c=3 (<4: c pasa a 4). c=4 (4 < 4 es False: termina el ciclo). Se imprime 4.'),
    ('q_m14_4', 14, 1, 'Si la variable que controla la condición nunca cambia dentro del cuerpo del bucle, la condición nunca será False y generará un bucle infinito.'),
    ('q_m14_5', 14, 1, '`while` es ideal para repeticiones condicionadas por eventos o entradas donde el número de iteraciones es incierto al inicio.'),
    ('q_m14_6', 14, 1, 'x pasa de 3 a 2, de 2 a 1, y de 1 a 0. Cuando x vale 0, `0 > 0` es False, el bucle finaliza y se imprime 0.'),
    ('q_m14_7', 14, 1, 'n=1: imprime 1. n=2: activa `continue`, salteando el print. n=3: imprime 3. Luego termina. Salida: 13.'),
    ('q_m14_8', 14, 2, 'val=5 (>0: val pasa a 3). val=3 (>0: val pasa a 1). val=1 (>0: val pasa a -1). val=-1 (-1 > 0 es False: termina). Se imprime -1.'),
    ('q_m15_1', 15, 1, 'La integración consiste en articular todas las herramientas básicas aprendidas para construir aplicaciones funcionales y completas.'),
    ('q_m15_2', 15, 0, 'El patrón clásico de menús en consola utiliza `while True` para presentar opciones una y otra vez hasta que una rama condicional ejecuta `break`.'),
    ('q_m15_3', 15, 1, 'En el rango del 1 al 5, los números pares son 2 y 4. La suma acumulada es 2 + 4 = 6.'),
    ('q_m15_4', 15, 1, 'La validación previene fallas del sistema asegurando que los datos coincidan con lo que el algoritmo espera antes de operar sobre ellos.'),
    ('q_m15_5', 15, 1, '`range(3, 8)` genera los valores 3, 4, 5, 6 y 7. Los números impares son 3, 5 y 7. El contador se incrementa 3 veces.'),
    ('q_m15_6', 15, 1, 'La modularidad, legibilidad y el uso de identificadores descriptivos reducen la complejidad cognitiva y facilitan depurar y expandir el software.'),
    ('q_m15_7', 15, 2, '`range(1, 10, 3)` genera los números 1, 4 y 7. El mayor de ellos al finalizar el recorrido es 7.'),
    ('q_m15_8', 15, 1, 'El proceso metodológico de la ingeniería de software inicia siempre con el entendimiento del problema y diseño lógico antes de codificar y probar.')
ON CONFLICT (id) DO UPDATE
SET explanation = EXCLUDED.explanation;

-- 3. Blindaje de seguridad en online_questions_truth
ALTER TABLE public.online_questions_truth ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.online_questions_truth FROM anon, PUBLIC;
GRANT SELECT ON TABLE public.online_questions_truth TO authenticated;

-- Asegurar que la política exclusiva para el docente siga activa
DROP POLICY IF EXISTS "online_questions_truth_teacher_only" ON public.online_questions_truth;
CREATE POLICY "online_questions_truth_teacher_only" ON public.online_questions_truth
    FOR SELECT TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
        OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
    );

-- 4. Actualización de resolve_duel_round:
-- - Si la ronda ya está en 'round_review' (idempotencia / recarga F5), devuelve la solución sin recalcular puntos.
-- - Si está en 'question_active', evalúa puntuaciones (4, 2, 1, 0 pts), pasa a 'round_review' y devuelve la solución.
-- - Restringido 100% al docente autenticado.
CREATE OR REPLACE FUNCTION public.resolve_duel_round(p_match_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_record RECORD;
    v_points INTEGER;
    v_correct_answer INTEGER;
    v_explanation TEXT;
BEGIN
    -- 1. Autorización estricta del docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Acceso denegado: solo el docente autorizado puede resolver la ronda.'
        );
    END IF;

    -- 2. Bloqueo pesimista de fila contra carreras por concurrencia o doble clic
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Partida no encontrada.'
        );
    END IF;

    -- 3. Idempotencia: si ya está en round_review, devolver solución oficial sin recalcular puntos
    IF v_match.status = 'round_review' THEN
        SELECT correct_answer, explanation
        INTO v_correct_answer, v_explanation
        FROM public.online_questions_truth
        WHERE id = v_match.current_question_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'round_review',
            'round_number', v_match.current_round,
            'question_id', v_match.current_question_id,
            'correct_answer', v_correct_answer,
            'explanation', COALESCE(v_explanation, 'Explicación no disponible.'),
            'already_resolved', true
        );
    END IF;

    IF v_match.status <> 'question_active' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La ronda no está activa para resolver (estado actual: ' || v_match.status || ').'
        );
    END IF;

    -- 4. Cálculo y asignación atómica con DENSE_RANK() (Regla oficial 4, 2, 1, 0 pts)
    FOR v_record IN (
        SELECT
            a.id AS answer_id,
            a.team_id,
            a.response_time_ms,
            DENSE_RANK() OVER (
                ORDER BY a.response_time_ms ASC
            ) AS speed_rank
        FROM public.duel_answers a
        WHERE a.match_id = p_match_id
          AND a.round_number = v_match.current_round
          AND a.is_correct = true
    ) LOOP
        IF v_record.speed_rank = 1 THEN
            v_points := 4;
        ELSIF v_record.speed_rank = 2 THEN
            v_points := 2;
        ELSIF v_record.speed_rank = 3 THEN
            v_points := 1;
        ELSE
            v_points := 0;
        END IF;

        UPDATE public.duel_answers
        SET points_awarded = v_points
        WHERE id = v_record.answer_id;

        UPDATE public.duel_teams
        SET
            total_score = total_score + v_points,
            rounds_won = rounds_won + (CASE WHEN v_record.speed_rank = 1 THEN 1 ELSE 0 END),
            total_time_ms = total_time_ms + v_record.response_time_ms
        WHERE id = v_record.team_id;
    END LOOP;

    -- 5. Transición atómica de estado a 'round_review'
    UPDATE public.duel_matches
    SET status = 'round_review'
    WHERE id = p_match_id;

    -- 6. Obtener respuesta correcta y explicación pedagógica oficial
    SELECT correct_answer, explanation
    INTO v_correct_answer, v_explanation
    FROM public.online_questions_truth
    WHERE id = v_match.current_question_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'round_review',
        'round_number', v_match.current_round,
        'question_id', v_match.current_question_id,
        'correct_answer', v_correct_answer,
        'explanation', COALESCE(v_explanation, 'Explicación no disponible.')
    );
END;
$$;

-- 5. Permisos de ejecución de resolve_duel_round
REVOKE ALL ON FUNCTION public.resolve_duel_round(UUID) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_duel_round(UUID) TO authenticated;
