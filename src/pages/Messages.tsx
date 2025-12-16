import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
  Archive,
  Trash2,
  Filter,
  Users,
  Building,
  Clock,
  Check,
  CheckCheck,
  Circle,
  User,
  Shield,
  Trophy,
  Target,
  DollarSign,
  Calendar,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'club' | 'scout';
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'offer' | 'player_inquiry' | 'transfer_proposal';
  attachments?: Array<{
    type: 'image' | 'document' | 'video';
    url: string;
    name: string;
  }>;
  metadata?: {
    playerId?: string;
    playerName?: string;
    offerAmount?: string;
    transferType?: 'loan' | 'permanent';
  };
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'club' | 'scout';
  participantAvatar: string;
  participantClub?: string;
  lastMessage: Message;
  unreadCount: number;
  isStarred: boolean;
  isArchived: boolean;
  category: 'club' | 'scout';
  tags: string[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'scout1',
    participantName: 'John Smith',
    participantRole: 'scout',
    participantAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
    participantClub: 'FIFA Licensed Scout',
    lastMessage: {
      id: 'msg1',
      senderId: 'scout1',
      senderName: 'John Smith',
      senderRole: 'scout',
      senderAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'I\'m very interested in Lionel Messi. Could we discuss a potential transfer?',
      timestamp: '2024-05-21T10:30:00Z',
      read: false,
      type: 'player_inquiry',
      metadata: {
        playerId: '1',
        playerName: 'Lionel Messi'
      }
    },
    unreadCount: 3,
    isStarred: true,
    isArchived: false,
    category: 'scout',
    tags: ['High Priority', 'Transfer Interest']
  },
  {
    id: '2',
    participantId: 'club1',
    participantName: 'Real Madrid CF',
    participantRole: 'club',
    participantAvatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
    participantClub: 'Real Madrid CF',
    lastMessage: {
      id: 'msg2',
      senderId: 'club1',
      senderName: 'Real Madrid CF',
      senderRole: 'club',
      senderAvatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'We would like to make an offer for Kevin De Bruyne. €80M permanent transfer.',
      timestamp: '2024-05-21T09:15:00Z',
      read: false,
      type: 'offer',
      metadata: {
        playerId: '3',
        playerName: 'Kevin De Bruyne',
        offerAmount: '€80M',
        transferType: 'permanent'
      }
    },
    unreadCount: 1,
    isStarred: false,
    isArchived: false,
    category: 'club',
    tags: ['Transfer Offer', 'High Value']
  },
  {
    id: '3',
    participantId: 'scout2',
    participantName: 'Maria Rodriguez',
    participantRole: 'scout',
    participantAvatar: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100',
    participantClub: 'Barcelona Scout',
    lastMessage: {
      id: 'msg3',
      senderId: 'scout2',
      senderName: 'Maria Rodriguez',
      senderRole: 'scout',
      senderAvatar: 'https://images.pexels.com/photos/3651577/pexels-photo-3651577.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'Thank you for the player information. We\'ll be in touch soon.',
      timestamp: '2024-05-20T16:45:00Z',
      read: true,
      type: 'text'
    },
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
    category: 'scout',
    tags: ['Follow Up']
  },
  {
    id: '4',
    participantId: 'club2',
    participantName: 'AC Milan',
    participantRole: 'club',
    participantAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
    participantClub: 'AC Milan',
    lastMessage: {
      id: 'msg4',
      senderId: 'club2',
      senderName: 'AC Milan',
      senderRole: 'club',
      senderAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'We are interested in a loan deal for Cristiano Ronaldo for the upcoming season.',
      timestamp: '2024-05-20T14:20:00Z',
      read: true,
      type: 'transfer_proposal',
      metadata: {
        playerId: '2',
        playerName: 'Cristiano Ronaldo',
        transferType: 'loan'
      }
    },
    unreadCount: 0,
    isStarred: true,
    isArchived: false,
    category: 'club',
    tags: ['Loan Interest']
  }
];

