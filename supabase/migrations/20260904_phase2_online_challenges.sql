-- ==============================================================================
-- MIGRACIÓN SUPABASE: DESAFÍOS EN LÍNEA — FASE 2 (REALTIME)
-- Plataforma: Python desde Cero
-- Fecha: 2026-09-04
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: online_players
-- Almacena la identidad y estadísticas públicas de cada alumno en la arena
CREATE TABLE IF NOT EXISTS public.online_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    school TEXT NOT NULL,
    course TEXT,
    avatar TEXT DEFAULT '🧑‍💻',
    xp INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    total_xp_won INTEGER DEFAULT 0,
    total_xp_lost INTEGER DEFAULT 0,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'playing', 'offline')),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsqueda rápida en sala y ranking
CREATE INDEX IF NOT EXISTS idx_online_players_status ON public.online_players(status);
CREATE INDEX IF NOT EXISTS idx_online_players_wins ON public.online_players(wins DESC);
CREATE INDEX IF NOT EXISTS idx_online_players_xp_won ON public.online_players(total_xp_won DESC);
CREATE INDEX IF NOT EXISTS idx_online_players_session ON public.online_players(session_id);

-- 3. TABLA: online_invitations
-- Gestiona invitaciones de desafío 1v1 en tiempo real con expiración
CREATE TABLE IF NOT EXISTS public.online_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenger_session_id TEXT NOT NULL,
    challenger_name TEXT NOT NULL,
    challenger_school TEXT NOT NULL,
    opponent_session_id TEXT NOT NULL,
    wager_xp INTEGER NOT NULL CHECK (wager_xp IN (10, 25, 50, 100)),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
    match_id UUID,
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '60 seconds'),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_opponent ON public.online_invitations(opponent_session_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_challenger ON public.online_invitations(challenger_session_id, status);

-- 4. TABLA: online_matches
-- Gestiona el estado de partidas reales sincronizadas
CREATE TABLE IF NOT EXISTS public.online_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player1_session_id TEXT NOT NULL,
    player2_session_id TEXT NOT NULL,
    player1_name TEXT NOT NULL,
    player2_name TEXT NOT NULL,
    wager_xp INTEGER NOT NULL,
    question_ids TEXT[] NOT NULL, -- Exactamente 10 IDs de preguntas compartidas
    status TEXT DEFAULT 'starting' CHECK (status IN ('starting', 'playing', 'completed', 'cancelled')),
    current_question_index INTEGER DEFAULT 0,
    player1_score INTEGER DEFAULT 0,
    player2_score INTEGER DEFAULT 0,
    player1_correct INTEGER DEFAULT 0,
    player2_correct INTEGER DEFAULT 0,
    player1_time_seconds NUMERIC DEFAULT 0,
    player2_time_seconds NUMERIC DEFAULT 0,
    player1_finished BOOLEAN DEFAULT false,
    player2_finished BOOLEAN DEFAULT false,
    winner_session_id TEXT, -- 'tie', player1_session_id, o player2_session_id
    payout_settled BOOLEAN DEFAULT false, -- Idempotencia estricta para evitar doble cobro de XP
    started_at TIMESTAMPTZ DEFAULT now(),
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_players ON public.online_matches(player1_session_id, player2_session_id, status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON public.online_matches(created_at DESC);

-- Referencia de clave foránea en invitations hacia matches
ALTER TABLE public.online_invitations
    DROP CONSTRAINT IF EXISTS fk_invitations_match,
    ADD CONSTRAINT fk_invitations_match FOREIGN KEY (match_id) REFERENCES public.online_matches(id) ON DELETE SET NULL;

-- 5. TABLA: online_match_answers
-- Almacena cada respuesta individual para cálculo de puntaje y auditoría
CREATE TABLE IF NOT EXISTS public.online_match_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.online_matches(id) ON DELETE CASCADE,
    player_session_id TEXT NOT NULL,
    question_index INTEGER NOT NULL CHECK (question_index BETWEEN 0 AND 9),
    question_id TEXT NOT NULL,
    selected_option INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_seconds NUMERIC NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_match_player_question UNIQUE (match_id, player_session_id, question_index)
);

CREATE INDEX IF NOT EXISTS idx_answers_match ON public.online_match_answers(match_id, player_session_id);

-- 6. TABLA: online_match_messages
-- Chat seguro de partida con mensajes predeterminados y emojis
CREATE TABLE IF NOT EXISTS public.online_match_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.online_matches(id) ON DELETE CASCADE,
    sender_session_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_match ON public.online_match_messages(match_id, created_at ASC);

-- ==============================================================================
-- 7. FUNCIONES ALMACENADAS (RPC) PARA CONSISTENCIA ATÓMICA
-- ==============================================================================

-- A) Validar límite de 3 enfrentamientos consecutivos diarios entre dos jugadores
CREATE OR REPLACE FUNCTION public.fn_check_daily_consecutive_matches(
    p_player1 TEXT,
    p_player2 TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM public.online_matches
    WHERE (
        (player1_session_id = p_player1 AND player2_session_id = p_player2)
        OR
        (player1_session_id = p_player2 AND player2_session_id = p_player1)
    )
    AND status = 'completed'
    AND created_at >= date_trunc('day', now());

    RETURN v_count >= 3;
END;
$$;

-- B) Aceptar invitación y crear partida de manera atómica (Previene doble aceptación)
CREATE OR REPLACE FUNCTION public.fn_accept_invitation_and_create_match(
    p_invitation_id UUID,
    p_question_ids TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invitation RECORD;
    v_match_id UUID;
    v_p1_name TEXT;
    v_p2_name TEXT;
BEGIN
    -- Bloquear y obtener invitación
    SELECT * INTO v_invitation
    FROM public.online_invitations
    WHERE id = p_invitation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invitación no encontrada';
    END IF;

    IF v_invitation.status != 'pending' THEN
        RAISE EXCEPTION 'La invitación ya fue respondida o cancelada';
    END IF;

    IF v_invitation.expires_at < now() THEN
        UPDATE public.online_invitations SET status = 'expired' WHERE id = p_invitation_id;
        RAISE EXCEPTION 'La invitación ha expirado';
    END IF;

    -- Obtener nombres de jugadores
    SELECT COALESCE(first_name || ' ' || last_name, 'Alumno A') INTO v_p1_name
    FROM public.online_players WHERE session_id = v_invitation.challenger_session_id;

    SELECT COALESCE(first_name || ' ' || last_name, 'Alumno B') INTO v_p2_name
    FROM public.online_players WHERE session_id = v_invitation.opponent_session_id;

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
        COALESCE(v_p1_name, v_invitation.challenger_name),
        COALESCE(v_p2_name, 'Rival'),
        v_invitation.wager_xp,
        p_question_ids,
        'playing',
        now()
    ) RETURNING id INTO v_match_id;

    -- Actualizar invitación
    UPDATE public.online_invitations
    SET status = 'accepted', match_id = v_match_id
    WHERE id = p_invitation_id;

    -- Actualizar estado de ambos jugadores a 'playing'
    UPDATE public.online_players
    SET status = 'playing', last_seen_at = now()
    WHERE session_id IN (v_invitation.challenger_session_id, v_invitation.opponent_session_id);

    RETURN v_match_id;
