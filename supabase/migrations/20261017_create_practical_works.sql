-- ==============================================================================
-- Migración: Módulo de Trabajos Prácticos y Estructura Preparada de Resultados
-- Archivo: 20261017_create_practical_works.sql
-- ==============================================================================
-- 1. Crea la tabla `public.practical_works` para la gestión y administración
--    docente de trabajos prácticos evaluatorios (sin consignas de prueba).
-- 2. Establece Row Level Security (RLS) en `practical_works`:
--    - SELECT: Alumnos y visitantes pueden consultar trabajos con status = 'enabled'.
--              El docente autorizado ('senamartin.ismael@gmail.com') puede consultar
--              todos (borradores, habilitados y cerrados).
--    - INSERT/UPDATE/DELETE: Restringido estrictamente al docente autorizado
--              y roles administrativos ('admin', 'service_role').
-- 3. Crea la tabla `public.practical_work_submissions` preparada para almacenar
--    futuros resultados y entregas de trabajos prácticos, manteniendo la tabla
--    `exam_attempts` intacta para evitar interferencias con exámenes históricos.
-- 4. Establece Row Level Security (RLS) en `practical_work_submissions`:
--    - INSERT: Alumnos pueden registrar su entrega.
--    - SELECT/UPDATE: Restringido al docente para evaluación y feedback.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. TABLA DE TRABAJOS PRÁCTICOS (practical_works)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.practical_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_school TEXT NOT NULL,
    target_course TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'enabled', 'closed')),
    created_by TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.practical_works ENABLE ROW LEVEL SECURITY;

-- Configurar Replica Identity para emisión completa en Supabase Realtime
ALTER TABLE public.practical_works REPLICA IDENTITY FULL;

-- Política 1.1: Lectura de trabajos prácticos
-- Alumnos y público acceden a los trabajos con status = 'enabled'.
-- El docente autorizado y administradores acceden a todos los registros.
DROP POLICY IF EXISTS "practical_works_select_policy" ON public.practical_works;
CREATE POLICY "practical_works_select_policy"
ON public.practical_works
FOR SELECT
TO anon, authenticated
USING (
    status = 'enabled'
    OR (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Política 1.2: Inserción exclusiva para docente autorizado
DROP POLICY IF EXISTS "practical_works_insert_teacher" ON public.practical_works;
CREATE POLICY "practical_works_insert_teacher"
ON public.practical_works
FOR INSERT
TO authenticated
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Política 1.3: Modificación exclusiva para docente autorizado (cambio de estado / edición)
DROP POLICY IF EXISTS "practical_works_update_teacher" ON public.practical_works;
CREATE POLICY "practical_works_update_teacher"
ON public.practical_works
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Política 1.4: Eliminación exclusiva para docente autorizado
DROP POLICY IF EXISTS "practical_works_delete_teacher" ON public.practical_works;
CREATE POLICY "practical_works_delete_teacher"
ON public.practical_works
FOR DELETE
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Índices de rendimiento para practical_works
CREATE INDEX IF NOT EXISTS idx_practical_works_status ON public.practical_works(status);
CREATE INDEX IF NOT EXISTS idx_practical_works_target_school ON public.practical_works(target_school);
CREATE INDEX IF NOT EXISTS idx_practical_works_created_at ON public.practical_works(created_at DESC);


-- ==============================================================================
-- 2. TABLA PREPARADA PARA RESULTADOS Y ENTREGAS (practical_work_submissions)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.practical_work_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    practical_work_id UUID NOT NULL REFERENCES public.practical_works(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_last_name TEXT NOT NULL,
    school TEXT NOT NULL,
    course TEXT,
    student_key TEXT,
    session_id TEXT,
    answers_payload JSONB,
    score NUMERIC(4,2), -- Calificación docente o automática (0.00 a 10.00)
    teacher_feedback TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.practical_work_submissions ENABLE ROW LEVEL SECURITY;

-- Política 2.1: Inserción de entregas por alumnos (anónimos o autenticados)
DROP POLICY IF EXISTS "practical_work_submissions_insert_student" ON public.practical_work_submissions;
CREATE POLICY "practical_work_submissions_insert_student"
ON public.practical_work_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 2.2: Lectura de resultados restringida al docente autorizado
DROP POLICY IF EXISTS "practical_work_submissions_select_teacher" ON public.practical_work_submissions;
CREATE POLICY "practical_work_submissions_select_teacher"
ON public.practical_work_submissions
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Política 2.3: Calificación y actualización docente
DROP POLICY IF EXISTS "practical_work_submissions_update_teacher" ON public.practical_work_submissions;
CREATE POLICY "practical_work_submissions_update_teacher"
ON public.practical_work_submissions
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'teacher', 'service_role')
);

-- Índices de rendimiento para practical_work_submissions
CREATE INDEX IF NOT EXISTS idx_pw_submissions_work_id ON public.practical_work_submissions(practical_work_id);
CREATE INDEX IF NOT EXISTS idx_pw_submissions_school_course ON public.practical_work_submissions(school, course);
CREATE INDEX IF NOT EXISTS idx_pw_submissions_submitted_at ON public.practical_work_submissions(submitted_at DESC);


-- ==============================================================================
-- 3. HABILITACIÓN DE SUPABASE REALTIME
-- ==============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
              AND schemaname = 'public' 
              AND tablename = 'practical_works'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.practical_works;
        END IF;
    END IF;
END $$;

COMMIT;
