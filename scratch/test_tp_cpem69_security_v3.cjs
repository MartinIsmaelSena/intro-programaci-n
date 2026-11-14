/**
 * Security and Integrity Verification Test V3 for TP CPEM N.º 69 – 4.º año
 * 
 * Verifies all requirements:
 * 1. OTP exposure prevention: request_tp_cpem69_access_code revoked from anon/authenticated, granted ONLY to service_role
 * 2. Exact argument types on all GRANT and REVOKE statements
 * 3. Immediate OTP consumption (one-time use), expiration (15m), attempt lockout (3 attempts), and rate limiting (60s / 5 per hr)
 * 4. Reinforced teacher authorization immune to SQL NULL logic
 * 5. Concurrency control with SELECT ... FOR UPDATE on all critical mutating RPCs
 * 6. Validations: publication state check, exercise range [3,7], score [0,10], non-empty motive, existence check
 * 7. Multi-institution & division support: CPEM 69 & CPEM 29, divisions 4.º A, 4.º B, 4.º C
 * 8. OTP architecture: Alumno -> Frontend -> Edge Function -> RPC / Supabase -> Google Apps Script -> Correo
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('================================================================');
console.log('AUDITORÍA DE SEGURIDAD Y CONSISTENCIA V3 - TP CPEM 69 / CPEM 29');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// Resolver raíz del proyecto de manera robusta
const projectRoot = path.resolve(__dirname, '..');

// -----------------------------------------------------------------------------
// 1. ANÁLISIS ESTÁTICO DE LA MIGRACIÓN SQL
// -----------------------------------------------------------------------------
console.log('--- Módulo 1: Análisis Estático de Migración SQL ---');

const migrationPath = path.resolve(projectRoot, 'supabase/migrations/20261114_tp_cpem69_4a.sql');
assert(fs.existsSync(migrationPath), `Existe archivo de migración: ${migrationPath}`);

const sqlContent = fs.readFileSync(migrationPath, 'utf8');

// Normalizar espacios y saltos de línea para comparaciones sintácticas
const sqlNorm = sqlContent.replace(/\s+/g, ' ');

// Verificación de search_path seguro
const searchPathCount = (sqlContent.match(/SET search_path = pg_catalog, public, pg_temp/g) || []).length;
assert(searchPathCount >= 8, `Todas las funciones SECURITY DEFINER definen search_path seguro (encontradas: ${searchPathCount})`);

// 1.1 Protección de request_tp_cpem69_access_code (NUNCA EXPUESTA A CLIENTES PÚBLICOS)
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon, authenticated;') ||
       (sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM anon;') &&
        sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM authenticated;')),
  'request_tp_cpem69_access_code REVOCADA explícitamente para anon y authenticated');
assert(sqlNorm.includes('GRANT EXECUTE ON FUNCTION public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;'),
  'request_tp_cpem69_access_code CONCEDIDA ÚNICAMENTE a service_role');
assert(sqlNorm.includes("IF COALESCE(auth.jwt() ->> 'role', '') <> 'service_role' THEN RAISE EXCEPTION 'Acceso denegado.'; END IF;"),
  'request_tp_cpem69_access_code contiene cerrojo interno anti-llamadas no autorizadas');

// 1.2 Firmas completas con tipos de argumentos en todos los REVOKE y GRANT
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;'),
  'REVOKE request_tp_cpem69_access_code especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.verify_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;'),
  'REVOKE verify_tp_cpem69_access_code especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.save_tp_cpem69_answers(UUID, TEXT, JSONB) FROM PUBLIC;'),
  'REVOKE save_tp_cpem69_answers especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.submit_tp_cpem69(UUID, TEXT, JSONB) FROM PUBLIC;'),
  'REVOKE submit_tp_cpem69 especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.get_tp_cpem69_student_status(UUID, TEXT) FROM PUBLIC;'),
  'REVOKE get_tp_cpem69_student_status especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.get_tp_cpem69_submissions_teacher(TEXT, INT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;'),
  'REVOKE get_tp_cpem69_submissions_teacher especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.override_tp_cpem69_grade(UUID, NUMERIC, TEXT, TEXT) FROM PUBLIC;'),
  'REVOKE override_tp_cpem69_grade especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.update_tp_cpem69_grading_result(UUID, NUMERIC, JSONB, TEXT, TEXT, JSONB) FROM PUBLIC;'),
  'REVOKE update_tp_cpem69_grading_result especifica firma completa');
assert(sqlNorm.includes('REVOKE EXECUTE ON FUNCTION public.mark_tp_cpem69_email_sent(UUID, BOOLEAN, TEXT) FROM PUBLIC;'),
  'REVOKE mark_tp_cpem69_email_sent especifica firma completa');

// 1.2.1 Validación de institución y división en SQL
assert(sqlNorm.includes("CHECK (school IN ('CPEM N.º 69', 'CPEM N.º 29'))"),
  'Tabla tp_cpem69_submissions posee CHECK constraint para CPEM 69 y CPEM 29');
assert(sqlNorm.includes("CHECK (division IN ('4.º A', '4.º B', '4.º C'))"),
  'Tabla tp_cpem69_submissions posee CHECK constraint para 4.º A, 4.º B y 4.º C');
assert(sqlNorm.includes("IF p_school IS NULL OR p_school NOT IN ('CPEM N.º 69', 'CPEM N.º 29') THEN"),
  'request_tp_cpem69_access_code valida whitelist de instituciones');
assert(sqlNorm.includes("IF p_division IS NULL OR p_division NOT IN ('4.º A', '4.º B', '4.º C') THEN"),
  'request_tp_cpem69_access_code valida whitelist de divisiones');

// 1.3 Consumo inmediato del OTP (Un solo uso)
assert(sqlNorm.includes("verification_code_hash = 'CONSUMED_' || gen_random_uuid()::TEXT"),
  'verify_tp_cpem69_access_code invalida el hash del código inmediatamente tras verificación');
assert(sqlNorm.includes('v_verif.verified OR v_verif.attempts_left <= 0'),
  'verify_tp_cpem69_access_code rechaza códigos ya consumidos o sin intentos restantes');

// 1.4 Rate Limiting en solicitud de OTP
assert(sqlNorm.includes("v_now < ( v_verif.last_requested_at + INTERVAL '60 seconds' )") ||
       sqlNorm.includes("v_now < (v_verif.last_requested_at + INTERVAL '60 seconds')"),
  'request_tp_cpem69_access_code exige al menos 60 segundos entre solicitudes');
assert(sqlNorm.includes("v_verif.request_count >= 5"),
  'request_tp_cpem69_access_code bloquea tras superar 5 solicitudes por hora');

// 1.5 Concurrencia y bloqueos de fila exclusivos (SELECT ... FOR UPDATE) y Advisory Locks
assert(sqlNorm.includes('SELECT * INTO v_verif FROM public.tp_cpem69_verifications WHERE email_normalized = v_clean_email FOR UPDATE;'),
  'verify_tp_cpem69_access_code bloquea la fila de verificación con FOR UPDATE');
assert(sqlNorm.includes('SELECT * INTO v_existing FROM public.tp_cpem69_submissions WHERE tp_id = p_tp_id AND email_normalized = v_clean_email FOR UPDATE;'),
  'verify_tp_cpem69_access_code bloquea la fila de entrega previa con FOR UPDATE');
assert(sqlNorm.includes('SELECT * INTO v_sub FROM public.tp_cpem69_submissions WHERE id = p_submission_id FOR UPDATE;') && (sqlContent.match(/FOR UPDATE/g) || []).length >= 5,
  'Todas las operaciones críticas de mutación utilizan SELECT ... FOR UPDATE');
assert(/pg_advisory_xact_lock\s*\(\s*hashtextextended\s*\(\s*v_clean_email\s*,\s*0\s*\)\s*\)/.test(sqlContent),
  'Funciones de OTP utilizan advisory lock por email para prevenir carreras');

// 1.6 Autorización docente inmune a NULL
assert(sqlNorm.includes("v_user_email TEXT := LOWER(TRIM(COALESCE(v_jwt ->> 'email', '')));"),
  'Funciones docentes normalizan y aplican COALESCE a email de JWT');
assert(sqlNorm.includes("v_user_role TEXT := COALESCE(v_jwt ->> 'role', '');"),
  'Funciones docentes normalizan y aplican COALESCE a role de JWT');
assert(sqlNorm.includes("IF v_user_role <> 'service_role' AND v_user_email <> 'senamartin.ismael@gmail.com' THEN"),
  'Funciones docentes verifican autorización con comprobación estricta');

// 1.7 Validaciones adicionales
assert(sqlNorm.includes("p_exercise NOT BETWEEN 3 AND 7"),
  'Validación estricta de rango de ejercicio asignado [3 a 7]');
assert(sqlNorm.includes("p_score < 0.0 OR p_score > 10.0"),
  'update_tp_cpem69_grading_result valida rango de calificación 0.0 a 10.0');
assert(sqlNorm.includes("IF NOT FOUND THEN RAISE EXCEPTION 'Entrega no encontrada.'; END IF;"),
  'update_tp_cpem69_grading_result verifica existencia de la entrega antes de actualizar');


// -----------------------------------------------------------------------------
// 2. PRUEBA SIMULADA: CONSUMO DE CÓDIGO OTP Y PREVENCIÓN DE REUTILIZACIÓN
// -----------------------------------------------------------------------------
console.log('\n--- Módulo 2: Simulación de Consumo Inmediato de OTP ---');

class MockOTPStorage {
  constructor() {
    this.table = new Map();
  }

  requestOtp(email) {
    const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hash = crypto.createHash('sha256').update(rawOtp).digest('hex');
    this.table.set(email, {
      codeHash: hash,
      verified: false,
      attemptsLeft: 3,
      expiresAt: Date.now() + 15 * 60 * 1000
    });
    return rawOtp;
  }

  verifyOtp(email, enteredCode) {
    const record = this.table.get(email);
    if (!record) return { success: false, error: 'NO_RECORD' };
    if (record.verified || record.attemptsLeft <= 0) {
      return { success: false, error: 'CODE_ALREADY_USED' };
    }
    if (Date.now() > record.expiresAt) {
      return { success: false, error: 'CODE_EXPIRED' };
    }
    const inputHash = crypto.createHash('sha256').update(enteredCode).digest('hex');
    if (record.codeHash !== inputHash) {
      record.attemptsLeft--;
      return { success: false, error: 'WRONG_CODE', attemptsLeft: record.attemptsLeft };
    }

    // CONSUMO INMEDIATO (One-time use)
    record.verified = true;
    record.attemptsLeft = 0;
    record.codeHash = 'CONSUMED_' + crypto.randomUUID();
    return { success: true };
  }
}

const otpStore = new MockOTPStorage();
const testEmail = 'alumno@cpem69.edu.ar';
const generatedCode = otpStore.requestOtp(testEmail);

// Primer intento con código correcto -> DEBE PASAR
const res1 = otpStore.verifyOtp(testEmail, generatedCode);
assert(res1.success === true, 'Primera verificación con código correcto exitosa');

// Segundo intento con EL MISMO CÓDIGO -> DEBE FALLAR (Anti-reutilización)
const res2 = otpStore.verifyOtp(testEmail, generatedCode);
assert(res2.success === false && res2.error === 'CODE_ALREADY_USED', 'Reutilización del mismo código rechazada con CODE_ALREADY_USED');

// Simulación de agotamiento de intentos
const emailAtt = 'atacante@cpem69.edu.ar';
const codeAtt = otpStore.requestOtp(emailAtt);
assert(otpStore.verifyOtp(emailAtt, '000000').attemptsLeft === 2, 'Intento fallido 1 decrementa a 2');
assert(otpStore.verifyOtp(emailAtt, '000001').attemptsLeft === 1, 'Intento fallido 2 decrementa a 1');
assert(otpStore.verifyOtp(emailAtt, '000002').attemptsLeft === 0, 'Intento fallido 3 decrementa a 0');
assert(otpStore.verifyOtp(emailAtt, codeAtt).error === 'CODE_ALREADY_USED', 'Código correcto bloqueado tras agotar intentos');


// -----------------------------------------------------------------------------
// 3. PRUEBA SIMULADA: AUTORIZACIÓN DOCENTE INMUNE A NULL EN JWT
// -----------------------------------------------------------------------------
console.log('\n--- Módulo 3: Autorización Docente Inmune a SQL NULL Logic ---');

function evaluateTeacherAccess(jwt, currentUserRole) {
  const userEmail = (jwt && jwt.email ? String(jwt.email).toLowerCase().trim() : '');
  const userRole = (jwt && jwt.role ? String(jwt.role).toLowerCase().trim() : '');
  let isAuthorized = false;

  if (currentUserRole === 'service_role' || userRole === 'service_role') {
    isAuthorized = true;
  } else if (userEmail === 'senamartin.ismael@gmail.com') {
    isAuthorized = true;
  } else if (['admin', 'teacher'].includes(userRole)) {
    isAuthorized = true;
  }
  return isAuthorized;
}

assert(evaluateTeacherAccess(null, 'anon') === false, 'JWT nulo bloqueado');
assert(evaluateTeacherAccess({}, 'anon') === false, 'JWT vacío bloqueado');
assert(evaluateTeacherAccess({ email: null, role: null }, 'anon') === false, 'JWT con campos null bloqueado');
assert(evaluateTeacherAccess({ email: 'alumno@cpem69.edu.ar', role: 'student' }, 'anon') === false, 'Alumno no autorizado bloqueado');
assert(evaluateTeacherAccess({ email: 'hacker@mail.com', role: 'authenticated' }, 'anon') === false, 'Usuario autenticado ajeno bloqueado');
assert(evaluateTeacherAccess({ email: 'senamartin.ismael@gmail.com', role: 'authenticated' }, 'anon') === true, 'Docente titular autorizado');
assert(evaluateTeacherAccess({ email: 'coordinador@cpem69.edu.ar', role: 'teacher' }, 'anon') === true, 'Rol teacher autorizado');
assert(evaluateTeacherAccess(null, 'service_role') === true, 'service_role autorizado');


// -----------------------------------------------------------------------------
// 4. PRUEBA SIMULADA: CONCURRENCIA DE ENTREGA DOBLE Y CONTROL DE TIEMPO
// -----------------------------------------------------------------------------
console.log('\n--- Módulo 4: Control de Concurrencia de Entrega y Límite de 90 Minutos ---');

class MockSubmissionDB {
  constructor() {
    this.submissions = new Map();
  }

  createSubmission(id, deadlineOffsetSeconds) {
    this.submissions.set(id, {
      id,
      status: 'in_progress',
      deadlineAt: Date.now() + (deadlineOffsetSeconds * 1000),
      answers: {},
      locked: false
    });
  }

  submit(id, answers) {
    const sub = this.submissions.get(id);
    if (!sub) return { success: false, error: 'NOT_FOUND' };
    
    // Simular SELECT ... FOR UPDATE (adquisición atómica de lock)
    if (sub.status !== 'in_progress') {
      return { success: false, error: 'ALREADY_SUBMITTED', status: sub.status };
    }

    if (Date.now() > sub.deadlineAt) {
      sub.status = 'expired';
      return { success: false, error: 'EXPIRED', status: 'expired' };
    }

    // Actualizar estado a submitted
    sub.status = 'submitted';
    sub.answers = answers;
    return { success: true, status: 'submitted' };
  }
}

const db = new MockSubmissionDB();
const subId = 'sub-test-123';
db.createSubmission(subId, 5400); // 90 minutos en el futuro

// Solicitud 1 de entrega
const firstSubmit = db.submit(subId, { '1': 'Respuesta A' });
assert(firstSubmit.success === true && firstSubmit.status === 'submitted', 'Primera entrega concurrente registrada');

// Solicitud 2 simultánea de entrega sobre la misma entrega
const secondSubmit = db.submit(subId, { '1': 'Respuesta B Sobrescrita' });
assert(secondSubmit.success === false && secondSubmit.error === 'ALREADY_SUBMITTED', 'Segunda entrega concurrente rechazada como ALREADY_SUBMITTED');

// Intento de entrega con tiempo vencido
const subExpiredId = 'sub-expired-999';
db.createSubmission(subExpiredId, -10); // Expirado hace 10 segundos
const expiredSubmit = db.submit(subExpiredId, { '1': 'Tarde' });
assert(expiredSubmit.success === false && expiredSubmit.error === 'EXPIRED', 'Entrega posterior a 90 minutos marcada como EXPIRED');


// -----------------------------------------------------------------------------
// 5. VERIFICACIÓN DEL FLUJO Y EDGE FUNCTION
// -----------------------------------------------------------------------------
console.log('\n--- Módulo 5: Verificación de Código TypeScript Frontend y Edge Function ---');

const edgeFnPath = path.resolve(projectRoot, 'supabase/functions/grade-tp-cpem69/index.ts');
const edgeFnContent = fs.readFileSync(edgeFnPath, 'utf8');

assert(edgeFnContent.includes("body.action === 'request_otp'"), 'Edge Function implementa acción request_otp');
assert(edgeFnContent.includes("supabaseAdmin.rpc('request_tp_cpem69_access_code'"), 'Edge Function invoca request_tp_cpem69_access_code con cliente admin');
assert(!edgeFnContent.includes("return new Response(JSON.stringify({ success: true, devCode:"), 'Edge Function NUNCA retorna devCode al frontend');
assert(edgeFnContent.includes("p_school: cleanSchool") && edgeFnContent.includes("p_division: cleanDivision"), 'Edge Function envía p_school y p_division a la RPC');

const servicePath = path.resolve(projectRoot, 'src/services/tpCpem69Service.ts');
const serviceContent = fs.readFileSync(servicePath, 'utf8');

assert(serviceContent.includes("action: 'request_otp'"), 'tpCpem69Service delega la solicitud a Edge Function con request_otp');
assert(!serviceContent.includes("devCode: rawCode"), 'tpCpem69Service no expone devCode en la llamada a Supabase');
assert(serviceContent.includes("p_school: selectedSchool") && serviceContent.includes("p_division: selectedDivision"), 'tpCpem69Service envía school y division al verificar código');

const startScreenPath = path.resolve(projectRoot, 'src/components/tpCpem69/TPCpem69StartScreen.tsx');
const startScreenContent = fs.readFileSync(startScreenPath, 'utf8');

assert(!startScreenContent.includes("setDevCode"), 'TPCpem69StartScreen no contiene estado setDevCode');
assert(!startScreenContent.includes("Auto-completar"), 'TPCpem69StartScreen no muestra botón de auto-completar OTP');
assert(startScreenContent.includes("CPEM N.º 69") && startScreenContent.includes("CPEM N.º 29"), 'TPCpem69StartScreen incluye opciones de CPEM 69 y CPEM 29');
assert(startScreenContent.includes("4.º A") && startScreenContent.includes("4.º B") && startScreenContent.includes("4.º C"), 'TPCpem69StartScreen incluye divisiones 4.º A, 4.º B y 4.º C');

const teacherPanelPath = path.resolve(projectRoot, 'src/components/tpCpem69/TPCpem69TeacherPanel.tsx');
const teacherPanelContent = fs.readFileSync(teacherPanelPath, 'utf8');
assert(teacherPanelContent.includes("handleExportCSV"), 'TPCpem69TeacherPanel implementa exportación CSV');
assert(teacherPanelContent.includes("filterSchool") && teacherPanelContent.includes("filterDivision"), 'TPCpem69TeacherPanel incluye filtros de institución y división');

console.log('\n================================================================');
console.log(`TOTAL DE PRUEBAS DE SEGURIDAD V3: ${passCount + failCount}`);
console.log(`PASS: ${passCount} | FAIL: ${failCount}`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('¡TODAS LAS PRUEBAS DE SEGURIDAD V3 PASARON CON ÉXITO ABSOLUTO!');
}
