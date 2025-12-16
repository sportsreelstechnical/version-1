import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Building, Shield } from 'lucide-react';

const clubPlans = [
  {
    name: 'Basic',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    description: 'Perfect for small local teams',
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
    color: 'orange'
  },
  {
    name: 'Standard',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    description: 'Most popular for growing clubs',
    features: [
      'Up to 25 players',
      'Full AI match analysis',
      'International scout visibility',
      'Global transfer capability',
      'Advanced statistics',
      'Priority support'
    ],
    popular: true,
    color: 'blue'
  },
  {
    name: 'Premium',
    monthlyPrice: 89.99,
    yearlyPrice: 899.99,
    description: 'Complete solution for professional clubs',
    features: [
      'Unlimited players',
      'Full AI match analysis',
      'International scout visibility',
      'Global transfer capability',
      'Sensor hardware (Coming Soon)',
      'Live match tracking',
      'Dedicated support'
    ],
    color: 'purple'
  }
];

const scoutPlans = [
  {
    name: 'Scout Plan',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    description: 'For FIFA-licensed scouts',
    features: [
      'Access to high-performance players',
      'Advanced search filters',
      'Direct club messaging',
      'Saved searches',
      'Performance notifications',
      'Priority support'
    ],
    color: 'yellow'
  }
];

const Pricing: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'clubs' | 'scouts'>('clubs');

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage;
  };

  const currentPlans = activeCategory === 'clubs' ? clubPlans : scoutPlans;

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Flexible{' '}
            <span className="text-[#BE3C63]">Subscription Plans</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your club or scouting needs
          </p>

          {/* Category Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gray-800 p-1 rounded-lg flex items-center">
              <button
                onClick={() => setActiveCategory('clubs')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors font-medium ${
                  activeCategory === 'clubs'
                    ? 'bg-[#BE3C63] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Building size={20} />
                <span>Clubs</span>
              </button>
              <button
                onClick={() => setActiveCategory('scouts')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors font-medium ${
                  activeCategory === 'scouts'
                    ? 'bg-[#BE3C63] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield size={20} />
                <span>Scouts</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className={`grid gap-8 ${
          activeCategory === 'clubs' 
            ? 'grid-cols-1 md:grid-cols-3' 
            : 'grid-cols-1 max-w-md mx-auto'
        }`}>
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-gray-900 rounded-2xl p-8 ${
                plan.popular ? 'ring-2 ring-[#BE3C63]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#BE3C63] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star size={16} className="mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                {/* Pricing Display */}
                <div className="space-y-4">
                  {/* Monthly Pricing */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Monthly</div>
                    <div className="text-3xl font-bold text-white">
                      ${plan.monthlyPrice}
                      <span className="text-lg text-gray-400 font-normal">/month</span>
                    </div>
                  </div>
                  
                  {/* Yearly Pricing */}
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-green-500 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Save {getSavings(plan.monthlyPrice, plan.yearlyPrice)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">Yearly</div>
                    <div className="text-3xl font-bold text-white">
                      ${plan.yearlyPrice}
                      <span className="text-lg text-gray-400 font-normal">/year</span>
                    </div>
                    <div className="text-sm text-green-400 mt-1">
                      ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)} saved annually
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <Check size={16} className="text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations && plan.limitations.map((limitation, idx) => (
                  <li key={idx} className="flex items-center text-gray-500">
                    <div className="w-4 h-4 mr-3 flex-shrink-0 rounded-full border border-gray-500"></div>
                    {limitation}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-[#BE3C63] hover:bg-[#331C22] text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}>
                  Start Monthly Plan
                </button>
                <button className="w-full py-3 rounded-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white">
                  Start Yearly Plan (Save {getSavings(plan.monthlyPrice, plan.yearlyPrice)}%)
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-900 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Why Choose Yearly?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg mb-4 w-fit mx-auto">
                  <div className="text-2xl font-bold text-green-400">17%</div>
                </div>
                <h4 className="text-white font-semibold mb-2">Save Money</h4>
                <p className="text-gray-400 text-sm">Get 2 months free when you pay annually</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg mb-4 w-fit mx-auto">
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                </div>
                <h4 className="text-white font-semibold mb-2">Priority Support</h4>
                <p className="text-gray-400 text-sm">Get faster response times and dedicated assistance</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 bg-opacity-20 p-4 rounded-lg mb-4 w-fit mx-auto">
                  <div className="text-2xl font-bold text-purple-400">∞</div>
                </div>
                <h4 className="text-white font-semibold mb-2">No Interruptions</h4>
                <p className="text-gray-400 text-sm">Uninterrupted service for the entire year</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;