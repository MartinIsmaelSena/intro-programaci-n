-- ==============================================================================
-- MIGRACIÓN DEFINITIVA: MODERACIÓN ESCOLAR DE EQUIPOS Y GESTIÓN SEGURA
-- 1. Modificación de constraint de estado en duel_teams ('connected', 'disconnected', 'removed')
-- 2. Función public.is_appropriate_team_name con motor multicapa anti-bypass
-- 3. Actualización de join_duel_team con moderación y liberación de cupos ante expulsión
-- 4. RPC public.eject_duel_team ("Sacar equipo" - soft delete, invalidación de token y liberación de cupo)
-- 5. RPC public.delete_duel_team ("Eliminar equipo" - hard delete seguro en lobby)
-- ==============================================================================

BEGIN;

-- 1. ACTUALIZAR CHECK CONSTRAINT DE STATUS EN DUEL_TEAMS
ALTER TABLE public.duel_teams DROP CONSTRAINT IF EXISTS duel_teams_status_check;
ALTER TABLE public.duel_teams ADD CONSTRAINT duel_teams_status_check 
    CHECK (status IN ('connected', 'disconnected', 'removed'));

-- 2. MOTOR DE MODERACIÓN DE NOMBRES EN BASE DE DATOS
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
    v_collapsed TEXT;
    v_tokens TEXT[];
    v_tok TEXT;
    v_sw TEXT;
    v_phrase TEXT;
    v_root TEXT;
    v_standalone TEXT;
    v_is_safe_match BOOLEAN;
    v_all_tokens_safe BOOLEAN;
    
    v_safe_words TEXT[] := ARRAY[
        'computadora', 'computacion', 'computar', 'computacional', 'computo',
        'diputado', 'diputada', 'diputados', 'diputadas',
        'reputacion', 'reputado', 'imputar', 'imputacion',
        'disputar', 'disputa', 'input', 'output',
        'calculo', 'calcular', 'circulo', 'musculo', 'vehiculo', 'articulo',
        'ocular', 'molecular', 'particular', 'curriculo',
        'hermano', 'hermanos', 'plano', 'planos', 'verano', 'artesano',
        'mariano', 'humano', 'humanos', 'urbano', 'enano', 'enanos',
        'gusano', 'manos', 'granos', 'abano', 'vano', 'tirano', 'oceano',
        'pateta', 'vegetal', 'boquita', 'boca', 'zorritos', 'tridente', 'azul',
        'corto', 'porton', 'aborto', 'comportar', 'soportar', 'exportar', 'importar', 'reportar',
        'pena', 'apenas', 'penal', 'penales', 'repentino', 'depende', 'independiente', 'suspender',
        'compensar', 'capitolio', 'apetito', 'hospital', 'pitagoras', 'pitonisa', 'repito', 'compito',
        'recoger', 'escoger', 'acoger', 'pajar', 'pajarito', 'pajaro', 'pajaros',
        'control', 'controlar', 'electro', 'patrulla', 'programadores', 'algoritmos', 'python'
    ];

    v_forbidden_phrases TEXT[] := ARRAY[
        'coje enano', 'chupa pija', 'chupa pijas', 'la concha', 'me cago',
        'hijo de puta', 'hija de puta', 'la concha de tu madre', 'lcdtm', 'lpm',
        'la puta madre', 'andate a la mierda'
    ];

    v_forbidden_roots TEXT[] := ARRAY[
        'pij', 'porong', 'chot', 'conch', 'cag', 'pelotud', 'bolud',
        'soret', 'mierd', 'mogolic', 'maric', 'malparid', 'tarad',
        'imbecil', 'estupid', 'peter', 'chupal', 'chupam', 'chupen'
    ];

    v_forbidden_standalone TEXT[] := ARRAY[
        'ano', 'anos', 'anal', 'anales', 'orto', 'ortos', 'ortiba', 'ortiva',
        'culo', 'culos', 'culon', 'culona', 'culones', 'culonas', 'culiao', 'culia',
        'culito', 'culitos', 'culear', 'culiar', 'teta', 'tetas', 'tetona', 'tetonas',
        'tetita', 'tetitas', 'pito', 'pitos', 'pitito', 'pene', 'penes', 'penis',
        'paja', 'pajas', 'pajero', 'pajeros', 'pajera', 'pajeras', 'forro', 'forros',
        'forra', 'forras', 'trolo', 'trolos', 'trola', 'trolas', 'hdp'
    ];
