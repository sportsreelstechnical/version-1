/*
  # Create Test User Accounts for All Roles
  
  ## Purpose
  This migration creates test login credentials for development and testing purposes.
  It sets up complete user accounts for three distinct roles: Club Administrators, Scouts, and Players.
  
  ## Test Accounts Created
  
  ### Club Administrators (2 accounts)
  1. **Manchester United FC**
     - Email: admin@manchesterunited.com
     - Password: ClubAdmin2024!
     - Club: Manchester United FC
     - League: Premier League (England)
     
  2. **Real Madrid CF**
     - Email: admin@realmadrid.com
     - Password: RealMadrid2024!
     - Club: Real Madrid CF
     - League: La Liga (Spain)
  
  ### Scouts (2 accounts)
  1. **John Thompson** - Premier League Scout
     - Email: john.thompson@scout.com
     - Password: Scout2024!
     - License: FIFA-GB-2024-001
     - Specialization: Forwards, Wingers
     
  2. **Maria Garcia** - European Scout
     - Email: maria.garcia@scout.com
     - Password: ScoutMaria2024!
     - License: FIFA-ES-2024-002
     - Specialization: Midfielders, Defenders
  
  ### Players (2 accounts)
  1. **David Wilson** - Forward
     - Email: david.wilson@player.com
     - Password: Player2024!
     - Position: ST (Striker)
     - Nationality: England
     
  2. **Carlos Rodriguez** - Midfielder
     - Email: carlos.rodriguez@player.com
     - Password: CarlosPlayer2024!
     - Position: CM (Central Midfielder)
     - Nationality: Spain
  
  ## Security Notes
  - All passwords are hashed using Supabase's bcrypt implementation
  - These are TEST accounts only - DO NOT use in production
  - Email verification is automatically set to true for testing convenience
  - All accounts have 'active' status by default
  
  ## Technical Details
  - Uses Supabase Auth system (auth.users table)
  - Creates corresponding profiles in public.profiles
  - Populates role-specific tables (clubs, scouts, players)
  - Implements proper foreign key relationships
  - All IDs are deterministic UUIDs for easy reference
*/

-- =====================================================
-- STEP 1: CREATE CLUB ADMINISTRATOR ACCOUNTS
-- =====================================================

