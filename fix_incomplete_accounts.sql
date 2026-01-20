/*
  Fix Incomplete Accounts - Diagnostic and Repair Script

  Purpose: Find and fix accounts where auth user and profile exist,
           but the role-specific record (club/scout/player) is missing.

  Date: January 20, 2026
  Related Incident: AUTH-2026-01-20-001
*/

-- ===================================================================
-- PART 1: DIAGNOSTIC QUERIES
-- Run these first to identify incomplete accounts
-- ===================================================================

-- 1. Find all incomplete club accounts
SELECT
  p.id,
  p.email,
  p.user_type,
  p.phone,
  p.created_at,
  'MISSING CLUB RECORD' as issue
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id
WHERE p.user_type = 'club' AND c.id IS NULL
ORDER BY p.created_at DESC;

-- 2. Find all incomplete scout accounts
SELECT
  p.id,
  p.email,
  p.user_type,
  p.phone,
  p.created_at,
  'MISSING SCOUT RECORD' as issue
FROM profiles p
LEFT JOIN scouts s ON s.profile_id = p.id
WHERE p.user_type = 'scout' AND s.id IS NULL
ORDER BY p.created_at DESC;

-- 3. Find all incomplete player accounts
SELECT
  p.id,
  p.email,
  p.user_type,
  p.phone,
  p.created_at,
  'MISSING PLAYER RECORD' as issue
FROM profiles p
LEFT JOIN players pl ON pl.profile_id = p.id
WHERE p.user_type = 'player' AND pl.id IS NULL
ORDER BY p.created_at DESC;

-- 4. Summary count of all incomplete accounts
SELECT
  p.user_type,
  COUNT(*) as incomplete_accounts
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id AND p.user_type = 'club'
LEFT JOIN scouts s ON s.profile_id = p.id AND p.user_type = 'scout'
LEFT JOIN players pl ON pl.profile_id = p.id AND p.user_type = 'player'
WHERE
  (p.user_type = 'club' AND c.id IS NULL) OR
  (p.user_type = 'scout' AND s.id IS NULL) OR
  (p.user_type = 'player' AND pl.id IS NULL)
GROUP BY p.user_type;

-- ===================================================================
-- PART 2: HELPER FUNCTION
-- Create a function to detect incomplete accounts
-- ===================================================================

CREATE OR REPLACE FUNCTION find_incomplete_accounts()
RETURNS TABLE (
  profile_id uuid,
  email text,
  user_type text,
  missing_record text,
  created_at timestamptz
) AS $$
BEGIN
  -- Find club users without club records
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.user_type,
    'clubs'::text as missing_record,
    p.created_at
  FROM profiles p
  LEFT JOIN clubs c ON c.profile_id = p.id
  WHERE p.user_type = 'club' AND c.id IS NULL

  UNION ALL

  -- Find scout users without scout records
  SELECT
    p.id,
    p.email,
    p.user_type,
    'scouts'::text,
    p.created_at
  FROM profiles p
  LEFT JOIN scouts s ON s.profile_id = p.id
  WHERE p.user_type = 'scout' AND s.id IS NULL

  UNION ALL

  -- Find player users without player records
  SELECT
    p.id,
    p.email,
    p.user_type,
    'players'::text,
    p.created_at
  FROM profiles p
  LEFT JOIN players pl ON pl.profile_id = p.id
  WHERE p.user_type = 'player' AND pl.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT * FROM find_incomplete_accounts();

-- ===================================================================
-- PART 3: AUTOMATIC REPAIR FUNCTION
-- Create a function to automatically fix incomplete accounts
-- ===================================================================

CREATE OR REPLACE FUNCTION fix_incomplete_account(p_email text)
RETURNS jsonb AS $$
DECLARE
  v_profile_id uuid;
  v_user_type text;
  v_result jsonb;
  v_club_id uuid;
  v_scout_id uuid;
  v_player_id uuid;
