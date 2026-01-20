/*
  # Fix Comprehensive Security and Performance Issues

  ## Overview
  This migration addresses critical security and performance issues identified in the security audit.

  ## 1. Unindexed Foreign Keys
  - Add index on `matches.team_id`
  - Add index on `messages.thread_id`
  - Add index on `staff_activity_logs.staff_id`

  ## 2. RLS Policy Optimization
  - Optimize all policies to use `(select auth.uid())` instead of direct `auth.uid()` calls
  - This prevents re-evaluation of auth functions for each row, improving performance

  ## 3. Unused Indexes
  - Remove 43 unused indexes that are consuming storage and maintenance overhead

  ## 4. Security Definer Views
  - Recreate views without SECURITY DEFINER or with proper security context

  ## 5. Function Search Path
  - Fix search_path for 5 functions to prevent security vulnerabilities

  ## Security Notes
  - All changes maintain existing security guarantees
  - Performance improvements are significant at scale
  - No data loss or service interruption expected
*/

-- =====================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- =====================================================

-- Index for matches.team_id foreign key
CREATE INDEX IF NOT EXISTS idx_matches_team_id ON public.matches(team_id);

-- Index for messages.thread_id foreign key
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON public.messages(thread_id);

-- Index for staff_activity_logs.staff_id foreign key (this should already exist but adding if not)
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_staff_id_fkey ON public.staff_activity_logs(staff_id);

-- =====================================================
-- 2. DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS public.idx_club_staff_profile_id_covering;
DROP INDEX IF EXISTS public.idx_payments_subscription_id;
DROP INDEX IF EXISTS public.idx_ai_analyses_player_id;
DROP INDEX IF EXISTS public.idx_match_players_player_id;
DROP INDEX IF EXISTS public.idx_message_threads_regarding_player_id;
DROP INDEX IF EXISTS public.idx_payments_profile_id;
DROP INDEX IF EXISTS public.idx_player_career_history_player_id;
DROP INDEX IF EXISTS public.idx_scout_affiliations_scout_id;
DROP INDEX IF EXISTS public.idx_scouting_reports_match_id;
DROP INDEX IF EXISTS public.idx_staff_permissions_updated_by;
DROP INDEX IF EXISTS public.idx_subscriptions_profile_id;
DROP INDEX IF EXISTS public.idx_team_rosters_player_id;
DROP INDEX IF EXISTS public.idx_profiles_user_type;
DROP INDEX IF EXISTS public.idx_profiles_email;
DROP INDEX IF EXISTS public.idx_clubs_profile_id;
DROP INDEX IF EXISTS public.idx_scouts_profile_id;
DROP INDEX IF EXISTS public.idx_players_profile_id;
DROP INDEX IF EXISTS public.idx_players_current_club;
DROP INDEX IF EXISTS public.idx_matches_club_id;
DROP INDEX IF EXISTS public.idx_player_stats_composite;
DROP INDEX IF EXISTS public.idx_scouting_reports_scout;
DROP INDEX IF EXISTS public.idx_scouting_reports_player;
DROP INDEX IF EXISTS public.idx_messages_from;
DROP INDEX IF EXISTS public.idx_audit_profile;
DROP INDEX IF EXISTS public.idx_club_staff_club_id;
DROP INDEX IF EXISTS public.idx_club_staff_profile_id;
DROP INDEX IF EXISTS public.idx_club_staff_created_by;
DROP INDEX IF EXISTS public.idx_staff_activity_logs_club_id;
DROP INDEX IF EXISTS public.idx_players_username;
DROP INDEX IF EXISTS public.idx_players_password_reset_required;
DROP INDEX IF EXISTS public.idx_club_staff_password_reset_required;
DROP INDEX IF EXISTS public.idx_match_lineups_match_id;
DROP INDEX IF EXISTS public.idx_match_lineups_created_by;
DROP INDEX IF EXISTS public.idx_match_lineup_players_lineup_id;
DROP INDEX IF EXISTS public.idx_match_lineup_players_player_id;
DROP INDEX IF EXISTS public.idx_match_lineup_players_notified;
DROP INDEX IF EXISTS public.idx_match_goals_match_id;
DROP INDEX IF EXISTS public.idx_match_goals_player_id;
DROP INDEX IF EXISTS public.idx_match_goals_assist_player_id;
DROP INDEX IF EXISTS public.idx_player_notifications_player_id;
DROP INDEX IF EXISTS public.idx_player_notifications_match_id;
DROP INDEX IF EXISTS public.idx_player_notifications_read;
DROP INDEX IF EXISTS public.idx_player_notifications_sent_at;

-- =====================================================
-- 3. OPTIMIZE RLS POLICIES - MATCH_LINEUPS
-- =====================================================

