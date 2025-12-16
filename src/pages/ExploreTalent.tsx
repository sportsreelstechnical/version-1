import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  Star, 
  MessageCircle,
  Heart,
  Eye,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  nationality: string;
  club: string;
  league: string;
  fifaId: string;
  photo: string;
  stats: {
    pace: number;
    shooting: number;
    passing: number;
    defending: number;
    dribbling: number;
    physical: number;
  };
  performance: {
    goals: number;
    assists: number;
    matches: number;
    rating: number;
  };
  matchPercentage: number;
  transferValue: string;
  contract: string;
  highlights: string[];
}

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    position: 'Forward',
    age: 23,
    height: '5\'7"',
    weight: '130 lbs',
    nationality: 'Spain',
    club: 'Bayern Munich',
    league: 'Bundesliga',
    fifaId: 'SR-10091',
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    stats: {
      pace: 92,
      shooting: 88,
      passing: 85,
      defending: 45,
      dribbling: 90,
      physical: 78
    },
    performance: {
      goals: 18,
      assists: 12,
      matches: 25,
      rating: 8.4
    },
    matchPercentage: 94,
    transferValue: '€25M',
    contract: '2026',
    highlights: ['Top Scorer', 'Rising Star', 'International']
  },
  {
    id: '2',
    name: 'Carlos Mendez',
    position: 'Defender',
    age: 27,
    height: '6\'1"',
    weight: '180 lbs',
    nationality: 'Argentina',
    club: 'Atletico Madrid',
    league: 'La Liga',
    fifaId: 'SR-10092',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    stats: {
      pace: 75,
      shooting: 55,
      passing: 88,
      defending: 92,
      dribbling: 70,
      physical: 89
    },
    performance: {
      goals: 3,
      assists: 8,
      matches: 30,
      rating: 8.1
    },
    matchPercentage: 85,
    transferValue: '€18M',
    contract: '2025',
    highlights: ['Defensive Wall', 'Leadership', 'Experienced']
  },
  {
    id: '3',
    name: 'James Wilson',
    position: 'Midfielder',
    age: 25,
    height: '5\'10"',
    weight: '165 lbs',
    nationality: 'England',
    club: 'FC Barcelona',
    league: 'La Liga',
    fifaId: 'SR-10093',
    photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=200',
    stats: {
      pace: 82,
      shooting: 78,
      passing: 94,
      defending: 75,
      dribbling: 88,
      physical: 80
    },
    performance: {
      goals: 12,
      assists: 20,
      matches: 28,
      rating: 8.6
    },
    matchPercentage: 89,
    transferValue: '€35M',
    contract: '2027',
    highlights: ['Playmaker', 'Vision', 'Versatile']
  },
  {
    id: '4',
    name: 'Luca Rossi',
    position: 'Forward',
    age: 21,
    height: '5\'9"',
    weight: '155 lbs',
    nationality: 'Italy',
    club: 'AC Milan',
    league: 'Serie A',
    fifaId: 'SR-10094',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    stats: {
      pace: 95,
      shooting: 85,
      passing: 80,
      defending: 40,
      dribbling: 92,
      physical: 72
    },
    performance: {
      goals: 22,
      assists: 8,
      matches: 24,
      rating: 8.2
    },
    matchPercentage: 91,
    transferValue: '€28M',
    contract: '2028',
    highlights: ['Speed Demon', 'Clinical Finisher', 'Young Talent']
  }
];

