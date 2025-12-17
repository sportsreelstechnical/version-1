/*
  # Fix RLS Performance - Remaining Policies
  
  ## Optimizes remaining RLS policies
  Wraps auth.uid() with (select auth.uid()) for better performance
  
  ## Tables optimized
  - club_teams, team_rosters, scout_affiliations
  - matches, match_players, player_statistics
  - ai_analyses, scouting_reports, player_career_history
  - message_threads, messages
*/

-- CLUB_TEAMS
DROP POLICY IF EXISTS "Clubs can manage own teams" ON public.club_teams;

CREATE POLICY "Clubs can manage own teams"
  ON public.club_teams FOR ALL TO authenticated
  USING (
    club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

-- TEAM_ROSTERS
DROP POLICY IF EXISTS "Clubs can manage own rosters" ON public.team_rosters;

CREATE POLICY "Clubs can manage own rosters"
  ON public.team_rosters FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT club_teams.id FROM public.club_teams
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT club_teams.id FROM public.club_teams
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

-- SCOUT_AFFILIATIONS
DROP POLICY IF EXISTS "Scouts can manage own affiliations" ON public.scout_affiliations;

CREATE POLICY "Scouts can manage own affiliations"
  ON public.scout_affiliations FOR ALL TO authenticated
  USING (
    scout_id IN (
      SELECT scouts.id FROM public.scouts
      WHERE scouts.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    scout_id IN (
      SELECT scouts.id FROM public.scouts
      WHERE scouts.profile_id = (select auth.uid())
    )
  );

-- MATCHES
DROP POLICY IF EXISTS "Clubs can manage own matches" ON public.matches;
DROP POLICY IF EXISTS "Scouts can view matches" ON public.matches;

CREATE POLICY "Clubs can manage own matches"
  ON public.matches FOR ALL TO authenticated
  USING (
    team_id IN (
      SELECT club_teams.id FROM public.club_teams
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT club_teams.id FROM public.club_teams
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view matches"
  ON public.matches FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'scout'
    )
  );

-- MATCH_PLAYERS
DROP POLICY IF EXISTS "Clubs can manage match players" ON public.match_players;

CREATE POLICY "Clubs can manage match players"
  ON public.match_players FOR ALL TO authenticated
  USING (
    match_id IN (
      SELECT matches.id FROM public.matches
      JOIN public.club_teams ON club_teams.id = matches.team_id
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    match_id IN (
      SELECT matches.id FROM public.matches
      JOIN public.club_teams ON club_teams.id = matches.team_id
      JOIN public.clubs ON clubs.id = club_teams.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

-- PLAYER_STATISTICS
DROP POLICY IF EXISTS "Clubs can manage player statistics" ON public.player_statistics;
DROP POLICY IF EXISTS "Players can view own statistics" ON public.player_statistics;
DROP POLICY IF EXISTS "Scouts can view statistics" ON public.player_statistics;

CREATE POLICY "Clubs can manage player statistics"
  ON public.player_statistics FOR ALL TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      JOIN public.clubs ON clubs.id = players.current_club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    player_id IN (
      SELECT players.id FROM public.players
      JOIN public.clubs ON clubs.id = players.current_club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Players can view own statistics"
  ON public.player_statistics FOR SELECT TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      WHERE players.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view statistics"
  ON public.player_statistics FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'scout'
    )
  );

-- AI_ANALYSES
DROP POLICY IF EXISTS "Clubs can view own analyses" ON public.ai_analyses;
DROP POLICY IF EXISTS "Players can view own analyses" ON public.ai_analyses;
DROP POLICY IF EXISTS "Scouts can view analyses" ON public.ai_analyses;

CREATE POLICY "Clubs can view own analyses"
  ON public.ai_analyses FOR SELECT TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      JOIN public.clubs ON clubs.id = players.current_club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Players can view own analyses"
  ON public.ai_analyses FOR SELECT TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      WHERE players.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view analyses"
  ON public.ai_analyses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'scout'
    )
  );

-- SCOUTING_REPORTS
DROP POLICY IF EXISTS "Scouts can manage own reports" ON public.scouting_reports;
DROP POLICY IF EXISTS "Clubs can view shared reports" ON public.scouting_reports;
DROP POLICY IF EXISTS "Players can view reports about them" ON public.scouting_reports;

CREATE POLICY "Scouts can manage own reports"
  ON public.scouting_reports FOR ALL TO authenticated
  USING (
    scout_id IN (
      SELECT scouts.id FROM public.scouts
      WHERE scouts.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    scout_id IN (
      SELECT scouts.id FROM public.scouts
      WHERE scouts.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can view shared reports"
  ON public.scouting_reports FOR SELECT TO authenticated
  USING (
    NOT is_confidential
    OR (
      SELECT c.id FROM public.clubs c
      WHERE c.profile_id = (select auth.uid())
    ) = ANY(shared_with_clubs)
  );

CREATE POLICY "Players can view reports about them"
  ON public.scouting_reports FOR SELECT TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      WHERE players.profile_id = (select auth.uid())
    )
    AND NOT is_confidential
  );

-- PLAYER_CAREER_HISTORY
DROP POLICY IF EXISTS "Players can manage own history" ON public.player_career_history;
DROP POLICY IF EXISTS "Clubs can view player history" ON public.player_career_history;

CREATE POLICY "Players can manage own history"
  ON public.player_career_history FOR ALL TO authenticated
  USING (
    player_id IN (
      SELECT players.id FROM public.players
      WHERE players.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    player_id IN (
      SELECT players.id FROM public.players
      WHERE players.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Clubs can view player history"
  ON public.player_career_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type IN ('club', 'scout')
    )
  );

-- MESSAGE_THREADS
DROP POLICY IF EXISTS "Users can view threads they participate in" ON public.message_threads;
DROP POLICY IF EXISTS "Users can create threads" ON public.message_threads;
DROP POLICY IF EXISTS "Users can update threads they participate in" ON public.message_threads;

CREATE POLICY "Users can view threads they participate in"
  ON public.message_threads FOR SELECT TO authenticated
  USING ((select auth.uid()) = ANY(participant_ids));

CREATE POLICY "Users can create threads"
  ON public.message_threads FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = ANY(participant_ids));

CREATE POLICY "Users can update threads they participate in"
  ON public.message_threads FOR UPDATE TO authenticated
  USING ((select auth.uid()) = ANY(participant_ids))
  WITH CHECK ((select auth.uid()) = ANY(participant_ids));

-- MESSAGES
DROP POLICY IF EXISTS "Users can view messages in their threads" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their threads" ON public.messages;

CREATE POLICY "Users can view messages in their threads"
  ON public.messages FOR SELECT TO authenticated
  USING (
    thread_id IN (
      SELECT message_threads.id FROM public.message_threads
      WHERE (select auth.uid()) = ANY(message_threads.participant_ids)
    )
  );

CREATE POLICY "Users can send messages in their threads"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    from_profile_id = (select auth.uid())
    AND thread_id IN (
      SELECT message_threads.id FROM public.message_threads
      WHERE (select auth.uid()) = ANY(message_threads.participant_ids)
    )
  );
