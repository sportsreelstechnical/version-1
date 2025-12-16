import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  Shield, 
  DollarSign, 
  MessageCircle, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Globe,
  Activity
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = {
    totalUsers: 1247,
    totalClubs: 892,
    totalScouts: 355,
    totalRevenue: 89420,
    activeSubscriptions: 1156,
    supportTickets: 23,
    newSignups: 47,
    churnRate: 2.3
  };

  const recentActivity = [
    {
      id: '1',
      type: 'signup',
      message: 'New club registration: Manchester United Academy',
      timestamp: '2 minutes ago',
      icon: Building,
      color: 'text-green-400'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment received: $49.99 from Real Madrid CF',
      timestamp: '15 minutes ago',
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      id: '3',
      type: 'support',
      message: 'New support ticket: Video upload issue',
      timestamp: '1 hour ago',
      icon: MessageCircle,
      color: 'text-yellow-400'
    },
    {
      id: '4',
      type: 'scout',
      message: 'Scout verification completed: John Smith',
      timestamp: '2 hours ago',
      icon: Shield,
      color: 'text-purple-400'
    }
  ];

  const topClubs = [
    { name: 'Manchester City FC', players: 25, subscription: 'Premium', revenue: '$89.99' },
    { name: 'Real Madrid CF', players: 23, subscription: 'Standard', revenue: '$49.99' },
    { name: 'FC Barcelona', players: 22, subscription: 'Premium', revenue: '$89.99' },
    { name: 'Liverpool FC', players: 20, subscription: 'Standard', revenue: '$49.99' },
    { name: 'Bayern Munich', players: 18, subscription: 'Basic', revenue: '$19.99' }
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Overview of Sports Reels platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111112] p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-blue-400" size={24} />
                </div>
                <span className="text-green-400 text-sm">+12%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111112] p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <span className="text-green-400 text-sm">+8%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Monthly Revenue</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111112] p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#BE3C63] bg-opacity-20 p-3 rounded-lg">
                  <Building className="text-[#BE3C63]" size={24} />
                </div>
                <span className="text-green-400 text-sm">+15%</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalClubs}</div>
              <div className="text-gray-400 text-sm">Active Clubs</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111112] p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <MessageCircle className="text-yellow-400" size={24} />
                </div>
                <span className="text-red-400 text-sm">+3</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.supportTickets}</div>
              <div className="text-gray-400 text-sm">Open Tickets</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-[#111112] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                <button className="text-[#BE3C63] hover:text-[#331C22] text-sm">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                      <div className={`p-2 rounded-lg bg-gray-600`}>
                        <Icon size={16} className={activity.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#111112] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Signups (7d)</span>
                  <span className="text-white font-semibold">{stats.newSignups}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Subscriptions</span>
                  <span className="text-white font-semibold">{stats.activeSubscriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Churn Rate</span>
                  <span className="text-red-400 font-semibold">{stats.churnRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Scouts</span>
                  <span className="text-white font-semibold">{stats.totalScouts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Clubs */}
          <div className="bg-[#111112] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Top Clubs by Revenue</h3>
              <button className="text-[#BE3C63] hover:text-[#331C22] text-sm">View All Clubs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-700">
                    <th className="text-left pb-4">Club Name</th>
                    <th className="text-left pb-4">Players</th>
                    <th className="text-left pb-4">Subscription</th>
                    <th className="text-left pb-4">Monthly Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topClubs.map((club, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#BE3C63] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-white font-medium">{club.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300">{club.players}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          club.subscription === 'Premium' ? 'bg-purple-600 text-white' :
                          club.subscription === 'Standard' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {club.subscription}
                        </span>
                      </td>
                      <td className="py-4 text-green-400 font-semibold">{club.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;