import React, { useState, useEffect } from 'react';
import { X, Shield, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StaffPermissions } from '../../hooks/usePermissions';

interface EditPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  onSuccess?: () => void;
}

interface PermissionCategory {
  category: string;
  permissions: {
    key: keyof StaffPermissions;
    label: string;
    description: string;
  }[];
}

const permissionCategories: PermissionCategory[] = [
  {
    category: 'Dashboard & Analytics',
    permissions: [
      { key: 'can_view_dashboard', label: 'View Dashboard', description: 'Access main dashboard and statistics' },
      { key: 'can_view_analytics', label: 'View Analytics', description: 'Access detailed analytics and reports' },
    ],
  },
  {
    category: 'Player Management',
    permissions: [
      { key: 'can_manage_players', label: 'Manage Players', description: 'Add, edit, and delete players' },
      { key: 'can_manage_transfers', label: 'Manage Transfers', description: 'Handle player transfers and negotiations' },
    ],
  },
  {
    category: 'Content & Media',
    permissions: [
      { key: 'can_upload_matches', label: 'Upload Matches', description: 'Upload and manage match videos' },
      { key: 'can_use_ai_scouting', label: 'AI Scouting', description: 'Access AI analysis tools' },
    ],
  },
  {
    category: 'Club Information',
    permissions: [
      { key: 'can_edit_club_profile', label: 'Edit Club Profile', description: 'Modify club information' },
      { key: 'can_view_club_history', label: 'View Club History', description: 'Access club history and achievements' },
    ],
  },
  {
    category: 'Communication',
    permissions: [
      { key: 'can_view_messages', label: 'View Messages', description: 'Read and send messages' },
    ],
  },
  {
    category: 'Staff & System',
    permissions: [
      { key: 'can_manage_staff', label: 'Manage Staff', description: 'Add and manage other staff members' },
      { key: 'can_modify_settings', label: 'Modify Settings', description: 'Change system settings' },
    ],
  },
  {
    category: 'Advanced',
    permissions: [
      { key: 'can_explore_talent', label: 'Explore Talent', description: 'Browse talent marketplace' },
      { key: 'can_export_data', label: 'Export Data', description: 'Export reports and data' },
      { key: 'can_manage_subscriptions', label: 'Manage Subscriptions', description: 'Handle billing and subscriptions' },
    ],
  },
];

const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  isOpen,
  onClose,
  staffId,
  staffName,
  onSuccess,
}) => {
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && staffId) {
      loadPermissions();
    }
  }, [isOpen, staffId]);

  const loadPermissions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('staff_permissions')
        .select('*')
        .eq('staff_id', staffId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPermissions({
          can_view_dashboard: data.can_view_dashboard,
          can_manage_players: data.can_manage_players,
          can_upload_matches: data.can_upload_matches,
          can_edit_club_profile: data.can_edit_club_profile,
          can_manage_staff: data.can_manage_staff,
          can_use_ai_scouting: data.can_use_ai_scouting,
          can_view_messages: data.can_view_messages,
          can_manage_transfers: data.can_manage_transfers,
          can_view_club_history: data.can_view_club_history,
          can_modify_settings: data.can_modify_settings,
          can_explore_talent: data.can_explore_talent,
          can_view_analytics: data.can_view_analytics,
          can_export_data: data.can_export_data,
          can_manage_subscriptions: data.can_manage_subscriptions,
        });
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      alert('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof StaffPermissions) => {
    if (!permissions) return;

    setPermissions({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const handleSave = async () => {
    if (!permissions) return;

    try {
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('staff_permissions')
        .update({
          ...permissions,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('staff_id', staffId);

      if (error) throw error;

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Permissions</h2>
              <p className="text-gray-400 text-sm">{staffName}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : permissions ? (
          <>
            <div className="space-y-6 mb-6">
              {permissionCategories.map((category) => (
                <div key={category.category} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">{category.category}</h3>
                  <div className="space-y-3">
                    {category.permissions.map((perm) => (
                      <label
                        key={perm.key}
                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center h-6">
                          <input
                            type="checkbox"
                            checked={permissions[perm.key]}
                            onChange={() => handleToggle(perm.key)}
                            className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{perm.label}</div>
                          <div className="text-gray-400 text-sm">{perm.description}</div>
                        </div>
                        {permissions[perm.key] && (
                          <Check size={18} className="text-green-400 mt-1" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Permissions'}
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Failed to load permissions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPermissionsModal;
