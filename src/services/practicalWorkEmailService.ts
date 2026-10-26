import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TPEvaluationResult } from '../types/practicalWorkSession';

export interface TPEmailSendResult {
  success: boolean;
  message: string;
  notConfigured?: boolean;
  providerRestricted?: boolean;
  recipients?: string[];
}

export interface TPEmailSendParams {
  evaluation: TPEvaluationResult;
  email1: string;
  email2?: string;
}

// Expresión regular estándar para validación de formato de correos electrónicos
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Control en memoria para evitar envíos repetitivos abusivos (cooldown de 5 segundos)
let lastSendTimestamp = 0;

/**
 * Valida sintácticamente y verifica unicidad de hasta 2 direcciones de correo electrónico.
 */
export function validateEmailInputs(
  email1: string,
  email2?: string
): { valid: boolean; error?: string; recipients: string[] } {
  const clean1 = email1.trim().toLowerCase();
  const clean2 = email2 ? email2.trim().toLowerCase() : '';

  if (!clean1) {
    return { valid: false, error: 'Por favor, ingresá el correo electrónico principal.', recipients: [] };
  }

  if (!EMAIL_REGEX.test(clean1)) {
    return { valid: false, error: 'El primer correo electrónico no tiene un formato válido (ejemplo: alumno@escuela.edu.ar).', recipients: [] };
  }

  const recipients = [clean1];

  if (clean2) {
    if (!EMAIL_REGEX.test(clean2)) {
      return { valid: false, error: 'El segundo correo electrónico no tiene un formato válido.', recipients: [] };
    }
    if (clean1 === clean2) {
      return { valid: false, error: 'El segundo correo es idéntico al primero. Ingresá una dirección diferente o dejá el campo vacío.', recipients: [] };
    }
    recipients.push(clean2);
  }

  return { valid: true, recipients };
}

/**
 * Servicio seguro para solicitar el envío del informe detallado del Trabajo Práctico por correo.
 * - Soporta 1 o 2 destinatarios independientes.
 * - No expone credenciales privadas ni secretos de Resend en el cliente frontend.
 * - Invoca la Edge Function protegida 'send-exam-result' de Supabase.
 */
export async function sendPracticalWorkResultEmail(
  params: TPEmailSendParams
): Promise<TPEmailSendResult> {
  const { evaluation, email1, email2 } = params;

  // 1. Validación de destinatarios
  const validation = validateEmailInputs(email1, email2);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || 'Dirección de correo no válida.'
    };
  }

  // 2. Control de ráfagas repetidas (debounce mínimo de 5 segundos)
  const now = Date.now();
  if (now - lastSendTimestamp < 5000) {
    return {
      success: false,
      message: 'Aguardá unos segundos antes de solicitar un nuevo envío.'
    };
  }

  // 3. Comprobación de configuración de Supabase
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      notConfigured: true,
      message: 'El servicio de envío no está conectado a Supabase. Para activarlo, se debe vincular la Edge Function con el proveedor de correo (ej: Resend).'
    };
  }

  // 4. Formatear datos legibles
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
    evaluationType: 'trabajo_practico',
    email: validation.recipients[0],
    emails: validation.recipients,
    attemptId: evaluation.id,
    model: evaluation.model,
    modality: evaluation.student.modality,
    school: evaluation.student.school,
    course: evaluation.student.course,
    division: evaluation.student.division || '',
    shift: evaluation.student.shift,
    student1: evaluation.student.student1,
    student2: evaluation.student.student2 || null,
    score: evaluation.score,
    maxScore: evaluation.maxScore,
    theoryScore: evaluation.theoryScore,
    theoryMaxScore: evaluation.theoryMaxScore,
    practicalScore: evaluation.practicalScore,
    practicalMaxScore: evaluation.practicalMaxScore,
    correctAnswersCount: evaluation.correctAnswersCount,
    totalQuestions: evaluation.totalQuestions,
    percentage: evaluation.percentage,
    passed: evaluation.passed,
    durationFormatted,
    dateFormatted,
    theoryBreakdown: evaluation.theoryBreakdown.map(item => ({
      questionId: item.questionId,
      question: item.question,
      topic: item.topic,
      userAnswerText: item.userAnswerText,
      correctAnswerText: item.correctAnswerText,
      isCorrect: item.isCorrect,
      pointsObtained: item.pointsObtained,
      maxPoints: item.maxPoints,
      explanation: item.explanation
    })),
    practicalBreakdown: evaluation.practicalBreakdown.map(item => ({
      questionId: item.questionId,
      title: item.title,
      description: item.description,
      userCode: item.userCode || 'Sin código entregado',
      allPassed: item.allPassed,
      passedCount: item.passedCount,
      totalCount: item.totalCount,
      pointsObtained: item.pointsObtained,
      maxPoints: item.maxPoints,
      suggestions: item.suggestions || ''
    }))
  };

  try {
    lastSendTimestamp = Date.now();
    const { data, error } = await supabase.functions.invoke('send-exam-result', {
      body: payload
    });

    if (error) {
      console.warn('[TPEmailService] Error de invocación en Edge Function:', error);
      let serverErrorMsg = '';

      // Extraer mensaje real desde el cuerpo devuelto por la Edge Function
      if ((error as any).context && typeof (error as any).context.json === 'function') {
        try {
          const errBody = await (error as any).context.json();
          if (errBody?.error) {
            serverErrorMsg = errBody.error;
          }
        } catch {
          // fallback
        }
      }

      if (!serverErrorMsg && error.message) {
        serverErrorMsg = error.message;
      }

      const isConfigIssue =
        serverErrorMsg.includes('no tiene configurada la variable RESEND_API_KEY') ||
        serverErrorMsg.includes('GOOGLE_APPS_SCRIPT_URL') ||
        serverErrorMsg.includes('GOOGLE_APPS_SCRIPT_SECRET') ||
        serverErrorMsg.includes('no tiene configuradas las variables de Google Apps Script');
      const isProviderRestriction =
        serverErrorMsg.includes('onboarding@resend.dev') ||
        serverErrorMsg.includes('modo inicial de prueba') ||
        serverErrorMsg.includes('modo de pruebas') ||
        serverErrorMsg.includes('testing emails') ||
        serverErrorMsg.includes('resend.com/domains') ||
        serverErrorMsg.includes('proveedor de correo (Resend)');

      return {
        success: false,
        notConfigured: isConfigIssue,
        providerRestricted: isProviderRestriction,
        message: serverErrorMsg || 'No fue posible completar el envío por correo. Podés reintentar en unos instantes.'
      };
    }

    if (data?.configured === false) {
      return {
        success: false,
        notConfigured: true,
        message: data.message || 'El servicio de correo de Supabase requiere configurar las variables de envío en los secretos del proyecto.'
      };
    }

    if (data?.success) {
      const recipientList = validation.recipients.join(' y ');
      return {
        success: true,
        message: `¡Resultado y devoluciones pedagógicas enviados con éxito a ${recipientList}!`,
        recipients: validation.recipients
      };
    }

    return {
      success: false,
      message: data?.error || 'No fue posible completar el envío por correo en este momento.'
    };
  } catch (err: any) {
    console.error('[TPEmailService] Excepción de conexión al enviar email:', err);
    return {
      success: false,
      message: 'No se pudo contactar al servidor de correos. Verificá tu conexión a internet.'
    };
  }
}
