import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
  MapPin,
  Trophy,
  Activity,
  X,
  ChevronDown,
  Users,
  Key,
  FileText,
  Download,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';
import PlayerForm from '../components/PlayerForm';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  jerseyNumber: number;
  fifaId: string;
  status: 'active' | 'injured' | 'transferred' | 'retired';
  photo: string;
  addedDate: string;
  nationality: string;
  goals: number;
  assists: number;
  matches: number;
  dateOfBirth: string;
  placeOfBirth: string;
  preferredFoot: 'left' | 'right' | 'both';
  contractExpiry: string;
  previousClubs: string;
  medicalHistory: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Lionel Messi',
    position: 'Forward',
    age: 36,
    height: '5\'7"',
    weight: '159 lbs',
    jerseyNumber: 10,
    fifaId: 'SR-10089',
    status: 'active',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 20, 2024',
    nationality: 'Argentina',
    goals: 15,
    assists: 12,
    matches: 28,
    dateOfBirth: '1987-06-24',
    placeOfBirth: 'Rosario, Argentina',
    preferredFoot: 'left',
    contractExpiry: '2025-06-30',
    previousClubs: 'FC Barcelona, Paris Saint-Germain',
    medicalHistory: 'No significant injuries',
    emergencyContact: 'Antonela Roccuzzo',
    emergencyPhone: '+54 11 1234-5678'
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    age: 39,
    height: '6\'2"',
    weight: '183 lbs',
    jerseyNumber: 7,
    fifaId: 'SR-10088',
    status: 'active',
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 19, 2024',
    nationality: 'Portugal',
    goals: 18,
    assists: 8,
    matches: 25,
    dateOfBirth: '1985-02-05',
    placeOfBirth: 'Funchal, Portugal',
    preferredFoot: 'right',
    contractExpiry: '2025-12-31',
    previousClubs: 'Sporting CP, Manchester United, Real Madrid, Juventus',
    medicalHistory: 'Minor knee surgery in 2020',
    emergencyContact: 'Georgina Rodriguez',
    emergencyPhone: '+351 91 234-5678'
  },
  {
    id: '3',
    name: 'Kevin De Bruyne',
    position: 'Midfielder',
    age: 32,
    height: '5\'11"',
    weight: '154 lbs',
    jerseyNumber: 17,
    fifaId: 'SR-10087',
    status: 'injured',
    photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 18, 2024',
    nationality: 'Belgium',
    goals: 8,
    assists: 22,
    matches: 20,
    dateOfBirth: '1991-06-28',
    placeOfBirth: 'Drongen, Belgium',
    preferredFoot: 'right',
    contractExpiry: '2025-06-30',
    previousClubs: 'Genk, Chelsea, VfL Wolfsburg',
    medicalHistory: 'Hamstring injury - recovering',
    emergencyContact: 'Michele Lacroix',
    emergencyPhone: '+32 2 123-4567'
  },
  {
    id: '4',
    name: 'Virgil van Dijk',
    position: 'Defender',
    age: 32,
    height: '6\'4"',
    weight: '203 lbs',
    jerseyNumber: 4,
    fifaId: 'SR-10086',
    status: 'active',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 16, 2024',
    nationality: 'Netherlands',
    goals: 3,
    assists: 2,
    matches: 30,
    dateOfBirth: '1991-07-08',
    placeOfBirth: 'Breda, Netherlands',
    preferredFoot: 'right',
    contractExpiry: '2025-06-30',
    previousClubs: 'Willem II, Groningen, Celtic, Southampton',
    medicalHistory: 'ACL injury in 2020 - fully recovered',
    emergencyContact: 'Rike Nooitgedagt',
    emergencyPhone: '+31 6 1234-5678'
  },
  {
    id: '5',
    name: 'Kylian Mbappé',
    position: 'Forward',
    age: 25,
    height: '5\'10"',
    weight: '161 lbs',
    jerseyNumber: 9,
    fifaId: 'SR-10085',
    status: 'active',
    photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 15, 2024',
    nationality: 'France',
    goals: 22,
    assists: 10,
    matches: 32,
    dateOfBirth: '1998-12-20',
    placeOfBirth: 'Paris, France',
    preferredFoot: 'right',
    contractExpiry: '2026-06-30',
    previousClubs: 'AS Monaco',
    medicalHistory: 'No significant injuries',
    emergencyContact: 'Fayza Lamari',
    emergencyPhone: '+33 1 23 45 67 89'
  },
  {
    id: '6',
    name: 'Erling Haaland',
    position: 'Forward',
    age: 23,
    height: '6\'4"',
    weight: '194 lbs',
    jerseyNumber: 9,
    fifaId: 'SR-10084',
    status: 'active',
    photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    addedDate: 'May 14, 2024',
    nationality: 'Norway',
    goals: 28,
    assists: 5,
    matches: 30,
    dateOfBirth: '2000-07-21',
    placeOfBirth: 'Leeds, England',
    preferredFoot: 'left',
    contractExpiry: '2027-06-30',
    previousClubs: 'Bryne FK, Molde FK, Red Bull Salzburg, Borussia Dortmund',
    medicalHistory: 'No significant injuries',
    emergencyContact: 'Gry Marita Braut',
    emergencyPhone: '+47 123 45 678'
  }
];

