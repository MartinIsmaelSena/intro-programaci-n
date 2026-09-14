-- ==============================================================================
-- 🏆 MIGRACIÓN: HISTORIAL Y RESTRICCIÓN DE PREGUNTAS POR PARTIDA (FASE 2.7.2)
-- Archivo: supabase/migrations/20260914_duel_round_questions.sql
-- ==============================================================================
-- 1. Crea la tabla public.duel_round_questions vinculando (match_id, round_number, question_id).
-- 2. Restricciones UNIQUE a nivel de motor de base de datos:
--    - UNIQUE (match_id, round_number): 1 pregunta por ronda en la partida.
--    - UNIQUE (match_id, question_id): Ninguna pregunta puede repetirse en la misma partida.
-- 3. RLS estricto: Solo el docente autenticado puede consultar; mutaciones directas denegadas.
-- 4. RPC segura get_duel_used_questions(p_match_id) para consulta del docente.
-- 5. Actualización atómica de RPCs del docente:
--    - start_duel_match: Asienta la pregunta de ronda 1 en duel_round_questions.
--    - set_duel_question: Valida y registra/actualiza contra duel_round_questions.
--    - start_duel_round: Valida y asegura el registro en duel_round_questions.
--    - advance_duel_round: Valida unicidad e inserta la pregunta de la siguiente ronda.
-- ==============================================================================

BEGIN;

-- 1. TABLA HISTÓRICA DE PREGUNTAS POR RONDA
CREATE TABLE IF NOT EXISTS public.duel_round_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.duel_matches(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 10),
    question_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_duel_round_questions_match_round UNIQUE (match_id, round_number),
    CONSTRAINT uq_duel_round_questions_match_question UNIQUE (match_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_duel_round_questions_match
ON public.duel_round_questions(match_id);

-- 2. RLS ESTRICTO PARA duel_round_questions
ALTER TABLE public.duel_round_questions ENABLE ROW LEVEL SECURITY;

-- Solo docente autenticado o service_role puede consultar
DROP POLICY IF EXISTS "duel_round_questions_teacher_select" ON public.duel_round_questions;
CREATE POLICY "duel_round_questions_teacher_select" ON public.duel_round_questions
FOR SELECT TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'senamartin.ismael@gmail.com'
    OR (auth.jwt() ->> 'role') IN ('admin', 'service_role')
);

-- Denegar mutaciones directas a clientes (solo se modifican vía RPCs SECURITY DEFINER)
DROP POLICY IF EXISTS "duel_round_questions_deny_client_insert" ON public.duel_round_questions;
CREATE POLICY "duel_round_questions_deny_client_insert" ON public.duel_round_questions
FOR INSERT TO authenticated, anon
WITH CHECK (false);

DROP POLICY IF EXISTS "duel_round_questions_deny_client_update" ON public.duel_round_questions;
CREATE POLICY "duel_round_questions_deny_client_update" ON public.duel_round_questions
FOR UPDATE TO authenticated, anon
USING (false);

DROP POLICY IF EXISTS "duel_round_questions_deny_client_delete" ON public.duel_round_questions;
CREATE POLICY "duel_round_questions_deny_client_delete" ON public.duel_round_questions
FOR DELETE TO authenticated, anon
USING (false);

REVOKE ALL ON public.duel_round_questions FROM PUBLIC;
REVOKE ALL ON public.duel_round_questions FROM anon;
GRANT SELECT ON public.duel_round_questions TO authenticated;

-- Backfill retrocompatible (por si existieran respuestas históricas en duel_answers)
INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
SELECT DISTINCT match_id, round_number, question_id
FROM public.duel_answers
ON CONFLICT DO NOTHING;

-- 3. RPC DE CONSULTA DE PREGUNTAS UTILIZADAS (DOCENTE)
CREATE OR REPLACE FUNCTION public.get_duel_used_questions(p_match_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente puede consultar el historial de preguntas.');
    END IF;

    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'round_number', rq.round_number,
                'question_id', rq.question_id,
                'created_at', rq.created_at
            ) ORDER BY rq.round_number ASC
        ),
        '[]'::jsonb
    ) INTO v_result
    FROM public.duel_round_questions rq
    WHERE rq.match_id = p_match_id;

    RETURN jsonb_build_object(
        'success', true,
        'used_questions', v_result
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_duel_used_questions(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_duel_used_questions(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_duel_used_questions(UUID) TO authenticated;

-- 4. ACTUALIZACIÓN ATÓMICA DE start_duel_match
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
    v_qid TEXT;
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

    v_qid := NULLIF(TRIM(p_initial_question_id), '');

    IF v_qid IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_qid) THEN
            RETURN jsonb_build_object('success', false, 'error', 'La pregunta seleccionada no existe en el banco oficial.');
        END IF;

        BEGIN
            INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
            VALUES (p_match_id, 1, v_qid)
            ON CONFLICT (match_id, round_number) DO UPDATE
              SET question_id = EXCLUDED.question_id;
        EXCEPTION
            WHEN unique_violation THEN
                RETURN jsonb_build_object('success', false, 'error', 'La pregunta seleccionada ya fue utilizada en esta partida.');
        END;
    END IF;

    UPDATE public.duel_matches
    SET
        status = 'question_preview',
        current_round = 1,
        current_question_id = v_qid,
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
        'current_question_id', v_qid,
        'teams_count', v_team_count
    );
END;
$$;

-- 5. ACTUALIZACIÓN ATÓMICA DE set_duel_question
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
    v_clean_qid TEXT;
BEGIN
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente puede asignar preguntas.');
    END IF;

    v_clean_qid := TRIM(p_question_id);
    IF v_clean_qid IS NULL OR v_clean_qid = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ID de pregunta inválido.');
    END IF;

    SELECT * INTO v_match FROM public.duel_matches WHERE id = p_match_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    IF v_match.status NOT IN ('lobby', 'question_preview') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Solo puede asignarse pregunta durante lobby o question_preview (estado actual: ' || v_match.status || ').');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_clean_qid) THEN
        RETURN jsonb_build_object('success', false, 'error', 'La pregunta indicada no existe en el banco oficial (ID: ' || v_clean_qid || ').');
    END IF;

    -- Validar contra duel_round_questions que no pertenezca a otra ronda de esta misma partida
    IF EXISTS (
        SELECT 1 FROM public.duel_round_questions
        WHERE match_id = p_match_id
          AND round_number <> v_match.current_round
          AND question_id = v_clean_qid
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La pregunta indicada (' || v_clean_qid || ') ya fue utilizada en otra ronda de esta partida.'
        );
    END IF;

    -- Registrar o actualizar de forma atómica la pregunta de la ronda actual
    BEGIN
        INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
        VALUES (p_match_id, v_match.current_round, v_clean_qid)
        ON CONFLICT (match_id, round_number) DO UPDATE
          SET question_id = EXCLUDED.question_id;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta indicada (' || v_clean_qid || ') ya fue asignada en otra ronda de esta partida.'
            );
    END;

    UPDATE public.duel_matches
    SET current_question_id = v_clean_qid
    WHERE id = p_match_id;

    RETURN jsonb_build_object('success', true, 'question_id', v_clean_qid);
