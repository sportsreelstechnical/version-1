/*
  # Staff Management System for Club Dashboard

  ## Overview
  This migration creates a comprehensive staff management system that allows club administrators
  to add staff members with role-based access control to their club dashboard.

  ## Key Features
  1. **Staff Accounts**: Separate authentication for staff members linked to clubs
  2. **Permission System**: Granular permissions for each sidebar feature
  3. **Role-Based Access**: Staff can only access features they have permissions for
  4. **Credential Management**: Super-admin can generate/reset staff login credentials
  5. **Audit Trail**: Track all staff activities and permission changes

  ## Tables Created

  ### 1. club_staff
  - Stores staff member information and authentication details
  - Links staff to their parent club
  - Manages staff status and access levels

  ### 2. staff_permissions
  - Granular permission control for dashboard features
  - Controls access to sidebar menu items
  - Enables/disables specific functionality per staff member

  ### 3. staff_activity_logs
  - Tracks all staff actions for audit purposes
  - Records login attempts and feature access
  - Helps with compliance and security monitoring

  ## Permission Categories
  - player_management: Add, edit, delete players
  - match_uploads: Upload and manage match videos
  - club_profile: Edit club information
  - staff_management: Manage other staff (admin only)
  - ai_scouting: Access AI analysis tools
  - messages: View and send messages
  - player_transfers: Manage player transfers
  - club_history: View club history
  - settings: Modify club settings
  - explore_talent: Browse talent marketplace

  ## Security Model
  - RLS enabled on all tables
  - Club admins can only manage their own staff
  - Staff can only view their own profile and assigned club data
  - Permission checks enforced at database level
  - Activity logging for compliance

  ## Usage Flow
  1. Club admin creates staff account with email, name, contact
  2. System generates unique credentials for staff member
  3. Admin assigns permissions (checkboxes for each feature)
  4. Staff receives login credentials via email/display
  5. Staff logs in with credentials
  6. Dashboard renders based on assigned permissions
  7. Unauthorized features shown with low opacity, non-clickable
*/

-- =====================================================
-- 1. CLUB STAFF TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS club_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

  -- Staff Information
  staff_name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact_number text NOT NULL,

  -- Authentication
  staff_username text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,

  -- Role and Access Level
  role text DEFAULT 'staff' CHECK (role IN ('staff', 'manager', 'admin')),
  access_level text DEFAULT 'limited' CHECK (access_level IN ('limited', 'standard', 'full')),

  -- Metadata
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,

  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- =====================================================
