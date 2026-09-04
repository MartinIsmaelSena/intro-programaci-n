export interface FriendlyError {
  title: string;
  message: string;
  tip: string;
}

export function explainPythonError(rawError: string): FriendlyError {
  const errorText = rawError.trim();

  // NameError: name 'x' is not defined
  const nameErrorMatch = errorText.match(/NameError:\s*name\s*['"](.*?)['"]\s*is not defined/i);
  if (nameErrorMatch) {
    const varName = nameErrorMatch[1];
    return {
      title: `❌ Variable o función no encontrada ('${varName}')`,
      message: `Python intentó usar '${varName}', pero no sabe qué es porque aún no fue creada o tiene un error de tipeo.`,
      tip: `Revisá si escribiste bien el nombre (las mayúsculas y minúsculas importan) o si te olvidaste de asignarle un valor antes de usarla, por ejemplo: ${varName} = ...`
    };
  }

  // SyntaxError: invalid syntax / unexpected EOF / unterminated string
  if (errorText.includes('SyntaxError')) {
    if (errorText.includes('EOL while scanning string literal') || errorText.includes('unterminated string literal')) {
      return {
        title: '❌ Texto sin comillas de cierre (SyntaxError)',
        message: 'Abriste unas comillas para escribir un texto pero no las cerraste antes del final de la línea.',
        tip: 'Verificá que cada comilla que abre (simple \' o doble ") tenga su respectiva comilla de cierre al final del texto.'
      };
    }
    if (errorText.includes('unexpected EOF while parsing')) {
      return {
        title: '❌ Código incompleto al final (SyntaxError)',
        message: 'Python llegó al final de tu código y se quedó esperando algo más (un paréntesis, corchete o comilla sin cerrar).',
        tip: 'Revisá que todos tus paréntesis () estén correctamente emparejados y cerrados.'
      };
    }
    return {
      title: '❌ Error de sintaxis (SyntaxError)',
      message: 'Python no comprende una parte de la instrucción escrita porque las reglas del lenguaje no se cumplieron.',
      tip: 'Revisá si te faltaron dos puntos (:) al final de una condición if o bucle for, o si falta cerrar algún paréntesis.'
    };
  }

  // IndentationError
  if (errorText.includes('IndentationError')) {
    return {
      title: '❌ Error de sangría o espacios (IndentationError)',
      message: 'En Python, los bloques de código dentro de un if, for o while deben estar indentados (con 4 espacios hacia la derecha).',
      tip: 'Asegurate de que las líneas que pertenecen al bloque tengan exactamente la misma cantidad de espacios (normalmente 4 espacios o presionar la tecla Tab).'
    };
  }

  // TypeError
  if (errorText.includes('TypeError')) {
    if (errorText.includes('can only concatenate str') || errorText.includes('unsupported operand type')) {
      return {
        title: '❌ Combinación de tipos incompatibles (TypeError)',
        message: 'Intentaste realizar una operación (como sumar + o restar) entre tipos que no combinan directamente, como un texto (str) y un número (int o float).',
        tip: 'Recordá que input() siempre devuelve texto. Si necesitás operar matemáticamente, convertilo con int() o float(). Si querés mostrarlo con print(), podés usar comas: print("Texto", numero).'
      };
    }
    return {
      title: '❌ Error de tipo de datos (TypeError)',
      message: 'Se utilizó una operación o función diseñada para un tipo de dato sobre otro tipo incompatible.',
      tip: 'Verificá los tipos de datos de tus variables usando type(variable) para asegurarte de que contienen lo que esperás.'
    };
  }

  // ValueError
  if (errorText.includes('ValueError')) {
    if (errorText.includes('invalid literal for int()') || errorText.includes('could not convert string to float')) {
      return {
        title: '❌ Valor no numérico en conversión (ValueError)',
        message: 'Intentaste convertir un texto que contiene letras o símbolos en un número entero o decimal.',
        tip: 'int() y float() solo pueden convertir textos compuestos únicamente por dígitos válidos (por ejemplo: int("42")).'
      };
    }
    return {
      title: '❌ Valor no válido (ValueError)',
      message: 'El tipo de dato es el correcto, pero el valor específico proporcionado no es aceptado por la función.',
      tip: 'Revisá los argumentos que estás pasando a la función y asegurate de que tengan el formato esperado.'
    };
  }

  // ZeroDivisionError
  if (errorText.includes('ZeroDivisionError')) {
    return {
      title: '❌ División por cero (ZeroDivisionError)',
      message: 'En matemática y programación no es posible dividir un número por cero (/) ni calcular su resto (%).',
      tip: 'Comprobá que el divisor en tus operaciones matemáticas no sea 0 antes de realizar la división.'
    };
  }

  // IndexError
  if (errorText.includes('IndexError')) {
    return {
      title: '❌ Posición fuera de rango (IndexError)',
      message: 'Intentaste acceder a un elemento en una posición que no existe en la lista o texto.',
      tip: 'Recordá que los índices en Python comienzan en 0. Si un texto tiene 5 letras, las posiciones van de 0 a 4.'
    };
  }

  // Generic fallback
  return {
    title: '⚠️ Aviso de ejecución de Python',
    message: errorText.length > 150 ? errorText.slice(0, 150) + '...' : errorText,
    tip: 'Revisá la línea indicada en el mensaje superior para corregir el comportamiento de tu programa.'
  };
}
