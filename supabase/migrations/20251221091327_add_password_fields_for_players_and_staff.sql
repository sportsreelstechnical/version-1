/*
  # Add Password Management Fields
  
  ## Changes
  
  1. Add password fields to players table
     - username (for login)
     - password_hash (temporary password storage)
     - password_reset_required (flag for first login)
     - last_password_reset (timestamp)
  
  2. Add password fields to club_staff table
     - password_hash (temporary password storage)
     - password_reset_required (flag for first login)
     - last_password_reset (timestamp)
  
  3. Create password reset functions
     - Function to generate and store password reset tokens
     - Function to log password changes
  
  ## Security Notes
  - Passwords will be generated and emailed to users
  - Users should be prompted to change password on first login
  - This is a temporary solution; production should use Supabase Auth fully
*/

-- Add password management fields to players table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.players ADD COLUMN username text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.players ADD COLUMN password_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'password_reset_required'
  ) THEN
    ALTER TABLE public.players ADD COLUMN password_reset_required boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'last_password_reset'
  ) THEN
    ALTER TABLE public.players ADD COLUMN last_password_reset timestamptz;
  END IF;
END $$;

-- Add password management fields to club_staff table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_staff' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.club_staff ADD COLUMN password_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_staff' AND column_name = 'password_reset_required'
  ) THEN
    ALTER TABLE public.club_staff ADD COLUMN password_reset_required boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_staff' AND column_name = 'last_password_reset'
  ) THEN
    ALTER TABLE public.club_staff ADD COLUMN last_password_reset timestamptz;
  END IF;
END $$;

-- Create function to generate username from email for players
CREATE OR REPLACE FUNCTION public.generate_player_username(email_param text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Extract username from email
  base_username := split_part(email_param, '@', 1);
  base_username := lower(regexp_replace(base_username, '[^a-z0-9]', '', 'g'));
  final_username := base_username;
  
  -- Ensure uniqueness
  WHILE EXISTS (
    SELECT 1 FROM public.players
    WHERE username = final_username
  ) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_username;
END;
$$;

-- Create function to reset password for players
CREATE OR REPLACE FUNCTION public.reset_player_password(
  player_id_param uuid,
  new_password_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.players
  SET 
    password_hash = new_password_hash,
    password_reset_required = true,
    last_password_reset = now()
  WHERE id = player_id_param;
  
  -- Log the password reset
  INSERT INTO public.audit_logs (
    profile_id,
    action,
    entity_type,
    entity_id
  )
  SELECT 
    profile_id,
    'password_reset',
    'player',
    player_id_param
  FROM public.players
  WHERE id = player_id_param;
END;
$$;

-- Create function to reset password for staff
CREATE OR REPLACE FUNCTION public.reset_staff_password(
  staff_id_param uuid,
  new_password_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.club_staff
  SET 
    password_hash = new_password_hash,
    password_reset_required = true,
    last_password_reset = now()
  WHERE id = staff_id_param;
  
  -- Log the password reset
  INSERT INTO public.audit_logs (
    profile_id,
    action,
    entity_type,
    entity_id
  )
  SELECT 
    (SELECT profile_id FROM public.clubs WHERE id = club_staff.club_id),
    'password_reset',
    'staff',
    staff_id_param
  FROM public.club_staff
  WHERE id = staff_id_param;
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_username ON public.players(username);
CREATE INDEX IF NOT EXISTS idx_players_password_reset_required ON public.players(password_reset_required) WHERE password_reset_required = true;
CREATE INDEX IF NOT EXISTS idx_club_staff_password_reset_required ON public.club_staff(password_reset_required) WHERE password_reset_required = true;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.generate_player_username(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_player_password(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_staff_password(uuid, text) TO authenticated;