-- 2. STAFF PERMISSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES club_staff(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Dashboard Feature Permissions (Sidebar Items)
  can_view_dashboard boolean DEFAULT true,
  can_manage_players boolean DEFAULT false,
  can_upload_matches boolean DEFAULT false,
  can_edit_club_profile boolean DEFAULT false,
  can_manage_staff boolean DEFAULT false,
  can_use_ai_scouting boolean DEFAULT false,
  can_view_messages boolean DEFAULT false,
  can_manage_transfers boolean DEFAULT false,
  can_view_club_history boolean DEFAULT false,
  can_modify_settings boolean DEFAULT false,
  can_explore_talent boolean DEFAULT false,

  -- Additional Permissions
  can_view_analytics boolean DEFAULT false,
  can_export_data boolean DEFAULT false,
  can_manage_subscriptions boolean DEFAULT false,

  -- Metadata
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- 3. STAFF ACTIVITY LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES club_staff(id) ON DELETE CASCADE NOT NULL,
  club_id uuid REFERENCES clubs(id) ON DELETE CASCADE NOT NULL,

  -- Activity Details
  activity_type text NOT NULL CHECK (activity_type IN (
    'login', 'logout', 'password_reset',
    'permission_change', 'profile_update',
    'player_add', 'player_edit', 'player_delete',
    'match_upload', 'match_delete',
    'message_send', 'message_read',
    'transfer_request', 'transfer_approve',
    'settings_change', 'data_export'
  )),
  activity_description text,

  -- Technical Details
  ip_address text,
  user_agent text,

  -- Metadata
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Club Staff Indexes
CREATE INDEX IF NOT EXISTS idx_club_staff_club_id ON club_staff(club_id);
CREATE INDEX IF NOT EXISTS idx_club_staff_profile_id ON club_staff(profile_id);
CREATE INDEX IF NOT EXISTS idx_club_staff_email ON club_staff(email);
CREATE INDEX IF NOT EXISTS idx_club_staff_username ON club_staff(staff_username);
CREATE INDEX IF NOT EXISTS idx_club_staff_status ON club_staff(status);
CREATE INDEX IF NOT EXISTS idx_club_staff_created_by ON club_staff(created_by);

-- Staff Permissions Indexes
CREATE INDEX IF NOT EXISTS idx_staff_permissions_staff_id ON staff_permissions(staff_id);

-- Staff Activity Logs Indexes
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_staff_id ON staff_activity_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_club_id ON staff_activity_logs(club_id);
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_activity_type ON staff_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_staff_activity_logs_created_at ON staff_activity_logs(created_at DESC);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE club_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_activity_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- CLUB STAFF POLICIES
-- ==========================================

-- Club admins can view their own staff
CREATE POLICY "Club admins can view their own staff"
  ON club_staff FOR SELECT
  TO authenticated
  USING (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
    OR profile_id = auth.uid()
  );

-- Club admins can create staff for their club
CREATE POLICY "Club admins can create staff"
  ON club_staff FOR INSERT
  TO authenticated
  WITH CHECK (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
  );

-- Club admins can update their own staff
CREATE POLICY "Club admins can update their own staff"
  ON club_staff FOR UPDATE
  TO authenticated
  USING (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
  )
  WITH CHECK (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
  );

-- Club admins can delete their own staff
CREATE POLICY "Club admins can delete their own staff"
  ON club_staff FOR DELETE
  TO authenticated
  USING (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
  );

-- ==========================================
-- STAFF PERMISSIONS POLICIES
-- ==========================================

-- Club admins and staff can view their permissions
CREATE POLICY "Users can view relevant staff permissions"
  ON staff_permissions FOR SELECT
  TO authenticated
  USING (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.profile_id = auth.uid()
      OR cs.club_id IN (
        SELECT c.id FROM clubs c
        INNER JOIN profiles p ON p.id = c.profile_id
        WHERE p.id = auth.uid()
      )
    )
  );

-- Club admins can create permissions for their staff
CREATE POLICY "Club admins can create staff permissions"
  ON staff_permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.club_id IN (
        SELECT c.id FROM clubs c
        INNER JOIN profiles p ON p.id = c.profile_id
        WHERE p.id = auth.uid()
      )
    )
  );

-- Club admins can update their staff permissions
CREATE POLICY "Club admins can update staff permissions"
  ON staff_permissions FOR UPDATE
  TO authenticated
  USING (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.club_id IN (
        SELECT c.id FROM clubs c
        INNER JOIN profiles p ON p.id = c.profile_id
        WHERE p.id = auth.uid()
      )
    )
  )
  WITH CHECK (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.club_id IN (
        SELECT c.id FROM clubs c
        INNER JOIN profiles p ON p.id = c.profile_id
        WHERE p.id = auth.uid()
      )
    )
  );

-- Club admins can delete staff permissions
CREATE POLICY "Club admins can delete staff permissions"
  ON staff_permissions FOR DELETE
  TO authenticated
  USING (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.club_id IN (
        SELECT c.id FROM clubs c
        INNER JOIN profiles p ON p.id = c.profile_id
        WHERE p.id = auth.uid()
      )
    )
  );

-- ==========================================
-- STAFF ACTIVITY LOGS POLICIES
-- ==========================================

