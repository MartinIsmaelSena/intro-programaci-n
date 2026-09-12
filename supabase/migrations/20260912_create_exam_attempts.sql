-- ==============================================================================
-- Migración: Creación de tabla para intentos de examen (exam_attempts)
-- Fecha: 2026-09-12
-- ==============================================================================
-- Almacena de forma estructurada los intentos de examen completados por los alumnos.
-- Incluye políticas de Row Level Security (RLS) para permitir inserción anónima
-- desde el frontend educativo, restringiendo la lectura pública para proteger
-- la privacidad de las calificaciones individuales de cada alumno.
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    student_last_name TEXT NOT NULL,
    school TEXT NOT NULL,
    course TEXT NOT NULL,
    exam_id TEXT NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    student_key TEXT,
    session_id TEXT,
    score NUMERIC(4,2) NOT NULL, -- Ej: 8.50 sobre 10.00
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 20,
    percentage INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    answers_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Política de Inserción:
-- Permite que los alumnos (clientes anónimos o autenticados) registren su examen finalizado.
DROP POLICY IF EXISTS "Allow insert for anon and authenticated students" ON public.exam_attempts;
CREATE POLICY "Allow insert for anon and authenticated students"
ON public.exam_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política de Consulta (SELECT):
-- Restringe la visualización de calificaciones para evitar accesos no autorizados
-- por parte de otros alumnos. Solo los roles con permisos docentes / service_role
-- tendrán acceso a la lectura de registros.
DROP POLICY IF EXISTS "Restrict read access to service role and teachers" ON public.exam_attempts;
CREATE POLICY "Restrict read access to service role and teachers"
ON public.exam_attempts
FOR SELECT
TO authenticated
USING (
    -- Permite consulta si el usuario cuenta con el rol 'teacher' o 'admin' en su JWT
    (auth.jwt() ->> 'role') IN ('teacher', 'admin', 'service_role')
);

-- Índices de optimización para consultas docentes y reportes
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_completed_at ON public.exam_attempts(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_school_course ON public.exam_attempts(school, course);

COMMIT;
