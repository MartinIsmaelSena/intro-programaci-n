import {
  ActiveTPSession,
  TPEvaluationResult,
  TPStudentData,
  TPModelType,
  TPTheoryBreakdownItem,
  TPPracticalBreakdownItem
} from '../types/practicalWorkSession';
import { getPracticalWorkQuestions, getRandomTPModel } from '../data/practicalWork/practicalWorkModels';
import { validateExercise } from './testValidator';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const TP_SESSION_STORAGE_KEY = 'python_active_tp_session_v1';
export const TP_HISTORY_STORAGE_KEY = 'python_tp_history_v1';

/**
 * Obtiene la sesión de Trabajo Práctico almacenada en localStorage
 */
export function getStoredTPSession(): ActiveTPSession | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(TP_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && Array.isArray(parsed.questions)) {
      return parsed as ActiveTPSession;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Guarda la sesión activa en localStorage
 */
export function saveStoredTPSession(session: ActiveTPSession): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(TP_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Error al persistir sesión de Trabajo Práctico:', err);
  }
}

/**
 * Limpia la sesión activa de localStorage
 */
export function clearStoredTPSession(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(TP_SESSION_STORAGE_KEY);
  } catch {}
}

/**
 * Genera una nueva sesión de Trabajo Práctico con duración fija de 80 minutos
 */
export function generateTPSession(
  studentData: TPStudentData,
  forcedModel?: TPModelType
): ActiveTPSession {
  const model = forcedModel || getRandomTPModel();
  const questions = getPracticalWorkQuestions(model, studentData.modality);

  const initialAnswers: Record<string, number | string> = {};
  questions.forEach(q => {
    if (q.type === 'coding') {
      initialAnswers[q.id] = q.starterCode || '';
    }
  });

  const now = Date.now();
  const durationMinutes = 80;
  // 80 minutos exactos = 4.800 segundos = 4.800.000 milisegundos
  const deadlineTimestamp = now + durationMinutes * 60 * 1000;

  const session: ActiveTPSession = {
    id: `tp_${model.toLowerCase()}_${now}_${Math.random().toString(36).substring(2, 9)}`,
    model,
    student: studentData,
    startTimestamp: now,
    deadlineTimestamp,
    durationMinutes,
    questions,
    answers: initialAnswers,
    submitted: false
  };

  saveStoredTPSession(session);
  return session;
}

/**
 * Corrige de forma exhaustiva y automática una sesión de Trabajo Práctico.
 * Distribución:
 * - Teoría (8 preguntas): 0.5 pts c/u = 4.0 puntos (40%)
 * - Programación práctica (4 ejercicios): 1.5 pts c/u = 6.0 puntos (60%)
 * Total: 10.0 puntos.
 */
