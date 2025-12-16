import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  Star,
  Activity,
  Globe
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface Scout {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fifaLicenceNumber: string;
  country: string;
  preferredLeague: string;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  joinDate: string;
  lastActive: string;
  playersScoutedCount: number;
  successfulSignings: number;
  subscription: 'scout';
  revenue: number;
  avatar: string;
}

const mockScouts: Scout[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@scout.com',
    phone: '+44 20 7946 0958',
    fifaLicenceNumber: 'FIFA-SC-001234',
    country: 'England',
    preferredLeague: 'Premier League',
    status: 'active',
    verified: true,
    joinDate: '2023-01-15',
    lastActive: '2024-05-21',
    playersScoutedCount: 45,
    successfulSignings: 12,
    subscription: 'scout',
    revenue: 49.99,
    avatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@scout.com',
    phone: '+34 91 123 4567',
    fifaLicenceNumber: 'FIFA-SC-005678',
    country: 'Spain',
    preferredLeague: 'La Liga',
    status: 'active',
    verified: true,
    joinDate: '2023-02-20',
    lastActive: '2024-05-20',
    playersScoutedCount: 38,
    successfulSignings: 8,
    subscription: 'scout',
    revenue: 49.99,
    avatar: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Dubois',
    email: 'pierre.dubois@scout.com',
    phone: '+33 1 42 86 83 00',
    fifaLicenceNumber: 'FIFA-SC-009012',
    country: 'France',
    preferredLeague: 'Ligue 1',
    status: 'pending',
    verified: false,
    joinDate: '2024-05-15',
    lastActive: '2024-05-21',
    playersScoutedCount: 0,
    successfulSignings: 0,
    subscription: 'scout',
    revenue: 49.99,
    avatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    firstName: 'Hans',
    lastName: 'Mueller',
    email: 'hans.mueller@scout.com',
    phone: '+49 30 12345678',
    fifaLicenceNumber: 'FIFA-SC-003456',
    country: 'Germany',
    preferredLeague: 'Bundesliga',
    status: 'suspended',
    verified: true,
    joinDate: '2023-03-10',
    lastActive: '2024-05-10',
    playersScoutedCount: 52,
    successfulSignings: 15,
    subscription: 'scout',
    revenue: 49.99,
    avatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const AdminScouts: React.FC = () => {
  const [scouts, setScouts] = useState<Scout[]>(mockScouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedScout, setSelectedScout] = useState<Scout | null>(null);
  const [showScoutDetails, setShowScoutDetails] = useState(false);

  const filteredScouts = scouts.filter(scout => {
    const matchesSearch = scout.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scout.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scout.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scout.fifaLicenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || scout.status === selectedStatus;
    const matchesCountry = selectedCountry === 'all' || scout.country === selectedCountry;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'suspended': return 'bg-red-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleViewScout = (scout: Scout) => {
    setSelectedScout(scout);
    setShowScoutDetails(true);
  };

  const handleVerifyScout = (scoutId: string) => {
    setScouts(prev => 
      prev.map(scout => 
        scout.id === scoutId 
          ? { ...scout, verified: !scout.verified, status: scout.verified ? 'pending' : 'active' }
          : scout
      )
    );
  };

  const handleSuspendScout = (scoutId: string) => {
    setScouts(prev => 
      prev.map(scout => 
        scout.id === scoutId 
          ? { ...scout, status: scout.status === 'suspended' ? 'active' : 'suspended' }
          : scout
      )
    );
  };

  const countries = [...new Set(scouts.map(scout => scout.country))];

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Scout Management</h1>
              <p className="text-gray-400">Manage all registered scouts on the platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Download size={16} />
                <span>Export</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Scout</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Shield className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{scouts.length}</div>
              <div className="text-gray-400 text-sm">Total Scouts</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {scouts.filter(s => s.verified).length}
              </div>
              <div className="text-gray-400 text-sm">Verified Scouts</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {scouts.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-gray-400 text-sm">Pending Verification</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <Star className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {scouts.reduce((sum, scout) => sum + scout.successfulSignings, 0)}
              </div>
              <div className="text-gray-400 text-sm">Successful Signings</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#111112] p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search scouts by name, email, or FIFA licence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                  />
                </div>
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scouts Table */}
          <div className="bg-[#111112] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr className="text-gray-300 text-sm">
                    <th className="text-left p-4">Scout</th>
                    <th className="text-left p-4">FIFA Licence</th>
                    <th className="text-left p-4">Country</th>
                    <th className="text-left p-4">League</th>
                    <th className="text-left p-4">Players Scouted</th>
                    <th className="text-left p-4">Signings</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Verified</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScouts.map((scout) => (
                    <tr key={scout.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={scout.avatar}
                            alt={`${scout.firstName} ${scout.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-white font-medium">{scout.firstName} {scout.lastName}</div>
                            <div className="text-gray-400 text-sm">{scout.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#BE3C63] text-white px-2 py-1 rounded text-xs">
                          {scout.fifaLicenceNumber}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{scout.country}</td>
                      <td className="p-4 text-gray-300">{scout.preferredLeague}</td>
                      <td className="p-4 text-white font-semibold">{scout.playersScoutedCount}</td>
                      <td className="p-4 text-green-400 font-semibold">{scout.successfulSignings}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(scout.status)}`}>
                          {scout.status.charAt(0).toUpperCase() + scout.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        {scout.verified ? (
                          <CheckCircle className="text-green-400" size={16} />
                        ) : (
                          <XCircle className="text-red-400" size={16} />
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewScout(scout)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleVerifyScout(scout.id)}
                            className={`${scout.verified ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                          >
                            {scout.verified ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleSuspendScout(scout.id)}
                            className={`${scout.status === 'suspended' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                          >
                            {scout.status === 'suspended' ? <Activity size={16} /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredScouts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No scouts found</div>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Scout Details Modal */}
      {showScoutDetails && selectedScout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedScout.avatar}
                    alt={`${selectedScout.firstName} ${selectedScout.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedScout.firstName} {selectedScout.lastName}</h2>
                    <p className="text-gray-400">{selectedScout.fifaLicenceNumber}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedScout.status)}`}>
                        {selectedScout.status.charAt(0).toUpperCase() + selectedScout.status.slice(1)}
                      </span>
                      {selectedScout.verified && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowScoutDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedScout.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedScout.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Country:</span>
                        <span className="text-white">{selectedScout.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Preferred League:</span>
                        <span className="text-white">{selectedScout.preferredLeague}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Join Date:</span>
                        <span className="text-white">{new Date(selectedScout.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Active:</span>
                        <span className="text-white">{new Date(selectedScout.lastActive).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan:</span>
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                          Scout Plan
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Revenue:</span>
                        <span className="text-green-400 font-semibold">${selectedScout.revenue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{selectedScout.playersScoutedCount}</div>
                        <div className="text-gray-400 text-sm">Players Scouted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{selectedScout.successfulSignings}</div>
                        <div className="text-gray-400 text-sm">Successful Signings</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white">
                          {selectedScout.playersScoutedCount > 0 
                            ? ((selectedScout.successfulSignings / selectedScout.playersScoutedCount) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        View Scouted Players
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                        Send Message
                      </button>
                      <button
                        onClick={() => handleVerifyScout(selectedScout.id)}
                        className={`w-full py-2 rounded-lg transition-colors ${
                          selectedScout.verified
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {selectedScout.verified ? 'Revoke Verification' : 'Verify Scout'}
                      </button>
                      <button
                        onClick={() => handleSuspendScout(selectedScout.id)}
                        className={`w-full py-2 rounded-lg transition-colors ${
                          selectedScout.status === 'suspended'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {selectedScout.status === 'suspended' ? 'Activate Scout' : 'Suspend Scout'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminScouts;