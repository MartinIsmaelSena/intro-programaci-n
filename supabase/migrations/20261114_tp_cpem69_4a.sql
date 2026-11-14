
-- ==============================================================================
-- MIGRACIÓN: TRABAJO PRÁCTICO CPEM N.º 69 – 4.º A
-- Revisión de seguridad, consistencia y concurrencia
-- Archivo: supabase/migrations/20261114_tp_cpem69_4a.sql
--
-- IMPORTANTE:
-- 1. Revisar esta migración antes de ejecutarla.
-- 2. No contiene claves API ni secretos.
-- 3. Las funciones de backend deben invocarse con service_role.
-- 4. El frontend nunca debe recibir el código OTP antes de enviarlo por email.
-- ==============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==============================================================================
-- 1. CONFIGURACIÓN DEL TRABAJO PRÁCTICO
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tp_cpem69_config (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 90
        CHECK (duration_minutes > 0),
    is_published BOOLEAN NOT NULL DEFAULT true,
    grading_config JSONB NOT NULL DEFAULT
        '{"max_score": 10.0, "questions_count": 5, "points_per_question": 2.0}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.tp_cpem69_config (
    id,
    name,
    course,
    duration_minutes,
    is_published,
    grading_config
)
VALUES (
    'tp-cpem69-4a',
    'Trabajo práctico CPEM N.º 69 – 4.º A',
    '4.º A',
    90,
    true,
    '{"max_score": 10.0, "questions_count": 5, "points_per_question": 2.0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    course = EXCLUDED.course,
    duration_minutes = EXCLUDED.duration_minutes,
    updated_at = NOW();


-- ==============================================================================
-- 2. DISTRIBUCIÓN EQUILIBRADA DE EJERCICIOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tp_cpem69_distribution (
    exercise_number INT PRIMARY KEY
        CHECK (exercise_number BETWEEN 3 AND 7),
    assignment_count INT NOT NULL DEFAULT 0
        CHECK (assignment_count >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.tp_cpem69_distribution (
    exercise_number,
    assignment_count
)
VALUES
    (3, 0),
    (4, 0),
    (5, 0),
    (6, 0),
    (7, 0)
ON CONFLICT (exercise_number) DO NOTHING;


-- ==============================================================================
-- 3. VERIFICACIÓN DE IDENTIDAD POR CÓDIGO OTP
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tp_cpem69_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_normalized TEXT NOT NULL UNIQUE,
    verification_code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts_left INT NOT NULL DEFAULT 3
        CHECK (attempts_left >= 0),
    verified BOOLEAN NOT NULL DEFAULT false,
    request_count INT NOT NULL DEFAULT 1
        CHECK (request_count >= 0),
    last_requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compatibilidad con tablas creadas en versiones anteriores.
ALTER TABLE public.tp_cpem69_verifications
    ADD COLUMN IF NOT EXISTS request_count INT NOT NULL DEFAULT 1;

ALTER TABLE public.tp_cpem69_verifications
    ADD COLUMN IF NOT EXISTS last_requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_verif_email
    ON public.tp_cpem69_verifications(email_normalized);


-- ==============================================================================
-- 4. ENTREGAS Y RESULTADOS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.tp_cpem69_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tp_id TEXT NOT NULL
        REFERENCES public.tp_cpem69_config(id)
        ON DELETE RESTRICT,

    student_name TEXT NOT NULL,
    student_last_name TEXT NOT NULL,

    school TEXT NOT NULL DEFAULT 'CPEM N.º 69'
        CHECK (school IN ('CPEM N.º 69', 'CPEM N.º 29')),
    division TEXT NOT NULL DEFAULT '4.º A'
        CHECK (division IN ('4.º A', '4.º B', '4.º C')),

    email_original TEXT NOT NULL,
    email_normalized TEXT NOT NULL,

    assigned_exercise INT NOT NULL
        CHECK (assigned_exercise BETWEEN 3 AND 7),

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deadline_at TIMESTAMPTZ NOT NULL,

    answers JSONB NOT NULL DEFAULT '{}'::jsonb
        CHECK (jsonb_typeof(answers) = 'object'),

    status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (
            status IN (
                'in_progress',
                'submitted',
                'grading',
                'graded',
                'error_grading',
                'expired'
            )
        ),

    submitted_at TIMESTAMPTZ,

    score NUMERIC(4,2)
        CHECK (score IS NULL OR (score >= 0 AND score <= 10)),

    ai_correction JSONB,
    ai_feedback TEXT,

    audit_status TEXT NOT NULL DEFAULT 'no_observations'
        CHECK (
            audit_status IN (
                'no_observations',
                'requires_review',
                'oral_exam'
            )
        ),

    audit_observations JSONB NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(audit_observations) = 'array'),

    teacher_modifications JSONB NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(teacher_modifications) = 'array'),

    session_token_hash TEXT,

    email_sent BOOLEAN NOT NULL DEFAULT false,
    email_sent_at TIMESTAMPTZ,
    email_error TEXT,

    graded_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tp_cpem69_submission
        UNIQUE (tp_id, email_normalized)
);