BEGIN
    v_raw := TRIM(p_name);
    IF v_raw IS NULL OR LENGTH(v_raw) < 2 OR LENGTH(v_raw) > 30 THEN
        RETURN FALSE;
    END IF;

    -- 1. Minúsculas y quitar tildes
    v_clean := TRANSLATE(LOWER(v_raw), 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunaeiouun');

    -- 2. Leetspeak común
    v_clean := TRANSLATE(v_clean, '01!|3@4$57', 'oiiieaast');

    -- 3. Espacios y compacto
    v_spaces := regexp_replace(v_clean, '[^a-z0-9]+', ' ', 'g');
    v_spaces := TRIM(v_spaces);
    v_compact := regexp_replace(v_clean, '[^a-z0-9]+', '', 'g');

    -- 4. Colapso de repeticiones (preserva dígrafos rr y ll)
    v_collapsed := regexp_replace(v_compact, '([rl])\1{2,}', '\1\1', 'g');
    v_collapsed := regexp_replace(v_collapsed, '([^aeiourl])\1+', '\1', 'g');
    v_collapsed := regexp_replace(v_collapsed, '([aeiou])\1+', '\1', 'g');

    -- Comprobar si coincide con palabra segura exacta
    IF v_spaces = ANY(v_safe_words) OR v_compact = ANY(v_safe_words) OR v_collapsed = ANY(v_safe_words) THEN
        RETURN TRUE;
    END IF;

    -- Comprobar si todos los tokens son palabras seguras
    v_tokens := string_to_array(v_spaces, ' ');
    IF array_length(v_tokens, 1) > 0 THEN
        v_all_tokens_safe := TRUE;
        FOREACH v_tok IN ARRAY v_tokens LOOP
            IF NOT (v_tok = ANY(v_safe_words)) THEN
                v_all_tokens_safe := FALSE;
            END IF;
        END LOOP;
        IF v_all_tokens_safe THEN
            RETURN TRUE;
        END IF;
    END IF;

    -- 1. Frases prohibidas
    FOREACH v_phrase IN ARRAY v_forbidden_phrases LOOP
        IF v_spaces LIKE '%' || v_phrase || '%' 
           OR v_compact LIKE '%' || replace(v_phrase, ' ', '') || '%' 
           OR v_collapsed LIKE '%' || replace(v_phrase, ' ', '') || '%' THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    -- 2. Familia 'put-': cualquier put[aeiou] a menos que tenga prefijo seguro
    IF v_collapsed ~ 'put[aeiou]' THEN
        IF NOT (
            v_collapsed ~ '(comput|diput|reput|imput|disput|input|output)'
        ) THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- 3. Familia 'coj' / 'cog': coj[aeiou] o cog[aeiou] a menos que sea recog, escog, acog
    IF v_collapsed ~ 'co[jg][aeiou]' THEN
        IF NOT (
            v_collapsed ~ '(recog|recoj|escog|escoj|acog|acoj)'
        ) THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- 4. Familia 'verg': a menos que sea enverg, converg, diverg
    IF v_collapsed ~ 'verg' THEN
        IF NOT (
            v_collapsed ~ '(enverg|converg|diverg)'
        ) THEN
            RETURN FALSE;
        END IF;
    END IF;

    -- 5. Raíces prohibidas generales
    FOREACH v_root IN ARRAY v_forbidden_roots LOOP
        IF v_collapsed LIKE '%' || v_root || '%' OR v_spaces LIKE '%' || v_root || '%' THEN
            v_is_safe_match := FALSE;
            FOREACH v_sw IN ARRAY v_safe_words LOOP
                IF v_sw LIKE '%' || v_root || '%' AND v_spaces LIKE '%' || v_sw || '%' THEN
                    v_is_safe_match := TRUE;
                END IF;
            END LOOP;
            IF NOT v_is_safe_match THEN
                RETURN FALSE;
            END IF;
        END IF;
    END LOOP;

    -- 6. Palabras independientes / anatómicas
    FOREACH v_standalone IN ARRAY v_forbidden_standalone LOOP
        -- Token exacto en v_spaces
        FOREACH v_tok IN ARRAY v_tokens LOOP
            DECLARE
                v_col_tok TEXT;
            BEGIN
                v_col_tok := regexp_replace(v_tok, '([rl])\1{2,}', '\1\1', 'g');
                v_col_tok := regexp_replace(v_col_tok, '([^aeiourl])\1+', '\1', 'g');
                v_col_tok := regexp_replace(v_col_tok, '([aeiou])\1+', '\1', 'g');
                IF (v_tok = v_standalone OR v_col_tok = v_standalone) AND NOT (v_tok = ANY(v_safe_words)) THEN
                    RETURN FALSE;
                END IF;
            END;
        END LOOP;

        -- Coincidencia compacta exacta
        IF (v_compact = v_standalone OR v_collapsed = v_standalone) AND NOT (v_compact = ANY(v_safe_words)) THEN
            RETURN FALSE;
        END IF;

        -- Límite de palabra en v_spaces
        IF (' ' || v_spaces || ' ') LIKE ('% ' || v_standalone || ' %') AND NOT (v_standalone = ANY(v_safe_words)) THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$;

-- 3. ACTUALIZACIÓN DE join_duel_team CON MODERACIÓN Y GESTIÓN DE EQUIPOS RETIRADOS
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

    -- Validación estricta de moderación en backend (zero-bypass)
    IF NOT public.is_appropriate_team_name(v_clean_name) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Ese nombre no está permitido. Elegí un nombre apropiado para el entorno escolar.'
        );
    END IF;

    -- 1. Bloqueo pesimista de fila en duel_matches para serializar concurrencia
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

    -- 3. Contar los equipos activos bajo el bloqueo exclusivo (ignora equipos retirados)
    SELECT COUNT(*) INTO v_team_count
    FROM public.duel_teams
    WHERE match_id = p_match_id AND status <> 'removed';

    -- 4. Garantizar de forma transaccional el máximo estricto de 5 equipos activos
    IF v_team_count >= 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'La sala está completa (máximo 5 equipos permitidos).');
    END IF;

    -- 5. Validación de nombre único entre equipos activos (case insensitive)
    IF EXISTS (
        SELECT 1 FROM public.duel_teams
        WHERE match_id = p_match_id 
          AND LOWER(TRIM(team_name)) = LOWER(v_clean_name)
          AND status <> 'removed'
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

-- 4. RPC DE EXPULSIÓN DE EQUIPOS ("SACAR EQUIPO" - DOCENTE AUTORIZADO)
-- Retira al equipo de la sala, invalida su token y libera el cupo inmediatamente.
CREATE OR REPLACE FUNCTION public.eject_duel_team(
    p_match_id UUID,
    p_team_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email TEXT;
    v_match_status TEXT;
    v_team RECORD;
BEGIN
    -- 1. Autorización docente estricta
    v_user_email := auth.jwt()->>'email';
    IF v_user_email IS NULL OR LOWER(v_user_email) <> 'senamartin.ismael@gmail.com' THEN
        IF COALESCE(auth.jwt()->>'role', '') NOT IN ('admin', 'service_role') THEN
            RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede expulsar equipos.');
        END IF;
    END IF;

    -- 2. Verificar existencia de partida
    SELECT status INTO v_match_status FROM public.duel_matches WHERE id = p_match_id FOR UPDATE;
    IF v_match_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Verificar pertenencia del equipo
    SELECT * INTO v_team FROM public.duel_teams WHERE id = p_team_id AND match_id = p_match_id FOR UPDATE;
    IF v_team.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'El equipo no pertenece a esta partida.');
    END IF;

    -- 4. Actualizar estado a 'removed'
    UPDATE public.duel_teams
    SET status = 'removed'
    WHERE id = p_team_id;

    -- 5. Invalidad sesión y credenciales destruyendo el secreto
    DELETE FROM public.duel_team_secrets
    WHERE team_id = p_team_id;

    RETURN jsonb_build_object(
        'success', true,
        'action', 'ejected',
        'team_id', p_team_id,
        'team_name', v_team.team_name,
        'match_id', p_match_id
    );
END;
$$;

-- 5. RPC DE ELIMINACIÓN PERMANENTE DE EQUIPOS ("ELIMINAR EQUIPO" - DOCENTE AUTORIZADO)
-- Borra físicamente el registro cuando la partida está en lobby o no tiene respuestas registradas.
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
    v_user_email TEXT;
    v_match_status TEXT;
    v_team RECORD;
    v_answers_count INTEGER;
BEGIN
    -- 1. Autorización docente estricta
    v_user_email := auth.jwt()->>'email';
    IF v_user_email IS NULL OR LOWER(v_user_email) <> 'senamartin.ismael@gmail.com' THEN
        IF COALESCE(auth.jwt()->>'role', '') NOT IN ('admin', 'service_role') THEN
            RETURN jsonb_build_object('success', false, 'error', 'Acceso denegado: solo el docente autorizado puede eliminar equipos.');
        END IF;
    END IF;

    -- 2. Verificar existencia de partida
    SELECT status INTO v_match_status FROM public.duel_matches WHERE id = p_match_id FOR UPDATE;
    IF v_match_status IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Partida no encontrada.');
    END IF;

    -- 3. Verificar pertenencia del equipo
    SELECT * INTO v_team FROM public.duel_teams WHERE id = p_team_id AND match_id = p_match_id FOR UPDATE;
    IF v_team.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Equipo no encontrado en esta partida.');
    END IF;

    -- 4. Validar respuestas registradas (no borrar datos históricos bajo ninguna circunstancia)
    SELECT COUNT(*) INTO v_answers_count
    FROM public.duel_answers
    WHERE team_id = p_team_id;

    IF v_answers_count > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No es posible eliminar el equipo porque la partida ya está en curso con respuestas registradas. Usá "Sacar equipo" para retirarlo sin alterar las estadísticas históricas.'
        );
    END IF;

    -- 5. Eliminación física (cascada borra secrets y answers si no hubiese respuestas activas)
    DELETE FROM public.duel_teams WHERE id = p_team_id;

    RETURN jsonb_build_object(
        'success', true,
        'action', 'deleted',
        'team_id', p_team_id,
        'team_name', v_team.team_name,
        'match_id', p_match_id
    );
