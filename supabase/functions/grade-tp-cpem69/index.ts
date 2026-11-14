// ==============================================================================
// Supabase Edge Function: grade-tp-cpem69
// ==============================================================================
// Corrección automática mediante IA del Trabajo Práctico CPEM N.º 69 – 4.º A.
// - Evalúa conceptualmente las 5 respuestas escritas del estudiante (escala 0 a 10).
// - Analiza coherencia pedagógica y genera auditoría (no_observations, requires_review, oral_exam).
// - Guarda resultados en Supabase (tp_cpem69_submissions).
// - Despacha automáticamente el correo de devolución vía Google Apps Script (Gmail).
// - No inventa notas si el proveedor de IA falla o no está configurado.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Banco canónico de los 5 ejercicios para el prompt de corrección
const EXERCISES_DATA: Record<number, { title: string; code: string; questions: Array<{ id: number; q: string; concept: string }> }> = {
  3: {
    title: 'Ejercicio 3 — ¿Tiene permiso para utilizar la computadora?',
    code: `permiso = False
edad = 15

if permiso and edad >= 13:
    print("Puede utilizar la computadora")
else:
    print("No puede utilizar la computadora")`,
    questions: [
      { id: 1, q: '1. ¿Qué mensaje muestra el programa cuando se ejecuta?', concept: 'Muestra "No puede utilizar la computadora".' },
      { id: 2, q: '2. ¿Qué significa el operador and en esta condición?', concept: 'Significa que ambas condiciones deben ser verdaderas a la vez para que se cumpla el if.' },
      { id: 3, q: '3. ¿Qué valor tiene la variable permiso?', concept: 'Tiene el valor False / falso.' },
      { id: 4, q: '4. ¿Por qué no alcanza con que la edad sea mayor o igual a 13?', concept: 'Porque la condición usa and con permiso, y como permiso es False, toda la expresión da False.' },
      { id: 5, q: '5. ¿Qué modificación habría que realizar para que el programa permita utilizar la computadora?', concept: 'Cambiar permiso a True, o cambiar and por or, o quitar la condición de permiso.' }
    ]
  },
  4: {
    title: 'Ejercicio 4 — ¿Tiene suficientes puntos?',
    code: `puntos = 75

if puntos >= 100:
    print("Nivel completado")
else:
    print("Todavía faltan puntos")`,
    questions: [
      { id: 1, q: '1. ¿Qué mensaje muestra el programa?', concept: 'Muestra "Todavía faltan puntos".' },
      { id: 2, q: '2. ¿Por qué no aparece el mensaje "Nivel completado"?', concept: 'Porque puntos vale 75, que no es mayor ni igual a 100 (la condición es falsa).' },
      { id: 3, q: '3. ¿Qué significa el operador >=?', concept: 'Significa "mayor o igual que".' },
      { id: 4, q: '4. ¿Cuántos puntos le faltan para llegar a 100?', concept: 'Le faltan 25 puntos (100 - 75 = 25).' },
      { id: 5, q: '5. ¿Qué valor mínimo debería tener la variable puntos para completar el nivel?', concept: 'Debe tener al menos 100 puntos.' }
    ]
  },
  5: {
    title: 'Ejercicio 5 — ¿Puede ingresar al juego?',
    code: `bloqueado = False
monedas = 10

if not bloqueado and monedas >= 10:
    print("Acceso permitido")
else:
    print("Acceso denegado")`,
    questions: [
      { id: 1, q: '1. ¿Qué mensaje muestra el programa?', concept: 'Muestra "Acceso permitido".' },
      { id: 2, q: '2. ¿Qué significa not bloqueado?', concept: 'Niega o invierte el valor de bloqueado; como es False, not bloqueado es True (no está bloqueado).' },
      { id: 3, q: '3. ¿Por qué se utiliza and en esta condición?', concept: 'Porque se exige cumplir ambos requisitos: no estar bloqueado y tener 10 o más monedas.' },
      { id: 4, q: '4. ¿Qué sucedería si la variable bloqueado tuviera el valor True?', concept: 'not bloqueado pasaría a ser False, la condición no se cumpliría y mostraría "Acceso denegado".' },
      { id: 5, q: '5. ¿Qué sucedería si el jugador tuviera solamente 5 monedas?', concept: 'Como 5 no es >= 10, la condición fallaría y mostraría "Acceso denegado".' }
    ]
  },
  6: {
    title: 'Ejercicio 6 — Detectar un error en la condición',
    code: `contrasena_correcta = True

if not contrasena_correcta:
    print("Acceso permitido")
else:
    print("Contraseña incorrecta")`,
    questions: [
      { id: 1, q: '1. ¿Qué mensaje muestra el programa?', concept: 'Muestra "Contraseña incorrecta".' },
      { id: 2, q: '2. ¿El programa funciona correctamente si queremos permitir el acceso cuando la contraseña es correcta?', concept: 'No, funciona al revés / incorrectamente.' },
      { id: 3, q: '3. ¿Por qué?', concept: 'Porque con contrasena_correcta = True, not contrasena_correcta se vuelve False y se ejecuta el else.' },
      { id: 4, q: '4. ¿Qué problema encontrás en la condición?', concept: 'El operador not está de más e invierte la lógica del acceso.' },
      { id: 5, q: '5. ¿Cómo modificarías el código para que funcione correctamente? Escribí el código corregido.', concept: 'Cambiar a "if contrasena_correcta:" o invertir los mensajes dentro del if y el else.' }
    ]
  },
  7: {
    title: 'Ejercicio 7 — Analizar dos condiciones',
    code: `temperatura = 30
ventilador = False

if temperatura > 25 and not ventilador:
    print("Encender ventilador")
else:
    print("No es necesario encenderlo")`,
    questions: [
      { id: 1, q: '1. ¿Qué mensaje muestra el programa?', concept: 'Muestra "Encender ventilador".' },
      { id: 2, q: '2. ¿Qué significa la condición temperatura > 25?', concept: 'Verifica si la temperatura supera estrictamente los 25 grados.' },
      { id: 3, q: '3. ¿Qué significa not ventilador?', concept: 'Verifica que el ventilador no esté encendido (como ventilador es False, not ventilador es True).' },
      { id: 4, q: '4. ¿Qué sucedería si la variable ventilador tuviera el valor True?', concept: 'not ventilador sería False, la condición no se cumpliría y mostraría "No es necesario encenderlo".' },
      { id: 5, q: '5. ¿Qué sucedería si la temperatura fuera de 20 grados?', concept: 'temperatura > 25 sería False, la condición fallaría y mostraría "No es necesario encenderlo".' }
    ]
  }
};

