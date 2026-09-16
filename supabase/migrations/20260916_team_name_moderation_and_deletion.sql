-- ==============================================================================
-- MIGRACIÓN: MODERACIÓN DE NOMBRES Y ELIMINACIÓN SEGURA DE EQUIPOS
-- Fecha: 2026-09-16
-- Descripción:
--   1. Crea función de moderación escolar public.is_appropriate_team_name(p_name TEXT).
--   2. Actualiza atómicamente public.join_duel_team para rechazar nombres inapropiados
--      tanto en frontend como a nivel de base de datos (Zero-Bypass).
--   3. Crea RPC public.delete_duel_team(p_match_id, p_team_id) exclusiva para el docente
--      autorizado con borrado en cascada y validación de estado.
-- ==============================================================================

BEGIN;

-- 1. FUNCIÓN DE MODERACIÓN DE NOMBRES PARA ENTORNO ESCOLAR
CREATE OR REPLACE FUNCTION public.is_appropriate_team_name(p_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
    v_raw TEXT;
    v_clean TEXT;
    v_spaces TEXT;
    v_compact TEXT;
    v_collapsed_compact TEXT;
    v_tokens TEXT[];
    v_tok TEXT;
    v_sw TEXT;
    v_phrase TEXT;
    v_root TEXT;
    v_standalone TEXT;
    v_safe_words TEXT[] := ARRAY[
        'computadora', 'computacion', 'computar', 'diputado', 'reputacion',
        'imputar', 'output', 'discutir', 'discursion', 'calculo', 'calcular',
        'circulo', 'musculo', 'vehiculo', 'articulo', 'ocular', 'analisis',
        'analizar', 'analitico', 'hermano', 'plano', 'verano', 'artesano',
        'mariano', 'humano', 'pateta', 'vegetal', 'boquita', 'boca',
        'zorritos', 'tridente', 'azul'
    ];
    v_forbidden_phrases TEXT[] := ARRAY[
        'coje enano', 'chupa pija', 'la concha', 'me cago',
        'hijo de puta', 'hija de puta', 'la concha de tu madre', 'lcdtm'
    ];
    v_forbidden_roots TEXT[] := ARRAY[
        'pija', 'verga', 'poronga', 'chota', 'choto', 'concha', 'conchud',
        'cojer', 'coger', 'coje', 'culear', 'culiar', 'culiao', 'culia',
        'chupala', 'chupamela', 'chupame', 'pajero', 'pajera', 'petera',
        'pelotud', 'forro', 'forra', 'mogolic', 'maricon', 'sorete',
        'malparid', 'mierda', 'vagina', 'penis'
    ];
    v_forbidden_standalone TEXT[] := ARRAY[
        'puta', 'putas', 'puto', 'putos', 'putita', 'putito',
        'trolo', 'trolos', 'trola', 'trolas', 'ano', 'anos',
        'orto', 'ortos', 'culo', 'culos', 'teta', 'tetas',
        'pito', 'pitos', 'pene', 'penes', 'paja', 'pajas',
        'forro', 'forros', 'forra', 'forras', 'hdp'
    ];
BEGIN
    v_raw := TRIM(p_name);
    IF v_raw IS NULL OR LENGTH(v_raw) < 2 OR LENGTH(v_raw) > 30 THEN
        RETURN FALSE;
    END IF;

    -- 1. Minúsculas y quitar tildes/diacríticos
    v_clean := TRANSLATE(LOWER(v_raw), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunaeiouun');

    -- 2. Traducción de leetspeak común
    v_clean := TRANSLATE(v_clean, '01!|3@4$57', 'oiiieaast');

    -- 3. Versión con espacios y versión compacta
    v_spaces := regexp_replace(v_clean, '[^a-z0-9]+', ' ', 'g');
    v_spaces := TRIM(v_spaces);
    v_compact := regexp_replace(v_clean, '[^a-z0-9]+', '', 'g');

    -- 4. Colapso de repeticiones en compacta (preserva rr y ll)
    v_collapsed_compact := regexp_replace(v_compact, '([rl])\1{2,}', '\1\1', 'g');
    v_collapsed_compact := regexp_replace(v_collapsed_compact, '([^aeiourl])\1+', '\1', 'g');
    v_collapsed_compact := regexp_replace(v_collapsed_compact, '([aeiou])\1+', '\1', 'g');

    -- Excepción si coincide exactamente con palabra segura conocida
    FOREACH v_sw IN ARRAY v_safe_words LOOP
        IF v_spaces = v_sw OR v_compact = v_sw THEN
            RETURN TRUE;
        END IF;
    END LOOP;

    -- 1. Frases prohibidas
    FOREACH v_phrase IN ARRAY v_forbidden_phrases LOOP
        IF v_spaces LIKE '%' || v_phrase || '%' OR v_collapsed_compact LIKE '%' || replace(v_phrase, ' ', '') || '%' THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    -- 2. Raíces prohibidas
    FOREACH v_root IN ARRAY v_forbidden_roots LOOP
        IF v_collapsed_compact LIKE '%' || v_root || '%' OR v_spaces LIKE '%' || v_root || '%' THEN
            -- Verificar si es una palabra segura que la contiene
            DECLARE
                v_is_safe BOOLEAN := FALSE;
            BEGIN
                FOREACH v_sw IN ARRAY v_safe_words LOOP
                    IF v_sw LIKE '%' || v_root || '%' AND v_spaces LIKE '%' || v_sw || '%' THEN
                        v_is_safe := TRUE;
                    END IF;
                END LOOP;
                IF NOT v_is_safe THEN
                    RETURN FALSE;
                END IF;
            END;
        END IF;
    END LOOP;

    -- 3. Palabras independientes
    v_tokens := string_to_array(v_spaces, ' ');
    FOREACH v_standalone IN ARRAY v_forbidden_standalone LOOP
        -- Token exacto
        FOREACH v_tok IN ARRAY v_tokens LOOP
            DECLARE
                v_col_tok TEXT;
            BEGIN
                v_col_tok := regexp_replace(v_tok, '([rl])\1{2,}', '\1\1', 'g');
                v_col_tok := regexp_replace(v_col_tok, '([^aeiourl])\1+', '\1', 'g');
                v_col_tok := regexp_replace(v_col_tok, '([aeiou])\1+', '\1', 'g');
                IF v_tok = v_standalone OR v_col_tok = v_standalone THEN
                    RETURN FALSE;
                END IF;
            END;
        END LOOP;

        -- Cadena compacta coincide exactamente con palabra independiente (ej: "p.u.t.a")
        IF v_compact = v_standalone OR v_collapsed_compact = v_standalone THEN
            RETURN FALSE;
        END IF;

        -- Límite de palabra en texto con espacios
        IF (' ' || v_spaces || ' ') LIKE ('% ' || v_standalone || ' %') THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$;

-- 2. ACTUALIZACIÓN ATÓMICA DE join_duel_team CON MODERACIÓN ZERO-BYPASS
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

    IF v_clean_name IS NULL OR LENGTH(v_clean_name) < 2 OR LENGTH(v_clean_name) > 30 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El nombre del equipo debe tener entre 2 y 30 caracteres.');
    END IF;

    -- Validación de moderación de nombres en backend (infranqueable)
    IF NOT public.is_appropriate_team_name(v_clean_name) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Ese nombre no está permitido. Elegí un nombre apropiado para el entorno escolar.'
        );
    END IF;

    -- 1. Bloqueo pesimista de fila en duel_matches para serializar solicitudes simultáneas
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 2. Verificar que la partida siga en estado lobby
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

-- 3. RPC DE ELIMINACIÓN SEGURA DE EQUIPOS (DOCENTE AUTORIZADO)
CREATE OR REPLACE FUNCTION public.delete_duel_team(
    p_match_id UUID,
    p_team_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_match RECORD;
    v_team RECORD;
    v_answers_count INTEGER;
BEGIN
    -- 1. Verificar autorización docente
    IF (COALESCE(auth.jwt() ->> 'email', '') <> 'senamartin.ismael@gmail.com'
        AND COALESCE(auth.jwt() ->> 'role', '') NOT IN ('admin', 'service_role')) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede eliminar equipos.');
    END IF;

    -- 2. Verificar existencia de la partida
    SELECT * INTO v_match
    FROM public.duel_matches
    WHERE id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Verificar que el equipo pertenezca a la partida
    SELECT * INTO v_team
    FROM public.duel_teams
    WHERE id = p_team_id AND match_id = p_match_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Equipo no encontrado en esta partida.');
    END IF;

    -- 4. Validar estado de la partida y respuestas existentes
    IF v_match.status NOT IN ('lobby', 'question_preview') THEN
        SELECT COUNT(*) INTO v_answers_count
        FROM public.duel_answers
        WHERE team_id = p_team_id;

        IF v_answers_count > 0 THEN
            RETURN jsonb_build_object(
                'success', false,
                'error', 'No es posible eliminar el equipo porque la partida ya está en curso con respuestas registradas.'
            );
        END IF;
    END IF;

    -- 5. Eliminar equipo (las FK con ON DELETE CASCADE limpian duel_team_secrets y duel_answers)
    DELETE FROM public.duel_teams WHERE id = p_team_id;

    RETURN jsonb_build_object(
        'success', true,
        'team_id', p_team_id,
        'team_name', v_team.team_name,
        'match_id', p_match_id
    );
END;
$$;

-- 4. PERMISOS Y ROLES
GRANT EXECUTE ON FUNCTION public.is_appropriate_team_name(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_duel_team(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_duel_team(UUID, UUID) TO anon, authenticated;

COMMIT;