-- Club admins can view their staff activity logs
CREATE POLICY "Club admins can view staff activity logs"
  ON staff_activity_logs FOR SELECT
  TO authenticated
  USING (
    club_id IN (
      SELECT c.id FROM clubs c
      INNER JOIN profiles p ON p.id = c.profile_id
      WHERE p.id = auth.uid()
    )
    OR staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.profile_id = auth.uid()
    )
  );

-- Staff can create their own activity logs
CREATE POLICY "Staff can create activity logs"
  ON staff_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    staff_id IN (
      SELECT cs.id FROM club_staff cs
      WHERE cs.profile_id = auth.uid()
    )
  );

-- =====================================================
-- 6. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_staff_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on club_staff
CREATE TRIGGER update_club_staff_updated_at
  BEFORE UPDATE ON club_staff
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_updated_at();

-- Trigger: Auto-update updated_at on staff_permissions
CREATE TRIGGER update_staff_permissions_updated_at
  BEFORE UPDATE ON staff_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_updated_at();

-- Function: Generate unique username for staff
CREATE OR REPLACE FUNCTION generate_staff_username(
  p_staff_name text,
  p_club_id uuid
)
RETURNS text AS $$
DECLARE
  v_base_username text;
  v_username text;
  v_counter integer := 1;
  v_club_code text;
BEGIN
  -- Get club code (first 3 letters of club name)
  SELECT LOWER(LEFT(REGEXP_REPLACE(club_name, '[^a-zA-Z]', '', 'g'), 3))
  INTO v_club_code
  FROM clubs
  WHERE id = p_club_id;

  -- Create base username from staff name
  v_base_username := LOWER(REGEXP_REPLACE(p_staff_name, '[^a-zA-Z]', '', 'g'));
  v_base_username := LEFT(v_base_username, 10);

  -- Combine club code and staff name
  v_username := v_club_code || '_' || v_base_username;

  -- Check if username exists, if yes, append number
  WHILE EXISTS (SELECT 1 FROM club_staff WHERE staff_username = v_username) LOOP
    v_username := v_club_code || '_' || v_base_username || v_counter;
    v_counter := v_counter + 1;
  END LOOP;

  RETURN v_username;
END;
$$ LANGUAGE plpgsql;

-- Function: Generate random password for staff
CREATE OR REPLACE FUNCTION generate_staff_password()
RETURNS text AS $$
DECLARE
  v_chars text := 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  v_password text := '';
  v_length integer := 12;
  v_i integer;
BEGIN
  FOR v_i IN 1..v_length LOOP
    v_password := v_password || substr(v_chars, floor(random() * length(v_chars) + 1)::integer, 1);
  END LOOP;
  RETURN v_password;
END;
$$ LANGUAGE plpgsql;

-- Function: Create default permissions for new staff
CREATE OR REPLACE FUNCTION create_default_staff_permissions()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO staff_permissions (staff_id, updated_by)
  VALUES (NEW.id, NEW.created_by);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create permissions when staff is created
CREATE TRIGGER create_staff_permissions_on_insert
  AFTER INSERT ON club_staff
  FOR EACH ROW
  EXECUTE FUNCTION create_default_staff_permissions();

-- Function: Log staff activity
CREATE OR REPLACE FUNCTION log_staff_activity(
  p_staff_id uuid,
  p_club_id uuid,
  p_activity_type text,
  p_activity_description text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO staff_activity_logs (
    staff_id,
    club_id,
    activity_type,
    activity_description,
    ip_address,
    user_agent
  ) VALUES (
    p_staff_id,
    p_club_id,
    p_activity_type,
    p_activity_description,
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. HELPER VIEWS
-- =====================================================

-- View: Staff with their permissions (for easy querying)
CREATE OR REPLACE VIEW staff_with_permissions AS
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
  cs.status,
  cs.last_login,
  cs.created_at,
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
FROM club_staff cs
LEFT JOIN staff_permissions sp ON sp.staff_id = cs.id;