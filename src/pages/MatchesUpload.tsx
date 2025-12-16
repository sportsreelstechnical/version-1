import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Video, 
  FileText, 
  Calendar, 
  MapPin, 
  Search, 
  Plus, 
  X,
  Clock,
  Users,
  Trophy,
  Target,
  Play,
  Download,
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface Match {
  id: string;
  type: 'video' | 'scoresheet';
  title: string;
  opponent: string;
  date: string;
  venue: string;
  homeScore: number;
  awayScore: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  uploadDate: string;
  videoUrl?: string;
  goals?: Array<{
    scorer: string;
    assist?: string;
    minute: number;
  }>;
}

interface Club {
  id: string;
  name: string;
  league: string;
  country: string;
  logo: string;
}

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Real Madrid CF',
    league: 'La Liga',
    country: 'Spain',
    logo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'FC Barcelona',
    league: 'La Liga',
    country: 'Spain',
    logo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Liverpool FC',
    league: 'Premier League',
    country: 'England',
    logo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    name: 'Bayern Munich',
    league: 'Bundesliga',
    country: 'Germany',
    logo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '5',
    name: 'Paris Saint-Germain',
    league: 'Ligue 1',
    country: 'France',
    logo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const mockPlayers = [
  { id: '1', name: 'Lionel Messi', position: 'Forward' },
  { id: '2', name: 'Cristiano Ronaldo', position: 'Forward' },
  { id: '3', name: 'Kevin De Bruyne', position: 'Midfielder' },
  { id: '4', name: 'Virgil van Dijk', position: 'Defender' },
  { id: '5', name: 'Kylian Mbappé', position: 'Forward' },
  { id: '6', name: 'Erling Haaland', position: 'Forward' }
];

const mockMatches: Match[] = [
  {
    id: '1',
    type: 'video',
    title: 'vs Real Madrid',
    opponent: 'Real Madrid CF',
    date: '2024-05-20',
    venue: 'Etihad Stadium',
    homeScore: 2,
    awayScore: 1,
    status: 'analyzed',
    uploadDate: '2024-05-20',
    videoUrl: 'match_video_1.mp4'
  },
  {
    id: '2',
    type: 'scoresheet',
    title: 'vs Liverpool',
    opponent: 'Liverpool FC',
    date: '2024-05-15',
    venue: 'Anfield',
    homeScore: 1,
    awayScore: 3,
    status: 'uploaded',
    uploadDate: '2024-05-15',
    goals: [
      { scorer: 'Lionel Messi', minute: 25 },
      { scorer: 'Kevin De Bruyne', assist: 'Cristiano Ronaldo', minute: 45 },
      { scorer: 'Kylian Mbappé', minute: 78 }
    ]
  }
];

