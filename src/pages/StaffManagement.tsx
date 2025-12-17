import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Key, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddStaffModal from '../components/modals/AddStaffModal';

interface StaffMember {
  id: string;
  staff_name: string;
  email: string;
  contact_number: string;
  staff_username: string;
  role: string;
  status: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clubId, setClubId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClubId();
  }, []);

  useEffect(() => {
    if (clubId) {
      fetchStaff();
    }
  }, [clubId]);

  const fetchClubId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data: clubData, error } = await supabase
        .from('clubs')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;

      setClubId(clubData.id);
    } catch (error) {
      console.error('Error fetching club ID:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('club_staff')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm('Are you sure you want to remove this staff member? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('club_staff')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      setStaff(prev => prev.filter(s => s.id !== staffId));
      alert('Staff member removed successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to remove staff member');
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('club_staff')
        .update({ is_active: !currentStatus })
        .eq('id', staffId);

      if (error) throw error;

      setStaff(prev => prev.map(s =>
        s.id === staffId ? { ...s, is_active: !currentStatus } : s
      ));
    } catch (error) {
      console.error('Error updating staff status:', error);
      alert('Failed to update staff status');
    }
  };

  const handleResetCredentials = async (staffId: string, staffName: string) => {
    if (!confirm(`Reset login credentials for ${staffName}?`)) {
      return;
    }

    try {
      const { data: passwordData, error: passwordError } = await supabase
        .rpc('generate_staff_password');

      if (passwordError) throw passwordError;

      const staff = staffList.find(s => s.id === staffId);
      if (!staff) return;

      alert(`New credentials for ${staffName}:\n\nUsername: ${staff.staff_username}\nPassword: ${passwordData}\n\nMake sure to save these credentials!`);
    } catch (error) {
      console.error('Error resetting credentials:', error);
      alert('Failed to reset credentials');
    }
  };

  const filteredStaff = staff.filter(s =>
    s.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.staff_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const staffList = filteredStaff;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Staff Management</h1>
            <p className="text-gray-400">Manage your club's staff members and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Staff
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : staffList.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No staff members found' : 'No staff members yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'Add staff members to help manage your club'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
              >
                Add Your First Staff Member
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Username</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Contact</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Last Login</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staffMember) => (
                    <tr key={staffMember.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center mr-3">
                            <span className="text-white font-semibold">
                              {staffMember.staff_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{staffMember.staff_name}</div>
                            <div className="text-sm text-gray-400 capitalize">{staffMember.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{staffMember.email}</td>
                      <td className="p-4">
                        <code className="text-sm bg-gray-800 px-2 py-1 rounded text-pink-400">
                          {staffMember.staff_username}
                        </code>
                      </td>
                      <td className="p-4 text-gray-300">{staffMember.contact_number}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(staffMember.id, staffMember.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            staffMember.is_active
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {staffMember.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {staffMember.last_login
                          ? new Date(staffMember.last_login).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleResetCredentials(staffMember.id, staffMember.staff_name)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                            title="Reset Credentials"
                          >
                            <Key size={18} className="text-gray-400 group-hover:text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(staffMember.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors group"
                            title="Remove Staff"
                          >
                            <Trash2 size={18} className="text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Staff Management Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Adding Staff</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Click "Add Staff" to create a new staff account</li>
                <li>Fill in their details and select permissions</li>
                <li>Share the generated credentials securely</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Managing Access</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Toggle status to activate/deactivate accounts</li>
                <li>Reset credentials if staff forget password</li>
                <li>Remove staff to permanently delete access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        clubId={clubId}
        onSuccess={fetchStaff}
      />
    </div>
  );
};

export default StaffManagement;