END;
$$;

-- 6. ACTUALIZACIÓN ATÓMICA DE start_duel_round
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
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede iniciar la ronda.');
    END IF;

    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    IF v_match.status <> 'question_preview' THEN
        RETURN jsonb_build_object('success', false, 'error', 'La ronda solo puede iniciarse desde el estado question_preview (estado actual: ' || v_match.status || ').');
    END IF;

    v_qid := COALESCE(NULLIF(TRIM(p_question_id), ''), v_match.current_question_id);

    IF v_qid IS NULL OR TRIM(v_qid) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Debe asignarse una pregunta antes de iniciar la ronda activa.');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_qid) THEN
        RETURN jsonb_build_object('success', false, 'error', 'La pregunta indicada (' || v_qid || ') no existe en el banco oficial.');
    END IF;

    -- Validar que no se haya usado en otra ronda de esta partida
    IF EXISTS (
        SELECT 1 FROM public.duel_round_questions
        WHERE match_id = p_match_id
          AND round_number <> v_match.current_round
          AND question_id = v_qid
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'La pregunta activa (' || v_qid || ') ya fue utilizada en otra ronda de esta partida.'
        );
    END IF;

    -- Asegurar registro persistente en duel_round_questions
    BEGIN
        INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
        VALUES (p_match_id, v_match.current_round, v_qid)
        ON CONFLICT (match_id, round_number) DO UPDATE
          SET question_id = EXCLUDED.question_id;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta activa (' || v_qid || ') ya fue utilizada en otra ronda de esta partida.'
            );
    END;

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

-- 7. ACTUALIZACIÓN ATÓMICA DE advance_duel_round
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
    v_next_qid TEXT;
BEGIN
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede avanzar de ronda.');
    END IF;

    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    IF v_match.status <> 'round_review' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Para avanzar de ronda, la ronda actual debe estar resuelta (estado requerido: round_review; actual: ' || v_match.status || ').');
    END IF;

    -- Si current_round < 10: avanzar a la siguiente ronda
    IF v_match.current_round < 10 THEN
        v_next_qid := NULLIF(TRIM(p_next_question_id), '');

        IF v_next_qid IS NULL THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'Debe especificarse el ID de la pregunta para la ronda ' || (v_match.current_round + 1) || '.'
            );
        END IF;

        IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_next_qid) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta indicada (' || v_next_qid || ') no existe en el banco pedagógico oficial.'
            );
        END IF;

        -- Validar contra duel_round_questions (independientemente de si hubo respuestas o no)
        IF EXISTS (
            SELECT 1 FROM public.duel_round_questions
            WHERE match_id = p_match_id
              AND question_id = v_next_qid
        ) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'La pregunta (' || v_next_qid || ') ya fue utilizada en una ronda anterior de esta partida. Cada una de las 10 rondas debe tener una pregunta diferente.'
            );
        END IF;

        -- Registrar atómicamente la pregunta de la siguiente ronda
        BEGIN
            INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
            VALUES (p_match_id, v_match.current_round + 1, v_next_qid);
        EXCEPTION
            WHEN unique_violation THEN
                RETURN jsonb_build_object(
                    'success', false,
                    'error', 'La pregunta (' || v_next_qid || ') ya fue asignada en esta partida.'
                );
        END;

        UPDATE public.duel_matches
        SET
            current_round = current_round + 1,
            current_question_id = v_next_qid,
            status = 'question_preview',
            round_started_at = NULL,
            round_ends_at = NULL
        WHERE id = p_match_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'question_preview',
            'current_round', v_match.current_round + 1,
            'current_question_id', v_next_qid
        );
    ELSE
        -- Ronda 10 finalizada -> pasar a 'finished' y liberar active_match_id
        UPDATE public.duel_matches
        SET
            status = 'finished',
            round_started_at = NULL,
            round_ends_at = NULL
        WHERE id = p_match_id;

        UPDATE public.duel_settings
        SET active_match_id = NULL, updated_at = NOW(), updated_by = 'senamartin.ismael@gmail.com'
        WHERE id = 'global';

        RETURN jsonb_build_object(
            'success', true,
            'status', 'finished',
            'current_round', 10,
            'current_question_id', v_match.current_question_id
        );
    END IF;
END;
$$;

COMMIT;
