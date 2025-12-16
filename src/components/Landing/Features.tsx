import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, Search, Video, Shield, BarChart } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'FIFA ID Tracking',
    description: 'Track and manage players with unique FIFA ID system for global recognition and verification.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI algorithms analyze player performance, providing detailed insights and recommendations.'
  },
  {
    icon: Search,
    title: 'Global Scouting',
    description: 'Discover talent worldwide with advanced filtering and search capabilities for scouts.'
  },
  {
    icon: Video,
    title: 'Match Archives',
    description: 'Upload and analyze match videos with comprehensive player statistics and heat maps.'
  },
  {
    icon: Shield,
    title: 'Comprehensive Profiles',
    description: 'Detailed player profiles with career statistics, performance metrics, and transfer history.'
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'In-depth analytics dashboard with real-time insights and performance tracking.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Powerful Platform for{' '}
            <span className="text-[#BE3C63]">Football Clubs</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive tools for player management, performance analysis, and talent discovery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <div className="bg-[#BE3C63] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;