export async function gradeTPSession(
  session: ActiveTPSession,
  completionReason: 'manual_submit' | 'timeout' = 'manual_submit'
): Promise<TPEvaluationResult> {
  const theoryBreakdown: TPTheoryBreakdownItem[] = [];
  const practicalBreakdown: TPPracticalBreakdownItem[] = [];

  let correctCount = 0;
  let theoryPoints = 0;
  let practicalPoints = 0;

  const theoryQuestions = session.questions.filter(q => q.type !== 'coding');
  const totalTheory = theoryQuestions.length;
  // 4.0 puntos para teoría distribuidos equitativamente entre las preguntas del intento:
  // - Individual: 16 preguntas teóricas y de lógica -> 0.25 pts c/u (Total: 4.0 pts)
  // - En pareja: 32 preguntas teóricas y de lógica -> 0.125 pts c/u (Total: 4.0 pts)
  const theoryPointsPerQuestion = totalTheory > 0 ? (4.0 / totalTheory) : 0.5;

  const practicalQuestions = session.questions.filter(q => q.type === 'coding');
  const totalPractical = practicalQuestions.length;
  // 6.0 puntos para práctica distribuidos equitativamente entre los ejercicios prácticos:
  // - Individual: 4 ejercicios prácticos -> 1.5 pts c/u (Total: 6.0 pts)
  // - En pareja: 8 ejercicios prácticos -> 0.75 pts c/u (Total: 6.0 pts)
  const practicalPointsPerExercise = totalPractical > 0 ? (6.0 / totalPractical) : 1.5;

  for (const q of session.questions) {
    const userAns = session.answers[q.id];

    if (q.type === 'multiple_choice' || q.type === 'tracing') {
      const selectedIndex = typeof userAns === 'number' ? userAns : undefined;
      const isCorrect = selectedIndex !== undefined && selectedIndex === q.correctAnswer;
      const points = isCorrect ? theoryPointsPerQuestion : 0;

      if (isCorrect) {
        correctCount++;
        theoryPoints += points;
      }

      theoryBreakdown.push({
        questionId: q.id,
        question: q.question,
        topic: q.topic,
        userAnswer: selectedIndex,
        correctAnswer: q.correctAnswer ?? 0,
        correctAnswerText: q.options && q.correctAnswer !== undefined ? q.options[q.correctAnswer] : '',
        userAnswerText: q.options && selectedIndex !== undefined ? q.options[selectedIndex] : 'Sin responder',
        isCorrect,
        pointsObtained: Math.round(points * 100) / 100,
        maxPoints: Math.round(theoryPointsPerQuestion * 100) / 100,
        explanation: q.explanation || 'Respuesta conceptual verificada.'
      });
    } else if (q.type === 'coding') {
      const codeString = typeof userAns === 'string' ? userAns.trim() : '';
      let allPassed = false;
      let passedCount = 0;
      const totalCount = q.testCases?.length || 0;
      let testCasesResults: TPPracticalBreakdownItem['testCasesResults'] = [];

      if (codeString && q.testCases && q.testCases.length > 0) {
        try {
          const evalResult = await validateExercise(codeString, q.testCases);
          allPassed = evalResult.allPassed;
          passedCount = evalResult.passedCount;
          testCasesResults = evalResult.results;
        } catch (err: any) {
          testCasesResults = q.testCases.map(tc => ({
            name: tc.name,
            passed: false,
            actualOutput: 'Error al ejecutar código',
            expectedDescription: tc.description || '',
            feedbackMessage: 'Ocurrió un error al evaluar los casos de prueba.'
          }));
        }
      } else {
        testCasesResults = (q.testCases || []).map(tc => ({
          name: tc.name,
          passed: false,
          actualOutput: 'Sin código entregado',
          expectedDescription: tc.description || '',
          feedbackMessage: 'No se entregó código para este ejercicio.'
        }));
      }

      const exerciseMaxPoints = practicalPointsPerExercise;
      // Puntaje proporcional según casos de prueba superados
      const earnedExercisePoints = totalCount > 0
        ? Math.round((passedCount / totalCount) * exerciseMaxPoints * 100) / 100
        : 0;

      if (allPassed) {
        correctCount++;
      }
      practicalPoints += earnedExercisePoints;

      practicalBreakdown.push({
        questionId: q.id,
        title: q.title || 'Ejercicio práctico',
        description: q.question,
        userCode: typeof userAns === 'string' ? userAns : '',
        allPassed,
        passedCount,
        totalCount,
        pointsObtained: earnedExercisePoints,
        maxPoints: exerciseMaxPoints,
        testCasesResults,
        suggestions: allPassed
          ? '¡Excelente resolución! El código cumple con las consignas y supera todos los casos de prueba.'
          : passedCount > 0
          ? `El programa resuelve ${passedCount} de ${totalCount} casos de prueba. Revisá las condiciones o el formato de salida esperado.`
          : 'El código aún contiene errores de sintaxis, tipos o no produce el resultado esperado.'
      });
    }
  }

  // Duración utilizada
  const now = Date.now();
  const elapsedSeconds = Math.max(0, Math.floor((now - session.startTimestamp) / 1000));
  const durationSeconds = Math.min(4800, elapsedSeconds);

  // Calificación final en escala 0.0 a 10.0
  const rawScore = theoryPoints + practicalPoints;
  const score = Math.round(Math.min(10.0, Math.max(0.0, rawScore)) * 10) / 10;
  const percentage = Math.round((score / 10.0) * 100);
  const passed = score >= 6.0;

  const result: TPEvaluationResult = {
    id: session.id,
    model: session.model,
    student: session.student,
    startedAt: new Date(session.startTimestamp).toISOString(),
    deadlineAt: new Date(session.deadlineTimestamp).toISOString(),
    completedAt: new Date(now).toISOString(),
    durationSeconds,
    completionReason,
    totalQuestions: session.questions.length, // 12
    correctAnswersCount: correctCount,
    score,
    maxScore: 10.0,
    theoryScore: Math.round(theoryPoints * 10) / 10,
    theoryMaxScore: 4.0,
    practicalScore: Math.round(practicalPoints * 10) / 10,
    practicalMaxScore: 6.0,
    percentage,
    passed,
    theoryBreakdown,
    practicalBreakdown
  };

  return result;
}

