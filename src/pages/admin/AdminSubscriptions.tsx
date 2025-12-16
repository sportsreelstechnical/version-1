import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Edit, 
  Save, 
  X, 
  DollarSign,
  Users,
  Building,
  Shield,
  Star,
  TrendingUp,
  Check
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'club' | 'scout';
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limitations: string[];
  isActive: boolean;
  subscriberCount: number;
  revenue: number;
  description: string;
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'club-basic',
    name: 'Basic',
    type: 'club',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 15 players',
      'Basic player profiles',
      'Local visibility only',
      'Community support',
      'Basic statistics'
    ],
    limitations: [
      'No match video analysis',
      'No international scout visibility',
      'No global transfers'
    ],
    isActive: true,
    subscriberCount: 156,
    revenue: 3118.44,
    description: 'Perfect for small local teams'
  },
  {
    id: 'club-standard',
    name: 'Standard',
    type: 'club',
    price: 49.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 25 players',
      'Full AI match analysis',
      'International scout visibility',
      'Global transfer capability',
      'Advanced statistics',
      'Priority support'
    ],
    limitations: [],
    isActive: true,
    subscriberCount: 423,
    revenue: 21145.77,
    description: 'Most popular for growing clubs'
  },
  {
    id: 'club-premium',
    name: 'Premium',
    type: 'club',
    price: 89.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited players',
      'Full AI match analysis',
      'International scout visibility',
      'Global transfer capability',
      'Sensor hardware (Coming Soon)',
      'Live match tracking',
      'Dedicated support'
    ],
    limitations: [],
    isActive: true,
    subscriberCount: 234,
    revenue: 21057.66,
    description: 'Complete solution for professional clubs'
  },
  {
    id: 'scout-plan',
    name: 'Scout Plan',
    type: 'scout',
    price: 49.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Access to high-performance players',
      'Advanced search filters',
      'Direct club messaging',
      'Saved searches',
      'Performance notifications',
      'Priority support'
    ],
    limitations: [],
    isActive: true,
    subscriberCount: 189,
    revenue: 9447.11,
    description: 'For FIFA-licensed scouts'
  }
];

const AdminSubscriptions: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SubscriptionPlan>>({});

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan.id);
    setEditData(plan);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    setPlans(prev => 
      prev.map(plan => 
        plan.id === editingPlan 
          ? { ...plan, ...editData }
          : plan
      )
    );

    setEditingPlan(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditData({});
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editData.features || [])];
    newFeatures[index] = value;
    setEditData({ ...editData, features: newFeatures });
  };

  const addFeature = () => {
    setEditData({ 
      ...editData, 
      features: [...(editData.features || []), ''] 
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(editData.features || [])];
    newFeatures.splice(index, 1);
    setEditData({ ...editData, features: newFeatures });
  };

  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalSubscribers = plans.reduce((sum, plan) => sum + plan.subscriberCount, 0);
  const clubRevenue = plans.filter(p => p.type === 'club').reduce((sum, plan) => sum + plan.revenue, 0);
  const scoutRevenue = plans.filter(p => p.type === 'scout').reduce((sum, plan) => sum + plan.revenue, 0);

  const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => {
    const isEditing = editingPlan === plan.id;
    const currentData = isEditing ? editData : plan;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111112] rounded-xl p-6 relative"
      >
        {plan.name === 'Standard' && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-[#BE3C63] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
              <Star size={16} className="mr-1" />
              Most Popular
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${
              plan.type === 'club' ? 'bg-blue-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
            }`}>
              {plan.type === 'club' ? (
                <Building className={`${plan.type === 'club' ? 'text-blue-400' : 'text-yellow-400'}`} size={24} />
              ) : (
                <Shield className="text-yellow-400" size={24} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{currentData.name}</h3>
              <p className="text-gray-400 text-sm">{currentData.description}</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => handleEditPlan(plan)}
              className="text-gray-400 hover:text-white"
            >
              <Edit size={20} />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSavePlan}
                className="text-green-400 hover:text-green-300"
              >
                <Save size={20} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-400 hover:text-red-300"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-baseline space-x-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={currentData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-2xl font-bold w-24"
                />
                <span className="text-gray-400">/month</span>
              </div>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">${currentData.price}</span>
                <span className="text-gray-400">/month</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">Features</h4>
          <ul className="space-y-2">
            {(currentData.features || []).map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                {isEditing ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-300 text-sm">{feature}</span>
                )}
              </li>
            ))}
            {isEditing && (
              <li>
                <button
                  onClick={addFeature}
                  className="text-[#BE3C63] hover:text-[#331C22] text-sm"
                >
                  + Add Feature
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{plan.subscriberCount}</div>
            <div className="text-gray-400 text-sm">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">${plan.revenue.toFixed(0)}</div>
            <div className="text-gray-400 text-sm">Monthly Revenue</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded text-sm ${
            plan.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {plan.isActive ? 'Active' : 'Inactive'}
          </span>
          <div className="text-gray-400 text-sm">
            {plan.type === 'club' ? 'Club Plan' : 'Scout Plan'}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
            <p className="text-gray-400">Manage subscription plans and pricing</p>
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
              <div className="text-2xl font-bold text-white mb-1">${totalRevenue.toFixed(0)}</div>
              <div className="text-gray-400 text-sm">Total Monthly Revenue</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <Users className="text-blue-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{totalSubscribers}</div>
              <div className="text-gray-400 text-sm">Total Subscribers</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <Building className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${clubRevenue.toFixed(0)}</div>
              <div className="text-gray-400 text-sm">Club Revenue</div>
            </div>

            <div className="bg-[#111112] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                  <Shield className="text-yellow-400" size={24} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">${scoutRevenue.toFixed(0)}</div>
              <div className="text-gray-400 text-sm">Scout Revenue</div>
            </div>
          </div>

          {/* Club Plans */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Club Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.filter(plan => plan.type === 'club').map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          {/* Scout Plans */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Scout Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-md">
              {plans.filter(plan => plan.type === 'scout').map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          {/* Plan Performance */}
          <div className="bg-[#111112] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Plan Performance</h3>
            <div className="space-y-4">
              {plans.map(plan => {
                const percentage = totalSubscribers > 0 ? (plan.subscriberCount / totalSubscribers) * 100 : 0;
                return (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${
                        plan.type === 'club' ? 'bg-blue-500 bg-opacity-20' : 'bg-yellow-500 bg-opacity-20'
                      }`}>
                        {plan.type === 'club' ? (
                          <Building className="text-blue-400" size={16} />
                        ) : (
                          <Shield className="text-yellow-400" size={16} />
                        )}
                      </div>
                      <span className="text-white font-medium">{plan.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-[#BE3C63]"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">{plan.subscriberCount}</span>
                      <span className="text-gray-400 w-12 text-right">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;