DROP POLICY IF EXISTS "Clubs can view their own match lineups" ON public.match_lineups;
DROP POLICY IF EXISTS "Clubs can create match lineups for their matches" ON public.match_lineups;
DROP POLICY IF EXISTS "Clubs can update their own match lineups" ON public.match_lineups;
DROP POLICY IF EXISTS "Scouts can view match lineups" ON public.match_lineups;

CREATE POLICY "Clubs can view their own match lineups"
  ON public.match_lineups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can create match lineups for their matches"
  ON public.match_lineups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can update their own match lineups"
  ON public.match_lineups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view match lineups"
  ON public.match_lineups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scouts
      WHERE profile_id = (select auth.uid())
    )
  );

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - MATCH_LINEUP_PLAYERS
-- =====================================================

DROP POLICY IF EXISTS "Clubs can view lineup players for their matches" ON public.match_lineup_players;
DROP POLICY IF EXISTS "Clubs can add players to their match lineups" ON public.match_lineup_players;
DROP POLICY IF EXISTS "Clubs can update lineup players for their matches" ON public.match_lineup_players;
DROP POLICY IF EXISTS "Players can view their own lineup assignments" ON public.match_lineup_players;
DROP POLICY IF EXISTS "Scouts can view lineup players" ON public.match_lineup_players;

CREATE POLICY "Clubs can view lineup players for their matches"
  ON public.match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.match_lineups ml
      JOIN public.matches m ON ml.match_id = m.id
      JOIN public.clubs c ON m.club_id = c.id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can add players to their match lineups"
  ON public.match_lineup_players FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.match_lineups ml
      JOIN public.matches m ON ml.match_id = m.id
      JOIN public.clubs c ON m.club_id = c.id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can update lineup players for their matches"
  ON public.match_lineup_players FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.match_lineups ml
      JOIN public.matches m ON ml.match_id = m.id
      JOIN public.clubs c ON m.club_id = c.id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.match_lineups ml
      JOIN public.matches m ON ml.match_id = m.id
      JOIN public.clubs c ON m.club_id = c.id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Players can view their own lineup assignments"
  ON public.match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.players
      WHERE id = match_lineup_players.player_id
      AND profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view lineup players"
  ON public.match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scouts
      WHERE profile_id = (select auth.uid())
    )
  );

-- =====================================================
-- 5. OPTIMIZE RLS POLICIES - MATCH_GOALS
-- =====================================================

DROP POLICY IF EXISTS "Clubs can view goals for their matches" ON public.match_goals;
DROP POLICY IF EXISTS "Clubs can add goals to their matches" ON public.match_goals;
DROP POLICY IF EXISTS "Clubs can update goals for their matches" ON public.match_goals;
DROP POLICY IF EXISTS "Clubs can delete goals from their matches" ON public.match_goals;
DROP POLICY IF EXISTS "Scouts can view match goals" ON public.match_goals;

CREATE POLICY "Clubs can view goals for their matches"
  ON public.match_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can add goals to their matches"
  ON public.match_goals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can update goals for their matches"
  ON public.match_goals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can delete goals from their matches"
  ON public.match_goals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.clubs c ON m.club_id = c.id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view match goals"
  ON public.match_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scouts
      WHERE profile_id = (select auth.uid())
    )
  );

-- =====================================================
-- 6. OPTIMIZE RLS POLICIES - PLAYER_NOTIFICATIONS
-- =====================================================

DROP POLICY IF EXISTS "Players can view their own notifications" ON public.player_notifications;
DROP POLICY IF EXISTS "Players can update their own notifications" ON public.player_notifications;
DROP POLICY IF EXISTS "Clubs can create notifications for their players" ON public.player_notifications;

CREATE POLICY "Players can view their own notifications"
  ON public.player_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.players
      WHERE id = player_notifications.player_id
      AND profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Players can update their own notifications"
  ON public.player_notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.players
      WHERE id = player_notifications.player_id
      AND profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.players
      WHERE id = player_notifications.player_id
      AND profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can create notifications for their players"
  ON public.player_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.players p
      JOIN public.clubs c ON p.current_club_id = c.id
      WHERE p.id = player_notifications.player_id
      AND c.profile_id = (select auth.uid())
    )
  );

-- =====================================================
-- 7. OPTIMIZE RLS POLICIES - PROFILES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- =====================================================
-- 8. OPTIMIZE RLS POLICIES - CLUBS
-- =====================================================

DROP POLICY IF EXISTS "Clubs can view own data" ON public.clubs;
DROP POLICY IF EXISTS "Clubs can update own data" ON public.clubs;

