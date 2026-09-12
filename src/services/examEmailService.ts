import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ExamEvaluationResult } from '../types/exam';

export interface EmailSendResult {
  success: boolean;
  message: string;
  notConfigured?: boolean;
}

/**
 * Servicio seguro para solicitar el envío de la copia del resultado del examen.
 * No utiliza contraseñas SMTP ni tokens privados en el cliente frontend.
 * Delega la ejecución a la Edge Function 'send-exam-result' de Supabase si está disponible.
 */
export async function sendExamResultEmail(
  evaluation: ExamEvaluationResult,
  targetEmail: string,
  examTitle: string = 'Modelo de Examen N.º 1'
): Promise<EmailSendResult> {
  const emailClean = targetEmail.trim();

  if (!emailClean || !emailClean.includes('@') || !emailClean.includes('.')) {
    return {
      success: false,
      message: 'Por favor, ingresá una dirección de correo electrónico válida.'
    };
  }

  // 1. Si Supabase no está configurado en el entorno
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      notConfigured: true,
      message: 'El servicio de envío de correos no está conectado actualmente. Para habilitarlo, se debe vincular la Edge Function de Supabase con un proveedor (ej: Resend).'
    };
  }

  // 2. Formatear datos legibles
  const minutes = Math.floor(evaluation.durationSeconds / 60);
  const seconds = evaluation.durationSeconds % 60;
  const durationFormatted = `${minutes} min ${seconds < 10 ? '0' : ''}${seconds} seg`;

  const dateObj = new Date(evaluation.completedAt);
  const dateFormatted = dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const payload = {
    email: emailClean,
    studentName: evaluation.student.studentName,
    studentLastName: evaluation.student.studentLastName,
    school: evaluation.student.school,
    course: evaluation.student.course,
    examTitle,
    score: evaluation.score,
    correctAnswers: evaluation.correctAnswersCount,
    totalQuestions: evaluation.totalQuestions,
    percentage: evaluation.percentage,
    durationFormatted,
    dateFormatted
  };

  try {
    const { data, error } = await supabase.functions.invoke('send-exam-result', {
      body: payload
    });

    if (error) {
      console.warn('[ExamEmailService] Error al invocar Edge Function:', error);
      return {
        success: false,
        notConfigured: true,
        message: 'La función de envío de correos en Supabase aún no ha sido desplegada o configurada con su API key.'
      };
    }

    if (data?.configured === false) {
      return {
        success: false,
        notConfigured: true,
        message: data.message || 'El servicio de correos aún requiere configurar la variable RESEND_API_KEY en Supabase.'
      };
    }

    if (data?.success) {
      return {
        success: true,
        message: `¡Copia del resultado enviada exitosamente a ${emailClean}!`
      };
    }

    return {
      success: false,
      message: data?.error || 'No fue posible despachar el correo electrónico en este momento.'
    };
  } catch (err: any) {
    console.error('[ExamEmailService] Excepción de red al enviar email:', err);
    return {
      success: false,
      notConfigured: true,
      message: 'No se pudo contactar al servidor de correos. Verifica tu conexión a internet.'
    };
  }
}
