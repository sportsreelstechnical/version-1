/*
  # Comprehensive Sports Management Platform Database Schema

  ## Overview
  This migration creates a complete database schema for a sports management platform
  supporting three user types: Clubs, Scouts, and Players.

  ## Design Decisions
  
  ### Authentication Strategy
  - Uses Supabase Auth (auth.users) for all user authentication
  - No custom password tables - Supabase handles this securely
  - user_type stored in profiles to differentiate roles
  
  ### Data Architecture
  - Base `profiles` table for common user data
  - Role-specific tables (clubs, scouts, players) for specialized information
  - Separation of concerns: authentication vs. business data
  - Foreign keys ensure referential integrity
  
  ### Security Model
  - Row Level Security (RLS) enabled on ALL tables
  - Users can only read/write their own data
  - Scouts can view player and club data (read-only)
  - Audit logging for compliance and debugging

  ## Tables Created

  ### 1. Core Tables
  - `profiles` - Base user profile (all user types)
  - `clubs` - Club-specific information and organization details
  - `scouts` - Scout credentials and professional information
  - `players` - Player profiles, statistics, and career information
  
  ### 2. Relationship Tables
  - `club_teams` - Teams within clubs
  - `team_rosters` - Player-team associations
  - `scout_affiliations` - Scout-organization relationships
  
  ### 3. Activity Tables
  - `matches` - Match records and video uploads
  - `player_statistics` - Detailed player performance metrics
  - `ai_analyses` - AI-generated performance analysis
  - `scouting_reports` - Scout evaluations of players
  - `player_career_history` - Historical career records
  
  ### 4. Communication Tables
  - `messages` - Direct messaging between users
  - `message_threads` - Conversation grouping
  
  ### 5. Business Tables
  - `subscriptions` - User subscription management
  - `payments` - Payment transaction records
  
  ### 6. System Tables
  - `audit_logs` - Comprehensive activity tracking for compliance
  
  ## Security Features
  - All tables have RLS enabled
  - Restrictive policies: users access only their data
  - Scouts have read-only access to players and clubs
  - Admin functions isolated from user access
  - Automatic timestamp tracking with triggers
  
  ## Performance Optimizations
  - Indexes on foreign keys
  - Indexes on frequently queried columns (email, user_type, status)
  - Composite indexes for common query patterns
  
  ## Compliance
  - Audit logging for GDPR compliance
  - Soft delete capability via status fields
  - Timestamp tracking for data retention policies
*/

-- =====================================================
-- 1. CORE USER TABLES
-- =====================================================

-- Profiles: Base table for all users (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type text NOT NULL CHECK (user_type IN ('club', 'scout', 'player')),
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clubs: Organization and team management
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  club_name text NOT NULL,
  display_name text,
  website text,
  division text,
  league text NOT NULL,
  country text NOT NULL,
  city text,
  founded_year integer,
  stadium_name text,
  stadium_capacity integer,
  club_logo_url text,
  description text,
  contact_email text,
  contact_phone text,
  verified boolean DEFAULT false,
  plan_type text DEFAULT 'basic' CHECK (plan_type IN ('basic', 'standard', 'premium')),
  player_limit integer DEFAULT 25,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scouts: Professional scouting credentials
CREATE TABLE IF NOT EXISTS scouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  fifa_licence_number text UNIQUE,
  licence_expiry_date date,
  country text NOT NULL,
  city text,
  preferred_leagues text[], -- Array of league preferences
  specialization text[], -- Array of specializations (e.g., 'striker', 'defender')
  years_experience integer DEFAULT 0,
  bio text,
  verified boolean DEFAULT false,
  linkedin_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Players: Comprehensive player profiles
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  fifa_id text UNIQUE,
  date_of_birth date NOT NULL,
  nationality text NOT NULL,
  secondary_nationality text,
  position text NOT NULL CHECK (position IN ('GK', 'RB', 'CB', 'LB', 'CDM', 'CM', 'CAM', 'RM', 'LM', 'RW', 'LW', 'ST', 'CF')),
  secondary_position text,
  height_cm integer,
  weight_kg integer,
  preferred_foot text CHECK (preferred_foot IN ('left', 'right', 'both')),
  jersey_number integer CHECK (jersey_number BETWEEN 1 AND 99),
  current_club_id uuid REFERENCES clubs(id) ON DELETE SET NULL,
  contract_start_date date,
  contract_end_date date,
  market_value_eur integer,
  transfer_status text DEFAULT 'available' CHECK (transfer_status IN ('available', 'not_available', 'loan', 'negotiating')),
  player_status text DEFAULT 'active' CHECK (player_status IN ('active', 'injured', 'suspended', 'retired')),
  injury_details text,
  photo_url text,
  video_reel_url text,
  bio text,
  agent_name text,
  agent_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. RELATIONSHIP TABLES
-- =====================================================

-- Club Teams: Teams within clubs (U-21, Reserve, First Team, etc.)
CREATE TABLE IF NOT EXISTS club_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  team_name text NOT NULL,
  team_type text NOT NULL CHECK (team_type IN ('first_team', 'reserve', 'youth', 'u21', 'u19', 'u17')),
  coach_name text,
  formation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(club_id, team_name)
);

