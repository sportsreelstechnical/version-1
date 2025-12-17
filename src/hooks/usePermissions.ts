import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface StaffPermissions {
  can_view_dashboard: boolean;
  can_manage_players: boolean;
  can_upload_matches: boolean;
  can_edit_club_profile: boolean;
  can_manage_staff: boolean;
  can_use_ai_scouting: boolean;
  can_view_messages: boolean;
  can_manage_transfers: boolean;
  can_view_club_history: boolean;
  can_modify_settings: boolean;
  can_explore_talent: boolean;
  can_view_analytics: boolean;
  can_export_data: boolean;
  can_manage_subscriptions: boolean;
}

interface UsePermissionsReturn {
  permissions: StaffPermissions | null;
  loading: boolean;
  isStaff: boolean;
  hasPermission: (permission: keyof StaffPermissions) => boolean;
  refreshPermissions: () => Promise<void>;
}

const DEFAULT_ADMIN_PERMISSIONS: StaffPermissions = {
  can_view_dashboard: true,
  can_manage_players: true,
  can_upload_matches: true,
  can_edit_club_profile: true,
  can_manage_staff: true,
  can_use_ai_scouting: true,
  can_view_messages: true,
  can_manage_transfers: true,
  can_view_club_history: true,
  can_modify_settings: true,
  can_explore_talent: true,
  can_view_analytics: true,
  can_export_data: true,
  can_manage_subscriptions: true,
};

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  const loadPermissions = async () => {
    if (!user) {
      setPermissions(null);
      setIsStaff(false);
      setLoading(false);
      return;
    }

    try {
      if (user.role === 'club') {
        setPermissions(DEFAULT_ADMIN_PERMISSIONS);
        setIsStaff(false);
        setLoading(false);
        return;
      }

      const { data: staffData } = await supabase
        .from('staff_with_permissions')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (staffData) {
        setIsStaff(true);
        setPermissions({
          can_view_dashboard: staffData.can_view_dashboard,
          can_manage_players: staffData.can_manage_players,
          can_upload_matches: staffData.can_upload_matches,
          can_edit_club_profile: staffData.can_edit_club_profile,
          can_manage_staff: staffData.can_manage_staff,
          can_use_ai_scouting: staffData.can_use_ai_scouting,
          can_view_messages: staffData.can_view_messages,
          can_manage_transfers: staffData.can_manage_transfers,
          can_view_club_history: staffData.can_view_club_history,
          can_modify_settings: staffData.can_modify_settings,
          can_explore_talent: staffData.can_explore_talent,
          can_view_analytics: staffData.can_view_analytics,
          can_export_data: staffData.can_export_data,
          can_manage_subscriptions: staffData.can_manage_subscriptions,
        });
      } else {
        setPermissions(DEFAULT_ADMIN_PERMISSIONS);
        setIsStaff(false);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [user]);

  const hasPermission = (permission: keyof StaffPermissions): boolean => {
    if (!permissions) return false;
    return permissions[permission] === true;
  };

  const refreshPermissions = async () => {
    setLoading(true);
    await loadPermissions();
  };

  return {
    permissions,
    loading,
    isStaff,
    hasPermission,
    refreshPermissions,
  };
};
