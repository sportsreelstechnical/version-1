import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Building,
  Shield,
  Calendar,
  Eye,
  MessageSquare,
  Archive,
  Trash2,
  Star,
  Flag,
  Send
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface SupportTicket {
  id: string;
  userId: string;
  userType: 'club' | 'scout';
  userName: string;
  userEmail: string;
  subject: string;
  category: 'technical' | 'billing' | 'account' | 'feature' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  description: string;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'user' | 'admin';
    content: string;
    timestamp: string;
    attachments?: string[];
  }>;
  tags: string[];
  isStarred: boolean;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    userId: 'club1',
    userType: 'club',
    userName: 'Manchester City FC',
    userEmail: 'support@mancity.com',
    subject: 'Video upload failing repeatedly',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: '2024-05-21T10:30:00Z',
    updatedAt: '2024-05-21T14:15:00Z',
    assignedTo: 'Admin User',
    description: 'We are experiencing issues uploading match videos. The upload process starts but fails at around 50% completion.',
    messages: [
      {
        id: 'msg1',
        senderId: 'club1',
        senderName: 'Manchester City FC',
        senderType: 'user',
        content: 'We are experiencing issues uploading match videos. The upload process starts but fails at around 50% completion.',
        timestamp: '2024-05-21T10:30:00Z'
      },
      {
        id: 'msg2',
        senderId: 'admin1',
        senderName: 'Admin User',
        senderType: 'admin',
        content: 'Thank you for reporting this issue. Can you please tell me the file size and format of the video you\'re trying to upload?',
        timestamp: '2024-05-21T14:15:00Z'
      }
    ],
    tags: ['video-upload', 'technical'],
    isStarred: true
  },
  {
    id: 'TICK-002',
    userId: 'scout1',
    userType: 'scout',
    userName: 'John Smith',
    userEmail: 'john.smith@scout.com',
    subject: 'Billing issue with subscription',
    category: 'billing',
    priority: 'medium',
    status: 'new',
    createdAt: '2024-05-21T09:15:00Z',
    updatedAt: '2024-05-21T09:15:00Z',
    description: 'I was charged twice for my monthly subscription. Please help resolve this billing issue.',
    messages: [
      {
        id: 'msg3',
        senderId: 'scout1',
        senderName: 'John Smith',
        senderType: 'user',
        content: 'I was charged twice for my monthly subscription. Please help resolve this billing issue.',
        timestamp: '2024-05-21T09:15:00Z'
      }
    ],
    tags: ['billing', 'duplicate-charge'],
    isStarred: false
  },
  {
    id: 'TICK-003',
    userId: 'club2',
    userType: 'club',
    userName: 'Real Madrid CF',
    userEmail: 'tech@realmadrid.com',
    subject: 'Player not visible to scouts',
    category: 'account',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-05-20T16:45:00Z',
    updatedAt: '2024-05-21T11:30:00Z',
    assignedTo: 'Admin User',
    description: 'One of our players is not appearing in scout searches despite having an active profile.',
    messages: [
      {
        id: 'msg4',
        senderId: 'club2',
        senderName: 'Real Madrid CF',
        senderType: 'user',
        content: 'One of our players is not appearing in scout searches despite having an active profile.',
        timestamp: '2024-05-20T16:45:00Z'
      },
      {
        id: 'msg5',
        senderId: 'admin1',
        senderName: 'Admin User',
        senderType: 'admin',
        content: 'I\'m looking into this issue. Can you provide the player\'s FIFA ID?',
        timestamp: '2024-05-21T11:30:00Z'
      }
    ],
    tags: ['player-visibility', 'search'],
    isStarred: false
  },
  {
    id: 'TICK-004',
    userId: 'scout2',
    userType: 'scout',
    userName: 'Maria Rodriguez',
    userEmail: 'maria.rodriguez@scout.com',
    subject: 'Feature request: Advanced search filters',
    category: 'feature',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-05-18T14:20:00Z',
    updatedAt: '2024-05-20T10:45:00Z',
    assignedTo: 'Admin User',
    description: 'Would like to request additional search filters for player discovery.',
    messages: [
      {
        id: 'msg6',
        senderId: 'scout2',
        senderName: 'Maria Rodriguez',
        senderType: 'user',
        content: 'Would like to request additional search filters for player discovery.',
        timestamp: '2024-05-18T14:20:00Z'
      },
      {
        id: 'msg7',
        senderId: 'admin1',
        senderName: 'Admin User',
        senderType: 'admin',
        content: 'Thank you for the suggestion. We\'ve added this to our feature roadmap.',
        timestamp: '2024-05-20T10:45:00Z'
      }
    ],
    tags: ['feature-request', 'search-filters'],
    isStarred: false
  }
];

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600 text-white';
      case 'open': return 'bg-yellow-600 text-white';
      case 'in_progress': return 'bg-purple-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle size={16} className="text-blue-400" />;
      case 'open': return <Clock size={16} className="text-yellow-400" />;
      case 'in_progress': return <MessageCircle size={16} className="text-purple-400" />;
      case 'resolved': return <CheckCircle size={16} className="text-green-400" />;
      case 'closed': return <Archive size={16} className="text-gray-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message = {
      id: `msg-${Date.now()}`,
      senderId: 'admin1',
      senderName: 'Admin User',
      senderType: 'admin' as const,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, message],
              updatedAt: new Date().toISOString(),
              status: ticket.status === 'new' ? 'open' : ticket.status
            }
          : ticket
      )
    );

    if (selectedTicket) {
      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        status: prev.status === 'new' ? 'open' : prev.status
      } : null);
    }

    setNewMessage('');
  };

  const toggleStar = (ticketId: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, isStarred: !ticket.isStarred }
          : ticket
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Support Management</h1>
              <p className="text-gray-400">Manage customer support tickets and inquiries</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <MessageCircle className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{tickets.length}</div>
              <div className="text-gray-400 text-sm">Total Tickets</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {tickets.filter(t => t.status === 'new' || t.status === 'open').length}
              </div>
              <div className="text-gray-400 text-sm">Open Tickets</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg">
                  <Flag className="text-red-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
              </div>
              <div className="text-gray-400 text-sm">High Priority</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
              <div className="text-gray-400 text-sm">Resolved Today</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#111112] p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63]"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-[#111112] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr className="text-gray-300 text-sm">
                    <th className="text-left p-4">Ticket</th>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Priority</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Updated</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleStar(ticket.id)}
                            className={`${ticket.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
                          >
                            <Star size={16} />
                          </button>
                          <div>
                            <div className="text-white font-medium">{ticket.id}</div>
                            <div className="text-gray-400 text-sm truncate max-w-xs">{ticket.subject}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            ticket.userType === 'club' ? 'bg-blue-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                          }`}>
                            {ticket.userType === 'club' ? (
                              <Building className="text-blue-400" size={16} />
                            ) : (
                              <Shield className="text-yellow-400" size={16} />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{ticket.userName}</div>
                            <div className="text-gray-400 text-sm">{ticket.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs capitalize">
                          {ticket.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewTicket(ticket)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="text-green-400 hover:text-green-300">
                            <MessageSquare size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <Archive size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No tickets found</div>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTicket.id}: {selectedTicket.subject}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTicket.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                    </span>
                    <span className="text-gray-400 text-sm">
                      Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-[#BE3C63]"
                  >
                    <option value="new">New</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => setShowTicketDetails(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedTicket.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                      message.senderType === 'admin' 
                        ? 'bg-[#BE3C63] text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-sm">{message.senderName}</span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex space-x-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#BE3C63] resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#BE3C63] hover:bg-[#331C22] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;