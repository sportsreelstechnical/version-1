/*
  # Fix Security and Performance Issues - Part 1: Indexes
  
  ## Changes
  
  ### Add Missing Foreign Key Indexes (11 indexes)
  Foreign keys without indexes cause slow JOIN operations and table locks during updates/deletes
  
  ### Remove Unused Indexes (25 indexes)
  Unused indexes waste storage and slow down INSERT/UPDATE operations
  
  ## Impact
  - Faster JOIN queries on foreign key relationships
  - Reduced storage overhead
  - Faster write operations
*/

-- =====================================================
-- ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ai_analyses_player_id 
  ON public.ai_analyses(player_id);

CREATE INDEX IF NOT EXISTS idx_match_players_player_id 
  ON public.match_players(player_id);

CREATE INDEX IF NOT EXISTS idx_message_threads_regarding_player_id 
  ON public.message_threads(regarding_player_id);

CREATE INDEX IF NOT EXISTS idx_payments_profile_id 
  ON public.payments(profile_id);

CREATE INDEX IF NOT EXISTS idx_payments_subscription_id 
  ON public.payments(subscription_id);

CREATE INDEX IF NOT EXISTS idx_player_career_history_player_id 
  ON public.player_career_history(player_id);

CREATE INDEX IF NOT EXISTS idx_scout_affiliations_scout_id 
  ON public.scout_affiliations(scout_id);

CREATE INDEX IF NOT EXISTS idx_scouting_reports_match_id 
  ON public.scouting_reports(match_id);

CREATE INDEX IF NOT EXISTS idx_staff_permissions_updated_by 
  ON public.staff_permissions(updated_by);

CREATE INDEX IF NOT EXISTS idx_subscriptions_profile_id 
  ON public.subscriptions(profile_id);

CREATE INDEX IF NOT EXISTS idx_team_rosters_player_id 
  ON public.team_rosters(player_id);

-- =====================================================
-- REMOVE UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS public.idx_profiles_status;
DROP INDEX IF EXISTS public.idx_clubs_league;
DROP INDEX IF EXISTS public.idx_clubs_country;
DROP INDEX IF EXISTS public.idx_clubs_verified;
DROP INDEX IF EXISTS public.idx_scouts_country;
DROP INDEX IF EXISTS public.idx_scouts_verified;
DROP INDEX IF EXISTS public.idx_players_position;
DROP INDEX IF EXISTS public.idx_players_nationality;
DROP INDEX IF EXISTS public.idx_players_transfer_status;
DROP INDEX IF EXISTS public.idx_matches_team_id;
DROP INDEX IF EXISTS public.idx_matches_date;
DROP INDEX IF EXISTS public.idx_player_stats_match;
DROP INDEX IF EXISTS public.idx_player_stats_player;
DROP INDEX IF EXISTS public.idx_scouting_reports_date;
DROP INDEX IF EXISTS public.idx_messages_thread;
DROP INDEX IF EXISTS public.idx_messages_created;
DROP INDEX IF EXISTS public.idx_audit_action;
DROP INDEX IF EXISTS public.idx_audit_created;
DROP INDEX IF EXISTS public.idx_club_staff_email;
DROP INDEX IF EXISTS public.idx_club_staff_username;
DROP INDEX IF EXISTS public.idx_club_staff_status;
DROP INDEX IF EXISTS public.idx_staff_permissions_staff_id;
DROP INDEX IF EXISTS public.idx_staff_activity_logs_staff_id;
DROP INDEX IF EXISTS public.idx_staff_activity_logs_activity_type;
DROP INDEX IF EXISTS public.idx_staff_activity_logs_created_at;
