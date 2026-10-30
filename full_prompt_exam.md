<USER_REQUEST>
# IMPLEMENTACIÓN DE UN NUEVO EXAMEN DE PROGRAMACIÓN – DURACIÓN 40 MINUTOS

Necesito incorporar un nuevo examen dentro de la sección **Exámenes** de la plataforma educativa.

Antes de modificar archivos, analizá cómo está construida actualmente la sección Exámenes, cómo se generan las evaluaciones, cómo se guardan las respuestas y cómo se calcula la calificación.

Quiero que implementes el examen respetando la arquitectura, los componentes, los estilos y los mecanismos de persistencia que ya utiliza el proyecto.

## 1. Características generales del examen

- Nombre: Examen de Programación – Variables, operaciones y lógica.
- Duración: 40 minutos.
- Cantidad total: exactamente 20 actividades.
- Modalidad: individual.
- Tipo de actividades:
  - 15 preguntas de opción múltiple.
  - 5 ejercicios de construcción de código.
- Cada estudiante debe recibir las mismas 20 actividades, pero presentadas en un orden aleatorio diferente.
- No se deben repetir preguntas dentro de una misma evaluación.
- El orden debe quedar fijado al comenzar el examen. Si el estudiante actualiza la página o vuelve a ingresar, debe conservar el mismo orden y las respuestas registradas.
- No generar preguntas nuevas mediante IA en tiempo real. Utilizar el banco de preguntas definido en este documento.

## 2. Preguntas de opción múltiple

Implementar las siguientes 15 preguntas.

### Pregunta 1 – Análisis de variables y operaciones

Analizá la ejecución del siguiente código:

```python
a = 2
b = 4
c = a + b * 2
a = c - a
print(a, b, c)
```

¿Qué resultado se muestra en pantalla?

A. `10 4 8`

B. `8 4 10`

C. `6 4 10`

D. `8 2 10`

Respuesta correcta: B.

Explicación: Primero se realiza la multiplicación `4 * 2`, luego se suma 2. Por lo tanto, `c = 10`. Después, `a = 10 - 2`, por lo que vale 8.

### Pregunta 2 – Actualización de una variable

Observá el código:

```python
cuenta = 100
cuenta = cuenta - 30
cuenta = cuenta + 15
print("Total:", cuenta)
```

¿Qué resultado aparece?

A. `Total: 100`

B. `Total: 85`

C. `Total: 115`

D. `Total: 145`

Respuesta correcta: B.

Explicación: La variable comienza en 100, luego se resta 30 y finalmente se suman 15. El resultado es 85.

### Pregunta 3 – Copia del valor de una variable

Revisá el siguiente código:

```python
p = 5
q = p
p = p + 2
print(q)
```

¿Qué valor se imprime?

A. 5

B. 7

C. 2

D. 10

Respuesta correcta: A.

Explicación: Cuando se ejecuta `q = p`, la variable q recibe el valor 5. Modificar posteriormente p no modifica q.

### Pregunta 4 – Operadores lógicos

¿Cuál de las siguientes expresiones da como resultado `True`?

A. `not (4 + 2 == 6)`

B. `7 > 3 and not (2 > 4)`

C. `10 >= 20 and 5 == 5`

D. `5 != 5 or 3 > 8`

Respuesta correcta: B.

Explicación: `7 > 3` es verdadero y `2 > 4` es falso. Al aplicar `not`, se convierte en verdadero. Ambas condiciones son verdaderas.

### Pregunta 5 – Análisis de operaciones

Analizá el siguiente bloque:

```python
x = 10
y = 3
x = x + y
y = x - y
print(y)
```

¿Cuál es el valor impreso?

A. 3

B. 10

C. 13

D. 7

Respuesta correcta: B.

Explicación: Primero x pasa a valer 13. Después y recibe el resultado de 13 - 3, es decir, 10.

### Pregunta 6 – Concepto de variable

¿Qué es una variable en programación?