ALTER TABLE public.tp_cpem69_submissions
    ADD COLUMN IF NOT EXISTS school TEXT NOT NULL DEFAULT 'CPEM N.º 69'
        CHECK (school IN ('CPEM N.º 69', 'CPEM N.º 29'));

ALTER TABLE public.tp_cpem69_submissions
    ADD COLUMN IF NOT EXISTS division TEXT NOT NULL DEFAULT '4.º A'
        CHECK (division IN ('4.º A', '4.º B', '4.º C'));

ALTER TABLE public.tp_cpem69_verifications
    ADD COLUMN IF NOT EXISTS school TEXT
        CHECK (school IS NULL OR school IN ('CPEM N.º 69', 'CPEM N.º 29'));

ALTER TABLE public.tp_cpem69_verifications
    ADD COLUMN IF NOT EXISTS division TEXT
        CHECK (division IS NULL OR division IN ('4.º A', '4.º B', '4.º C'));

ALTER TABLE public.tp_cpem69_submissions
    ADD COLUMN IF NOT EXISTS session_token_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_school
    ON public.tp_cpem69_submissions(school);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_division
    ON public.tp_cpem69_submissions(division);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_email_norm
    ON public.tp_cpem69_submissions(tp_id, email_normalized);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_status
    ON public.tp_cpem69_submissions(status);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_assigned_exercise
    ON public.tp_cpem69_submissions(assigned_exercise);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_submitted_at
    ON public.tp_cpem69_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_audit_status
    ON public.tp_cpem69_submissions(audit_status);

CREATE INDEX IF NOT EXISTS idx_tp_cpem69_token_hash
    ON public.tp_cpem69_submissions(session_token_hash);


-- ==============================================================================
-- 5. ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE public.tp_cpem69_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tp_cpem69_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tp_cpem69_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tp_cpem69_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tp_cpem69_config_select_public"
    ON public.tp_cpem69_config;

CREATE POLICY "tp_cpem69_config_select_public"
    ON public.tp_cpem69_config
    FOR SELECT
    TO anon, authenticated
    USING (true);


DROP POLICY IF EXISTS "tp_cpem69_dist_service_all"
    ON public.tp_cpem69_distribution;

CREATE POLICY "tp_cpem69_dist_service_all"
    ON public.tp_cpem69_distribution
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


DROP POLICY IF EXISTS "tp_cpem69_verif_service_all"
    ON public.tp_cpem69_verifications;

CREATE POLICY "tp_cpem69_verif_service_all"
    ON public.tp_cpem69_verifications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


DROP POLICY IF EXISTS "tp_cpem69_sub_service_all"
    ON public.tp_cpem69_submissions;

CREATE POLICY "tp_cpem69_sub_service_all"
    ON public.tp_cpem69_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


DROP POLICY IF EXISTS "tp_cpem69_sub_teacher_read"
    ON public.tp_cpem69_submissions;

CREATE POLICY "tp_cpem69_sub_teacher_read"
    ON public.tp_cpem69_submissions
    FOR SELECT
    TO authenticated
    USING (
        LOWER(COALESCE(auth.jwt() ->> 'email', ''))
        = 'senamartin.ismael@gmail.com'
    );


-- ==============================================================================
-- 6. SOLICITUD DE CÓDIGO OTP
-- EXCLUSIVA PARA SERVICE_ROLE
-- ==============================================================================

