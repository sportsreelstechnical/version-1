import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Medal,
  Star,
  ChevronDown,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface HistoryEvent {
  id: string;
  type: 'trophy' | 'milestone' | 'transfer' | 'match' | 'achievement';
  title: string;
  description: string;
  date: string;
  season: string;
  importance: 'high' | 'medium' | 'low';
  details?: {
    opponent?: string;
    score?: string;
    venue?: string;
    attendance?: number;
    playerName?: string;
    transferFee?: string;
  };
}

const mockHistory: HistoryEvent[] = [
  {
    id: '1',
    type: 'trophy',
    title: 'Premier League Champions',
    description: 'Won the Premier League title for the 8th time in club history',
    date: '2024-05-19',
    season: '2023-24',
    importance: 'high',
    details: {
      venue: 'Etihad Stadium'
    }
  },
  {
    id: '2',
    type: 'trophy',
    title: 'UEFA Champions League Winners',
    description: 'First Champions League title in club history',
    date: '2023-06-10',
    season: '2022-23',
    importance: 'high',
    details: {
      opponent: 'Inter Milan',
      score: '1-0',
      venue: 'Atatürk Olympic Stadium'
    }
  },
  {
    id: '3',
    type: 'transfer',
    title: 'Erling Haaland Signing',
    description: 'Signed Norwegian striker from Borussia Dortmund',
    date: '2022-07-01',
    season: '2022-23',
    importance: 'high',
    details: {
      playerName: 'Erling Haaland',
      transferFee: '€60M'
    }
  },
  {
    id: '4',
    type: 'match',
    title: 'Historic 6-3 Victory',
    description: 'Memorable victory against Manchester United',
    date: '2022-10-02',
    season: '2022-23',
    importance: 'medium',
    details: {
      opponent: 'Manchester United',
      score: '6-3',
      venue: 'Etihad Stadium',
      attendance: 55000
    }
  },
  {
    id: '5',
    type: 'milestone',
    title: '100 Goals in a Season',
    description: 'First club to score 100+ goals in Premier League season',
    date: '2018-05-13',
    season: '2017-18',
    importance: 'high'
  },
  {
    id: '6',
    type: 'achievement',
    title: 'Domestic Treble',
    description: 'Won Premier League, FA Cup, and EFL Cup in same season',
    date: '2019-05-18',
    season: '2018-19',
    importance: 'high'
  }
];

const ClubHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEvent[]>(mockHistory);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const seasons = ['2023-24', '2022-23', '2021-22', '2020-21', '2019-20', '2018-19', '2017-18'];
  
  const filteredHistory = history.filter(event => {
    const matchesType = selectedFilter === 'all' || event.type === selectedFilter;
    const matchesSeason = selectedSeason === 'all' || event.season === selectedSeason;
    return matchesType && matchesSeason;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'trophy': return <Trophy className="text-yellow-400" size={24} />;
      case 'milestone': return <Target className="text-blue-400" size={24} />;
      case 'transfer': return <Users className="text-green-400" size={24} />;
      case 'match': return <Star className="text-purple-400" size={24} />;
      case 'achievement': return <Award className="text-pink-400" size={24} />;
      default: return <Medal className="text-gray-400" size={24} />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-yellow-400';
      case 'medium': return 'border-l-blue-400';
      case 'low': return 'border-l-gray-400';
      default: return 'border-l-gray-400';
    }
  };

  const EventCard: React.FC<{ event: HistoryEvent }> = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-xl p-6 border-l-4 ${getImportanceColor(event.importance)} hover:bg-gray-750 transition-colors`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-white font-semibold text-lg">{event.title}</h3>
              <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">
                {event.season}
              </span>
            </div>
            <p className="text-gray-400 mb-3">{event.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <span className="capitalize">{event.type}</span>
            </div>
          </div>
        </div>
        {event.details && (
          <button
            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown 
              size={20} 
              className={`transform transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {expandedEvent === event.id && event.details && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            {event.details.opponent && (
              <div>
                <span className="text-gray-400">Opponent:</span>
                <span className="text-white ml-2">{event.details.opponent}</span>
              </div>
            )}
            {event.details.score && (
              <div>
                <span className="text-gray-400">Score:</span>
                <span className="text-white ml-2">{event.details.score}</span>
              </div>
            )}
            {event.details.venue && (
              <div>
                <span className="text-gray-400">Venue:</span>
                <span className="text-white ml-2">{event.details.venue}</span>
              </div>
            )}
            {event.details.attendance && (
              <div>
                <span className="text-gray-400">Attendance:</span>
                <span className="text-white ml-2">{event.details.attendance.toLocaleString()}</span>
              </div>
            )}
            {event.details.playerName && (
              <div>
                <span className="text-gray-400">Player:</span>
                <span className="text-white ml-2">{event.details.playerName}</span>
              </div>
            )}
            {event.details.transferFee && (
              <div>
                <span className="text-gray-400">Transfer Fee:</span>
                <span className="text-white ml-2">{event.details.transferFee}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Club History</h1>
            <p className="text-gray-400">Explore your club's journey through the years</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {history.filter(h => h.type === 'trophy').length}
              </div>
              <div className="text-gray-400 text-sm">Trophies Won</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Target className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {history.filter(h => h.type === 'milestone').length}
              </div>
              <div className="text-gray-400 text-sm">Milestones</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {history.filter(h => h.type === 'transfer').length}
              </div>
              <div className="text-gray-400 text-sm">Key Transfers</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">144</div>
              <div className="text-gray-400 text-sm">Seasons Played</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Type</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Events</option>
                  <option value="trophy">Trophies</option>
                  <option value="milestone">Milestones</option>
                  <option value="transfer">Transfers</option>
                  <option value="match">Memorable Matches</option>
                  <option value="achievement">Achievements</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-gray-300 text-sm font-medium mb-2">Filter by Season</label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Seasons</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Club Timeline ({filteredHistory.length} events)
              </h2>
            </div>
            
            <div className="space-y-4">
              {filteredHistory.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No events found</div>
                <p className="text-gray-500">Try adjusting your filters to see more history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubHistory;