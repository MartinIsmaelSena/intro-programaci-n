-- ==============================================================================
-- 🏆 MIGRACIÓN DEFINITIVA Y AUDITADA: DUELO DE EQUIPOS (FASE 1)
-- Archivo: supabase/migrations/20260913_create_team_duel.sql
-- ==============================================================================
-- SEGURIDAD, INTEGRIDAD E IDEMPOTENCIA:
-- 1. duel_settings: Habilitación global administrada exclusivamente por el docente.
-- 2. duel_matches: Partida de exactamente 10 rondas con PIN UNIQUE de 6 dígitos.
-- 3. duel_teams: Equipos públicos sincronizados en Realtime (sin tokens).
-- 4. duel_team_secrets: Tokens de sesión privados aislados, fuera de Realtime y con RLS estricto.
-- 5. duel_answers: Respuestas protegidas por UNIQUE(match_id, round, team_id),
--    EXCLUIDA de Realtime y con lectura bloqueada para alumnos durante question_active.
-- 6. online_questions_truth: Protegida con RLS estricto; consultada solo por RPCs del servidor.
-- 7. Vista duel_live_progress eliminada: el progreso en vivo se consulta exclusivamente
--    mediante la RPC segura get_duel_live_progress(p_match_id).
-- 8. RPCs seguras (SECURITY DEFINER, SET search_path = public):
--    - create_duel_match(): Genera PIN de 6 dígitos con detección y reintento de colisiones.
--    - join_duel_team(): Serializado con SELECT ... FOR UPDATE sobre duel_matches.
--      Garantiza atómicamente el cupo máximo de 5 equipos ante solicitudes simultáneas.
--    - start_duel_match(): Valida mínimo 2 y máximo 5 equipos, pasa a question_preview.
--    - set_duel_question(): Valida existencia en online_questions_truth y no reutilización.
--    - start_duel_round(): Fija ventana de 30 segundos con clock_timestamp().
--    - submit_duel_answer(): Valida 8 condiciones estrictas, mide tiempo y evalúa en servidor.
--    - resolve_duel_round(): 100% IDEMPOTENTE con FOR UPDATE y filtro estricto question_active.
--      Aplica DENSE_RANK (4, 2, 1 pts) para empates y transiciona atómicamente a round_review.
--    - advance_duel_round(): En rondas 1 a 9 exige p_next_question_id no nulo, valida
--      que no se haya utilizado en rondas anteriores y pasa a question_preview.
--      En ronda 10 finaliza la partida normalmente a status = finished.
--    - get_duel_live_progress(): Expone únicamente (match_id, round_number, team_id, has_answered)
--      para la ronda activa.
--    - heartbeat_duel_team(): Actualiza presencia validando el token de sesión.
-- 9. Realtime seguro y selectivo: únicamente duel_settings, duel_matches y duel_teams.
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. TABLA DE CONFIGURACIÓN GLOBAL: duel_settings
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.duel_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    active_match_id UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT
);

ALTER TABLE public.duel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_settings REPLICA IDENTITY FULL;

DROP POLICY IF EXISTS "duel_settings_select" ON public.duel_settings;
CREATE POLICY "duel_settings_select" ON public.duel_settings
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "duel_settings_manage_teacher" ON public.duel_settings;
CREATE POLICY "duel_settings_manage_teacher" ON public.duel_settings
FOR ALL TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

INSERT INTO public.duel_settings (id, is_enabled, updated_at, updated_by)
VALUES ('global', false, NOW(), 'system_init')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 2. TABLA DE PARTIDAS: duel_matches (Exactamente 10 rondas, PIN UNIQUE)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.duel_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pin VARCHAR(6) NOT NULL,
    status TEXT NOT NULL DEFAULT 'lobby' CHECK (
        status IN ('lobby', 'question_preview', 'question_active', 'round_review', 'finished', 'cancelled')
    ),
    current_round INTEGER NOT NULL DEFAULT 1 CHECK (current_round BETWEEN 1 AND 10),
    total_rounds INTEGER NOT NULL DEFAULT 10 CHECK (total_rounds = 10),
    current_question_id TEXT,
    round_started_at TIMESTAMPTZ,
    round_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL DEFAULT 'senamartin.ismael@gmail.com'
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_duel_matches_unique_pin
ON public.duel_matches(pin);

ALTER TABLE public.duel_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_matches REPLICA IDENTITY FULL;

