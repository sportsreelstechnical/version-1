/*
  # Match Lineup and Goals Management System

  ## Overview
  This migration adds comprehensive match lineup management with team formations,
  player positions, goal tracking with timestamps, and player notifications.

  ## New Tables

  ### 1. match_lineups
  Stores team lineup/formation for each match
  - `id` (uuid, primary key)
  - `match_id` (uuid, references matches)
  - `formation` (text) - e.g., "4-4-2", "4-3-3"
  - `lineup_saved_at` (timestamptz)
  - `created_by` (uuid, references profiles)

  ### 2. match_lineup_players
  Individual player positions in match lineup
  - `id` (uuid, primary key)
  - `lineup_id` (uuid, references match_lineups)
  - `player_id` (uuid, references players)
  - `jersey_number` (integer)
  - `position_in_formation` (text) - Position label in formation
  - `position_x` (integer) - X coordinate for visual display (0-100)
  - `position_y` (integer) - Y coordinate for visual display (0-100)
  - `is_starting` (boolean) - Starting XI or substitute
  - `notified` (boolean) - Whether player was notified

  ### 3. match_goals
  Detailed goal tracking with timestamps and assists
  - `id` (uuid, primary key)
  - `match_id` (uuid, references matches)
  - `player_id` (uuid, references players) - Goal scorer
  - `assist_player_id` (uuid, references players, nullable) - Assist provider
  - `minute` (integer) - Minute goal was scored
  - `goal_type` (text) - normal, penalty, own_goal, free_kick, header
  - `is_home_goal` (boolean) - True if scored by home team

  ### 4. player_notifications
  Notification system for lineup confirmations
  - `id` (uuid, primary key)
  - `player_id` (uuid, references players)
  - `match_id` (uuid, references matches)
  - `notification_type` (text) - lineup_confirmation, match_reminder, etc.
  - `title` (text)
  - `message` (text)
  - `read` (boolean)
  - `sent_at` (timestamptz)

  ## Modifications to Existing Tables
  - Add `formation` field to matches table if not exists
  - Add `venue_location` field to matches table

  ## Security
  - Enable RLS on all new tables
  - Clubs can create/read/update their match lineups
  - Players can read their notifications
  - Scouts can read match lineups (for scouting purposes)

  ## Performance
  - Indexes on foreign keys for fast lookups
  - Composite indexes for common query patterns
*/

-- =====================================================
-- 1. CREATE NEW TABLES
-- =====================================================

-- Match Lineups: Team formation and lineup per match
CREATE TABLE IF NOT EXISTS match_lineups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
  formation text NOT NULL DEFAULT '4-4-2',
  lineup_saved_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Match Lineup Players: Individual player positions
CREATE TABLE IF NOT EXISTS match_lineup_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lineup_id uuid REFERENCES match_lineups(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  jersey_number integer CHECK (jersey_number BETWEEN 1 AND 99),
  position_in_formation text NOT NULL,
  position_x integer DEFAULT 50 CHECK (position_x BETWEEN 0 AND 100),
  position_y integer DEFAULT 50 CHECK (position_y BETWEEN 0 AND 100),
  is_starting boolean DEFAULT true,
  notified boolean DEFAULT false,
  notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(lineup_id, player_id)
);

-- Match Goals: Detailed goal tracking
CREATE TABLE IF NOT EXISTS match_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  assist_player_id uuid REFERENCES players(id) ON DELETE SET NULL,
  minute integer NOT NULL CHECK (minute BETWEEN 1 AND 120),
  added_time_minute integer DEFAULT 0,
  goal_type text DEFAULT 'normal' CHECK (goal_type IN ('normal', 'penalty', 'own_goal', 'free_kick', 'header', 'volley')),
  is_home_goal boolean DEFAULT true,
  video_timestamp_seconds integer,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Player Notifications: Notification system
CREATE TABLE IF NOT EXISTS player_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('lineup_confirmation', 'match_reminder', 'performance_report', 'scout_interest', 'transfer_offer', 'general')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  read_at timestamptz,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. ADD COLUMNS TO EXISTING TABLES (IF NOT EXISTS)
-- =====================================================

DO $$
BEGIN
  -- Add formation column to matches if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matches' AND column_name = 'formation'
  ) THEN
    ALTER TABLE matches ADD COLUMN formation text DEFAULT '4-4-2';
  END IF;

  -- Add venue_location column to matches if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matches' AND column_name = 'venue_location'
  ) THEN
    ALTER TABLE matches ADD COLUMN venue_location text;
  END IF;

  -- Add league/competition_type column to matches if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'matches' AND column_name = 'competition_type'
  ) THEN
    ALTER TABLE matches ADD COLUMN competition_type text;
  END IF;
END $$;

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_match_lineups_match_id ON match_lineups(match_id);
CREATE INDEX IF NOT EXISTS idx_match_lineups_created_by ON match_lineups(created_by);

CREATE INDEX IF NOT EXISTS idx_match_lineup_players_lineup_id ON match_lineup_players(lineup_id);
CREATE INDEX IF NOT EXISTS idx_match_lineup_players_player_id ON match_lineup_players(player_id);
CREATE INDEX IF NOT EXISTS idx_match_lineup_players_notified ON match_lineup_players(notified) WHERE notified = false;

CREATE INDEX IF NOT EXISTS idx_match_goals_match_id ON match_goals(match_id);
CREATE INDEX IF NOT EXISTS idx_match_goals_player_id ON match_goals(player_id);
CREATE INDEX IF NOT EXISTS idx_match_goals_assist_player_id ON match_goals(assist_player_id);

