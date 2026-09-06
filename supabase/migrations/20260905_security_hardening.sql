-- ==============================================================================
-- 🔐 MIGRACIÓN DE SEGURIDAD Y HARDENING — DESAFÍOS EN LÍNEA (FASE 2)
-- ==============================================================================

-- 1. TABLA DE VERDAD AUTORITATIVA DE PREGUNTAS (RESPUESTAS Y MÓDULOS EN EL SERVIDOR)
CREATE TABLE IF NOT EXISTS public.online_questions_truth (
    id TEXT PRIMARY KEY,
    module_id INTEGER NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.online_questions_truth ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "online_questions_truth_select" ON public.online_questions_truth;
CREATE POLICY "online_questions_truth_select" ON public.online_questions_truth
    FOR SELECT TO anon, authenticated USING (true);

-- Población de las 115 preguntas pedagógicas oficiales
INSERT INTO public.online_questions_truth (id, module_id, correct_answer) VALUES
    ('q_m1_1', 1, 1),
    ('q_m1_2', 1, 0),
    ('q_m1_3', 1, 2),
    ('q_m1_4', 1, 1),
    ('q_m1_5', 1, 2),
    ('q_m1_6', 1, 2),
    ('q_m1_7', 1, 1),
    ('q_m1_8', 1, 0),
    ('q_m1_9', 1, 1),
    ('q_m1_10', 1, 1),
    ('q_m1_11', 1, 2),
    ('q_m2_1', 2, 0),
    ('q_m2_2', 2, 0),
    ('q_m2_3', 2, 1),
    ('q_m2_4', 2, 1),
    ('q_m2_5', 2, 1),
    ('q_m2_6', 2, 0),
    ('q_m2_7', 2, 1),
    ('q_m2_8', 2, 1),
    ('q_m3_1', 3, 1),
    ('q_m3_2', 3, 1),
    ('q_m3_3', 3, 2),
    ('q_m3_4', 3, 1),
    ('q_m3_5', 3, 1),
    ('q_m3_6', 3, 1),
    ('q_m3_7', 3, 1),
    ('q_m3_8', 3, 1),
    ('q_m4_1', 4, 0),
    ('q_m4_2', 4, 1),
    ('q_m4_3', 4, 1),
    ('q_m4_4', 4, 1),
    ('q_m4_5', 4, 1),
    ('q_m4_6', 4, 1),
    ('q_m4_7', 4, 1),
    ('q_m4_8', 4, 1),
    ('q_m5_1', 5, 1),
    ('q_m5_2', 5, 1),
    ('q_m5_3', 5, 1),
    ('q_m5_4', 5, 1),
    ('q_m5_5', 5, 1),
    ('q_m5_6', 5, 1),
    ('q_m5_7', 5, 1),
    ('q_m5_8', 5, 0),
    ('q_m6_1', 6, 1),
    ('q_m6_2', 6, 1),
    ('q_m6_3', 6, 0),
    ('q_m6_4', 6, 1),
    ('q_m6_5', 6, 0),
    ('q_m6_6', 6, 1),
    ('q_m6_7', 6, 0),
    ('q_m6_8', 6, 1),
    ('q_m7_1', 7, 1),
    ('q_m7_2', 7, 2),
    ('q_m7_3', 7, 1),
    ('q_m7_4', 7, 1),
    ('q_m7_5', 7, 0),
    ('q_m7_6', 7, 1),
    ('q_m7_7', 7, 1),
    ('q_m7_8', 7, 1),
    ('q_m8_1', 8, 1),
    ('q_m8_2', 8, 1),
    ('q_m8_3', 8, 1),
    ('q_m8_4', 8, 1),
    ('q_m8_5', 8, 1),
    ('q_m8_6', 8, 0),
    ('q_m8_7', 8, 1),
    ('q_m8_8', 8, 1),
    ('q_m9_1', 9, 1),
    ('q_m9_2', 9, 1),
    ('q_m9_3', 9, 1),
    ('q_m9_4', 9, 1),
    ('q_m9_5', 9, 1),
    ('q_m9_6', 9, 0),
    ('q_m9_7', 9, 1),
    ('q_m9_8', 9, 1),
    ('q_m10_1', 10, 1),
    ('q_m10_2', 10, 1),
    ('q_m10_3', 10, 1),
    ('q_m10_4', 10, 1),
    ('q_m10_5', 10, 0),
    ('q_m10_6', 10, 1),
    ('q_m10_7', 10, 1),
    ('q_m10_8', 10, 1),
    ('q_m11_1', 11, 1),
    ('q_m11_2', 11, 0),
    ('q_m11_3', 11, 1),
    ('q_m11_4', 11, 1),
    ('q_m11_5', 11, 0),
    ('q_m11_6', 11, 0),
    ('q_m11_7', 11, 1),
    ('q_m11_8', 11, 1),
    ('q_m12_1', 12, 0),
    ('q_m12_2', 12, 1),
    ('q_m12_3', 12, 1),
    ('q_m12_4', 12, 1),
    ('q_m12_5', 12, 0),
    ('q_m12_6', 12, 0),
    ('q_m12_7', 12, 1),
    ('q_m12_8', 12, 0),
    ('q_m13_1', 13, 0),
    ('q_m13_2', 13, 1),
    ('q_m13_3', 13, 1),
    ('q_m13_4', 13, 1),
    ('q_m13_5', 13, 1),
    ('q_m13_6', 13, 0),
    ('q_m13_7', 13, 1),
    ('q_m13_8', 13, 1),
    ('q_m14_1', 14, 1),
    ('q_m14_2', 14, 0),
    ('q_m14_3', 14, 1),
    ('q_m14_4', 14, 1),
    ('q_m14_5', 14, 1),
    ('q_m14_6', 14, 1),
    ('q_m14_7', 14, 1),
    ('q_m14_8', 14, 1)
ON CONFLICT (id) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    correct_answer = EXCLUDED.correct_answer;

-- 2. CONSTRAINT ESTRICTO DE CHAT (SOLO 10 FRASES Y 10 EMOJIS PREESTABLECIDOS)
ALTER TABLE public.online_match_messages
    DROP CONSTRAINT IF EXISTS chk_online_chat_content;

ALTER TABLE public.online_match_messages
    ADD CONSTRAINT chk_online_chat_content CHECK (
        content IN (
            '😎 ¡Vamos!',
            '🔥 ¡Buenísima!',
            '😂 Jajaja',
            '😱 ¡Qué difícil!',
            '💪 ¡Puedo hacerlo!',
            '🤔 Estoy pensando...',
            '🎉 ¡Bien!',
            '😭 Nooo',
            '🧠 Buena respuesta',
            '👏 Muy bien',
            '😂', '🔥', '😎', '😱', '🎉', '💪', '🤔', '👏', '🐍', '🧠'
        )
    );

-- 3. TRIGGER DE PROTECCIÓN DE ESTADÍSTICAS EN online_players
-- Previene que llamadas anónimas desde la consola puedan modificar wins, xp o rachas directamente
CREATE OR REPLACE FUNCTION public.trg_check_player_stats_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Permitir mutaciones internas autorizadas (RPCs del juego)
    IF current_setting('app.trusted_operation', true) = 'true' THEN
        RETURN NEW;
    END IF;

    -- Si una llamada externa intenta alterar stats o XP, neutralizar la modificación
    IF OLD.wins IS DISTINCT FROM NEW.wins OR
       OLD.losses IS DISTINCT FROM NEW.losses OR
       OLD.draws IS DISTINCT FROM NEW.draws OR
       OLD.current_streak IS DISTINCT FROM NEW.current_streak OR
       OLD.best_streak IS DISTINCT FROM NEW.best_streak OR
       OLD.total_xp_won IS DISTINCT FROM NEW.total_xp_won OR
       OLD.total_xp_lost IS DISTINCT FROM NEW.total_xp_lost OR
       OLD.xp IS DISTINCT FROM NEW.xp THEN
        NEW.wins := OLD.wins;
        NEW.losses := OLD.losses;
        NEW.draws := OLD.draws;
        NEW.current_streak := OLD.current_streak;
        NEW.best_streak := OLD.best_streak;
        NEW.total_xp_won := OLD.total_xp_won;
        NEW.total_xp_lost := OLD.total_xp_lost;
        NEW.xp := OLD.xp;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_player_stats ON public.online_players;
CREATE TRIGGER trg_protect_player_stats
    BEFORE UPDATE ON public.online_players
    FOR EACH ROW
    EXECUTE FUNCTION public.trg_check_player_stats_update();

-- 4. RPC HARDENED: fn_submit_match_answer
-- Validación en servidor de respuestas, tiempo clampeado, puntos calculados y anti-replay
CREATE OR REPLACE FUNCTION public.fn_submit_match_answer(
    p_match_id UUID,
    p_player_session_id TEXT,
    p_question_index INTEGER,
    p_question_id TEXT,
    p_selected_option INTEGER,
    p_is_correct BOOLEAN DEFAULT false,
    p_response_time NUMERIC DEFAULT 15.0,
    p_points INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_is_p1 BOOLEAN;
    v_correct_answer INT;
    v_is_correct BOOLEAN := false;
    v_clamped_time NUMERIC;
    v_speed_bonus INT := 0;
    v_calc_points INT := 0;
    v_winner TEXT := NULL;
    v_p1_corr INT;
    v_p2_corr INT;
    v_p1_score INT;
    v_p2_score INT;
    v_p1_time NUMERIC;
    v_p2_time NUMERIC;
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

    IF v_match.status != 'playing' THEN
        RETURN jsonb_build_object('error', 'match_not_playing', 'status', v_match.status);
    END IF;

    -- Validar que el session_id es uno de los jugadores
    IF v_match.player1_session_id != p_player_session_id AND v_match.player2_session_id != p_player_session_id THEN
        RAISE EXCEPTION 'No eres participante de esta partida';
    END IF;

    v_is_p1 := (v_match.player1_session_id = p_player_session_id);

    -- 2. Anti-Replay: validar si ya fue respondida esta pregunta por este jugador
    IF EXISTS (
        SELECT 1 FROM public.online_match_answers
        WHERE match_id = p_match_id
          AND player_session_id = p_player_session_id
          AND question_index = p_question_index
    ) THEN
        RETURN jsonb_build_object(
            'match_id', p_match_id,
            'completed', (v_match.player1_finished AND v_match.player2_finished),
            'winner_session_id', v_match.winner_session_id,
            'already_answered', true
        );
    END IF;

    -- 3. Evaluación autoritativa de la respuesta correcta en servidor
    SELECT correct_answer INTO v_correct_answer
    FROM public.online_questions_truth
    WHERE id = p_question_id;

    IF v_correct_answer IS NOT NULL THEN
        v_is_correct := (p_selected_option = v_correct_answer);
    ELSE
        -- Fallback si no está en la tabla de verdad
        v_is_correct := COALESCE(p_is_correct, false);
    END IF;

    -- 4. Cálculo autoritativo de tiempo y puntaje en servidor
    -- Clampear tiempo estrictamente entre 0.5s y 15.0s
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

    -- 5. Insertar respuesta de forma segura
    INSERT INTO public.online_match_answers (
        match_id, player_session_id, question_index,
        question_id, selected_option, is_correct,
        response_time_seconds, points
    ) VALUES (
        p_match_id, p_player_session_id, p_question_index,
        p_question_id, p_selected_option, v_is_correct,
        v_clamped_time, v_calc_points
    );

    -- 6. Actualizar acumuladores del jugador en la partida
    IF v_is_p1 THEN
        UPDATE public.online_matches SET
            player1_score = player1_score + v_calc_points,
            player1_correct = player1_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
            player1_time_seconds = player1_time_seconds + v_clamped_time,
            player1_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    ELSE
        UPDATE public.online_matches SET
            player2_score = player2_score + v_calc_points,
            player2_correct = player2_correct + (CASE WHEN v_is_correct THEN 1 ELSE 0 END),
            player2_time_seconds = player2_time_seconds + v_clamped_time,
            player2_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    END IF;

    -- 7. Volver a leer estado actualizado
    SELECT * INTO v_match FROM public.online_matches WHERE id = p_match_id;

    -- 8. Si ambos terminaron las 10 preguntas y la partida aún no está completada:
    IF v_match.player1_finished AND v_match.player2_finished AND v_match.status != 'completed' THEN
        v_p1_corr := v_match.player1_correct;
        v_p2_corr := v_match.player2_correct;
        v_p1_score := v_match.player1_score;
        v_p2_score := v_match.player2_score;
        v_p1_time := v_match.player1_time_seconds;
        v_p2_time := v_match.player2_time_seconds;

        -- Regla estricta:
        -- 1. Mayor cantidad de aciertos
        IF v_p1_corr > v_p2_corr THEN
            v_winner := v_match.player1_session_id;
        ELSIF v_p2_corr > v_p1_corr THEN
            v_winner := v_match.player2_session_id;
        -- 2. Igual aciertos -> mayor puntaje total
        ELSIF v_p1_score > v_p2_score THEN
            v_winner := v_match.player1_session_id;
        ELSIF v_p2_score > v_p1_score THEN
            v_winner := v_match.player2_session_id;
        -- 3. Igual puntaje -> menor tiempo total
        ELSIF v_p1_time < v_p2_time THEN
            v_winner := v_match.player1_session_id;
        ELSIF v_p2_time < v_p1_time THEN
            v_winner := v_match.player2_session_id;
        ELSE
            v_winner := 'tie';
        END IF;

        -- Actualizar partida finalizada
        UPDATE public.online_matches SET
            status = 'completed',
            winner_session_id = v_winner,
            finished_at = now()
        WHERE id = p_match_id;

        -- Liquidación de XP y estadísticas (IDEMPOTENTE)
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
        'is_correct', v_is_correct,
        'points', v_calc_points
    );
END;
$$;

-- 5. RPC HARDENED: fn_accept_invitation_and_create_match
-- Verificación estricta de aceptante, balance de apuesta y preguntas válidas
CREATE OR REPLACE FUNCTION public.fn_accept_invitation_and_create_match(
    p_invitation_id UUID,
    p_question_ids TEXT[],
    p_acceptor_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invitation RECORD;
    v_match_id UUID;
    v_p1 RECORD;
    v_p2 RECORD;
BEGIN
    PERFORM set_config('app.trusted_operation', 'true', true);

    SELECT * INTO v_invitation
    FROM public.online_invitations
    WHERE id = p_invitation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invitación no encontrada';
    END IF;

    IF p_acceptor_session_id IS NOT NULL AND v_invitation.opponent_session_id != p_acceptor_session_id THEN
        RAISE EXCEPTION 'Solo el rival destinatario puede aceptar esta invitación';
    END IF;

    IF v_invitation.status != 'pending' THEN
        RAISE EXCEPTION 'La invitación ya fue respondida o cancelada';
    END IF;

    IF v_invitation.expires_at < now() THEN
        UPDATE public.online_invitations SET status = 'expired' WHERE id = p_invitation_id;
        RAISE EXCEPTION 'La invitación ha expirado';
    END IF;

    IF array_length(p_question_ids, 1) != 10 THEN
        RAISE EXCEPTION 'Se requieren exactamente 10 preguntas para la partida';
    END IF;

    SELECT * INTO v_p1 FROM public.online_players WHERE session_id = v_invitation.challenger_session_id;
    SELECT * INTO v_p2 FROM public.online_players WHERE session_id = v_invitation.opponent_session_id;

    IF v_p1.session_id IS NULL OR v_p2.session_id IS NULL THEN
        RAISE EXCEPTION 'Uno de los jugadores ya no está disponible';
    END IF;

    IF v_p1.xp < v_invitation.wager_xp THEN
        RAISE EXCEPTION 'El retador no cuenta con suficiente XP para esta apuesta';
    END IF;

    IF v_p2.xp < v_invitation.wager_xp THEN
        RAISE EXCEPTION 'No cuentas con suficiente XP para aceptar esta apuesta';
    END IF;

    -- Crear partida
    INSERT INTO public.online_matches (
        player1_session_id,
        player2_session_id,
        player1_name,
        player2_name,
        wager_xp,
        question_ids,
        status,
        started_at
    ) VALUES (
        v_invitation.challenger_session_id,
        v_invitation.opponent_session_id,
        COALESCE(v_p1.first_name || ' ' || v_p1.last_name, v_invitation.challenger_name),
        COALESCE(v_p2.first_name || ' ' || v_p2.last_name, 'Rival'),
        v_invitation.wager_xp,
        p_question_ids,
        'playing',
        now()
    ) RETURNING id INTO v_match_id;

    UPDATE public.online_invitations
    SET status = 'accepted', match_id = v_match_id
    WHERE id = p_invitation_id;

    UPDATE public.online_players
    SET status = 'playing', last_seen_at = now()
    WHERE session_id IN (v_invitation.challenger_session_id, v_invitation.opponent_session_id);

    RETURN v_match_id;
END;
$$;

-- 6. RPC HARDENED: fn_abandon_match
-- Previene reclamos falsos de abandono verificando la inactividad real del rival
CREATE OR REPLACE FUNCTION public.fn_abandon_match(
    p_match_id UUID,
    p_abandoning_session_id TEXT,
    p_caller_session_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_abandoning_player RECORD;
    v_winner TEXT;
BEGIN
    PERFORM set_config('app.trusted_operation', 'true', true);

    SELECT * INTO v_match FROM public.online_matches WHERE id = p_match_id FOR UPDATE;

    IF NOT FOUND OR v_match.status = 'completed' OR v_match.payout_settled THEN
        RETURN;
    END IF;

    IF v_match.player1_session_id != p_abandoning_session_id AND v_match.player2_session_id != p_abandoning_session_id THEN
        RAISE EXCEPTION 'El jugador no pertenece a esta partida';
    END IF;

    -- Si el caller acusa al rival de desconexión, verificar que no haya estado activo hace menos de 20 segundos
    IF p_caller_session_id IS NOT NULL AND p_caller_session_id != p_abandoning_session_id THEN
        SELECT * INTO v_abandoning_player FROM public.online_players WHERE session_id = p_abandoning_session_id;
        IF v_abandoning_player.session_id IS NOT NULL AND v_abandoning_player.last_seen_at > (now() - interval '20 seconds') THEN
            RAISE EXCEPTION 'No se puede reclamar victoria: el rival aún estuvo activo recientemente';
        END IF;
    END IF;

    IF v_match.player1_session_id = p_abandoning_session_id THEN
        v_winner := v_match.player2_session_id;
    ELSE
        v_winner := v_match.player1_session_id;
    END IF;

    UPDATE public.online_matches SET
        status = 'completed',
        winner_session_id = v_winner,
        finished_at = now(),
        payout_settled = true
    WHERE id = p_match_id;

    UPDATE public.online_players SET
        wins = wins + 1,
        current_streak = current_streak + 1,
        best_streak = GREATEST(best_streak, current_streak + 1),
        total_xp_won = total_xp_won + v_match.wager_xp,
        xp = xp + v_match.wager_xp,
        status = 'available',
        last_seen_at = now()
    WHERE session_id = v_winner;

    UPDATE public.online_players SET
        losses = losses + 1,
        current_streak = 0,
        total_xp_lost = total_xp_lost + v_match.wager_xp,
        xp = GREATEST(0, xp - v_match.wager_xp),
        status = 'offline',
        last_seen_at = now()
    WHERE session_id = p_abandoning_session_id;
END;
$$;

-- 7. RPC HARDENED: fn_check_daily_consecutive_matches
-- Verificación compuesta por session_id e identidad del alumno
CREATE OR REPLACE FUNCTION public.fn_check_daily_consecutive_matches(
    p_player1 TEXT,
    p_player2 TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INT := 0;
    v_p1_identity TEXT := '';
    v_p2_identity TEXT := '';
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.online_matches
    WHERE (
        (player1_session_id = p_player1 AND player2_session_id = p_player2)
        OR
        (player1_session_id = p_player2 AND player2_session_id = p_player1)
    )
    AND created_at >= date_trunc('day', now())
    AND status IN ('playing', 'completed');

    IF v_count >= 3 THEN
        RETURN true;
    END IF;

    SELECT LOWER(first_name || ' ' || last_name || ' ' || school) INTO v_p1_identity
    FROM public.online_players WHERE session_id = p_player1;

    SELECT LOWER(first_name || ' ' || last_name || ' ' || school) INTO v_p2_identity
    FROM public.online_players WHERE session_id = p_player2;

    IF v_p1_identity != '' AND v_p2_identity != '' THEN
        SELECT COUNT(*) INTO v_count
        FROM public.online_matches m
        JOIN public.online_players pl1 ON m.player1_session_id = pl1.session_id
        JOIN public.online_players pl2 ON m.player2_session_id = pl2.session_id
        WHERE (
            (LOWER(pl1.first_name || ' ' || pl1.last_name || ' ' || pl1.school) = v_p1_identity AND
             LOWER(pl2.first_name || ' ' || pl2.last_name || ' ' || pl2.school) = v_p2_identity)
            OR
            (LOWER(pl1.first_name || ' ' || pl1.last_name || ' ' || pl1.school) = v_p2_identity AND
             LOWER(pl2.first_name || ' ' || pl2.last_name || ' ' || pl2.school) = v_p1_identity)
        )
        AND m.created_at >= date_trunc('day', now())
        AND m.status IN ('playing', 'completed');

        IF v_count >= 3 THEN
            RETURN true;
        END IF;
    END IF;

    RETURN false;
END;
$$;

-- 8. POLÍTICAS ROW LEVEL SECURITY (RLS) RESTRICTIVAS
DROP POLICY IF EXISTS "Permitir lectura publica de jugadores online" ON public.online_players;
DROP POLICY IF EXISTS "Permitir registrar o actualizar propio perfil online" ON public.online_players;
DROP POLICY IF EXISTS "Permitir gestionar invitaciones propias" ON public.online_invitations;
DROP POLICY IF EXISTS "Permitir acceso a partidas activas" ON public.online_matches;
DROP POLICY IF EXISTS "Permitir registrar respuestas en partidas" ON public.online_match_answers;
DROP POLICY IF EXISTS "Permitir mensajes de chat en partidas" ON public.online_match_messages;

DROP POLICY IF EXISTS "online_players_select" ON public.online_players;
DROP POLICY IF EXISTS "online_players_insert" ON public.online_players;
DROP POLICY IF EXISTS "online_players_update" ON public.online_players;
DROP POLICY IF EXISTS "online_players_delete" ON public.online_players;

-- A) online_players
CREATE POLICY "online_players_select" ON public.online_players
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "online_players_insert" ON public.online_players
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        session_id IS NOT NULL AND
        length(first_name) BETWEEN 2 AND 30 AND
        length(last_name) BETWEEN 2 AND 30 AND
        length(school) BETWEEN 2 AND 50
    );

CREATE POLICY "online_players_update" ON public.online_players
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "online_players_delete" ON public.online_players
    FOR DELETE TO anon, authenticated USING (false);

-- B) online_matches: Ninguna mutación directa por anon; sólo vía RPCs
DROP POLICY IF EXISTS "online_matches_select" ON public.online_matches;
DROP POLICY IF EXISTS "online_matches_insert" ON public.online_matches;
DROP POLICY IF EXISTS "online_matches_update" ON public.online_matches;
DROP POLICY IF EXISTS "online_matches_delete" ON public.online_matches;

CREATE POLICY "online_matches_select" ON public.online_matches
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "online_matches_insert" ON public.online_matches
    FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "online_matches_update" ON public.online_matches
    FOR UPDATE TO anon, authenticated USING (false);

CREATE POLICY "online_matches_delete" ON public.online_matches
    FOR DELETE TO anon, authenticated USING (false);

-- C) online_match_answers: Inserción directa prohibida; sólo vía fn_submit_match_answer
DROP POLICY IF EXISTS "online_match_answers_select" ON public.online_match_answers;
DROP POLICY IF EXISTS "online_match_answers_insert" ON public.online_match_answers;
DROP POLICY IF EXISTS "online_match_answers_update" ON public.online_match_answers;
DROP POLICY IF EXISTS "online_match_answers_delete" ON public.online_match_answers;