DROP FUNCTION IF EXISTS public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.request_tp_cpem69_access_code(
    p_tp_id TEXT,
    p_email TEXT,
    p_student_name TEXT,
    p_student_last_name TEXT,
    p_school TEXT DEFAULT 'CPEM N.º 69',
    p_division TEXT DEFAULT '4.º A'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_is_published BOOLEAN;
    v_existing RECORD;
    v_verif RECORD;
    v_random_bytes BYTEA;
    v_random_int BIGINT;
    v_code TEXT;
    v_code_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_now TIMESTAMPTZ;
BEGIN
    IF COALESCE(auth.jwt() ->> 'role', '') <> 'service_role' THEN
        RAISE EXCEPTION 'Acceso denegado.';
    END IF;

    v_clean_email := LOWER(TRIM(COALESCE(p_email, '')));

    IF v_clean_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_EMAIL',
            'message', 'El formato del correo electrónico es inválido.'
        );
    END IF;

    IF LENGTH(TRIM(COALESCE(p_student_name, ''))) < 2
       OR LENGTH(TRIM(COALESCE(p_student_last_name, ''))) < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_NAME',
            'message', 'Ingresá nombre y apellido válidos.'
        );
    END IF;

    IF p_school IS NULL OR p_school NOT IN ('CPEM N.º 69', 'CPEM N.º 29') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_SCHOOL',
            'message', 'Institución educativa no válida. Debe ser CPEM N.º 69 o CPEM N.º 29.'
        );
    END IF;

    IF p_division IS NULL OR p_division NOT IN ('4.º A', '4.º B', '4.º C') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_DIVISION',
            'message', 'Curso y división no válidos. Debe ser 4.º A, 4.º B o 4.º C.'
        );
    END IF;

    -- Serializa solicitudes simultáneas para el mismo correo.
    PERFORM pg_advisory_xact_lock(
        hashtextextended(v_clean_email, 0)
    );

    v_now := clock_timestamp();

    SELECT is_published
    INTO v_is_published
    FROM public.tp_cpem69_config
    WHERE id = p_tp_id;

    IF NOT FOUND OR NOT v_is_published THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNPUBLISHED',
            'message', 'El Trabajo Práctico no está habilitado.'
        );
    END IF;

    SELECT *
    INTO v_existing
    FROM public.tp_cpem69_submissions
    WHERE tp_id = p_tp_id
      AND email_normalized = v_clean_email;

    IF FOUND THEN
        IF v_existing.status IN (
            'submitted',
            'grading',
            'graded',
            'error_grading'
        ) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'ALREADY_SUBMITTED',
                'message', 'Este trabajo práctico ya fue entregado con este correo.'
            );
        END IF;

        IF v_existing.status = 'expired'
           OR (
               v_existing.status = 'in_progress'
               AND v_now > v_existing.deadline_at
           ) THEN

            IF v_existing.status = 'in_progress' THEN
                UPDATE public.tp_cpem69_submissions
                SET status = 'expired',
                    updated_at = v_now
                WHERE id = v_existing.id
                  AND status = 'in_progress';
            END IF;

            RETURN jsonb_build_object(
                'success', false,
                'error', 'EXPIRED',
                'message', 'El plazo de 90 minutos ha finalizado.'
            );
        END IF;
    END IF;

    SELECT *
    INTO v_verif
    FROM public.tp_cpem69_verifications
    WHERE email_normalized = v_clean_email
    FOR UPDATE;

    IF FOUND THEN
        IF v_now < (
            v_verif.last_requested_at + INTERVAL '60 seconds'
        ) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'RATE_LIMITED',
                'message', 'Esperá al menos 60 segundos antes de solicitar otro código.'
            );
        END IF;

        IF v_verif.last_requested_at > (
            v_now - INTERVAL '1 hour'
        )
        AND v_verif.request_count >= 5 THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'MAX_REQUESTS',
                'message', 'Alcanzaste el límite de solicitudes por hora.'
            );
        END IF;
    END IF;

    -- Código criptográficamente aleatorio de seis dígitos.
    v_random_bytes := gen_random_bytes(4);

    v_random_int :=
        (get_byte(v_random_bytes, 0)::BIGINT * 16777216) +
        (get_byte(v_random_bytes, 1)::BIGINT * 65536) +
        (get_byte(v_random_bytes, 2)::BIGINT * 256) +
        get_byte(v_random_bytes, 3)::BIGINT;

    v_code := LPAD(
        ((v_random_int % 900000) + 100000)::TEXT,
        6,
        '0'
    );

    v_code_hash := encode(
        sha256(convert_to(v_code, 'UTF8')),
        'hex'
    );

    v_expires_at := v_now + INTERVAL '15 minutes';

    INSERT INTO public.tp_cpem69_verifications (
        email_normalized,
        verification_code_hash,
        expires_at,
        attempts_left,
        verified,
        request_count,
        last_requested_at,
        school,
        division,
        updated_at
    )
    VALUES (
        v_clean_email,
        v_code_hash,
        v_expires_at,
        3,
        false,
        1,
        v_now,
        p_school,
        p_division,
        v_now
    )
    ON CONFLICT (email_normalized)
    DO UPDATE SET
        verification_code_hash = EXCLUDED.verification_code_hash,
        expires_at = EXCLUDED.expires_at,
        attempts_left = 3,
        verified = false,
        school = COALESCE(EXCLUDED.school, tp_cpem69_verifications.school),
        division = COALESCE(EXCLUDED.division, tp_cpem69_verifications.division),
        request_count = CASE
            WHEN tp_cpem69_verifications.last_requested_at
                 > v_now - INTERVAL '1 hour'
            THEN tp_cpem69_verifications.request_count + 1
            ELSE 1
        END,
        last_requested_at = v_now,
        updated_at = v_now;

    -- Este código debe ser recibido exclusivamente por la Edge Function
    -- que envía el correo. Nunca debe devolverse directamente al navegador.
    RETURN jsonb_build_object(
        'success', true,
        'code', v_code,
        'email', v_clean_email,
        'school', p_school,
        'division', p_division,
        'expires_at', v_expires_at
    );
END;
$$;


-- ==============================================================================
-- 7. VALIDACIÓN OTP Y CREACIÓN / REANUDACIÓN DE SESIÓN
-- ==============================================================================