-- Team Rosters: Player assignments to teams
CREATE TABLE IF NOT EXISTS team_rosters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES club_teams(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  joined_date date DEFAULT CURRENT_DATE,
  left_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, player_id, joined_date)
);

-- Scout Affiliations: Scout relationships with organizations
CREATE TABLE IF NOT EXISTS scout_affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id uuid REFERENCES scouts(id) ON DELETE CASCADE NOT NULL,
  organization_name text NOT NULL,
  organization_type text CHECK (organization_type IN ('club', 'agency', 'federation', 'independent')),
  affiliation_type text CHECK (affiliation_type IN ('employed', 'contracted', 'affiliated', 'freelance')),
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. ACTIVITY TABLES
-- =====================================================

-- Matches: Game records and video uploads
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  team_id uuid REFERENCES club_teams(id) ON DELETE SET NULL,
  match_date date NOT NULL,
  opponent_name text NOT NULL,
  competition text, -- League, Cup, Friendly, etc.
  home_away text CHECK (home_away IN ('home', 'away', 'neutral')),
  score_home integer,
  score_away integer,
  video_url text,
  video_thumbnail_url text,
  duration_minutes integer,
  upload_status text DEFAULT 'pending' CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
  analyzed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Match Players: Track which players participated in matches
CREATE TABLE IF NOT EXISTS match_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  started boolean DEFAULT false,
  minutes_played integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- Player Statistics: Detailed performance metrics per match
CREATE TABLE IF NOT EXISTS player_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  shots_total integer DEFAULT 0,
  shots_on_target integer DEFAULT 0,
  passes_completed integer DEFAULT 0,
  passes_attempted integer DEFAULT 0,
  pass_accuracy_percent decimal(5,2),
  dribbles_successful integer DEFAULT 0,
  dribbles_attempted integer DEFAULT 0,
  tackles_won integer DEFAULT 0,
  tackles_attempted integer DEFAULT 0,
  interceptions integer DEFAULT 0,
  clearances integer DEFAULT 0,
  fouls_committed integer DEFAULT 0,
  fouls_suffered integer DEFAULT 0,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  distance_covered_km decimal(5,2),
  top_speed_kmh decimal(5,2),
  sprint_count integer DEFAULT 0,
  rating decimal(3,1) CHECK (rating BETWEEN 0 AND 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- AI Analyses: AI-generated performance insights
CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  analysis_type text DEFAULT 'performance' CHECK (analysis_type IN ('performance', 'tactical', 'physical', 'technical')),
  heat_map_url text,
  key_strengths text[],
  areas_for_improvement text[],
  tactical_insights text,
  physical_assessment text,
  overall_rating decimal(3,1) CHECK (overall_rating BETWEEN 0 AND 10),
  ai_model_version text,
  confidence_score decimal(3,2),
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, player_id, analysis_type)
);

