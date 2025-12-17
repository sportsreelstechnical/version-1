/*
  # Fix Function Security - Set Secure Search Path (Final)
  
  ## Security Issue
  Functions without SET search_path are vulnerable to search path injection attacks
  
  ## Solution
  Set search_path = public for all functions to prevent malicious schema injection
  
  ## Functions Fixed
  - update_updated_at_column
  - create_default_staff_permissions
  - create_audit_log
  - update_staff_updated_at
  - generate_staff_username
  - generate_staff_password
  - log_staff_activity
  - staff_with_permissions view (removed SECURITY DEFINER)
*/

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix create_default_staff_permissions
CREATE OR REPLACE FUNCTION public.create_default_staff_permissions(staff_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.staff_permissions (staff_id)
  VALUES (staff_id_param);
END;
$$;

-- Fix create_audit_log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  profile_id_param uuid,
  action_param text,
  entity_type_param text,
  entity_id_param uuid,
  old_values_param jsonb,
  new_values_param jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    profile_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  ) VALUES (
    profile_id_param,
    action_param,
    entity_type_param,
    entity_id_param,
    old_values_param,
    new_values_param
  );
END;
$$;

-- Fix update_staff_updated_at
CREATE OR REPLACE FUNCTION public.update_staff_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix generate_staff_username
CREATE OR REPLACE FUNCTION public.generate_staff_username(
  first_name_param text,
  last_name_param text,
  club_id_param uuid
)
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
  base_username := lower(substring(first_name_param from 1 for 1) || last_name_param);
  base_username := regexp_replace(base_username, '[^a-z0-9]', '', 'g');
  final_username := base_username;
  
  WHILE EXISTS (
    SELECT 1 FROM public.club_staff
    WHERE staff_username = final_username
    AND club_id = club_id_param
  ) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_username;
END;
$$;

-- Fix generate_staff_password
CREATE OR REPLACE FUNCTION public.generate_staff_password()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Fix log_staff_activity
CREATE OR REPLACE FUNCTION public.log_staff_activity(
  staff_id_param uuid,
  activity_type_param text,
  description_param text,
  metadata_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.staff_activity_logs (
    staff_id,
    activity_type,
    description,
    metadata
  ) VALUES (
    staff_id_param,
    activity_type_param,
    description_param,
    metadata_param
  );
END;
$$;

-- Fix staff_with_permissions view (recreate with correct columns)
DROP VIEW IF EXISTS public.staff_with_permissions;

CREATE VIEW public.staff_with_permissions AS
SELECT 
  cs.id,
  cs.club_id,
  cs.profile_id,
  cs.staff_name,
  cs.email,
  cs.contact_number,
  cs.staff_username,
  cs.is_active,
  cs.role,
  cs.access_level,
  cs.created_by,
  cs.created_at,
  cs.updated_at,
  cs.last_login,
  cs.status,
  sp.can_view_dashboard,
  sp.can_manage_players,
  sp.can_upload_matches,
  sp.can_edit_club_profile,
  sp.can_manage_staff,
  sp.can_use_ai_scouting,
  sp.can_view_messages,
  sp.can_manage_transfers,
  sp.can_view_club_history,
  sp.can_modify_settings,
  sp.can_explore_talent,
  sp.can_view_analytics,
  sp.can_export_data,
  sp.can_manage_subscriptions
FROM public.club_staff cs
LEFT JOIN public.staff_permissions sp ON sp.staff_id = cs.id;

GRANT SELECT ON public.staff_with_permissions TO authenticated;