DROP FUNCTION IF EXISTS public.verify_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.verify_tp_cpem69_access_code(
    p_tp_id TEXT,
    p_email TEXT,
    p_code TEXT,
    p_student_name TEXT,
    p_student_last_name TEXT,
    p_school TEXT DEFAULT 'CPEM N.º 69',
    p_division TEXT DEFAULT '4.º A'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_clean_email TEXT;
    v_verif RECORD;
    v_code_hash TEXT;
    v_is_published BOOLEAN;
    v_existing RECORD;
    v_raw_token TEXT;
    v_token_hash TEXT;
    v_chosen_exercise INT;
    v_deadline TIMESTAMPTZ;
    v_now TIMESTAMPTZ;
    v_new_id UUID;
BEGIN
    v_clean_email := LOWER(TRIM(COALESCE(p_email, '')));
    v_now := clock_timestamp();

    IF v_clean_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
       OR COALESCE(p_code, '') !~ '^[0-9]{6}$'
       OR LENGTH(TRIM(COALESCE(p_student_name, ''))) < 2
       OR LENGTH(TRIM(COALESCE(p_student_last_name, ''))) < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_INPUT'
        );
    END IF;

    IF p_school IS NULL OR p_school NOT IN ('CPEM N.º 69', 'CPEM N.º 29') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_SCHOOL',
            'message', 'Institución educativa no válida. Debe ser CPEM N.º 69 o CPEM N.º 29.'
        );
    END IF;

    IF p_division IS NULL OR p_division NOT IN ('4.º A', '4.º B', '4.º C') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_DIVISION',
            'message', 'Curso y división no válidos. Debe ser 4.º A, 4.º B o 4.º C.'
        );
    END IF;

    v_code_hash := encode(
        sha256(convert_to(TRIM(p_code), 'UTF8')),
        'hex'
    );

    -- Mismo bloqueo utilizado al solicitar el código.
    PERFORM pg_advisory_xact_lock(
        hashtextextended(v_clean_email, 0)
    );

    SELECT is_published
    INTO v_is_published
    FROM public.tp_cpem69_config
    WHERE id = p_tp_id;

    IF NOT FOUND OR NOT v_is_published THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNPUBLISHED'
        );
    END IF;

    SELECT *
    INTO v_verif
    FROM public.tp_cpem69_verifications
    WHERE email_normalized = v_clean_email
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_CODE',
            'message', 'No se solicitó un código para este correo.'
        );
    END IF;

    IF v_verif.verified OR v_verif.attempts_left <= 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'CODE_ALREADY_USED'
        );
    END IF;

    IF v_now > v_verif.expires_at THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'CODE_EXPIRED'
        );
    END IF;

    -- IS DISTINCT FROM también rechaza valores NULL.
    IF v_verif.verification_code_hash IS DISTINCT FROM v_code_hash THEN
        UPDATE public.tp_cpem69_verifications
        SET attempts_left = GREATEST(attempts_left - 1, 0),
            updated_at = v_now
        WHERE email_normalized = v_clean_email;

        RETURN jsonb_build_object(
            'success', false,
            'error', 'WRONG_CODE',
            'attempts_left', GREATEST(v_verif.attempts_left - 1, 0)
        );
    END IF;

    -- Busca y bloquea la entrega existente.
    SELECT *
    INTO v_existing
    FROM public.tp_cpem69_submissions
    WHERE tp_id = p_tp_id
      AND email_normalized = v_clean_email
    FOR UPDATE;

    IF FOUND THEN
        IF v_existing.status IN (
            'submitted',
            'grading',
            'graded',
            'error_grading'
        ) THEN
            UPDATE public.tp_cpem69_verifications
            SET verified = true,
                attempts_left = 0,
                verification_code_hash = 'CONSUMED_' || gen_random_uuid()::TEXT,
                updated_at = v_now
            WHERE email_normalized = v_clean_email;

            RETURN jsonb_build_object(
                'success', false,
                'already_submitted', true,
                'message', 'Este trabajo práctico ya fue entregado.'
            );
        END IF;

        IF v_existing.status = 'expired'
           OR (
               v_existing.status = 'in_progress'
               AND v_now > v_existing.deadline_at
           ) THEN

            UPDATE public.tp_cpem69_submissions
            SET status = 'expired',
                updated_at = v_now
            WHERE id = v_existing.id
              AND status = 'in_progress';

            RETURN jsonb_build_object(
                'success', false,
                'status', 'expired',
                'message', 'El plazo de 90 minutos ha finalizado.'
            );
        END IF;
    END IF;

    -- Consumo definitivo del código OTP.
    UPDATE public.tp_cpem69_verifications
    SET verified = true,
        attempts_left = 0,
        verification_code_hash = 'CONSUMED_' || gen_random_uuid()::TEXT,
        updated_at = v_now
    WHERE email_normalized = v_clean_email;

    -- Token de sesión aleatorio. Solo se almacena su hash.
    v_raw_token := encode(gen_random_bytes(32), 'hex');

    v_token_hash := encode(
        sha256(convert_to(v_raw_token, 'UTF8')),
        'hex'
    );

    -- Reanudación de una sesión previa.
    IF v_existing.id IS NOT NULL THEN
        UPDATE public.tp_cpem69_submissions
        SET session_token_hash = v_token_hash,
            updated_at = v_now
        WHERE id = v_existing.id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'resumed',
            'submission_id', v_existing.id,
            'session_token', v_raw_token,
            'school', v_existing.school,
            'division', v_existing.division,
            'assigned_exercise', v_existing.assigned_exercise,
            'started_at', v_existing.started_at,
            'deadline_at', v_existing.deadline_at,
            'answers', v_existing.answers,
            'current_status', v_existing.status
        );
    END IF;

    -- Bloqueo global para evitar asignaciones simultáneas desequilibradas.
    PERFORM pg_advisory_xact_lock(
        hashtextextended('tp-cpem69-4a-distribution', 0)
    );

    SELECT exercise_number
    INTO v_chosen_exercise
    FROM public.tp_cpem69_distribution
    ORDER BY assignment_count ASC, RANDOM()
    LIMIT 1
    FOR UPDATE;

    IF v_chosen_exercise IS NULL THEN
        RAISE EXCEPTION 'No hay ejercicios disponibles para asignar.';
    END IF;

    UPDATE public.tp_cpem69_distribution
    SET assignment_count = assignment_count + 1,
        updated_at = v_now
    WHERE exercise_number = v_chosen_exercise;

    v_deadline := v_now + INTERVAL '90 minutes';

    INSERT INTO public.tp_cpem69_submissions (
        tp_id,
        student_name,
        student_last_name,
        email_original,
        email_normalized,
        school,
        division,
        assigned_exercise,
        started_at,
        deadline_at,
        status,
        answers,
        session_token_hash
    )
    VALUES (
        p_tp_id,
        TRIM(p_student_name),
        TRIM(p_student_last_name),
        TRIM(p_email),
        v_clean_email,
        p_school,
        p_division,
        v_chosen_exercise,
        v_now,
        v_deadline,
        'in_progress',
        '{}'::jsonb,
        v_token_hash
    )
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'created',
        'submission_id', v_new_id,
        'session_token', v_raw_token,
        'school', p_school,
        'division', p_division,
        'assigned_exercise', v_chosen_exercise,
        'started_at', v_now,
        'deadline_at', v_deadline,
        'answers', '{}'::jsonb,
        'current_status', 'in_progress'
    );