DROP POLICY IF EXISTS "duel_matches_select" ON public.duel_matches;
CREATE POLICY "duel_matches_select" ON public.duel_matches
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "duel_matches_manage_teacher" ON public.duel_matches;
CREATE POLICY "duel_matches_manage_teacher" ON public.duel_matches
FOR ALL TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_duel_settings_active_match'
    ) THEN
        ALTER TABLE public.duel_settings
            ADD CONSTRAINT fk_duel_settings_active_match
            FOREIGN KEY (active_match_id) REFERENCES public.duel_matches(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ==============================================================================
-- 3. TABLA DE EQUIPOS PÚBLICOS: duel_teams
-- ==============================================================================
-- NOTA DE SEGURIDAD: NO contiene tokens secretos. Es segura para broadcast en Realtime.

CREATE TABLE IF NOT EXISTS public.duel_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.duel_matches(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0 CHECK (total_score >= 0),
    rounds_won INTEGER NOT NULL DEFAULT 0 CHECK (rounds_won >= 0),
    total_time_ms INTEGER NOT NULL DEFAULT 0 CHECK (total_time_ms >= 0),
    status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_duel_teams_unique_name
ON public.duel_teams(match_id, LOWER(TRIM(team_name)));

ALTER TABLE public.duel_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_teams REPLICA IDENTITY FULL;

-- RLS duel_teams:
DROP POLICY IF EXISTS "duel_teams_select" ON public.duel_teams;
CREATE POLICY "duel_teams_select" ON public.duel_teams
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "duel_teams_deny_direct_insert" ON public.duel_teams;
CREATE POLICY "duel_teams_deny_direct_insert" ON public.duel_teams
FOR INSERT TO anon, authenticated
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

DROP POLICY IF EXISTS "duel_teams_update_teacher_only" ON public.duel_teams;
CREATE POLICY "duel_teams_update_teacher_only" ON public.duel_teams
FOR UPDATE TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

DROP POLICY IF EXISTS "duel_teams_delete" ON public.duel_teams;
CREATE POLICY "duel_teams_delete" ON public.duel_teams
FOR DELETE TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- ==============================================================================
-- 4. TABLA PRIVADA DE TOKENS DE SESIÓN: duel_team_secrets
-- ==============================================================================
-- Guarda el session_token de cada equipo en forma completamente aislada.
-- NINGÚN alumno ni usuario anónimo tiene permiso de SELECT sobre esta tabla.
-- NO se agrega a Realtime, imposibilitando que otros alumnos lean el token.

CREATE TABLE IF NOT EXISTS public.duel_team_secrets (
    team_id UUID PRIMARY KEY REFERENCES public.duel_teams(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.duel_team_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "duel_team_secrets_teacher_only" ON public.duel_team_secrets;
CREATE POLICY "duel_team_secrets_teacher_only" ON public.duel_team_secrets
FOR ALL TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
)
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

REVOKE ALL ON public.duel_team_secrets FROM anon;

-- ==============================================================================
-- 5. TABLA DE RESPUESTAS POR RONDA: duel_answers
-- ==============================================================================
-- Restricción fundamental anti-trampa: Un equipo solo puede responder UNA vez por ronda.
-- Lectura pública bloqueada durante question_active para evitar espionaje de opciones.
-- EXCLUIDA de Supabase Realtime para que nadie capture eventos con opciones o tiempos.

CREATE TABLE IF NOT EXISTS public.duel_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.duel_matches(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 10),
    team_id UUID NOT NULL REFERENCES public.duel_teams(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    selected_option INTEGER NOT NULL CHECK (selected_option BETWEEN 0 AND 3),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    response_time_ms INTEGER NOT NULL DEFAULT 0 CHECK (response_time_ms >= 0),
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_awarded INTEGER NOT NULL DEFAULT 0 CHECK (points_awarded IN (0, 1, 2, 4))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_duel_answers_single_per_round
ON public.duel_answers(match_id, round_number, team_id);

ALTER TABLE public.duel_answers ENABLE ROW LEVEL SECURITY;

-- RLS duel_answers:
-- Durante 'question_active', los alumnos NO pueden leer las respuestas de otros.
-- Solo pueden consultarlas cuando la ronda terminó y está en 'round_review' o 'finished'.
DROP POLICY IF EXISTS "duel_answers_select_protected" ON public.duel_answers;
CREATE POLICY "duel_answers_select_protected" ON public.duel_answers
FOR SELECT TO anon, authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
    OR EXISTS (
        SELECT 1 FROM public.duel_matches m
        WHERE m.id = duel_answers.match_id
          AND m.status IN ('round_review', 'finished')
    )
);

-- Inserción, actualización y eliminación directa DENEGADAS a alumnos y anónimos.
-- Toda respuesta DEBE ingresar exclusivamente a través de la RPC submit_duel_answer().
DROP POLICY IF EXISTS "duel_answers_deny_direct_insert" ON public.duel_answers;
CREATE POLICY "duel_answers_deny_direct_insert" ON public.duel_answers
FOR INSERT TO anon, authenticated
WITH CHECK (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

DROP POLICY IF EXISTS "duel_answers_deny_direct_update" ON public.duel_answers;
CREATE POLICY "duel_answers_deny_direct_update" ON public.duel_answers
FOR UPDATE TO anon, authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

DROP POLICY IF EXISTS "duel_answers_deny_direct_delete" ON public.duel_answers;
CREATE POLICY "duel_answers_deny_direct_delete" ON public.duel_answers
FOR DELETE TO anon, authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- ==============================================================================
-- 6. PROTECCIÓN ESTRICTA DE: online_questions_truth
-- ==============================================================================
-- Los alumnos NO deben poder consultar correct_answer mediante SELECT directo.
-- submit_duel_answer() es SECURITY DEFINER y la consulta internamente en el servidor.

ALTER TABLE public.online_questions_truth ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "online_questions_truth_select" ON public.online_questions_truth;
DROP POLICY IF EXISTS "online_questions_truth_teacher_only" ON public.online_questions_truth;

CREATE POLICY "online_questions_truth_teacher_only" ON public.online_questions_truth
FOR SELECT TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

REVOKE ALL ON public.online_questions_truth FROM anon;

-- ==============================================================================
-- 7. ELIMINACIÓN DE LA VISTA PÚBLICA: duel_live_progress
-- ==============================================================================
-- Se elimina la vista pública para reducir la superficie de exposición.
-- El progreso en vivo se consulta exclusivamente mediante la RPC get_duel_live_progress().

DROP VIEW IF EXISTS public.duel_live_progress;

-- ==============================================================================
-- 8. FUNCIONES RPC SEGURAS (AUTORIDAD EN EL SERVIDOR)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- RPC 8.1: create_duel_match (Docente)
-- Genera PIN aleatorio y seguro de 6 dígitos numéricos con captura de unique_violation y reintentos automáticos.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_duel_match(p_pin VARCHAR(6) DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match_id UUID := gen_random_uuid();
    v_pin VARCHAR(6);
    v_attempts INTEGER := 0;
    v_inserted BOOLEAN := false;
BEGIN
    -- 1. Autorización del docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente puede crear partidas.');
    END IF;

    -- 2. Manejo de PIN manual proporcionado por el docente
    IF p_pin IS NOT NULL AND TRIM(p_pin) <> '' THEN
        IF LENGTH(TRIM(p_pin)) <> 6 OR TRIM(p_pin) !~ '^[0-9]{6}$' THEN
            RETURN jsonb_build_object('success', false, 'error', 'El PIN debe contener exactamente 6 dígitos numéricos.');
        END IF;

        v_pin := TRIM(p_pin);

        IF EXISTS (SELECT 1 FROM public.duel_matches WHERE pin = v_pin) THEN
            RETURN jsonb_build_object('success', false, 'error', 'El PIN ingresado ya se encuentra en uso por otra partida.');
        END IF;

        BEGIN
            INSERT INTO public.duel_matches (
                id, pin, status, current_round, total_rounds, created_by
            ) VALUES (
                v_match_id, v_pin, 'lobby', 1, 10, 'senamartin.ismael@gmail.com'
            );
            v_inserted := true;
        EXCEPTION
            WHEN unique_violation THEN
                RETURN jsonb_build_object('success', false, 'error', 'El PIN ingresado ya se encuentra en uso por otra partida.');
        END;
    ELSE
        -- 3. Generación automática de PIN de 6 dígitos con reintentos basados en captura de unique_violation
        LOOP
            v_attempts := v_attempts + 1;
            IF v_attempts > 100 THEN
                RETURN jsonb_build_object('success', false, 'error', 'No fue posible generar un PIN único tras múltiples reintentos.');
            END IF;

            v_pin := (FLOOR(100000 + RANDOM() * 900000))::TEXT;

            BEGIN
                INSERT INTO public.duel_matches (
                    id, pin, status, current_round, total_rounds, created_by
                ) VALUES (
                    v_match_id, v_pin, 'lobby', 1, 10, 'senamartin.ismael@gmail.com'
                );
                v_inserted := true;
                EXIT;
            EXCEPTION
                WHEN unique_violation THEN
                    -- Colisión concurrente resuelta a nivel de UNIQUE INDEX: reintentar con nuevo PIN
                    NULL;
            END;
        END LOOP;
    END IF;

    -- 4. Actualizar active_match_id únicamente tras inserción confirmada
    IF v_inserted THEN
        UPDATE public.duel_settings
        SET active_match_id = v_match_id, updated_at = NOW(), updated_by = 'senamartin.ismael@gmail.com'
        WHERE id = 'global';

        RETURN jsonb_build_object(
            'success', true,
            'match_id', v_match_id,
            'pin', v_pin,
            'status', 'lobby'
        );
    END IF;

    RETURN jsonb_build_object('success', false, 'error', 'Error inesperado al crear la partida.');
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.2: join_duel_team (Alumnos / Anon / Authenticated)
-- Serializado con SELECT ... FOR UPDATE sobre duel_matches para eliminar carreras.
-- Garantiza atómicamente el cupo máximo de 5 equipos ante ingresos concurrentes.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_duel_team(
    p_match_id UUID,
    p_team_name TEXT,
    p_avatar TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_clean_name TEXT;
    v_clean_avatar TEXT;
    v_team_count INTEGER;
    v_new_team_id UUID;
    v_session_token TEXT;
BEGIN
    v_clean_name := TRIM(p_team_name);
    v_clean_avatar := TRIM(p_avatar);

    IF LENGTH(v_clean_name) < 2 OR LENGTH(v_clean_name) > 30 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El nombre del equipo debe tener entre 2 y 30 caracteres.');
    END IF;

    -- 1. Bloqueo pesimista de fila en duel_matches para serializar solicitudes simultáneas
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 2. Verificar que el partido siga en estado lobby
    IF v_match.status <> 'lobby' THEN
        RETURN jsonb_build_object('success', false, 'error', 'No es posible unirse: la partida ya ha comenzado o ha finalizado.');
    END IF;

    -- 3. Contar los equipos existentes bajo el bloqueo exclusivo
    SELECT COUNT(*) INTO v_team_count
    FROM public.duel_teams
    WHERE match_id = p_match_id;

    -- 4. Garantizar de forma transaccional el máximo estricto de 5 equipos
    IF v_team_count >= 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'La sala está completa (máximo 5 equipos permitidos).');
    END IF;

    -- 5. Validación de nombre único (case insensitive)
    IF EXISTS (
        SELECT 1 FROM public.duel_teams
        WHERE match_id = p_match_id AND LOWER(TRIM(team_name)) = LOWER(v_clean_name)
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ya existe un equipo registrado con ese nombre en esta partida.');
    END IF;

    v_new_team_id := gen_random_uuid();
    v_session_token := gen_random_uuid()::TEXT;

    INSERT INTO public.duel_teams (
        id, match_id, team_name, avatar, total_score, rounds_won, total_time_ms, status
    ) VALUES (
        v_new_team_id, p_match_id, v_clean_name, v_clean_avatar, 0, 0, 0, 'connected'
    );

    INSERT INTO public.duel_team_secrets (team_id, session_token)
    VALUES (v_new_team_id, v_session_token);

    RETURN jsonb_build_object(
        'success', true,
        'team_id', v_new_team_id,
        'session_token', v_session_token,
        'team_name', v_clean_name,
        'avatar', v_clean_avatar
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.3: start_duel_match (Docente)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.start_duel_match(
    p_match_id UUID,
    p_initial_question_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_team_count INTEGER;
    v_match RECORD;
BEGIN
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente puede iniciar el duelo.');
    END IF;

    SELECT * INTO v_match FROM public.duel_matches WHERE id = p_match_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    IF v_match.status <> 'lobby' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La partida no está en estado lobby.');
    END IF;

    SELECT COUNT(*) INTO v_team_count FROM public.duel_teams WHERE match_id = p_match_id;
    IF v_team_count < 2 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Se requieren al menos 2 equipos para comenzar (actualmente registrados: ' || v_team_count || ').');
    END IF;

    IF v_team_count > 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El número de equipos supera el máximo permitido de 5.');
    END IF;

    IF p_initial_question_id IS NOT NULL AND TRIM(p_initial_question_id) <> '' THEN
        IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = p_initial_question_id) THEN
            RETURN jsonb_build_object('success', false, 'error', 'La pregunta seleccionada no existe en el banco oficial.');
        END IF;
    END IF;

    UPDATE public.duel_matches
    SET
        status = 'question_preview',
        current_round = 1,
        current_question_id = p_initial_question_id,
        round_started_at = NULL,
        round_ends_at = NULL
    WHERE id = p_match_id;

    UPDATE public.duel_settings
    SET active_match_id = p_match_id, updated_at = NOW(), updated_by = 'senamartin.ismael@gmail.com'
    WHERE id = 'global';

    RETURN jsonb_build_object(
        'success', true,
        'status', 'question_preview',
        'current_round', 1,
        'current_question_id', p_initial_question_id,
        'teams_count', v_team_count
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.4: set_duel_question (Docente)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_duel_question(
    p_match_id UUID,
    p_question_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
BEGIN
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente puede asignar preguntas.');
    END IF;

    SELECT * INTO v_match FROM public.duel_matches WHERE id = p_match_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    IF v_match.status NOT IN ('lobby', 'question_preview') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo puede asignarse pregunta durante lobby o question_preview (estado actual: ' || v_match.status || ').');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = p_question_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'La pregunta indicada no existe en el banco oficial (ID: ' || p_question_id || ').');
    END IF;

    -- Evitar que se reutilice una pregunta ya jugada en rondas previas de este match
    IF EXISTS (
        SELECT 1 FROM public.duel_answers
        WHERE match_id = p_match_id
          AND round_number < v_match.current_round
          AND question_id = TRIM(p_question_id)
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La pregunta indicada (' || p_question_id || ') ya fue utilizada en una ronda anterior de esta partida.'
        );
    END IF;

    UPDATE public.duel_matches
    SET current_question_id = p_question_id
    WHERE id = p_match_id;

    RETURN jsonb_build_object('success', true, 'question_id', p_question_id);
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.5: start_duel_round (Docente)
-- Transición: question_preview -> question_active
-- Fija 30 segundos exactos en el servidor mediante clock_timestamp().
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.start_duel_round(
    p_match_id UUID,
    p_question_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
    v_qid TEXT;
BEGIN
    -- 1. Autorización exclusiva del docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede iniciar la ronda.');
    END IF;

    -- 2. Bloqueo de fila
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Exigir que la partida esté en question_preview
    IF v_match.status <> 'question_preview' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La ronda solo puede iniciarse desde el estado question_preview (estado actual: ' || v_match.status || ').');
    END IF;

    -- 4. Determinar y validar la pregunta activa
    v_qid := COALESCE(NULLIF(TRIM(p_question_id), ''), v_match.current_question_id);

    IF v_qid IS NULL OR TRIM(v_qid) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Debe asignarse una pregunta antes de iniciar la ronda activa.');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_qid) THEN
        RETURN jsonb_build_object('success', false, 'error', 'La pregunta indicada (' || v_qid || ') no existe en el banco oficial.');
    END IF;

    -- Evitar que se reutilice una pregunta ya jugada en rondas previas de este duelo
    IF EXISTS (
        SELECT 1 FROM public.duel_answers
        WHERE match_id = p_match_id
          AND round_number < v_match.current_round
          AND question_id = v_qid
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La pregunta activa (' || v_qid || ') ya fue utilizada en una ronda previa de este duelo.'
        );
    END IF;

    -- 5. Autoridad de tiempo en PostgreSQL: 30 segundos exactos
    v_start := clock_timestamp();
    v_end := v_start + INTERVAL '30 seconds';

    UPDATE public.duel_matches
    SET
        status = 'question_active',
        current_question_id = v_qid,
        round_started_at = v_start,
        round_ends_at = v_end
    WHERE id = p_match_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'question_active',
        'current_round', v_match.current_round,
        'question_id', v_qid,
        'round_started_at', v_start,
        'round_ends_at', v_end
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.6: submit_duel_answer (Alumnos / Anon / Authenticated)
-- Valida 8 condiciones estrictas en el servidor.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_duel_answer(
    p_match_id UUID,
    p_team_id UUID,
    p_session_token TEXT,
    p_round_number INTEGER,
    p_selected_option INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_team RECORD;
    v_correct_answer INTEGER;
    v_is_correct BOOLEAN := false;
    v_response_time_ms INTEGER;
    v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
    -- Validación de parámetro: opción entre 0 y 3
    IF p_selected_option < 0 OR p_selected_option > 3 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Opción seleccionada inválida (debe estar entre 0 y 3).');
    END IF;

    -- 4. Comprobar que la partida existe
    SELECT * INTO v_match FROM public.duel_matches WHERE id = p_match_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 6. Comprobar que la partida está en question_active
    IF v_match.status <> 'question_active' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La ronda no se encuentra activa para responder (estado actual: ' || v_match.status || ').');
    END IF;

    -- 5. Comprobar que la ronda enviada coincide con current_round
    IF v_match.current_round <> p_round_number THEN
        RETURN jsonb_build_object('success', false, 'error', 'El número de ronda enviado (' || p_round_number || ') no coincide con la ronda activa (' || v_match.current_round || ').');
    END IF;

    -- 7. Comprobar que la partida tiene una pregunta activa configurada en el servidor
    IF v_match.current_question_id IS NULL OR TRIM(v_match.current_question_id) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'No hay una pregunta activa configurada en el servidor para esta ronda.');
    END IF;

    -- 3 & 1. Comprobar que el equipo existe y pertenece a esta partida
    SELECT * INTO v_team FROM public.duel_teams WHERE id = p_team_id AND match_id = p_match_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'El equipo no existe o no pertenece a la partida indicada.');
    END IF;

    -- 2. Comprobar que session_token pertenece exactamente a ese team_id
    IF NOT EXISTS (
        SELECT 1 FROM public.duel_team_secrets
        WHERE team_id = p_team_id AND session_token = p_session_token
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Credencial o token de sesión inválido para este equipo.');
    END IF;

    -- 8. Comprobar que la respuesta se recibe dentro de la ventana permitida (30s + 1s margen de red)
    IF v_match.round_ends_at IS NOT NULL AND v_now > (v_match.round_ends_at + INTERVAL '1 second') THEN
        RETURN jsonb_build_object('success', false, 'error', 'El tiempo límite de 30 segundos para esta ronda ha finalizado.');
    END IF;

    -- Comprobar que el equipo no haya respondido previamente en esta ronda
    IF EXISTS (
        SELECT 1 FROM public.duel_answers
        WHERE match_id = p_match_id AND round_number = v_match.current_round AND team_id = p_team_id
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'El equipo ya ha enviado su respuesta para esta ronda.');
    END IF;

    -- Medición de tiempo autoritativa del servidor
    IF v_match.round_started_at IS NOT NULL THEN
        v_response_time_ms := GREATEST(50, (EXTRACT(EPOCH FROM (v_now - v_match.round_started_at)) * 1000)::INTEGER);
    ELSE
        v_response_time_ms := 1000;
    END IF;

    -- Consulta de verdad en el servidor usando la pregunta oficial de la partida
    SELECT correct_answer INTO v_correct_answer
    FROM public.online_questions_truth
    WHERE id = v_match.current_question_id;

    IF v_correct_answer IS NOT NULL THEN
        v_is_correct := (p_selected_option = v_correct_answer);
    ELSE
        v_is_correct := false;
    END IF;

    -- Registro en duel_answers (points_awarded permanece en 0 hasta resolve_duel_round)
    INSERT INTO public.duel_answers (
        match_id, round_number, team_id, question_id,
        selected_option, submitted_at, response_time_ms,
        is_correct, points_awarded
    ) VALUES (
        p_match_id, v_match.current_round, p_team_id, v_match.current_question_id,
        p_selected_option, v_now, v_response_time_ms,
        v_is_correct, 0
    );

    RETURN jsonb_build_object(
        'success', true,
        'has_answered', true,
        'message', 'Respuesta registrada exitosamente en el servidor.'
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object('success', false, 'error', 'El equipo ya ha enviado su respuesta para esta ronda.');
    WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.7: resolve_duel_round (Docente)
-- 100% IDEMPOTENTE: ÚNICAMENTE se ejecuta si status = 'question_active'.
-- Si status = 'round_review', rechaza de inmediato sin volver a calcular ni sumar puntos.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.resolve_duel_round(p_match_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_record RECORD;
    v_points INTEGER;
BEGIN
    -- 1. Autorización estricta del docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede resolver la ronda.');
    END IF;

    -- 2. Bloqueo pesimista de fila contra carreras por concurrencia o doble clic
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Idempotencia estricta: si ya está en round_review, devolver error controlado sin modificar nada
    IF v_match.status = 'round_review' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La ronda ' || v_match.current_round || ' ya fue resuelta previamente.',
            'already_resolved', true
        );
    END IF;

    IF v_match.status <> 'question_active' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La ronda no está activa para resolver (estado actual: ' || v_match.status || ').'
        );
    END IF;

    -- 4. Cálculo y asignación atómica con DENSE_RANK()
    -- Empates exactos en milisegundos comparten la misma posición y el mismo puntaje.
    -- 1er tiempo: 4 pts | 2do tiempo: 2 pts | 3er tiempo: 1 pt | posteriores: 0 pts
    FOR v_record IN (
        SELECT
            a.id AS answer_id,
            a.team_id,
            a.response_time_ms,
            DENSE_RANK() OVER (ORDER BY a.response_time_ms ASC) AS speed_rank
        FROM public.duel_answers a
        WHERE a.match_id = p_match_id
          AND a.round_number = v_match.current_round
          AND a.is_correct = true
    ) LOOP
        IF v_record.speed_rank = 1 THEN
            v_points := 4;
        ELSIF v_record.speed_rank = 2 THEN
            v_points := 2;
        ELSIF v_record.speed_rank = 3 THEN
            v_points := 1;
        ELSE
            v_points := 0;
        END IF;

        UPDATE public.duel_answers
        SET points_awarded = v_points
        WHERE id = v_record.answer_id;

        UPDATE public.duel_teams
        SET
            total_score = total_score + v_points,
            rounds_won = rounds_won + (CASE WHEN v_record.speed_rank = 1 THEN 1 ELSE 0 END),
            total_time_ms = total_time_ms + v_record.response_time_ms
        WHERE id = v_record.team_id;
    END LOOP;

    -- 5. Transición atómica de estado a 'round_review'
    UPDATE public.duel_matches
    SET status = 'round_review'
    WHERE id = p_match_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'round_review',
        'round_number', v_match.current_round
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.8: advance_duel_round (Docente)
-- Transición: round_review -> siguiente ronda (question_preview) O finished (ronda 10)
-- En rondas 1 a 9 EXIGE p_next_question_id no nulo y verifica que no se repita.
-- En ronda 10 finaliza la partida normalmente sin requerir nueva pregunta.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.advance_duel_round(
    p_match_id UUID,
    p_next_question_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
BEGIN
    -- 1. Autorización del docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede avanzar de ronda.');
    END IF;

    -- 2. Bloqueo de fila
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Exigir que el estado sea 'round_review'
    IF v_match.status <> 'round_review' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Para avanzar de ronda, la ronda actual debe estar resuelta (estado requerido: round_review; actual: ' || v_match.status || ').');
    END IF;

    -- 4. Si current_round < 10: avanzar a la siguiente ronda
    IF v_match.current_round < 10 THEN
        -- Requerir obligatoriamente el ID de la siguiente pregunta
        IF p_next_question_id IS NULL OR TRIM(p_next_question_id) = '' THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Debe especificarse el ID de la pregunta para la ronda ' || (v_match.current_round + 1) || '.'
            );
        END IF;

        -- Validar que la nueva pregunta exista en el banco pedagógico oficial
        IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = TRIM(p_next_question_id)) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta indicada (' || p_next_question_id || ') no existe en el banco pedagógico oficial.'
            );
        END IF;

        -- Validar que no se repita con la pregunta de la ronda recién jugada ni con rondas previas
        IF v_match.current_question_id = TRIM(p_next_question_id)
           OR EXISTS (
               SELECT 1 FROM public.duel_answers
               WHERE match_id = p_match_id
                 AND question_id = TRIM(p_next_question_id)
           ) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta (' || p_next_question_id || ') ya fue utilizada en una ronda anterior de esta partida. Cada una de las 10 rondas debe tener una pregunta diferente.'
            );
        END IF;

        UPDATE public.duel_matches
        SET
            current_round = current_round + 1,
            current_question_id = TRIM(p_next_question_id),
            status = 'question_preview',
            round_started_at = NULL,
            round_ends_at = NULL
        WHERE id = p_match_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'question_preview',
            'current_round', v_match.current_round + 1,
            'current_question_id', TRIM(p_next_question_id)
        );
    ELSE
        -- Si current_round = 10: finalizar la partida normalmente sin requerir nueva pregunta
        UPDATE public.duel_matches
        SET
            status = 'finished',
            round_started_at = NULL,
            round_ends_at = NULL
        WHERE id = p_match_id;

        UPDATE public.duel_settings
        SET
            active_match_id = NULL,
            updated_at = NOW(),
            updated_by = 'senamartin.ismael@gmail.com'
        WHERE id = 'global'
          AND active_match_id = p_match_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'finished',
            'message', 'Duelo completado con éxito tras 10 rondas.'
        );
    END IF;
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.9: get_duel_live_progress (Alumnos / Anon / Authenticated)
-- RPC SECURITY DEFINER para progreso en vivo de la ronda activa.
-- Devuelve ÚNICAMENTE (match_id, round_number, team_id, has_answered).
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_duel_live_progress(p_match_id UUID)
RETURNS TABLE (
    match_id UUID,
    round_number INTEGER,
    team_id UUID,
    has_answered BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
BEGIN
    SELECT id, status, current_round INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id;

    IF NOT FOUND OR v_match.status <> 'question_active' THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        a.match_id,
        a.round_number,
        a.team_id,
        true AS has_answered
    FROM public.duel_answers a
    WHERE a.match_id = p_match_id
      AND a.round_number = v_match.current_round;
END;
$$;

-- ------------------------------------------------------------------------------
-- RPC 8.10: heartbeat_duel_team (Alumnos / Anon / Authenticated)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.heartbeat_duel_team(
    p_team_id UUID,
    p_session_token TEXT,
    p_status TEXT DEFAULT 'connected'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_status NOT IN ('connected', 'disconnected') THEN
        p_status := 'connected';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.duel_team_secrets
        WHERE team_id = p_team_id AND session_token = p_session_token
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Token de sesión inválido.');
    END IF;

    UPDATE public.duel_teams
    SET status = p_status
    WHERE id = p_team_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ==============================================================================
-- 9. PERMISOS DE EJECUCIÓN EXPLÍCITOS (GRANT / REVOKE)
-- ==============================================================================

-- Operaciones públicas para alumnos (anon y authenticated):
GRANT EXECUTE ON FUNCTION public.join_duel_team(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_duel_answer(UUID, UUID, TEXT, INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.heartbeat_duel_team(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_duel_live_progress(UUID) TO anon, authenticated;

-- Operaciones exclusivas del docente (restringidas a authenticated y validadas por email):
REVOKE EXECUTE ON FUNCTION public.create_duel_match(VARCHAR) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_duel_match(VARCHAR) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_duel_match(VARCHAR) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.start_duel_match(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.start_duel_match(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.start_duel_match(UUID, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.set_duel_question(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_duel_question(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.set_duel_question(UUID, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.start_duel_round(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.start_duel_round(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.start_duel_round(UUID, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.resolve_duel_round(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.resolve_duel_round(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.resolve_duel_round(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.advance_duel_round(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.advance_duel_round(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.advance_duel_round(UUID, TEXT) TO authenticated;

-- ==============================================================================
-- 10. REGISTRO SELECTIVO EN SUPABASE REALTIME
-- ==============================================================================
-- Tablas públicas en Realtime: duel_settings, duel_matches, duel_teams.
-- Tablas privadas/sensibles EXCLUIDAS de Realtime: duel_team_secrets, duel_answers.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Asegurar que duel_answers NO esté en la publicación
        IF EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'duel_answers'
        ) THEN
            ALTER PUBLICATION supabase_realtime DROP TABLE public.duel_answers;
        END IF;

        -- Asegurar que duel_team_secrets NO esté en la publicación
        IF EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'duel_team_secrets'
        ) THEN
            ALTER PUBLICATION supabase_realtime DROP TABLE public.duel_team_secrets;
        END IF;

        -- Registrar únicamente las tablas de sincronización pública
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'duel_settings'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_settings;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'duel_matches'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_matches;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = 'duel_teams'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_teams;
        END IF;
    END IF;
END $$;

COMMIT;
