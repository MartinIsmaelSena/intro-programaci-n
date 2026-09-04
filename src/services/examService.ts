import { Exam, ExamUserAnswers, ExamResult, ExamSectionScore } from '../types/exam';
import { validateExercise } from './testValidator';

export async function gradeExam(
  exam: Exam,
  answers: ExamUserAnswers,
  timeSpentSeconds: number
): Promise<ExamResult> {
  const sectionScores: ExamSectionScore[] = [];
  let totalScore = 0;

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
