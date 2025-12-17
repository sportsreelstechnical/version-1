/*
  # Fix RLS Performance - Core Policies
  
  ## Optimizes the most frequently used RLS policies
  Wraps auth.uid() with (select auth.uid()) for better performance
  
  ## Tables optimized
  - profiles, clubs, scouts, players
  - club_staff, staff_permissions, staff_activity_logs
  - subscriptions, payments, audit_logs
*/

-- PROFILES (most critical - used by all authenticated users)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- CLUBS
DROP POLICY IF EXISTS "Clubs can view own data" ON public.clubs;
DROP POLICY IF EXISTS "Clubs can update own data" ON public.clubs;
DROP POLICY IF EXISTS "Clubs can insert own data" ON public.clubs;
DROP POLICY IF EXISTS "Scouts can view clubs" ON public.clubs;

CREATE POLICY "Clubs can view own data"
  ON public.clubs FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Scouts can view clubs"
  ON public.clubs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'scout'
    )
  );

CREATE POLICY "Clubs can update own data"
  ON public.clubs FOR UPDATE TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

CREATE POLICY "Clubs can insert own data"
  ON public.clubs FOR INSERT TO authenticated
  WITH CHECK (profile_id = (select auth.uid()));

-- SCOUTS
DROP POLICY IF EXISTS "Scouts can view own data" ON public.scouts;
DROP POLICY IF EXISTS "Scouts can update own data" ON public.scouts;
DROP POLICY IF EXISTS "Scouts can insert own data" ON public.scouts;
DROP POLICY IF EXISTS "Clubs can view scouts" ON public.scouts;

CREATE POLICY "Scouts can view own data"
  ON public.scouts FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Clubs can view scouts"
  ON public.scouts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'club'
    )
  );

CREATE POLICY "Scouts can update own data"
  ON public.scouts FOR UPDATE TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

CREATE POLICY "Scouts can insert own data"
  ON public.scouts FOR INSERT TO authenticated
  WITH CHECK (profile_id = (select auth.uid()));

-- PLAYERS
DROP POLICY IF EXISTS "Players can view own data" ON public.players;
DROP POLICY IF EXISTS "Players can update own data" ON public.players;
DROP POLICY IF EXISTS "Players can insert own data" ON public.players;
DROP POLICY IF EXISTS "Clubs can view their players" ON public.players;
DROP POLICY IF EXISTS "Clubs can update their players" ON public.players;
DROP POLICY IF EXISTS "Scouts can view players" ON public.players;

CREATE POLICY "Players can view own data"
  ON public.players FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Clubs can view their players"
  ON public.players FOR SELECT TO authenticated
  USING (
    current_club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Scouts can view players"
  ON public.players FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.user_type = 'scout'
    )
  );

CREATE POLICY "Players can update own data"
  ON public.players FOR UPDATE TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

CREATE POLICY "Clubs can update their players"
  ON public.players FOR UPDATE TO authenticated
  USING (
    current_club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    current_club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Players can insert own data"
  ON public.players FOR INSERT TO authenticated
  WITH CHECK (profile_id = (select auth.uid()));

-- CLUB_STAFF
DROP POLICY IF EXISTS "Club admins can view their own staff" ON public.club_staff;
DROP POLICY IF EXISTS "Club admins can create staff" ON public.club_staff;
DROP POLICY IF EXISTS "Club admins can update their own staff" ON public.club_staff;
DROP POLICY IF EXISTS "Club admins can delete their own staff" ON public.club_staff;

CREATE POLICY "Club admins can view their own staff"
  ON public.club_staff FOR SELECT TO authenticated
  USING (
    club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Club admins can create staff"
  ON public.club_staff FOR INSERT TO authenticated
  WITH CHECK (
    club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Club admins can update their own staff"
  ON public.club_staff FOR UPDATE TO authenticated
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

CREATE POLICY "Club admins can delete their own staff"
  ON public.club_staff FOR DELETE TO authenticated
  USING (
    club_id IN (
      SELECT clubs.id FROM public.clubs
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

-- STAFF_PERMISSIONS
DROP POLICY IF EXISTS "Users can view relevant staff permissions" ON public.staff_permissions;
DROP POLICY IF EXISTS "Club admins can create staff permissions" ON public.staff_permissions;
DROP POLICY IF EXISTS "Club admins can update staff permissions" ON public.staff_permissions;
DROP POLICY IF EXISTS "Club admins can delete staff permissions" ON public.staff_permissions;

CREATE POLICY "Users can view relevant staff permissions"
  ON public.staff_permissions FOR SELECT TO authenticated
  USING (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
         OR club_staff.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Club admins can create staff permissions"
  ON public.staff_permissions FOR INSERT TO authenticated
  WITH CHECK (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Club admins can update staff permissions"
  ON public.staff_permissions FOR UPDATE TO authenticated
  USING (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  )
  WITH CHECK (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Club admins can delete staff permissions"
  ON public.staff_permissions FOR DELETE TO authenticated
  USING (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

-- STAFF_ACTIVITY_LOGS
DROP POLICY IF EXISTS "Club admins can view staff activity logs" ON public.staff_activity_logs;
DROP POLICY IF EXISTS "Staff can create activity logs" ON public.staff_activity_logs;

CREATE POLICY "Club admins can view staff activity logs"
  ON public.staff_activity_logs FOR SELECT TO authenticated
  USING (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      JOIN public.clubs ON clubs.id = club_staff.club_id
      WHERE clubs.profile_id = (select auth.uid())
    )
  );

CREATE POLICY "Staff can create activity logs"
  ON public.staff_activity_logs FOR INSERT TO authenticated
  WITH CHECK (
    staff_id IN (
      SELECT club_staff.id FROM public.club_staff
      WHERE club_staff.profile_id = (select auth.uid())
    )
  );

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- PAYMENTS
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));

-- AUDIT_LOGS
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;

CREATE POLICY "Users can view own audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (profile_id = (select auth.uid()));
