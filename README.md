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

---

## ⚔️ Desafíos en Línea — Fase 1

Nueva funcionalidad interactiva, competitiva y gamificada que permite a los estudiantes enfrentarse en duelos 1v1 en tiempo real para poner a prueba sus conocimientos de programación en Python.

### 🌟 Cómo funciona
1. **Identificación obligatoria:** El alumno ingresa Nombre, Apellido y Colegio antes de acceder a la arena (sin solicitar DNI, email, teléfono ni contraseñas, protegiendo su privacidad).
2. **Sala de Jugadores:** Se visualizan los contrincantes con su estado en vivo (🟢 Disponible, 🟡 Jugando, 🔴 Desconectado). Solo los jugadores disponibles pueden ser desafiados.
3. **Sistema de Apuestas en XP:** El alumno selecciona una apuesta predeterminada (🪙 10, 25, 50 o 100 XP), validada contra su XP real disponible. La apuesta **solo se descuenta** si el contrincante acepta y comienza la partida.
4. **Invitación y Cuenta Regresiva:** Al ser aceptado el desafío, se presenta una cuenta regresiva animada `3... 2... 1... ⚔️ ¡COMIENZA EL DESAFÍO!`.
5. **Partida 1v1:** Ambos jugadores reciben exactamente las mismas 10 preguntas en el mismo orden.
6. **Sistema de Puntuación:**
   - Respuesta correcta: **+100 puntos base**.
   - Bonus de velocidad: **entre 0 y 50 puntos** según el tiempo de respuesta.
   - Respuesta incorrecta: **0 puntos**.
   - **Regla estricta de aciertos:** Quien acierta más preguntas siempre gana (ej: 9 aciertos supera a 8 aciertos sin importar la velocidad).
7. **Empate Técnico:** Si empatan en aciertos, puntaje y tiempo, el resultado es 🤝 Empate y se reintegra el 100% del XP apostado a ambos jugadores.
8. **Chat Seguro con Frases Predeterminadas:** No se permite texto libre. Los estudiantes solo pueden enviar reacciones y mensajes predefinidos educativos (ej: *😎 ¡Vamos!*, *🔥 ¡Buenísima!*, *🧠 Buena respuesta*) y emojis rápidos.
9. **Feedback Educativo al Finalizar:** Al terminar las 10 preguntas se exhibe el podio, el pozo de XP y la sección didáctica de **Información de Errores**, mostrando qué opción eligió el alumno, cuál era la correcta y la explicación formativa.

---

### 📂 Ubicación de Componentes y Configuración

| Componente / Regla | Archivo de Código | Descripción |
| :--- | :--- | :--- |
| **Jugadores Simulados** | [`src/data/onlinePlayers.ts`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/data/onlinePlayers.ts) | Capa desacoplada con 7 rivales simulados, avatares, estadísticas, precisión y personalidades. |
| **Banco de Preguntas** | [`src/data/onlineQuestions.ts`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/data/onlineQuestions.ts) | 36+ preguntas distribuidas de los módulos 1 al 9 (estrictamente hasta `input()`, sin bucles ni condicionales). |
| **Lógica y Servicios** | [`src/services/onlineChallengesService.ts`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/services/onlineChallengesService.ts) | Gestión de partidas, desempates, estadísticas, historial, rankings y simulación del bot. |
| **Límite de 3 Partidas** | [`src/services/onlineChallengesService.ts`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/services/onlineChallengesService.ts) | Bloquea un cuarto enfrentamiento consecutivo contra el mismo rival en el mismo día utilizando fechas reales ISO (`YYYY-MM-DD`). |
| **Insignias de Racha** | [`src/data/badges.ts`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/data/badges.ts) | 🏆 **Racha de 3** (`online_streak_3`), 🔥 **Imparable** (`online_streak_5`) y 👑 **Maestro del desafío** (`online_streak_10`). |
| **Integración de XP** | [`src/context/ProgressContext.tsx`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/context/ProgressContext.tsx) | Utiliza el mismo `progress.xp` acumulado en el curso para debitar y acreditar apuestas. |
| **Rankings** | [`src/components/onlineChallenges/OnlineRankingView.tsx`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/components/onlineChallenges/OnlineRankingView.tsx) | Rankings independientes: 👑 Campeón de la semana (por victorias) y 🪙 Mayor XP ganado, con filtros temporales. |
| **Historial de Duelos** | [`src/components/onlineChallenges/OnlineHistoryView.tsx`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/src/components/onlineChallenges/OnlineHistoryView.tsx) | Tabla detallada con rival, resultado, puntaje, delta de XP y fecha relativa. |