BEGIN
  -- Get profile info
  SELECT id, user_type INTO v_profile_id, v_user_type
  FROM profiles
  WHERE email = p_email;

  -- Check if profile exists
  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Profile not found for email: ' || p_email
    );
  END IF;

  -- Fix based on user type
  IF v_user_type = 'club' THEN
    -- Check if club record already exists
    SELECT id INTO v_club_id FROM clubs WHERE profile_id = v_profile_id;

    IF v_club_id IS NULL THEN
      -- Create club record
      INSERT INTO clubs (
        profile_id,
        club_name,
        league,
        country,
        contact_email,
        verified,
        plan_type,
        player_limit
      ) VALUES (
        v_profile_id,
        'Club - ' || split_part(p_email, '@', 1),  -- Generate name from email
        'Unknown League',
        'Unknown',
        p_email,
        false,
        'basic',
        25
      ) RETURNING id INTO v_club_id;

      RETURN jsonb_build_object(
        'success', true,
        'action', 'created_club_record',
        'club_id', v_club_id,
        'profile_id', v_profile_id,
        'message', 'Club record created for ' || p_email
      );
    ELSE
      RETURN jsonb_build_object(
        'success', true,
        'action', 'club_already_exists',
        'club_id', v_club_id,
        'message', 'Club record already exists for ' || p_email
      );
    END IF;

  ELSIF v_user_type = 'scout' THEN
    -- Check if scout record already exists
    SELECT id INTO v_scout_id FROM scouts WHERE profile_id = v_profile_id;

    IF v_scout_id IS NULL THEN
      -- Create scout record
      INSERT INTO scouts (
        profile_id,
        first_name,
        last_name,
        country,
        verified
      ) VALUES (
        v_profile_id,
        'Scout',
        split_part(p_email, '@', 1),  -- Generate name from email
        'Unknown',
        false
      ) RETURNING id INTO v_scout_id;

      RETURN jsonb_build_object(
        'success', true,
        'action', 'created_scout_record',
        'scout_id', v_scout_id,
        'profile_id', v_profile_id,
        'message', 'Scout record created for ' || p_email
      );
    ELSE
      RETURN jsonb_build_object(
        'success', true,
        'action', 'scout_already_exists',
        'scout_id', v_scout_id,
        'message', 'Scout record already exists for ' || p_email
      );
    END IF;

  ELSIF v_user_type = 'player' THEN
    -- Check if player record already exists
    SELECT id INTO v_player_id FROM players WHERE profile_id = v_profile_id;

    IF v_player_id IS NULL THEN
      -- Create player record
      INSERT INTO players (
        profile_id,
        first_name,
        last_name,
        date_of_birth,
        nationality,
        position
      ) VALUES (
        v_profile_id,
        'Player',
        split_part(p_email, '@', 1),  -- Generate name from email
        '2000-01-01',  -- Default date of birth
        'Unknown',
        'CM'  -- Default position
      ) RETURNING id INTO v_player_id;

      RETURN jsonb_build_object(
        'success', true,
        'action', 'created_player_record',
        'player_id', v_player_id,
        'profile_id', v_profile_id,
        'message', 'Player record created for ' || p_email
      );
    ELSE
      RETURN jsonb_build_object(
        'success', true,
        'action', 'player_already_exists',
        'player_id', v_player_id,
        'message', 'Player record already exists for ' || p_email
      );
    END IF;

  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unknown user type: ' || v_user_type
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT fix_incomplete_account('user@example.com');

-- ===================================================================
-- PART 4: BATCH FIX FUNCTION
-- Fix all incomplete accounts at once
-- ===================================================================

CREATE OR REPLACE FUNCTION fix_all_incomplete_accounts()
RETURNS TABLE (
  email text,
  user_type text,
  result jsonb
) AS $$
DECLARE
  v_incomplete RECORD;
BEGIN
  FOR v_incomplete IN
    SELECT * FROM find_incomplete_accounts()
  LOOP
    RETURN QUERY
    SELECT
      v_incomplete.email,
      v_incomplete.user_type,
      fix_incomplete_account(v_incomplete.email);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT * FROM fix_all_incomplete_accounts();

-- ===================================================================
-- PART 5: MANUAL FIX QUERIES
-- Use these if you prefer manual control
-- ===================================================================

-- Fix a specific club account (replace email and values as needed)
/*
INSERT INTO clubs (
  profile_id,
  club_name,
  league,
  country,
  contact_email,
  verified,
  plan_type,
  player_limit
)
SELECT
  p.id,
  'Club Name',          -- UPDATE THIS
  'League Name',        -- UPDATE THIS
  'Country',            -- UPDATE THIS
  p.email,
  false,
  'basic',
  25
FROM profiles p
WHERE p.email = 'user@example.com'  -- UPDATE THIS
  AND p.user_type = 'club'
  AND NOT EXISTS (SELECT 1 FROM clubs WHERE profile_id = p.id);
*/

-- Fix a specific scout account (replace email and values as needed)
/*
INSERT INTO scouts (
  profile_id,
  first_name,
  last_name,
  country,
  verified
)
SELECT
  p.id,
  'First Name',         -- UPDATE THIS
  'Last Name',          -- UPDATE THIS
  'Country',            -- UPDATE THIS
  false
FROM profiles p
WHERE p.email = 'user@example.com'  -- UPDATE THIS
  AND p.user_type = 'scout'
  AND NOT EXISTS (SELECT 1 FROM scouts WHERE profile_id = p.id);
*/

