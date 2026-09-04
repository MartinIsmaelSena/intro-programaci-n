# 🐍 Python desde Cero — Plataforma Web Educativa Interactiva

Plataforma web educativa, profesional, moderna e interactiva para aprender programación en Python desde cero. Diseñada especialmente para personas que tienen poco o ningún conocimiento previo, guiándolas paso a paso desde el concepto fundamental de qué es programar hasta la construcción de programas reales que combinan variables, tipos de datos, operadores, entrada/salida, condicionales y bucles.

---

## 🌟 Características Principales

1. **14 Módulos Educativos Secuenciales:**
   - Módulo 1: Introducción a la programación (analogía de preparar mate y pensamiento algorítmico).
   - Módulo 2: ¿Qué es Python? (historia, Guido van Rossum, filosofía y campos de aplicación en IA, Web, Ciberseguridad y Datos).
   - Módulo 3: Variables (la caja etiquetada en memoria, reglas de nombrado y convención `snake_case`).
   - Módulo 4: Tipos de datos (`str`, `int`, `float`, `bool` y la función `type()`).
   - Módulo 5: Operadores aritméticos (`+`, `-`, `*`, `/`, `//`, `%`, `**`, problemas cotidianos y descuentos).
   - Módulo 6: Operadores de comparación (`==`, `!=`, `>`, `<`, `>=`, `<=`).
   - Módulo 7: Operadores lógicos (`and`, `or`, `not`, analogías de acceso y control).
   - Módulo 8: La función `print()` (texto, números, separación con comas y f-strings modernas).
   - Módulo 9: La función `input()` (lectura de datos por teclado y conversión con `int()` y `float()`).
   - Módulo 10: Introducción a los condicionales (`if`, `elif`, `else` y toma de decisiones).
   - Módulo 11: Introducción a los Loops (concepto de repetición automatizada y principio DRY).
   - Módulo 12: Bucle `for` (iteración con `range()` de 1, 2 y 3 parámetros, conteos y tablas).
   - Módulo 13: Bucle `while` (repetición condicionada, operadores `+=`, prevención de bucles infinitos y `break`).
   - Módulo 14: Integración y resolución de problemas (promedios, login, tablas, juego de adivinanza, cajero ATM y calculadora).

2. **Ejecución Real de Python en el Navegador:**
   - Integración con **Pyodide** (WebAssembly), ejecutando Python de forma 100% segura en el cliente (0 llamadas a servidores externos para correr código).
   - Captura de salida en vivo (`stdout`), soporte interactivo de `input()` y motor de evaluación de respaldo.
   - **Explicador Pedagógico de Errores en Español:** Convierte excepciones técnicas como `NameError`, `SyntaxError`, `IndentationError`, `TypeError`, `ValueError` y `ZeroDivisionError` en explicaciones claras, amables y constructivas con consejos para resolverlas.

3. **Gamificación Integral:**
   - **Sistema de Puntos XP:** Ganancia de experiencia por quizzes acertados (+10 XP), ejercicios resueltos (+20 a +50 XP), desafíos opcionales (+100 XP) y finalización de módulos (+100 XP).
   - **5 Rangos de Maestría:**
     - 🌱 *Nivel 1: Explorador*
     - 🔎 *Nivel 2: Aprendiz*
     - 💻 *Nivel 3: Programador Inicial*
     - 🧠 *Nivel 4: Pensador Computacional*
     - 🐍 *Nivel 5: Pythonista*
   - **Galería de Insignias:** 14 insignias desbloqueables con animación de celebración y confetti.
   - **Rachas de Días Activos:** Seguimiento de constancia diaria.

