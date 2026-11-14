import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  TPCpem69ActiveSession,
  TPCpem69ExerciseNumber,
  TPCpem69StudentData,
  TPCpem69Submission,
  TPCpem69TeacherOverride,
  TPCpemSchool,
  TPCpemDivision
} from '../types/tpCpem69';
import {
  TP_CPEM69_ID,
  TP_CPEM69_DURATION_MINUTES
} from '../data/tpCpem69Exercises';

const STORAGE_ACTIVE_SESSION_KEY = 'tp_cpem69_active_session_v2';
const STORAGE_SESSION_TOKEN_KEY = 'tp_cpem69_session_token_v2';
const STORAGE_LOCAL_SUBMISSIONS_KEY = 'tp_cpem69_local_submissions_v2';
const STORAGE_LOCAL_VERIFICATIONS_KEY = 'tp_cpem69_local_verif_v2';

/**
 * Normaliza una dirección de correo electrónico según la consigna:
 * trim() y toLowerCase()
 */
export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

/**
 * Obtiene la sesión activa persistida en localStorage
 */
export function getStoredTPSession(): TPCpem69ActiveSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[TPCpem69Service] Error al leer sesión de localStorage:', err);
    return null;
  }
}

/**
 * Guarda la sesión activa en localStorage para recuperación instantánea ante recargas
 */
export function saveStoredTPSession(session: TPCpem69ActiveSession): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('[TPCpem69Service] Error al guardar sesión en localStorage:', err);
  }
}

/**
 * Obtiene la credencial secreta de sesión
 */
export function getStoredSessionToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Guarda la credencial secreta de sesión
 */
export function saveStoredSessionToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_SESSION_TOKEN_KEY, token);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Limpia la sesión activa y la credencial en localStorage
 */
export function clearStoredTPSession(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_SESSION_KEY);
    localStorage.removeItem(STORAGE_SESSION_TOKEN_KEY);
  } catch (err) {
    console.error('[TPCpem69Service] Error al limpiar sesión de localStorage:', err);
  }
}

/**
 * Helpers para almacenamiento local de contingencia
 */