-- Club Admin 1: Manchester United FC
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid;
  v_club_id uuid := 'c0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Insert auth user (Supabase will hash the password)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@manchesterunited.com',
    crypt('ClubAdmin2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"club"}'::jsonb,
    '{"user_type":"club","club_name":"Manchester United FC"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'club',
    'admin@manchesterunited.com',
    '+44 161 868 8000',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert club record
  INSERT INTO public.clubs (
    id,
    profile_id,
    club_name,
    display_name,
    country,
    city,
    league,
    division,
    founded_year,
    stadium_name,
    stadium_capacity,
    website,
    contact_email,
    contact_phone,
    description,
    verified,
    plan_type,
    player_limit,
    created_at,
    updated_at
  ) VALUES (
    v_club_id,
    v_user_id,
    'Manchester United FC',
    'Manchester United',
    'England',
    'Manchester',
    'Premier League',
    'First Division',
    1878,
    'Old Trafford',
    74879,
    'https://www.manutd.com',
    'admin@manchesterunited.com',
    '+44 161 868 8000',
    'One of the most successful football clubs in England, competing in the Premier League.',
    true,
    'premium',
    50,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Club Admin 1: admin@manchesterunited.com';
END $$;

-- Club Admin 2: Real Madrid CF
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000002'::uuid;
  v_club_id uuid := 'c0000000-0000-0000-0000-000000000002'::uuid;
BEGIN
  -- Insert auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@realmadrid.com',
    crypt('RealMadrid2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"club"}'::jsonb,
    '{"user_type":"club","club_name":"Real Madrid CF"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'club',
    'admin@realmadrid.com',
    '+34 91 398 4300',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert club record
  INSERT INTO public.clubs (
    id,
    profile_id,
    club_name,
    display_name,
    country,
    city,
    league,
    division,
    founded_year,
    stadium_name,
    stadium_capacity,
    website,
    contact_email,
    contact_phone,
    description,
    verified,
    plan_type,
    player_limit,
    created_at,
    updated_at
  ) VALUES (
    v_club_id,
    v_user_id,
    'Real Madrid CF',
    'Real Madrid',
    'Spain',
    'Madrid',
    'La Liga',
    'Primera División',
    1902,
    'Santiago Bernabéu',
    81044,
    'https://www.realmadrid.com',
    'admin@realmadrid.com',
    '+34 91 398 4300',
    'The most successful club in European football history with 14 Champions League titles.',
    true,
    'premium',
    50,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Club Admin 2: admin@realmadrid.com';
END $$;

-- =====================================================
-- STEP 2: CREATE SCOUT ACCOUNTS
-- =====================================================

-- Scout 1: John Thompson
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000003'::uuid;
  v_scout_id uuid := 'e0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Insert auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'john.thompson@scout.com',
    crypt('Scout2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"scout"}'::jsonb,
    '{"user_type":"scout","name":"John Thompson"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'scout',
    'john.thompson@scout.com',
    '+44 7700 900123',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert scout record
  INSERT INTO public.scouts (
    id,
    profile_id,
    first_name,
    last_name,
    fifa_licence_number,
    licence_expiry_date,
    country,
    city,
    preferred_leagues,
    specialization,
    years_experience,
    bio,
    verified,
    linkedin_url,
    created_at,
    updated_at
  ) VALUES (
    v_scout_id,
    v_user_id,
    'John',
    'Thompson',
    'FIFA-GB-2024-001',
    '2025-12-31',
    'England',
    'London',
    ARRAY['Premier League', 'Championship', 'Bundesliga'],
    ARRAY['ST', 'CF', 'RW', 'LW'],
    12,
    'Experienced football scout with 12 years of professional experience. Specialized in identifying attacking talent across European leagues. Former professional player with deep understanding of forward positions.',
    true,
    'https://linkedin.com/in/johnthompson',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Scout 1: john.thompson@scout.com';
END $$;

-- Scout 2: Maria Garcia
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000004'::uuid;
  v_scout_id uuid := 'e0000000-0000-0000-0000-000000000002'::uuid;
BEGIN
  -- Insert auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'maria.garcia@scout.com',
    crypt('ScoutMaria2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"scout"}'::jsonb,
    '{"user_type":"scout","name":"Maria Garcia"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'scout',
    'maria.garcia@scout.com',
    '+34 600 123 456',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert scout record
  INSERT INTO public.scouts (
    id,
    profile_id,
    first_name,
    last_name,
    fifa_licence_number,
    licence_expiry_date,
    country,
    city,
    preferred_leagues,
    specialization,
    years_experience,
    bio,
    verified,
    linkedin_url,
    created_at,
    updated_at
  ) VALUES (
    v_scout_id,
    v_user_id,
    'Maria',
    'Garcia',
    'FIFA-ES-2024-002',
    '2025-12-31',
    'Spain',
    'Barcelona',
    ARRAY['La Liga', 'Serie A', 'Ligue 1'],
    ARRAY['CM', 'CDM', 'CB', 'RB', 'LB'],
    8,
    'FIFA-licensed scout with extensive experience in European leagues. Specialized in defensive and midfield positions. Known for discovering hidden gems in Spanish and Italian lower divisions.',
    true,
    'https://linkedin.com/in/mariagarcia',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Scout 2: maria.garcia@scout.com';
END $$;

-- =====================================================
-- STEP 3: CREATE PLAYER ACCOUNTS
-- =====================================================

-- Player 1: David Wilson
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000005'::uuid;
  v_player_id uuid := 'f0000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Insert auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'david.wilson@player.com',
    crypt('Player2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"player"}'::jsonb,
    '{"user_type":"player","name":"David Wilson"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'player',
    'david.wilson@player.com',
    '+44 7700 900456',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert player record
  INSERT INTO public.players (
    id,
    profile_id,
    first_name,
    last_name,
    fifa_id,
    date_of_birth,
    nationality,
    position,
    secondary_position,
    height_cm,
    weight_kg,
    preferred_foot,
    jersey_number,
    market_value_eur,
    transfer_status,
    player_status,
    bio,
    agent_name,
    agent_contact,
    created_at,
    updated_at
  ) VALUES (
    v_player_id,
    v_user_id,
    'David',
    'Wilson',
    'FIFA-ENG-2000-001',
    '2000-03-15',
    'England',
    'ST',
    'CF',
    185,
    78,
    'right',
    9,
    2500000,
    'available',
    'active',
    'Fast and clinical striker with excellent positioning. Strong in the air and capable of creating chances for teammates. Looking for opportunities in top European leagues.',
    'James Anderson',
    'james.anderson@agents.com',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Player 1: david.wilson@player.com';
END $$;

-- Player 2: Carlos Rodriguez
DO $$
DECLARE
  v_user_id uuid := 'a0000000-0000-0000-0000-000000000006'::uuid;
  v_player_id uuid := 'f0000000-0000-0000-0000-000000000002'::uuid;
BEGIN
  -- Insert auth user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'carlos.rodriguez@player.com',
    crypt('CarlosPlayer2024!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"user_type":"player"}'::jsonb,
    '{"user_type":"player","name":"Carlos Rodriguez"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (
    id,
    user_type,
    email,
    phone,
    status,
    email_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'player',
    'carlos.rodriguez@player.com',
    '+34 600 789 012',
    'active',
    true,
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;

  -- Insert player record
  INSERT INTO public.players (
    id,
    profile_id,
    first_name,
    last_name,
    fifa_id,
    date_of_birth,
    nationality,
    position,
    secondary_position,
    height_cm,
    weight_kg,
    preferred_foot,
    jersey_number,
    market_value_eur,
    transfer_status,
    player_status,
    bio,
    agent_name,
    agent_contact,
    created_at,
    updated_at
  ) VALUES (
    v_player_id,
    v_user_id,
    'Carlos',
    'Rodriguez',
    'FIFA-ESP-1998-002',
    '1998-07-22',
    'Spain',
    'CM',
    'CAM',
    178,
    73,
    'left',
    8,
    3500000,
    'available',
    'active',
    'Technical midfielder with excellent vision and passing range. Strong work rate both offensively and defensively. Experienced in La Liga and looking for new challenges.',
    'Elena Martinez',
    'elena.martinez@agents.com',
    now(),
    now()
  ) ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'Created Player 2: carlos.rodriguez@player.com';
END $$;

-- =====================================================
-- VERIFICATION AND SUMMARY
-- =====================================================

DO $$
DECLARE
  club_count int;
  scout_count int;
  player_count int;
BEGIN
  -- Count created records
  SELECT COUNT(*) INTO club_count FROM auth.users WHERE email LIKE '%@manchesterunited.com' OR email LIKE '%@realmadrid.com';
  SELECT COUNT(*) INTO scout_count FROM auth.users WHERE email LIKE '%@scout.com';
  SELECT COUNT(*) INTO player_count FROM auth.users WHERE email LIKE '%@player.com';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST USERS CREATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Club Administrators: % accounts', club_count;
  RAISE NOTICE 'Scouts: % accounts', scout_count;
  RAISE NOTICE 'Players: % accounts', player_count;
  RAISE NOTICE '';
  RAISE NOTICE 'CREDENTIALS SUMMARY:';
  RAISE NOTICE '----------------------------------------';
  RAISE NOTICE 'CLUBS:';
  RAISE NOTICE '1. admin@manchesterunited.com / ClubAdmin2024!';
  RAISE NOTICE '2. admin@realmadrid.com / RealMadrid2024!';
  RAISE NOTICE '';
  RAISE NOTICE 'SCOUTS:';
  RAISE NOTICE '3. john.thompson@scout.com / Scout2024!';
  RAISE NOTICE '4. maria.garcia@scout.com / ScoutMaria2024!';
  RAISE NOTICE '';
  RAISE NOTICE 'PLAYERS:';
  RAISE NOTICE '5. david.wilson@player.com / Player2024!';
  RAISE NOTICE '6. carlos.rodriguez@player.com / CarlosPlayer2024!';
  RAISE NOTICE '========================================';
END $$;