4. **Sistema de Exámenes Modulares por Bloques:**
   - **Ciclo Pedagógico:** Aprender ➔ Practicar ➔ Evaluar ➔ Continuar aprendiendo.
   - **5 Modelos de Examen (40 min c/u):**
     - Modelo 1: Módulos 1, 2 y 3.
     - Modelo 2: Módulos 4, 5 y 6.
     - Modelo 3: Módulos 7, 8 y 9.
     - Modelo 4: Módulos 10, 11 y 12.
     - Modelo 5: Módulos 13 y 14.
   - **5 Partes Evaluadas por Examen:** Parte A (Teoría), Parte B (Interpretación de código / Tracing), Parte C (Corrección de errores / Debugging), Parte D (Programación práctica) y Parte E (Problema integrador).
   - **Límites conceptuales estrictos:** Cada examen evalúa únicamente los conceptos de su bloque.
   - **Disponibilidad configurable:** Estado inicial 🔒 Próximamente con Modo Profesor para habilitación individual.
   - Arquitectura extensible preparada para el futuro Examen Final.

5. **Herramientas de Aprendizaje:**
   - **Quizzes con Retroalimentación Formativa:** Pistas inmediatas en caso de error y reintentos.
   - **Laboratorio con Pistas Progresivas:** 3 niveles de pistas paso a paso antes de revelar la solución sugerida.
   - **Validador Automático de Pruebas:** Evalúa si el programa cumple los requisitos sin exigir igualdad textual estricta de código.
   - **🗺️ Mi Camino en Python:** Vista de mapa secuencial interactivo con estados (Completado, En progreso, Bloqueado).
   - **🔄 Centro de Repaso:** Acceso rápido a preguntas falladas y ejercicios previos para afianzar conceptos.
   - **🌐 Sobre Python:** Enlaces a recursos 100% oficiales (python.org, documentación y comunidad).

5. **Diseño y Accesibilidad:**
   - Modo Claro ☀️ y Modo Oscuro 🌙 con persistencia en `localStorage`.
   - 100% Responsive: adaptable a computadoras de escritorio, notebooks, tablets y dispositivos móviles con menú drawer.
   - Sin necesidad de registro en v1: onboarding instantáneo que recuerda el nombre del estudiante.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Estilos:** Tailwind CSS con configuración temática personalizada
- **Iconos:** Lucide React
- **Efectos:** Canvas Confetti
- **Motor Python:** Pyodide (CPython WebAssembly) + Intérprete Pedagógico en Cliente

---

## 📁 Estructura del Proyecto