function getLocalSubmissions(): TPCpem69Submission[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSubmissions(subs: TPCpem69Submission[]): void {
  try {
    localStorage.setItem(STORAGE_LOCAL_SUBMISSIONS_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error(e);
  }
}

/**
 * 1. SOLICITAR CÓDIGO DE VERIFICACIÓN (OTP)
 * Verifica que el examen esté publicado y que el alumno no haya entregado previamente.
 * Emite un código de 6 dígitos que se despacha vía correo.
 */
export async function requestAccessCode(
  student: TPCpem69StudentData
): Promise<{
  success: boolean;
  email?: string;
  devCode?: string;
  error?: string;
  alreadySubmitted?: boolean;
  isUnpublished?: boolean;
}> {
  const normEmail = normalizeEmail(student.email);
  if (!student.studentName.trim() || !student.studentLastName.trim() || !normEmail) {
    return {
      success: false,
      error: 'Por favor completá tu nombre, apellido y correo electrónico.'
    };
  }
  if (!student.school || !student.division) {
    return {
      success: false,
      error: 'Por favor seleccioná tu institución educativa y curso/división.'
    };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      // Invocación a Edge Function backend (sin exponer SUPABASE_SERVICE_ROLE_KEY ni el código OTP)
      const { data, error } = await supabase.functions.invoke('grade-tp-cpem69', {
        body: {
          action: 'request_otp',
          tp_id: TP_CPEM69_ID,
          email: normEmail,
          student_name: student.studentName.trim(),
          student_last_name: student.studentLastName.trim(),
          school: student.school,
          division: student.division
        }
      });

      if (error) {
        return { success: false, error: error.message || 'Error al solicitar el código de verificación.' };
      }

      if (!data?.success) {
        if (data?.error === 'ALREADY_SUBMITTED') {
          return {
            success: false,
            alreadySubmitted: true,
            error: data.message || 'Este trabajo práctico ya fue entregado con este correo electrónico.'
          };
        }
        if (data?.error === 'UNPUBLISHED') {
          return {
            success: false,
            isUnpublished: true,
            error: data.message || 'El Trabajo Práctico se encuentra deshabilitado por el docente y no admite nuevos intentos en este momento.'
          };
        }
        return {
          success: false,
          error: data?.message || 'No fue posible generar el código de verificación.'
        };
      }

      return {
        success: true,
        email: normEmail
      };
    } catch (err: any) {
      console.warn('[TPCpem69Service] Error invocando request_otp en Edge Function:', err);
      return { success: false, error: err?.message || 'Error de comunicación con el servicio de verificación.' };
    }
  }

  // Modo contingencia local (solo si Supabase no está configurado)
  const localSubs = getLocalSubmissions();
  const existing = localSubs.find(s => s.tp_id === TP_CPEM69_ID && s.email_normalized === normEmail);
  if (existing && existing.status !== 'in_progress') {
    return {
      success: false,
      alreadySubmitted: true,
      error: 'Este trabajo práctico ya fue entregado con este correo electrónico.'
    };
  }

  const mockCode = String(Math.floor(100000 + Math.random() * 900000));
  localStorage.setItem(STORAGE_LOCAL_VERIFICATIONS_KEY, JSON.stringify({
    email: normEmail,
    code: mockCode,
    expiresAt: Date.now() + 15 * 60 * 1000
  }));

  return {
    success: true,
    email: normEmail
  };
}

/**
 * 2. VALIDAR CÓDIGO OTP Y OBTENER CREDENCIAL DE SESIÓN
 */
export async function verifyAccessCode(params: {
  email: string;
  code: string;
  studentName: string;
  studentLastName: string;
  school?: TPCpemSchool;
  division?: TPCpemDivision;
}): Promise<{
  success: boolean;
  session?: TPCpem69ActiveSession;
  error?: string;
  alreadySubmitted?: boolean;
  attemptsLeft?: number;
}> {
  const normEmail = normalizeEmail(params.email);
  const selectedSchool = params.school || 'CPEM N.º 69';
  const selectedDivision = params.division || '4.º A';

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('verify_tp_cpem69_access_code', {
        p_tp_id: TP_CPEM69_ID,
        p_email: normEmail,
        p_code: params.code.trim(),
        p_student_name: params.studentName.trim(),
        p_student_last_name: params.studentLastName.trim(),
        p_school: selectedSchool,
        p_division: selectedDivision
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.success) {
        if (data?.already_submitted) {
          return {
            success: false,
            alreadySubmitted: true,
            error: data.message || 'Este trabajo práctico ya fue entregado con este correo electrónico. No podrás realizar una nueva entrega.'
          };
        }
        if (data?.status === 'expired') {
          return {
            success: false,
            error: data.message || 'El plazo de 90 minutos ha finalizado.'
          };
        }
        if (data?.error === 'WRONG_CODE') {
          const attempts = data.attempts_left ?? 0;
          return {
            success: false,
            attemptsLeft: attempts,
            error: attempts > 0
              ? `Código de verificación incorrecto. Te quedan ${attempts} intento${attempts === 1 ? '' : 's'}.`
              : 'Código incorrecto. Has agotado los intentos permitidos. Solicitá un nuevo código.'
          };
        }
        if (data?.error === 'CODE_EXPIRED') {
          return {
            success: false,
            error: 'El código de verificación ha expirado (validez 15 minutos). Por favor solicitá uno nuevo.'
          };
        }
        if (data?.error === 'CODE_ALREADY_USED') {
          return {
            success: false,
            error: 'Este código de verificación ya fue utilizado o se agotaron los intentos permitidos. Por favor solicitá un código nuevo.'
          };
        }
        if (data?.error === 'UNPUBLISHED') {
          return {
            success: false,
            error: 'El Trabajo Práctico se encuentra deshabilitado temporalmente por el docente y no admite ingresos en este momento.'
          };
        }
        if (data?.error === 'INVALID_CODE') {
          return {
            success: false,
            error: data.message || 'No se encontró una solicitud activa de código para este correo. Por favor solicitá un código primero.'
          };
        }
        if (data?.error === 'INVALID_INPUT') {
          return {
            success: false,
            error: 'Los datos ingresados son inválidos. Verificá que el código contenga exactamente 6 dígitos numéricos.'
          };
        }
        return {
          success: false,
          error: data?.message || 'Código de verificación incorrecto o expirado.'
        };
      }

      // Guardar token de sesión criptográfico en localStorage protegido
      if (data.session_token) {
        saveStoredSessionToken(data.session_token);
      }

      const activeSession: TPCpem69ActiveSession = {
        submissionId: data.submission_id,
        tpId: TP_CPEM69_ID,
        sessionToken: data.session_token,
        student: {
          studentName: params.studentName.trim(),
          studentLastName: params.studentLastName.trim(),
          email: params.email.trim(),
          school: (data.school || selectedSchool) as TPCpemSchool,
          division: (data.division || selectedDivision) as TPCpemDivision
        },
        school: (data.school || selectedSchool) as TPCpemSchool,
        division: (data.division || selectedDivision) as TPCpemDivision,
        assignedExercise: Number(data.assigned_exercise) as TPCpem69ExerciseNumber,
        startedAt: data.started_at,
        deadlineAt: data.deadline_at,
        answers: data.answers || {},
        status: data.current_status || data.status || 'in_progress'
      };

      saveStoredTPSession(activeSession);
      return { success: true, session: activeSession };
    } catch (err: any) {
      console.warn('[TPCpem69Service] Error en verify_tp_cpem69_access_code, usando contingencia:', err);
    }
  }

  // Contingencia local
  try {
    const rawVerif = localStorage.getItem(STORAGE_LOCAL_VERIFICATIONS_KEY);
    const verif = rawVerif ? JSON.parse(rawVerif) : null;
    if (!verif || verif.email !== normEmail || verif.code !== params.code.trim()) {
      return { success: false, error: 'El código de verificación ingresado es incorrecto.' };
    }
    if (Date.now() > verif.expiresAt) {
      return { success: false, error: 'El código de verificación ha expirado. Solicitá uno nuevo.' };
    }
    localStorage.removeItem(STORAGE_LOCAL_VERIFICATIONS_KEY);
  } catch {}

  const localSubs = getLocalSubmissions();
  let sub = localSubs.find(s => s.tp_id === TP_CPEM69_ID && s.email_normalized === normEmail);
  const now = new Date();
  const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  saveStoredSessionToken(token);

  if (!sub) {
    // Asignación equilibrada local
    const counts: Record<number, number> = { 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    localSubs.forEach(s => {
      if (counts[s.assigned_exercise] !== undefined) counts[s.assigned_exercise]++;
    });
    const minCount = Math.min(...Object.values(counts));
    const valid: TPCpem69ExerciseNumber[] = [3, 4, 5, 6, 7];
    const cands = valid.filter(n => counts[n] === minCount);
    const picked = cands[Math.floor(Math.random() * cands.length)];

    const deadline = new Date(now.getTime() + TP_CPEM69_DURATION_MINUTES * 60 * 1000);
    const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

    sub = {
      id,
      tp_id: TP_CPEM69_ID,
      student_name: params.studentName.trim(),
      student_last_name: params.studentLastName.trim(),
      email_original: params.email.trim(),
      email_normalized: normEmail,
      school: selectedSchool,
      division: selectedDivision,
      assigned_exercise: picked,
      started_at: now.toISOString(),
      deadline_at: deadline.toISOString(),
      answers: {},
      status: 'in_progress',
      audit_status: 'no_observations',
      teacher_modifications: [],
      email_sent: false,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    localSubs.push(sub);
    saveLocalSubmissions(localSubs);
  }

  const session: TPCpem69ActiveSession = {
    submissionId: sub.id,
    tpId: TP_CPEM69_ID,
    sessionToken: token,
    student: {
      studentName: sub.student_name,
      studentLastName: sub.student_last_name,
      email: sub.email_original,
      school: sub.school || selectedSchool,
      division: sub.division || selectedDivision
    },
    school: sub.school || selectedSchool,
    division: sub.division || selectedDivision,
    assignedExercise: sub.assigned_exercise,
    startedAt: sub.started_at,
    deadlineAt: sub.deadline_at,
    answers: sub.answers || {},
    status: sub.status
  };

  saveStoredTPSession(session);
  return { success: true, session };
}

/**
 * 3. AUTO-GUARDADO DE RESPUESTAS
 * Requiere la credencial de sesión para autorizar la actualización en Supabase.
 */
export async function autoSaveAnswers(
  submissionId: string,
  answers: Record<string, string>
): Promise<{ success: boolean; isExpired?: boolean; error?: string }> {
  const current = getStoredTPSession();
  const token = getStoredSessionToken() || current?.sessionToken || '';

  if (current && current.submissionId === submissionId) {
    current.answers = answers;
    saveStoredTPSession(current);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('save_tp_cpem69_answers', {
        p_submission_id: submissionId,
        p_session_token: token,
        p_answers: answers
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.status === 'expired') {
        if (current) {
          current.status = 'expired';
          saveStoredTPSession(current);
        }
        return { success: false, isExpired: true, error: data.message };
      }

      return { success: data?.success ?? true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  // Contingencia local
  const subs = getLocalSubmissions();
  const sub = subs.find(s => s.id === submissionId);
  if (sub) {
    if (new Date() > new Date(sub.deadline_at)) {
      sub.status = 'expired';
      saveLocalSubmissions(subs);
      return { success: false, isExpired: true, error: 'Tiempo de 90 minutos expirado.' };
    }
    sub.answers = answers;
    sub.updated_at = new Date().toISOString();
    saveLocalSubmissions(subs);
  }

  return { success: true };
}

/**
 * 4. ENTREGA FINAL DEFINITIVA
 * Requiere la credencial de sesión para autorizar la entrega en Supabase.
 * Controla en el servidor que la entrega no esté vencida ni duplicada.
 */
export async function submitTP(
  submissionId: string,
  answers: Record<string, string>
): Promise<{
  success: boolean;
  isExpired?: boolean;
  score?: number;
  auditStatus?: string;
  error?: string;
}> {
  const current = getStoredTPSession();
  const token = getStoredSessionToken() || current?.sessionToken || '';

  if (isSupabaseConfigured() && supabase) {
    try {
      // Paso A: Entrega atómica controlada por el servidor
      const { data: submitData, error: submitError } = await supabase.rpc('submit_tp_cpem69', {
        p_submission_id: submissionId,
        p_session_token: token,
        p_answers: answers
      });

      if (submitError) {
        return { success: false, error: submitError.message || 'Error al registrar la entrega.' };
      }

      if (!submitData?.success) {
        if (submitData?.status === 'expired') {
          if (current) {
            current.status = 'expired';
            current.answers = answers;
            saveStoredTPSession(current);
          }
          return {
            success: false,
            isExpired: true,
            error: submitData.message || 'El plazo de 90 minutos ha expirado.'
          };
        }
        return {
          success: false,
          error: submitData?.message || submitData?.error || 'Error al registrar la entrega.'
        };
      }

      if (current) {
        current.answers = answers;
        current.status = 'submitted';
        current.submittedAt = submitData?.submitted_at || new Date().toISOString();
        saveStoredTPSession(current);
      }

      // Paso B: Invocar Edge Function de IA
      try {
        const { data: gradeData, error: gradeError } = await supabase.functions.invoke(
          'grade-tp-cpem69',
          {
            body: { submission_id: submissionId }
          }
        );

        if (!gradeError && gradeData?.success) {
          if (current) {
            current.status = 'graded';
            current.score = gradeData.score;
            current.auditStatus = gradeData.audit_status;
            saveStoredTPSession(current);
          }
          return {
            success: true,
            score: gradeData.score,
            auditStatus: gradeData.audit_status
          };
        }
      } catch (fnErr) {
        console.warn('[TPCpem69Service] Invocación Edge Function diferida:', fnErr);
      }

      return {
        success: true,
        score: submitData?.score,
        auditStatus: submitData?.audit_status
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error al entregar.' };
    }
  }

  // Contingencia local
  const subs = getLocalSubmissions();
  const sub = subs.find(s => s.id === submissionId);
  if (sub) {
    if (new Date() > new Date(sub.deadline_at)) {
      sub.status = 'expired';
      saveLocalSubmissions(subs);
      return { success: false, isExpired: true, error: 'Tiempo de 90 minutos expirado.' };
    }
    sub.answers = answers;
    sub.status = 'submitted';
    sub.submitted_at = new Date().toISOString();
    saveLocalSubmissions(subs);
  }

  if (current) {
    current.status = 'submitted';
    current.submittedAt = new Date().toISOString();
    saveStoredTPSession(current);
  }

  return { success: true };
}

/**
 * 5. CONSULTA DE ESTADO INDIVIDUAL PARA EL ALUMNO
 * Protegida: solo retorna datos si la credencial de sesión coincide.
 */
export async function getStudentStatus(
  submissionId: string
): Promise<{
  success: boolean;
  submission?: TPCpem69Submission;
  isExpired?: boolean;
  error?: string;
}> {
  const token = getStoredSessionToken() || '';

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('get_tp_cpem69_student_status', {
        p_submission_id: submissionId,
        p_session_token: token
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data?.success) {
        return { success: false, error: data?.message };
      }

      return {
        success: true,
        submission: data as any,
        isExpired: data.status === 'expired'
      };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  const subs = getLocalSubmissions();
  const found = subs.find(s => s.id === submissionId);
  return { success: true, submission: found };
}

/**
 * 6. CONSULTA PARA PANEL DOCENTE (RESTRINGIDO)
 */
export async function fetchTeacherSubmissions(filters?: {
  exercise?: number;
  status?: string;
  search?: string;
  school?: string;
  division?: string;
}): Promise<{
  success: boolean;
  submissions?: TPCpem69Submission[];
  error?: string;
}> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('get_tp_cpem69_submissions_teacher', {
        p_tp_id: TP_CPEM69_ID,
        p_exercise: filters?.exercise || null,
        p_status: filters?.status || null,
        p_search: filters?.search || null,
        p_school: (filters?.school && filters.school !== 'all') ? filters.school : null,
        p_division: (filters?.division && filters.division !== 'all') ? filters.division : null
      });

      if (!error) {
        return { success: true, submissions: Array.isArray(data) ? data : [] };
      }

      return { success: false, error: error?.message || 'Error al obtener entregas.' };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  // Contingencia local
  let filtered = getLocalSubmissions().filter(s => s.tp_id === TP_CPEM69_ID);
  if (filters?.school && filters.school !== 'all') {
    filtered = filtered.filter(s => s.school === filters.school);
  }
  if (filters?.division && filters.division !== 'all') {
    filtered = filtered.filter(s => s.division === filters.division);
  }
  if (filters?.exercise) {
    filtered = filtered.filter(s => s.assigned_exercise === filters.exercise);
  }
  if (filters?.status) {
    filtered = filtered.filter(s => s.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      s =>
        s.student_name.toLowerCase().includes(q) ||
        s.student_last_name.toLowerCase().includes(q) ||
        s.email_original.toLowerCase().includes(q)
    );
  }

  return { success: true, submissions: filtered };
}

/**
 * 7. MODIFICACIÓN DOCENTE DE NOTA CON HISTORIAL COMPLETO E INMUTABLE
 */
export async function overrideTeacherGrade(params: {
  submissionId: string;
  newScore: number;
  motive: string;
  teacherEmail?: string;
  oralResult?: 'approved' | 'failed' | 'pending';
}): Promise<{ success: boolean; error?: string }> {
  if (params.newScore < 0 || params.newScore > 10) {
    return { success: false, error: 'La calificación debe estar entre 0.0 y 10.0.' };
  }

  if (!params.motive.trim()) {
    return { success: false, error: 'Es obligatorio indicar el motivo de la modificación.' };
  }

  // PostgreSQL valida estrictamente: IF p_oral_exam_result IS NOT NULL AND p_oral_exam_result NOT IN ('approved', 'failed')
  // Por lo tanto, si oralResult es 'pending' o undefined, debe enviarse como null.
  const sanitizedOralResult = (params.oralResult === 'approved' || params.oralResult === 'failed')
    ? params.oralResult
    : null;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.rpc('override_tp_cpem69_grade', {
        p_submission_id: params.submissionId,
        p_new_score: params.newScore,
        p_motive: params.motive.trim(),
        p_oral_exam_result: sanitizedOralResult
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: data?.success ?? true };
    } catch (err: any) {
      return { success: false, error: err?.message };
    }
  }

  // Contingencia local
  const subs = getLocalSubmissions();
  const sub = subs.find(s => s.id === params.submissionId);
  if (sub) {
    const newEntry: TPCpem69TeacherOverride = {
      originalScore: sub.score ?? 0,
      newScore: params.newScore,
      motive: params.motive.trim(),
      teacherEmail: params.teacherEmail || 'docente_local',
      overriddenAt: new Date().toISOString(),
      oralExamResult: sanitizedOralResult || undefined
    };

    let history: TPCpem69TeacherOverride[] = [];
    if (Array.isArray(sub.teacher_modifications)) {
      history = [...sub.teacher_modifications, newEntry];
    } else if (sub.teacher_modifications) {
      history = [sub.teacher_modifications as any, newEntry];
    } else {
      history = [newEntry];
    }

    sub.teacher_modifications = history;
    sub.score = params.newScore;
    sub.updated_at = new Date().toISOString();
    saveLocalSubmissions(subs);
  }
  return { success: true };
}

/**
 * 8. REINTENTO DE CORRECCIÓN POR IA
 */
export async function retryAIGrading(
  submissionId: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('grade-tp-cpem69', {
      body: { submission_id: submissionId, force_regrade: true }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al contactar Edge Function.' };
  }
}

/**
 * 9. REENVÍO DE CORREO
 */
export async function resendStudentEmail(
  submissionId: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('grade-tp-cpem69', {
      body: { submission_id: submissionId, resend_email_only: true }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al reenviar el correo.' };
  }
}
