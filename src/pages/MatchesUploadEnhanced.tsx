import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Video,
  FileText,
  Calendar,
  MapPin,
  Search,
  X,
  Clock,
  Users,
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  Plus,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import FormationVisual from '../components/FormationVisual';
import MatchDetailsModal from '../components/modals/MatchDetailsModal';
import { supabase } from '../lib/supabase';

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  position: string;
  firstName: string;
  lastName: string;
}

interface LineupPlayer {
  playerId: string;
  jerseyNumber: number;
  positionInFormation: string;
}

interface Match {
  id: string;
  title: string;
  opponent: string;
  date: string;
  venue: string;
  competition: string;
  homeScore: number;
  awayScore: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  uploadDate: string;
  videoUrl?: string;
  hasLineup: boolean;
  goals?: Array<{
    scorer: string;
    assist?: string;
    minute: number;
    goalType?: string;
  }>;
  aiInsights?: Array<{
    category: string;
    type: 'strength' | 'weakness' | 'recommendation';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  playerPerformances?: Array<{
    playerName: string;
    position: string;
    rating: number;
    strengths: string[];
    improvements: string[];
  }>;
}

const FORMATIONS = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '5-3-2', '3-4-3'];

const LEAGUES = [
  'Premier League',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Championship',
  'Eredivisie',
  'Liga MX',
];

