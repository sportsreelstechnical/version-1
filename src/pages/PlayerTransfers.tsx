import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MessageCircle,
  Heart,
  Send,
  X,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Shield,
  Star,
  TrendingUp,
  Users,
  ArrowRightLeft,
  Target,
  Bookmark,
  Globe,
  Trophy,
  Activity,
  ChevronDown,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface TransferListing {
  id: string;
  playerId: string;
  playerName: string;
  playerPhoto: string;
  position: string;
  age: number;
  nationality: string;
  currentClub: string;
  currentClubLogo: string;
  league: string;
  marketValue: string;
  transferType: 'loan' | 'full' | 'free' | 'trial';
  askingPrice: string;
  loanDuration?: string;
  status: 'available' | 'negotiating' | 'transferred';
  listedDate: string;
  isNegotiable: boolean;
  releaseClause?: string;
  contractExpiry: string;
  description: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    rating: number;
  };
  isMyListing: boolean;
}

interface TransferHistory {
  id: string;
  playerName: string;
  playerPhoto: string;
  position: string;
  age: number;
  transferType: 'loan' | 'full' | 'free' | 'trial';
  fee: string;
  fromClub: string;
  toClub: string;
  date: string;
  status: 'successful' | 'failed' | 'cancelled';
  direction: 'incoming' | 'outgoing';
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

const mockTransferListings: TransferListing[] = [
  {
    id: '1',
    playerId: '1',
    playerName: 'Marcus Silva',
    playerPhoto: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Forward',
    age: 22,
    nationality: 'Brazil',
    currentClub: 'Santos FC',
    currentClubLogo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100',
    league: 'Brasileirão',
    marketValue: '€15M',
    transferType: 'full',
    askingPrice: '€18M',
    status: 'available',
    listedDate: '2024-05-20',
    isNegotiable: true,
    releaseClause: '€25M',
    contractExpiry: '2025-12-31',
    description: 'Promising young striker with excellent pace and finishing ability.',
    stats: {
      goals: 24,
      assists: 12,
      matches: 28,
      rating: 8.7
    },
    isMyListing: false
  },
  {
    id: '2',
    playerId: '2',
    playerName: 'Alessandro Rossi',
    playerPhoto: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Midfielder',
    age: 24,
    nationality: 'Italy',
    currentClub: 'Atalanta',
    currentClubLogo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
    league: 'Serie A',
    marketValue: '€22M',
    transferType: 'loan',
    askingPrice: '€2M',
    loanDuration: '1 year',
    status: 'available',
    listedDate: '2024-05-18',
    isNegotiable: true,
    contractExpiry: '2026-06-30',
    description: 'Creative midfielder with excellent passing range and vision.',
    stats: {
      goals: 11,
      assists: 18,
      matches: 32,
      rating: 8.4
    },
    isMyListing: false
  },
  {
    id: '3',
    playerId: '3',
    playerName: 'Kevin De Bruyne',
    playerPhoto: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Midfielder',
    age: 32,
    nationality: 'Belgium',
    currentClub: 'Manchester City FC',
    currentClubLogo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100',
    league: 'Premier League',
    marketValue: '€45M',
    transferType: 'full',
    askingPrice: '€50M',
    status: 'negotiating',
    listedDate: '2024-05-15',
    isNegotiable: false,
    contractExpiry: '2025-06-30',
    description: 'World-class midfielder with exceptional passing and leadership qualities.',
    stats: {
      goals: 8,
      assists: 22,
      matches: 20,
      rating: 9.1
    },
    isMyListing: true
  }
];

const mockTransferHistory: TransferHistory[] = [
  {
    id: '1',
    playerName: 'Erling Haaland',
    playerPhoto: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Forward',
    age: 23,
    transferType: 'full',
    fee: '€60M',
    fromClub: 'Borussia Dortmund',
    toClub: 'Manchester City FC',
    date: '2022-07-01',
    status: 'successful',
    direction: 'incoming'
  },
  {
    id: '2',
    playerName: 'Raheem Sterling',
    playerPhoto: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Forward',
    age: 29,
    transferType: 'full',
    fee: '€50M',
    fromClub: 'Manchester City FC',
    toClub: 'Chelsea FC',
    date: '2022-07-13',
    status: 'successful',
    direction: 'outgoing'
  },
  {
    id: '3',
    playerName: 'Joao Cancelo',
    playerPhoto: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=200',
    position: 'Defender',
    age: 30,
    transferType: 'loan',
    fee: '€5M',
    fromClub: 'Manchester City FC',
    toClub: 'Bayern Munich',
    date: '2023-01-31',
    status: 'successful',
    direction: 'outgoing'
  }
];

const PlayerTransfers: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    position: 'all',
    ageMin: '',
    ageMax: '',
    country: 'all',
    league: 'all',
    transferType: 'all',
    priceMin: '',
    priceMax: ''
  });
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Modal states
  const [showAddListing, setShowAddListing] = useState(false);
  const [showEditListing, setShowEditListing] = useState(false);
  const [showPlayerProfile, setShowPlayerProfile] = useState<TransferListing | null>(null);
  const [showTransferRequest, setShowTransferRequest] = useState<TransferListing | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [showMessageClub, setShowMessageClub] = useState<TransferListing | null>(null);
  
  // Data states
  const [transferListings, setTransferListings] = useState<TransferListing[]>(mockTransferListings);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>(mockTransferHistory);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedListing, setSelectedListing] = useState<TransferListing | null>(null);
  const [editingListing, setEditingListing] = useState<TransferListing | null>(null);
  
  // Form states
  const [listingForm, setListingForm] = useState({
    playerId: '',
    transferType: 'full' as 'loan' | 'full' | 'free' | 'trial',
    askingPrice: '',
    loanDuration: '',
    isNegotiable: true,
    description: ''
  });
  
  const [transferRequestForm, setTransferRequestForm] = useState({
    transferType: 'full' as 'loan' | 'full' | 'free' | 'trial',
    proposedFee: '',
    contractDuration: '',
    loanDuration: '',
    additionalNotes: ''
  });

  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });

  const [editListingData, setEditListingData] = useState({
    transferType: 'full' as 'loan' | 'full' | 'free' | 'trial',
    askingPrice: '',
    loanDuration: '',
    description: '',
    negotiable: true
  });

  // Mock players from current squad
  const mockSquadPlayers = [
    { id: '1', name: 'Lionel Messi', position: 'Forward', photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '2', name: 'Cristiano Ronaldo', position: 'Forward', photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '4', name: 'Virgil van Dijk', position: 'Defender', photo: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: '5', name: 'Kylian Mbappé', position: 'Forward', photo: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const filteredListings = transferListings.filter(listing => {
    if (activeTab === 'my-listings' && !listing.isMyListing) return false;
    if (activeTab === 'marketplace' && listing.isMyListing) return false;
    
    const matchesSearch = listing.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.currentClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = filters.position === 'all' || listing.position.toLowerCase() === filters.position.toLowerCase();
    const matchesAge = (!filters.ageMin || listing.age >= parseInt(filters.ageMin)) &&
                      (!filters.ageMax || listing.age <= parseInt(filters.ageMax));
    const matchesCountry = filters.country === 'all' || listing.nationality === filters.country;
    const matchesLeague = filters.league === 'all' || listing.league === filters.league;
    const matchesTransferType = filters.transferType === 'all' || listing.transferType === filters.transferType;
    
    return matchesSearch && matchesPosition && matchesAge && matchesCountry && matchesLeague && matchesTransferType;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
      case 'price-high':
        return parseFloat(b.askingPrice.replace(/[€M]/g, '')) - parseFloat(a.askingPrice.replace(/[€M]/g, ''));
      case 'price-low':
        return parseFloat(a.askingPrice.replace(/[€M]/g, '')) - parseFloat(b.askingPrice.replace(/[€M]/g, ''));
      case 'age-young':
        return a.age - b.age;
      case 'age-old':
        return b.age - a.age;
      case 'rating':
        return b.stats.rating - a.stats.rating;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600 text-white';
      case 'negotiating': return 'bg-yellow-600 text-white';
      case 'transferred': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTransferTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'bg-blue-600 text-white';
      case 'loan': return 'bg-purple-600 text-white';
      case 'free': return 'bg-green-600 text-white';
      case 'trial': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getHistoryStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-600 text-white';
      case 'failed': return 'bg-red-600 text-white';
      case 'cancelled': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const toggleWishlist = (listingId: string) => {
    setWishlist(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleAddListing = () => {
    if (!listingForm.playerId || !listingForm.askingPrice) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedPlayer = mockSquadPlayers.find(p => p.id === listingForm.playerId);
    if (!selectedPlayer) return;

    const newListing: TransferListing = {
      id: Date.now().toString(),
      playerId: listingForm.playerId,
      playerName: selectedPlayer.name,
      playerPhoto: selectedPlayer.photo,
      position: selectedPlayer.position,
      age: 25, // Mock age
      nationality: 'England', // Mock nationality
      currentClub: 'Manchester City FC',
      currentClubLogo: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100',
      league: 'Premier League',
      marketValue: listingForm.askingPrice,
      transferType: listingForm.transferType,
      askingPrice: listingForm.askingPrice,
      loanDuration: listingForm.loanDuration,
      status: 'available',
      listedDate: new Date().toISOString().split('T')[0],
      isNegotiable: listingForm.isNegotiable,
      contractExpiry: '2025-06-30',
      description: listingForm.description,
      stats: {
        goals: 15,
        assists: 8,
        matches: 25,
        rating: 8.2
      },
      isMyListing: true
    };

    setTransferListings([newListing, ...transferListings]);
    setListingForm({
      playerId: '',
      transferType: 'full',
      askingPrice: '',
      loanDuration: '',
      isNegotiable: true,
      description: ''
    });
    setShowAddListing(false);
    alert('Player listed for transfer successfully!');
  };

  const handleRemoveListing = (listingId: string) => {
    setTransferListings(prev => prev.filter(listing => listing.id !== listingId));
    setShowRemoveConfirm(null);
    alert('Player removed from transfer market');
  };

  const handleSendTransferRequest = () => {
    if (!showTransferRequest || !transferRequestForm.proposedFee) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Transfer request sent:', {
      player: showTransferRequest.playerName,
      club: showTransferRequest.currentClub,
      request: transferRequestForm
    });

    setTransferRequestForm({
      transferType: 'full',
      proposedFee: '',
      contractDuration: '',
      loanDuration: '',
      additionalNotes: ''
    });
    setShowTransferRequest(null);
    alert('Transfer request sent successfully!');
  };

  const handleSendMessage = () => {
    if (!showMessageClub || !messageForm.subject || !messageForm.message) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Message sent to club:', {
      club: showMessageClub.currentClub,
      subject: messageForm.subject,
      message: messageForm.message
    });

    setMessageForm({ subject: '', message: '' });
    setShowMessageClub(null);
    alert('Message sent to club successfully!');
  };

  const handleSaveEditListing = () => {
    if (!editingListing) return;

    const updatedListings = transferListings.map(listing => 
      listing.id === editingListing.id 
        ? {
            ...listing,
            transferType: editListingData.transferType,
            askingPrice: editListingData.askingPrice,
            loanDuration: editListingData.loanDuration,
            description: editListingData.description,
            isNegotiable: editListingData.negotiable
          }
        : listing
    );

    setTransferListings(updatedListings);
    setShowEditListing(false);
    setEditingListing(null);
    alert('Listing updated successfully!');
  };

  const tabs = [
    { id: 'my-listings', label: 'My Transfer Listings', icon: Building },
    { id: 'marketplace', label: 'Available Transfers', icon: Globe },
    { id: 'history', label: 'Transfer History', icon: Clock },
    { id: 'wishlist', label: 'Wishlist', icon: Heart }
  ];

  const TransferCard: React.FC<{ listing: TransferListing }> = ({ listing }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111112] rounded-xl p-6 hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={listing.playerPhoto}
            alt={listing.playerName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-white font-semibold text-lg">{listing.playerName}</h3>
            <p className="text-gray-400">{listing.position} • {listing.age} yrs</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(listing.status)}`}>
                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${getTransferTypeColor(listing.transferType)}`}>
                {listing.transferType === 'full' ? 'Full Transfer' : 
                 listing.transferType === 'loan' ? 'Loan' :
                 listing.transferType === 'free' ? 'Free Agent' : 'Trial'}
              </span>
            </div>
          </div>
        </div>
        {!listing.isMyListing && (
          <button
            onClick={() => toggleWishlist(listing.id)}
            className={`p-2 rounded-lg transition-colors ${
              wishlist.includes(listing.id)
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <Heart size={16} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>{listing.nationality}</span>
          </div>
          <div className="flex items-center space-x-1">
            <img src={listing.currentClubLogo} alt="" className="w-4 h-4 rounded-full" />
            <span>{listing.currentClub}</span>
          </div>
          <div>{listing.league}</div>
        </div>
        <p className="text-gray-300 text-sm">{listing.description}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{listing.stats.goals}</div>
          <div className="text-gray-400 text-xs">Goals</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{listing.stats.assists}</div>
          <div className="text-gray-400 text-xs">Assists</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{listing.stats.matches}</div>
          <div className="text-gray-400 text-xs">Matches</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{listing.stats.rating}</div>
          <div className="text-gray-400 text-xs">Rating</div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Market Value:</span>
          <span className="text-white font-semibold">{listing.marketValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Asking Price:</span>
          <span className="text-green-400 font-semibold">{listing.askingPrice}</span>
        </div>
        {listing.loanDuration && (
          <div className="flex justify-between">
            <span className="text-gray-400">Loan Duration:</span>
            <span className="text-white">{listing.loanDuration}</span>
          </div>
        )}
        {listing.isNegotiable && (
          <div className="text-blue-400 text-xs">💬 Negotiable</div>
        )}
      </div>

      <div className="flex space-x-2">
        {listing.isMyListing ? (
          <>
            <button 
              onClick={() => {
                setEditingListing(listing);
                setEditListingData({
                  transferType: listing.transferType,
                  askingPrice: listing.askingPrice,
                  loanDuration: listing.loanDuration || '',
                  description: listing.description,
                  negotiable: listing.isNegotiable
                });
                setShowEditListing(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button 
              onClick={() => setShowRemoveConfirm(listing.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setShowPlayerProfile(listing)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
            <button 
              onClick={() => setShowTransferRequest(listing)}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
            >
              <Send size={14} />
              <span>Request</span>
            </button>
            <button 
              onClick={() => setShowMessageClub(listing)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <MessageCircle size={14} />
            </button>
          </>
        )}
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
              <h1 className="text-3xl font-bold text-white">Player Transfers</h1>
              <p className="text-gray-400">Manage player transfers and explore the transfer market</p>
            </div>
            {activeTab === 'my-listings' && (
              <button
                onClick={() => setShowAddListing(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>List Player</span>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <ArrowRightLeft className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {transferListings.filter(l => l.isMyListing).length}
              </div>
              <div className="text-gray-400 text-sm">My Listings</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <Globe className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {transferListings.filter(l => !l.isMyListing && l.status === 'available').length}
              </div>
              <div className="text-gray-400 text-sm">Available Players</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <Heart className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{wishlist.length}</div>
              <div className="text-gray-400 text-sm">Wishlist</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {transferHistory.filter(h => h.status === 'successful').length}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#111112] rounded-xl p-6">
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden md:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          {(activeTab === 'my-listings' || activeTab === 'marketplace') && (
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search players by name, club, or nationality..."
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
                    <option value="recent">Most Recent</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="age-young">Age: Youngest First</option>
                    <option value="age-old">Age: Oldest First</option>
                    <option value="rating">Highest Rating</option>
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
                    value={filters.country}
                    onChange={(e) => setFilters({...filters, country: e.target.value})}
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
                    <option value="La Liga">La Liga</option>
                    <option value="Serie A">Serie A</option>
                    <option value="Bundesliga">Bundesliga</option>
                    <option value="Ligue 1">Ligue 1</option>
                  </select>

                  <select
                    value={filters.transferType}
                    onChange={(e) => setFilters({...filters, transferType: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">All Types</option>
                    <option value="full">Full Transfer</option>
                    <option value="loan">Loan</option>
                    <option value="free">Free Agent</option>
                    <option value="trial">Trial</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Max Price"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-[#111112] rounded-xl p-6">
            {/* My Transfer Listings */}
            {activeTab === 'my-listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    My Transfer Listings ({sortedListings.length})
                  </h2>
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedListings.map((listing) => (
                      <TransferCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-400 text-sm border-b border-gray-700">
                          <th className="text-left pb-4">Player</th>
                          <th className="text-left pb-4">Position</th>
                          <th className="text-left pb-4">Age</th>
                          <th className="text-left pb-4">Type</th>
                          <th className="text-left pb-4">Price</th>
                          <th className="text-left pb-4">Status</th>
                          <th className="text-left pb-4">Listed</th>
                          <th className="text-left pb-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedListings.map((listing) => (
                          <tr key={listing.id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={listing.playerPhoto}
                                  alt={listing.playerName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <div className="text-white font-medium">{listing.playerName}</div>
                                  <div className="text-gray-400 text-sm">{listing.nationality}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-gray-300">{listing.position}</td>
                            <td className="py-4 text-gray-300">{listing.age}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs ${getTransferTypeColor(listing.transferType)}`}>
                                {listing.transferType === 'full' ? 'Full' : 
                                 listing.transferType === 'loan' ? 'Loan' :
                                 listing.transferType === 'free' ? 'Free' : 'Trial'}
                              </span>
                            </td>
                            <td className="py-4 text-green-400 font-semibold">{listing.askingPrice}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(listing.status)}`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 text-gray-300">{new Date(listing.listedDate).toLocaleDateString()}</td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300">
                                  <Edit size={16} />
                                </button>
                                <button 
                                  onClick={() => setShowRemoveConfirm(listing.id)}
                                  className="text-red-400 hover:text-red-300"
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
                )}

                {sortedListings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No transfer listings</div>
                    <p className="text-gray-500">List your first player to start receiving transfer offers.</p>
                  </div>
                )}
              </div>
            )}

            {/* Available Transfers Marketplace */}
            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Transfer Marketplace ({sortedListings.length} players)
                  </h2>
                  {wishlist.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className="text-pink-400 hover:text-pink-300 text-sm"
                    >
                      View Wishlist ({wishlist.length})
                    </button>
                  )}
                </div>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedListings.map((listing) => (
                      <TransferCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-400 text-sm border-b border-gray-700">
                          <th className="text-left pb-4">Player</th>
                          <th className="text-left pb-4">Club</th>
                          <th className="text-left pb-4">Position</th>
                          <th className="text-left pb-4">Age</th>
                          <th className="text-left pb-4">Type</th>
                          <th className="text-left pb-4">Price</th>
                          <th className="text-left pb-4">Status</th>
                          <th className="text-left pb-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedListings.map((listing) => (
                          <tr key={listing.id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={listing.playerPhoto}
                                  alt={listing.playerName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <div className="text-white font-medium">{listing.playerName}</div>
                                  <div className="text-gray-400 text-sm">{listing.nationality}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <img src={listing.currentClubLogo} alt="" className="w-6 h-6 rounded-full" />
                                <span className="text-gray-300">{listing.currentClub}</span>
                              </div>
                            </td>
                            <td className="py-4 text-gray-300">{listing.position}</td>
                            <td className="py-4 text-gray-300">{listing.age}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs ${getTransferTypeColor(listing.transferType)}`}>
                                {listing.transferType === 'full' ? 'Full' : 
                                 listing.transferType === 'loan' ? 'Loan' :
                                 listing.transferType === 'free' ? 'Free' : 'Trial'}
                              </span>
                            </td>
                            <td className="py-4 text-green-400 font-semibold">{listing.askingPrice}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(listing.status)}`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setShowPlayerProfile(listing)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => setShowTransferRequest(listing)}
                                  className="text-pink-400 hover:text-pink-300"
                                >
                                  <Send size={16} />
                                </button>
                                <button
                                  onClick={() => setShowMessageClub(listing)}
                                  className="text-green-400 hover:text-green-300"
                                >
                                  <MessageCircle size={16} />
                                </button>
                                <button
                                  onClick={() => toggleWishlist(listing.id)}
                                  className={`${wishlist.includes(listing.id) ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'}`}
                                >
                                  <Heart size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {sortedListings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No players available</div>
                    <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Transfer History */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Transfer History</h2>
                
                <div className="space-y-4">
                  {transferHistory.map((transfer) => (
                    <div key={transfer.id} className="bg-gray-700 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={transfer.playerPhoto}
                            alt={transfer.playerName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{transfer.playerName}</h3>
                            <p className="text-gray-400">{transfer.position} • {transfer.age} yrs</p>
                          </div>
                          <div className={`px-3 py-1 rounded text-sm ${
                            transfer.direction === 'incoming' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {transfer.direction === 'incoming' ? '← Incoming' : '→ Outgoing'}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-green-400 font-semibold text-lg">{transfer.fee}</div>
                          <div className="text-gray-400 text-sm">{new Date(transfer.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>From: {transfer.fromClub}</span>
                          <ArrowRightLeft size={14} />
                          <span>To: {transfer.toClub}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getHistoryStatusColor(transfer.status)}`}>
                          {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {transferHistory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No transfer history</div>
                    <p className="text-gray-500">Your completed transfers will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">
                  Wishlist ({wishlist.length} players)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transferListings
                    .filter(listing => wishlist.includes(listing.id))
                    .map((listing) => (
                      <TransferCard key={listing.id} listing={listing} />
                    ))}
                </div>

                {wishlist.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No players in wishlist</div>
                    <p className="text-gray-500">Add players to your wishlist from the marketplace.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">List Player for Transfer</h2>
                <button
                  onClick={() => setShowAddListing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Select Player</label>
                  <select
                    value={listingForm.playerId}
                    onChange={(e) => setListingForm({...listingForm, playerId: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="">Choose a player</option>
                    {mockSquadPlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({player.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Transfer Type</label>
                  <select
                    value={listingForm.transferType}
                    onChange={(e) => setListingForm({...listingForm, transferType: e.target.value as any})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="full">Full Transfer</option>
                    <option value="loan">Loan</option>
                    <option value="free">Free Agent</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    {listingForm.transferType === 'loan' ? 'Loan Fee' : 'Asking Price'}
                  </label>
                  <input
                    type="text"
                    value={listingForm.askingPrice}
                    onChange={(e) => setListingForm({...listingForm, askingPrice: e.target.value})}
                    placeholder="e.g., €25M"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {listingForm.transferType === 'loan' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Loan Duration</label>
                    <select
                      value={listingForm.loanDuration}
                      onChange={(e) => setListingForm({...listingForm, loanDuration: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Select duration</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                      <option value="1.5 years">1.5 years</option>
                      <option value="2 years">2 years</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={listingForm.description}
                    onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                    rows={3}
                    placeholder="Describe the player's strengths and any special conditions..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="negotiable"
                    checked={listingForm.isNegotiable}
                    onChange={(e) => setListingForm({...listingForm, isNegotiable: e.target.checked})}
                    className="rounded border-gray-600 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="negotiable" className="text-gray-300 text-sm">
                    Price is negotiable
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddListing(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddListing}
                    disabled={!listingForm.playerId || !listingForm.askingPrice}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    List Player
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {showEditListing && editingListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Transfer Listing</h2>
                <button
                  onClick={() => setShowEditListing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Player Info */}
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={editingListing.playerPhoto}
                    alt={editingListing.playerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{editingListing.playerName}</h3>
                    <p className="text-gray-400 text-sm">{editingListing.position} • {editingListing.age} yrs</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Transfer Type</label>
                  <select
                    value={editListingData.transferType}
                    onChange={(e) => setEditListingData({...editListingData, transferType: e.target.value as any})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                  >
                    <option value="full">Full Transfer</option>
                    <option value="loan">Loan</option>
                    <option value="free">Free Agent</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    {editListingData.transferType === 'loan' ? 'Loan Fee' : 'Asking Price'}
                  </label>
                  <input
                    type="text"
                    value={editListingData.askingPrice}
                    onChange={(e) => setEditListingData({...editListingData, askingPrice: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                    placeholder="e.g., €25M or Free"
                  />
                </div>

                {editListingData.transferType === 'loan' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Loan Duration</label>
                    <select
                      value={editListingData.loanDuration}
                      onChange={(e) => setEditListingData({...editListingData, loanDuration: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
                    >
                      <option value="">Select Duration</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                      <option value="1.5 years">1.5 years</option>
                      <option value="2 years">2 years</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editListingData.description}
                    onChange={(e) => setEditListingData({...editListingData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                    placeholder="Additional details about the player or transfer terms..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editNegotiable"
                    checked={editListingData.negotiable}
                    onChange={(e) => setEditListingData({...editListingData, negotiable: e.target.checked})}
                    className="rounded border-gray-600 text-[#BE3C63] focus:ring-[#BE3C63]"
                  />
                  <label htmlFor="editNegotiable" className="text-gray-300 text-sm">
                    Price is negotiable
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowEditListing(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditListing}
                    className="flex-1 bg-[#BE3C63] hover:bg-[#331C22] text-white py-3 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
                    src={showPlayerProfile.playerPhoto}
                    alt={showPlayerProfile.playerName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-white">{showPlayerProfile.playerName}</h2>
                    <p className="text-gray-400 text-lg">{showPlayerProfile.position} • {showPlayerProfile.age} years old</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${getTransferTypeColor(showPlayerProfile.transferType)}`}>
                        {showPlayerProfile.transferType === 'full' ? 'Full Transfer' : 
                         showPlayerProfile.transferType === 'loan' ? 'Loan' :
                         showPlayerProfile.transferType === 'free' ? 'Free Agent' : 'Trial'}
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Player Stats */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Statistics</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{showPlayerProfile.stats.goals}</div>
                        <div className="text-gray-400 text-sm">Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{showPlayerProfile.stats.assists}</div>
                        <div className="text-gray-400 text-sm">Assists</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{showPlayerProfile.stats.matches}</div>
                        <div className="text-gray-400 text-sm">Matches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{showPlayerProfile.stats.rating}</div>
                        <div className="text-gray-400 text-sm">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Player Description */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Player Profile</h3>
                    <p className="text-gray-300">{showPlayerProfile.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Transfer Info */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Transfer Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Club:</span>
                        <span className="text-white">{showPlayerProfile.currentClub}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">League:</span>
                        <span className="text-white">{showPlayerProfile.league}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Market Value:</span>
                        <span className="text-white">{showPlayerProfile.marketValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Asking Price:</span>
                        <span className="text-green-400 font-semibold">{showPlayerProfile.askingPrice}</span>
                      </div>
                      {showPlayerProfile.loanDuration && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Loan Duration:</span>
                          <span className="text-white">{showPlayerProfile.loanDuration}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract Expires:</span>
                        <span className="text-white">{new Date(showPlayerProfile.contractExpiry).toLocaleDateString()}</span>
                      </div>
                      {showPlayerProfile.releaseClause && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Release Clause:</span>
                          <span className="text-yellow-400">{showPlayerProfile.releaseClause}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowPlayerProfile(null);
                          setShowTransferRequest(showPlayerProfile);
                        }}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send size={16} />
                        <span>Send Transfer Request</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(showPlayerProfile.id)}
                        className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                          wishlist.includes(showPlayerProfile.id)
                            ? 'bg-pink-600 hover:bg-pink-700 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                      >
                        <Heart size={16} />
                        <span>{wishlist.includes(showPlayerProfile.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPlayerProfile(null);
                          setShowMessageClub(showPlayerProfile);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <MessageCircle size={16} />
                        <span>Message Club</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transfer Request Modal */}
      {showTransferRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Send Transfer Request</h2>
                <button
                  onClick={() => setShowTransferRequest(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Player Info */}
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={showTransferRequest.playerPhoto}
                    alt={showTransferRequest.playerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{showTransferRequest.playerName}</h3>
                    <p className="text-gray-400 text-sm">{showTransferRequest.currentClub}</p>
                    <p className="text-green-400 text-sm">Asking: {showTransferRequest.askingPrice}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Transfer Type</label>
                  <select
                    value={transferRequestForm.transferType}
                    onChange={(e) => setTransferRequestForm({...transferRequestForm, transferType: e.target.value as any})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="full">Full Transfer</option>
                    <option value="loan">Loan</option>
                    <option value="free">Free Agent</option>
                    <option value="trial">Trial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Proposed {transferRequestForm.transferType === 'loan' ? 'Loan Fee' : 'Transfer Fee'}
                  </label>
                  <input
                    type="text"
                    value={transferRequestForm.proposedFee}
                    onChange={(e) => setTransferRequestForm({...transferRequestForm, proposedFee: e.target.value})}
                    placeholder="e.g., €20M"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                {transferRequestForm.transferType === 'full' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Contract Duration</label>
                    <select
                      value={transferRequestForm.contractDuration}
                      onChange={(e) => setTransferRequestForm({...transferRequestForm, contractDuration: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Select duration</option>
                      <option value="1 year">1 year</option>
                      <option value="2 years">2 years</option>
                      <option value="3 years">3 years</option>
                      <option value="4 years">4 years</option>
                      <option value="5 years">5 years</option>
                    </select>
                  </div>
                )}

                {transferRequestForm.transferType === 'loan' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Loan Duration</label>
                    <select
                      value={transferRequestForm.loanDuration}
                      onChange={(e) => setTransferRequestForm({...transferRequestForm, loanDuration: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="">Select duration</option>
                      <option value="6 months">6 months</option>
                      <option value="1 year">1 year</option>
                      <option value="1.5 years">1.5 years</option>
                      <option value="2 years">2 years</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={transferRequestForm.additionalNotes}
                    onChange={(e) => setTransferRequestForm({...transferRequestForm, additionalNotes: e.target.value})}
                    rows={3}
                    placeholder="Any additional terms or conditions..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowTransferRequest(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendTransferRequest}
                    disabled={!transferRequestForm.proposedFee}
                    className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message Club Modal */}
      {showMessageClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Message Club</h2>
                <button
                  onClick={() => setShowMessageClub(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Club Info */}
              <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={showMessageClub.currentClubLogo}
                    alt={showMessageClub.currentClub}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{showMessageClub.currentClub}</h3>
                    <p className="text-gray-400 text-sm">Regarding: {showMessageClub.playerName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                    placeholder="Transfer inquiry for [Player Name]"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                    rows={4}
                    placeholder="Write your message to the club..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowMessageClub(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageForm.subject || !messageForm.message}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#111112] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Remove from Transfer Market</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove this player from the transfer market? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveListing(showRemoveConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTransfers;