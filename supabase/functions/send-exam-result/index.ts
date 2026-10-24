// ==============================================================================
// Supabase Edge Function: send-exam-result
// ==============================================================================
// Función segura de backend para enviar copia de resultados y devoluciones pedagógicas por email.
// Utiliza variables de entorno seguras de Supabase (ej: RESEND_API_KEY o FROM_EMAIL)
// sin exponer secretos o credenciales en el cliente frontend de GitHub Pages.
// Soporta tanto Exámenes Modulares como el Trabajo Práctico autocorregible (Individual y Parejas).
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // 1. Identificar si es Trabajo Práctico o Examen Estándar
    const isTP = payload.evaluationType === 'trabajo_practico' || Array.isArray(payload.emails);

    // Destinatarios a procesar
    const recipients: string[] = isTP
      ? (Array.isArray(payload.emails) ? payload.emails : [payload.email]).filter(Boolean)
      : [payload.email].filter(Boolean);

    if (recipients.length === 0 || !recipients.every((e: string) => e && e.includes('@'))) {
      return new Response(
        JSON.stringify({ error: 'Correo(s) electrónico(s) inválido(s) o no proporcionados.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          configured: false,
          message: 'El servicio de correo de Supabase aún no tiene configurada la variable RESEND_API_KEY en los secretos del proyecto.',
        }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let emailSubject = '';
    let emailHtml = '';

    if (isTP) {
      // ----------------------------------------------------------------------
      // Formato para TRABAJO PRÁCTICO
      // ----------------------------------------------------------------------
      const s1 = payload.student1 || { name: 'Estudiante', lastName: '', dni: '' };
      const s2 = payload.student2;
      const studentTitle = s2
        ? `${s1.name} ${s1.lastName} y ${s2.name} ${s2.lastName}`
        : `${s1.name} ${s1.lastName}`;

      emailSubject = `Resultado de Trabajo Práctico: Python desde Cero (Modelo ${payload.model || 'A'}) - ${studentTitle}`;

      const theoryRowsHtml = (payload.theoryBreakdown || []).map((q: any, i: number) => `
        <div style="margin-bottom: 12px; padding: 12px; border-radius: 8px; border: 1px solid ${q.isCorrect ? '#bbf7d0' : '#fecdd3'}; background-color: ${q.isCorrect ? '#f0fdf4' : '#fff1f2'}; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #475569;">Pregunta ${i + 1} &bull; ${q.topic || 'Análisis'}</strong>
            <span style="font-weight: bold; color: ${q.isCorrect ? '#15803d' : '#b91c1c'};">
              ${q.isCorrect ? `+${q.pointsObtained} Pts (Correcta)` : '0.0 Pts (Incorrecta)'}
            </span>
          </div>
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 6px;">${q.question}</div>
          <div style="color: #334155; margin-bottom: 4px;">
            <span style="color: #64748b;">Tu respuesta:</span> <strong style="color: ${q.isCorrect ? '#16a34a' : '#dc2626'};">${q.userAnswerText}</strong>
          </div>
          ${!q.isCorrect ? `<div style="color: #334155; margin-bottom: 4px;"><span style="color: #64748b;">Respuesta correcta:</span> <strong style="color: #16a34a;">${q.correctAnswerText}</strong></div>` : ''}
          <div style="margin-top: 6px; padding: 8px; background: #ffffff; border-radius: 6px; font-size: 12px; color: #475569; border-left: 3px solid #0284c7;">
            <strong>Devolución:</strong> ${q.explanation}
          </div>
        </div>
      `).join('');

      const practicalRowsHtml = (payload.practicalBreakdown || []).map((p: any, i: number) => `
        <div style="margin-bottom: 14px; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #0f172a;">Ejercicio ${i + 1}: ${p.title}</strong>
            <span style="font-weight: bold; color: ${p.allPassed ? '#15803d' : '#d97706'};">
              ${p.pointsObtained} / ${p.maxPoints} Pts (${p.passedCount}/${p.totalCount} casos)
            </span>
          </div>
          <p style="margin: 0 0 6px; color: #475569; font-size: 12px;">${p.description}</p>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Código entregado:</div>
            <pre style="margin: 4px 0; padding: 10px; background-color: #0f172a; color: #f1f5f9; border-radius: 6px; font-size: 11px; font-family: Consolas, monospace; overflow-x: auto;"><code>${p.userCode || '# Sin código'}</code></pre>
          </div>
          ${p.suggestions ? `
            <div style="padding: 8px; background: #ffffff; border-radius: 6px; font-size: 12px; color: #475569; border-left: 3px solid #10b981;">
              <strong>Sugerencia docente:</strong> ${p.suggestions}
            </div>
          ` : ''}
        </div>
      `).join('');

      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Python desde Cero</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Reporte Oficial de Trabajo Práctico Autocorregible</p>
          </div>

          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #e2e8f0;">
            <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="margin: 0; font-size: 18px; color: #0f172a;">
                Evaluación: Trabajo Práctico &bull; Modelo ${payload.model || 'A'}
              </h2>
              <span style="font-size: 13px; color: #64748b; font-weight: 600;">
                Modalidad: ${payload.modality === 'pareja' ? 'En Pareja' : 'Individual'}
              </span>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Estudiante 1:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${s1.name} ${s1.lastName} (DNI: ${s1.dni})</td>
              </tr>
              ${s2 ? `
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Estudiante 2:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${s2.name} ${s2.lastName} (DNI: ${s2.dni})</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Institución educativa:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${payload.school || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Curso y División / Turno:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${payload.course || '-'} ${payload.division || ''} &bull; Turno ${payload.shift || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Fecha y Hora:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${payload.dateFormatted || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Tiempo utilizado:</td>
                <td style="padding: 6px 0; font-weight: 700; text-align: right;">${payload.durationFormatted || '-'} (máx. 80 min)</td>
              </tr>
            </table>

            <!-- Resumen de Calificación -->
            <div style="background-color: #f1f5f9; padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Calificación Final Obtenida</div>
              <div style="font-size: 40px; font-weight: 900; color: ${payload.score >= 6.0 ? '#0284c7' : '#dc2626'}; margin: 4px 0;">
                ${payload.score} <span style="font-size: 20px; font-weight: 600; color: #64748b;">/ 10</span>
              </div>
              <div style="font-size: 13px; font-weight: bold; color: ${payload.score >= 6.0 ? '#16a34a' : '#dc2626'}; margin-bottom: 8px;">
                ${payload.score >= 6.0 ? '¡Trabajo Práctico Aprobado!' : 'No alcanzado'} (${payload.percentage || Math.round((payload.score / 10) * 100)}%)
              </div>
              <div style="display: flex; justify-content: center; gap: 16px; font-size: 12px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 8px; margin-top: 8px;">
                <span><strong>Parte A (Análisis 40%):</strong> ${payload.theoryScore} / ${payload.theoryMaxScore || 4.0} pts</span>
                <span>&bull;</span>
                <span><strong>Parte B (Práctica 60%):</strong> ${payload.practicalScore} / ${payload.practicalMaxScore || 6.0} pts</span>
              </div>
            </div>

            <!-- Desglose Parte A -->
            <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 20px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              Parte A: Preguntas de Análisis, Detección de Errores y Lógica
            </h3>
            ${theoryRowsHtml}

            <!-- Desglose Parte B -->
            <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 24px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              Parte B: Ejercicios de Programación en Python
            </h3>
            ${practicalRowsHtml}

            <p style="margin: 24px 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
              Este informe oficial y sus devoluciones pedagógicas fueron emitidos por la plataforma <strong>Python desde Cero</strong>.
            </p>
          </div>
        </div>
      `;
    } else {
      // ----------------------------------------------------------------------
      // Formato para EXAMEN MODULAR ESTÁNDAR (compatibilidad retroactiva 100%)
      // ----------------------------------------------------------------------
      emailSubject = `Resultado de Examen: ${payload.examTitle} - ${payload.studentName} ${payload.studentLastName}`;
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Python desde Cero</h1>
            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 14px;">Reporte Oficial de Evaluación</p>
          </div>

          <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; margin-top: 16px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 16px; font-size: 18px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
              ${payload.examTitle}
            </h2>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Alumno/a:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${payload.studentName} ${payload.studentLastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Colegio / Escuela:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${payload.school}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Curso / Año:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${payload.course}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Fecha de finalización:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${payload.dateFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Tiempo utilizado:</td>
                <td style="padding: 8px 0; font-weight: 700; text-align: right;">${payload.durationFormatted}</td>
              </tr>
            </table>

            <div style="background-color: #f1f5f9; padding: 16px; border-radius: 10px; text-align: center; margin-bottom: 16px;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Calificación Final</div>
              <div style="font-size: 36px; font-weight: 900; color: #0f172a; margin: 4px 0;">
                ${payload.score} <span style="font-size: 18px; font-weight: 600; color: #64748b;">/ 10</span>
              </div>
              <div style="font-size: 14px; color: #475569; font-weight: 600;">
                ${payload.correctAnswers} de ${payload.totalQuestions} correctas (${payload.percentage}%)
              </div>
            </div>

            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
              Este mensaje es una copia informativa automática generada por la plataforma educativa "Python desde Cero".
            </p>
          </div>
        </div>
      `;
    }

    // 2. Despachar email individual por separado para cada destinatario para preservar la privacidad
    const dispatchResults: any[] = [];
    for (const recipient of recipients) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [recipient],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        throw new Error(resendData.message || `Fallo al despachar email a ${recipient}`);
      }

      dispatchResults.push({ recipient, id: resendData.id });
    }

    return new Response(
      JSON.stringify({ success: true, count: dispatchResults.length, results: dispatchResults }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno al procesar el envío de correo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});