END;
$$;


-- ==============================================================================
-- 8. AUTO-GUARDADO DE RESPUESTAS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.save_tp_cpem69_answers(
    p_submission_id UUID,
    p_session_token TEXT,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_sub RECORD;
    v_token_hash TEXT;
    v_now TIMESTAMPTZ;
BEGIN
    v_now := clock_timestamp();

    IF COALESCE(p_session_token, '') = ''
       OR p_answers IS NULL
       OR jsonb_typeof(p_answers) <> 'object' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_INPUT',
            'message', 'Los datos enviados no son válidos.'
        );
    END IF;

    v_token_hash := encode(
        sha256(convert_to(p_session_token, 'UTF8')),
        'hex'
    );

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'NOT_FOUND'
        );
    END IF;

    IF v_sub.session_token_hash IS DISTINCT FROM v_token_hash THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED'
        );
    END IF;

    IF v_sub.status <> 'in_progress' THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', v_sub.status,
            'message', 'El trabajo no admite modificaciones.'
        );
    END IF;

    IF v_now > v_sub.deadline_at THEN
        UPDATE public.tp_cpem69_submissions
        SET status = 'expired',
            updated_at = v_now
        WHERE id = p_submission_id;

        RETURN jsonb_build_object(
            'success', false,
            'status', 'expired',
            'message', 'El tiempo límite ha finalizado.'
        );
    END IF;

    UPDATE public.tp_cpem69_submissions
    SET answers = p_answers,
        updated_at = v_now
    WHERE id = p_submission_id;

    RETURN jsonb_build_object(
        'success', true,
        'updated_at', v_now
    );
END;
$$;


-- ==============================================================================
-- 9. ENTREGA FINAL
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.submit_tp_cpem69(
    p_submission_id UUID,
    p_session_token TEXT,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_sub RECORD;
    v_token_hash TEXT;
    v_now TIMESTAMPTZ;
BEGIN
    v_now := clock_timestamp();

    IF COALESCE(p_session_token, '') = ''
       OR p_answers IS NULL
       OR jsonb_typeof(p_answers) <> 'object' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'INVALID_INPUT'
        );
    END IF;

    v_token_hash := encode(
        sha256(convert_to(p_session_token, 'UTF8')),
        'hex'
    );

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'NOT_FOUND'
        );
    END IF;

    IF v_sub.session_token_hash IS DISTINCT FROM v_token_hash THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED'
        );
    END IF;

    IF v_sub.status IN (
        'submitted',
        'grading',
        'graded',
        'error_grading'
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', v_sub.status,
            'message', 'Esta evaluación ya fue entregada.'
        );
    END IF;

    IF v_sub.status = 'expired'
       OR v_now > v_sub.deadline_at THEN

        UPDATE public.tp_cpem69_submissions
        SET status = 'expired',
            answers = p_answers,
            updated_at = v_now
        WHERE id = p_submission_id;

        RETURN jsonb_build_object(
            'success', false,
            'status', 'expired',
            'message', 'El plazo ha expirado. Las respuestas recibidas quedaron cerradas para revisión.'
        );
    END IF;

    UPDATE public.tp_cpem69_submissions
    SET answers = p_answers,
        status = 'submitted',
        submitted_at = v_now,
        updated_at = v_now
    WHERE id = p_submission_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'submitted',
        'submitted_at', v_now
    );
END;
$$;


