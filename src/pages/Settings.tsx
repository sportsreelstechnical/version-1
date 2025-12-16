import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Globe, 
  Shield, 
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  Mail,
  Phone,
  Calendar,
  Plus,
  Building,
  Star,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Layout/Sidebar';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  avatar: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  playerUpdates: boolean;
  matchAnalysis: boolean;
  scoutMessages: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
}

interface Receipt {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  current?: boolean;
  userType: 'club' | 'scout';
}

const planOptions: PlanOption[] = [
  {
    id: 'club-basic',
    name: 'Basic',
    price: 19.99,
    interval: 'monthly',
    features: [
      'Up to 15 players',
      'Basic player profiles',
      'Local visibility only',
      'Community support'
    ],
    userType: 'club'
  },
  {
    id: 'club-standard',
    name: 'Standard',
    price: 49.99,
    interval: 'monthly',
    features: [
      'Up to 25 players',
      'Full AI match analysis',
      'International scout visibility',
      'Priority support'
    ],
    popular: true,
    current: true,
    userType: 'club'
  },
  {
    id: 'club-premium',
    name: 'Premium',
    price: 89.99,
    interval: 'monthly',
    features: [
      'Unlimited players',
      'Full AI match analysis',
      'Sensor hardware',
      'Dedicated support'
    ],
    userType: 'club'
  },
  {
    id: 'scout-plan',
    name: 'Scout Plan',
    price: 49.99,
    interval: 'monthly',
    features: [
      'Access to all players',
      'Advanced search filters',
      'Direct club messaging',
      'Priority support'
    ],
    userType: 'scout'
  }
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'stripe' | 'paystack' | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Manager',
    email: 'john@mancity.com',
    phone: '+44 161 444 1894',
    role: 'Club Manager',
    joinDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=200',
    timezone: 'GMT+0',
    language: 'English'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
    playerUpdates: true,
    matchAnalysis: true,
    scoutMessages: true
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'john@mancity.com',
      isDefault: false
    }
  ]);

  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: '1',
      date: '2024-05-01',
      amount: 49.99,
      description: 'Standard Plan - May 2024',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: '2',
      date: '2024-04-01',
      amount: 49.99,
      description: 'Standard Plan - April 2024',
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: '3',
      date: '2024-03-01',
      amount: 49.99,
      description: 'Standard Plan - March 2024',
      status: 'paid',
      downloadUrl: '#'
    }
  ]);

  const handleProfileUpdate = () => {
    // Handle profile update logic
    console.log('Profile updated:', profile);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle password change logic
    console.log('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handlePlanChange = (planId: string) => {
    console.log('Changing to plan:', planId);
    setShowChangePlan(false);
    alert('Plan change initiated! You will receive a confirmation email.');
  };

  const handleAddPaymentMethod = () => {
    if (!selectedPaymentProvider) {
      alert('Please select a payment provider');
      return;
    }
    
    console.log('Adding payment method:', selectedPaymentProvider, paymentForm);
    
    // Add new payment method to the list
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: paymentForm.cardNumber.slice(-4),
      brand: 'Visa', // This would be detected from card number
      expiryMonth: parseInt(paymentForm.expiryDate.split('/')[0]),
      expiryYear: parseInt('20' + paymentForm.expiryDate.split('/')[1]),
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddPayment(false);
    setSelectedPaymentProvider(null);
    setPaymentForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      email: ''
    });
    alert('Payment method added successfully!');
  };

  const availablePlans = planOptions.filter(plan => 
    plan.userType === (user?.role || 'club')
  );

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
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
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>
                
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Change Photo
                    </button>
                    <p className="text-gray-400 text-sm mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full bg-gray-600 border border-gray-600 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="GMT+0">GMT+0 (London)</option>
                      <option value="GMT+1">GMT+1 (Paris)</option>
                      <option value="GMT-5">GMT-5 (New York)</option>
                      <option value="GMT-8">GMT-8 (Los Angeles)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({...profile, language: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {/* Password Settings */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Password Requirements:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Billing & Payments</h2>
                
                {/* Current Plan */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">Standard Plan</h3>
                      <p className="text-gray-400">$49.99/month • Next billing: June 1, 2024</p>
                    </div>
                    <button 
                      onClick={() => setShowChangePlan(true)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Change Plan
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Payment Methods</h3>
                    <button 
                      onClick={() => setShowAddPayment(true)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Payment Method</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-600 p-2 rounded">
                            <CreditCard className="text-gray-400" size={20} />
                          </div>
                          <div>
                            {method.type === 'card' ? (
                              <>
                                <p className="text-white font-medium">
                                  {method.brand} ending in {method.last4}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Expires {method.expiryMonth}/{method.expiryYear}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-white font-medium">PayPal</p>
                                <p className="text-gray-400 text-sm">{method.email}</p>
                              </>
                            )}
                          </div>
                          {method.isDefault && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!method.isDefault && (
                            <button
                              onClick={() => setDefaultPaymentMethod(method.id)}
                              className="text-gray-400 hover:text-white text-sm"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => removePaymentMethod(method.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Billing History</h3>
                  <div className="space-y-3">
                    {receipts.map((receipt) => (
                      <div key={receipt.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-600 p-2 rounded">
                            <Calendar className="text-gray-400" size={20} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{receipt.description}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(receipt.date).toLocaleDateString()} • ${receipt.amount}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            receipt.status === 'paid' ? 'bg-green-600 text-white' :
                            receipt.status === 'pending' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* General Notifications */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">General Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                        { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive important alerts via SMS' },
                        { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and offers' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key as keyof NotificationSettings] ? 'bg-pink-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sports Reels Specific */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Sports Reels Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security and account updates' },
                        { key: 'playerUpdates', label: 'Player Updates', description: 'Notifications about your players' },
                        { key: 'matchAnalysis', label: 'Match Analysis', description: 'When AI analysis is complete' },
                        { key: 'scoutMessages', label: 'Scout Messages', description: 'Messages from scouts about your players' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key as keyof NotificationSettings] ? 'bg-pink-600' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Change Subscription Plan</h2>
                <button
                  onClick={() => setShowChangePlan(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative bg-gray-700 rounded-xl p-6 border-2 transition-colors ${
                      plan.current 
                        ? 'border-pink-500 bg-pink-500 bg-opacity-10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star size={14} className="mr-1" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {plan.current && (
                      <div className="absolute -top-3 right-4">
                        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-white mb-1">
                        ${plan.price}
                        <span className="text-lg text-gray-400 font-normal">/{plan.interval}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <Check size={16} className="text-green-400 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanChange(plan.id)}
                      disabled={plan.current}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.current
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-pink-600 hover:bg-pink-700 text-white'
                          : 'bg-gray-600 hover:bg-gray-500 text-white'
                      }`}
                    >
                      {plan.current ? 'Current Plan' : 'Switch to This Plan'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Plan Change Information</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Plan changes take effect immediately</li>
                  <li>• Billing is prorated for the current period</li>
                  <li>• You can upgrade or downgrade at any time</li>
                  <li>• Contact support if you need assistance</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111112] rounded-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Payment Method</h2>
                <button
                  onClick={() => {
                    setShowAddPayment(false);
                    setSelectedPaymentProvider(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {!selectedPaymentProvider ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Choose Payment Provider</h3>
                  
                  <button
                    onClick={() => setSelectedPaymentProvider('stripe')}
                    className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="text-white" size={24} />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">Stripe</div>
                        <div className="text-gray-400 text-sm">Secure card payments worldwide</div>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </button>

                  <button
                    onClick={() => setSelectedPaymentProvider('paystack')}
                    className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="text-white" size={24} />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">Paystack</div>
                        <div className="text-gray-400 text-sm">African payment solutions</div>
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedPaymentProvider === 'stripe' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      <CreditCard className="text-white" size={16} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Add {selectedPaymentProvider === 'stripe' ? 'Stripe' : 'Paystack'} Card
                    </h3>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentForm.cardholderName}
                      onChange={(e) => setPaymentForm({...paymentForm, cardholderName: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentForm.cardNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentForm.expiryDate}
                        onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {selectedPaymentProvider === 'paystack' && (
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={paymentForm.email}
                        onChange={(e) => setPaymentForm({...paymentForm, email: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                        placeholder="john@example.com"
                      />
                    </div>
                  )}

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">
                      🔒 Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => setSelectedPaymentProvider(null)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddPaymentMethod}
                      disabled={!paymentForm.cardholderName || !paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Settings;