A. Una instrucción que permite mostrar mensajes en pantalla.

B. Un espacio donde podemos guardar un dato para utilizarlo durante un programa.

C. Un símbolo que siempre representa una operación matemática.

D. Una función que permite cerrar un programa.

Respuesta correcta: B.

Explicación: Una variable permite almacenar un valor, como un número o un texto, para utilizarlo posteriormente.

### Pregunta 7 – Función print()

¿Para qué se utiliza principalmente `print()` en Python?

A. Para ingresar información desde el teclado.

B. Para guardar datos en una variable.

C. Para mostrar información en pantalla.

D. Para convertir un texto en número.

Respuesta correcta: C.

### Pregunta 8 – Función input()

¿Qué permite hacer la función `input()`?

A. Mostrar el resultado de una multiplicación.

B. Solicitar información al usuario mediante el teclado.

C. Convertir automáticamente cualquier dato en entero.

D. Eliminar el contenido de una variable.

Respuesta correcta: B.

### Pregunta 9 – Conversión a entero

¿Qué función utilizamos para convertir un dato a un número entero?

A. `print()`

B. `input()`

C. `int()`

D. `str()`

Respuesta correcta: C.

### Pregunta 10 – Orden de ejecución

¿Qué sucede cuando ejecutamos estas instrucciones?

```python
numero = 8
numero = numero + 5
print(numero)
```

A. Se imprime 8.

B. Se imprime 5.

C. Se imprime 13.

D. Se produce un error.

Respuesta correcta: C.

### Pregunta 11 – Operaciones matemáticas

Si tenemos:

```python
a = 6
b = 3
resultado = a * b
print(resultado)
```

¿Qué muestra el programa?

A. 9

B. 18

C. 3

D. 63

Respuesta correcta: B.

### Pregunta 12 – Comparaciones

¿Qué resultado devuelve la expresión?

```python
10 > 5
```

A. `False`

B. `True`

C. 10

D. 5

Respuesta correcta: B.

### Pregunta 13 – Operador AND

¿Cuándo devuelve `True` el operador lógico `and`?

A. Cuando al menos una condición es verdadera.

B. Cuando todas las condiciones son verdaderas.

C. Cuando todas las condiciones son falsas.

D. Siempre devuelve `True`.

Respuesta correcta: B.

### Pregunta 14 – Operador NOT

¿Qué resultado devuelve esta expresión?

```python
not (5 > 2)
```

A. `True`

B. `False`

C. 5

D. 2

Respuesta correcta: B.

### Pregunta 15 – Salto de línea

¿Para qué se utiliza `\n` dentro de un texto en Python?

A. Para multiplicar dos números.

B. Para crear un salto de línea.

C. Para convertir un texto en entero.

D. Para guardar una variable.

Respuesta correcta: B.

## 3. Ejercicios de construcción de código

Estas cinco actividades no deben ser preguntas de opción múltiple. El estudiante debe escribir código Python.

IMPORTANTE: Los alumnos solamente trabajaron con:
- Variables.
- `print()`.
- `input()`.
- `int()`.
- Operaciones matemáticas básicas.
- Operadores lógicos.
- Saltos de línea `\n`.

No incorporar estructuras que todavía no estudiaron, como `if`, `for`, `while`, funciones definidas por el usuario, listas, ni conceptos avanzados.

### Pregunta 16 – Construcción de un programa: el doble de un número

Consigna:

Construí un programa en Python que solicite al usuario ingresar un número entero y muestre su doble.

Ejemplo de funcionamiento:

```text
Ingresá un número: 8
El doble es: 16
```

Solución esperada:

```python
numero = int(input("Ingresá un número: "))
doble = numero * 2
print("El doble es:", doble)
```

Criterios de corrección:
- Solicita un número utilizando `input()`.
- Convierte el dato utilizando `int()`.
- Guarda el resultado en una variable.
- Multiplica el número por 2.
- Muestra correctamente el resultado con `print()`.

