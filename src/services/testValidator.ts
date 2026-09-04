import { TestCase } from '../types/course';
import { runPythonCode } from './pythonRunner';

export interface TestEvaluationResult {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: Array<{
    name: string;
    passed: boolean;
    actualOutput: string;
    expectedDescription: string;
    feedbackMessage: string;
  }>;
}

export async function validateExercise(
  code: string,
  testCases: TestCase[]
): Promise<TestEvaluationResult> {
  const results: TestEvaluationResult['results'] = [];
  let passedCount = 0;

  for (const testCase of testCases) {
    try {
      const execResult = await runPythonCode(code, {
        inputs: testCase.inputs ? [...testCase.inputs] : undefined,
      });

      if (!execResult.success) {
        results.push({
          name: testCase.name,
          passed: false,
          actualOutput: execResult.stderr || execResult.error || 'Error al ejecutar',
          expectedDescription: testCase.description || 'El código debe ejecutarse sin errores',
          feedbackMessage: execResult.friendlyError?.title
            ? `${execResult.friendlyError.title}. ${execResult.friendlyError.tip}`
            : 'El código generó un error durante la ejecución.'
        });
        continue;
      }

      const actualOut = execResult.stdout.trim();
      let passed = false;
      let feedback = '';

      if (testCase.expectedOutputPattern) {
        const regex = new RegExp(testCase.expectedOutputPattern, 'i');
        passed = regex.test(actualOut);
        if (!passed) {
          feedback = `Se esperaba un resultado coincidente con: "${testCase.expectedOutputPattern}". Tu programa imprimió: "${actualOut}"`;
        } else {
          feedback = '¡Resultado correcto!';
        }
      } else if (testCase.expectedOutputs && testCase.expectedOutputs.length > 0) {
        // Output must contain all expected substrings or exact match
        const allIncluded = testCase.expectedOutputs.every(expected =>
          actualOut.toLowerCase().includes(expected.toLowerCase())
        );
        passed = allIncluded;
        if (!passed) {
          feedback = `Se esperaba que la salida incluyera: ${testCase.expectedOutputs.map(o => `"${o}"`).join(', ')}. Tu programa imprimió: "${actualOut}"`;
        } else {
          feedback = '¡Todos los datos esperados están presentes!';
        }
      } else {
        // Just checking execution without crash
        passed = execResult.success;
        feedback = passed ? '¡Ejecución exitosa!' : 'Error de ejecución.';
      }

      if (passed) passedCount++;

      results.push({
        name: testCase.name,
        passed,
        actualOutput: actualOut,
        expectedDescription: testCase.description || 'Comportamiento esperado según la consigna',
        feedbackMessage: feedback
      });
    } catch (err: any) {
      results.push({
        name: testCase.name,
        passed: false,
        actualOutput: String(err?.message || err),
        expectedDescription: testCase.description || 'Ejecución limpia',
        feedbackMessage: 'Ocurrió un error inesperado al evaluar la prueba.'
      });
    }
  }

  return {
    allPassed: passedCount === testCases.length && testCases.length > 0,
    passedCount,
    totalCount: testCases.length,
    results
  };
}
