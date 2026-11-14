import { TPCpem69Exercise, TPCpem69ExerciseNumber } from '../types/tpCpem69';

export const TP_CPEM69_ID = 'tp-cpem69-4a';
export const TP_CPEM69_NAME = 'Trabajo Práctico de Programación – 4.º año';
export const TP_CPEM69_COURSE = '4.º año (CPEM N.º 69 / CPEM N.º 29)';
export const TP_CPEM69_DURATION_MINUTES = 90;

export const TP_CPEM69_EXERCISES: Record<TPCpem69ExerciseNumber, TPCpem69Exercise> = {
  3: {
    number: 3,
    title: 'Ejercicio 3 — ¿Tiene permiso para utilizar la computadora?',
    description: 'Analizá el código Python que verifica si una persona cuenta con permiso y la edad mínima requerida.',
    pythonCode: `permiso = False
edad = 15

if permiso and edad >= 13:
    print("Puede utilizar la computadora")
else:
    print("No puede utilizar la computadora")`,
    questions: [
      {
        id: 1,
        prompt: '1. ¿Qué mensaje muestra el programa cuando se ejecuta?',
        expectedConcept: 'Debe identificar que el programa muestra "No puede utilizar la computadora".'
      },
      {
        id: 2,
        prompt: '2. ¿Qué significa el operador and en esta condición?',
        expectedConcept: 'Debe explicar que el operador and exige que ambas condiciones sean verdaderas simultáneamente para que el bloque if se cumpla.'
      },
      {
        id: 3,
        prompt: '3. ¿Qué valor tiene la variable permiso?',
        expectedConcept: 'Debe señalar que la variable permiso tiene el valor booleano False (falso).'
      },
      {
        id: 4,
        prompt: '4. ¿Por qué no alcanza con que la edad sea mayor o igual a 13?',
        expectedConcept: 'Debe explicar que aunque edad >= 13 sea verdadero (15 >= 13), la condición está conectada con and a permiso, y como permiso es False, toda la expresión resulta en False.'
      },
      {
        id: 5,
        prompt: '5. ¿Qué modificación habría que realizar para que el programa permita utilizar la computadora?',
        expectedConcept: 'Debe indicar una solución válida: cambiar permiso = True, o cambiar el operador and por or, o quitar la condición de permiso.'
      }
    ]
  },
  4: {
    number: 4,
    title: 'Ejercicio 4 — ¿Tiene suficientes puntos?',
    description: 'Analizá el código Python que evalúa si un jugador acumuló los puntos necesarios para completar un nivel.',
    pythonCode: `puntos = 75

if puntos >= 100:
    print("Nivel completado")
else:
    print("Todavía faltan puntos")`,
    questions: [
      {
        id: 1,
        prompt: '1. ¿Qué mensaje muestra el programa?',
        expectedConcept: 'Debe responder que muestra "Todavía faltan puntos".'
      },
      {
        id: 2,
        prompt: '2. ¿Por qué no aparece el mensaje "Nivel completado"?',
        expectedConcept: 'Debe explicar que la variable puntos vale 75, valor que no alcanza ni supera los 100 requeridos por la condición (75 >= 100 es False).'
      },
      {
        id: 3,
        prompt: '3. ¿Qué significa el operador >=?',
        expectedConcept: 'Debe indicar que el operador relacional >= significa "mayor o igual que".'
      },
      {
        id: 4,
        prompt: '4. ¿Cuántos puntos le faltan para llegar a 100?',
        expectedConcept: 'Debe calcular la diferencia aritmética: 100 - 75 = 25 puntos.'
      },
      {
        id: 5,
        prompt: '5. ¿Qué valor mínimo debería tener la variable puntos para completar el nivel?',
        expectedConcept: 'Debe responder que el valor mínimo necesario es 100 puntos.'
      }
    ]
  },
  5: {
    number: 5,
    title: 'Ejercicio 5 — ¿Puede ingresar al juego?',
    description: 'Analizá el código Python que verifica el estado de bloqueo y la cantidad de monedas disponibles del jugador.',
    pythonCode: `bloqueado = False
monedas = 10

if not bloqueado and monedas >= 10:
    print("Acceso permitido")
else:
    print("Acceso denegado")`,
    questions: [
      {
        id: 1,
        prompt: '1. ¿Qué mensaje muestra el programa?',
        expectedConcept: 'Debe responder que muestra "Acceso permitido".'
      },
      {
        id: 2,
        prompt: '2. ¿Qué significa not bloqueado?',
        expectedConcept: 'Debe explicar que el operador not invierte o niega el valor booleano: como bloqueado es False, not bloqueado evalúa a True (es decir, el usuario no está bloqueado).'
      },
      {
        id: 3,
        prompt: '3. ¿Por qué se utiliza and en esta condición?',
        expectedConcept: 'Debe explicar que se requiere cumplir dos requisitos obligatorios a la vez: que el usuario no esté bloqueado y que además tenga 10 o más monedas.'
      },
      {
        id: 4,
        prompt: '4. ¿Qué sucedería si la variable bloqueado tuviera el valor True?',
        expectedConcept: 'Debe indicar que not bloqueado pasaría a ser False, por lo que la condición completa sería False y el programa mostraría "Acceso denegado".'
      },
      {
        id: 5,
        prompt: '5. ¿Qué sucedería si el jugador tuviera solamente 5 monedas?',
        expectedConcept: 'Debe indicar que la comparación monedas >= 10 (5 >= 10) sería False, por lo que la condición con and fallaría y mostraría "Acceso denegado".'
      }
    ]
  },
  6: {
    number: 6,
    title: 'Ejercicio 6 — Detectar un error en la condición',
    description: 'Analizá un programa con un error de lógica en la condición de acceso y proponé la corrección.',
    pythonCode: `contrasena_correcta = True

if not contrasena_correcta:
    print("Acceso permitido")
else:
    print("Contraseña incorrecta")`,
    questions: [
      {
        id: 1,
        prompt: '1. ¿Qué mensaje muestra el programa?',
        expectedConcept: 'Debe responder que muestra "Contraseña incorrecta".'
      },
      {
        id: 2,
        prompt: '2. ¿El programa funciona correctamente si queremos permitir el acceso cuando la contraseña es correcta?',
        expectedConcept: 'Debe responder claramente que NO funciona correctamente.'
      },
      {
        id: 3,
        prompt: '3. ¿Por qué?',
        expectedConcept: 'Debe explicar que como contrasena_correcta es True, la expresión not contrasena_correcta se convierte en False, ejecutando la rama del else e impidiendo el acceso a pesar de que la contraseña era correcta.'
      },
      {
        id: 4,
        prompt: '4. ¿Qué problema encontrás en la condición?',
        expectedConcept: 'Debe señalar que el operador not está colocado de forma errónea, invirtiendo la lógica esperada del sistema de autenticación.'
      },
      {
        id: 5,
        prompt: '5. ¿Cómo modificarías el código para que funcione correctamente? Escribí el código corregido.',
        expectedConcept: 'Debe escribir o describir la corrección: cambiar la condición a "if contrasena_correcta:" o invertir los prints de las ramas if y else.'
      }
    ]
  },
  7: {
    number: 7,
    title: 'Ejercicio 7 — Analizar dos condiciones',
    description: 'Analizá el código Python que controla el encendido automático de un ventilador en función de la temperatura.',
    pythonCode: `temperatura = 30
ventilador = False

if temperatura > 25 and not ventilador:
    print("Encender ventilador")
else:
    print("No es necesario encenderlo")`,
    questions: [
      {
        id: 1,
        prompt: '1. ¿Qué mensaje muestra el programa?',
        expectedConcept: 'Debe responder que muestra "Encender ventilador".'
      },
      {
        id: 2,
        prompt: '2. ¿Qué significa la condición temperatura > 25?',
        expectedConcept: 'Debe explicar que comprueba si el valor numérico de la variable temperatura supera estrictamente los 25 grados.'
      },
      {
        id: 3,
        prompt: '3. ¿Qué significa not ventilador?',
        expectedConcept: 'Debe explicar que verifica que el ventilador no esté encendido (como ventilador es False, not ventilador es True, indicando que actualmente está apagado).'
      },
      {
        id: 4,
        prompt: '4. ¿Qué sucedería si la variable ventilador tuviera el valor True?',
        expectedConcept: 'Debe indicar que not ventilador sería False, la condición no se cumpliría y el programa mostraría "No es necesario encenderlo" (porque ya estaría encendido).'
      },
      {
        id: 5,
        prompt: '5. ¿Qué sucedería si la temperatura fuera de 20 grados?',
        expectedConcept: 'Debe indicar que la comparación temperatura > 25 (20 > 25) sería False, por lo que la condición con and no se cumpliría y mostraría "No es necesario encenderlo".'
      }
    ]
  }
};

export function getTPCpem69Exercise(number: TPCpem69ExerciseNumber): TPCpem69Exercise {
  const ex = TP_CPEM69_EXERCISES[number];
  if (!ex) {
    throw new Error(`Ejercicio ${number} no válido para el TP CPEM 69. Los ejercicios válidos son 3, 4, 5, 6 y 7.`);
  }
  return ex;
}

export function getAllTPCpem69Exercises(): TPCpem69Exercise[] {
  return [
    TP_CPEM69_EXERCISES[3],
    TP_CPEM69_EXERCISES[4],
    TP_CPEM69_EXERCISES[5],
    TP_CPEM69_EXERCISES[6],
    TP_CPEM69_EXERCISES[7]
  ];
}