const MatchesUpload: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [showScoreSheet, setShowScoreSheet] = useState(false);
  const [clubSearch, setClubSearch] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  
  const [scoreSheetData, setScoreSheetData] = useState({
    date: '',
    venue: '',
    homeScore: 0,
    awayScore: 0,
    goals: [] as Array<{
      scorer: string;
      assist: string;
      minute: number;
    }>
  });
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoUploadData, setVideoUploadData] = useState({
    file: null as File | null,
    fileName: '',
    opponent: null as Club | null,
    date: '',
    venue: '',
    selectedPlayers: [] as string[]
  });

  const filteredClubs = mockClubs.filter(club =>
    club.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
    club.league.toLowerCase().includes(clubSearch.toLowerCase()) ||
    club.country.toLowerCase().includes(clubSearch.toLowerCase())
  );

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setClubSearch(club.name);
    setShowClubDropdown(false);
  };

  const handleScoreChange = (type: 'home' | 'away', value: number) => {
    const newData = { ...scoreSheetData, [type === 'home' ? 'homeScore' : 'awayScore']: value };
    
    // Adjust goals array based on home score
    if (type === 'home') {
      const currentGoals = newData.goals.length;
      if (value > currentGoals) {
        // Add new goal entries
        const newGoals = [...newData.goals];
        for (let i = currentGoals; i < value; i++) {
          newGoals.push({ scorer: '', assist: '', minute: 0 });
        }
        newData.goals = newGoals;
      } else if (value < currentGoals) {
        // Remove excess goal entries
        newData.goals = newData.goals.slice(0, value);
      }
    }
    
    setScoreSheetData(newData);
  };

  const handleGoalChange = (index: number, field: 'scorer' | 'assist' | 'minute', value: string | number) => {
    const newGoals = [...scoreSheetData.goals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setScoreSheetData({ ...scoreSheetData, goals: newGoals });
  };

  const handleScoreSheetSubmit = () => {
    if (!selectedClub || !scoreSheetData.date || !scoreSheetData.venue) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate goals
    for (let i = 0; i < scoreSheetData.homeScore; i++) {
      if (!scoreSheetData.goals[i]?.scorer || !scoreSheetData.goals[i]?.minute) {
        alert(`Please complete goal ${i + 1} details`);
        return;
      }
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      type: 'scoresheet',
      title: `vs ${selectedClub.name}`,
      opponent: selectedClub.name,
      date: scoreSheetData.date,
      venue: scoreSheetData.venue,
      homeScore: scoreSheetData.homeScore,
      awayScore: scoreSheetData.awayScore,
      status: 'uploaded',
      uploadDate: new Date().toISOString().split('T')[0],
      goals: scoreSheetData.goals.slice(0, scoreSheetData.homeScore)
    };

    setMatches([newMatch, ...matches]);
    
    // Reset form
    setScoreSheetData({
      date: '',
      venue: '',
      homeScore: 0,
      awayScore: 0,
      goals: []
    });
    setSelectedClub(null);
    setClubSearch('');
    setShowScoreSheet(false);
    
    alert('Score sheet uploaded successfully!');
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoUploadData({
        ...videoUploadData,
        file,
        fileName: file.name
      });
    }
  };

  const handlePlayerToggle = (playerId: string) => {
    setVideoUploadData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(playerId)
        ? prev.selectedPlayers.filter(id => id !== playerId)
        : [...prev.selectedPlayers, playerId]
    }));
  };

  const handleVideoUploadSubmit = () => {
    if (!videoUploadData.file || !videoUploadData.opponent || !videoUploadData.date || !videoUploadData.venue) {
      alert('Please fill in all required fields');
      return;
    }

    if (videoUploadData.selectedPlayers.length === 0) {
      alert('Please select at least one player who participated in the match');
      return;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      type: 'video',
      title: `vs ${videoUploadData.opponent.name}`,
      opponent: videoUploadData.opponent.name,
      date: videoUploadData.date,
      venue: videoUploadData.venue,
      homeScore: 0,
      awayScore: 0,
      status: 'processing',
      uploadDate: new Date().toISOString().split('T')[0],
      videoUrl: videoUploadData.fileName
    };

    setMatches([newMatch, ...matches]);
    
    // Reset form
    setVideoUploadData({
      file: null,
      fileName: '',
      opponent: null,
      date: '',
      venue: '',
      selectedPlayers: []
    });
    setShowVideoUpload(false);
    
    alert('Video uploaded successfully! AI analysis will begin shortly.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-600 text-white';
      case 'processing': return 'bg-yellow-600 text-white';
      case 'uploaded': return 'bg-blue-600 text-white';
      case 'failed': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed': return <Trophy size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'uploaded': return <Upload size={16} />;
      case 'failed': return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Match Upload</h1>
            <p className="text-gray-400">Upload match videos and score sheets for AI analysis</p>
          </div>

          {/* Stats Cards */}
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
                {matches.filter(m => m.status === 'analyzed').length}
              </div>
              <div className="text-gray-400 text-sm">Analyzed</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {matches.filter(m => m.status === 'processing').length}
              </div>
              <div className="text-gray-400 text-sm">Processing</div>
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

          {/* Upload Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Upload */}
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Video className="text-pink-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload Match Video</h2>
                  <p className="text-gray-400 text-sm">Upload video for AI analysis</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-pink-500 transition-colors">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-gray-400" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Drop your video here</h3>
                <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                  id="video-upload-input"
                />
                <button 
                  onClick={() => setShowVideoUpload(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Choose File
                </button>
                <p className="text-gray-500 text-xs mt-4">
                  Supported formats: MP4, MOV, AVI (Max 2GB)
                </p>
              </div>
            </div>

            {/* Score Sheet Upload */}
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <FileText className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Upload Score Sheet</h2>
                  <p className="text-gray-400 text-sm">Enter match results manually</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Enter Match Details</h3>
                <p className="text-gray-400 text-sm mb-4">Quick entry for match results</p>
                <button 
                  onClick={() => setShowScoreSheet(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Enter Score Sheet
                </button>
              </div>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-[#111112] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Matches</h2>
              <button className="text-pink-400 hover:text-pink-300 text-sm">View All</button>
            </div>

            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        match.type === 'video' ? 'bg-pink-500 bg-opacity-20' : 'bg-blue-500 bg-opacity-20'
                      }`}>
                        {match.type === 'video' ? (
                          <Video className="text-pink-400" size={20} />
                        ) : (
                          <FileText className="text-blue-400" size={20} />
                        )}
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
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(match.status)}`}>
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                      </div>
                      
                      <button className="text-gray-400 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {match.goals && match.goals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <h4 className="text-white font-medium mb-2">Goals</h4>
                      <div className="space-y-1">
                        {match.goals.map((goal, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-400">{goal.minute}'</span>
                            <span className="text-white">{goal.scorer}</span>
                            {goal.assist && (
                              <>
                                <span className="text-gray-400">assist:</span>
                                <span className="text-blue-400">{goal.assist}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {matches.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No matches uploaded yet</div>
                <p className="text-gray-500">Upload your first match video or score sheet to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Sheet Modal */}
      {showScoreSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Score Sheet</h2>
                <button
                  onClick={() => setShowScoreSheet(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Match Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Match Date</label>
                      <input
                        type="date"
                        value={scoreSheetData.date}
                        onChange={(e) => setScoreSheetData({...scoreSheetData, date: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Venue</label>
                      <input
                        type="text"
                        value={scoreSheetData.venue}
                        onChange={(e) => setScoreSheetData({...scoreSheetData, venue: e.target.value})}
                        placeholder="Stadium name"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Opponent Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Opponent Club</h3>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={clubSearch}
                        onChange={(e) => {
                          setClubSearch(e.target.value);
                          setShowClubDropdown(true);
                          if (!e.target.value) setSelectedClub(null);
                        }}
                        onFocus={() => setShowClubDropdown(true)}
                        placeholder="Search for opponent club..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {showClubDropdown && clubSearch && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredClubs.map((club) => (
                          <button
                            key={club.id}
                            onClick={() => handleClubSelect(club)}
                            className="w-full p-3 text-left hover:bg-gray-600 transition-colors flex items-center space-x-3"
                          >
                            <img
                              src={club.logo}
                              alt={club.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-white font-medium">{club.name}</div>
                              <div className="text-gray-400 text-sm">{club.league} • {club.country}</div>
                            </div>
                          </button>
                        ))}
                        {filteredClubs.length === 0 && (
                          <div className="p-3 text-gray-400 text-sm">No clubs found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedClub && (
                    <div className="mt-3 p-3 bg-gray-700 rounded-lg flex items-center space-x-3">
                      <img
                        src={selectedClub.logo}
                        alt={selectedClub.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-white font-medium">{selectedClub.name}</div>
                        <div className="text-gray-400 text-sm">{selectedClub.league} • {selectedClub.country}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Input */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Match Score</h3>
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-2">Your Team</div>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scoreSheetData.homeScore}
                        onChange={(e) => handleScoreChange('home', parseInt(e.target.value) || 0)}
                        className="w-20 h-20 bg-gray-700 border border-gray-600 rounded-lg text-center text-3xl font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-400">-</div>
                    
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-2">{selectedClub?.name || 'Opponent'}</div>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={scoreSheetData.awayScore}
                        onChange={(e) => handleScoreChange('away', parseInt(e.target.value) || 0)}
                        className="w-20 h-20 bg-gray-700 border border-gray-600 rounded-lg text-center text-3xl font-bold text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Goal Details */}
                {scoreSheetData.homeScore > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Goal Details</h3>
                    <div className="space-y-4">
                      {Array.from({ length: scoreSheetData.homeScore }, (_, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-3">Goal {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Goal Scorer</label>
                              <select
                                value={scoreSheetData.goals[index]?.scorer || ''}
                                onChange={(e) => handleGoalChange(index, 'scorer', e.target.value)}
                                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="">Select Player</option>
                                {mockPlayers.map((player) => (
                                  <option key={player.id} value={player.name}>
                                    {player.name} ({player.position})
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Assist (Optional)</label>
                              <select
                                value={scoreSheetData.goals[index]?.assist || ''}
                                onChange={(e) => handleGoalChange(index, 'assist', e.target.value)}
                                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                              >
                                <option value="">No Assist</option>
                                {mockPlayers
                                  .filter(player => player.name !== scoreSheetData.goals[index]?.scorer)
                                  .map((player) => (
                                    <option key={player.id} value={player.name}>
                                      {player.name} ({player.position})
                                    </option>
                                  ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-gray-300 text-sm font-medium mb-2">Minute</label>
                              <input
                                type="number"
                                min="1"
                                max="120"
                                value={scoreSheetData.goals[index]?.minute || ''}
                                onChange={(e) => handleGoalChange(index, 'minute', parseInt(e.target.value) || 0)}
                                placeholder="90"
                                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => setShowScoreSheet(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScoreSheetSubmit}
                    disabled={!selectedClub || !scoreSheetData.date || !scoreSheetData.venue}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    Upload Score Sheet
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Match Video</h2>
                <button
                  onClick={() => setShowVideoUpload(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Select Video File</h3>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    {videoUploadData.file ? (
                      <div className="space-y-3">
                        <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg w-fit mx-auto">
                          <Video className="text-pink-400" size={32} />
                        </div>
                        <div>
                          <div className="text-white font-medium">{videoUploadData.fileName}</div>
                          <div className="text-gray-400 text-sm">
                            {(videoUploadData.file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                        <button
                          onClick={() => setVideoUploadData({...videoUploadData, file: null, fileName: ''})}
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
                        <h4 className="text-white font-medium mb-2">Select Match Video</h4>
                        <p className="text-gray-400 text-sm mb-4">Choose a video file from your device</p>
                        <label className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block">
                          Browse Files
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileSelect}
                            className="hidden"
                          />
                        </label>
                        <p className="text-gray-500 text-xs mt-4">
                          Supported formats: MP4, MOV, AVI (Max 2GB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Match Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Match Date</label>
                      <input
                        type="date"
                        value={videoUploadData.date}
                        onChange={(e) => setVideoUploadData({...videoUploadData, date: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Venue</label>
                      <input
                        type="text"
                        value={videoUploadData.venue}
                        onChange={(e) => setVideoUploadData({...videoUploadData, venue: e.target.value})}
                        placeholder="Stadium name"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Opponent Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Opponent Club</h3>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={videoUploadData.opponent?.name || clubSearch}
                        onChange={(e) => {
                          setClubSearch(e.target.value);
                          setShowClubDropdown(true);
                          if (!e.target.value) setVideoUploadData({...videoUploadData, opponent: null});
                        }}
                        onFocus={() => setShowClubDropdown(true)}
                        placeholder="Search for opponent club..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    {showClubDropdown && clubSearch && !videoUploadData.opponent && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredClubs.map((club) => (
                          <button
                            key={club.id}
                            onClick={() => {
                              setVideoUploadData({...videoUploadData, opponent: club});
                              setClubSearch(club.name);
                              setShowClubDropdown(false);
                            }}
                            className="w-full p-3 text-left hover:bg-gray-600 transition-colors flex items-center space-x-3"
                          >
                            <img
                              src={club.logo}
                              alt={club.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-white font-medium">{club.name}</div>
                              <div className="text-gray-400 text-sm">{club.league} • {club.country}</div>
                            </div>
                          </button>
                        ))}
                        {filteredClubs.length === 0 && (
                          <div className="p-3 text-gray-400 text-sm">No clubs found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {videoUploadData.opponent && (
                    <div className="mt-3 p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={videoUploadData.opponent.logo}
                          alt={videoUploadData.opponent.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{videoUploadData.opponent.name}</div>
                          <div className="text-gray-400 text-sm">{videoUploadData.opponent.league} • {videoUploadData.opponent.country}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setVideoUploadData({...videoUploadData, opponent: null})}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Player Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Select Players Who Played</h3>
                  <p className="text-gray-400 text-sm mb-4">Choose all players who participated in this match</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {mockPlayers.map((player) => (
                      <label
                        key={player.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          videoUploadData.selectedPlayers.includes(player.id)
                            ? 'border-pink-500 bg-pink-500 bg-opacity-10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={videoUploadData.selectedPlayers.includes(player.id)}
                          onChange={() => handlePlayerToggle(player.id)}
                          className="rounded border-gray-600 text-pink-600 focus:ring-pink-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-gray-400 text-sm">{player.position}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-400">
                    {videoUploadData.selectedPlayers.length} of {mockPlayers.length} players selected
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={() => {
                      setShowVideoUpload(false);
                      setVideoUploadData({
                        file: null,
                        fileName: '',
                        opponent: null,
                        date: '',
                        venue: '',
                        selectedPlayers: []
                      });
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVideoUploadSubmit}
                    disabled={!videoUploadData.file || !videoUploadData.opponent || !videoUploadData.date || !videoUploadData.venue || videoUploadData.selectedPlayers.length === 0}
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

      {/* Click outside to close dropdown */}
      {showClubDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowClubDropdown(false)}
        />
      )}
    </div>
  );
};

export default MatchesUpload;