-- Fix a specific player account (replace email and values as needed)
/*
INSERT INTO players (
  profile_id,
  first_name,
  last_name,
  date_of_birth,
  nationality,
  position
)
SELECT
  p.id,
  'First Name',         -- UPDATE THIS
  'Last Name',          -- UPDATE THIS
  '2000-01-01',         -- UPDATE THIS
  'Country',            -- UPDATE THIS
  'CM'                  -- UPDATE THIS (GK, CB, CM, ST, etc.)
FROM profiles p
WHERE p.email = 'user@example.com'  -- UPDATE THIS
  AND p.user_type = 'player'
  AND NOT EXISTS (SELECT 1 FROM players WHERE profile_id = p.id);
*/

-- ===================================================================
-- PART 6: VERIFICATION QUERIES
-- Run these after fixing to verify success
-- ===================================================================

-- Verify a specific account is complete
SELECT
  au.email,
  p.user_type,
  p.status,
  CASE
    WHEN p.user_type = 'club' AND c.id IS NOT NULL THEN 'COMPLETE'
    WHEN p.user_type = 'scout' AND s.id IS NOT NULL THEN 'COMPLETE'
    WHEN p.user_type = 'player' AND pl.id IS NOT NULL THEN 'COMPLETE'
    ELSE 'INCOMPLETE'
  END as account_status,
  COALESCE(c.club_name, s.first_name || ' ' || s.last_name, pl.first_name || ' ' || pl.last_name, 'N/A') as name
FROM auth.users au
JOIN profiles p ON p.id = au.id
LEFT JOIN clubs c ON c.profile_id = p.id AND p.user_type = 'club'
LEFT JOIN scouts s ON s.profile_id = p.id AND p.user_type = 'scout'
LEFT JOIN players pl ON pl.profile_id = p.id AND p.user_type = 'player'
WHERE au.email = 'sinclairajoku@gmail.com';  -- Replace with email to check

-- Count all complete vs incomplete accounts
SELECT
  CASE
    WHEN (p.user_type = 'club' AND c.id IS NOT NULL) OR
         (p.user_type = 'scout' AND s.id IS NOT NULL) OR
         (p.user_type = 'player' AND pl.id IS NOT NULL)
    THEN 'COMPLETE'
    ELSE 'INCOMPLETE'
  END as status,
  p.user_type,
  COUNT(*) as count
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id AND p.user_type = 'club'
LEFT JOIN scouts s ON s.profile_id = p.id AND p.user_type = 'scout'
LEFT JOIN players pl ON pl.profile_id = p.id AND p.user_type = 'player'
GROUP BY
  CASE
    WHEN (p.user_type = 'club' AND c.id IS NOT NULL) OR
         (p.user_type = 'scout' AND s.id IS NOT NULL) OR
         (p.user_type = 'player' AND pl.id IS NOT NULL)
    THEN 'COMPLETE'
    ELSE 'INCOMPLETE'
  END,
  p.user_type
ORDER BY p.user_type, status;

-- ===================================================================
-- PART 7: USAGE EXAMPLES
-- ===================================================================

/*
EXAMPLE 1: Find all incomplete accounts
------------------------
SELECT * FROM find_incomplete_accounts();

EXAMPLE 2: Fix a single account
------------------------
SELECT fix_incomplete_account('sinclairajoku@gmail.com');

EXAMPLE 3: Fix all incomplete accounts at once
------------------------
SELECT * FROM fix_all_incomplete_accounts();

EXAMPLE 4: Verify specific account
------------------------
SELECT
  p.email,
  p.user_type,
  c.club_name as club,
  s.first_name || ' ' || s.last_name as scout,
  pl.first_name || ' ' || pl.last_name as player
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id
LEFT JOIN scouts s ON s.profile_id = p.id
LEFT JOIN players pl ON pl.profile_id = p.id
WHERE p.email = 'user@example.com';

EXAMPLE 5: Get account statistics
------------------------
SELECT
  p.user_type,
  COUNT(*) as total_profiles,
  SUM(CASE WHEN c.id IS NOT NULL OR s.id IS NOT NULL OR pl.id IS NOT NULL THEN 1 ELSE 0 END) as complete,
  SUM(CASE WHEN c.id IS NULL AND s.id IS NULL AND pl.id IS NULL THEN 1 ELSE 0 END) as incomplete
FROM profiles p
LEFT JOIN clubs c ON c.profile_id = p.id
LEFT JOIN scouts s ON s.profile_id = p.id
LEFT JOIN players pl ON pl.profile_id = p.id
GROUP BY p.user_type;
*/

-- ===================================================================
-- PART 8: CLEANUP (OPTIONAL)
-- Remove functions after use if desired
-- ===================================================================

-- To remove the helper functions:
-- DROP FUNCTION IF EXISTS find_incomplete_accounts();
-- DROP FUNCTION IF EXISTS fix_incomplete_account(text);
-- DROP FUNCTION IF EXISTS fix_all_incomplete_accounts();

-- ===================================================================
-- END OF SCRIPT
-- ===================================================================