async function sendEmailViaGas(to: string[], subject: string, htmlBody: string, textBody: string) {
  let gasUrl = Deno.env.get('GOOGLE_APPS_SCRIPT_URL');
  let gasSecret = Deno.env.get('GOOGLE_APPS_SCRIPT_SECRET');

  if (!gasUrl || !gasSecret) {
    const allEnv = Deno.env.toObject();
    for (const [k, v] of Object.entries(allEnv)) {
      if (k.startsWith('https://script.google.com/')) {
        gasUrl = gasUrl || k;
        gasSecret = gasSecret || v;
      }
    }
  }

  if (!gasUrl || !gasSecret) {
    return { success: false, error: 'GOOGLE_APPS_SCRIPT_URL o GOOGLE_APPS_SCRIPT_SECRET no configurados.' };
  }

  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify({
        secret: gasSecret,
        recipients: to,
        subject,
        textBody,
        htmlBody
      })
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      if (json.success === true) {
        return { success: true };
      }
      return { success: false, error: json.error || json.message || 'Google Apps Script no confirmó éxito.' };
    }
    return { success: false, error: `HTTP ${res.status} al conectar con Google Apps Script.` };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Acción A: Solicitud y despacho seguro de código de verificación de identidad (OTP)
    // El frontend se comunica con la Edge Function. La función invoca request_tp_cpem69_access_code
    // utilizando SUPABASE_SERVICE_ROLE_KEY, despacha el correo vía Google Apps Script y responde al frontend
    // SIN exponer el código de 6 dígitos en la respuesta.
    if (body.action === 'request_otp') {
      const { email, student_name, student_last_name, school = 'CPEM N.º 69', division = '4.º A', tp_id = 'tp-cpem69-4a' } = body;

      if (!email || !student_name || !student_last_name) {
        return new Response(
          JSON.stringify({ success: false, error: 'MISSING_FIELDS', message: 'Nombre, apellido y correo electrónico son obligatorios.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const validSchools = ['CPEM N.º 69', 'CPEM N.º 29'];
      const validDivisions = ['4.º A', '4.º B', '4.º C'];

      const cleanSchool = validSchools.includes(school) ? school : 'CPEM N.º 69';
      const cleanDivision = validDivisions.includes(division) ? division : '4.º A';

      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

      if (!supabaseUrl || !serviceRoleKey) {
        return new Response(
          JSON.stringify({ success: false, error: 'CONFIG_ERROR', message: 'Configuración de servidor no disponible.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

      // Invocación a RPC interna (exclusiva de service_role)
      const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc('request_tp_cpem69_access_code', {
        p_tp_id: tp_id,
        p_email: email,
        p_student_name: student_name,
        p_student_last_name: student_last_name,
        p_school: cleanSchool,
        p_division: cleanDivision
      });

      if (rpcErr) {
        console.error('[grade-tp-cpem69] Error en RPC request_tp_cpem69_access_code:', rpcErr);
        return new Response(
          JSON.stringify({ success: false, error: 'RPC_ERROR', message: rpcErr.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!rpcData?.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: rpcData?.error || 'REQUEST_FAILED',
            message: rpcData?.message || 'No fue posible generar el código de acceso.'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const otpCode = rpcData.code;
      const cleanEmail = rpcData.email || email.toLowerCase().trim();
      const studentFullName = `${student_name.trim()} ${student_last_name.trim()}`;

      // Enviar código por correo vía Google Apps Script (Gmail)
      const subject = `Código de verificación — Trabajo Práctico de Programación (${cleanSchool} ${cleanDivision}): ${otpCode}`;
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 20px; border-radius: 12px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Python desde Cero</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 13px;">${cleanSchool} – Curso ${cleanDivision}</p>
          </div>
          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #e2e8f0; text-align: center;">
            <h2 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Código de verificación de identidad</h2>
            <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
              Hola <strong>${studentFullName}</strong> (${cleanSchool} – ${cleanDivision}), tu código de acceso para iniciar o reanudar el Trabajo Práctico de Programación es:
            </p>
            <div style="background-color: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 12px; padding: 16px; font-size: 32px; font-family: monospace; font-weight: 900; letter-spacing: 6px; color: #1e3a8a; margin: 0 auto 20px; max-width: 250px;">
              ${otpCode}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Este código vence en 15 minutos y es de un solo uso. No lo compartas con nadie.
            </p>
          </div>
        </div>
      `;
      const textBody = `Hola ${studentFullName} (${cleanSchool} - ${cleanDivision}),\n\nTu código de verificación para el Trabajo Práctico de Programación (4.º año) es: ${otpCode}\n\nVence en 15 minutos y es de un solo uso.\nNo lo compartas con nadie.`;

      const sendResult = await sendEmailViaGas([cleanEmail], subject, htmlBody, textBody);

      if (!sendResult.success) {
        console.error('[grade-tp-cpem69] Error enviando correo OTP:', sendResult.error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'EMAIL_SEND_FAILED',
            message: 'No fue posible despachar el correo con el código de verificación. Verificá que la dirección sea correcta o contactá al docente.'
          }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Respuesta segura al frontend: EL CÓDIGO NO SE INCLUYE EN LA RESPUESTA
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Código de verificación generado y enviado correctamente a tu correo electrónico.',
          email: cleanEmail
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Acción B: Enviar código legado si se solicita directamente
    if (body.action === 'send_verification_code') {
      const { email, code, student_name } = body;
      if (!email || !code) {
        return new Response(
          JSON.stringify({ error: 'Faltan parámetros email o code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const subject = `Código de verificación — Trabajo Práctico CPEM N.º 69: ${code}`;
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 20px; border-radius: 12px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Python desde Cero</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 13px;">CPEM N.º 69 – Curso 4.º A</p>
          </div>
          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #e2e8f0; text-align: center;">
            <h2 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Código de verificación de identidad</h2>
            <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
              Hola <strong>${student_name || 'estudiante'}</strong>, tu código de acceso para iniciar o reanudar el Trabajo Práctico CPEM N.º 69 es:
            </p>
            <div style="background-color: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 12px; padding: 16px; font-size: 32px; font-family: monospace; font-weight: 900; letter-spacing: 6px; color: #1e3a8a; margin: 0 auto 20px; max-width: 250px;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              Este código vence en 15 minutos y es de un solo uso. No lo compartas con nadie.
            </p>
          </div>
        </div>
      `;
      const textBody = `Hola ${student_name || 'estudiante'},\n\nTu código de verificación para el Trabajo Práctico CPEM N.º 69 (4.º A) es: ${code}\n\nVence en 15 minutos y es de un solo uso.\nNo lo compartas con nadie.`;

      const sendResult = await sendEmailViaGas([email], subject, htmlBody, textBody);
      return new Response(
        JSON.stringify({ success: sendResult.success, error: sendResult.error }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      submission_id,
      force_regrade = false,
      resend_email_only = false
    } = body;

    if (!submission_id) {
      return new Response(
        JSON.stringify({ error: 'Falta el parámetro obligatorio: submission_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Configuración interna de Supabase no disponible en el entorno.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Obtener la entrega
    const { data: submission, error: fetchErr } = await supabase
      .from('tp_cpem69_submissions')
      .select('*')
      .eq('id', submission_id)
      .single();

    if (fetchErr || !submission) {
      return new Response(
        JSON.stringify({ error: `Entrega no encontrada: ${fetchErr?.message || ''}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Caso A: Reenvío exclusivo de correo electrónico (sin recalificar por IA)
    if (resend_email_only) {
      if (!submission.ai_correction || submission.score === null || submission.score === undefined) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'NO_GRADE_AVAILABLE',
            message: 'No es posible reenviar el correo porque la entrega aún no tiene una corrección ni nota válida registrada.'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Caso B: Si ya está calificado y no se solicitó forzar recalificación, no llamar a la IA de nuevo
      if (submission.status === 'graded' && submission.ai_correction && !force_regrade) {
        return new Response(
          JSON.stringify({
            success: true,
            already_graded: true,
            score: submission.score,
            audit_status: submission.audit_status,
            message: 'Esta entrega ya había sido calificada previamente.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Preparar datos del ejercicio
    const exData = EXERCISES_DATA[submission.assigned_exercise];
    if (!exData) {
      throw new Error(`Número de ejercicio desconocido: ${submission.assigned_exercise}`);
    }

    let parsedResult: any;
    let calculatedGrade: number = 0;
    let auditStatus: string = 'no_observations';

    if (resend_email_only) {
      parsedResult = submission.ai_correction;
      calculatedGrade = Number(submission.score ?? 0);
      auditStatus = submission.audit_status || 'no_observations';
    } else {
      // Marcar como 'grading'
      await supabase
        .from('tp_cpem69_submissions')
        .update({ status: 'grading', updated_at: new Date().toISOString() })
        .eq('id', submission_id);

      const studentAnswers = submission.answers || {};

    // 3. Evaluar con proveedor de IA disponible
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const groqKey = Deno.env.get('GROQ_API_KEY');

    if (!geminiKey && !openaiKey && !groqKey) {
      const errorMsg = 'No hay ningún proveedor de IA configurado en los secretos de Supabase (GEMINI_API_KEY, OPENAI_API_KEY o GROQ_API_KEY).';
      await supabase
        .from('tp_cpem69_submissions')
        .update({
          status: 'error_grading',
          ai_feedback: errorMsg,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission_id);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'AI_PROVIDER_NOT_CONFIGURED',
          message: errorMsg
        }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construcción del Prompt Pedagógico Institucional
    const systemPrompt = `Sos un docente evaluador de la materia Programación en la escuela secundaria técnica CPEM N.º 69 (curso 4.º A).
Tu tarea es corregir de forma objetiva, pedagógica, formativa y respetuosa las respuestas escritas de un alumno para una evaluación individual de 90 minutos.

CRITERIOS OBLIGATORIOS DE EVALUACIÓN:
1. Escala de 0 a 10 puntos en total.
2. Cada una de las 5 preguntas vale exactamente 2.0 puntos (5 x 2.0 = 10.0 puntos).
3. Evalúa si el alumno comprende el concepto de fondo (variables, print, input, int, operadores relacionales y operadores lógicos 'and' y 'not').
4. NO exijas coincidencia textual exacta con una respuesta modelo. Acepta respuestas expresadas con palabras sencillas de estudiantes de secundaria siempre que la idea sea correcta.
5. Califica cada pregunta con:
   - "correct": 2.0 puntos (concepto comprendido y respondido claramente).
   - "partial": 1.0 punto (idea general orientada pero incompleta o con imprecisión menor).
   - "incorrect": 0.0 puntos (respuesta equivocada, contradictoria o en blanco).
6. Suma los puntos obtenidos para obtener la nota final (0.0 a 10.0).

AUDITORÍA DE COHERENCIA PEDAGÓGICA (NO ACUSATORIA):
Analiza si las respuestas son consistentes entre sí y con el código.
- "no_observations": Las respuestas son coherentes y naturales.
- "requires_review": Hay discrepancias notables que el docente debería mirar.
- "oral_exam": Se recomienda instancia oral si hay contradicciones graves (ej: dice que imprime "Acceso denegado" pero luego dice que la condición fue verdadera, o usa terminología universitaria descontextualizada).
IMPORTANTE: No uses detectores de IA ni hagas acusaciones automáticas. La nota se calcula igual y si es "oral_exam", se mantendrá como provisoria pendiente de verificación oral.

FORMATO DE SALIDA ESTRICTO (JSON):
Respondé ÚNICAMENTE un objeto JSON válido con esta estructura exacta, sin texto introductorio ni bloques adicionales:
{
  "grade": 8.0,
  "max_grade": 10.0,
  "results": [
    {
      "question": 1,
      "status": "correct",
      "points": 2.0,
      "feedback": "Identifica correctamente el mensaje que imprime el programa."
    },
    {
      "question": 2,
      "status": "correct",
      "points": 2.0,
      "feedback": "Explica con claridad el funcionamiento del operador and."
    },
    {
      "question": 3,
      "status": "correct",
      "points": 2.0,
      "feedback": "Indica correctamente el valor de la variable."
    },
    {
      "question": 4,
      "status": "partial",
      "points": 1.0,
      "feedback": "Comprende la condición pero no fundamenta del todo el impacto del operador."
    },
    {
      "question": 5,
      "status": "correct",
      "points": 2.0,
      "feedback": "Propone una solución válida y funcional para corregir el programa."
    }
  ],
  "strengths": [
    "Comprensión del flujo de ejecución de la estructura if-else.",
    "Uso adecuado de operadores lógicos."
  ],
  "improvements": [
    "Profundizar en la explicación de las condiciones compuestas."
  ],
  "general_feedback": "Buen desempeño en el análisis de código Python. Demuestra comprensión de la lógica condicional.",
  "audit": {
    "status": "no_observations",
    "reasons": []
  }
}`;

    const userPrompt = `EVALUACIÓN DEL ALUMNO:
Estudiante: ${submission.student_name} ${submission.student_last_name}
Ejercicio Asignado: ${exData.title}

CÓDIGO PYTHON ANALIZADO:
\`\`\`python
${exData.code}
\`\`\`

PREGUNTAS Y RESPUESTAS DEL ALUMNO:
${exData.questions.map(q => {
  const ans = studentAnswers[String(q.id)] || studentAnswers[q.id] || '(Sin respuesta)';
  return `--- PREGUNTA ${q.id} ---
Consigna: ${q.q}
Concepto esperado: ${q.concept}
Respuesta del alumno: "${ans}"`;
}).join('\n\n')}

Generá el objeto JSON con la corrección completa.`;

    let aiRawText = '';

    // Llamada a proveedor
    if (geminiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!geminiRes.ok) {
        const errBody = await geminiRes.text();
        throw new Error(`Google Gemini API respondió con error ${geminiRes.status}: ${errBody}`);
      }
      const geminiData = await geminiRes.json();
      aiRawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (openaiKey) {
      const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      if (!oaiRes.ok) {
        const errBody = await oaiRes.text();
        throw new Error(`OpenAI API respondió con error ${oaiRes.status}: ${errBody}`);
      }
      const oaiData = await oaiRes.json();
      aiRawText = oaiData.choices?.[0]?.message?.content || '';
    } else if (groqKey) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      if (!groqRes.ok) {
        const errBody = await groqRes.text();
        throw new Error(`Groq API respondió con error ${groqRes.status}: ${errBody}`);
      }
      const groqData = await groqRes.json();
      aiRawText = groqData.choices?.[0]?.message?.content || '';
    }

    // 4. Parsear y validar el JSON devuelto
    let cleanJson = aiRawText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

      try {
        parsedResult = JSON.parse(cleanJson);
      } catch (_parseErr) {
        throw new Error(`La IA no devolvió un formato JSON válido: ${aiRawText.substring(0, 200)}...`);
      }

      if (typeof parsedResult.grade !== 'number' || !Array.isArray(parsedResult.results) || parsedResult.results.length < 5) {
        throw new Error('El JSON de corrección de la IA está incompleto o no contiene las 5 preguntas.');
      }

      calculatedGrade = Math.max(0, Math.min(10.0, Math.round(Number(parsedResult.grade) * 10) / 10));
      auditStatus = ['no_observations', 'requires_review', 'oral_exam'].includes(parsedResult.audit?.status)
        ? parsedResult.audit.status
        : 'no_observations';
      const auditReasons = Array.isArray(parsedResult.audit?.reasons) ? parsedResult.audit.reasons : [];

      // 5. Actualizar en Supabase mediante RPC protegida (solo service_role)
      const { error: updateErr } = await supabase.rpc('update_tp_cpem69_grading_result', {
        p_submission_id: submission_id,
        p_score: calculatedGrade,
        p_ai_correction: parsedResult,
        p_ai_feedback: parsedResult.general_feedback || '',
        p_audit_status: auditStatus,
        p_audit_observations: auditReasons
      });

      if (updateErr) {
        throw new Error(`Error al persistir la nota en Supabase: ${updateErr.message}`);
      }
    }

    // 6. Enviar correo de devolución al alumno (reutilizando Google Apps Script prioritario)
    let emailSuccess = false;
    let emailErrorMsg: string | null = null;

    try {
      const studentFullName = `${submission.student_name} ${submission.student_last_name}`;
      const isOral = auditStatus === 'oral_exam';
      const studentSchool = submission.school || 'CPEM N.º 69';
      const studentDivision = submission.division || '4.º A';

      const emailSubject = isOral
        ? `Devolución Trabajo Práctico de Programación (4.º año) - ${studentFullName} (${studentSchool} ${studentDivision}) [Instancia Oral Requerida]`
        : `Devolución Trabajo Práctico de Programación (4.º año) - ${studentFullName} (${studentSchool} ${studentDivision}) - Nota: ${calculatedGrade}/10`;

      const strengthsHtml = Array.isArray(parsedResult.strengths) && parsedResult.strengths.length > 0
        ? `<ul>${parsedResult.strengths.map((s: string) => `<li>${s}</li>`).join('')}</ul>`
        : '<p>Demuestra comprensión general de los contenidos.</p>';

      const improvementsHtml = Array.isArray(parsedResult.improvements) && parsedResult.improvements.length > 0
        ? `<ul>${parsedResult.improvements.map((im: string) => `<li>${im}</li>`).join('')}</ul>`
        : '<p>Continuar practicando análisis de código.</p>';

      const oralNoticeHtml = isOral
        ? `
        <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 20px 0; color: #92400e;">
          <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #b45309;">⚠️ Aviso Importante: Instancia Oral Requerida</h3>
          <p style="margin: 0; font-size: 14px; font-weight: 700; line-height: 1.5;">
            Deberás rendir una instancia oral para verificar los conocimientos desarrollados en este trabajo práctico.
          </p>
          <p style="margin: 8px 0 0; font-size: 13px;">
            Tu nota actual (${calculatedGrade}/10) tiene carácter de <strong>provisoria</strong>, pendiente de verificación oral con el docente.
          </p>
        </div>
        `
        : '';

      const questionsBreakdownHtml = parsedResult.results.map((r: any) => `
        <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13px;">
            <span>Pregunta ${r.question}</span>
            <span style="color: ${r.points >= 2 ? '#16a34a' : r.points > 0 ? '#d97706' : '#dc2626'};">
              ${r.points} / 2.0 pts (${r.status === 'correct' ? 'Correcta' : r.status === 'partial' ? 'Parcial' : 'Incorrecta'})
            </span>
          </div>
          <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">${r.feedback}</p>
        </div>
      `).join('');

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Python desde Cero</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">${studentSchool} – Curso ${studentDivision}</p>
          </div>

          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
              Devolución Oficial: Trabajo Práctico de Programación – 4.º año
            </h2>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Alumno/a:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${studentFullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Institución:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${studentSchool}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Curso y división:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${studentDivision}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Correo electrónico:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${submission.email_original}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Ejercicio asignado:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${exData.title}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Fecha y hora de entrega:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${new Date(submission.submitted_at || new Date().toISOString()).toLocaleString('es-AR')}</td>
              </tr>
            </table>

            ${oralNoticeHtml}

            <div style="background-color: #f1f5f9; padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                ${isOral ? 'Nota Provisoria (Pendiente de Verificación Oral)' : 'Nota Final'}
              </div>
              <div style="font-size: 40px; font-weight: 900; color: ${isOral ? '#b45309' : calculatedGrade >= 6.0 ? '#15803d' : '#b91c1c'}; margin: 4px 0;">
                ${calculatedGrade} <span style="font-size: 20px; font-weight: 600; color: #64748b;">/ 10</span>
              </div>
              <div style="font-size: 13px; font-weight: 600; color: #475569;">
                ${calculatedGrade >= 6.0 ? 'Aprobado' : 'No alcanzado'}
              </div>
            </div>

            <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 16px 0 6px;">Devolución Pedagógica General</h3>
            <p style="font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              ${parsedResult.general_feedback || 'Se ha completado la corrección conceptual de tus respuestas.'}
            </p>

            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px; margin-bottom: 14px; font-size: 13px; color: #065f46;">
              <strong style="display: block; margin-bottom: 4px;">Fortalezas demostradas:</strong>
              ${strengthsHtml}
            </div>

            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #1e40af;">
              <strong style="display: block; margin-bottom: 4px;">Aspectos a reforzar:</strong>
              ${improvementsHtml}
            </div>

            <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 16px 0 8px;">Detalle pregunta por pregunta</h3>
            ${questionsBreakdownHtml}

            <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
              Informe emitido automáticamente por la plataforma educativa <strong>Python desde Cero</strong> para ${studentSchool}.
            </p>
          </div>
        </div>
      `;

      const textBody = `
Trabajo Práctico de Programación – 4.º año
==========================================
Alumno/a: ${studentFullName}
Institución: ${studentSchool}
Curso y división: ${studentDivision}
Correo: ${submission.email_original}
Ejercicio: ${exData.title}
Nota: ${calculatedGrade} / 10.0 ${isOral ? '(PROVISORIA - PENDIENTE DE INSTANCIA ORAL)' : ''}

${isOral ? 'AVISO: Deberás rendir una instancia oral para verificar los conocimientos desarrollados en este trabajo práctico.\n' : ''}
Devolución general:
${parsedResult.general_feedback}

Detalle:
${parsedResult.results.map((r: any) => `Pregunta ${r.question}: ${r.points}/2.0 pts (${r.status}) - ${r.feedback}`).join('\n')}
      `.trim();

      const recipients = [submission.email_original, submission.email_normalized].filter((v, i, a) => a.indexOf(v) === i);
      const sendRes = await sendEmailViaGas(recipients, emailSubject, emailHtml, textBody);
      emailSuccess = sendRes.success;
      emailErrorMsg = sendRes.error || null;
    } catch (mailErr: any) {
      emailErrorMsg = mailErr?.message || String(mailErr);
      console.warn('[GradeTPCpem69] Error despachando correo:', emailErrorMsg);
    }

    // Actualizar estado de email en la base de datos
    await supabase.rpc('mark_tp_cpem69_email_sent', {
      p_submission_id: submission_id,
      p_success: emailSuccess,
      p_error: emailErrorMsg
    });

    return new Response(
      JSON.stringify({
        success: true,
        submission_id,
        score: calculatedGrade,
        audit_status: auditStatus,
        email_sent: emailSuccess,
        email_error: emailErrorMsg
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[GradeTPCpem69] Error no controlado:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err?.message || 'Error interno del servidor al calificar.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