const MatchesUploadEnhanced: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const [showLineupModal, setShowLineupModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [lineupData, setLineupData] = useState({
    matchDate: '',
    league: '',
    opponent: '',
    venueLocation: '',
    formation: '4-4-2',
    selectedPlayers: [] as LineupPlayer[],
  });

  const [videoData, setVideoData] = useState({
    file: null as File | null,
    fileName: '',
  });

  const [clubSearch, setClubSearch] = useState('');
  const [showClubDropdown, setShowClubDropdown] = useState(false);

  const mockOpponents = [
    'Real Madrid CF',
    'FC Barcelona',
    'Liverpool FC',
    'Bayern Munich',
    'Paris Saint-Germain',
    'Manchester City',
    'Chelsea FC',
    'Arsenal FC',
  ];

  const filteredOpponents = mockOpponents.filter((club) =>
    club.toLowerCase().includes(clubSearch.toLowerCase())
  );

  useEffect(() => {
    loadPlayers();
    loadMatches();
  }, []);

  const loadPlayers = async () => {
    try {
      const { data: clubData } = await supabase
        .from('clubs')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (!clubData) return;

      const { data: playersData, error } = await supabase
        .from('players')
        .select('id, first_name, last_name, position, jersey_number')
        .eq('current_club_id', clubData.id);

      if (error) throw error;

      const formattedPlayers: Player[] =
        playersData?.map((p) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          firstName: p.first_name,
          lastName: p.last_name,
          jerseyNumber: p.jersey_number || 0,
          position: p.position,
        })) || [];

      setPlayers(formattedPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const { data: clubData } = await supabase
        .from('clubs')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (!clubData) return;

      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          opponent_name,
          competition,
          score_home,
          score_away,
          video_url,
          venue_location,
          upload_status,
          analyzed,
          created_at
        `)
        .eq('club_id', clubData.id)
        .order('match_date', { ascending: false });

      if (error) throw error;

      const formattedMatches: Match[] =
        matchesData?.map((m) => ({
          id: m.id,
          title: `vs ${m.opponent_name}`,
          opponent: m.opponent_name,
          date: m.match_date,
          venue: m.venue_location || 'TBD',
          competition: m.competition || 'Friendly',
          homeScore: m.score_home || 0,
          awayScore: m.score_away || 0,
          status: m.analyzed
            ? 'analyzed'
            : m.upload_status === 'completed'
            ? 'uploaded'
            : (m.upload_status as 'processing' | 'failed'),
          uploadDate: m.created_at,
          videoUrl: m.video_url,
          hasLineup: false,
        })) || [];

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const handleAddPlayerToLineup = (player: Player) => {
    const existingIndex = lineupData.selectedPlayers.findIndex(
      (p) => p.playerId === player.id
    );

    if (existingIndex >= 0) {
      setLineupData({
        ...lineupData,
        selectedPlayers: lineupData.selectedPlayers.filter(
          (p) => p.playerId !== player.id
        ),
      });
    } else {
      const formationPositions = {
        '4-4-2': 11,
        '4-3-3': 11,
        '4-2-3-1': 11,
        '3-5-2': 11,
        '5-3-2': 11,
        '3-4-3': 11,
      };

      const maxPlayers = formationPositions[lineupData.formation as keyof typeof formationPositions] || 11;

      if (lineupData.selectedPlayers.length >= maxPlayers) {
        alert(`Formation ${lineupData.formation} only allows ${maxPlayers} players`);
        return;
      }

      setLineupData({
        ...lineupData,
        selectedPlayers: [
          ...lineupData.selectedPlayers,
          {
            playerId: player.id,
            jerseyNumber: player.jerseyNumber,
            positionInFormation: player.position,
          },
        ],
      });
    }
  };

  const handleSaveLineup = async () => {
    if (
      !lineupData.matchDate ||
      !lineupData.opponent ||
      !lineupData.venueLocation ||
      lineupData.selectedPlayers.length === 0
    ) {
      alert('Please fill in all match details and select at least one player');
      return;
    }

    try {
      setLoading(true);

      const { data: clubData } = await supabase
        .from('clubs')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (!clubData) {
        alert('Club not found');
        return;
      }

      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({
          club_id: clubData.id,
          match_date: lineupData.matchDate,
          opponent_name: lineupData.opponent,
          competition: lineupData.league,
          venue_location: lineupData.venueLocation,
          formation: lineupData.formation,
          upload_status: 'pending',
          analyzed: false,
        })
        .select()
        .single();

      if (matchError) throw matchError;

      const { data: lineupRecord, error: lineupError } = await supabase
        .from('match_lineups')
        .insert({
          match_id: matchData.id,
          formation: lineupData.formation,
          created_by: user?.id,
        })
        .select()
        .single();

      if (lineupError) throw lineupError;

      const lineupPlayers = lineupData.selectedPlayers.map((lp, index) => ({
        lineup_id: lineupRecord.id,
        player_id: lp.playerId,
        jersey_number: lp.jerseyNumber,
        position_in_formation: lp.positionInFormation,
        position_x: 50,
        position_y: (index + 1) * 10,
        is_starting: true,
      }));

      const { error: playersError } = await supabase
        .from('match_lineup_players')
        .insert(lineupPlayers);

      if (playersError) throw playersError;

      alert('Lineup saved successfully! Players have been notified.');

      setLineupData({
        matchDate: '',
        league: '',
        opponent: '',
        venueLocation: '',
        formation: '4-4-2',
        selectedPlayers: [],
      });
      setShowLineupModal(false);
      await loadMatches();
    } catch (error) {
      console.error('Error saving lineup:', error);
      alert('Failed to save lineup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoData.file) {
      alert('Please select a video file');
      return;
    }

    alert(
      'Video upload functionality would upload to storage and update match record. Implementation requires storage bucket setup.'
    );
    setShowVideoModal(false);
  };

  const handleViewMatch = (match: Match) => {
    const mockAIData = {
      ...match,
      aiInsights: match.status === 'analyzed' ? [
        {
          category: 'Tactical',
          type: 'weakness' as const,
          title: 'Defensive Vulnerability in Final Third',
          description:
            'Your team conceded 65% of goals in the last 20 minutes. Consider bringing on defensive substitutes earlier.',
          impact: 'high' as const,
        },
        {
          category: 'Performance',
          type: 'strength' as const,
          title: 'Strong Midfield Control',
          description:
            'Your midfield dominated possession with 68% pass completion in the center. Continue this strategy.',
          impact: 'medium' as const,
        },
        {
          category: 'Recommendation',
          type: 'recommendation' as const,
          title: 'Formation Adjustment Suggested',
          description:
            'Based on opponent analysis, switching to 4-2-3-1 could provide better defensive stability.',
          impact: 'medium' as const,
        },
      ] : [],
      playerPerformances: match.status === 'analyzed' ? [
        {
          playerName: 'Lionel Messi',
          position: 'Forward',
          rating: 8.7,
          strengths: [
            'Excellent positioning in attacking third',
            'High shot accuracy (75%)',
            'Created 4 goal-scoring opportunities',
          ],
          improvements: [
            'Tracking back on defense (only 2 tackles)',
            'Pass completion in final third (62%)',
          ],
        },
        {
          playerName: 'Kevin De Bruyne',
          position: 'Midfielder',
          rating: 7.4,
          strengths: [
            'Strong passing accuracy (89%)',
            'Dominated midfield possession',
            'Key assists provider',
          ],
          improvements: [
            'Defensive positioning needs work',
            'Lost possession 8 times in dangerous areas',
          ],
        },
      ] : [],
    };

    setSelectedMatch(mockAIData);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-600 text-white';
      case 'processing':
        return 'bg-yellow-600 text-white';
      case 'uploaded':
        return 'bg-blue-600 text-white';
      case 'failed':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <Trophy size={16} />;
      case 'processing':
        return <Clock size={16} />;
      case 'uploaded':
        return <Upload size={16} />;
      case 'failed':
        return <X size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const lineupPlayers: Player[] = lineupData.selectedPlayers
    .map((lp) => {
      const player = players.find((p) => p.id === lp.playerId);
      return player
        ? {
            ...player,
            jerseyNumber: lp.jerseyNumber,
            position: lp.positionInFormation,
          }
        : null;
    })
    .filter((p): p is Player => p !== null);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Match Management</h1>
            <p className="text-gray-400">
              Upload team lineups, match videos, and view AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Video className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{matches.length}</div>
              <div className="text-gray-400 text-sm">Total Matches</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Trophy className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {matches.filter((m) => m.status === 'analyzed').length}
              </div>
              <div className="text-gray-400 text-sm">Analyzed</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{players.length}</div>
              <div className="text-gray-400 text-sm">Squad Players</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Target className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {matches.reduce((sum, match) => sum + match.homeScore, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Goals</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Create Team Lineup</h2>
                  <p className="text-gray-400 text-sm">
                    Select formation and players for upcoming match
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Setup Match Lineup</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Required before video upload
                </p>
                <button
                  onClick={() => setShowLineupModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Create Lineup</span>
                </button>
              </div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Video className="text-pink-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload Match Video</h2>
                  <p className="text-gray-400 text-sm">
                    Upload after saving team lineup
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-pink-500 transition-colors">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-gray-400" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Upload Match Video</h3>
                <p className="text-gray-400 text-sm mb-4">For AI analysis</p>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Choose File
                </button>
                <p className="text-gray-500 text-xs mt-4">
                  Supported: MP4, MOV, AVI (Max 2GB)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#111112] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Matches</h2>
              <button className="text-pink-400 hover:text-pink-300 text-sm">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
                        <Video className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{match.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy size={14} />
                            <span>{match.competition}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {match.homeScore} - {match.awayScore}
                        </div>
                        <div className="text-gray-400 text-sm">Score</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(match.status)}
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(
                            match.status
                          )}`}
                        >
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleViewMatch(match)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {matches.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">No matches yet</div>
                  <p className="text-gray-500">
                    Create your first team lineup to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLineupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Team Lineup</h2>
                <button
                  onClick={() => setShowLineupModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Match Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Match Date
                        </label>
                        <input
                          type="date"
                          value={lineupData.matchDate}
                          onChange={(e) =>
                            setLineupData({ ...lineupData, matchDate: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          League / Competition
                        </label>
                        <select
                          value={lineupData.league}
                          onChange={(e) =>
                            setLineupData({ ...lineupData, league: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select League</option>
                          {LEAGUES.map((league) => (
                            <option key={league} value={league}>
                              {league}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Opponent Club
                        </label>
                        <div className="relative">
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                          <input
                            type="text"
                            value={clubSearch || lineupData.opponent}
                            onChange={(e) => {
                              setClubSearch(e.target.value);
                              setLineupData({ ...lineupData, opponent: e.target.value });
                              setShowClubDropdown(true);
                            }}
                            onFocus={() => setShowClubDropdown(true)}
                            placeholder="Search for opponent..."
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {showClubDropdown && clubSearch && (
                          <div className="absolute bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1 w-full">
                            {filteredOpponents.map((club) => (
                              <button
                                key={club}
                                onClick={() => {
                                  setLineupData({ ...lineupData, opponent: club });
                                  setClubSearch(club);
                                  setShowClubDropdown(false);
                                }}
                                className="w-full p-3 text-left hover:bg-gray-600 transition-colors text-white"
                              >
                                {club}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Venue Location
                        </label>
                        <input
                          type="text"
                          value={lineupData.venueLocation}
                          onChange={(e) =>
                            setLineupData({
                              ...lineupData,
                              venueLocation: e.target.value,
                            })
                          }
                          placeholder="Stadium name"
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Formation Setup
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {FORMATIONS.map((formation) => (
                        <button
                          key={formation}
                          onClick={() =>
                            setLineupData({ ...lineupData, formation, selectedPlayers: [] })
                          }
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            lineupData.formation === formation
                              ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-400'
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {formation}
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <FormationVisual
                        formation={lineupData.formation}
                        players={lineupPlayers}
                        editable={true}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Select Players ({lineupData.selectedPlayers.length}/11)
                    </h3>
                    {lineupData.selectedPlayers.length > 0 && (
                      <button
                        onClick={() => setLineupData({ ...lineupData, selectedPlayers: [] })}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                      >
                        <X size={16} />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-3 mb-4">
                    <p className="text-blue-200 text-sm flex items-start space-x-2">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>
                        Click on players below to add them to your lineup. Jersey numbers will appear on the formation preview.
                      </span>
                    </p>
                  </div>

                  {players.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                      <Users size={48} className="text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">No players available</p>
                      <p className="text-gray-500 text-sm">Add players to your squad first</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                      {players.map((player) => {
                        const isSelected = lineupData.selectedPlayers.some(
                          (p) => p.playerId === player.id
                        );
                        return (
                          <button
                            key={player.id}
                            onClick={() => handleAddPlayerToLineup(player)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500 bg-opacity-20 shadow-lg'
                                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-400'
                                      : 'bg-gray-700 text-gray-400 border-gray-600'
                                  }`}
                                >
                                  #{player.jerseyNumber}
                                </div>
                                <div>
                                  <div className="text-white font-semibold text-base">
                                    {player.name}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-400">{player.position}</span>
                                    {isSelected && (
                                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                                        In Lineup
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isSelected ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-blue-400 text-sm font-medium">Selected</span>
                                  <CheckCircle className="text-blue-400" size={24} />
                                </div>
                              ) : (
                                <Plus className="text-gray-500" size={24} />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {lineupData.selectedPlayers.length === 11 && (
                    <div className="mt-4 bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-3">
                      <p className="text-green-200 text-sm flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span className="font-semibold">Lineup Complete! All 11 positions filled.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 pt-6 mt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowLineupModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLineup}
                  disabled={
                    loading ||
                    !lineupData.matchDate ||
                    !lineupData.opponent ||
                    lineupData.selectedPlayers.length === 0
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Saving...' : 'Save Lineup & Notify Players'}</span>
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Match Video</h2>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  {videoData.file ? (
                    <div className="space-y-3">
                      <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg w-fit mx-auto">
                        <Video className="text-pink-400" size={32} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{videoData.fileName}</div>
                        <div className="text-gray-400 text-sm">
                          {(videoData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setVideoData({ file: null, fileName: '' })
                        }
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="text-gray-400" size={24} />
                      </div>
                      <h4 className="text-white font-medium mb-2">
                        Select Match Video
                      </h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Choose a video file from your device
                      </p>
                      <label className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block">
                        Browse Files
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setVideoData({ file, fileName: file.name });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-gray-500 text-xs mt-4">
                        Supported: MP4, MOV, AVI (Max 2GB)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVideoUpload}
                    disabled={!videoData.file}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    Upload Video
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <MatchDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        match={selectedMatch}
      />

      {showClubDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowClubDropdown(false)}
        />
      )}
    </div>
  );
};

export default MatchesUploadEnhanced;