-- ==============================================================================
-- 10. CONSULTA DEL ESTADO DEL ESTUDIANTE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_tp_cpem69_student_status(
    p_submission_id UUID,
    p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_sub RECORD;
    v_token_hash TEXT;
    v_now TIMESTAMPTZ;
BEGIN
    v_now := clock_timestamp();

    IF COALESCE(p_session_token, '') = '' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED'
        );
    END IF;

    v_token_hash := encode(
        sha256(convert_to(p_session_token, 'UTF8')),
        'hex'
    );

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'NOT_FOUND'
        );
    END IF;

    IF v_sub.session_token_hash IS DISTINCT FROM v_token_hash THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'UNAUTHORIZED'
        );
    END IF;

    IF v_sub.status = 'in_progress'
       AND v_now > v_sub.deadline_at THEN

        UPDATE public.tp_cpem69_submissions
        SET status = 'expired',
            updated_at = v_now
        WHERE id = p_submission_id;

        v_sub.status := 'expired';
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_sub.id,
        'student_name', v_sub.student_name,
        'student_last_name', v_sub.student_last_name,
        'school', v_sub.school,
        'division', v_sub.division,
        'assigned_exercise', v_sub.assigned_exercise,
        'started_at', v_sub.started_at,
        'deadline_at', v_sub.deadline_at,
        'submitted_at', v_sub.submitted_at,
        'status', v_sub.status,
        'score', v_sub.score,
        'audit_status', v_sub.audit_status,
        'ai_correction', v_sub.ai_correction,
        'ai_feedback', v_sub.ai_feedback
    );
END;
$$;


-- ==============================================================================
-- 11. PANEL DOCENTE
-- EXCLUSIVO PARA EL CORREO DOCENTE AUTORIZADO O SERVICE_ROLE
-- ==============================================================================

DROP FUNCTION IF EXISTS public.get_tp_cpem69_submissions_teacher(TEXT, INT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.get_tp_cpem69_submissions_teacher(
    p_tp_id TEXT DEFAULT 'tp-cpem69-4a',
    p_exercise INT DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_search TEXT DEFAULT NULL,
    p_school TEXT DEFAULT NULL,
    p_division TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_jwt JSONB := auth.jwt();
    v_user_email TEXT :=
        LOWER(TRIM(COALESCE(v_jwt ->> 'email', '')));
    v_user_role TEXT :=
        COALESCE(v_jwt ->> 'role', '');
    v_data JSONB;
BEGIN
    IF v_user_role <> 'service_role'
       AND v_user_email <> 'senamartin.ismael@gmail.com' THEN
        RAISE EXCEPTION 'Acceso denegado: solo el docente autorizado puede consultar las entregas.';
    END IF;

    IF p_exercise IS NOT NULL
       AND p_exercise NOT BETWEEN 3 AND 7 THEN
        RAISE EXCEPTION 'Número de ejercicio inválido.';
    END IF;

    IF p_school IS NOT NULL AND p_school NOT IN ('CPEM N.º 69', 'CPEM N.º 29') THEN
        RAISE EXCEPTION 'Filtro de institución no válido.';
    END IF;

    IF p_division IS NOT NULL AND p_division NOT IN ('4.º A', '4.º B', '4.º C') THEN
        RAISE EXCEPTION 'Filtro de división no válido.';
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', s.id,
            'tp_id', s.tp_id,
            'student_name', s.student_name,
            'student_last_name', s.student_last_name,
            'school', s.school,
            'division', s.division,
            'email_original', s.email_original,
            'assigned_exercise', s.assigned_exercise,
            'started_at', s.started_at,
            'deadline_at', s.deadline_at,
            'submitted_at', s.submitted_at,
            'status', s.status,
            'score', s.score,
            'ai_correction', s.ai_correction,
            'ai_feedback', s.ai_feedback,
            'audit_status', s.audit_status,
            'audit_observations', s.audit_observations,
            'teacher_modifications', s.teacher_modifications,
            'email_sent', s.email_sent,
            'email_sent_at', s.email_sent_at,
            'email_error', s.email_error,
            'answers', s.answers,
            'created_at', s.created_at,
            'updated_at', s.updated_at
        )
        ORDER BY s.created_at DESC
    )
    INTO v_data
    FROM public.tp_cpem69_submissions s
    WHERE s.tp_id = p_tp_id
      AND (
          p_school IS NULL
          OR s.school = p_school
      )
      AND (
          p_division IS NULL
          OR s.division = p_division
      )
      AND (
          p_exercise IS NULL
          OR s.assigned_exercise = p_exercise
      )
      AND (
          p_status IS NULL
          OR s.status = p_status
      )
      AND (
          p_search IS NULL
          OR s.student_name ILIKE '%' || p_search || '%'
          OR s.student_last_name ILIKE '%' || p_search || '%'
          OR s.email_original ILIKE '%' || p_search || '%'
      );

    RETURN COALESCE(v_data, '[]'::jsonb);
END;
$$;


