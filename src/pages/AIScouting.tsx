import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  Star, 
  MessageCircle,
  Heart,
  Eye,
  TrendingUp,
  Target,
  Zap,
  Award,
  Activity,
  BarChart3,
  X,
  ChevronDown,
  Globe,
  Clock,
  Trophy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface AIRecommendation {
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
  aiScore: number;
  matchPercentage: number;
  transferValue: string;
  contract: string;
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
  aiInsights: {
    strengths: string[];
    weaknesses: string[];
    playStyle: string;
    potentialRole: string;
    riskLevel: 'low' | 'medium' | 'high';
    marketValue: string;
    contractSituation: string;
    injuryHistory: string;
  };
  scoutingReport: {
    technicalAbility: number;
    physicalAttributes: number;
    mentalStrength: number;
    tacticalAwareness: number;
    potential: number;
    consistency: number;
  };
  recentForm: {
    lastFiveGames: Array<{
      date: string;
      opponent: string;
      rating: number;
      goals: number;
      assists: number;
    }>;
  };
  highlights: string[];
  tags: string[];
}

const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    name: 'Marcus Silva',
    position: 'Forward',
    age: 22,
    height: '5\'11"',
    weight: '170 lbs',
    nationality: 'Brazil',
    club: 'Santos FC',
    league: 'Brasileirão',
    fifaId: 'SR-20001',
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    aiScore: 94,
    matchPercentage: 96,
    transferValue: '€15M',
    contract: '2025',
    stats: {
      pace: 93,
      shooting: 87,
      passing: 82,
      defending: 35,
      dribbling: 91,
      physical: 78
    },
    performance: {
      goals: 24,
      assists: 12,
      matches: 28,
      rating: 8.7
    },
    aiInsights: {
      strengths: ['Exceptional pace and acceleration', 'Clinical finishing in the box', 'Strong dribbling in tight spaces'],
      weaknesses: ['Needs improvement in aerial duels', 'Defensive contribution could be better'],
      playStyle: 'Pacey winger who cuts inside to shoot',
      potentialRole: 'Right Wing / Second Striker',
      riskLevel: 'low',
      marketValue: 'Undervalued - potential for 200% growth',
      contractSituation: 'Contract expires 2025 - good negotiating position',
      injuryHistory: 'Clean injury record - only minor knocks'
    },
    scoutingReport: {
      technicalAbility: 88,
      physicalAttributes: 85,
      mentalStrength: 82,
      tacticalAwareness: 79,
      potential: 92,
      consistency: 84
    },
    recentForm: {
      lastFiveGames: [
        { date: '2024-05-20', opponent: 'Flamengo', rating: 9.1, goals: 2, assists: 1 },
        { date: '2024-05-15', opponent: 'Palmeiras', rating: 8.5, goals: 1, assists: 0 },
        { date: '2024-05-10', opponent: 'São Paulo', rating: 8.8, goals: 1, assists: 2 },
        { date: '2024-05-05', opponent: 'Corinthians', rating: 7.9, goals: 0, assists: 1 },
        { date: '2024-05-01', opponent: 'Grêmio', rating: 8.3, goals: 1, assists: 0 }
      ]
    },
    highlights: ['Rising Star', 'Goal Machine', 'Pace Merchant'],
    tags: ['Undervalued', 'High Potential', 'Goal Threat']
  },
  {
    id: '2',
    name: 'Alessandro Rossi',
    position: 'Midfielder',
    age: 24,
    height: '5\'9"',
    weight: '160 lbs',
    nationality: 'Italy',
    club: 'Atalanta',
    league: 'Serie A',
    fifaId: 'SR-20002',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    aiScore: 91,
    matchPercentage: 89,
    transferValue: '€22M',
    contract: '2026',
    stats: {
      pace: 79,
      shooting: 84,
      passing: 92,
      defending: 76,
      dribbling: 86,
      physical: 74
    },
    performance: {
      goals: 11,
      assists: 18,
      matches: 32,
      rating: 8.4
    },
    aiInsights: {
      strengths: ['Exceptional passing range and accuracy', 'Great vision for through balls', 'Solid defensive work rate'],
      weaknesses: ['Could improve physical presence', 'Sometimes holds onto ball too long'],
      playStyle: 'Deep-lying playmaker with box-to-box capabilities',
      potentialRole: 'Central Midfielder / Attacking Midfielder',
      riskLevel: 'low',
      marketValue: 'Fair value - steady appreciation expected',
      contractSituation: 'Long-term contract - may require higher fee',
      injuryHistory: 'Minor muscle injuries - good overall fitness'
    },
    scoutingReport: {
      technicalAbility: 91,
      physicalAttributes: 76,
      mentalStrength: 88,
      tacticalAwareness: 89,
      potential: 87,
      consistency: 86
    },
    recentForm: {
      lastFiveGames: [
        { date: '2024-05-18', opponent: 'Juventus', rating: 8.7, goals: 1, assists: 2 },
        { date: '2024-05-12', opponent: 'AC Milan', rating: 8.2, goals: 0, assists: 1 },
        { date: '2024-05-08', opponent: 'Inter Milan', rating: 8.9, goals: 1, assists: 1 },
        { date: '2024-05-03', opponent: 'Roma', rating: 8.1, goals: 0, assists: 2 },
        { date: '2024-04-28', opponent: 'Napoli', rating: 8.5, goals: 1, assists: 0 }
      ]
    },
    highlights: ['Playmaker', 'Vision Master', 'Set Piece Specialist'],
    tags: ['Proven Quality', 'Creative Force', 'Versatile']
  },
  {
    id: '3',
    name: 'Jamal Thompson',
    position: 'Defender',
    age: 20,
    height: '6\'2"',
    weight: '185 lbs',
    nationality: 'England',
    club: 'Brighton',
    league: 'Premier League',
    fifaId: 'SR-20003',
    photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=200',
    aiScore: 88,
    matchPercentage: 85,
    transferValue: '€18M',
    contract: '2027',
    stats: {
      pace: 82,
      shooting: 45,
      passing: 84,
      defending: 89,
      dribbling: 71,
      physical: 87
    },
    performance: {
      goals: 2,
      assists: 4,
      matches: 25,
      rating: 7.8
    },
    aiInsights: {
      strengths: ['Strong in aerial duels', 'Excellent positioning and timing', 'Good ball-playing ability'],
      weaknesses: ['Needs to improve pace for top level', 'Occasional concentration lapses'],
      playStyle: 'Ball-playing center-back with leadership qualities',
      potentialRole: 'Center Back / Right Back',
      riskLevel: 'medium',
      marketValue: 'Good value - high potential for growth',
      contractSituation: 'Long contract but club may sell for right price',
      injuryHistory: 'No major injuries - excellent fitness record'
    },
    scoutingReport: {
      technicalAbility: 81,
      physicalAttributes: 88,
      mentalStrength: 85,
      tacticalAwareness: 87,
      potential: 90,
      consistency: 79
    },
    recentForm: {
      lastFiveGames: [
        { date: '2024-05-19', opponent: 'Arsenal', rating: 8.1, goals: 0, assists: 0 },
        { date: '2024-05-14', opponent: 'Chelsea', rating: 7.5, goals: 0, assists: 1 },
        { date: '2024-05-09', opponent: 'Liverpool', rating: 8.3, goals: 1, assists: 0 },
        { date: '2024-05-04', opponent: 'Man City', rating: 7.8, goals: 0, assists: 0 },
        { date: '2024-04-30', opponent: 'Tottenham', rating: 8.0, goals: 0, assists: 1 }
      ]
    },
    highlights: ['Young Talent', 'Defensive Rock', 'Future Captain'],
    tags: ['High Potential', 'Leadership', 'Premier League Proven']
  }
];

