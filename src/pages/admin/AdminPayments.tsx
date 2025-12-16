import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  CreditCard,
  Building,
  Shield,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface Payment {
  id: string;
  userId: string;
  userType: 'club' | 'scout';
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  subscriptionPlan: string;
  transactionId: string;
  date: string;
  description: string;
  nextBillingDate?: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    userId: 'club1',
    userType: 'club',
    userName: 'Manchester City FC',
    userEmail: 'billing@mancity.com',
    amount: 89.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'card',
    subscriptionPlan: 'Premium',
    transactionId: 'txn_1234567890',
    date: '2024-05-21T10:30:00Z',
    description: 'Premium Plan - Monthly Subscription',
    nextBillingDate: '2024-06-21'
  },
  {
    id: '2',
    userId: 'scout1',
    userType: 'scout',
    userName: 'John Smith',
    userEmail: 'john.smith@scout.com',
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'paypal',
    subscriptionPlan: 'Scout',
    transactionId: 'txn_0987654321',
    date: '2024-05-20T14:15:00Z',
    description: 'Scout Plan - Monthly Subscription',
    nextBillingDate: '2024-06-20'
  },
  {
    id: '3',
    userId: 'club2',
    userType: 'club',
    userName: 'Real Madrid CF',
    userEmail: 'billing@realmadrid.com',
    amount: 49.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'card',
    subscriptionPlan: 'Standard',
    transactionId: 'txn_1122334455',
    date: '2024-05-21T08:45:00Z',
    description: 'Standard Plan - Monthly Subscription',
    nextBillingDate: '2024-06-21'
  },
  {
    id: '4',
    userId: 'club3',
    userType: 'club',
    userName: 'FC Barcelona',
    userEmail: 'billing@fcbarcelona.com',
    amount: 19.99,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'card',
    subscriptionPlan: 'Basic',
    transactionId: 'txn_5566778899',
    date: '2024-05-19T16:20:00Z',
    description: 'Basic Plan - Monthly Subscription'
  },
  {
    id: '5',
    userId: 'scout2',
    userType: 'scout',
    userName: 'Maria Rodriguez',
    userEmail: 'maria.rodriguez@scout.com',
    amount: 49.99,
    currency: 'USD',
    status: 'refunded',
    paymentMethod: 'card',
    subscriptionPlan: 'Scout',
    transactionId: 'txn_9988776655',
    date: '2024-05-18T11:30:00Z',
    description: 'Scout Plan - Monthly Subscription (Refunded)'
  }
];

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesUserType = selectedUserType === 'all' || payment.userType === selectedUserType;
    const matchesPlan = selectedPlan === 'all' || payment.subscriptionPlan === selectedPlan;
    
    return matchesSearch && matchesStatus && matchesUserType && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      case 'failed': return 'bg-red-600 text-white';
      case 'refunded': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-400" />;
      case 'pending': return <Clock size={16} className="text-yellow-400" />;
      case 'failed': return <XCircle size={16} className="text-red-400" />;
      case 'refunded': return <RefreshCw size={16} className="text-gray-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={16} className="text-blue-400" />;
      case 'paypal': return <DollarSign size={16} className="text-blue-600" />;
      case 'bank_transfer': return <Building size={16} className="text-green-400" />;
      default: return <CreditCard size={16} className="text-gray-400" />;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const monthlyRevenue = payments
    .filter(p => p.status === 'completed' && new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, payment) => sum + payment.amount, 0);

  const clubRevenue = payments
    .filter(p => p.status === 'completed' && p.userType === 'club')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const scoutRevenue = payments
    .filter(p => p.status === 'completed' && p.userType === 'scout')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const plans = [...new Set(payments.map(payment => payment.subscriptionPlan))];

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Payment Management</h1>
              <p className="text-gray-400">Track and manage all platform payments</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-[#BE3C63] hover:bg-[#331C22] text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">${totalRevenue.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">Total Revenue</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Calendar className="text-blue-400" size={24} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">${monthlyRevenue.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">This Month</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <Building className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${clubRevenue.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">Club Revenue</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Shield className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${scoutRevenue.toFixed(2)}</div>
              <div className="text-gray-400 text-sm">Scout Revenue</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#111112] p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search payments..."
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
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Users</option>
                <option value="club">Clubs</option>
                <option value="scout">Scouts</option>
              </select>

              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#BE3C63]"
              >
                <option value="all">All Plans</option>
                {plans.map(plan => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>

              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Filter size={16} />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-[#111112] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr className="text-gray-300 text-sm">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Transaction ID</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Plan</th>
                    <th className="text-left p-4">Method</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Next Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            payment.userType === 'club' ? 'bg-blue-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                          }`}>
                            {payment.userType === 'club' ? (
                              <Building className={`${payment.userType === 'club' ? 'text-blue-400' : 'text-yellow-400'}`} size={16} />
                            ) : (
                              <Shield className="text-yellow-400" size={16} />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-medium">{payment.userName}</div>
                            <div className="text-gray-400 text-sm">{payment.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs font-mono">
                          {payment.transactionId}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-semibold">
                          {payment.currency} ${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.subscriptionPlan === 'Premium' ? 'bg-purple-600 text-white' :
                          payment.subscriptionPlan === 'Standard' ? 'bg-blue-600 text-white' :
                          payment.subscriptionPlan === 'Scout' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {payment.subscriptionPlan}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="text-gray-300 capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-300">
                        {payment.nextBillingDate ? new Date(payment.nextBillingDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No payments found</div>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}

          {/* Payment Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111112] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Status Distribution</h3>
              <div className="space-y-3">
                {['completed', 'pending', 'failed', 'refunded'].map(status => {
                  const count = payments.filter(p => p.status === status).length;
                  const percentage = payments.length > 0 ? (count / payments.length) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className="text-gray-300 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'pending' ? 'bg-yellow-500' :
                              status === 'failed' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-semibold w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue by Plan</h3>
              <div className="space-y-3">
                {plans.map(plan => {
                  const revenue = payments
                    .filter(p => p.status === 'completed' && p.subscriptionPlan === plan)
                    .reduce((sum, p) => sum + p.amount, 0);
                  const maxRevenue = Math.max(...plans.map(p => 
                    payments
                      .filter(payment => payment.status === 'completed' && payment.subscriptionPlan === p)
                      .reduce((sum, payment) => sum + payment.amount, 0)
                  ));
                  const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-gray-300">{plan}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-[#BE3C63]"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-semibold w-16">${revenue.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;