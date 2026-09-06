-- ==============================================================================
-- 🚨 MIGRACIÓN DE RESOLUCIÓN Y RESUMEN AUTORITATIVO DE PARTIDAS (FASE 2)
-- ==============================================================================

-- 1. AGREGAR online_match_answers A LA PUBLICACIÓN REALTIME DE SUPABASE
-- Esto asegura que los eventos de respuesta sean transmitidos por WebSocket al contrincante
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'online_match_answers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.online_match_answers;
    END IF;
END $$;

-- Asegurar identidad completa para replicación en realtime
ALTER TABLE public.online_matches REPLICA IDENTITY FULL;
ALTER TABLE public.online_match_answers REPLICA IDENTITY FULL;

-- 2. RPC AUTORITATIVA DE RESPUESTA CON CRITERIO DE DESEMPATE ESTRICTO
-- Regla pedagógica: 1º Aciertos, 2º Tiempo total acumulado, 3º Empate
CREATE OR REPLACE FUNCTION public.fn_submit_match_answer(
    p_match_id UUID,
    p_player_session_id TEXT,
    p_question_index INTEGER,
    p_question_id TEXT,
    p_selected_option INTEGER,
    p_is_correct BOOLEAN DEFAULT NULL,
    p_response_time NUMERIC DEFAULT NULL,
    p_points INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_is_p1 BOOLEAN;
    v_correct_answer INTEGER;
    v_is_correct BOOLEAN;
    v_clamped_time NUMERIC;
    v_speed_bonus INTEGER;
    v_calc_points INTEGER;
    v_p1_corr INTEGER;
    v_p2_corr INTEGER;
    v_p1_time NUMERIC;
    v_p2_time NUMERIC;
    v_winner TEXT := NULL;
    v_tiebreaker_reason TEXT := NULL;
BEGIN
    PERFORM set_config('app.trusted_operation', 'true', true);

    -- 1. Validar existencia y estado de la partida
    SELECT * INTO v_match
    FROM public.online_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Partida no encontrada';
    END IF;

    IF v_match.status != 'in_progress' THEN
        RAISE EXCEPTION 'La partida no está en curso (estado: %)', v_match.status;
    END IF;

    -- Validar que el jugador pertenezca a la partida
    IF v_match.player1_session_id = p_player_session_id THEN
        v_is_p1 := true;
    ELSIF v_match.player2_session_id = p_player_session_id THEN
        v_is_p1 := false;
    ELSE
        RAISE EXCEPTION 'El jugador no pertenece a esta partida';
    END IF;

    -- Validar que no haya respondido ya esta pregunta
    IF EXISTS (
        SELECT 1 FROM public.online_match_answers
        WHERE match_id = p_match_id
          AND player_session_id = p_player_session_id
          AND question_index = p_question_index
    ) THEN
        RAISE EXCEPTION 'Esta pregunta ya fue respondida por el jugador';
    END IF;

    -- 2. Evaluación autoritativa de la respuesta correcta
    SELECT correct_answer INTO v_correct_answer
    FROM public.online_questions_truth
    WHERE id = p_question_id;

    IF v_correct_answer IS NOT NULL THEN
        v_is_correct := (p_selected_option = v_correct_answer);
    ELSE
        v_is_correct := COALESCE(p_is_correct, false);
    END IF;

    -- 3. Cálculo autoritativo de tiempo y puntaje en servidor
    -- Clampear tiempo entre 0.5s y 15.0s
    v_clamped_time := GREATEST(0.5, LEAST(15.0, COALESCE(p_response_time, 15.0)));

    IF v_is_correct THEN
        IF v_clamped_time <= 2.0 THEN
            v_speed_bonus := 50;
        ELSE
            v_speed_bonus := GREATEST(5, ROUND(50 - (v_clamped_time - 2.0) * 3.46)::INT);
        END IF;
        v_calc_points := 100 + v_speed_bonus;
    ELSE
        v_calc_points := 0;
    END IF;

    -- 4. Insertar respuesta
    INSERT INTO public.online_match_answers (
        match_id, player_session_id, question_index,
        question_id, selected_option, is_correct,
        response_time_seconds, points
    ) VALUES (
        p_match_id, p_player_session_id, p_question_index,
        p_question_id, p_selected_option, v_is_correct,
        v_clamped_time, v_calc_points
    );

    -- 5. Actualizar acumuladores del jugador en la partida
    IF v_is_p1 THEN
        UPDATE public.online_matches SET
            player1_score = player1_score + v_calc_points,
            player1_correct = player1_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
            player1_time_seconds = ROUND((player1_time_seconds + v_clamped_time)::numeric, 2),
            player1_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    ELSE
        UPDATE public.online_matches SET
            player2_score = player2_score + v_calc_points,
            player2_correct = player2_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
            player2_time_seconds = ROUND((player2_time_seconds + v_clamped_time)::numeric, 2),
            player2_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    END IF;

    -- 6. Volver a leer estado actualizado
    SELECT * INTO v_match FROM public.online_matches WHERE id = p_match_id;

    -- 7. Si ambos terminaron las 10 preguntas y la partida aún no está completada:
    IF v_match.player1_finished AND v_match.player2_finished AND v_match.status != 'completed' THEN
        v_p1_corr := v_match.player1_correct;
        v_p2_corr := v_match.player2_correct;
        v_p1_time := v_match.player1_time_seconds;
        v_p2_time := v_match.player2_time_seconds;

        -- REGLA ESTRICTA DE DESEMPATE:
        -- 1º Mayor cantidad de aciertos
        IF v_p1_corr > v_p2_corr THEN
            v_winner := v_match.player1_session_id;
            v_tiebreaker_reason := 'correct_count';
        ELSIF v_p2_corr > v_p1_corr THEN
            v_winner := v_match.player2_session_id;
            v_tiebreaker_reason := 'correct_count';
        -- 2º Menor tiempo total acumulado
        ELSIF v_p1_time < v_p2_time THEN
            v_winner := v_match.player1_session_id;
            v_tiebreaker_reason := 'time';
        ELSIF v_p2_time < v_p1_time THEN
            v_winner := v_match.player2_session_id;
            v_tiebreaker_reason := 'time';
        -- 3º Empate estricto
        ELSE
            v_winner := 'tie';
            v_tiebreaker_reason := 'tie';
        END IF;

        -- Actualizar partida finalizada
        UPDATE public.online_matches SET
            status = 'completed',
            winner_session_id = v_winner,
            finished_at = now()
        WHERE id = p_match_id;

        -- Liquidación de XP y estadísticas (ESTRICTAMENTE IDEMPOTENTE)
        IF NOT v_match.payout_settled THEN
            UPDATE public.online_matches SET payout_settled = true WHERE id = p_match_id;

            IF v_winner = 'tie' THEN
                -- Empate: ambos suman draw y conservan su racha
                UPDATE public.online_players SET
                    draws = draws + 1,
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id IN (v_match.player1_session_id, v_match.player2_session_id);
            ELSIF v_winner = v_match.player1_session_id THEN
                -- P1 Ganador
                UPDATE public.online_players SET
                    wins = wins + 1,
                    current_streak = current_streak + 1,
                    best_streak = GREATEST(best_streak, current_streak + 1),
                    total_xp_won = total_xp_won + v_match.wager_xp,
                    xp = xp + v_match.wager_xp,
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player1_session_id;

                -- P2 Perdedor
                UPDATE public.online_players SET
                    losses = losses + 1,
                    current_streak = 0,
                    total_xp_lost = total_xp_lost + v_match.wager_xp,
                    xp = GREATEST(0, xp - v_match.wager_xp),
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player2_session_id;
            ELSE
                -- P2 Ganador
                UPDATE public.online_players SET
                    wins = wins + 1,
                    current_streak = current_streak + 1,
                    best_streak = GREATEST(best_streak, current_streak + 1),
                    total_xp_won = total_xp_won + v_match.wager_xp,
                    xp = xp + v_match.wager_xp,
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player2_session_id;

                -- P1 Perdedor
                UPDATE public.online_players SET
                    losses = losses + 1,
                    current_streak = 0,
                    total_xp_lost = total_xp_lost + v_match.wager_xp,
                    xp = GREATEST(0, xp - v_match.wager_xp),
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player1_session_id;
            END IF;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'match_id', p_match_id,
        'completed', (v_match.player1_finished AND v_match.player2_finished),
        'winner_session_id', COALESCE(v_winner, v_match.winner_session_id),
        'tiebreaker_reason', v_tiebreaker_reason,
        'is_correct', v_is_correct,
        'points', v_calc_points
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_submit_match_answer(UUID, TEXT, INTEGER, TEXT, INTEGER, BOOLEAN, NUMERIC, INTEGER) TO anon, authenticated;

-- 3. RPC AUTORITATIVA DE RESUMEN DE PARTIDA
-- Devuelve un único JSON validado con todos los datos oficiales de ambos contrincantes
CREATE OR REPLACE FUNCTION public.fn_get_match_summary(
    p_match_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_answers JSONB;
    v_tiebreaker_reason TEXT;
BEGIN
    SELECT * INTO v_match
    FROM public.online_matches
    WHERE id = p_match_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Partida no encontrada';
    END IF;

    IF v_match.status = 'completed' THEN
        IF v_match.winner_session_id = 'tie' THEN
            v_tiebreaker_reason := 'tie';
        ELSIF v_match.player1_correct <> v_match.player2_correct THEN
            v_tiebreaker_reason := 'correct_count';
        ELSE
            v_tiebreaker_reason := 'time';
        END IF;
    ELSE
        v_tiebreaker_reason := 'in_progress';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'player_session_id', player_session_id,
            'question_index', question_index,
            'question_id', question_id,
            'selected_option', selected_option,
            'is_correct', is_correct,
            'response_time_seconds', response_time_seconds,
            'points', points,
            'created_at', created_at
        ) ORDER BY question_index ASC, created_at ASC
    ), '[]'::jsonb)
    INTO v_answers
    FROM public.online_match_answers
    WHERE match_id = p_match_id;

    RETURN jsonb_build_object(
        'match_id', v_match.id,
        'status', v_match.status,
        'wager_xp', v_match.wager_xp,
        'winner_session_id', v_match.winner_session_id,
        'is_tie', (v_match.winner_session_id = 'tie'),
        'tiebreaker_reason', v_tiebreaker_reason,
        'created_at', v_match.created_at,
        'finished_at', v_match.finished_at,
        'player1', jsonb_build_object(
            'session_id', v_match.player1_session_id,
            'name', v_match.player1_name,
            'score', v_match.player1_score,
            'correct', v_match.player1_correct,
            'time_seconds', v_match.player1_time_seconds,
            'finished', v_match.player1_finished
        ),
        'player2', jsonb_build_object(
            'session_id', v_match.player2_session_id,
            'name', v_match.player2_name,
            'score', v_match.player2_score,
            'correct', v_match.player2_correct,
            'time_seconds', v_match.player2_time_seconds,
            'finished', v_match.player2_finished
        ),
        'answers', v_answers
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.fn_get_match_summary(UUID) TO anon, authenticated;