---

### 🤖 Qué es simulado en Fase 1
- **Lista de Jugadores:** Simulados en memoria mediante `MOCK_ONLINE_PLAYERS`.
- **Aceptación / Rechazo:** Simulación con tiempo de red (incluye selector en modal para forzar aceptación o rechazo en pruebas).
- **Respuestas en Tiempo Real del Rival:** Simulación probabilística basada en la tasa de acierto del perfil y su tiempo medio de respuesta, enviando también reacciones en el chat.

---

---

## ⚔️ Desafíos en Línea — Fase 2: Sistema Realtime con Supabase

En la **FASE 2**, los Desafíos en Línea se convierten en un sistema **multijugador real en tiempo real**. Dos alumnos conectados desde dispositivos, pestañas o navegadores diferentes pueden:
1. Verse en la sala de espera en vivo mediante presencia en tiempo real.
2. Enviarse invitaciones de desafío 1v1 con apuesta de XP.
3. Recibir las notificaciones entrantes al instante con un temporizador de respuesta de 60 segundos.
4. Comenzar la partida en simultáneo con una cuenta regresiva sincronizada (3, 2, 1).
5. Responder exactamente las mismas 10 preguntas generadas de forma determinista por partida.
6. Ver en vivo cuándo responde el rival, sus aciertos, puntuación y mensajes predeterminados del chat.
7. Liquidar las apuestas y estadísticas de forma 100% idempotente en la base de datos PostgreSQL.
8. Manejar desconexiones con reconexión de 30 segundos y victoria por abandono.

---

### 🌐 Arquitectura Dual (Realtime Supabase + Modo Demo Automático)

La aplicación implementa un patrón desacoplado y tolerante a fallos:
- **Modo Supabase Activo (`VITE_ONLINE_MODE=supabase`):** Se conecta a Supabase Realtime (Presence & Postgres Changes). Los alumnos reales se identifican con una sesión anónima persistente (`session_id`) generada automáticamente en `localStorage`.
- **Fallback Automático a Modo Demo / Práctica:** Si las credenciales de Supabase no están configuradas o el servicio no está disponible, la plataforma continúa funcionando transparentemente en modo local (Fase 1) sin errores ni pantallas en blanco.
- **Sala Mixta:** Si hay estudiantes reales conectados, se muestran primeros con la insignia `🟢 En vivo`. Además, siempre están disponibles los estudiantes de práctica para que un alumno nunca encuentre la sala vacía.

---

### 🗄️ Esquema de Base de Datos (PostgreSQL en Supabase)

