/*
  # Add Remaining Foreign Key Indexes

  ## Overview
  This migration adds indexes for all foreign keys that are currently unindexed.
  Foreign key indexes are critical for query performance, especially for joins and cascading operations.

  ## Indexes Added
  - ai_analyses: player_id
  - audit_logs: profile_id
  - club_staff: club_id, created_by
  - match_goals: assist_player_id, match_id, player_id
  - match_lineup_players: player_id
  - match_lineups: created_by
  - match_players: player_id
  - matches: club_id
  - message_threads: regarding_player_id
  - messages: from_profile_id
  - payments: profile_id, subscription_id
  - player_career_history: player_id
  - player_notifications: match_id, player_id
  - player_statistics: player_id
  - players: current_club_id
  - scout_affiliations: scout_id
  - scouting_reports: match_id, player_id, scout_id
  - staff_activity_logs: club_id
  - staff_permissions: updated_by
  - subscriptions: profile_id
  - team_rosters: player_id

  ## Performance Impact
  - Significantly improves JOIN performance
  - Speeds up foreign key constraint checks
  - Optimizes CASCADE operations
  - Improves query planner decisions
*/

-- =====================================================
-- AI ANALYSES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ai_analyses_player_id 
  ON public.ai_analyses(player_id);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_profile_id 
  ON public.audit_logs(profile_id);

-- =====================================================
-- CLUB STAFF
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_club_staff_club_id 
  ON public.club_staff(club_id);

CREATE INDEX IF NOT EXISTS idx_club_staff_created_by 
  ON public.club_staff(created_by);

-- =====================================================
-- MATCH GOALS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_match_goals_assist_player_id 
  ON public.match_goals(assist_player_id);

CREATE INDEX IF NOT EXISTS idx_match_goals_match_id 
  ON public.match_goals(match_id);

CREATE INDEX IF NOT EXISTS idx_match_goals_player_id 
  ON public.match_goals(player_id);

-- =====================================================
-- MATCH LINEUP PLAYERS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_match_lineup_players_player_id 
  ON public.match_lineup_players(player_id);

-- =====================================================
-- MATCH LINEUPS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_match_lineups_created_by 
  ON public.match_lineups(created_by);

-- =====================================================
-- MATCH PLAYERS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_match_players_player_id 
  ON public.match_players(player_id);

-- =====================================================
-- MATCHES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_matches_club_id 
  ON public.matches(club_id);

-- =====================================================
-- MESSAGE THREADS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_message_threads_regarding_player_id 
  ON public.message_threads(regarding_player_id);

-- =====================================================
-- MESSAGES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_messages_from_profile_id 
  ON public.messages(from_profile_id);

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_payments_profile_id 
  ON public.payments(profile_id);

CREATE INDEX IF NOT EXISTS idx_payments_subscription_id 
  ON public.payments(subscription_id);

-- =====================================================
-- PLAYER CAREER HISTORY
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_player_career_history_player_id 
  ON public.player_career_history(player_id);

-- =====================================================
-- PLAYER NOTIFICATIONS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_player_notifications_match_id 
  ON public.player_notifications(match_id);

CREATE INDEX IF NOT EXISTS idx_player_notifications_player_id 
  ON public.player_notifications(player_id);

-- =====================================================
-- PLAYER STATISTICS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_player_statistics_player_id 
  ON public.player_statistics(player_id);

-- =====================================================
-- PLAYERS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_players_current_club_id 
  ON public.players(current_club_id);

-- =====================================================
-- SCOUT AFFILIATIONS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_scout_affiliations_scout_id 
  ON public.scout_affiliations(scout_id);

-- =====================================================
-- SCOUTING REPORTS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_scouting_reports_match_id 
  ON public.scouting_reports(match_id);

CREATE INDEX IF NOT EXISTS idx_scouting_reports_player_id 
  ON public.scouting_reports(player_id);

CREATE INDEX IF NOT EXISTS idx_scouting_reports_scout_id 
  ON public.scouting_reports(scout_id);

-- =====================================================
-- STAFF ACTIVITY LOGS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_club_id 
  ON public.staff_activity_logs(club_id);

-- =====================================================
-- STAFF PERMISSIONS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_staff_permissions_updated_by 
  ON public.staff_permissions(updated_by);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_profile_id 
  ON public.subscriptions(profile_id);

-- =====================================================
-- TEAM ROSTERS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_team_rosters_player_id 
  ON public.team_rosters(player_id);
