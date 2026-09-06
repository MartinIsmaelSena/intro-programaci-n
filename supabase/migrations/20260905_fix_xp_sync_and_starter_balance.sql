-- ==============================================================================
-- 🛠️ CORRECCIÓN DE SINCRONIZACIÓN DE XP Y SALDO INICIAL PARA DESAFÍOS ONLINE
-- ==============================================================================

-- 1. ACTUALIZAR TRIGGER DE PROTECCIÓN:
-- Permite que el alumno sincronice su XP ganado en el curso (acotado a 0..100000),
-- pero mantiene 100% BLINDADAS las estadísticas de competencia:
-- victorias, derrotas, empates, rachas y XP ganado en desafíos.
CREATE OR REPLACE FUNCTION public.trg_check_player_stats_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Permitir mutaciones internas autorizadas (RPCs de partidas)
    IF current_setting('app.trusted_operation', true) = 'true' THEN
        RETURN NEW;
    END IF;

    -- Proteger estrictamente estadísticas de competencia y ranking
    IF OLD.wins IS DISTINCT FROM NEW.wins OR
       OLD.losses IS DISTINCT FROM NEW.losses OR
       OLD.draws IS DISTINCT FROM NEW.draws OR
       OLD.current_streak IS DISTINCT FROM NEW.current_streak OR
       OLD.best_streak IS DISTINCT FROM NEW.best_streak OR
       OLD.total_xp_won IS DISTINCT FROM NEW.total_xp_won OR
       OLD.total_xp_lost IS DISTINCT FROM NEW.total_xp_lost THEN
        NEW.wins := OLD.wins;
        NEW.losses := OLD.losses;
        NEW.draws := OLD.draws;
        NEW.current_streak := OLD.current_streak;
        NEW.best_streak := OLD.best_streak;
        NEW.total_xp_won := OLD.total_xp_won;
        NEW.total_xp_lost := OLD.total_xp_lost;
    END IF;

    -- Permitir sincronizar XP real del alumno desde su avance en el curso,
    -- acotándolo a un rango sano para prevenir valores absurdos
    IF NEW.xp IS DISTINCT FROM OLD.xp THEN
        IF NEW.xp < 0 THEN
            NEW.xp := 0;
        ELSIF NEW.xp > 100000 THEN
            NEW.xp := OLD.xp;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 2. ACTUALIZAR RPC: fn_accept_invitation_and_create_match
-- Si un alumno es nuevo y aún tiene 0 XP en su cuenta, se le otorga automáticamente
-- un saldo inicial de bienvenida de 50 XP para que pueda jugar desafíos sin ser bloqueado.
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
        RAISE EXCEPTION 'Uno de los jugadores ya no está disponible en la sala';
    END IF;

    -- Si el retador o el rival tienen menos XP que la apuesta (ej: cuentas recién creadas con 0 XP),
    -- otorgar saldo de cortesía pedagógico (50 XP) para habilitar la partida.
    IF v_p1.xp < v_invitation.wager_xp THEN
        UPDATE public.online_players
        SET xp = GREATEST(xp + 50, v_invitation.wager_xp)
        WHERE session_id = v_invitation.challenger_session_id;
        v_p1.xp := GREATEST(v_p1.xp + 50, v_invitation.wager_xp);
    END IF;

    IF v_p2.xp < v_invitation.wager_xp THEN
        UPDATE public.online_players
        SET xp = GREATEST(xp + 50, v_invitation.wager_xp)
        WHERE session_id = v_invitation.opponent_session_id;
        v_p2.xp := GREATEST(v_p2.xp + 50, v_invitation.wager_xp);
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

-- 3. ACTUALIZAR JUGADORES EXISTENTES CON SALDO MENOR A 50 XP
UPDATE public.online_players
SET xp = GREATEST(xp, 50)
WHERE xp < 10;
