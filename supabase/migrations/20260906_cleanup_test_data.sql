-- ==============================================================================
-- Migración: Limpieza de registros y jugadores de prueba de auditoría
-- Fecha: 2026-09-06
-- ==============================================================================
-- Este script elimina exclusivamente los perfiles y registros ficticios generados
-- durante las pruebas de penetración y auditoría de seguridad ('Victima Audit',
-- 'Hacker Audit', 'P1 Tester', 'P2 Tester', 'Pobre SinXP'), preservando intactos
-- todos los perfiles de los alumnos y docentes reales.
-- ==============================================================================

BEGIN;

-- 1. Eliminar respuestas asociadas a sesiones de prueba
DELETE FROM public.online_match_answers
WHERE player_session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR player_session_id LIKE 'audit_%'
OR player_session_id LIKE 'ans_test_%'
OR player_session_id LIKE 'poor_player_%';

-- 2. Eliminar desafíos/invitaciones de prueba
DELETE FROM public.online_challenges
WHERE sender_session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR receiver_session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR sender_session_id LIKE 'audit_%'
OR receiver_session_id LIKE 'audit_%';

-- 3. Eliminar partidas de prueba
DELETE FROM public.online_matches
WHERE player1_session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR player2_session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR id = '2a7e3533-3fc8-47fb-ba8d-bf8d39c0490b'
OR player1_session_id LIKE 'audit_%'
OR player2_session_id LIKE 'audit_%';

-- 4. Eliminar jugadores de prueba de la tabla online_players
DELETE FROM public.online_players
WHERE session_id IN (
    'ans_test_p1_1788619643475',
    'ans_test_p2_1788619643476',
    'audit_victim_1788619613331',
    'audit_hacker_1788619613330',
    'poor_player_1788619618255'
)
OR session_id LIKE 'audit_%'
OR session_id LIKE 'ans_test_%'
OR session_id LIKE 'poor_player_%'
OR (first_name IN ('Victima', 'Hacker', 'P1', 'P2', 'Pobre') AND last_name IN ('Audit', 'Tester', 'SinXP'));

COMMIT;
