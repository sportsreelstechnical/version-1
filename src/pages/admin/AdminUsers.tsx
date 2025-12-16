import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Shield, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Send,
  X
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'subadmin';
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
  createdBy: string;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@sportsreels.com',
    role: 'admin',
    permissions: ['all'],
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2024-05-21T10:30:00Z',
    createdBy: 'System'
  },
  {
    id: '2',
    name: 'Support Manager',
    email: 'support@sportsreels.com',
    role: 'subadmin',
    permissions: ['support', 'users'],
    status: 'active',
    createdAt: '2023-06-15T00:00:00Z',
    lastLogin: '2024-05-20T14:15:00Z',
    createdBy: 'Admin User'
  },
  {
    id: '3',
    name: 'Finance Manager',
    email: 'finance@sportsreels.com',
    role: 'subadmin',
    permissions: ['payments', 'subscriptions'],
    status: 'active',
    createdAt: '2023-08-20T00:00:00Z',
    lastLogin: '2024-05-19T09:45:00Z',
    createdBy: 'Admin User'
  }
];

const availablePermissions = [
  { id: 'clubs', label: 'Club Management' },
  { id: 'scouts', label: 'Scout Management' },
  { id: 'payments', label: 'Payment Management' },
  { id: 'support', label: 'Support Management' },
  { id: 'users', label: 'User Management' },
  { id: 'subscriptions', label: 'Subscription Management' },
  { id: 'settings', label: 'System Settings' }
];

const AdminUsers: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'subadmin' as 'admin' | 'subadmin',
    permissions: [] as string[]
  });

  const [inviteEmail, setInviteEmail] = useState('');

  const filteredUsers = adminUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: newUser.permissions,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: 'Never',
      createdBy: 'Admin User'
    };

    setAdminUsers([...adminUsers, user]);
    setNewUser({ name: '', email: '', role: 'subadmin', permissions: [] });
    setShowAddUser(false);
  };

  const handleInviteUser = () => {
    // Simulate sending invitation
    console.log('Sending invitation to:', inviteEmail);
    setInviteEmail('');
    setShowInviteUser(false);
    alert('Invitation sent successfully!');
  };

  const handleDeleteUser = (userId: string) => {
    setAdminUsers(adminUsers.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setAdminUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
  };

  const handlePermissionChange = (permission: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white';
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">Manage admin users and their permissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowInviteUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Mail size={16} />
                <span>Invite User</span>
              </button>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{adminUsers.length}</div>
              <div className="text-gray-400 text-sm">Total Admin Users</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Shield className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {adminUsers.filter(u => u.status === 'active').length}
              </div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <UserPlus className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {adminUsers.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-gray-400 text-sm">Super Admins</div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-[#111112] p-6 rounded-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search admin users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#111112] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr className="text-gray-300 text-sm">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Permissions</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Last Login</th>
                    <th className="text-left p-4">Created By</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-4">
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                          {user.role === 'admin' ? 'Super Admin' : 'Sub Admin'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.includes('all') ? (
                            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                              All Permissions
                            </span>
                          ) : (
                            user.permissions.slice(0, 2).map(permission => (
                              <span key={permission} className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                                {availablePermissions.find(p => p.id === permission)?.label || permission}
                              </span>
                            ))
                          )}
                          {user.permissions.length > 2 && !user.permissions.includes('all') && (
                            <span className="text-gray-400 text-xs">+{user.permissions.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">
                        {user.lastLogin === 'Never' ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-300">{user.createdBy}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`${user.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                          >
                            {user.status === 'active' ? <Trash2 size={16} /> : <Shield size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No admin users found</div>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Admin User</h2>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'subadmin'})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                  >
                    <option value="subadmin">Sub Admin</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                {newUser.role === 'subadmin' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Permissions</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availablePermissions.map(permission => (
                        <label key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newUser.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="rounded border-gray-600 text-[#BE3C63] focus:ring-[#BE3C63]"
                          />
                          <span className="text-gray-300 text-sm">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email}
                    className="flex-1 bg-[#BE3C63] hover:bg-[#331C22] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Invite User</h2>
                <button
                  onClick={() => setShowInviteUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    placeholder="Enter email to invite"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300 text-sm">
                    An invitation email will be sent to this address with instructions to create an admin account.
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowInviteUser(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInviteUser}
                    disabled={!inviteEmail}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send Invite</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Role:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role === 'admin' ? 'Super Admin' : 'Sub Admin'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Login:</span>
                        <span className="text-white">
                          {selectedUser.lastLogin === 'Never' ? 'Never' : new Date(selectedUser.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created By:</span>
                        <span className="text-white">{selectedUser.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.permissions.includes('all') ? (
                      <span className="bg-purple-600 text-white px-3 py-1 rounded">
                        All Permissions
                      </span>
                    ) : (
                      selectedUser.permissions.map(permission => (
                        <span key={permission} className="bg-gray-600 text-gray-300 px-3 py-1 rounded">
                          {availablePermissions.find(p => p.id === permission)?.label || permission}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-[#BE3C63] hover:bg-[#331C22] text-white py-2 rounded-lg transition-colors">
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;