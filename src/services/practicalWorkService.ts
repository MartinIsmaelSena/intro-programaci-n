import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  PracticalWork,
  PracticalWorkStatus,
  CreatePracticalWorkInput,
  UpdatePracticalWorkInput
} from '../types/practicalWork';
import { AUTHORIZED_TEACHER_EMAIL } from './teacherAuthService';

const LOCAL_STORAGE_KEY = 'python_practical_works_local_v1';

/**
 * Obtiene los trabajos prácticos almacenados localmente como contingencia
 */
function getLocalPracticalWorks(): PracticalWork[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Guarda la lista de trabajos prácticos en el almacenamiento local de contingencia
 */
function saveLocalPracticalWorks(works: PracticalWork[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(works));
  } catch (err) {
    console.warn('[PracticalWorkService] No se pudo guardar en almacenamiento local:', err);
  }
}

/**
 * Consulta la lista de trabajos prácticos disponibles.
 * - Si es docente: recupera todos los trabajos (borrador, habilitado, cerrado).
 * - Si es alumno: recupera únicamente aquellos con estado 'enabled'.
 */
export async function fetchPracticalWorks(
  isTeacher: boolean = false
): Promise<{ success: boolean; data: PracticalWork[]; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    const local = getLocalPracticalWorks();
    const filtered = isTeacher ? local : local.filter(w => w.status === 'enabled');
    return { success: true, data: filtered };
  }

  try {
    let query = supabase
      .from('practical_works')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isTeacher) {
      query = query.eq('status', 'enabled');
    }

    const { data, error } = await query;

    if (error) {
      // Si la tabla aún no existe o hay error de RLS, usamos fallback local sin romper la app
      console.warn('[PracticalWorkService] Error al consultar Supabase, utilizando contingencia:', error.message);
      const local = getLocalPracticalWorks();
      const filtered = isTeacher ? local : local.filter(w => w.status === 'enabled');
      return { success: true, data: filtered, error: error.message };
    }

    return { success: true, data: (data as PracticalWork[]) || [] };
  } catch (err: any) {
    console.error('[PracticalWorkService] Excepción al consultar trabajos prácticos:', err);
    const local = getLocalPracticalWorks();
    const filtered = isTeacher ? local : local.filter(w => w.status === 'enabled');
    return { success: true, data: filtered, error: err.message || 'Error de conexión' };
  }
}

/**
 * Crea un nuevo trabajo práctico en Supabase (o contingencia local).
 * Operación administrativa docente.
 */
export async function createPracticalWork(
  input: CreatePracticalWorkInput,
  teacherEmail?: string
): Promise<{ success: boolean; data?: PracticalWork; error?: string }> {
  const now = new Date().toISOString();
  const newWork: PracticalWork = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'pw_' + Date.now(),
    title: input.title.trim(),
    description: input.description?.trim() || null,
    target_school: input.target_school.trim(),
    target_course: input.target_course?.trim() || null,
    status: input.status,
    created_by: teacherEmail || AUTHORIZED_TEACHER_EMAIL,
    published_at: input.status === 'enabled' ? now : null,
    created_at: now,
    updated_at: now
  };

  if (!isSupabaseConfigured() || !supabase) {
    const local = getLocalPracticalWorks();
    const updated = [newWork, ...local];
    saveLocalPracticalWorks(updated);
    return { success: true, data: newWork };
  }

  try {
    const { data, error } = await supabase
      .from('practical_works')
      .insert({
        title: newWork.title,
        description: newWork.description,
        target_school: newWork.target_school,
        target_course: newWork.target_course,
        status: newWork.status,
        created_by: newWork.created_by,
        published_at: newWork.published_at,
        created_at: newWork.created_at,
        updated_at: newWork.updated_at
      })
      .select()
      .single();

    if (error) {
      console.warn('[PracticalWorkService] Error de Supabase al crear TP. Guardando localmente:', error.message);
      const local = getLocalPracticalWorks();
      saveLocalPracticalWorks([newWork, ...local]);
      return { success: true, data: newWork, error: error.message };
    }

    return { success: true, data: (data as PracticalWork) || newWork };
  } catch (err: any) {
    console.error('[PracticalWorkService] Excepción al crear TP:', err);
    const local = getLocalPracticalWorks();
    saveLocalPracticalWorks([newWork, ...local]);
    return { success: true, data: newWork, error: err.message };
  }
}

/**
 * Actualiza el estado de un trabajo práctico ('draft', 'enabled', 'closed')
 */
export async function updatePracticalWorkStatus(
  id: string,
  newStatus: PracticalWorkStatus
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();

  // Actualizar en contingencia local
  const local = getLocalPracticalWorks();
  const updatedLocal = local.map(w => {
    if (w.id === id) {
      return {
        ...w,
        status: newStatus,
        published_at: newStatus === 'enabled' ? (w.published_at || now) : w.published_at,
        updated_at: now
      };
    }
    return w;
  });
  saveLocalPracticalWorks(updatedLocal);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const payload: any = {
      status: newStatus,
      updated_at: now
    };

    if (newStatus === 'enabled') {
      payload.published_at = now;
    }

    const { error } = await supabase
      .from('practical_works')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión al actualizar estado' };
  }
}

/**
 * Actualiza los datos de cabecera de un trabajo práctico existente
 */
export async function updatePracticalWork(
  id: string,
  input: UpdatePracticalWorkInput
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();

  // Contingencia local
  const local = getLocalPracticalWorks();
  const updatedLocal = local.map(w => {
    if (w.id === id) {
      return {
        ...w,
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.description !== undefined ? { description: input.description.trim() || null } : {}),
        ...(input.target_school !== undefined ? { target_school: input.target_school.trim() } : {}),
        ...(input.target_course !== undefined ? { target_course: input.target_course.trim() || null } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        updated_at: now
      };
    }
    return w;
  });
  saveLocalPracticalWorks(updatedLocal);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const payload: any = { updated_at: now };
    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.description !== undefined) payload.description = input.description.trim() || null;
    if (input.target_school !== undefined) payload.target_school = input.target_school.trim();
    if (input.target_course !== undefined) payload.target_course = input.target_course.trim() || null;
    if (input.status !== undefined) payload.status = input.status;

    const { error } = await supabase
      .from('practical_works')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al actualizar trabajo práctico' };
  }
}

/**
 * Elimina un trabajo práctico (operación docente)
 */
export async function deletePracticalWork(id: string): Promise<{ success: boolean; error?: string }> {
  // Contingencia local
  const local = getLocalPracticalWorks();
  const filtered = local.filter(w => w.id !== id);
  saveLocalPracticalWorks(filtered);

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('practical_works')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al eliminar trabajo práctico' };
  }
}

/**
 * Suscripción en tiempo real a cambios en la tabla practical_works
 */
export function subscribeToPracticalWorks(onUpdate: () => void): () => void {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('public:practical_works')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'practical_works' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn('[PracticalWorkService] Error al suscribir a Realtime:', err);
    return () => {};
  }
}
