-- ==============================================================================
-- Migración: Seguridad Integral del Modo Profesor y Disponibilidad Global de Exámenes
-- Archivo: 20260912_exam_security_and_settings.sql
-- ==============================================================================
-- 1. Crea la tabla `public.exam_settings` para controlar qué exámenes están activos
--    de forma global y autoritativa en Supabase (eliminando la dependencia de localStorage).
-- 2. Aplica Row Level Security (RLS) en `exam_settings`:
--    - SELECT: Permitido para todos (anon y authenticated) para que los alumnos
--      consulten en tiempo real qué exámenes están habilitados.
--    - INSERT/UPDATE/DELETE: Restringido exclusivamente al docente autorizado
--      ('senamartin.ismael@gmail.com') y roles administrativos.
-- 3. Pobla el estado inicial: 'exam-1' habilitado (true), 'exam-2' al 'exam-5' bloqueados (false).
-- 4. Ajusta las políticas RLS en `public.exam_attempts`:
--    - INSERT: Alumnos anónimos y autenticados pueden registrar su intento finalizado.
--    - SELECT: Exclusivo para 'senamartin.ismael@gmail.com' (ningún alumno puede leer resultados ajenos).
--    - UPDATE y DELETE: Sin políticas para clientes, denegados por defecto en PostgreSQL.
-- 5. Agrega restricciones de integridad (CHECK constraints) en `public.exam_attempts`:
--    - score: entre 0.00 y 10.00
--    - percentage: entre 0 y 100
--    - attempt_number: entre 1 y 3
--    - duration_seconds: entre 0 y 7200
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. TABLA DE CONFIGURACIÓN Y DISPONIBILIDAD GLOBAL DE EXÁMENES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.exam_settings (
    exam_id TEXT PRIMARY KEY,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;

-- Configurar Replica Identity para emisión completa en Supabase Realtime
ALTER TABLE public.exam_settings REPLICA IDENTITY FULL;

-- Política 1.1: Lectura pública de disponibilidad (alumnos, visitantes, docentes)
DROP POLICY IF EXISTS "exam_settings_select_all" ON public.exam_settings;
CREATE POLICY "exam_settings_select_all"
ON public.exam_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Política 1.2: Inserción exclusiva para docente autorizado
DROP POLICY IF EXISTS "exam_settings_insert_teacher" ON public.exam_settings;
CREATE POLICY "exam_settings_insert_teacher"
ON public.exam_settings
FOR INSERT
TO authenticated
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- Política 1.3: Modificación exclusiva para docente autorizado (habilitar/bloquear)
DROP POLICY IF EXISTS "exam_settings_update_teacher" ON public.exam_settings;
CREATE POLICY "exam_settings_update_teacher"
ON public.exam_settings
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- Política 1.4: Eliminación exclusiva para docente autorizado
DROP POLICY IF EXISTS "exam_settings_delete_teacher" ON public.exam_settings;
CREATE POLICY "exam_settings_delete_teacher"
ON public.exam_settings
FOR DELETE
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- Población inicial: exam-1 habilitado, exam-2 a exam-5 bloqueados
INSERT INTO public.exam_settings (exam_id, is_enabled, updated_at, updated_by) VALUES
    ('exam-1', true, NOW(), 'system_init'),
    ('exam-2', false, NOW(), 'system_init'),
    ('exam-3', false, NOW(), 'system_init'),
    ('exam-4', false, NOW(), 'system_init'),
    ('exam-5', false, NOW(), 'system_init')
ON CONFLICT (exam_id) DO NOTHING;

-- Habilitar Supabase Realtime si la publicación existe en este proyecto
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
              AND schemaname = 'public' 
              AND tablename = 'exam_settings'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_settings;
        END IF;
    END IF;
END $$;

-- ==============================================================================
-- 2. BLINDAJE DE SEGURIDAD EN LA TABLA DE RESULTADOS (exam_attempts)
-- ==============================================================================

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Limpieza exhaustiva de cualquier política anterior de SELECT en exam_attempts
DROP POLICY IF EXISTS "Allow select for all" ON public.exam_attempts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exam_attempts;
DROP POLICY IF EXISTS "exam_attempts_select_policy" ON public.exam_attempts;
DROP POLICY IF EXISTS "Allow public read" ON public.exam_attempts;
DROP POLICY IF EXISTS "Restrict read access to service role and teachers" ON public.exam_attempts;
DROP POLICY IF EXISTS "Restrict read access to authorized teacher" ON public.exam_attempts;

-- Política 2.1: Inserción de intentos terminados por parte de alumnos
DROP POLICY IF EXISTS "Allow insert for anon and authenticated students" ON public.exam_attempts;
CREATE POLICY "Allow insert for anon and authenticated students"
ON public.exam_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política 2.2: Lectura de resultados restringida estrictamente al docente autorizado
CREATE POLICY "Restrict read access to authorized teacher"
ON public.exam_attempts
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- NOTA DE AUDITORÍA:
-- En PostgreSQL con Row Level Security activado, cualquier operación sin política
-- permisiva (como UPDATE o DELETE para 'anon' y 'authenticated') queda AUTOMÁTICAMENTE
-- DENEGADA por defecto a nivel de motor relacional. No es posible que ningún usuario
-- modifique o borre notas desde el cliente.

-- ==============================================================================
-- 3. RESTRICCIONES DE INTEGRIDAD EN exam_attempts (CHECK Constraints)
-- ==============================================================================

-- Sanitización preventiva de registros de prueba existentes para garantizar
-- que la aplicación de los CHECK constraints no falle si hubiera datos previos de prueba.
UPDATE public.exam_attempts SET score = 10.0 WHERE score > 10.0;
UPDATE public.exam_attempts SET score = 0.0 WHERE score < 0.0;
UPDATE public.exam_attempts SET percentage = 100 WHERE percentage > 100;
UPDATE public.exam_attempts SET percentage = 0 WHERE percentage < 0;
UPDATE public.exam_attempts SET attempt_number = 1 WHERE attempt_number < 1 OR attempt_number > 3;
UPDATE public.exam_attempts SET duration_seconds = 7200 WHERE duration_seconds > 7200;
UPDATE public.exam_attempts SET duration_seconds = 0 WHERE duration_seconds < 0;

DO $$
BEGIN
    -- Restricción de nota: entre 0.00 y 10.00
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_score_range' AND conrelid = 'public.exam_attempts'::regclass
    ) THEN
        ALTER TABLE public.exam_attempts
            ADD CONSTRAINT check_score_range CHECK (score >= 0.0 AND score <= 10.0);
    END IF;

    -- Restricción de porcentaje: entre 0 y 100
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_percentage_range' AND conrelid = 'public.exam_attempts'::regclass
    ) THEN
        ALTER TABLE public.exam_attempts
            ADD CONSTRAINT check_percentage_range CHECK (percentage >= 0 AND percentage <= 100);
    END IF;

    -- Restricción de intento: entre 1 y 3
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_attempt_number' AND conrelid = 'public.exam_attempts'::regclass
    ) THEN
        ALTER TABLE public.exam_attempts
            ADD CONSTRAINT check_attempt_number CHECK (attempt_number >= 1 AND attempt_number <= 3);
    END IF;

    -- Restricción de duración: entre 0 y 7200 segundos (máximo 2 horas)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_duration' AND conrelid = 'public.exam_attempts'::regclass
    ) THEN
        ALTER TABLE public.exam_attempts
            ADD CONSTRAINT check_duration CHECK (duration_seconds >= 0 AND duration_seconds <= 7200);
    END IF;
END $$;

COMMIT;
