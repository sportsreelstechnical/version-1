import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Book,
  Video,
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
}

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I add players to my club?',
    answer: 'To add players, go to Player Management and click the "Add Player" button. Fill in the required information including name, position, age, and other details. Each player will be assigned a unique FIFA ID.',
    category: 'Player Management'
  },
  {
    id: '2',
    question: 'What video formats are supported for match uploads?',
    answer: 'We support MP4, MOV, and AVI formats. Maximum file size is 2GB. For best results, use 1080p resolution with H.264 encoding.',
    category: 'Match Upload'
  },
  {
    id: '3',
    question: 'How does AI analysis work?',
    answer: 'Our AI analyzes uploaded match videos to extract player statistics, generate heat maps, and provide tactical insights. Analysis typically takes 15-30 minutes depending on video length.',
    category: 'AI Analysis'
  },
  {
    id: '4',
    question: 'Can I upgrade or downgrade my subscription?',
    answer: 'Yes, you can change your subscription plan at any time from the Settings > Billing section. Changes take effect immediately, and billing is prorated.',
    category: 'Billing'
  },
  {
    id: '5',
    question: 'How do scouts find my players?',
    answer: 'Players are visible to scouts based on your subscription plan. Standard and Premium plans allow global visibility, while Basic plan limits visibility to your continent.',
    category: 'Scouting'
  },
  {
    id: '6',
    question: 'What happens if I exceed my player limit?',
    answer: 'If you reach your plan\'s player limit, you\'ll need to upgrade your subscription or remove existing players before adding new ones.',
    category: 'Player Management'
  }
];

const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    subject: 'Video upload failing',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-05-20',
    lastUpdate: '2024-05-21'
  },
  {
    id: 'TICK-002',
    subject: 'Player not visible to scouts',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-05-18',
    lastUpdate: '2024-05-19'
  }
];

const Support: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });

  const categories = ['all', 'Player Management', 'Match Upload', 'AI Analysis', 'Billing', 'Scouting'];

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({
      subject: '',
      category: '',
      priority: 'medium',
      message: ''
    });
    alert('Support ticket created successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="text-yellow-400" size={16} />;
      case 'in-progress': return <AlertCircle className="text-blue-400" size={16} />;
      case 'resolved': return <CheckCircle className="text-green-400" size={16} />;
      case 'closed': return <CheckCircle className="text-gray-400" size={16} />;
      default: return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-600 text-white';
      case 'in-progress': return 'bg-blue-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact Support', icon: MessageCircle },
    { id: 'tickets', label: 'My Tickets', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Book }
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Support Center</h1>
            <p className="text-gray-400">Get help and find answers to your questions</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <HelpCircle className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{mockFAQs.length}</div>
              <div className="text-gray-400 text-sm">FAQ Articles</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <MessageCircle className="text-green-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support Available</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Clock className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">&lt; 2h</div>
              <div className="text-gray-400 text-sm">Avg Response Time</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-pink-500 bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="text-pink-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-400 text-sm">Resolution Rate</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-xl p-6">
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

          {/* Tab Content */}
          <div className="bg-gray-800 rounded-xl p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
                
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-gray-700 rounded-lg">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-600 transition-colors rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{faq.question}</h3>
                          <span className="text-pink-400 text-sm">{faq.category}</span>
                        </div>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="text-gray-400" size={20} />
                        ) : (
                          <ChevronRight className="text-gray-400" size={20} />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No FAQs found</div>
                    <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Contact Support</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Submit a Support Ticket</h3>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                          <select
                            value={contactForm.category}
                            onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing</option>
                            <option value="account">Account</option>
                            <option value="feature">Feature Request</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Priority</label>
                          <select
                            value={contactForm.priority}
                            onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                        <textarea
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          rows={6}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                          placeholder="Please describe your issue in detail..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send size={20} />
                        <span>Submit Ticket</span>
                      </button>
                    </form>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Other Ways to Reach Us</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
                          <div className="bg-pink-600 p-3 rounded-lg">
                            <Mail className="text-white" size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">Email Support</h4>
                            <p className="text-gray-400">support@sportsreels.com</p>
                            <p className="text-gray-500 text-sm">Response within 2 hours</p>
                          </div>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
                          <div className="bg-pink-600 p-3 rounded-lg">
                            <Phone className="text-white" size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">Phone Support</h4>
                            <p className="text-gray-400">+1 (555) 123-4567</p>
                            <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM EST</p>
                          </div>
                        </div>

                        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
                          <div className="bg-pink-600 p-3 rounded-lg">
                            <MessageCircle className="text-white" size={20} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">Live Chat</h4>
                            <p className="text-gray-400">Available 24/7</p>
                            <button className="text-pink-400 hover:text-pink-300 text-sm">
                              Start Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Before Contacting Support</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Check our FAQ section for quick answers</li>
                        <li>• Include your account email and club name</li>
                        <li>• Provide screenshots if applicable</li>
                        <li>• Describe steps to reproduce the issue</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* My Tickets Tab */}
            {activeTab === 'tickets' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">My Support Tickets</h2>
                
                <div className="space-y-4">
                  {mockTickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-700 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold">{ticket.subject}</h3>
                            <span className="text-gray-400 text-sm">#{ticket.id}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(ticket.status)}
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                            </span>
                          </div>
                        </div>
                        <button className="text-pink-400 hover:text-pink-300 text-sm">
                          View Details
                        </button>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>Last Update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {mockTickets.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-lg mb-4">No support tickets</div>
                    <p className="text-gray-500">You haven't submitted any support tickets yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Help Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4">
                      <Book className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">User Guide</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Complete guide to using Sports Reels platform
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      Read Guide →
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-green-600 p-3 rounded-lg w-fit mb-4">
                      <Video className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Video Tutorials</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Step-by-step video tutorials for all features
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      Watch Videos →
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-purple-600 p-3 rounded-lg w-fit mb-4">
                      <FileText className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">API Documentation</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Technical documentation for developers
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      View Docs →
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-yellow-600 p-3 rounded-lg w-fit mb-4">
                      <HelpCircle className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Getting Started</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Quick start guide for new users
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      Get Started →
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-red-600 p-3 rounded-lg w-fit mb-4">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Community Forum</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Connect with other users and share tips
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      Join Forum →
                    </button>
                  </div>

                  <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="bg-pink-600 p-3 rounded-lg w-fit mb-4">
                      <FileText className="text-white" size={24} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Release Notes</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Latest updates and new features
                    </p>
                    <button className="text-pink-400 hover:text-pink-300 text-sm">
                      View Updates →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;