-- ==============================================================================
-- 12. MODIFICACIÓN DOCENTE DE NOTA
-- HISTORIAL ACUMULATIVO DE MODIFICACIONES
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.override_tp_cpem69_grade(
    p_submission_id UUID,
    p_new_score NUMERIC,
    p_motive TEXT,
    p_oral_exam_result TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_jwt JSONB := auth.jwt();
    v_user_email TEXT :=
        LOWER(TRIM(COALESCE(v_jwt ->> 'email', '')));
    v_user_role TEXT :=
        COALESCE(v_jwt ->> 'role', '');
    v_sub RECORD;
    v_now TIMESTAMPTZ := clock_timestamp();
    v_new_entry JSONB;
    v_history JSONB;
BEGIN
    IF v_user_role <> 'service_role'
       AND v_user_email <> 'senamartin.ismael@gmail.com' THEN
        RAISE EXCEPTION 'Acceso denegado: solo el docente autorizado puede modificar calificaciones.';
    END IF;

    IF p_new_score IS NULL
       OR p_new_score < 0.0
       OR p_new_score > 10.0 THEN
        RAISE EXCEPTION 'La calificación debe estar entre 0 y 10.';
    END IF;

    IF p_motive IS NULL OR TRIM(p_motive) = '' THEN
        RAISE EXCEPTION 'Es obligatorio ingresar un motivo para modificar la nota.';
    END IF;

    IF p_oral_exam_result IS NOT NULL
       AND p_oral_exam_result NOT IN ('approved', 'failed') THEN
        RAISE EXCEPTION 'El resultado de la instancia oral no es válido.';
    END IF;

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Entrega no encontrada.';
    END IF;

    v_new_entry := jsonb_build_object(
        'originalScore', v_sub.score,
        'newScore', p_new_score,
        'motive', TRIM(p_motive),
        'teacherEmail', CASE
            WHEN v_user_role = 'service_role'
                 AND v_user_email = ''
            THEN 'senamartin.ismael@gmail.com'
            ELSE v_user_email
        END,
        'overriddenAt', v_now,
        'oralExamResult', p_oral_exam_result
    );

    v_history := COALESCE(
        v_sub.teacher_modifications,
        '[]'::jsonb
    ) || jsonb_build_array(v_new_entry);

    UPDATE public.tp_cpem69_submissions
    SET score = p_new_score,
        teacher_modifications = v_history,
        audit_status = CASE
            WHEN p_oral_exam_result = 'approved'
                THEN 'no_observations'
            WHEN p_oral_exam_result = 'failed'
                THEN 'requires_review'
            ELSE audit_status
        END,
        updated_at = v_now
    WHERE id = p_submission_id;

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'new_score', p_new_score,
        'history_length', jsonb_array_length(v_history),
        'updated_at', v_now
    );
END;
$$;


-- ==============================================================================
-- 13. REGISTRO DE CALIFICACIÓN DE INTELIGENCIA ARTIFICIAL
-- EXCLUSIVO SERVICE_ROLE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.update_tp_cpem69_grading_result(
    p_submission_id UUID,
    p_score NUMERIC,
    p_ai_correction JSONB,
    p_ai_feedback TEXT,
    p_audit_status TEXT,
    p_audit_observations JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := clock_timestamp();
    v_sub RECORD;
BEGIN
    IF COALESCE(auth.jwt() ->> 'role', '') <> 'service_role' THEN
        RAISE EXCEPTION 'Acceso denegado: función exclusiva del backend.';
    END IF;

    IF p_score IS NOT NULL
       AND (p_score < 0.0 OR p_score > 10.0) THEN
        RAISE EXCEPTION 'La calificación debe estar entre 0 y 10.';
    END IF;

    IF p_audit_status IS NULL
       OR p_audit_status NOT IN (
           'no_observations',
           'requires_review',
           'oral_exam'
       ) THEN
        RAISE EXCEPTION 'Estado de auditoría inválido.';
    END IF;

    IF p_ai_correction IS NOT NULL
       AND jsonb_typeof(p_ai_correction) NOT IN ('object', 'array') THEN
        RAISE EXCEPTION 'Formato de corrección IA inválido.';
    END IF;

    IF p_audit_observations IS NOT NULL
       AND jsonb_typeof(p_audit_observations) <> 'array' THEN
        RAISE EXCEPTION 'Las observaciones deben ser un arreglo JSON.';
    END IF;

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Entrega no encontrada.';
    END IF;

    IF v_sub.status NOT IN ('submitted', 'grading', 'error_grading') THEN
        RAISE EXCEPTION 'La entrega no se encuentra en un estado válido para calificación.';
    END IF;

    UPDATE public.tp_cpem69_submissions
    SET score = p_score,
        ai_correction = p_ai_correction,
        ai_feedback = p_ai_feedback,
        audit_status = p_audit_status,
        audit_observations = COALESCE(p_audit_observations, '[]'::jsonb),
        status = 'graded',
        graded_at = v_now,
        updated_at = v_now
    WHERE id = p_submission_id;

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'score', p_score,
        'updated_at', v_now
    );
END;
$$;