const mockMessages: { [conversationId: string]: Message[] } = {
  '1': [
    {
      id: 'msg1-1',
      senderId: 'scout1',
      senderName: 'John Smith',
      senderRole: 'scout',
      senderAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'Hello! I\'ve been following your club and I\'m particularly impressed with Lionel Messi\'s performance this season.',
      timestamp: '2024-05-21T10:00:00Z',
      read: true,
      type: 'text'
    },
    {
      id: 'msg1-2',
      senderId: 'current_user',
      senderName: 'You',
      senderRole: 'club',
      senderAvatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'Thank you for your interest. Messi has been exceptional for us. What kind of opportunity are you looking at?',
      timestamp: '2024-05-21T10:15:00Z',
      read: true,
      type: 'text'
    },
    {
      id: 'msg1-3',
      senderId: 'scout1',
      senderName: 'John Smith',
      senderRole: 'scout',
      senderAvatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'I\'m very interested in Lionel Messi. Could we discuss a potential transfer?',
      timestamp: '2024-05-21T10:30:00Z',
      read: false,
      type: 'player_inquiry',
      metadata: {
        playerId: '1',
        playerName: 'Lionel Messi'
      }
    }
  ],
  '2': [
    {
      id: 'msg2-1',
      senderId: 'club1',
      senderName: 'Real Madrid CF',
      senderRole: 'club',
      senderAvatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: 'We would like to make an offer for Kevin De Bruyne. €80M permanent transfer.',
      timestamp: '2024-05-21T09:15:00Z',
      read: false,
      type: 'offer',
      metadata: {
        playerId: '3',
        playerName: 'Kevin De Bruyne',
        offerAmount: '€80M',
        transferType: 'permanent'
      }
    }
  ]
};

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'club' | 'scout'>('all');
  const [showConversationInfo, setShowConversationInfo] = useState(false);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || conv.category === activeCategory;
    return matchesSearch && matchesCategory && !conv.isArchived;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You',
      senderRole: user?.role || 'club',
      senderAvatar: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), message]
    }));

    // Update last message in conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message }
          : conv
      )
    );

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleStar = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, isStarred: !conv.isStarred } : conv
      )
    );
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'offer': return <DollarSign size={16} className="text-green-400" />;
      case 'player_inquiry': return <User size={16} className="text-blue-400" />;
      case 'transfer_proposal': return <Trophy size={16} className="text-purple-400" />;
      default: return null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const ConversationItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
        selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
      }`}
      onClick={() => {
        setSelectedConversation(conversation);
        markAsRead(conversation.id);
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <img
            src={conversation.participantAvatar}
            alt={conversation.participantName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
            conversation.participantRole === 'club' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {conversation.participantRole === 'club' ? (
              <Building size={8} className="text-white m-0.5" />
            ) : (
              <Shield size={8} className="text-white m-0.5" />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium truncate">{conversation.participantName}</h3>
              {conversation.isStarred && <Star size={14} className="text-yellow-400" />}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-xs">{formatTime(conversation.lastMessage.timestamp)}</span>
              {conversation.unreadCount > 0 && (
                <div className="bg-[#BE3C63] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm truncate">{conversation.participantClub}</p>
          
          <div className="flex items-center space-x-2 mt-2">
            {getMessageTypeIcon(conversation.lastMessage.type)}
            <p className="text-gray-300 text-sm truncate flex-1">{conversation.lastMessage.content}</p>
          </div>
          
          {conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {conversation.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-gray-400 text-xs">{message.senderName}</span>
          </div>
        )}
        
        <div className={`rounded-lg p-3 ${
          isOwn 
            ? 'bg-[#BE3C63] text-white' 
            : message.type === 'offer' || message.type === 'player_inquiry' || message.type === 'transfer_proposal'
              ? 'bg-gray-600 border border-gray-500'
              : 'bg-gray-700 text-white'
        }`}>
          {(message.type === 'offer' || message.type === 'player_inquiry' || message.type === 'transfer_proposal') && (
            <div className="mb-2 p-2 bg-gray-800 rounded border-l-4 border-[#BE3C63]">
              <div className="flex items-center space-x-2 mb-1">
                {getMessageTypeIcon(message.type)}
                <span className="text-white font-medium text-sm">
                  {message.type === 'offer' ? 'Transfer Offer' :
                   message.type === 'player_inquiry' ? 'Player Inquiry' :
                   'Transfer Proposal'}
                </span>
              </div>
              {message.metadata && (
                <div className="text-gray-300 text-sm space-y-1">
                  {message.metadata.playerName && (
                    <div>Player: <span className="text-white">{message.metadata.playerName}</span></div>
                  )}
                  {message.metadata.offerAmount && (
                    <div>Amount: <span className="text-green-400">{message.metadata.offerAmount}</span></div>
                  )}
                  {message.metadata.transferType && (
                    <div>Type: <span className="text-blue-400 capitalize">{message.metadata.transferType}</span></div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <p className="text-sm">{message.content}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
            {isOwn && (
              <div className="flex items-center space-x-1">
                {message.read ? (
                  <CheckCheck size={14} className="text-blue-400" />
                ) : (
                  <Check size={14} className="text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex">
        {/* Conversations List */}
        <div className="w-1/3 bg-[#111112] border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <button className="text-gray-400 hover:text-white">
                <MoreVertical size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
              />
            </div>
            
            {/* Category Tabs */}
            <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
              {[
                { id: 'all', label: 'All', icon: MessageCircle },
                { id: 'club', label: 'Clubs', icon: Building },
                { id: 'scout', label: 'Scouts', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      activeCategory === tab.id
                        ? 'bg-[#BE3C63] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle size={48} className="mb-4" />
                <p className="text-lg font-medium">No conversations found</p>
                <p className="text-sm">Start a conversation with clubs or scouts</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700 bg-[#111112]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedConversation.participantAvatar}
                      alt={selectedConversation.participantName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-white font-semibold">{selectedConversation.participantName}</h2>
                      <p className="text-gray-400 text-sm">{selectedConversation.participantClub}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      selectedConversation.participantRole === 'club' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {selectedConversation.participantRole === 'club' ? 'Club' : 'Scout'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStar(selectedConversation.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedConversation.isStarred 
                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Star size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Video size={16} />
                    </button>
                    <button 
                      onClick={() => setShowConversationInfo(!showConversationInfo)}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
                {(messages[selectedConversation.id] || []).map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === 'current_user'}
                  />
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-gray-700 bg-[#111112]">
                <div className="flex items-end space-x-3">
                  <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63] resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#BE3C63] hover:bg-[#331C22] disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center text-gray-400">
                <MessageCircle size={64} className="mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Info Sidebar */}
        {showConversationInfo && selectedConversation && (
          <div className="w-80 bg-[#111112] border-l border-gray-700 p-6">
            <div className="text-center mb-6">
              <img
                src={selectedConversation.participantAvatar}
                alt={selectedConversation.participantName}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-white font-semibold text-lg">{selectedConversation.participantName}</h3>
              <p className="text-gray-400">{selectedConversation.participantClub}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                selectedConversation.participantRole === 'club' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                {selectedConversation.participantRole === 'club' ? 'Football Club' : 'FIFA Licensed Scout'}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedConversation.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Archive size={16} />
                  <span>Archive Conversation</span>
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Trash2 size={16} />
                  <span>Delete Conversation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;