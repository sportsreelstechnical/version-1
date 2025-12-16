import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  MapPin,
  Globe,
  Mail,
  Phone,
  MoreVertical,
  Plus,
  Download,
  Star,
  Trophy,
  Activity
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface Club {
  id: string;
  name: string;
  adminName: string;
  email: string;
  phone: string;
  website: string;
  division: string;
  league: string;
  location: string;
  playersCount: number;
  subscription: 'basic' | 'standard' | 'premium';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  revenue: number;
  logo: string;
}

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Manchester City FC',
    adminName: 'John Manager',
    email: 'john@mancity.com',
    phone: '+44 161 444 1894',
    website: 'https://www.mancity.com',
    division: 'Professional',
    league: 'Premier League',
    location: 'Manchester, England',
    playersCount: 25,
    subscription: 'premium',
    status: 'active',
    joinDate: '2023-01-15',
    lastActive: '2024-05-21',
    revenue: 89.99,
    logo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Real Madrid CF',
    adminName: 'Carlos Rodriguez',
    email: 'carlos@realmadrid.com',
    phone: '+34 91 344 0052',
    website: 'https://www.realmadrid.com',
    division: 'Professional',
    league: 'La Liga',
    location: 'Madrid, Spain',
    playersCount: 23,
    subscription: 'standard',
    status: 'active',
    joinDate: '2023-02-20',
    lastActive: '2024-05-20',
    revenue: 49.99,
    logo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'FC Barcelona',
    adminName: 'Maria Garcia',
    email: 'maria@fcbarcelona.com',
    phone: '+34 93 496 3600',
    website: 'https://www.fcbarcelona.com',
    division: 'Professional',
    league: 'La Liga',
    location: 'Barcelona, Spain',
    playersCount: 22,
    subscription: 'premium',
    status: 'active',
    joinDate: '2023-01-10',
    lastActive: '2024-05-21',
    revenue: 89.99,
    logo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    name: 'Liverpool FC',
    adminName: 'James Wilson',
    email: 'james@liverpool.com',
    phone: '+44 151 263 2361',
    website: 'https://www.liverpoolfc.com',
    division: 'Professional',
    league: 'Premier League',
    location: 'Liverpool, England',
    playersCount: 20,
    subscription: 'standard',
    status: 'suspended',
    joinDate: '2023-03-05',
    lastActive: '2024-05-15',
    revenue: 49.99,
    logo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const AdminClubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showClubDetails, setShowClubDetails] = useState(false);

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || club.status === selectedStatus;
    const matchesSubscription = selectedSubscription === 'all' || club.subscription === selectedSubscription;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'suspended': return 'bg-red-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'premium': return 'bg-purple-600 text-white';
      case 'standard': return 'bg-blue-600 text-white';
      case 'basic': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleViewClub = (club: Club) => {
    setSelectedClub(club);
    setShowClubDetails(true);
  };

  const handleSuspendClub = (clubId: string) => {
    setClubs(prev => 
      prev.map(club => 
        club.id === clubId 
          ? { ...club, status: club.status === 'suspended' ? 'active' : 'suspended' }
          : club
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Club Management</h1>
              <p className="text-gray-400">Manage all registered clubs on the platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Download size={16} />
                <span>Export</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Club</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Building className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{clubs.length}</div>
              <div className="text-gray-400 text-sm">Total Clubs</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Activity className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {clubs.filter(c => c.status === 'active').length}
              </div>
              <div className="text-gray-400 text-sm">Active Clubs</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <Star className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {clubs.filter(c => c.subscription === 'premium').length}
              </div>
              <div className="text-gray-400 text-sm">Premium Clubs</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {clubs.reduce((sum, club) => sum + club.playersCount, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Players</div>
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
                    placeholder="Search clubs by name, admin, or email..."
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
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Subscriptions</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          {/* Clubs Table */}
          <div className="bg-[#111112] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr className="text-gray-300 text-sm">
                    <th className="text-left p-4">Club</th>
                    <th className="text-left p-4">Admin</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Players</th>
                    <th className="text-left p-4">Subscription</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Revenue</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClubs.map((club) => (
                    <tr key={club.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={club.logo}
                            alt={club.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-white font-medium">{club.name}</div>
                            <div className="text-gray-400 text-sm">{club.league}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-white">{club.adminName}</div>
                          <div className="text-gray-400 text-sm">{club.email}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{club.location}</td>
                      <td className="p-4 text-white font-semibold">{club.playersCount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getSubscriptionColor(club.subscription)}`}>
                          {club.subscription.charAt(0).toUpperCase() + club.subscription.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(club.status)}`}>
                          {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-green-400 font-semibold">${club.revenue}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClub(club)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleSuspendClub(club.id)}
                            className={`${club.status === 'suspended' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                          >
                            {club.status === 'suspended' ? <Activity size={16} /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No clubs found</div>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Club Details Modal */}
      {showClubDetails && selectedClub && (
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
                    src={selectedClub.logo}
                    alt={selectedClub.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedClub.name}</h2>
                    <p className="text-gray-400">{selectedClub.league} • {selectedClub.division}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClubDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Club Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Admin:</span>
                        <span className="text-white">{selectedClub.adminName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedClub.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedClub.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Website:</span>
                        <a href={selectedClub.website} className="text-[#BE3C63] hover:text-[#331C22]">
                          {selectedClub.website}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{selectedClub.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Plan:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getSubscriptionColor(selectedClub.subscription)}`}>
                          {selectedClub.subscription.charAt(0).toUpperCase() + selectedClub.subscription.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Revenue:</span>
                        <span className="text-green-400 font-semibold">${selectedClub.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Join Date:</span>
                        <span className="text-white">{new Date(selectedClub.joinDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Active:</span>
                        <span className="text-white">{new Date(selectedClub.lastActive).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{selectedClub.playersCount}</div>
                        <div className="text-gray-400 text-sm">Total Players</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        View Players
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                        Send Message
                      </button>
                      <button
                        onClick={() => handleSuspendClub(selectedClub.id)}
                        className={`w-full py-2 rounded-lg transition-colors ${
                          selectedClub.status === 'suspended'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {selectedClub.status === 'suspended' ? 'Activate Club' : 'Suspend Club'}
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

export default AdminClubs;