END;
$$;

-- 6. ACTUALIZACIÓN DE start_duel_match (CUENTA SOLO EQUIPOS ACTIVOS, IGNORA 'removed')
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

    -- Contar SOLO equipos activos (excluyendo 'removed')
    SELECT COUNT(*) INTO v_team_count 
    FROM public.duel_teams 
    WHERE match_id = p_match_id AND status <> 'removed';

    IF v_team_count < 2 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Se requieren al menos 2 equipos para comenzar (actualmente activos: ' || v_team_count || ').');
    END IF;

    IF v_team_count > 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'El número de equipos activos supera el máximo permitido de 5.');
    END IF;

    v_qid := NULLIF(TRIM(p_initial_question_id), '');

    IF v_qid IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.online_questions_truth WHERE id = v_qid) THEN
            RETURN jsonb_build_object('success', false, 'error', 'La pregunta seleccionada no existe en el banco oficial: ' || v_qid);
        END IF;

        INSERT INTO public.duel_round_questions (match_id, round_number, question_id)
        VALUES (p_match_id, 1, v_qid)
        ON CONFLICT (match_id, round_number)
        DO UPDATE SET question_id = EXCLUDED.question_id, created_at = clock_timestamp();
    END IF;

    UPDATE public.duel_matches
    SET status = 'question_preview',
        current_round = 1,
        current_question_id = v_qid,
        round_started_at = NULL,
        round_ends_at = NULL
    WHERE id = p_match_id;

    RETURN jsonb_build_object(
        'success', true,
        'status', 'question_preview',
        'current_round', 1,
        'current_question_id', v_qid
    );
END;
$$;

-- 7. PERMISOS Y ROLES
GRANT EXECUTE ON FUNCTION public.is_appropriate_team_name(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_duel_team(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.eject_duel_team(UUID, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_duel_team(UUID, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_duel_match(UUID, TEXT) TO anon, authenticated;

COMMIT;