const ExploreTalent: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: 'all',
    ageMin: '',
    ageMax: '',
    nationality: 'all',
    league: 'all',
    minRating: ''
  });
  const [savedPlayers, setSavedPlayers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('match');

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.fifaId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filters.position === 'all' || player.position.toLowerCase() === filters.position.toLowerCase();
    const matchesAge = (!filters.ageMin || player.age >= parseInt(filters.ageMin)) &&
                      (!filters.ageMax || player.age <= parseInt(filters.ageMax));
    const matchesNationality = filters.nationality === 'all' || player.nationality === filters.nationality;
    const matchesLeague = filters.league === 'all' || player.league === filters.league;
    const matchesRating = !filters.minRating || player.performance.rating >= parseFloat(filters.minRating);
    
    return matchesSearch && matchesPosition && matchesAge && matchesNationality && matchesLeague && matchesRating;
  });

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.matchPercentage - a.matchPercentage;
      case 'rating':
        return b.performance.rating - a.performance.rating;
      case 'age':
        return a.age - b.age;
      case 'value':
        return parseFloat(b.transferValue.replace(/[€M]/g, '')) - parseFloat(a.transferValue.replace(/[€M]/g, ''));
      default:
        return 0;
    }
  });

  const toggleSavePlayer = (playerId: string) => {
    setSavedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const getStatColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 80) return 'text-yellow-400';
    if (value >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={player.photo}
            alt={player.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-semibold text-lg">{player.name}</h3>
            <p className="text-gray-400">{player.position} • {player.age} yrs</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">
                {player.fifaId}
              </span>
              <span className="text-pink-400 font-semibold text-sm">
                {player.matchPercentage}% match
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleSavePlayer(player.id)}
          className={`p-2 rounded-lg transition-colors ${
            savedPlayers.includes(player.id)
              ? 'bg-pink-600 text-white'
              : 'bg-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{player.nationality}</span>
          </div>
          <div>{player.club}</div>
          <div>{player.league}</div>
        </div>
        <div className="flex flex-wrap gap-1">
          {player.highlights.map((highlight, index) => (
            <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
              {highlight}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.performance.goals}</div>
          <div className="text-gray-400 text-sm">Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.performance.assists}</div>
          <div className="text-gray-400 text-sm">Assists</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.performance.rating}</div>
          <div className="text-gray-400 text-sm">Rating</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Pace</span>
          <span className={`font-semibold ${getStatColor(player.stats.pace)}`}>
            {player.stats.pace}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Shooting</span>
          <span className={`font-semibold ${getStatColor(player.stats.shooting)}`}>
            {player.stats.shooting}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Passing</span>
          <span className={`font-semibold ${getStatColor(player.stats.passing)}`}>
            {player.stats.passing}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-400">Transfer Value:</span>
        <span className="text-white font-semibold">{player.transferValue}</span>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
          <Eye size={16} />
          <span>View Profile</span>
        </button>
        <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          <MessageCircle size={16} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Explore Talent</h1>
            <p className="text-gray-400">Discover high-performance players from around the world</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <User className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{players.length}</div>
              <div className="text-gray-400 text-sm">Available Players</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Heart className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{savedPlayers.length}</div>
              <div className="text-gray-400 text-sm">Saved Players</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {players.filter(p => p.matchPercentage >= 90).length}
              </div>
              <div className="text-gray-400 text-sm">High Match %</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <MessageCircle className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">5</div>
              <div className="text-gray-400 text-sm">Active Conversations</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search players by name, club, or FIFA ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="match">Sort by Match %</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="age">Sort by Age</option>
                  <option value="value">Sort by Value</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <select
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Positions</option>
                  <option value="forward">Forward</option>
                  <option value="midfielder">Midfielder</option>
                  <option value="defender">Defender</option>
                  <option value="goalkeeper">Goalkeeper</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Age"
                  value={filters.ageMin}
                  onChange={(e) => setFilters({...filters, ageMin: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />

                <input
                  type="number"
                  placeholder="Max Age"
                  value={filters.ageMax}
                  onChange={(e) => setFilters({...filters, ageMax: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />

                <select
                  value={filters.nationality}
                  onChange={(e) => setFilters({...filters, nationality: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Countries</option>
                  <option value="Spain">Spain</option>
                  <option value="Argentina">Argentina</option>
                  <option value="England">England</option>
                  <option value="Italy">Italy</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                </select>

                <select
                  value={filters.league}
                  onChange={(e) => setFilters({...filters, league: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Leagues</option>
                  <option value="La Liga">La Liga</option>
                  <option value="Premier League">Premier League</option>
                  <option value="Bundesliga">Bundesliga</option>
                  <option value="Serie A">Serie A</option>
                  <option value="Ligue 1">Ligue 1</option>
                </select>

                <input
                  type="number"
                  step="0.1"
                  placeholder="Min Rating"
                  value={filters.minRating}
                  onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Players Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {sortedPlayers.length} Players Found
              </h2>
              {savedPlayers.length > 0 && (
                <button className="text-pink-400 hover:text-pink-300 text-sm">
                  View Saved ({savedPlayers.length})
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {sortedPlayers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No players found</div>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTalent;