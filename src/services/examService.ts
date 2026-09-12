import {
  Exam,
  ExamUserAnswers,
  ExamResult,
  ExamSectionScore,
  ActiveExamSession,
  ExamEvaluationResult,
  ExamAttemptRecord
} from '../types/exam';
import { validateExercise } from './testValidator';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Califica de forma exhaustiva una sesión activa de 20 preguntas rotativas.
 * Asigna 0.5 puntos por cada respuesta correcta para un total de 10.0 puntos.
 * Valida de forma asíncrona los ejercicios prácticos de código mediante Pyodide / runner.
 */
export async function gradeActiveExamSession(
  session: ActiveExamSession
): Promise<ExamEvaluationResult> {
  const totalQuestions = session.questions.length;
  let correctCount = 0;
  const breakdown: ExamEvaluationResult['questionBreakdown'] = [];

  for (const q of session.questions) {
    const userAns = session.answers[q.id];
    let isCorrect = false;
    let correctAnswerText = '';

    if (q.type === 'multiple_choice' || q.type === 'tracing') {
      const selectedIndex = typeof userAns === 'number' ? userAns : undefined;
      isCorrect = selectedIndex !== undefined && selectedIndex === q.correctAnswer;
      correctAnswerText = (q.options && q.correctAnswer !== undefined) ? q.options[q.correctAnswer] : '';
    } else if (q.type === 'coding') {
      const codeString = typeof userAns === 'string' ? userAns.trim() : '';
      if (codeString && q.testCases && q.testCases.length > 0) {
        try {
          const evalResult = await validateExercise(codeString, q.testCases);
          isCorrect = evalResult.allPassed;
        } catch {
          isCorrect = false;
        }
      } else {
        isCorrect = false;
      }
      correctAnswerText = 'Código evaluado con casos de prueba automatizados';
    }

    if (isCorrect) {
      correctCount++;
    }

    breakdown.push({
      questionId: q.id,
      question: q.question,
      type: q.type,
      topic: q.topic,
      userAnswer: userAns,
      isCorrect,
      pointsObtained: isCorrect ? (q.points ?? 0.5) : 0,
      explanation: q.explanation,
      correctAnswerText
    });
  }

  const durationSeconds = Math.max(
    0,
    Math.floor((Date.now() - session.startTimestamp) / 1000)
  );

  const score = Math.round((correctCount * 0.5) * 10) / 10; // escala 0.0 a 10.0
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 6.0;

  return {
    examId: session.examId,
    student: session.student,
    attemptNumber: session.attemptNumber || 1,
    completedAt: new Date().toISOString(),
    startedAt: new Date(session.startTimestamp).toISOString(),
    durationSeconds,
    totalQuestions,
    correctAnswersCount: correctCount,
    score,
    maxScore: 10.0,
    percentage,
    passed,
    questionBreakdown: breakdown
  };
}

/**
 * Persiste el intento de examen en la tabla `exam_attempts` de Supabase
 * respetando las políticas de Row Level Security (RLS).
 */
export async function saveExamAttemptToSupabase(
  record: ExamAttemptRecord
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    console.info('[ExamService] Supabase no configurado; se conserva el resultado local.');
    return { success: false, error: 'Supabase no configurado' };
  }

  try {
    const { error } = await supabase.from('exam_attempts').insert({
      student_name: record.student_name.trim(),
      student_last_name: record.student_last_name.trim(),
      school: record.school.trim(),
      course: record.course.trim(),
      exam_id: record.exam_id,
      attempt_number: record.attempt_number || 1,
      student_key: record.student_key || `${record.school}_${record.course}_${record.student_last_name}_${record.student_name}`.toLowerCase(),
      session_id: record.session_id || '',
      score: record.score,
      correct_answers: record.correct_answers,
      total_questions: record.total_questions,
      percentage: record.percentage,
      duration_seconds: record.duration_seconds,
      started_at: record.started_at,
      completed_at: record.completed_at,
      answers_summary: record.answers_summary || {}
    });

    if (error) {
      console.warn('[ExamService] Error al guardar intento en Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[ExamService] Excepción al guardar intento en Supabase:', err);
    return { success: false, error: err.message || 'Error de red' };
  }
}

