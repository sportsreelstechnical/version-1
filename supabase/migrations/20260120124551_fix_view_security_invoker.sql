/*
  # Fix View Security Permissions

  ## Overview
  This migration explicitly sets views to use SECURITY INVOKER mode instead of SECURITY DEFINER.
  
  In PostgreSQL 15+, views by default run with the privileges of the view owner (similar to SECURITY DEFINER).
  We need to explicitly set them to SECURITY INVOKER so they run with the privileges of the calling user.

  ## Views Updated
  - staff_with_permissions
  - match_lineup_details
  - match_goals_details

  ## Security Impact
  - Views will now respect Row Level Security (RLS) policies of the calling user
  - Reduces attack surface by not elevating privileges
  - Aligns with principle of least privilege
*/

-- =====================================================
-- RECREATE VIEWS WITH SECURITY INVOKER
-- =====================================================

-- Drop and recreate staff_with_permissions with SECURITY INVOKER
DROP VIEW IF EXISTS public.staff_with_permissions CASCADE;
CREATE VIEW public.staff_with_permissions 
WITH (security_invoker = true)
AS
SELECT
  cs.id,
  cs.club_id,
  cs.profile_id,
  cs.staff_name,
  cs.email,
  cs.contact_number,
  cs.staff_username,
  cs.is_active,
  cs.role,
  cs.access_level,
  cs.status,
  cs.last_login,
  cs.created_at,
  sp.can_view_dashboard,
  sp.can_manage_players,
  sp.can_upload_matches,
  sp.can_edit_club_profile,
  sp.can_manage_staff,
  sp.can_use_ai_scouting,
  sp.can_view_messages,
  sp.can_manage_transfers,
  sp.can_view_club_history,
  sp.can_modify_settings,
  sp.can_explore_talent,
  sp.can_view_analytics,
  sp.can_export_data,
  sp.can_manage_subscriptions
FROM public.club_staff cs
LEFT JOIN public.staff_permissions sp ON sp.staff_id = cs.id;

-- Drop and recreate match_lineup_details with SECURITY INVOKER
DROP VIEW IF EXISTS public.match_lineup_details CASCADE;
CREATE VIEW public.match_lineup_details 
WITH (security_invoker = true)
AS
SELECT 
  ml.id as lineup_id,
  ml.match_id,
  ml.formation,
  ml.created_at as lineup_created_at,
  m.match_date,
  m.opponent_name,
  m.competition,
  m.home_away,
  c.club_name
FROM public.match_lineups ml
JOIN public.matches m ON ml.match_id = m.id
JOIN public.clubs c ON m.club_id = c.id;

-- Drop and recreate match_goals_details with SECURITY INVOKER
DROP VIEW IF EXISTS public.match_goals_details CASCADE;
CREATE VIEW public.match_goals_details 
WITH (security_invoker = true)
AS
SELECT 
  mg.id as goal_id,
  mg.match_id,
  mg.player_id,
  mg.minute,
  mg.goal_type,
  mg.assist_player_id,
  mg.created_at as goal_recorded_at,
  (p.first_name || ' ' || p.last_name) as scorer_name,
  p.position as scorer_position,
  (pa.first_name || ' ' || pa.last_name) as assist_name,
  m.match_date,
  m.opponent_name,
  c.club_name
FROM public.match_goals mg
JOIN public.players p ON mg.player_id = p.id
LEFT JOIN public.players pa ON mg.assist_player_id = pa.id
JOIN public.matches m ON mg.match_id = m.id
JOIN public.clubs c ON m.club_id = c.id;