CREATE POLICY "Clubs can view own data"
  ON public.clubs FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Clubs can update own data"
  ON public.clubs FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =====================================================
-- 9. OPTIMIZE RLS POLICIES - SCOUTS
-- =====================================================

DROP POLICY IF EXISTS "Scouts can view own data" ON public.scouts;
DROP POLICY IF EXISTS "Scouts can update own data" ON public.scouts;

CREATE POLICY "Scouts can view own data"
  ON public.scouts FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Scouts can update own data"
  ON public.scouts FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =====================================================
-- 10. OPTIMIZE RLS POLICIES - PLAYERS
-- =====================================================

DROP POLICY IF EXISTS "Players can view own data" ON public.players;
DROP POLICY IF EXISTS "Players can update own data" ON public.players;

CREATE POLICY "Players can view own data"
  ON public.players FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Players can update own data"
  ON public.players FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =====================================================
-- 11. OPTIMIZE RLS POLICIES - CLUB_STAFF
-- =====================================================

DROP POLICY IF EXISTS "Staff can view own data" ON public.club_staff;
DROP POLICY IF EXISTS "Staff can update own data" ON public.club_staff;

CREATE POLICY "Staff can view own data"
  ON public.club_staff FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Staff can update own data"
  ON public.club_staff FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =====================================================
-- 12. FIX SECURITY DEFINER VIEWS
-- =====================================================

-- Recreate staff_with_permissions view without SECURITY DEFINER
DROP VIEW IF EXISTS public.staff_with_permissions CASCADE;
CREATE VIEW public.staff_with_permissions AS
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

-- Recreate match_lineup_details view without SECURITY DEFINER
DROP VIEW IF EXISTS public.match_lineup_details CASCADE;
CREATE VIEW public.match_lineup_details AS
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

-- Recreate match_goals_details view without SECURITY DEFINER
DROP VIEW IF EXISTS public.match_goals_details CASCADE;
CREATE VIEW public.match_goals_details AS
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

-- =====================================================
-- 13. FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Fix notify_player_on_lineup_addition
CREATE OR REPLACE FUNCTION public.notify_player_on_lineup_addition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.player_notifications (
    player_id,
    match_id,
    notification_type,
    title,
    message,
    sent_at
  )
  SELECT 
    NEW.player_id,
    ml.match_id,
    'lineup_confirmation',
    'Match Lineup',
    'You have been added to the match lineup for ' || m.opponent_name || ' on ' || m.match_date::text,
    NOW()
  FROM public.match_lineups ml
  JOIN public.matches m ON ml.match_id = m.id
  WHERE ml.id = NEW.lineup_id;
  
  UPDATE public.match_lineup_players
  SET notified = true
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Fix create_default_staff_permissions
CREATE OR REPLACE FUNCTION public.create_default_staff_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.staff_permissions (staff_id, updated_by)
  VALUES (NEW.id, NEW.created_by);
  
  RETURN NEW;
END;
$$;

-- Fix create_audit_log
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    profile_id,
    action,
    table_name,
    record_id,
    changes
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE 
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix generate_staff_username
CREATE OR REPLACE FUNCTION public.generate_staff_username(
  p_staff_name text,
  p_club_id uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_base_username text;
  v_username text;
  v_counter integer := 1;
  v_club_code text;
BEGIN
  -- Get club code (first 3 letters of club name)
  SELECT LOWER(LEFT(REGEXP_REPLACE(club_name, '[^a-zA-Z]', '', 'g'), 3))
  INTO v_club_code
  FROM public.clubs
  WHERE id = p_club_id;

  -- Create base username from staff name
  v_base_username := LOWER(REGEXP_REPLACE(p_staff_name, '[^a-zA-Z]', '', 'g'));
  v_base_username := LEFT(v_base_username, 10);

  -- Combine club code and staff name
  v_username := v_club_code || '_' || v_base_username;

  -- Check if username exists, if yes, append number
  WHILE EXISTS (SELECT 1 FROM public.club_staff WHERE staff_username = v_username) LOOP
    v_username := v_club_code || '_' || v_base_username || v_counter;
    v_counter := v_counter + 1;
  END LOOP;

  RETURN v_username;
END;
$$;

-- Fix log_staff_activity
CREATE OR REPLACE FUNCTION public.log_staff_activity(
  p_staff_id uuid,
  p_club_id uuid,
  p_activity_type text,
  p_activity_description text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.staff_activity_logs (
    staff_id,
    club_id,
    activity_type,
    activity_description,
    ip_address,
    user_agent
  ) VALUES (
    p_staff_id,
    p_club_id,
    p_activity_type,
    p_activity_description,
    p_ip_address,
    p_user_agent
  );
END;
$$;