const AIScouting: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(mockAIRecommendations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: 'all',
    ageMin: '',
    ageMax: '',
    nationality: 'all',
    league: 'all',
    minAIScore: '',
    riskLevel: 'all',
    maxValue: ''
  });
  const [selectedPlayer, setSelectedPlayer] = useState<AIRecommendation | null>(null);
  const [sortBy, setSortBy] = useState('aiScore');
  const [savedPlayers, setSavedPlayers] = useState<string[]>([]);

  const filteredRecommendations = recommendations.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.fifaId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filters.position === 'all' || player.position.toLowerCase() === filters.position.toLowerCase();
    const matchesAge = (!filters.ageMin || player.age >= parseInt(filters.ageMin)) &&
                      (!filters.ageMax || player.age <= parseInt(filters.ageMax));
    const matchesNationality = filters.nationality === 'all' || player.nationality === filters.nationality;
    const matchesLeague = filters.league === 'all' || player.league === filters.league;
    const matchesAIScore = !filters.minAIScore || player.aiScore >= parseInt(filters.minAIScore);
    const matchesRisk = filters.riskLevel === 'all' || player.aiInsights.riskLevel === filters.riskLevel;
    
    return matchesSearch && matchesPosition && matchesAge && matchesNationality && matchesLeague && matchesAIScore && matchesRisk;
  });

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch (sortBy) {
      case 'aiScore':
        return b.aiScore - a.aiScore;
      case 'matchPercentage':
        return b.matchPercentage - a.matchPercentage;
      case 'age':
        return a.age - b.age;
      case 'value':
        return parseFloat(b.transferValue.replace(/[€M]/g, '')) - parseFloat(a.transferValue.replace(/[€M]/g, ''));
      case 'potential':
        return b.scoutingReport.potential - a.scoutingReport.potential;
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

    // Get the full player data
    const player = recommendations.find(p => p.id === playerId);
    if (!player) return;

    // Get current wishlist from localStorage
    const currentWishlist = JSON.parse(localStorage.getItem('playerWishlist') || '[]');
    
    if (savedPlayers.includes(playerId)) {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter((p: any) => p.id !== playerId);
      localStorage.setItem('playerWishlist', JSON.stringify(updatedWishlist));
    } else {
      // Add to wishlist - convert AI recommendation to transfer format
      const wishlistPlayer = {
        id: player.id,
        name: player.name,
        position: player.position,
        age: player.age,
        nationality: player.nationality,
        club: player.club,
        league: player.league,
        fifaId: player.fifaId,
        photo: player.photo,
        transferValue: player.transferValue,
        transferType: 'full' as const,
        askingPrice: player.transferValue,
        status: 'available' as const,
        negotiable: true,
        description: `${player.aiInsights.playStyle}. ${player.aiInsights.potentialRole}.`,
        listedDate: new Date().toISOString().split('T')[0],
        performance: player.performance,
        stats: player.stats,
        aiScore: player.aiScore,
        matchPercentage: player.matchPercentage
      };
      
      const updatedWishlist = [...currentWishlist, wishlistPlayer];
      localStorage.setItem('playerWishlist', JSON.stringify(updatedWishlist));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'high': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const PlayerCard: React.FC<{ player: AIRecommendation }> = ({ player }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111112] rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={() => setSelectedPlayer(player)}
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
                AI Score: {player.aiScore}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavePlayer(player.id);
          }}
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
          <div className="text-2xl font-bold text-white">{player.matchPercentage}%</div>
          <div className="text-gray-400 text-sm">Match</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.performance.rating}</div>
          <div className="text-gray-400 text-sm">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.scoutingReport.potential}</div>
          <div className="text-gray-400 text-sm">Potential</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-400">Transfer Value:</span>
        <span className="text-white font-semibold">{player.transferValue}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs ${getRiskColor(player.aiInsights.riskLevel)}`}>
          {player.aiInsights.riskLevel.charAt(0).toUpperCase() + player.aiInsights.riskLevel.slice(1)} Risk
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm transition-colors">
            View Profile
          </button>
          <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
            <MessageCircle size={14} />
          </button>
        </div>
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
            <h1 className="text-3xl font-bold text-white">AI Scouting</h1>
            <p className="text-gray-400">AI-powered player recommendations tailored to your needs</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Brain className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{recommendations.length}</div>
              <div className="text-gray-400 text-sm">AI Recommendations</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Target className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {recommendations.filter(p => p.matchPercentage >= 90).length}
              </div>
              <div className="text-gray-400 text-sm">High Match %</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Heart className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{savedPlayers.length}</div>
              <div className="text-gray-400 text-sm">Saved Players</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Zap className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {recommendations.filter(p => p.aiInsights.riskLevel === 'low').length}
              </div>
              <div className="text-gray-400 text-sm">Low Risk Players</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#111112] p-6 rounded-xl">
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
                  <option value="aiScore">Sort by AI Score</option>
                  <option value="matchPercentage">Sort by Match %</option>
                  <option value="potential">Sort by Potential</option>
                  <option value="age">Sort by Age</option>
                  <option value="value">Sort by Value</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
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
                  <option value="Brazil">Brazil</option>
                  <option value="Italy">Italy</option>
                  <option value="England">England</option>
                  <option value="Spain">Spain</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                </select>

                <select
                  value={filters.league}
                  onChange={(e) => setFilters({...filters, league: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Leagues</option>
                  <option value="Premier League">Premier League</option>
                  <option value="Serie A">Serie A</option>
                  <option value="Brasileirão">Brasileirão</option>
                  <option value="La Liga">La Liga</option>
                  <option value="Bundesliga">Bundesliga</option>
                </select>

                <input
                  type="number"
                  placeholder="Min AI Score"
                  value={filters.minAIScore}
                  onChange={(e) => setFilters({...filters, minAIScore: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />

                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {sortedRecommendations.length} AI Recommendations
              </h2>
              {savedPlayers.length > 0 && (
                <button className="text-pink-400 hover:text-pink-300 text-sm">
                  View Saved ({savedPlayers.length})
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecommendations.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {sortedRecommendations.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No recommendations found</div>
                <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedPlayer.photo}
                    alt={selectedPlayer.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedPlayer.name}</h2>
                    <p className="text-gray-400 text-lg">{selectedPlayer.position} • {selectedPlayer.age} years old</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-pink-600 text-white px-3 py-1 rounded">
                        {selectedPlayer.fifaId}
                      </span>
                      <span className="text-pink-400 font-semibold">
                        AI Score: {selectedPlayer.aiScore}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {selectedPlayer.matchPercentage}% Match
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Player Stats */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Player Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(selectedPlayer.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</div>
                          <div className="text-gray-400 text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scouting Report */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Scouting Report</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedPlayer.scoutingReport).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className={`font-semibold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {selectedPlayer.aiInsights.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                              <span className="text-gray-300 text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {selectedPlayer.aiInsights.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                              <span className="text-gray-300 text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Recent Form */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Form (Last 5 Games)</h3>
                    <div className="space-y-3">
                      {selectedPlayer.recentForm.lastFiveGames.map((game, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded">
                          <div>
                            <div className="text-white font-medium">vs {game.opponent}</div>
                            <div className="text-gray-400 text-sm">{new Date(game.date).toLocaleDateString()}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-semibold">{game.rating}</div>
                            <div className="text-gray-400 text-sm">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white">{game.goals}G {game.assists}A</div>
                            <div className="text-gray-400 text-sm">G/A</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Player Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Club:</span>
                        <span className="text-white">{selectedPlayer.club}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">League:</span>
                        <span className="text-white">{selectedPlayer.league}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nationality:</span>
                        <span className="text-white">{selectedPlayer.nationality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Height:</span>
                        <span className="text-white">{selectedPlayer.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-white">{selectedPlayer.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract:</span>
                        <span className="text-white">Until {selectedPlayer.contract}</span>
                      </div>
                    </div>
                  </div>

                  {/* Market Analysis */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-400 text-sm">Current Value</div>
                        <div className="text-2xl font-bold text-white">{selectedPlayer.transferValue}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Risk Level</div>
                        <span className={`px-2 py-1 rounded text-xs ${getRiskColor(selectedPlayer.aiInsights.riskLevel)}`}>
                          {selectedPlayer.aiInsights.riskLevel.charAt(0).toUpperCase() + selectedPlayer.aiInsights.riskLevel.slice(1)}
                        </span>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Market Value Analysis</div>
                        <div className="text-white text-sm">{selectedPlayer.aiInsights.marketValue}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Contract Situation</div>
                        <div className="text-white text-sm">{selectedPlayer.aiInsights.contractSituation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleSavePlayer(selectedPlayer.id)}
                        className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                          savedPlayers.includes(selectedPlayer.id)
                            ? 'bg-pink-600 hover:bg-pink-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                      >
                        <Heart size={16} />
                        <span>{savedPlayers.includes(selectedPlayer.id) ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
                      </button>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <MessageCircle size={16} />
                        <span>Contact Club</span>
                      </button>
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Eye size={16} />
                        <span>Request Video</span>
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

export default AIScouting;