END;
$$;

-- C) Registrar respuesta y evaluar finalización de partida con cálculo exacto
CREATE OR REPLACE FUNCTION public.fn_submit_match_answer(
    p_match_id UUID,
    p_player_session_id TEXT,
    p_question_index INTEGER,
    p_question_id TEXT,
    p_selected_option INTEGER,
    p_is_correct BOOLEAN,
    p_response_time NUMERIC,
    p_points INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_is_p1 BOOLEAN;
    v_all_p1_done BOOLEAN;
    v_all_p2_done BOOLEAN;
    v_winner TEXT := NULL;
    v_p1_corr INT;
    v_p2_corr INT;
    v_p1_score INT;
    v_p2_score INT;
    v_p1_time NUMERIC;
    v_p2_time NUMERIC;
BEGIN
    -- 1. Insertar respuesta de forma idempotente
    INSERT INTO public.online_match_answers (
        match_id, player_session_id, question_index,
        question_id, selected_option, is_correct,
        response_time_seconds, points
    ) VALUES (
        p_match_id, p_player_session_id, p_question_index,
        p_question_id, p_selected_option, p_is_correct,
        p_response_time, p_points
    ) ON CONFLICT (match_id, player_session_id, question_index) DO NOTHING;

    -- 2. Bloquear partida para actualización
    SELECT * INTO v_match
    FROM public.online_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Partida no encontrada';
    END IF;

    v_is_p1 := (v_match.player1_session_id = p_player_session_id);

    -- Actualizar acumuladores del jugador
    IF v_is_p1 THEN
        UPDATE public.online_matches SET
            player1_score = player1_score + p_points,
            player1_correct = player1_correct + (CASE WHEN p_is_correct THEN 1 ELSE 0 END),
            player1_time_seconds = player1_time_seconds + p_response_time,
            player1_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    ELSE
        UPDATE public.online_matches SET
            player2_score = player2_score + p_points,
            player2_correct = player2_correct + (CASE WHEN p_is_correct THEN 1 ELSE 0 END),
            player2_time_seconds = player2_time_seconds + p_response_time,
            player2_finished = (p_question_index >= 9)
        WHERE id = p_match_id;
    END IF;

    -- 3. Volver a leer estado actualizado
    SELECT * INTO v_match FROM public.online_matches WHERE id = p_match_id;

    -- Si ambos terminaron las 10 preguntas y la partida no está liquidada:
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

        -- Liquidación de XP y estadísticas (IDEMPOTENTE: solo si payout_settled es false)
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
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player1_session_id;

                -- P2 Perdedor
                UPDATE public.online_players SET
                    losses = losses + 1,
                    current_streak = 0,
                    total_xp_lost = total_xp_lost + v_match.wager_xp,
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
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player2_session_id;

                -- P1 Perdedor
                UPDATE public.online_players SET
                    losses = losses + 1,
                    current_streak = 0,
                    total_xp_lost = total_xp_lost + v_match.wager_xp,
                    status = 'available',
                    last_seen_at = now()
                WHERE session_id = v_match.player1_session_id;
            END IF;
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'match_id', p_match_id,
        'completed', (v_match.player1_finished AND v_match.player2_finished),
        'winner_session_id', v_winner
    );