/**
 * Guarda el resultado del Trabajo Práctico en la tabla existente `exam_attempts` de Supabase.
 * - Respeta las restricciones existentes (score 0-10, duration <= 7200, attempt_number).
 * - Almacena la estructura completa e institucional en `answers_summary`.
 * - Es idempotente.
 */
export async function saveTPAttemptToSupabase(
  evaluation: TPEvaluationResult
): Promise<{ success: boolean; error?: string }> {
  // Guardar copia local en historial del navegador
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(TP_HISTORY_STORAGE_KEY);
      const history: TPEvaluationResult[] = raw ? JSON.parse(raw) : [];
      history.unshift(evaluation);
      localStorage.setItem(TP_HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
    }
  } catch (err) {
    console.warn('Error al persistir historial local de TP:', err);
  }

  if (!isSupabaseConfigured() || !supabase) {
    console.info('[TPService] Supabase no configurado; resultado guardado localmente.');
    return { success: true };
  }

  try {
    const isPair = evaluation.student.modality === 'pareja' && evaluation.student.student2;
    const studentName = isPair
      ? `${evaluation.student.student1.name} y ${evaluation.student.student2!.name}`
      : evaluation.student.student1.name;

    const studentLastName = isPair
      ? `${evaluation.student.student1.lastName} / ${evaluation.student.student2!.lastName}`
      : evaluation.student.student1.lastName;

    const divisionText = evaluation.student.division ? ` ${evaluation.student.division}` : '';
    const courseFormatted = `${evaluation.student.course}${divisionText} (Turno ${evaluation.student.shift})`;

    const studentKey = `${evaluation.student.school}_${evaluation.student.course}_${evaluation.student.student1.lastName}_${evaluation.student.student1.name}`
      .toLowerCase()
      .replace(/\s+/g, '_');

    const answersSummary = {
      evaluation_type: 'trabajo_practico',
      modality: evaluation.student.modality,
      model: evaluation.model,
      institution: {
        school: evaluation.student.school,
        course: evaluation.student.course,
        division: evaluation.student.division || '',
        shift: evaluation.student.shift
      },
      student1: evaluation.student.student1,
      student2: evaluation.student.student2 || null,
      started_at: evaluation.startedAt,
      deadline_at: evaluation.deadlineAt,
      completed_at: evaluation.completedAt,
      completion_reason: evaluation.completionReason,
      scores: {
        total: evaluation.score,
        max: 10.0,
        theory: evaluation.theoryScore,
        theory_max: 4.0,
        practical: evaluation.practicalScore,
        practical_max: 6.0,
        percentage: evaluation.percentage,
        passed: evaluation.passed
      },
      theory_breakdown: evaluation.theoryBreakdown,
      practical_breakdown: evaluation.practicalBreakdown
    };

    const { error } = await supabase.from('exam_attempts').insert({
      student_name: studentName.trim(),
      student_last_name: studentLastName.trim(),
      school: evaluation.student.school.trim(),
      course: courseFormatted.trim(),
      exam_id: `tp-python-modelo-${evaluation.model.toLowerCase()}`,
      attempt_number: 1,
      student_key: studentKey,
      session_id: evaluation.id,
      score: evaluation.score,
      correct_answers: evaluation.correctAnswersCount,
      total_questions: evaluation.totalQuestions,
      percentage: evaluation.percentage,
      duration_seconds: evaluation.durationSeconds,
      started_at: evaluation.startedAt,
      completed_at: evaluation.completedAt,
      answers_summary: answersSummary
    });

    if (error) {
      console.warn('[TPService] Error al guardar intento de TP en Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[TPService] Excepción al guardar intento de TP en Supabase:', err);
    return { success: false, error: err.message || 'Error de conexión' };
  }
}
