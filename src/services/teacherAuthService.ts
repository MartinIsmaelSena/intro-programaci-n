import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ExamAttemptRecord } from '../types/exam';

export const AUTHORIZED_TEACHER_EMAIL = 'senamartin.ismael@gmail.com';

export interface TeacherAuthState {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
}

/**
 * Verifica si un email corresponde al usuario administrador autorizado
 */
export function isAuthorizedTeacherEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_TEACHER_EMAIL.toLowerCase();
}

/**
 * Obtiene el estado actual de la sesión del docente contra Supabase Auth
 */
export async function getTeacherAuthState(): Promise<TeacherAuthState> {
  if (!isSupabaseConfigured() || !supabase) {
    return { isAuthenticated: false, email: null, loading: false };
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session || !session.user) {
      return { isAuthenticated: false, email: null, loading: false };
    }

    const email = session.user.email || null;
    const isAuthorized = isAuthorizedTeacherEmail(email);

    return {
      isAuthenticated: isAuthorized,
      email: isAuthorized ? email : null,
      loading: false
    };
  } catch (err) {
    console.error('[TeacherAuthService] Error al verificar sesión:', err);
    return { isAuthenticated: false, email: null, loading: false };
  }
}

/**
 * Inicia sesión como docente mediante Supabase Auth con email y contraseña
 */
export async function loginTeacher(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Validación previa de autorización
  if (!isAuthorizedTeacherEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Acceso denegado. Este correo no cuenta con permisos de docente/administrador.'
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      return {
        success: false,
        error: error.message === 'Invalid login credentials'
          ? 'Correo electrónico o contraseña incorrectos.'
          : error.message
      };
    }

    if (!data.session || !data.user || !isAuthorizedTeacherEmail(data.user.email)) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Esta cuenta no posee privilegios administrativos.'
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Error de conexión al autenticar.'
    };
  }
}

/**
 * Registra o establece la contraseña inicial para la cuenta docente autorizada
 */
export async function signUpTeacher(email: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!isAuthorizedTeacherEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Registro restringido. Solamente la cuenta del administrador puede crearse como docente.'
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres.'
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.session) {
      return { success: true, message: '¡Cuenta docente configurada e iniciada con éxito!' };
    }

    return {
      success: true,
      message: 'Usuario creado. Si tu proyecto de Supabase tiene confirmación de email activa, revisá tu casilla para verificar la cuenta.'
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al registrar contraseña.' };
  }
}

/**
 * Cierra la sesión del docente en Supabase
 */
export async function logoutTeacher(): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[TeacherAuthService] Error al cerrar sesión:', err);
  }
}

/**
 * Consulta en tiempo real todos los intentos de examen desde Supabase.
 * Debido a la política RLS, solo la cuenta del docente autorizada puede leer estos datos.
 */
export async function fetchRemoteExamAttempts(): Promise<{ success: boolean; data: ExamAttemptRecord[]; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, data: [], error: 'Supabase no configurado.' };
  }

  try {
    const { data, error } = await supabase
      .from('exam_attempts')
      .select('*')
      .order('completed_at', { ascending: false });

    if (error) {
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: (data as ExamAttemptRecord[]) || [] };
  } catch (err: any) {
    return { success: false, data: [], error: err.message || 'Error al obtener intentos remotos.' };
  }
}