END;
$$;

-- D) Manejo de abandono por desconexión prolongada
CREATE OR REPLACE FUNCTION public.fn_abandon_match(
    p_match_id UUID,
    p_abandoning_session_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match RECORD;
    v_winner TEXT;
BEGIN
    SELECT * INTO v_match FROM public.online_matches WHERE id = p_match_id FOR UPDATE;

    IF NOT FOUND OR v_match.status = 'completed' OR v_match.payout_settled THEN
        RETURN;
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

    -- Ganador por abandono
    UPDATE public.online_players SET
        wins = wins + 1,
        current_streak = current_streak + 1,
        best_streak = GREATEST(best_streak, current_streak + 1),
        total_xp_won = total_xp_won + v_match.wager_xp,
        status = 'available',
        last_seen_at = now()
    WHERE session_id = v_winner;

    -- Perdedor por abandono
    UPDATE public.online_players SET
        losses = losses + 1,
        current_streak = 0,
        total_xp_lost = total_xp_lost + v_match.wager_xp,
        status = 'offline',
        last_seen_at = now()
    WHERE session_id = p_abandoning_session_id;
END;
$$;

-- ==============================================================================
-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.online_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_match_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_match_messages ENABLE ROW LEVEL SECURITY;

-- Lectura pública para anon en tablas necesarias
CREATE POLICY "Permitir lectura publica de jugadores online" ON public.online_players
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Permitir registrar o actualizar propio perfil online" ON public.online_players
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir gestionar invitaciones propias" ON public.online_invitations
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso a partidas activas" ON public.online_matches
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir registrar respuestas en partidas" ON public.online_match_answers
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir mensajes de chat en partidas" ON public.online_match_messages
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. CONFIGURACIÓN DE PUBLICACIÓN REALTIME
-- ==============================================================================

-- Habilitar replicación realtime en las tablas del juego
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'online_players'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.online_players;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'online_invitations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.online_invitations;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'online_matches'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.online_matches;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'online_match_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.online_match_messages;
    END IF;
END $$;