// ============================================================================
// FUNCIONES RETROCOMPATIBLES (para compatibilidad con exam02...exam05)
// ============================================================================

export async function gradeExam(
  exam: Exam,
  answers: ExamUserAnswers,
  timeSpentSeconds: number
): Promise<ExamResult> {
  const sectionScores: ExamSectionScore[] = [];
  let totalScore = 0;

  if (!exam.sections) {
    return {
      examId: exam.id,
      completedAt: new Date().toISOString(),
      totalScore: 0,
      passed: false,
      timeSpentSeconds,
      sectionScores: []
    };
  }

  // 1. Grade Part A: Theory (20 points)
  let partAPoints = 0;
  let partACorrect = 0;
  exam.sections.partA_theory.forEach(q => {
    const userChoice = answers.theoryAnswers[q.id];
    if (userChoice !== undefined && userChoice === q.correctAnswer) {
      partAPoints += q.points;
      partACorrect++;
    }
  });
  totalScore += partAPoints;
  sectionScores.push({
    name: 'Parte A — Teoría',
    maxPoints: 20,
    obtainedPoints: partAPoints,
    feedback: `${partACorrect} de ${exam.sections.partA_theory.length} preguntas teóricas respondidas correctamente.`
  });

  // 2. Grade Part B: Tracing (20 points)
  let partBPoints = 0;
  let partBCorrect = 0;
  exam.sections.partB_tracing.forEach(q => {
    const userChoice = answers.tracingAnswers[q.id];
    if (userChoice !== undefined && userChoice === q.correctAnswer) {
      partBPoints += q.points;
      partBCorrect++;
    }
  });
  totalScore += partBPoints;
  sectionScores.push({
    name: 'Parte B — Interpretación de código',
    maxPoints: 20,
    obtainedPoints: partBPoints,
    feedback: `${partBCorrect} de ${exam.sections.partB_tracing.length} predicciones de salida correctas.`
  });

  // 3. Grade Part C: Debugging (20 points)
  const partCEval = await validateExercise(
    answers.debuggingCode || '',
    exam.sections.partC_debugging.testCases
  );
  const partCPoints = partCEval.allPassed ? exam.sections.partC_debugging.points : 0;
  totalScore += partCPoints;
  sectionScores.push({
    name: 'Parte C — Corrección de errores',
    maxPoints: 20,
    obtainedPoints: partCPoints,
    feedback: partCEval.allPassed
      ? '¡Bug corregido exitosamente! El código pasa todas las pruebas.'
      : 'El código aún contiene errores de sintaxis o lógica.'
  });

  // 4. Grade Part D: Coding (20 points)
  const partDEval = await validateExercise(
    answers.codingCode || '',
    exam.sections.partD_coding.testCases
  );
  const partDPoints = partDEval.allPassed ? exam.sections.partD_coding.points : 0;
  totalScore += partDPoints;
  sectionScores.push({
    name: 'Parte D — Programación práctica',
    maxPoints: 20,
    obtainedPoints: partDPoints,
    feedback: partDEval.allPassed
      ? '¡Ejercicio práctico resuelto correctamente!'
      : 'El programa no produjo los resultados esperados para los casos de prueba.'
  });

  // 5. Grade Part E: Integrator (20 points)
  const partEEval = await validateExercise(
    answers.integratorCode || '',
    exam.sections.partE_integrator.testCases
  );
  const partEPoints = partEEval.allPassed ? exam.sections.partE_integrator.points : 0;
  totalScore += partEPoints;
  sectionScores.push({
    name: 'Parte E — Problema integrador',
    maxPoints: 20,
    obtainedPoints: partEPoints,
    feedback: partEEval.allPassed
      ? '¡Desafío integrador superado con éxito!'
      : 'El ejercicio integrador requiere revisión en la lógica o salida esperada.'
  });

  return {
    examId: exam.id,
    completedAt: new Date().toISOString(),
    totalScore,
    passed: totalScore >= 60,
    timeSpentSeconds,
    sectionScores
  };
}