El script SQL completo se encuentra en:
📁 [`supabase/migrations/20260904_phase2_online_challenges.sql`](file:///c:/Users/Ismae/Downloads/proyecto-web-python/supabase/migrations/20260904_phase2_online_challenges.sql)

#### 1. Tablas Principales:
- `public.online_players`: Perfil público de cada estudiante (nombre, apellido, colegio, curso, avatar, XP, victorias, derrotas, racha, estado `available` / `playing` / `offline` y marca de tiempo `last_seen_at`). **Nunca almacena datos sensibles** (no requiere DNI, email, teléfono ni contraseñas).
- `public.online_invitations`: Registro de invitaciones 1v1 con la apuesta de XP (`wager_xp`), expiración a los 60s y estado (`pending`, `accepted`, `rejected`, `expired`, `cancelled`).
- `public.online_matches`: Partida activa y finalizada, contadores de aciertos, puntajes acumulados y control de liquidación idempotente (`payout_settled`).
- `public.online_match_answers`: Auditoría y registro de cada respuesta individual (índice 0 a 9, opción elegida, tiempo en segundos y puntos obtenidos).
- `public.online_match_messages`: Mensajes rápidos y emojis del chat dentro de la partida.

#### 2. Funciones Almacenadas (RPC) con Transacciones Atómicas:
- `fn_accept_invitation_and_create_match(p_invitation_id, p_question_ids)`: Bloquea la invitación con `FOR UPDATE`, valida expiración, crea la partida en `online_matches`, marca a ambos jugadores en estado `playing` y devuelve el `match_id` de forma atómica.
- `fn_submit_match_answer(...)`: Registra la respuesta, actualiza los acumuladores en `online_matches`, evalúa si ambos jugadores terminaron y, en caso afirmativo, determina el ganador y liquida el XP y las estadísticas una única vez (`payout_settled = true`).
- `fn_check_daily_consecutive_matches(p_player1, p_player2)`: Evalúa si los dos jugadores ya disputaron 3 partidas consecutivas finalizadas en el día actual (UTC).
- `fn_abandon_match(p_match_id, p_abandoning_session_id)`: Otorga la victoria al jugador que permaneció conectado si su rival abandona o se desconecta de forma prolongada.

#### 3. Publicaciones Realtime:
Las tablas `online_players`, `online_invitations`, `online_matches`, `online_match_answers` y `online_match_messages` están suscritas a la publicación `supabase_realtime`.

---

### ⚙️ Configuración del Entorno (.env)

Copia el archivo `.env.example` como `.env` en la raíz del proyecto y completa las credenciales de tu proyecto de Supabase:

```env
# Supabase Configuration (Fase 2 - Desafíos en Línea)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
VITE_ONLINE_MODE=supabase
```

> **Importante:** Únicamente se utiliza la clave pública anónima (`anon key`). Nunca se expone ni se requiere la clave secreta `service_role`.

---

### 🧪 Guía de Prueba Multijugador (Paso a Paso)

Para verificar el funcionamiento en tiempo real en una misma computadora:

1. **Abrir la ventana 1 (Navegador Normal):**
   - Abrir `http://localhost:5173`.
   - Navegar a **⚔️ Desafíos en línea**.
   - Ingresar como Estudiante 1 (ej: `Martín Sena`, Colegio `Normal 1`).
2. **Abrir la ventana 2 (Ventana de Incógnito u otro navegador como Edge/Chrome):**
   - Abrir `http://localhost:5173`.
   - Navegar a **⚔️ Desafíos en línea**.
   - Ingresar como Estudiante 2 (ej: `Lucía Gómez`, Colegio `Técnica 2`).
3. **Verificación de Presencia en la Sala:**
   - En la ventana 1, aparecerá `Lucía Gómez` con la etiqueta verde `🟢 En vivo`.
   - En la ventana 2, aparecerá `Martín Sena` con la etiqueta verde `🟢 En vivo`.
4. **Envío y Aceptación de Desafío:**
   - En la ventana 1, hacer clic en **⚔️ Desafiar** en la tarjeta de Lucía.
   - Seleccionar la apuesta (ej: 50 XP) y presionar **Enviar desafío**.
   - En la ventana 2, se abrirá inmediatamente el modal animado de **Desafío Entrante** con la apuesta de 50 XP y el temporizador visual de 60 segundos.
   - En la ventana 2, hacer clic en **Aceptar duelo**.
5. **Comienzo Sincronizado:**
   - Ambas ventanas pasarán inmediatamente a la pantalla de cuenta regresiva `3... 2... 1... ¡Comienza!`.
6. **Desarrollo de la Partida:**
   - Ambas ventanas recibirán exactamente las mismas 10 preguntas en el mismo orden (hasta la función `input()`).
   - Cuando un jugador responde, el otro ve en vivo el aviso: *"⚡ [Nombre] respondió correctamente ✓ (+135 pts)"*.
   - El chat de frases predeterminadas y emojis transmite reacciones en vivo entre ambos.
7. **Finalización y Resultados:**
   - Quien termine primero espera a su rival con un indicador de progreso en vivo.
   - Al responder ambos la décima pregunta, se presenta el podio final con el cálculo exacto de ganador/empate, acreditación de XP y desglose de errores.