const PlayerManagement: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPlayerProfile, setShowPlayerProfile] = useState<Player | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferClubSearch, setTransferClubSearch] = useState('');
  const [selectedTransferClub, setSelectedTransferClub] = useState<any>(null);
  const [showTransferClubDropdown, setShowTransferClubDropdown] = useState(false);

  // Mock clubs for transfer
  const mockTransferClubs = [
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

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.fifaId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === 'all' || player.position.toLowerCase() === selectedPosition.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || player.status === selectedStatus;
    
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const handleAddPlayer = () => {
    setSelectedPlayer(null);
    setFormMode('add');
    setShowPlayerForm(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setFormMode('edit');
    setShowPlayerForm(true);
    setActiveDropdown(null);
  };

  const handleViewPlayer = (player: Player) => {
    setShowPlayerProfile(player);
    setActiveDropdown(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
    setShowDeleteConfirm(null);
  };

  const handlePlayerSubmit = (playerData: Partial<Player>) => {
    if (formMode === 'add') {
      setPlayers([...players, playerData as Player]);
    } else if (selectedPlayer) {
      setPlayers(players.map(p =>
        p.id === selectedPlayer.id ? { ...p, ...playerData } : p
      ));
    }
    setShowPlayerForm(false);
    setSelectedPlayer(null);
  };

  const handleResetPlayerCredentials = (player: Player) => {
    if (!confirm(`Reset login credentials for ${player.name}?\n\nThis will generate a new password and the player will need to use the new credentials to log in.`)) {
      return;
    }

    const tempPassword = 'SR-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const username = player.fifaId;

    alert(
      `Login credentials reset successfully!\n\n` +
      `Player: ${player.name}\n` +
      `Username: ${username}\n` +
      `Temporary Password: ${tempPassword}\n\n` +
      `Please share these credentials securely with the player.\n` +
      `The player will be required to change the password on first login.`
    );
  };

  const handleExportScoutReportPDF = (player: Player) => {
    const reportContent = generateScoutReportText(player);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scout-report-${player.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Scout report exported successfully!');
  };

  const handleExportScoutReportExcel = (player: Player) => {
    const reportData = generateScoutReportCSV(player);
    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scout-report-${player.name.replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('Scout report exported as CSV successfully!');
  };

  const generateScoutReportText = (player: Player): string => {
    return `
==============================================
SCOUT REPORT - ${player.name.toUpperCase()}
==============================================

PERSONAL INFORMATION
--------------------
Full Name: ${player.name}
FIFA ID: ${player.fifaId}
Position: ${player.position}
Jersey Number: ${player.jerseyNumber}
Date of Birth: ${new Date(player.dateOfBirth).toLocaleDateString()}
Age: ${player.age} years
Nationality: ${player.nationality}
Place of Birth: ${player.placeOfBirth}

PHYSICAL ATTRIBUTES
-------------------
Height: ${player.height}
Weight: ${player.weight}
Preferred Foot: ${player.preferredFoot}

PERFORMANCE STATISTICS
----------------------
Goals: ${player.goals}
Assists: ${player.assists}
Matches Played: ${player.matches}
Goals per Match: ${(player.goals / player.matches).toFixed(2)}
Assists per Match: ${(player.assists / player.matches).toFixed(2)}

CONTRACT INFORMATION
--------------------
Contract Expires: ${new Date(player.contractExpiry).toLocaleDateString()}
Current Status: ${player.status}
Previous Clubs: ${player.previousClubs}

SCOUTING ASSESSMENT
-------------------
Overall Rating: ⭐⭐⭐⭐ (4/5)

Technical Skills:
• Strong ball control and dribbling ability
• Excellent passing accuracy
• Good finishing in the penalty area
• Solid aerial ability

Tactical Awareness:
• Understands positioning well
• Makes intelligent runs off the ball
• Good defensive contribution when required
• Adaptable to different formations

Physical Attributes:
• Good pace and acceleration
• Strong stamina and endurance
• Adequate strength for position
• Injury record: ${player.medicalHistory}

Mental Attributes:
• Strong leadership qualities
• Excellent work ethic
• Good decision-making under pressure
• Team-oriented attitude

RECOMMENDATION
--------------
Status: ${player.status === 'active' ? 'Available for transfer' : 'Currently ' + player.status}
Potential: High
Estimated Value: Market dependent
Suitability: Excellent addition to squad

ADDITIONAL NOTES
----------------
${player.name} demonstrates consistent performance levels and would be a valuable asset to any competitive squad. Strong technical foundation combined with good tactical awareness.

Report Generated: ${new Date().toLocaleDateString()}
==============================================
    `.trim();
  };

  const generateScoutReportCSV = (player: Player): string => {
    return `Scout Report - ${player.name}

Category,Attribute,Value
Personal Information,Full Name,${player.name}
Personal Information,FIFA ID,${player.fifaId}
Personal Information,Position,${player.position}
Personal Information,Jersey Number,${player.jerseyNumber}
Personal Information,Age,${player.age}
Personal Information,Nationality,${player.nationality}
Personal Information,Date of Birth,${new Date(player.dateOfBirth).toLocaleDateString()}
Personal Information,Place of Birth,${player.placeOfBirth}

Physical Attributes,Height,${player.height}
Physical Attributes,Weight,${player.weight}
Physical Attributes,Preferred Foot,${player.preferredFoot}

Performance Statistics,Goals,${player.goals}
Performance Statistics,Assists,${player.assists}
Performance Statistics,Matches,${player.matches}
Performance Statistics,Goals per Match,${(player.goals / player.matches).toFixed(2)}
Performance Statistics,Assists per Match,${(player.assists / player.matches).toFixed(2)}

Contract Information,Contract Expires,${new Date(player.contractExpiry).toLocaleDateString()}
Contract Information,Status,${player.status}
Contract Information,Previous Clubs,${player.previousClubs}

Medical,Medical History,${player.medicalHistory}

Emergency Contact,Contact Name,${player.emergencyContact}
Emergency Contact,Contact Phone,${player.emergencyPhone}

Assessment,Overall Rating,4/5
Assessment,Technical Skills,Strong
Assessment,Tactical Awareness,Good
Assessment,Physical Attributes,Good
Assessment,Mental Attributes,Strong
Assessment,Recommendation,Excellent addition to squad

Report Generated,Date,${new Date().toLocaleDateString()}
    `.trim();
  };

  const handleTransferPlayer = () => {
    if (!showPlayerProfile || !selectedTransferClub) return;
    
    // Update player status to transferred
    setPlayers(players.map(p => 
      p.id === showPlayerProfile.id 
        ? { ...p, status: 'transferred' as const }
        : p
    ));
    
    // Reset transfer modal state
    setShowTransferModal(false);
    setTransferClubSearch('');
    setSelectedTransferClub(null);
    setShowPlayerProfile(null);
    
    alert(`${showPlayerProfile.name} has been transferred to ${selectedTransferClub.name}!`);
  };

  const handleTransferClubSelect = (club: any) => {
    setSelectedTransferClub(club);
    setTransferClubSearch(club.name);
    setShowTransferClubDropdown(false);
  };

  const filteredTransferClubs = mockTransferClubs.filter(club =>
    club.name.toLowerCase().includes(transferClubSearch.toLowerCase()) ||
    club.league.toLowerCase().includes(transferClubSearch.toLowerCase()) ||
    club.country.toLowerCase().includes(transferClubSearch.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'injured': return 'bg-yellow-600 text-white';
      case 'transferred': return 'bg-blue-600 text-white';
      case 'retired': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const ActionDropdown: React.FC<{ player: Player }> = ({ player }) => (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(activeDropdown === player.id ? null : player.id)}
        className="text-gray-400 hover:text-white p-1"
      >
        <MoreVertical size={16} />
      </button>
      
      {activeDropdown === player.id && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50">
          <div className="py-2">
            <button
              onClick={() => handleViewPlayer(player)}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Eye size={16} />
              <span>View Profile</span>
            </button>
            <button
              onClick={() => handleEditPlayer(player)}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit Player</span>
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(player.id);
                setActiveDropdown(null);
              }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-red-400 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete Player</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111112] rounded-xl p-6 hover:bg-gray-700 transition-colors"
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
            <p className="text-gray-400">{player.position} • #{player.jerseyNumber}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(player.status)}`}>
                {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
              </span>
              <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">
                {player.fifaId}
              </span>
            </div>
          </div>
        </div>
        <ActionDropdown player={player} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.goals}</div>
          <div className="text-gray-400 text-sm">Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.assists}</div>
          <div className="text-gray-400 text-sm">Assists</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{player.matches}</div>
          <div className="text-gray-400 text-sm">Matches</div>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <div className="flex justify-between">
          <span>Age:</span>
          <span className="text-white">{player.age} years</span>
        </div>
        <div className="flex justify-between">
          <span>Height:</span>
          <span className="text-white">{player.height}</span>
        </div>
        <div className="flex justify-between">
          <span>Nationality:</span>
          <span className="text-white">{player.nationality}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => handleViewPlayer(player)}
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Profile
        </button>
        <button 
          onClick={() => handleEditPlayer(player)}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => setShowDeleteConfirm(player.id)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 size={16} />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Player Management</h1>
              <p className="text-gray-400">Manage your team roster and player information</p>
            </div>
            <button
              onClick={handleAddPlayer}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Player</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <User className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{players.length}</div>
              <div className="text-gray-400 text-sm">Total Players</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Activity className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {players.filter(p => p.status === 'active').length}
              </div>
              <div className="text-gray-400 text-sm">Active Players</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {players.reduce((sum, p) => sum + p.goals, 0)}
              </div>
              <div className="text-gray-400 text-sm">Total Goals</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <MapPin className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {new Set(players.map(p => p.nationality)).size}
              </div>
              <div className="text-gray-400 text-sm">Nationalities</div>
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
                    placeholder="Search players by name or FIFA ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
              
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
              >
                <option value="all">All Positions</option>
                <option value="forward">Forward</option>
                <option value="midfielder">Midfielder</option>
                <option value="defender">Defender</option>
                <option value="goalkeeper">Goalkeeper</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="injured">Injured</option>
                <option value="transferred">Transferred</option>
                <option value="retired">Retired</option>
              </select>

              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Players Grid/Table */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="bg-[#111112] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#111112]">
                    <tr className="text-gray-400 text-sm">
                      <th className="text-left p-4">Player</th>
                      <th className="text-left p-4">Position</th>
                      <th className="text-left p-4">Age</th>
                      <th className="text-left p-4">FIFA ID</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Goals</th>
                      <th className="text-left p-4">Assists</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr key={player.id} className="border-t border-gray-700 hover:bg-gray-700">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={player.photo}
                              alt={player.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-white font-medium">{player.name}</div>
                              <div className="text-gray-400 text-sm">#{player.jerseyNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{player.position}</td>
                        <td className="p-4 text-gray-300">{player.age}</td>
                        <td className="p-4">
                          <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs">
                            {player.fifaId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(player.status)}`}>
                            {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-white font-semibold">{player.goals}</td>
                        <td className="p-4 text-white font-semibold">{player.assists}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewPlayer(player)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditPlayer(player)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => setShowDeleteConfirm(player.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No players found</div>
              <p className="text-gray-500">Try adjusting your search criteria or add new players to your roster.</p>
            </div>
          )}
        </div>
      </div>

      {/* Player Form Modal */}
      <PlayerForm
        isOpen={showPlayerForm}
        onClose={() => setShowPlayerForm(false)}
        onSubmit={handlePlayerSubmit}
        player={selectedPlayer}
        mode={formMode}
      />

      {/* Player Profile Modal */}
      {showPlayerProfile && (
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
                    src={showPlayerProfile.photo}
                    alt={showPlayerProfile.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-white">{showPlayerProfile.name}</h2>
                    <p className="text-gray-400 text-lg">{showPlayerProfile.position} • #{showPlayerProfile.jerseyNumber}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="bg-pink-600 text-white px-3 py-1 rounded">
                        {showPlayerProfile.fifaId}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(showPlayerProfile.status)}`}>
                        {showPlayerProfile.status.charAt(0).toUpperCase() + showPlayerProfile.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowPlayerProfile(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white">{showPlayerProfile.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date of Birth:</span>
                      <span className="text-white">{new Date(showPlayerProfile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Place of Birth:</span>
                      <span className="text-white">{showPlayerProfile.placeOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nationality:</span>
                      <span className="text-white">{showPlayerProfile.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Height:</span>
                      <span className="text-white">{showPlayerProfile.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weight:</span>
                      <span className="text-white">{showPlayerProfile.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Preferred Foot:</span>
                      <span className="text-white capitalize">{showPlayerProfile.preferredFoot}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance Statistics</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{showPlayerProfile.goals}</div>
                      <div className="text-gray-400 text-sm">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{showPlayerProfile.assists}</div>
                      <div className="text-gray-400 text-sm">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{showPlayerProfile.matches}</div>
                      <div className="text-gray-400 text-sm">Matches</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Goals per Match:</span>
                      <span className="text-white">{(showPlayerProfile.goals / showPlayerProfile.matches).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Assists per Match:</span>
                      <span className="text-white">{(showPlayerProfile.assists / showPlayerProfile.matches).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Contract Information */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contract Expires:</span>
                      <span className="text-white">{new Date(showPlayerProfile.contractExpiry).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Added to Club:</span>
                      <span className="text-white">{showPlayerProfile.addedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Previous Clubs:</span>
                      <p className="text-white mt-1">{showPlayerProfile.previousClubs}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contact Name:</span>
                      <span className="text-white">{showPlayerProfile.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone Number:</span>
                      <span className="text-white">{showPlayerProfile.emergencyPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="lg:col-span-2 bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Medical History</h3>
                  <p className="text-gray-300">{showPlayerProfile.medicalHistory}</p>
                </div>

                {/* Scout Report */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg border-2 border-blue-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="text-blue-300" size={24} />
                      <h3 className="text-lg font-semibold text-white">Scout Report</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExportScoutReportPDF(showPlayerProfile)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        title="Export as Text/PDF"
                      >
                        <Download size={16} />
                        <span>Text</span>
                      </button>
                      <button
                        onClick={() => handleExportScoutReportExcel(showPlayerProfile)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        title="Export as CSV/Excel"
                      >
                        <Download size={16} />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-950 bg-opacity-50 p-4 rounded-lg">
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center space-x-2">
                        <Star size={16} />
                        <span>Overall Rating</span>
                      </h4>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            className={star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}
                          />
                        ))}
                        <span className="ml-2 text-white font-semibold">4.0 / 5.0</span>
                      </div>
                    </div>

                    <div className="bg-blue-950 bg-opacity-50 p-4 rounded-lg">
                      <h4 className="text-blue-300 font-semibold mb-3">Performance Metrics</h4>
                      <div className="space-y-1 text-sm text-white">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Goals/Match:</span>
                          <span className="font-semibold">{(showPlayerProfile.goals / showPlayerProfile.matches).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Assists/Match:</span>
                          <span className="font-semibold">{(showPlayerProfile.assists / showPlayerProfile.matches).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Match Fitness:</span>
                          <span className="font-semibold">{showPlayerProfile.status === 'active' ? 'Excellent' : showPlayerProfile.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2">Technical Skills</h4>
                      <ul className="space-y-1 text-sm text-white">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Strong ball control and dribbling ability</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Excellent passing accuracy</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Good finishing in the penalty area</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Solid aerial ability</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2">Tactical Awareness</h4>
                      <ul className="space-y-1 text-sm text-white">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Understands positioning well</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Makes intelligent runs off the ball</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Good defensive contribution when required</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Adaptable to different formations</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2">Physical Attributes</h4>
                      <ul className="space-y-1 text-sm text-white">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Good pace and acceleration</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Strong stamina and endurance</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Adequate strength for position</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-blue-300 font-semibold mb-2">Mental Attributes</h4>
                      <ul className="space-y-1 text-sm text-white">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Strong leadership qualities</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Excellent work ethic</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>Good decision-making under pressure</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-950 bg-opacity-50 p-4 rounded-lg">
                    <h4 className="text-blue-300 font-semibold mb-2">Scout Recommendation</h4>
                    <p className="text-white text-sm">
                      {showPlayerProfile.name} demonstrates consistent performance levels and would be a valuable asset to any competitive squad.
                      Strong technical foundation combined with good tactical awareness makes this player an excellent addition.
                      {showPlayerProfile.status === 'active' ? ' Currently available and match-fit.' : ` Current status: ${showPlayerProfile.status}.`}
                    </p>
                  </div>

                  <div className="mt-3 text-xs text-blue-300 text-right">
                    Report generated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleResetPlayerCredentials(showPlayerProfile)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  title="Reset player login credentials"
                >
                  <Key size={16} />
                  <span>Reset Login</span>
                </button>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowPlayerProfile(null);
                      handleEditPlayer(showPlayerProfile);
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Edit Player</span>
                  </button>
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Users size={16} />
                    <span>Transfer</span>
                  </button>
                  <button
                    onClick={() => setShowPlayerProfile(null)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transfer Player Modal */}
      {showTransferModal && showPlayerProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Transfer Player</h2>
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setTransferClubSearch('');
                    setSelectedTransferClub(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Player Info */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={showPlayerProfile.photo}
                      alt={showPlayerProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{showPlayerProfile.name}</h3>
                      <p className="text-gray-400 text-sm">{showPlayerProfile.position} • #{showPlayerProfile.jerseyNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Club Search */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Transfer to Club</label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={transferClubSearch}
                        onChange={(e) => {
                          setTransferClubSearch(e.target.value);
                          setShowTransferClubDropdown(true);
                          if (!e.target.value) setSelectedTransferClub(null);
                        }}
                        onFocus={() => setShowTransferClubDropdown(true)}
                        placeholder="Search for destination club..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    {showTransferClubDropdown && transferClubSearch && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredTransferClubs.map((club) => (
                          <button
                            key={club.id}
                            onClick={() => handleTransferClubSelect(club)}
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
                        {filteredTransferClubs.length === 0 && (
                          <div className="p-3 text-gray-400 text-sm">No clubs found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedTransferClub && (
                    <div className="mt-3 p-3 bg-gray-700 rounded-lg flex items-center space-x-3">
                      <img
                        src={selectedTransferClub.logo}
                        alt={selectedTransferClub.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-white font-medium">{selectedTransferClub.name}</div>
                        <div className="text-gray-400 text-sm">{selectedTransferClub.league} • {selectedTransferClub.country}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transfer Warning */}
                <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ This action will mark the player as transferred and remove them from your active roster.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferClubSearch('');
                      setSelectedTransferClub(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferPlayer}
                    disabled={!selectedTransferClub}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111112] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Player</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this player? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlayer(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveDropdown(null)}
        />
      )}

      {/* Click outside to close transfer club dropdown */}
      {showTransferClubDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTransferClubDropdown(false)}
        />
      )}
    </div>
  );
};

export default PlayerManagement;