CREATE POLICY "online_match_answers_select" ON public.online_match_answers
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "online_match_answers_insert" ON public.online_match_answers
    FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "online_match_answers_update" ON public.online_match_answers
    FOR UPDATE TO anon, authenticated USING (false);

CREATE POLICY "online_match_answers_delete" ON public.online_match_answers
    FOR DELETE TO anon, authenticated USING (false);

-- D) online_invitations
DROP POLICY IF EXISTS "online_invitations_select" ON public.online_invitations;
DROP POLICY IF EXISTS "online_invitations_insert" ON public.online_invitations;
DROP POLICY IF EXISTS "online_invitations_update" ON public.online_invitations;
DROP POLICY IF EXISTS "online_invitations_delete" ON public.online_invitations;

CREATE POLICY "online_invitations_select" ON public.online_invitations
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "online_invitations_insert" ON public.online_invitations
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        wager_xp IN (10, 25, 50, 100) AND
        challenger_session_id IS NOT NULL AND
        opponent_session_id IS NOT NULL
    );

CREATE POLICY "online_invitations_update" ON public.online_invitations
    FOR UPDATE TO anon, authenticated
    USING (status IN ('rejected', 'cancelled', 'expired'));

CREATE POLICY "online_invitations_delete" ON public.online_invitations
    FOR DELETE TO anon, authenticated USING (false);

-- E) online_match_messages
DROP POLICY IF EXISTS "online_match_messages_select" ON public.online_match_messages;
DROP POLICY IF EXISTS "online_match_messages_insert" ON public.online_match_messages;
DROP POLICY IF EXISTS "online_match_messages_update" ON public.online_match_messages;
DROP POLICY IF EXISTS "online_match_messages_delete" ON public.online_match_messages;

CREATE POLICY "online_match_messages_select" ON public.online_match_messages
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "online_match_messages_insert" ON public.online_match_messages
    FOR INSERT TO anon, authenticated
    WITH CHECK (
        match_id IS NOT NULL AND
        sender_session_id IS NOT NULL
    );

CREATE POLICY "online_match_messages_update" ON public.online_match_messages
    FOR UPDATE TO anon, authenticated USING (false);

CREATE POLICY "online_match_messages_delete" ON public.online_match_messages
    FOR DELETE TO anon, authenticated USING (false);