-- Scouting Reports: Scout evaluations
CREATE TABLE IF NOT EXISTS scouting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scout_id uuid REFERENCES scouts(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  match_id uuid REFERENCES matches(id) ON DELETE SET NULL,
  report_date date DEFAULT CURRENT_DATE,
  overall_rating decimal(3,1) CHECK (overall_rating BETWEEN 0 AND 10),
  technical_rating decimal(3,1) CHECK (technical_rating BETWEEN 0 AND 10),
  tactical_rating decimal(3,1) CHECK (tactical_rating BETWEEN 0 AND 10),
  physical_rating decimal(3,1) CHECK (physical_rating BETWEEN 0 AND 10),
  mental_rating decimal(3,1) CHECK (mental_rating BETWEEN 0 AND 10),
  potential_rating decimal(3,1) CHECK (potential_rating BETWEEN 0 AND 10),
  strengths text,
  weaknesses text,
  recommendation text CHECK (recommendation IN ('sign_immediately', 'monitor_closely', 'consider', 'not_recommended')),
  estimated_value_eur integer,
  notes text,
  is_confidential boolean DEFAULT false,
  shared_with_clubs uuid[], -- Array of club IDs
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Player Career History: Historical records
CREATE TABLE IF NOT EXISTS player_career_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  club_name text NOT NULL,
  club_country text,
  league text,
  start_date date NOT NULL,
  end_date date,
  transfer_type text CHECK (transfer_type IN ('transfer', 'loan', 'free', 'youth')),
  transfer_fee_eur integer,
  appearances integer DEFAULT 0,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  jersey_number integer,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. COMMUNICATION TABLES
-- =====================================================

-- Message Threads: Conversation grouping
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text,
  participant_ids uuid[] NOT NULL, -- Array of profile IDs
  regarding_player_id uuid REFERENCES players(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages: Direct messaging
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES message_threads(id) ON DELETE CASCADE NOT NULL,
  from_profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  attachments text[], -- Array of URLs
  read_by uuid[] DEFAULT '{}', -- Array of profile IDs who have read
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 5. BUSINESS TABLES
-- =====================================================

-- Subscriptions: User subscription management
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('basic', 'standard', 'premium', 'scout')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  price_eur decimal(10,2) NOT NULL,
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
  player_limit integer,
  features jsonb DEFAULT '{}',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  auto_renew boolean DEFAULT true,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments: Transaction records
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount_eur decimal(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_id text,
  stripe_invoice_id text,
  invoice_url text,
  payment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 6. SYSTEM TABLES
-- =====================================================

-- Audit Logs: Comprehensive activity tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL, -- 'login', 'logout', 'create', 'update', 'delete', etc.
  entity_type text, -- 'player', 'match', 'report', etc.
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- Clubs indexes
CREATE INDEX IF NOT EXISTS idx_clubs_profile_id ON clubs(profile_id);
CREATE INDEX IF NOT EXISTS idx_clubs_league ON clubs(league);
CREATE INDEX IF NOT EXISTS idx_clubs_country ON clubs(country);
CREATE INDEX IF NOT EXISTS idx_clubs_verified ON clubs(verified);

-- Scouts indexes
CREATE INDEX IF NOT EXISTS idx_scouts_profile_id ON scouts(profile_id);
CREATE INDEX IF NOT EXISTS idx_scouts_country ON scouts(country);
CREATE INDEX IF NOT EXISTS idx_scouts_verified ON scouts(verified);

-- Players indexes
CREATE INDEX IF NOT EXISTS idx_players_profile_id ON players(profile_id);
CREATE INDEX IF NOT EXISTS idx_players_current_club ON players(current_club_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_nationality ON players(nationality);
CREATE INDEX IF NOT EXISTS idx_players_transfer_status ON players(transfer_status);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_club_id ON matches(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_team_id ON matches(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);

-- Statistics indexes
CREATE INDEX IF NOT EXISTS idx_player_stats_match ON player_statistics(match_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON player_statistics(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_composite ON player_statistics(player_id, match_id);

-- Scouting reports indexes
CREATE INDEX IF NOT EXISTS idx_scouting_reports_scout ON scouting_reports(scout_id);
CREATE INDEX IF NOT EXISTS idx_scouting_reports_player ON scouting_reports(player_id);
CREATE INDEX IF NOT EXISTS idx_scouting_reports_date ON scouting_reports(report_date);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_profile ON audit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_career_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = profiles.id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = profiles.id)
  WITH CHECK (auth.uid() = profiles.id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profiles.id);

-- CLUBS POLICIES
CREATE POLICY "Clubs can view own data"
  ON clubs FOR SELECT
  TO authenticated
  USING (clubs.profile_id = auth.uid());

CREATE POLICY "Clubs can update own data"
  ON clubs FOR UPDATE
  TO authenticated
  USING (clubs.profile_id = auth.uid())
  WITH CHECK (clubs.profile_id = auth.uid());

CREATE POLICY "Clubs can insert own data"
  ON clubs FOR INSERT
  TO authenticated
  WITH CHECK (clubs.profile_id = auth.uid());

CREATE POLICY "Scouts can view clubs"
  ON clubs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- SCOUTS POLICIES
CREATE POLICY "Scouts can view own data"
  ON scouts FOR SELECT
  TO authenticated
  USING (scouts.profile_id = auth.uid());

CREATE POLICY "Scouts can update own data"
  ON scouts FOR UPDATE
  TO authenticated
  USING (scouts.profile_id = auth.uid())
  WITH CHECK (scouts.profile_id = auth.uid());

CREATE POLICY "Scouts can insert own data"
  ON scouts FOR INSERT
  TO authenticated
  WITH CHECK (scouts.profile_id = auth.uid());

CREATE POLICY "Clubs can view scouts"
  ON scouts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'club'
    )
  );

-- PLAYERS POLICIES
CREATE POLICY "Players can view own data"
  ON players FOR SELECT
  TO authenticated
  USING (players.profile_id = auth.uid());

CREATE POLICY "Players can update own data"
  ON players FOR UPDATE
  TO authenticated
  USING (players.profile_id = auth.uid())
  WITH CHECK (players.profile_id = auth.uid());

CREATE POLICY "Players can insert own data"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (players.profile_id = auth.uid());

CREATE POLICY "Clubs can view their players"
  ON players FOR SELECT
  TO authenticated
  USING (
    players.current_club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can update their players"
  ON players FOR UPDATE
  TO authenticated
  USING (
    players.current_club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    players.current_club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view players"
  ON players FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- CLUB TEAMS POLICIES
CREATE POLICY "Clubs can manage own teams"
  ON club_teams FOR ALL
  TO authenticated
  USING (
    club_teams.club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    club_teams.club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  );

-- TEAM ROSTERS POLICIES
CREATE POLICY "Clubs can manage own rosters"
  ON team_rosters FOR ALL
  TO authenticated
  USING (
    team_rosters.team_id IN (
      SELECT ct.id FROM club_teams ct
      JOIN clubs c ON ct.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    team_rosters.team_id IN (
      SELECT ct.id FROM club_teams ct
      JOIN clubs c ON ct.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  );

-- SCOUT AFFILIATIONS POLICIES
CREATE POLICY "Scouts can manage own affiliations"
  ON scout_affiliations FOR ALL
  TO authenticated
  USING (
    scout_affiliations.scout_id IN (
      SELECT scouts.id FROM scouts WHERE scouts.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    scout_affiliations.scout_id IN (
      SELECT scouts.id FROM scouts WHERE scouts.profile_id = auth.uid()
    )
  );

-- MATCHES POLICIES
CREATE POLICY "Clubs can manage own matches"
  ON matches FOR ALL
  TO authenticated
  USING (
    matches.club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    matches.club_id IN (
      SELECT clubs.id FROM clubs WHERE clubs.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- MATCH PLAYERS POLICIES
CREATE POLICY "Clubs can manage match players"
  ON match_players FOR ALL
  TO authenticated
  USING (
    match_players.match_id IN (
      SELECT m.id FROM matches m
      JOIN clubs c ON m.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    match_players.match_id IN (
      SELECT m.id FROM matches m
      JOIN clubs c ON m.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  );

-- PLAYER STATISTICS POLICIES
CREATE POLICY "Clubs can manage player statistics"
  ON player_statistics FOR ALL
  TO authenticated
  USING (
    player_statistics.match_id IN (
      SELECT m.id FROM matches m
      JOIN clubs c ON m.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    player_statistics.match_id IN (
      SELECT m.id FROM matches m
      JOIN clubs c ON m.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Players can view own statistics"
  ON player_statistics FOR SELECT
  TO authenticated
  USING (
    player_statistics.player_id IN (
      SELECT players.id FROM players WHERE players.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view statistics"
  ON player_statistics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- AI ANALYSES POLICIES
CREATE POLICY "Clubs can view own analyses"
  ON ai_analyses FOR SELECT
  TO authenticated
  USING (
    ai_analyses.match_id IN (
      SELECT m.id FROM matches m
      JOIN clubs c ON m.club_id = c.id
      WHERE c.profile_id = auth.uid()
    )
  );

CREATE POLICY "Players can view own analyses"
  ON ai_analyses FOR SELECT
  TO authenticated
  USING (
    ai_analyses.player_id IN (
      SELECT players.id FROM players WHERE players.profile_id = auth.uid()
    )
  );

CREATE POLICY "Scouts can view analyses"
  ON ai_analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'scout'
    )
  );

-- SCOUTING REPORTS POLICIES
CREATE POLICY "Scouts can manage own reports"
  ON scouting_reports FOR ALL
  TO authenticated
  USING (
    scouting_reports.scout_id IN (
      SELECT scouts.id FROM scouts WHERE scouts.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    scouting_reports.scout_id IN (
      SELECT scouts.id FROM scouts WHERE scouts.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can view shared reports"
  ON scouting_reports FOR SELECT
  TO authenticated
  USING (
    NOT scouting_reports.is_confidential
    OR (
      SELECT c.id FROM clubs c
      WHERE c.profile_id = auth.uid()
    ) = ANY(scouting_reports.shared_with_clubs)
  );

CREATE POLICY "Players can view reports about them"
  ON scouting_reports FOR SELECT
  TO authenticated
  USING (
    scouting_reports.player_id IN (
      SELECT players.id FROM players WHERE players.profile_id = auth.uid()
    )
    AND NOT scouting_reports.is_confidential
  );

-- PLAYER CAREER HISTORY POLICIES
CREATE POLICY "Players can manage own history"
  ON player_career_history FOR ALL
  TO authenticated
  USING (
    player_career_history.player_id IN (
      SELECT players.id FROM players WHERE players.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    player_career_history.player_id IN (
      SELECT players.id FROM players WHERE players.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clubs can view player history"
  ON player_career_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type IN ('club', 'scout')
    )
  );

-- MESSAGE THREADS POLICIES
CREATE POLICY "Users can view threads they participate in"
  ON message_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(message_threads.participant_ids));

CREATE POLICY "Users can create threads"
  ON message_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = ANY(message_threads.participant_ids));

CREATE POLICY "Users can update threads they participate in"
  ON message_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = ANY(message_threads.participant_ids))
  WITH CHECK (auth.uid() = ANY(message_threads.participant_ids));

-- MESSAGES POLICIES
CREATE POLICY "Users can view messages in their threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    messages.thread_id IN (
      SELECT message_threads.id FROM message_threads
      WHERE auth.uid() = ANY(message_threads.participant_ids)
    )
  );

CREATE POLICY "Users can send messages in their threads"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    messages.from_profile_id = auth.uid()
    AND messages.thread_id IN (
      SELECT message_threads.id FROM message_threads
      WHERE auth.uid() = ANY(message_threads.participant_ids)
    )
  );

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (subscriptions.profile_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (subscriptions.profile_id = auth.uid())
  WITH CHECK (subscriptions.profile_id = auth.uid());

-- PAYMENTS POLICIES
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (payments.profile_id = auth.uid());

-- AUDIT LOGS POLICIES
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (audit_logs.profile_id = auth.uid());

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON clubs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouts_updated_at
  BEFORE UPDATE ON scouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouting_reports_updated_at
  BEFORE UPDATE ON scouting_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON message_threads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entries automatically
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (profile_id, action, entity_type, entity_id, old_values)
    VALUES (auth.uid(), 'delete', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (profile_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (auth.uid(), 'update', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (profile_id, action, entity_type, entity_id, new_values)
    VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_players_changes
  AFTER INSERT OR UPDATE OR DELETE ON players
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_matches_changes
  AFTER INSERT OR UPDATE OR DELETE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_scouting_reports_changes
  AFTER INSERT OR UPDATE OR DELETE ON scouting_reports
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();