import React, { useState } from 'react';
import { X, Users, Mail, Phone, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SearchableDropdown from '../SearchableDropdown';
import { countries } from '../../data/countries';

interface StaffPermissions {
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
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  onSuccess?: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, clubId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    staffName: '',
    email: '',
    countryCode: '+91',
    contactNumber: '',
  });

  const [permissions, setPermissions] = useState<StaffPermissions>({
    can_manage_players: false,
    can_upload_matches: false,
    can_edit_club_profile: false,
    can_manage_staff: false,
    can_use_ai_scouting: false,
    can_view_messages: false,
    can_manage_transfers: false,
    can_view_club_history: false,
    can_modify_settings: false,
    can_explore_talent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryCodeOptions = countries.map(country => ({
    value: country.dialCode,
    label: country.dialCode,
    icon: country.flag,
    subtitle: country.name
  }));

  const permissionLabels = {
    can_manage_players: 'Player Management',
    can_upload_matches: 'Match Uploads',
    can_edit_club_profile: 'Edit Club Profile',
    can_manage_staff: 'Staff Management',
    can_use_ai_scouting: 'AI Scouting',
    can_view_messages: 'Messages',
    can_manage_transfers: 'Player Transfers',
    can_view_club_history: 'Club History',
    can_modify_settings: 'Settings',
    can_explore_talent: 'Explore Talent',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission: keyof StaffPermissions) => {
    setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(permissions).every(v => v);
    const newPermissions = Object.keys(permissions).reduce((acc, key) => {
      acc[key as keyof StaffPermissions] = !allSelected;
      return acc;
    }, {} as StaffPermissions);
    setPermissions(newPermissions);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffName.trim()) {
      newErrors.staffName = 'Staff name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to add staff');
        setLoading(false);
        return;
      }

      const phoneWithCode = `${formData.countryCode} ${formData.contactNumber}`;

      const { data: usernameData, error: usernameError } = await supabase
        .rpc('generate_staff_username', {
          p_staff_name: formData.staffName,
          p_club_id: clubId
        });

      if (usernameError) {
        throw usernameError;
      }

      const { data: passwordData, error: passwordError } = await supabase
        .rpc('generate_staff_password');

      if (passwordError) {
        throw passwordError;
      }

      const { data: staffData, error: staffError } = await supabase
        .from('club_staff')
        .insert({
          club_id: clubId,
          staff_name: formData.staffName,
          email: formData.email,
          contact_number: phoneWithCode,
          staff_username: usernameData,
          created_by: user.id,
          is_active: true,
          status: 'active'
        })
        .select()
        .single();

      if (staffError) {
        throw staffError;
      }

      const { error: permissionsError } = await supabase
        .from('staff_permissions')
        .update(permissions)
        .eq('staff_id', staffData.id);

      if (permissionsError) {
        throw permissionsError;
      }

      setGeneratedCredentials({
        username: usernameData,
        password: passwordData
      });
      setShowCredentials(true);

      setFormData({
        staffName: '',
        email: '',
        countryCode: '+91',
        contactNumber: '',
      });
      setPermissions({
        can_manage_players: false,
        can_upload_matches: false,
        can_edit_club_profile: false,
        can_manage_staff: false,
        can_use_ai_scouting: false,
        can_view_messages: false,
        can_manage_transfers: false,
        can_view_club_history: false,
        can_modify_settings: false,
        can_explore_talent: false,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowCredentials(false);
    setGeneratedCredentials(null);
    onClose();
  };

  if (!isOpen) return null;

  if (showCredentials && generatedCredentials) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <Check size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Staff Member Added!</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              Staff member has been successfully added. Share these login credentials with them:
            </p>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <div className="text-white font-mono text-lg">{generatedCredentials.username}</div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Password</label>
                <div className="text-white font-mono text-lg">{generatedCredentials.password}</div>
              </div>
            </div>

            <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                Make sure to copy these credentials now. They will not be shown again.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center mr-3">
              <Users size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Add Staff Member</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Staff Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                name="staffName"
                value={formData.staffName}
                onChange={handleChange}
                placeholder="Enter staff member's full name"
                className={`w-full bg-gray-800 border ${
                  errors.staffName ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
              />
              {errors.staffName && (
                <p className="mt-1 text-sm text-red-500">{errors.staffName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email <span className="text-pink-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="staff@example.com"
                className={`w-full bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Contact Number <span className="text-pink-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <SearchableDropdown
                    options={countryCodeOptions}
                    value={formData.countryCode}
                    onChange={(value) => handleDropdownChange('countryCode', value)}
                    placeholder="Code"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className={`w-full bg-gray-800 border ${
                      errors.contactNumber ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500`}
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 text-sm font-medium">
                  Permissions
                </label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-pink-400 hover:text-pink-300 text-sm font-medium"
                >
                  {Object.values(permissions).every(v => v) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={permissions[key as keyof StaffPermissions]}
                        onChange={() => handlePermissionChange(key as keyof StaffPermissions)}
                        className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                      />
                      <span className="text-gray-300 text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Select which features this staff member can access in the dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