### Pregunta 17 – Construcción de un programa: perímetro de un rectángulo

Consigna:

Construí un programa que solicite al usuario ingresar la base y la altura de un rectángulo y calcule su perímetro.

Utilizá la siguiente fórmula:

**Perímetro = 2 × (base + altura)**

Ejemplo:

```text
Ingresá la base: 5
Ingresá la altura: 3
El perímetro es: 16
```

Solución esperada:

```python
base = int(input("Ingresá la base: "))
altura = int(input("Ingresá la altura: "))
perimetro = 2 * (base + altura)
print("El perímetro es:", perimetro)
```

Criterios de corrección:
- Solicita ambos valores.
- Convierte ambos datos a enteros.
- Utiliza correctamente la fórmula.
- Guarda el resultado en una variable.
- Muestra el perímetro.

### Pregunta 18 – Construcción de un programa: suma de dos números

Consigna:

Escribí un programa que solicite dos números enteros, los sume y muestre el resultado.

Ejemplo:

```text
Ingresá el primer número: 12
Ingresá el segundo número: 8
La suma es: 20
```

Solución esperada:

```python
numero1 = int(input("Ingresá el primer número: "))
numero2 = int(input("Ingresá el segundo número: "))
suma = numero1 + numero2
print("La suma es:", suma)
```

### Pregunta 19 – Construcción de un programa: presentación personal

Consigna:

Construí un programa que solicite al usuario su nombre y su edad. Luego debe mostrar un mensaje que incluya ambos datos, utilizando `\n` para separar las líneas.

Ejemplo:

```text
Ingresá tu nombre: Martín
Ingresá tu edad: 20

Datos ingresados:
Nombre: Martín
Edad: 20
```

Solución esperada:

```python
nombre = input("Ingresá tu nombre: ")
edad = int(input("Ingresá tu edad: "))
print("Datos ingresados:\nNombre:", nombre, "\nEdad:", edad)
```

### Pregunta 20 – Construcción de un programa: cálculo del total

Consigna:

Una persona compra dos productos. Construí un programa que solicite el precio entero de cada producto, calcule el total y muestre cuánto debe pagar.

Ejemplo:

```text
Precio del primer producto: 150
Precio del segundo producto: 250
Total a pagar: 400
```

Solución esperada:

```python
producto1 = int(input("Precio del primer producto: "))
producto2 = int(input("Precio del segundo producto: "))
total = producto1 + producto2
print("Total a pagar:", total)
```

## 4. Corrección de los ejercicios de código

Los ejercicios de construcción de código deben tener una evaluación que considere el funcionamiento y no solamente la coincidencia exacta con la solución propuesta.

Si el proyecto ya dispone de Pyodide u otro entorno de ejecución Python, reutilizarlo para evaluar los programas.

La corrección debe considerar:
- Uso correcto de `input()` cuando corresponda.
- Conversión a entero con `int()`.
- Declaración y utilización de variables.
- Operaciones matemáticas correctas.
- Resultado esperado.
- Uso correcto de `print()`.

No penalizar diferencias en los nombres de las variables, textos de los mensajes o espacios si el programa cumple correctamente la consigna.

Si el entorno actual no permite ejecutar y corregir código de forma segura, no simular una corrección automática. En ese caso, implementar una modalidad de respuesta de código con criterios de evaluación y revisión docente, conservando la respuesta del estudiante.

## 5. Aleatorización de las evaluaciones

Este requisito es fundamental.

Cada vez que un estudiante inicia un examen nuevo:
1. Seleccionar las 20 actividades del banco definido.
2. Mezclar aleatoriamente el orden de las 20 actividades.
3. Presentar las preguntas en ese nuevo orden.
4. Mantener cada consigna, opciones, solución y criterios de corrección vinculados a su identificador original.
5. No modificar la respuesta correcta ni los criterios de evaluación al mezclar.

Todos los estudiantes deben recibir las mismas 20 actividades, pero en distinto orden.

