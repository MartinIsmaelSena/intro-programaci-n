// ==============================================================================
// Supabase Edge Function: send-exam-result
// ==============================================================================
// Función segura del backend para enviar copia del resultado del examen por email.
// Utiliza variables de entorno en el servidor de Supabase (ej: RESEND_API_KEY o SENDGRID_API_KEY)
// sin exponer credenciales en el cliente frontend de GitHub Pages.
// ==============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ExamResultPayload {
  email: string;
  studentName: string;
  studentLastName: string;
  school: string;
  course: string;
  examTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  durationFormatted: string;
  dateFormatted: string;
}

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: ExamResultPayload = await req.json();

    if (!payload.email || !payload.email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Correo electrónico inválido o no proporcionado.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      // Si la API key aún no fue configurada en los secretos de Supabase:
      return new Response(
        JSON.stringify({
          configured: false,
          message: 'El servicio de correo de Supabase aún no tiene configurada la variable RESEND_API_KEY en los secretos del proyecto.',
        }),
        { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailSubject = `Resultado de Examen: ${payload.examTitle} - ${payload.studentName} ${payload.studentLastName}`;
    const emailHtml = `
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

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [payload.email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(resendData.message || 'Fallo al despachar email mediante el proveedor.');
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Error interno al procesar el envío.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
