import { ChallengeResult } from '../types/challenge';

const PENDING_STORAGE_KEY = 'python_desde_cero_pending_challenge_results_v1';

/**
 * Checks if the Google Sheets Web App endpoint is configured via environment variables.
 */
export function isSheetsEndpointConfigured(): boolean {
  const endpoint = import.meta.env.VITE_RESULTS_ENDPOINT;
  return Boolean(endpoint && typeof endpoint === 'string' && endpoint.trim().length > 0 && !endpoint.includes('TU_ENDPOINT_AQUI'));
}

/**
 * Gets the configured endpoint URL.
 */
export function getSheetsEndpointUrl(): string {
  return (import.meta.env.VITE_RESULTS_ENDPOINT || '').trim();
}

/**
 * Saves a result locally to the pending queue.
 */
export function savePendingResult(result: ChallengeResult): void {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    const list: ChallengeResult[] = raw ? JSON.parse(raw) : [];
    // Remove if already exists with same challenge & student timestamp
    const filtered = list.filter(r => !(r.challengeId === result.challengeId && r.submittedAt === result.submittedAt));
    filtered.push(result);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error al guardar resultado pendiente en localStorage:', err);
  }
}

/**
 * Retrieves all pending results awaiting synchronization.
 */
export function getPendingResults(): ChallengeResult[] {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Removes a synced result from the pending queue.
 */
export function removePendingResult(submittedAt: string): void {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return;
    const list: ChallengeResult[] = JSON.parse(raw);
    const filtered = list.filter(r => r.submittedAt !== submittedAt);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error al eliminar resultado pendiente:', err);
  }
}

/**
 * Formats duration seconds into MM:SS string
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Sends a ChallengeResult to the configured Google Apps Script Web App endpoint.
 * Returns an updated ChallengeResult with syncStatus 'synced' or 'failed'.
 */
export async function sendChallengeResultToSheets(result: ChallengeResult): Promise<ChallengeResult> {
  const endpoint = getSheetsEndpointUrl();

  // If no endpoint is configured, keep locally as pending and return informative status
  if (!isSheetsEndpointConfigured()) {
    savePendingResult(result);
    return {
      ...result,
      syncStatus: 'pending',
      syncErrorMessage: 'El endpoint de Google Sheets aún no ha sido configurado en el archivo .env (VITE_RESULTS_ENDPOINT). El resultado quedó guardado localmente de forma segura.'
    };
  }

  const payload = {
    fecha: new Date().toLocaleDateString('es-AR'),
    fechaIso: result.submittedAt,
    studentName: result.studentName,
    studentLastName: result.studentLastName,
    school: result.school,
    course: result.course,
    challengeId: result.challengeId,
    challengeTitle: result.challengeTitle,
    score: result.score,
    grade: result.grade,
    percentage: result.percentage,
    startTime: result.startTime,
    endTime: result.endTime,
    duration: formatDuration(result.durationSeconds),
    testsPassed: result.testsPassed,
    testsFailed: result.testsFailed,
    completed: result.completed
  };

  try {
    // We send request to Google Apps Script Web App.
    // Notice: Google Apps Script redirects with 302 on POST.
    // Using standard fetch with body; if CORS prevents reading JSON body, execution still completes on GAS.
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // text/plain avoids CORS preflight OPTIONS in Google Apps Script
      },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.type === 'opaque') {
      removePendingResult(result.submittedAt);
      return {
        ...result,
        syncStatus: 'synced',
        syncErrorMessage: undefined
      };
    } else {
      throw new Error(`Error en el servidor: HTTP ${response.status}`);
    }
  } catch (err: any) {
    console.warn('Fallo de conexión con Google Sheets, guardando en cola pendiente local:', err);
    savePendingResult(result);
    return {
      ...result,
      syncStatus: 'failed',
      syncErrorMessage: err?.message || 'Error de conexión con Google Sheets. Podrás reintentar el envío cuando tengas conexión.'
    };
  }
}