CREATE INDEX IF NOT EXISTS idx_player_notifications_player_id ON player_notifications(player_id);
CREATE INDEX IF NOT EXISTS idx_player_notifications_match_id ON player_notifications(match_id);
CREATE INDEX IF NOT EXISTS idx_player_notifications_read ON player_notifications(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_player_notifications_sent_at ON player_notifications(sent_at DESC);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE match_lineups ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_lineup_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Match Lineups Policies
CREATE POLICY "Clubs can view their own match lineups"
  ON match_lineups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can create match lineups for their matches"
  ON match_lineups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can update their own match lineups"
  ON match_lineups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_lineups.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view match lineups"
  ON match_lineups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- Match Lineup Players Policies
CREATE POLICY "Clubs can view lineup players for their matches"
  ON match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM match_lineups ml
      INNER JOIN matches m ON m.id = ml.match_id
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can add players to their match lineups"
  ON match_lineup_players FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM match_lineups ml
      INNER JOIN matches m ON m.id = ml.match_id
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can update lineup players for their matches"
  ON match_lineup_players FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM match_lineups ml
      INNER JOIN matches m ON m.id = ml.match_id
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM match_lineups ml
      INNER JOIN matches m ON m.id = ml.match_id
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE ml.id = match_lineup_players.lineup_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Players can view their own lineup assignments"
  ON match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM players p
      WHERE p.id = match_lineup_players.player_id
      AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view lineup players"
  ON match_lineup_players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- Match Goals Policies
CREATE POLICY "Clubs can view goals for their matches"
  ON match_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can add goals to their matches"
  ON match_goals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can update goals for their matches"
  ON match_goals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can delete goals from their matches"
  ON match_goals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      INNER JOIN clubs c ON c.id = m.club_id
      WHERE m.id = match_goals.match_id
      AND c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view match goals"
  ON match_goals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- Player Notifications Policies
CREATE POLICY "Players can view their own notifications"
  ON player_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM players p
      WHERE p.id = player_notifications.player_id
      AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Players can update their own notifications"
  ON player_notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM players p
      WHERE p.id = player_notifications.player_id
      AND p.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players p
      WHERE p.id = player_notifications.player_id
      AND p.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can create notifications for their players"
  ON player_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM players p
      INNER JOIN clubs c ON c.id = p.current_club_id
      WHERE p.id = player_notifications.player_id
      AND c.profile_id = auth.uid()
    )
  );

-- =====================================================
-- 6. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to automatically notify players when added to lineup
CREATE OR REPLACE FUNCTION notify_player_on_lineup_addition()
RETURNS TRIGGER AS $$
DECLARE
  v_match_date date;
  v_opponent_name text;
  v_player_name text;
BEGIN
  -- Get match details
  SELECT m.match_date, m.opponent_name
  INTO v_match_date, v_opponent_name
  FROM matches m
  INNER JOIN match_lineups ml ON ml.match_id = m.id
  WHERE ml.id = NEW.lineup_id;

  -- Get player name
  SELECT p.first_name || ' ' || p.last_name
  INTO v_player_name
  FROM players p
  WHERE p.id = NEW.player_id;

  -- Create notification
  INSERT INTO player_notifications (
    player_id,
    match_id,
    notification_type,
    title,
    message
  ) VALUES (
    NEW.player_id,
    (SELECT match_id FROM match_lineups WHERE id = NEW.lineup_id),
    'lineup_confirmation',
    'Match Lineup Confirmed',
    'You have been selected for the match against ' || v_opponent_name || ' on ' || v_match_date::text || '. Position: ' || NEW.position_in_formation || ' (Jersey #' || NEW.jersey_number || ')'
  );

  -- Mark as notified
  NEW.notified := true;
  NEW.notified_at := now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for player lineup notifications
DROP TRIGGER IF EXISTS trigger_notify_player_lineup ON match_lineup_players;
CREATE TRIGGER trigger_notify_player_lineup
  BEFORE INSERT ON match_lineup_players
  FOR EACH ROW
  EXECUTE FUNCTION notify_player_on_lineup_addition();

-- =====================================================
-- 7. CREATE VIEWS FOR EASY QUERYING
-- =====================================================

-- View: Match lineup with player details
CREATE OR REPLACE VIEW match_lineup_details AS
SELECT
  ml.id AS lineup_id,
  ml.match_id,
  ml.formation,
  ml.lineup_saved_at,
  m.match_date,
  m.opponent_name,
  m.competition,
  mlp.id AS lineup_player_id,
  mlp.player_id,
  p.first_name,
  p.last_name,
  p.position AS player_primary_position,
  mlp.position_in_formation,
  mlp.jersey_number,
  mlp.position_x,
  mlp.position_y,
  mlp.is_starting,
  mlp.notified
FROM match_lineups ml
INNER JOIN matches m ON m.id = ml.match_id
LEFT JOIN match_lineup_players mlp ON mlp.lineup_id = ml.id
LEFT JOIN players p ON p.id = mlp.player_id;

-- View: Match goals with player details
CREATE OR REPLACE VIEW match_goals_details AS
SELECT
  mg.id AS goal_id,
  mg.match_id,
  m.match_date,
  m.opponent_name,
  mg.minute,
  mg.added_time_minute,
  mg.goal_type,
  mg.is_home_goal,
  p_scorer.id AS scorer_id,
  p_scorer.first_name AS scorer_first_name,
  p_scorer.last_name AS scorer_last_name,
  p_assist.id AS assist_id,
  p_assist.first_name AS assist_first_name,
  p_assist.last_name AS assist_last_name,
  mg.description
FROM match_goals mg
INNER JOIN matches m ON m.id = mg.match_id
INNER JOIN players p_scorer ON p_scorer.id = mg.player_id
LEFT JOIN players p_assist ON p_assist.id = mg.assist_player_id;