También se puede mezclar el orden de las opciones de las preguntas multiple choice, siempre que se actualice correctamente el índice de la respuesta correcta.

IMPORTANTE:
- No mezclar el orden en cada renderizado.
- No volver a mezclar si el estudiante actualiza la página.
- Guardar el orden asignado al iniciar el examen.
- Una nueva evaluación debe generar un orden nuevo.
- Evitar que la aleatorización provoque duplicados.

## 6. Temporizador y finalización

- Configurar una duración exacta de 40 minutos.
- El temporizador debe comenzar al iniciar el examen.
- Debe continuar correctamente aunque el estudiante actualice la página.
- Al llegar a cero, finalizar el examen y guardar las respuestas disponibles.
- Mostrar claramente el tiempo restante.
- Advertir al estudiante antes de finalizar cuando corresponda.

## 7. Interfaz y experiencia del estudiante

Mantener el diseño visual actual de la plataforma.

La experiencia debe ser clara y sencilla:
- Mostrar nombre del examen.
- Mostrar duración: 40 minutos.
- Mostrar progreso: por ejemplo, Actividad 4 de 20.
- Diferenciar visualmente las preguntas de opción múltiple de los ejercicios de código.
- Incorporar un editor o área de texto cómoda para escribir Python.
- Permitir navegar entre actividades sin perder respuestas.
- Mostrar una confirmación antes de entregar el examen.
- No mostrar las respuestas correctas antes de finalizar.

## 8. Calificación

Configurar una escala de 10 puntos.

Propuesta de ponderación:
- 15 preguntas de opción múltiple: 0,4 puntos cada una = 6 puntos.
- 5 ejercicios de construcción de código: 0,8 puntos cada uno = 4 puntos.

Total: 10 puntos.

Si la corrección automática de código no es viable con la arquitectura actual, conservar la ponderación y establecer claramente qué parte requiere revisión docente.

## 9. Integración con la plataforma

Revisar y reutilizar los mecanismos actuales de:
- Registro de estudiantes.
- Identificación del examen.
- Guardado de respuestas.
- Registro de calificación.
- Historial de intentos.
- Panel docente.
- Visualización de resultados.

No crear una segunda implementación innecesaria si ya existe una estructura reutilizable.

No modificar tablas, políticas RLS, autenticación ni servicios existentes sin justificarlo y documentarlo.

## 10. Verificación obligatoria

Antes de finalizar:
1. Comprobar que existen exactamente 20 actividades.
2. Comprobar que hay 15 preguntas multiple choice y 5 de construcción de código.
3. Verificar las respuestas correctas de las 15 preguntas.
4. Probar las cinco consignas de código con los ejemplos indicados.
5. Comprobar que cada nueva evaluación genera un orden aleatorio diferente cuando corresponda.
6. Verificar que no se repitan actividades.
7. Verificar que el orden y las respuestas se conserven al actualizar la página.
8. Comprobar el temporizador de 40 minutos.
9. Verificar el guardado y la calificación.
10. Ejecutar `npm run build`.

## 11. Restricciones de implementación

- No eliminar exámenes existentes.
- No modificar otras secciones de la plataforma.
- No cambiar el contenido de los módulos de aprendizaje.
- No incorporar temas que los estudiantes todavía no estudiaron.
- No alterar la integración actual con Supabase ni el envío de resultados.
- No realizar `git commit`, `git push` ni despliegues.
- Trabajar únicamente en el entorno local.

Al finalizar, entregame un informe detallado que indique:
- Archivos creados y modificados.
- Cómo se implementó la aleatorización.
- Cómo se guardan las respuestas y el orden.
- Cómo se corrigen los ejercicios de código.
- Cómo se calcula la nota.
- Qué pruebas se ejecutaron y cuáles fueron sus resultados.
- Si quedó alguna limitación pendiente.

No des por implementado ningún requisito que no hayas verificado realmente.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-30T11:36:12-03:00.
</ADDITIONAL_METADATA>