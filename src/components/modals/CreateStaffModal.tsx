import React, { useState } from 'react';
import { X, User, Mail, Phone, Key, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  createdBy: string;
  isFirstStaff?: boolean;
}

interface StaffFormData {
  staffName: string;
  email: string;
  contactNumber: string;
}

interface GeneratedCredentials {
  username: string;
  password: string;
}

const CreateStaffModal: React.FC<CreateStaffModalProps> = ({
  isOpen,
  onClose,
  clubId,
  createdBy,
  isFirstStaff = false,
}) => {
  const [formData, setFormData] = useState<StaffFormData>({
    staffName: '',
    email: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyToClipboard = async (text: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'username') {
        setCopiedUsername(true);
        setTimeout(() => setCopiedUsername(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: usernameData } = await supabase.rpc('generate_staff_username', {
        p_staff_name: formData.staffName,
        p_club_id: clubId,
      });

      const { data: passwordData } = await supabase.rpc('generate_staff_password');

      if (!usernameData || !passwordData) {
        throw new Error('Failed to generate credentials');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: passwordData,
        options: {
          data: {
            user_type: 'staff',
            staff_name: formData.staffName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth user');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: formData.contactNumber,
          user_type: 'staff',
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      const { error: staffError } = await supabase.from('club_staff').insert({
        club_id: clubId,
        profile_id: authData.user.id,
        staff_name: formData.staffName,
        email: formData.email,
        contact_number: formData.contactNumber,
        staff_username: usernameData,
        created_by: createdBy,
        role: 'staff',
        access_level: 'standard',
        is_active: true,
        status: 'active',
      });

      if (staffError) throw staffError;

      setCredentials({
        username: usernameData,
        password: passwordData,
      });

      setFormData({
        staffName: '',
        email: '',
        contactNumber: '',
      });
    } catch (error: any) {
      console.error('Error creating staff:', error);
      alert(`Failed to create staff: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isFirstStaff && !credentials) {
      return;
    }
    setCredentials(null);
    setFormData({
      staffName: '',
      email: '',
      contactNumber: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 relative">
        {!isFirstStaff && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}

        {!credentials ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isFirstStaff ? 'Create Your First Staff Member' : 'Add Staff Member'}
              </h2>
              <p className="text-gray-400 text-sm">
                {isFirstStaff
                  ? 'Create a sub-admin account to help manage your club dashboard.'
                  : 'Add a new staff member with access to your club dashboard.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <User className="inline mr-2" size={16} />
                  Staff Name
                </label>
                <input
                  type="text"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="staff@club.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="+44 20 1234 5678"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Staff Account'}
                </button>
                {!isFirstStaff && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Staff Account Created!</h2>
              <p className="text-gray-400 text-sm">
                Save these credentials and share them with your staff member.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-sm font-medium">Username</label>
                  <button
                    onClick={() => copyToClipboard(credentials.username, 'username')}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {copiedUsername ? (
                      <><Check size={16} /> Copied</>
                    ) : (
                      <><Copy size={16} /> Copy</>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded px-3 py-2 font-mono text-white break-all">
                  {credentials.username}
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-400 text-sm font-medium">Temporary Password</label>
                  <button
                    onClick={() => copyToClipboard(credentials.password, 'password')}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {copiedPassword ? (
                      <><Check size={16} /> Copied</>
                    ) : (
                      <><Copy size={16} /> Copy</>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded px-3 py-2 font-mono text-white break-all">
                  {credentials.password}
                </div>
              </div>
            </div>

            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm flex items-start gap-2">
                <Key size={16} className="mt-0.5 flex-shrink-0" />
                <span>
                  Make sure to save these credentials! They will not be shown again. The staff member
                  should change their password after first login.
                </span>
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isFirstStaff ? 'Continue to Dashboard' : 'Done'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateStaffModal;
