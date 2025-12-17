import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, Brain, Star, TrendingUp, Calendar, MoreVertical, Eye, ExternalLink, Bell, User, ChevronDown, Settings, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AddStaffModal from '../components/modals/AddStaffModal';

const mockPlayers = [
  {
    id: '1',
    name: 'Lionel Messi',
    position: 'Forward',
    fifaId: 'SR-10089',
    status: 'Active',
    addedDate: 'May 20, 2024',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    fifaId: 'SR-10088',
    status: 'Active',
    addedDate: 'May 19, 2024',
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Kevin De Bruyne',
    position: 'Midfielder',
    fifaId: 'SR-10087',
    status: 'Injured',
    addedDate: 'May 18, 2024',
    photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    name: 'Virgil van Dijk',
    position: 'Defender',
    fifaId: 'SR-10086',
    status: 'Active',
    addedDate: 'May 16, 2024',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const mockScoutRecommendations = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    position: 'Forward',
    age: 23,
    club: 'Bayern Munich',
    country: 'Germany',
    match: '94%',
    stats: { pace: 92, shot: 88, pass: 85 },
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Carlos Mendez',
    position: 'Defender',
    age: 27,
    club: 'Atletico Madrid',
    country: 'Spain',
    match: '85%',
    stats: { pace: 82, shot: 68, pass: 85 },
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'James Wilson',
    position: 'Midfielder',
    age: 25,
    club: 'FC Barcelona',
    country: 'Spain',
    match: '89%',
    stats: { pace: 82, shot: 68, pass: 85 },
    photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const mockAIInsights = [
  {
    id: '1',
    title: 'Defensive Vulnerability',
    description: 'Your team shows a pattern of conceding goals in the last 15 minutes. Consider defensive substitutions.',
    matchId: '1',
    matchTitle: 'vs Manchester United',
    type: 'tactical',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Player Performance',
    description: 'Lionel Messi\'s heat map shows excessive tracking back. Consider tactical adjustment to maximize attacking potential.',
    matchId: '1',
    matchTitle: 'vs Manchester United',
    type: 'player',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Scouting Recommendation',
    description: 'Based on your playing style, Marcus Rashford (SR-8762) would be a 94% match for your attacking needs.',
    matchId: null,
    matchTitle: null,
    type: 'scouting',
    priority: 'low'
  }
];

const mockNotifications = [
  {
    id: '1',
    title: 'Match Analysis Complete',
    message: 'AI analysis for vs Manchester United is ready',
    time: '5 minutes ago',
    type: 'analysis',
    read: false
  },
  {
    id: '2',
    title: 'Scout Message',
    message: 'John Smith is interested in Lionel Messi',
    time: '1 hour ago',
    type: 'message',
    read: false
  },
  {
    id: '3',
    title: 'Player Update',
    message: 'Kevin De Bruyne injury status updated',
    time: '2 hours ago',
    type: 'player',
    read: true
  },
  {
    id: '4',
    title: 'New AI Recommendation',
    message: 'Marcus Silva (94% match) added to recommendations',
    time: '3 hours ago',
    type: 'recommendation',
    read: true
  },
  {
    id: '5',
    title: 'Subscription Reminder',
    message: 'Your Premium plan renews in 7 days',
    time: '1 day ago',
    type: 'billing',
    read: true
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [clubId, setClubId] = useState<string>('');

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (location.state?.showStaffModal) {
      fetchClubId();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  const fetchClubId = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: clubData, error } = await supabase
        .from('clubs')
        .select('id')
        .eq('profile_id', authUser.id)
        .maybeSingle();

      if (error) throw error;
      if (clubData) {
        setClubId(clubData.id);
        setShowStaffModal(true);
      }
    } catch (error) {
      console.error('Error fetching club ID:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'analysis': return '🔍';
      case 'message': return '💬';
      case 'player': return '⚽';
      case 'recommendation': return '🎯';
      case 'billing': return '💳';
      default: return '📢';
    }
  };

  const renderClubDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Olivia</h1>
          <p className="text-gray-400">Your current sales summary and activity.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <Calendar size={20} />
          </button>
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount}
                </div>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[#BE3C63] hover:text-[#331C22] text-sm"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-gray-750' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          <p className="text-gray-400 text-sm">{notification.message}</p>
                          <span className="text-gray-500 text-xs">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#BE3C63] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <button className="w-full text-[#BE3C63] hover:text-[#331C22] text-sm">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-white hover:text-[#BE3C63] transition-colors"
            >
              <div className="w-10 h-10 bg-[#BE3C63] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="hidden md:block">{user?.name || 'Club Manager'}</span>
              <ChevronDown size={16} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-2">
                  <Link
                    to="/club-profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Building size={16} />
                    <span>Club Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          </div>
          <div className="text-2xl font-bold text-white mb-1">23</div>
          <div className="text-gray-400 text-sm">Total Players</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111112] p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
              <Upload className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <div className="text-gray-400 text-sm">Matches Uploaded</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111112] p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <Brain className="text-green-400" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">7</div>
          <div className="text-gray-400 text-sm">AI Recommendations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#111112] p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#BE3C63] bg-opacity-20 p-3 rounded-lg">
              <Star className="text-[#BE3C63]" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#BE3C63] mb-1">PREMIUM</div>
          <div className="text-gray-400 text-sm">Subscription</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Players Table */}
        <div className="lg:col-span-2 bg-[#111112] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Players</h3>
            <Link to="/players" className="text-[#BE3C63] hover:text-[#331C22] text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="text-left pb-4">Player</th>
                  <th className="text-left pb-4">Position</th>
                  <th className="text-left pb-4">FIFA ID</th>
                  <th className="text-left pb-4">Status</th>
                  <th className="text-left pb-4">Action</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {mockPlayers.map((player) => (
                  <tr key={player.id} className="border-t border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={player.photo} 
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-gray-400 text-sm">Added: {player.addedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{player.position}</td>
                    <td className="py-4">
                      <span className="bg-[#BE3C63] text-white px-2 py-1 rounded text-xs">
                        {player.fifaId}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        player.status === 'Active' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                      }`}>
                        {player.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-[#111112] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Team Performance</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Win Rate</span>
                <span className="text-white font-semibold">68%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-[#BE3C63] h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>12 Wins</span>
                <span>4 Draws</span>
                <span>2 Losses</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Goals Scored</span>
                  <span className="text-white">38</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#BE3C63] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Goals Conceded</span>
                  <span className="text-white">14</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Possession</span>
                  <span className="text-white">62%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Shot Accuracy</span>
                  <span className="text-white">48%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-[#111112] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">AI Insights</h3>
          <div className="space-y-4">
            {mockAIInsights.map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3">
                <div className="bg-[#BE3C63] p-2 rounded-lg">
                  <Brain size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <p className="text-gray-400 text-sm">{insight.description}</p>
                      {insight.matchId && (
                        <div className="mt-2">
                          <Link 
                            to="/matches"
                            className="text-[#BE3C63] hover:text-[#331C22] text-sm flex items-center space-x-1"
                          >
                            <span>From: {insight.matchTitle}</span>
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      insight.priority === 'high' ? 'bg-red-600 text-white' :
                      insight.priority === 'medium' ? 'bg-yellow-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/matches" className="text-[#BE3C63] hover:text-[#331C22] text-sm mt-4 inline-block">
            View All Insights
          </Link>
        </div>

        {/* AI Scouting Recommendations */}
        <div className="bg-[#111112] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">AI Scouting Recommendations</h3>
            <Link to="/ai-scouting" className="text-[#BE3C63] hover:text-[#331C22] text-sm">View All</Link>
          </div>
          <div className="space-y-4">
            {mockScoutRecommendations.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-4 bg-[#111112] rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={player.photo} 
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium">{player.name}</div>
                    <div className="text-gray-400 text-sm">{player.position} • {player.age} yrs</div>
                    <div className="text-gray-400 text-sm">
                      Pace: {player.stats.pace} Shot: {player.stats.shot} Pass: {player.stats.pass}
                    </div>
                    <div className="text-gray-400 text-sm">{player.club} • {player.country}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#BE3C63] font-semibold">{player.match} match</div>
                  <Link 
                    to="/ai-scouting"
                    className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-3 py-1 rounded text-sm mt-2 inline-block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderScoutDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Scout Dashboard</h1>
          <p className="text-gray-400">Discover and analyze talented players worldwide</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <Calendar size={20} />
          </button>
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {unreadCount}
                </div>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[#BE3C63] hover:text-[#331C22] text-sm"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-gray-750' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          <p className="text-gray-400 text-sm">{notification.message}</p>
                          <span className="text-gray-500 text-xs">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#BE3C63] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                  <button className="w-full text-[#BE3C63] hover:text-[#331C22] text-sm">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-white hover:text-[#BE3C63] transition-colors"
            >
              <div className="w-10 h-10 bg-[#BE3C63] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="hidden md:block">{user?.name || 'Scout'}</span>
              <ChevronDown size={16} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-2">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#111112] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <div className="text-gray-400 text-sm">Players Discovered</div>
        </div>

        <div className="bg-[#111112] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
              <Brain className="text-green-400" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">23</div>
          <div className="text-gray-400 text-sm">High-Match Players</div>
        </div>

        <div className="bg-[#111112] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
              <Calendar className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">8</div>
          <div className="text-gray-400 text-sm">Active Conversations</div>
        </div>

        <div className="bg-[#111112] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#BE3C63] bg-opacity-20 p-3 rounded-lg">
              <Star className="text-[#BE3C63]" size={24} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#BE3C63] mb-1">SCOUT</div>
          <div className="text-gray-400 text-sm">Subscription</div>
        </div>
      </div>

      {/* High-Performance Players */}
      <div className="bg-[#111112] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">High-Performance Player Suggestions</h3>
          <Link to="/ai-scouting" className="text-[#BE3C63] hover:text-[#331C22] text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockScoutRecommendations.map((player) => (
            <div key={player.id} className="bg-[#111112] rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={player.photo} 
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-medium">{player.name}</div>
                  <div className="text-gray-400 text-sm">{player.position} • {player.age} yrs</div>
                </div>
                <div className="ml-auto text-[#BE3C63] font-semibold">{player.match}</div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pace</span>
                  <span className="text-white">{player.stats.pace}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shot</span>
                  <span className="text-white">{player.stats.shot}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pass</span>
                  <span className="text-white">{player.stats.pass}</span>
                </div>
              </div>
              
              <div className="text-gray-400 text-sm mb-4">{player.club} • {player.country}</div>
              
              <Link 
                to="/ai-scouting"
                className="w-full bg-[#BE3C63] hover:bg-[#331C22] text-white py-2 rounded text-sm block text-center"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        {user?.role === 'club' ? renderClubDashboard() : renderScoutDashboard()}
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}

      {/* Post-Registration Staff Modal */}
      {clubId && (
        <AddStaffModal
          isOpen={showStaffModal}
          onClose={() => setShowStaffModal(false)}
          clubId={clubId}
        />
      )}
    </div>
  );
};

export default Dashboard;