-- ==============================================================================
-- 14. REGISTRO DE ENVÍO DE EMAIL
-- EXCLUSIVO SERVICE_ROLE
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.mark_tp_cpem69_email_sent(
    p_submission_id UUID,
    p_success BOOLEAN,
    p_error TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
    v_now TIMESTAMPTZ := clock_timestamp();
    v_sub RECORD;
BEGIN
    IF COALESCE(auth.jwt() ->> 'role', '') <> 'service_role' THEN
        RAISE EXCEPTION 'Acceso denegado: función exclusiva del backend.';
    END IF;

    IF p_success IS NULL THEN
        RAISE EXCEPTION 'Debe indicarse si el envío fue exitoso.';
    END IF;

    SELECT *
    INTO v_sub
    FROM public.tp_cpem69_submissions
    WHERE id = p_submission_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Entrega no encontrada.';
    END IF;

    UPDATE public.tp_cpem69_submissions
    SET email_sent = p_success,
        email_sent_at = CASE
            WHEN p_success THEN v_now
            ELSE email_sent_at
        END,
        email_error = CASE
            WHEN NOT p_success THEN LEFT(p_error, 2000)
            ELSE NULL
        END,
        updated_at = v_now
    WHERE id = p_submission_id;

    RETURN jsonb_build_object(
        'success', true,
        'submission_id', p_submission_id,
        'email_sent', p_success,
        'updated_at', v_now
    );
END;
$$;


-- ==============================================================================
-- 15. REVOCACIÓN Y CONCESIÓN DE PERMISOS
-- ==============================================================================

-- 15.1 Revocar EXECUTE a PUBLIC.

REVOKE EXECUTE ON FUNCTION
    public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.verify_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.save_tp_cpem69_answers(UUID, TEXT, JSONB)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.submit_tp_cpem69(UUID, TEXT, JSONB)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.get_tp_cpem69_student_status(UUID, TEXT)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.get_tp_cpem69_submissions_teacher(TEXT, INT, TEXT, TEXT, TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.override_tp_cpem69_grade(UUID, NUMERIC, TEXT, TEXT)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.update_tp_cpem69_grading_result(UUID, NUMERIC, JSONB, TEXT, TEXT, JSONB)
FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION
    public.mark_tp_cpem69_email_sent(UUID, BOOLEAN, TEXT)
FROM PUBLIC;


-- 15.2 Solicitud OTP: solo service_role.

REVOKE EXECUTE ON FUNCTION
    public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.request_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
TO service_role;


-- 15.3 Funciones de alumnos.

GRANT EXECUTE ON FUNCTION
    public.verify_tp_cpem69_access_code(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT)
TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
    public.save_tp_cpem69_answers(UUID, TEXT, JSONB)
TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
    public.submit_tp_cpem69(UUID, TEXT, JSONB)
TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION
    public.get_tp_cpem69_student_status(UUID, TEXT)
TO anon, authenticated, service_role;


-- 15.4 Funciones docentes.

REVOKE EXECUTE ON FUNCTION
    public.get_tp_cpem69_submissions_teacher(TEXT, INT, TEXT, TEXT, TEXT, TEXT)
FROM anon;

GRANT EXECUTE ON FUNCTION
    public.get_tp_cpem69_submissions_teacher(TEXT, INT, TEXT, TEXT, TEXT, TEXT)
TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION
    public.override_tp_cpem69_grade(UUID, NUMERIC, TEXT, TEXT)
FROM anon;

GRANT EXECUTE ON FUNCTION
    public.override_tp_cpem69_grade(UUID, NUMERIC, TEXT, TEXT)
TO authenticated, service_role;


-- 15.5 Funciones internas del backend.

REVOKE EXECUTE ON FUNCTION
    public.update_tp_cpem69_grading_result(UUID, NUMERIC, JSONB, TEXT, TEXT, JSONB)
FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.update_tp_cpem69_grading_result(UUID, NUMERIC, JSONB, TEXT, TEXT, JSONB)
TO service_role;

REVOKE EXECUTE ON FUNCTION
    public.mark_tp_cpem69_email_sent(UUID, BOOLEAN, TEXT)
FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION
    public.mark_tp_cpem69_email_sent(UUID, BOOLEAN, TEXT)
TO service_role;


-- ==============================================================================
-- 16. PRIVILEGIOS DIRECTOS SOBRE LAS TABLAS
-- ==============================================================================

REVOKE ALL ON TABLE
    public.tp_cpem69_config,
    public.tp_cpem69_distribution,
    public.tp_cpem69_verifications,
    public.tp_cpem69_submissions
FROM anon, authenticated;

GRANT SELECT ON TABLE
    public.tp_cpem69_config
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
    public.tp_cpem69_distribution,
    public.tp_cpem69_verifications,
    public.tp_cpem69_submissions
TO service_role;


-- ==============================================================================
-- 17. SUPABASE REALTIME
-- ==============================================================================

ALTER TABLE public.tp_cpem69_submissions
    REPLICA IDENTITY FULL;

ALTER TABLE public.tp_cpem69_config
    REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_publication
        WHERE pubname = 'supabase_realtime'
    ) THEN

        IF NOT EXISTS (
            SELECT 1
            FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'tp_cpem69_submissions'
        ) THEN
            ALTER PUBLICATION supabase_realtime
                ADD TABLE public.tp_cpem69_submissions;
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'tp_cpem69_config'
        ) THEN
            ALTER PUBLICATION supabase_realtime
                ADD TABLE public.tp_cpem69_config;
        END IF;

    END IF;
END;
$$;


-- ==============================================================================
-- FIN DE LA MIGRACIÓN
-- ==============================================================================

COMMIT;
