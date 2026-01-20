/*
  # Fix Club and Scout Login Authentication Issue

  ## Problem
  After the recent RLS policy consolidation, club users cannot log in because:
  - The clubs table SELECT policy requires users to be in club_staff
  - New clubs are NOT automatically added to club_staff during registration
  - The policy doesn't check if profile_id matches auth.uid() for direct ownership

  ## Solution
  Update the RLS policies to allow:
  1. Clubs to view their own data via profile_id = auth.uid()
  2. Scouts to view their own data via profile_id = auth.uid() (already present, but re-confirming)
  3. Maintain existing access patterns for club_staff and cross-role viewing

  ## Changes
  - Modified clubs SELECT policy to include profile_id check
  - Verified scouts SELECT policy has profile_id check
  - Maintained all existing access control logic
*/

-- =====================================================
-- Fix clubs table SELECT policy
-- =====================================================

DROP POLICY IF EXISTS "Clubs and scouts can view club data" ON clubs;

CREATE POLICY "Clubs and scouts can view club data"
  ON clubs
  FOR SELECT
  TO authenticated
  USING (
    -- Clubs can view their own data (CRITICAL FIX)
    profile_id = auth.uid()
    OR
    -- Club staff can view their club
    EXISTS (
      SELECT 1 FROM club_staff cs
      WHERE cs.club_id = clubs.id
      AND cs.profile_id = auth.uid()
    )
    OR
    -- Scouts can view all clubs
    EXISTS (
      SELECT 1 FROM scouts s
      WHERE s.profile_id = auth.uid()
    )
  );

-- =====================================================
-- Verify scouts table SELECT policy is correct
-- =====================================================

-- Drop and recreate to ensure it's correct
DROP POLICY IF EXISTS "Scouts and clubs can view scout data" ON scouts;

CREATE POLICY "Scouts and clubs can view scout data"
  ON scouts
  FOR SELECT
  TO authenticated
  USING (
    -- Scouts can view own data (CRITICAL for scout login)
    profile_id = auth.uid()
    OR
    -- Clubs can view scouts
    EXISTS (
      SELECT 1 FROM club_staff cs
      WHERE cs.profile_id = auth.uid()
    )
  );

-- =====================================================
-- Add helpful comments for future reference
-- =====================================================

COMMENT ON POLICY "Clubs and scouts can view club data" ON clubs IS 
'Allows clubs to view their own data via profile_id, club staff to view their club, and scouts to view all clubs';

COMMENT ON POLICY "Scouts and clubs can view scout data" ON scouts IS 
'Allows scouts to view their own data via profile_id, and club staff to view all scouts';