```text
proyecto-web-python/
├── index.html                   # Entrada HTML con fuentes Inter y JetBrains Mono
├── package.json                 # Dependencias y scripts
├── tailwind.config.js           # Paleta de colores temáticos de Python y modo oscuro
├── tsconfig.json                # Configuración TypeScript
├── src/
│   ├── main.tsx                 # Punto de montaje React
│   ├── App.tsx                  # Enrutador principal de vistas y modales globales
│   ├── index.css                # Directivas Tailwind y estilos de scrollbar
│   ├── types/
│   │   └── course.ts            # Interfaces de módulos, quizzes, ejercicios, insignias y progreso
│   ├── data/
│   │   ├── badges.ts            # Definición de las 14 insignias y niveles de usuario
│   │   ├── modulesList.ts       # Índice maestro y utilidades de desbloqueo
│   │   └── modules/             # Los 14 módulos educativos con contenidos completos
│   │       ├── module01_intro.ts
│   │       ├── module02_python.ts
│   │       ├── module03_variables.ts
│   │       ├── module04_types.ts
│   │       ├── module05_arithmetic.ts
│   │       ├── module06_comparison.ts
│   │       ├── module07_logical.ts
│   │       ├── module08_print.ts
│   │       ├── module09_input.ts
│   │       ├── module10_conditionals.ts
│   │       ├── module11_loops_intro.ts
│   │       ├── module12_for.ts
│   │       ├── module13_while.ts
│   │       └── module14_integration.ts
│   ├── services/
│   │   ├── pythonRunner.ts      # Ejecución de Python en navegador con captura stdout e input()
│   │   ├── errorExplainer.ts    # Traductor pedagógico de excepciones de Python a español
│   │   ├── testValidator.ts     # Validador de casos de prueba para ejercicios de código
│   │   └── storageService.ts    # Persistencia en localStorage y evaluación de insignias
│   ├── context/
│   │   └── ProgressContext.tsx  # Estado global de usuario, XP, niveles y modales
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx       # Barra superior con XP, racha, nivel y toggle oscuro/claro
│       │   └── Sidebar.tsx      # Navegación principal y tarjeta de usuario
│       ├── onboarding/
│       │   └── WelcomeModal.tsx # Pantalla inicial para ingresar nombre de usuario
│       ├── dashboard/
│       │   └── DashboardView.tsx# Panel principal con estadísticas, hero y siguiente lección
│       ├── roadmap/
│       │   └── RoadmapView.tsx  # Vista de línea de tiempo 'Mi camino en Python'
│       ├── courses/
│       │   └── CoursesView.tsx  # Catálogo filtrable por categorías
│       ├── module/
│       │   ├── ModuleDetailView.tsx # Vista unificada con pestañas de lección
│       │   ├── TheorySection.tsx    # Tarjetas de teoría, analogías y código
│       │   ├── QuizSection.tsx      # Quizzes interactivos con feedback formativo
│       │   ├── ExerciseSection.tsx  # Laboratorio de código con validación
│       │   ├── ChallengeSection.tsx # Desafíos opcionales avanzados
│       │   └── ModuleSummaryModal.tsx# Pantalla de felicitación y balance del módulo
│       ├── editor/
│       │   ├── PythonEditor.tsx     # Editor de código con numeración de líneas y atajos
│       │   ├── InteractiveConsole.tsx # Terminal interactiva con explicador de errores
│       │   ├── HintSystem.tsx       # Sistema progresivo de pistas (3 niveles)
│       │   └── TestResultsCard.tsx  # Resultados de tests unitarios
│       ├── badges/
│       │   └── BadgesView.tsx   # Galería y modal de detalles de insignias
│       ├── progress/
│       │   └── ProgressView.tsx # Métricas de aprendizaje y desglose por módulo
│       ├── review/
│       │   └── ReviewView.tsx   # Centro de repaso de preguntas falladas
│       ├── resources/
│       │   └── ResourcesView.tsx# Enlaces oficiales a Python.org y documentación
│       ├── settings/
│       │   └── SettingsModal.tsx# Modal de configuración de nombre, tema y reseteo
│       └── common/
│           └── CelebrationModal.tsx # Animación emergente al desbloquear insignias
```

---

## 🚀 Requisitos Previos

- **Node.js:** Versión 18 o superior instalada (verificar con `node -v`).
- **Navegador web moderno:** Chrome, Edge, Firefox, Safari u Opera con soporte WebAssembly.

---

## 💻 Instalación y Ejecución

### 1. Clonar o acceder a la carpeta del proyecto
```bash
cd proyecto-web-python
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo local
```bash
npm run dev
```

Abre tu navegador en la URL indicada por Vite (por lo general `http://localhost:5173`).

### 4. Compilar para producción
```bash
npm run build
```
Los archivos optimizados y listos para desplegar se generarán en la carpeta `dist/`.

---

## 🎯 Decisiones de Diseño y Arquitectura

1. **Seguridad y Privacidad:** Todo el código escrito por el estudiante se ejecuta directamente en su navegador mediante Pyodide / WebAssembly. No se envía código arbitrario a ningún servidor backend, garantizando seguridad absoluta y costo cero de infraestructura de cómputo.
2. **Pedagogía antes que frustración:** Los errores de Python son traducidos a lenguaje cotidiano para que el alumno entienda *por qué* ocurrió el problema y *cómo* resolverlo, en lugar de recibir un traceback árido.
3. **Persistencia desacoplada:** La arquitectura actual utiliza un servicio unificado en `src/services/storageService.ts`. Cuando se desee añadir una base de datos en la nube (PostgreSQL, Supabase, Firebase) y autenticación con contraseñas, bastará con actualizar ese servicio sin alterar los componentes visuales.
4. **Validación semántica y flexible:** Las pruebas de los ejercicios evalúan el resultado esperado y patrones de salida en consola, permitiendo que el alumno use diferentes nombres de variables intermedias o estilos propios de código.
